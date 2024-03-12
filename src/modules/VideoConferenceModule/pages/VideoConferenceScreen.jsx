/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import Footer from "../../../components/footer/Footer";
import { useNavigate, useParams } from 'react-router-dom';

import LandingImage from "../../../assets/new_meet/zoomcreate.svg";
import Scheduled from "../../../assets/meet_status/scheduled.svg";
import Error from '../../../assets/error/error.svg'
import ErrorPage from "../../../components/error/ErrorPage";
import CountdownTimer from "../../../components/time_counter/TimeCounter";
import { FaDoorOpen, FaGrinTears, FaMicrophone, FaMicrophoneSlash, FaSmile, FaUser, FaVideo, FaVideoSlash } from "react-icons/fa";
import mongoose, {  } from "mongoose";
import { MdAddReaction, MdChatBubble, MdFrontHand, MdOutlineExpandLess, MdOutlineExpandMore, MdScreenShare, MdThumbUp, MdWavingHand } from "react-icons/md";
import Cookie from 'js-cookie';
import AgoraRTC from "agora-rtc-sdk-ng";
import BASE_URL from "../../../api/base_url";
import CustomFullScreenAgoraLocalVideo from "../module-elements/FullScreenAgoraLocalVideo";
import ParticipantsSidebar from "../module-elements/ParticipantSidebar";
import Sidebar from "../module-elements/Sidebar";
import agoraSetting from "../utils/AgoraConfig";
import { agoraClient } from "../utils/AgoraConfig";
import CustomAgoraVideo from "../module-elements/CustomAgoraVideo";
import CustomAgoraLocalVideo from "../module-elements/CustomAgoraLocalVideo";
import ReactionPopUp from "../module-elements/ReactionPopup";
import LoadingOverlay from "../module-elements/LoadingOverlayStatus";
import CustomFullScreenAgoraVideo from "../module-elements/FullScreenAgoraVideo";
import JoinBox from "../module-elements/JoinBox";
import AccessPopUp from "../module-elements/AccessPopup";
import { roomChannel } from "../utils/AblyConfig";
import { verifyToken } from "../utils/AgoraConfig";
import {v4 as uuidv4} from "uuid";

const RoomPage = () =>{
    const {id:roomId} = useParams();
    const [room, setRoom] = useState(null);
    const [isError, setError] = useState(false); 
    const [errorMessage, setErrorMessage] = useState("");
    const [statusCode, setStatusCode] = useState("500");
    const [loading,setLoading] = useState(true);
    const [status, setStatus] = useState('scheduled');
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [dapatIzin, setDapatIzin] = useState(false);
    const [isJoinBoxOpen, setJoinBoxOpen] = useState(false);
    const [kembaliJoin, setKembaliJoin] = useState(false);
    const mediaRef = useRef(null);
    const [screen, setScreen] = useState('lobby');
    const [me, setMe] = useState(null)
    const [cookie, setCookie] = useState(null);
    const [streamData, setStreamData] = useState({});
    const [rtcToken, setRtcToken] = useState({});
    const [screenrtcToken, setScreenRtcToken] = useState({});
    const [updatePermissionStatus, setUpdatePermissionStatus] = useState(false);
    const [localStreams, setLocalStreams] = useState(null)
    const [participants,setParticipants] = useState([]);
    const [firstTime, setFirstTime] = useState(true);
    const [notifier, setNotifier] = useState(false);
    const [selectedOptionChat, setSelectedOptionChat] = useState('all');
    const [unreadMessages, setUnreadMessages] = useState(0);
    const [isPermissionGranted, setIsPermissionGranted] = useState(false);
    const [isShareScreen, setIsShareScreen] = useState(false);
    const [screenStream, setScreenStream] = useState(null);
    const [remoteScreenStream, setRemoteScreenStream] = useState(null);
    const [screenClient, setScreenClient] = useState(null)
    const [setup,setSetup] = useState(false)
    const [isCameraGranted, setCameraGranted] = useState(false);
    const [isAudioGranted, setAudioGranted] = useState(false);
    const [loadingOverlayState, setLoadingOverlayState] = useState(false);

    const [localMutedParticipantsAudio, setLocalMutedParticipantsAudio] = useState([]);
    const [localMutedParticipantsVideo, setLocalMutedParticipantsVideo] = useState([]);
    console.log('ini list banned video ', localMutedParticipantsVideo)
    console.log('ini list banned audio ', localMutedParticipantsAudio)

    const handleStartShareScreen = async () =>{
      toast("mencoba screen share")
      if(remoteScreenStream){
        return toast.error('Maaf, pengguna lain sedang membagikan layarnya', {autoClose:2000})
      }
      const shareScreenClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
      try {
        await shareScreenClient.join(agoraSetting.AGORA_APP_ID, roomId, screenrtcToken, me._id+"-screenshare");
        const newScreenStream = await AgoraRTC.createScreenVideoTrack();
        await shareScreenClient.publish(newScreenStream);
        setScreenStream(newScreenStream);
        setIsShareScreen(true)
        setScreenClient(shareScreenClient)
      } catch (error) {
        console.log(error)
        await shareScreenClient.leave()
        toast.error('Maaf, terjadi kesalahan dalam membagikan layar', {autoClose:2000})
      }
    }

    const handleCloseShareScreen = async () =>{
      try {
        if(screenStream){
          await screenStream.close()
          setScreenStream(null)
        }
        if(screenClient){
          await screenClient.leave()
          setScreenClient(null)
        }
        setIsShareScreen(false)
        toast.success('Berhasil menghentikan pembagian layar', {autoClose:2000})
      } catch (error) {
        console.log(error)
        toast.error('Maaf, terjadi kesalahan dalam memnghentikan pembagian layar', {autoClose:2000})
      }
    }

    const userScreenStreamConfig = {
      isShareScreen: isShareScreen,
      screenStream: screenStream,
      screenClient: screenClient,
      remoteScreenStream: remoteScreenStream
    }
    
    const requestPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        setIsPermissionGranted(true)
        // Izin diberikan, lanjutkan dengan penggunaan mikrofon dan kamera.
      } catch (error) {
        // Izin ditolak atau terjadi kesalahan, tangani sesuai kebutuhan Anda.
        setIsPermissionGranted(false)
      }
    }

    const notify = () =>{
      setNotifier(prev => !prev);
    }

    const checkIsUserExist = (id) =>{
      const existed = participants.find(participant => participant.participantId === id);
      if(!existed){
        return false
      }
      return true
    }
    useEffect(()=>{
        
        const fetchRoom = async () =>{
            setLoading(true)
            try {
                const res = await axios.get(BASE_URL+`/video/${roomId}`);
                setRoom(res.data.room)
                setLoading(false)
                console.log(res)
            } catch (error) {
               // console.log(error)
                try {
                    const errorMessage = error.response.data.message;
                    setError(true)
                    setLoading(false)
                    setStatusCode(error.response.status)
                    setErrorMessage(errorMessage)
                } catch (err) {
                    setError(true)
                    setLoading(false)
                    setStatusCode("500")
                    setErrorMessage("Maaf Server sedang tidak aktif");
                }
            }
        }
        fetchRoom();
        
    }, [])

    useEffect(()=>{
      console.log("subscribe terhadap perubahan real-time...")
      roomChannel.subscribe('update-room', (message)=>{
        if(!message.data){
          console.log("Data kosong sehingga tidak ada yang perlu dikerjakan")
          return
        }
      console.log("room terupdate-> ",message.data)

       const {room:newRoom,roomId:remoteRoomId} = message.data;
       if(roomId != remoteRoomId){
        console.log("room yang diupdate bukan room saat ini") // (chat.receiver == (me._id??'abcdefghijklmn'))
        return
       }
       const prevRoom = room;
       const unreadMessagesCounter = newRoom.chats.filter((chat)=> ((chat.receiver == null && chat.sender != me?._id  )|| (chat.receiver == "all" && chat.sender !== me?._id) || ( checkIsUserExist(chat.sender) && chat.receiver == (me._id??'abcdefghijklmn')) )).length - (prevRoom == null ? 0 : prevRoom.chats.filter((chat)=> ((chat.receiver == null && chat.sender != me?._id )|| (chat.receiver == "all" && chat.sender !== me?._id) || ( checkIsUserExist(chat.sender) && chat.receiver == (me?._id??'abcdefghijklmn')) )).length);
       try {
        
        if(newRoom.chats.length >= 1){
          if(newRoom.chats[newRoom.chats.length - 1].sender != (!me? '': me._id)){
            setUnreadMessages(prev => unreadMessagesCounter)
           }
        }
       } catch (error) {
        console.log(error)
       }
       setRoom(newRoom);
      })
      return () => {
        roomChannel.unsubscribe('update-room');
      }
    },[])

    useEffect(()=>{
      const initial = async()=>{
        setLoading(true)
        try {
        const token = Cookie.get(`room-${roomId}-session`);
        console.log(token)
        if(!token){
          setLoading(false)
          return
        }
        if (verifyToken(token)){
          setKembaliJoin(true)
          setCookie(token)
        }
        setLoading(false)
        } catch (error) {
          setCookie(null)
          console.log('ini error loh')
          setLoading(false)
        }
      }
        if(room ){
            setStatus(room.status)
            if(room.status == 'actived'){
              initial()
            }
        }
    },[ room ])

    useEffect(() => {
      // perbaiki ini
        if(me){
          return
        }
        const getMediaStream = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: isVideoEnabled,
            audio: isAudioEnabled // Gunakan state video
            // Gunakan state audio
          });
          
          // Menghubungkan aliran media ke elemen video dan audio
          if (mediaRef.current ) {
            mediaRef.current.srcObject =stream;
          }
          setDapatIzin(true)
          setIsPermissionGranted(true)
        } catch (error) {
          console.error('Error accessing media devices:', error);
        }
      };
    
      getMediaStream();
    }, [isAudioEnabled, isVideoEnabled, me, updatePermissionStatus]);
    

    useEffect(()=>{
      if(participants){
        const newParticipants = [...participants];
        newParticipants.sort((first, second)=>{
          const firstHasReaction = room.participants[first.participantId] ?  (room.participants[first.participantId].reaction == 'no-reaction'? 0 : 5):0
          const secondHasReaction = room.participants[second.participantId] ?  (room.participants[second.participantId].reaction == 'no-reaction'? 0 : 5):0
          const isFirstAudioEnabled = first.isAudioEnabled? 1 : 0;
          const isFirstVideoEnabled = first.isVideoEnabled? 1 : 0;

          const isSecondAudioEnabled = second.isAudioEnabled? 1 : 0;
          const isSecondVideoEnabled = second.isVideoEnabled? 1 : 0;

          const firstVal = isFirstAudioEnabled + isFirstVideoEnabled + firstHasReaction;
          const secondVal = isSecondAudioEnabled + isSecondVideoEnabled + secondHasReaction;
          if(firstVal > secondVal){
            return -1;
          }
          else if(firstVal < secondVal){
            return 1;
          }
          return 0;
          
        })
    
        setParticipants(newParticipants) 
   }
    },[notifier])

    const findParticipantInList = (userId, mode) => {
      
      console.log('ini userId terkait ', userId)
      if(mode == 'VIDEO'){
        const find = localMutedParticipantsVideo.find((id)=> id === userId);
        if(!find){
          return false;
        }
        return true;
      }
      else if(mode == 'AUDIO'){
        const find = localMutedParticipantsAudio.find((id)=> id === userId);
        if(!find){
          return false;
        }
        return true;
      }
    }

    

    useEffect(()=>{
      if(setup){
        if(isVideoEnabled){
          hidupkanVideo()
        }
        else{
          matikanVideo()
        }
        if(isAudioEnabled){
          hidupkanAudio()
        }
        else{
          matikanAudio()
        }
        
      }
      setSetup(false)
    },[setup] )
    useEffect(()=>{
      if(! isPermissionGranted){
        requestPermission()
      }
      if(!me) {
        return
      }
      
      console.log('start my journey...')
      
      const init = async () => {
        
        agoraClient.on("user-published", async (user, mediaType) => {
          await agoraClient.subscribe(user, mediaType);
          console.log("subscribe success");
          if(user.uid.toString().endsWith("-screenshare")){
            setRemoteScreenStream(user.videoTrack)
            setIsShareScreen(true)
            user.videoTrack?.play()
            return;
          }

          console.log('SINI SINI SINI')
      
          if (mediaType === "video" || mediaType === "audio") {
            setParticipants((prevParticipants) => {
              // Memeriksa apakah partisipan sudah ada dalam daftar
              const existingParticipant = prevParticipants.find(
                (participant) => participant.participantId === user.uid
              );
      
              // Jika belum ada, tambahkan partisipan baru
              if (!existingParticipant) {
                return [
                  ...prevParticipants,
                  {
                    user: user,
                    participantId: user.uid,
                    data: user.dataChannels,
                    videoTrack:  user.videoTrack,
                    audioTrack: user.audioTrack,
                    isAudioEnabled: user.hasAudio,
                    isVideoEnabled: user.hasVideo,
                  },
                ];
              }
      
              // Jika sudah ada, perbarui data partisipan yang ada
              return prevParticipants.map((participant) =>
                participant.participantId === user.uid
                  ? {
                      ...participant,
                      videoTrack:   user.videoTrack,
                      audioTrack:  user.audioTrack,
                      isAudioEnabled: user.hasAudio,
                      isVideoEnabled: user.hasVideo,
                    }
                  : participant
              );
            });
          }
      
          if (mediaType === "audio") {
            if(!findParticipantInList(user.uid, 'AUDIO')){
              await user.audioTrack?.play();
            }
          }
          if(mediaType === "video") {
            if(!findParticipantInList(user.uid, 'VIDEO')){
              await user.videoTrack?.play();
            }
          }
          notify()
        });
      
        // Memasang event listener ketika pengguna lain menghentikan publikasi media
        agoraClient.on("user-unpublished", async (user, type) => {
          console.log("unpublished ", user, type);
        //  await agoraClient.unsubscribe(user, type)
        
        if(user.uid.toString().endsWith("-screenshare")){
          handleCloseShareScreen()
          return;
        }

          if (type === "audio" && user.audioTrack) {
           user.audioTrack.stop();

          }
          if (type === "video" && user.videoTrack) {
            user.videoTrack.stop();
           }
           setParticipants((prevParticipants) => {
            return prevParticipants.map((participant) =>
            participant.participantId === user.uid
              ? {
                  ...participant,
                  videoTrack:  user.videoTrack,
                  audioTrack:  user.audioTrack ,
                  isAudioEnabled: type === "audio"? false : participant.isAudioEnabled,
                  isVideoEnabled: type === "video"? false : participant.isVideoEnabled,
                }
              : participant
          );
           })
           notify();
        });
      
        // Memasang event listener ketika pengguna meninggalkan sesi
        agoraClient.on("user-left", async (user) => {
          console.log("leaving ", user.uid);
          if(user.uid.toString().endsWith("-screenshare")){
            setRemoteScreenStream(null)
            setIsShareScreen(false)
            user.videoTrack?.stop()
            user.leave();
            return;
          }
          setParticipants((prevParticipants) =>
            prevParticipants.filter((participant) => participant.participantId !== user.uid)
          );
          notify();
          user.leave()
        });

        agoraClient.on("user-joined", async(user)=>{
          console.log('join: ',user)
          if(user.uid.toString().endsWith("-screenshare")){
            setRemoteScreenStream(user.videoTrack)
            setIsShareScreen(true)
            user.videoTrack?.play()
            return;
          }
          setParticipants((prevParticipants) => {
            // Memeriksa apakah partisipan sudah ada dalam daftar
            const existingParticipant = prevParticipants.find(
              (participant) => participant.participantId === user.uid
            );
    
            // Jika belum ada, tambahkan partisipan baru
            if (!existingParticipant) {
              return [
                ...prevParticipants,
                {
                  user: user,
                  participantId: user.uid,
                  data: user.dataChannels,
                  videoTrack: user.videoTrack,
                  audioTrack: user.audioTrack,
                  isAudioEnabled: user.hasAudio,
                  isVideoEnabled: user.hasVideo,
                },
              ];
            }
    
            // Jika sudah ada, perbarui data partisipan yang ada
            return prevParticipants.map((participant) =>
              participant.participantId === user.uid
                ? {
                    ...participant,
                    videoTrack:  user.videoTrack,
                    audioTrack:  user.audioTrack ,
                    isAudioEnabled: user.hasAudio,
                    isVideoEnabled: user.hasVideo,
                  }
                : participant
            );
          });
          notify();
        })

        agoraClient.on('user-info-updated', async(user)=>{
          console.log('user info updated ',user)
          notify()
        })
        agoraClient.on('published-user-list', async (user)=>{
          console.log('published user list ',user)
          notify()
        })

        // Bergabung ke sesi Agora dengan token dan ID yang sesuai
        if(agoraClient.connectionState !== 'CONNECTED'){
          try {
            const res = await agoraClient.join(agoraSetting.AGORA_APP_ID, roomId, rtcToken, me._id);
            setIsPermissionGranted(true)
            console.log('aku join ', res)
          } catch (error) {
            console.log(error)
            toast.error('Unauthorized. Sudah ada yang menggunakan previlege ini',{autoClose:2000});
            setErrorMessage('Maaf akses ini sedang digunakan user lain');
            setError(true)
            setStatusCode('401')
          }
        
        }
        let audioTrack = null;
        try {
          audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
          setIsPermissionGranted(true)
          setAudioGranted(true)
        } catch (error) {
          console.log(error)
        }
        
        let videoTrack = null;
        try {
          videoTrack = await AgoraRTC.createCameraVideoTrack();
          setIsPermissionGranted(true)
          setCameraGranted(true)
        } catch (error) {
          console.log(error)
          console.log('gw error disini bener dehh')
        }
        
        try {
          console.log('ini audio track: ' , audioTrack);
          console.log('ini video track: ', videoTrack);
          console.log('Ini audio saya: ', audioTrack, ' Ini video saya: ', videoTrack)
          try {
            await agoraClient.publish(audioTrack);
          } catch (error) {
            console.log('Terdapat kesalahan dalam melakukan publish terhadap audio')
          }
          try {
            await agoraClient.publish(videoTrack);
          } catch (error) {
            console.log('Terdapat kesalahan dalam melakukan publish terhadap video')
          }
          setLocalStreams({
            audioTrack: audioTrack,
            videoTrack: videoTrack
          })
          console.log('aku disini kawannn')
        } catch (error) {
          console.log('WADUH ERROR BRO')
          console.log(error)
        }
      };
    init().then((res)=>{
      setSetup(true)
    });
    console.log('UPPPPPP')    
    }, [me, updatePermissionStatus])

useEffect(()=>{
  if(!me){
    return
  }
  agoraClient.on("user-published", async (user, mediaType) => {
    await agoraClient.subscribe(user, mediaType);
    console.log("subscribe success");
    if(user.uid.toString().endsWith("-screenshare")){
      setRemoteScreenStream(user.videoTrack)
      setIsShareScreen(true)
      user.videoTrack?.play()
      return;
    }

    console.log('SINI SINI SINI')

    if (mediaType === "video" || mediaType === "audio") {
      setParticipants((prevParticipants) => {
        // Memeriksa apakah partisipan sudah ada dalam daftar
        const existingParticipant = prevParticipants.find(
          (participant) => participant.participantId === user.uid
        );

        // Jika belum ada, tambahkan partisipan baru
        if (!existingParticipant) {
          return [
            ...prevParticipants,
            {
              user: user,
              participantId: user.uid,
              data: user.dataChannels,
              videoTrack: findParticipantInList(user.uid, 'VIDEO')? null : user.videoTrack,
              audioTrack: findParticipantInList(user.uid, 'AUDIO')? null :user.audioTrack,
              isAudioEnabled: user.hasAudio,
              isVideoEnabled: user.hasVideo,
            },
          ];
        }

        // Jika sudah ada, perbarui data partisipan yang ada
        return prevParticipants.map((participant) =>
          participant.participantId === user.uid
            ? {
                ...participant,
                videoTrack: findParticipantInList(user.uid, 'VIDEO')? null : user.videoTrack,
                audioTrack: findParticipantInList(user.uid, 'AUDIO')? null :user.audioTrack,
                isAudioEnabled: user.hasAudio,
                isVideoEnabled: user.hasVideo,
              }
            : participant
        );
      });
    }

    if (mediaType === "audio") {
      if(!findParticipantInList(user.uid, 'AUDIO')){
        await user.audioTrack?.play();
      }
    }
    if(mediaType === "video") {
      if(!findParticipantInList(user.uid, 'VIDEO')){
        await user.videoTrack?.play();
      }
    }
    notify()
  });
},[me,localMutedParticipantsAudio,localMutedParticipantsVideo])

const matikanVideo = async () => {
    if(mediaRef.current && !me){
       mediaRef.current.srcObject?.getVideoTracks().forEach((track) => {
        track.enabled = false;
      });
    }
    if(me){
      if(localStreams.videoTrack){
        await localStreams.videoTrack.setEnabled(false);
      }
    }
    setIsVideoEnabled(false)
  //  setUpdatePermissionStatus(prev => !prev);
    publishController(me, 'VIDEO', false)
}

const hidupkanVideo = async () => {
    if(mediaRef.current && !me){
       mediaRef.current.srcObject?.getVideoTracks().forEach((track) => {
        track.enabled = true;
      });
    }
    if(me){
      if(localStreams.videoTrack){
        await localStreams.videoTrack.setEnabled(true);
      }
    }
    setIsVideoEnabled(true)
  //  setUpdatePermissionStatus(prev => !prev);
  publishController(me, 'VIDEO', true)
}

const joinWithCookie = async () => {
  try {
    const res = await axios.post(BASE_URL+'/video/addToRoomViaToken',{token: cookie});
    setRoom(res.data.room)
    setMe(res.data.participant)
    Cookie.set(`room-${roomId}-session`, res.data.token)
    setCookie(res.data.token)
    setRtcToken(res.data.rtcToken)
    setScreenRtcToken(res.data.screenRtcToken)
    setScreen('room')
    if(mediaRef){
    mediaRef.current = null // mengedit ini
    }
    console.log(res)
    toast("Berhasil bergabung ke room")


  } catch (error) {
    console.log(error)
    toast.error(error.response.data.message)
  }
}

const submitJoin = async (username, password, isHost) =>{
  try {
    if(username.trim().length == 0 && !isHost){
      toast.error("Maaf nama tidak boleh kosong", {autoClose:2000})
      return "failed"
    }
    if(isHost){
      const roomRequest = await axios.get(BASE_URL+'/video/'+roomId)
      const currentRoom = roomRequest.data.room;
      if(currentRoom){
        if(password ==  currentRoom.hostKey){
          const res = await axios.post(BASE_URL+'/video/addToRoom', {roomId:roomId, password: room.password, isUser:false,
             participantId:currentRoom.host.guestId._id})
          console.log(res);
          Cookie.set(`room-${roomId}-session`, res.data.token)
          setRtcToken(res.data.rtcToken)
          setScreenRtcToken(res.data.screenRtcToken)
          setCookie(res.data.token)
          setScreen('room')
          setMe(res.data.participant);
          return 'success';
        }
        toast.error('Maaf, host key yang Anda masukkan tidak benar', {autoClose:2000})
      }
      return "failed";
    }
      const guestId = new mongoose.Types.ObjectId();
      await axios.post(BASE_URL+'/video/guest',{
              roomId:roomId,
              guestId: guestId,
              username: username,
            });
      const res = await axios.post(BASE_URL+'/video/addToRoom', {roomId:roomId,password:password, isUser:false, participantId:guestId})
      console.log(res);
      Cookie.set(`room-${roomId}-session`, res.data.token)
      setRtcToken(res.data.rtcToken)
      setScreenRtcToken(res.data.screenRtcToken)
      setCookie(res.data.token)
      setScreen('room')
      setMe(res.data.participant);
      if(mediaRef){
        mediaRef.current = null // mengedit ini
        }
    
    toast('Berhasil masuk ke room')
    return "success";
  } catch (error) {
    console.log(error)
    toast.error('Maaf, password yang Anda masukkan tidak benar', {autoClose:2000})
    return "failed";
  }
}

const matikanAudio= async () =>{
    if(mediaRef.current && !me){
        mediaRef.current.srcObject?.getAudioTracks().forEach((track) => {
         track.enabled = false;
       });
     }
     if(me){
      if(localStreams.audioTrack){
        await localStreams.audioTrack.setEnabled(false);
      }
    }
     setIsAudioEnabled(false)
    // setUpdatePermissionStatus(prev => !prev);
   publishController(me, 'AUDIO', false)
}
const publishController = async (isJoined, type, action) =>{
  if(!isJoined){
    return;
  }
  if(localStreams == null){
    return
  }

  if(type ===  'VIDEO'){
    const videoStream = localStreams.videoTrack;
    if(action && !videoStream ){
      try {
      //if(agoraClient.connectionState !== 'CONNECTED'){
        //await agoraClient.join(agoraSetting.AGORA_APP_ID, roomId, rtcToken, me._id);
       // }
       setLoadingOverlayState(true)
       const vd = await AgoraRTC.createCameraVideoTrack();
        await  agoraClient.publish(vd)
        setLocalStreams( {audioTrack:localStreams.audioTrack,videoTrack:vd})
        setLoadingOverlayState(false)
      } catch (error) {
        console.log(error)
        setLoadingOverlayState(false)
      }
    }
  }
  else{
    const audioStream = localStreams.audioTrack;
    if(action && !audioStream ){
      try {
        //if(agoraClient.connectionState !== 'CONNECTED'){
        //  await agoraClient.join(agoraSetting.AGORA_APP_ID, roomId, rtcToken, me._id);
         // }
       setLoadingOverlayState(true)
       const mc = await AgoraRTC.createMicrophoneAudioTrack();
        await  agoraClient.publish(mc)
        setLocalStreams( {videoTrack:localStreams.videoTrack,audioTrack:mc})
        setLoadingOverlayState(false)
      } catch (error) {
        console.log(error)
        setLoadingOverlayState(false)
      }
    }
  }
}
const hidupkanAudio= async () => {
    if(mediaRef.current && !me){
        mediaRef.current.srcObject?.getAudioTracks().forEach((track) => {
         track.enabled = true;
       });
     }
     if(me){
      if(localStreams.audioTrack){
        await localStreams.audioTrack.setEnabled(true);
      }
    }
     setIsAudioEnabled(true)
    // setUpdatePermissionStatus(prev => !prev);
   publishController(me, 'AUDIO', true)
}
const onSelectChat = (id) => {
  setSelectedOptionChat(id)

}

const userVideoSetting = {
  matikanAudio,hidupkanAudio,matikanVideo,hidupkanVideo,mediaRef,isAudioEnabled,isVideoEnabled
}
    return <div className=" bg-slate-900">
        {isError? <ErrorPage statusCode={statusCode} message={errorMessage} /> : <>
    <ToastContainer/>
    <div className='mx-auto min-h-screen flex justify-center items-center flex-col min-w-screen   '>
      {loading? <LoadingOverlay/> :
        screen == 'room' ? <div className="mx-auto min-h-screen  flex justify-center items-center flex-col min-w-screen max-w-screen  ">
          <RoomScreen
          loadingOverlayState={loadingOverlayState}
          setParticipants={setParticipants}
          setLocalMutedParticipantsAudio={setLocalMutedParticipantsAudio}
          setLocalMutedParticipantsVideo={setLocalMutedParticipantsVideo}
          localMutedParticipantsAudio={localMutedParticipantsAudio}
          localMutedParticipantsVideo={localMutedParticipantsVideo}
          setUpdatePermissionStatus={setUpdatePermissionStatus} 
          setIsPermissionGranted={setIsPermissionGranted} 
          startScreenStream={handleStartShareScreen} 
          stopScreenStream={handleCloseShareScreen}
          isShareScreen={isShareScreen} 
          screenStream={screenStream}
          remoteScreenStream={remoteScreenStream}
          screenStreamSetting={userScreenStreamConfig}
          isPermissionGranted={isPermissionGranted}
          onSelectChat={onSelectChat}
          setUnreadMessages={setUnreadMessages}
          unreadMessages={unreadMessages}
          chatOptions={['all', ...participants.map((participant)=> participant.participantId)]} 
          selectedChatValue={selectedOptionChat} 
          me={me} 
          room={room} 
          roomId={roomId} 
          setRoom={setRoom} 
          rtcToken={rtcToken} localStreams={localStreams} userSetting={userVideoSetting} remoteStreamData={streamData} participants={participants}/>
        </div> :<div className='homepage-content  min-h-screen w-full flex flex-col my-auto items-center max-w-full'>
        {isJoinBoxOpen &&
         <div onClick={()=>{setJoinBoxOpen(false)}} className="fixed z-50 top-0 left-0 w-screen flex bg-black bg-opacity-30 flex-col justify-center items-center min-h-screen">
          <JoinBox closeBox={()=>{setJoinBoxOpen(false)}} submitJoin={submitJoin}/>
          </div>}
      <div className=" min-h-screen w-full ">
      <div className="mb-4 lg:mt-24 grid grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-12">
            <div className={` pt-12 md:pt-0 pb-4 px-6 lg:${status == 'actived'? 'col-span-2':'col-span-3'} col-span-3 flex flex-col justify-center text-center mx-auto lg:text-left text-white w-full greeting-style`}>
        
        <div className="flex mx-4 flex-col items-start">
        <div className="flex justify-between  items-start w-full flex-wrap">
        <h1 className="text-left  font-bold md:text-3xl  text-2xl md:pb-3">{room.title}</h1>
        <h1 className={`mt-2 px-2 my-2 py-1 ${status == 'actived'? "bg-green-600": status == 'scheduled'?"bg-yellow-600":"bg-red-600"} text-white rounded-lg  text-sm`}>{status}</h1>
        </div>
        <h1 className="text-[#00A8FF]  tracking-wide md:text-lg text-base  ">Dibuat oleh {room.host.userId? room.host.userId.username : room.host.guestId.username }</h1>
        <hr className={` self-center w-full border-b-4 rounded-md ${status == 'scheduled'? "border-yellow-600": status == 'actived'?"border-green-600": "border-red-600"} my-2`}></hr>
        <h1 className="text-[#00A8FF]  tracking-wide md:text-xl text-lg md:py-3">DESKRIPSI</h1>
        </div>
        
        <div className="mx-4 mb-4 filosofi max-h-[14rem]  overflow-y-auto bg-slate-800 rounded-md">
        <p className=" text-justify md:text-lg sm:text-base text-sm md:py-7 py-3 px-6">{room.description.trim().length > 0?room.description : "Tidak ada deskripsi yang ditampilkan" }.</p>
        </div>
        <div className={`mt-4 flex justify-center lg:justify-start px-6 ${status == 'scheduled'? 'space-x-0':'space-x-3'}`}>
            {    status =='scheduled'? <div className="w-full flex md:flex-row flex-col items-start md:items-center md:space-x-6 md:space-y-0 space-y-3 ">
                <CountdownTimer targetDate={new Date(room.scheduledTime)}/>
                <button onClick={ () => {}} className=" bg-slate-950 hover:bg-blue-900 text-yellow-600 rounded-md px-3 py-3 text-sm md:text-base min-w-[100px]">Back</button>
                </div>
            :
                <>
                <button onClick={ () => {!kembaliJoin?setJoinBoxOpen(true):joinWithCookie()}} className=" bg-[#00A8FF] hover:bg-blue-900 hover:text-white rounded-md py-3 px-3 text-sm md:text-base min-w-[100px] text-black">{kembaliJoin? 'Bergabung kembali' : 'Bergabung'}</button>
               
                </>
            }
        </div>
        </div>
        <div className={` col-span-3 lg:${status == 'actived'? 'col-span-2' : 'col-span-1'} flex flex-col justify-center items-center`}>
        <div className={` mb-3  ${status == 'actived'? 'w-[90%]':'w-auto'}`}>
        {status == 'actived'? <div className="relative flex flex-col bg-slate-800 w-full">
            <video muted  autoPlay playsInline ref={mediaRef} className="h-auto rounded-lg  w-full object-cover aspect-[16/9]"/>
            
           <div className=" w-full flex items-center space-x-4 bg-slate-950 py-2">
                {<div >{isVideoEnabled? <FaVideo onClick={()=>{matikanVideo()}} color="#00A8FF" className="ml-4 w-8 h-auto" /> : <FaVideoSlash onClick={()=>{hidupkanVideo()}} color="red" className="ml-4 w-8 h-auto" />}</div>}
                {<div >{isAudioEnabled? <FaMicrophone onClick={()=>{matikanAudio()}} color="#00A8FF" className="ml-4 w-8 h-auto" /> : <FaMicrophoneSlash onClick={()=>{hidupkanAudio()}} color="red" className="ml-4 w-8 h-auto" />}</div>}
            </div>
        </div>:<img className=" w-48 h-48 md:w-72 md:h-72"src={status == 'scheduled'? Scheduled : LandingImage} alt="" />}
        </div>
        </div>

        </div>
      </div>
      
    
    </div>
      } 
     
    </div>
    {screen == 'lobby'&& <Footer/>}</>}
</div>
}
const RoomScreen= ({setParticipants,loadingOverlayState,setLocalMutedParticipantsAudio,setLocalMutedParticipantsVideo,localMutedParticipantsAudio,localMutedParticipantsVideo,setUpdatePermissionStatus,setIsPermissionGranted,screenStreamSetting={},startScreenStream, stopScreenStream,isShareScreen,remoteScreenStream,screenStream,userSetting={},isPermissionGranted,unreadMessages,setUnreadMessages,me,room, onSelectChat, selectedChatValue, chatOptions,roomId ,setRoom, rtcToken, remoteStreamData = {},localStreams ,participants = []}) => {
  const [showBottomNavbar, setShowBottomNavbar] = useState(false);
  const [timeOutId, setTimeOutId] = useState(null)
  const [isLandscape, setIsLandscape] = useState(false);
  const [expandMiniVideo, setExpandMiniVideo] = useState(true);
  const [isReactionModalOpen, setReactionModalOpen] = useState(false)
  const navigate = useNavigate()
  //console.log('ini aku: ',me)
  const getCameraPermission = async () => {
    if(isPermissionGranted){
      return
    }
    try {
      const res = await AgoraRTC.createCameraVideoTrack();
      setIsPermissionGranted(true)
    } catch (error) {
      setIsPermissionGranted(false)
    }
  }
  const getAudioPermission = async () => {
    if(isPermissionGranted){
      return
    }
    
    try{
     // const res = await AgoraRTC.createMicrophoneAudioTrack();
     await navigator.mediaDevices.getUserMedia({
      video: false,
      audio: true // Gunakan state video
      // Gunakan state audio
    });
    
      setIsPermissionGranted(true)
      setUpdatePermissionStatus(true)
      console.log('ini berjalan?')
    }
    catch (error) {
      console.log('set ulang')
      console.log(error)
      setIsPermissionGranted(false)
    }
  }
 
  useEffect(()=>{
    if(isShareScreen && (screenStream || remoteScreenStream)){
      changeLayoutMode(modes.screenShare)
    }
    else if(participants.length == 1){
      changeLayoutMode(modes.peerToPeer)
    }
    else if(participants.length > 0){
      changeLayoutMode(modes.allParticipants)
      console.log('ganti')
    }
    else{
      changeLayoutMode(modes.onlyMe)
    }
  },[participants, isShareScreen, remoteScreenStream, screenStream]);
  useEffect(()=>{
    function detectOrientation() {
      if (window.innerHeight > window.innerWidth) {
        // Potrait mode
        console.log('Layar dalam mode potrait');
        setIsLandscape(false)
      } else {
        // Landscape mode
        console.log('Layar dalam mode landscape');
        setIsLandscape(true)
      }
    }
    detectOrientation()
    // Panggil fungsi detectOrientation saat window diubah ukuran atau perangkat dirotasi
    window.addEventListener('resize', detectOrientation);
    
    // Panggil fungsi detectOrientation saat halaman dimuat
    window.addEventListener('load', detectOrientation);
    return ()=>{
      // Panggil fungsi detectOrientation saat window diubah ukuran atau perangkat dirotasi
    window.removeEventListener('resize', detectOrientation);
    
    // Panggil fungsi detectOrientation saat halaman dimuat
    window.removeEventListener('load', detectOrientation);
    }
  }, [])
  useEffect(()=>{
    const handleShowBottomNavbar = () => {
      if(timeOutId){
        clearTimeout(timeOutId)
      }
      // Jika bottom navbar sudah disembunyikan, tampilkan kembali
        //setShowBottomNavbar(false);
        // Batalkan timer jika ada klik lain dalam 3 detik
        // Jika belum disembunyikan, sembunyikan dan mulai timer
        setShowBottomNavbar(true);
       const newTimeOutId =  setTimeout(() => {
          setShowBottomNavbar(false);
        }, 6000);
         // Timer selama 4 detik (4000 ms)
         setTimeOutId(newTimeOutId);
    };
    handleShowBottomNavbar()
  },[])
  const openBottomNavbar = () => {
    const handleShowBottomNavbar = () => {
      if(timeOutId){
        clearTimeout(timeOutId)
      }
      // Jika bottom navbar sudah disembunyikan, tampilkan kembali
        //setShowBottomNavbar(false);
        // Batalkan timer jika ada klik lain dalam 3 detik
        // Jika belum disembunyikan, sembunyikan dan mulai timer
        setShowBottomNavbar(true);
       const newTimeOutId =  setTimeout(() => {
          setShowBottomNavbar(false);
        }, 6000);
         // Timer selama 4 detik (4000 ms)
         setTimeOutId(newTimeOutId);
    };
    handleShowBottomNavbar()
  }
  const modes = {
    onlyMe: "only-me",
    screenShare: "screen-share",
    allParticipants: "all-participant",
    focusToOneParticipant: "focus-to-one-participant",
    peerToPeer:"peer-to-peer"
  }
  const [layoutSetting, setLayoutSetting] = useState({
    'mode': modes.onlyMe,
  }) 
  const [openSidebar, setOpenSidebar] = useState(false)
  const [openParticipantsSidebar, setOpenParticipantsSidebar] = useState(false);

  const changeLayoutMode = (newMode) => {
    setLayoutSetting({ mode: newMode });
  };
  const renderContentBasedOnMode = () => {
    const reactionElement = (reaction) => {
   switch (reaction) {
        case 'smile-reaction':
          return <FaSmile className="w-8 h-8" color="yellow"/>;
        case 'ask-reaction':
          return <MdFrontHand className="w-8 h-8" color="yellow"/>;
        case 'thumbUp-reaction':
          return  <MdThumbUp className="w-8 h-8" color="yellow"/>;
        case 'wavingHand-reaction':
          return <MdWavingHand className="w-8 h-8" color="yellow"/>;
        case 'grinTears-reaction':
          return <FaGrinTears className="w-8 h-8" color="yellow"/>;
        default:
            return <div className="text-white"></div>;
      }
    }
   // console.log(layoutSetting.mode)
    //console.log(room.participants[me._id].reaction)
    switch (layoutSetting.mode) {
      case modes.onlyMe:
        return (
          <div className="w-screen flex flex-col justify-center h-full items-center max-h-full">
            <div className="relative w-[120vh] h-auto max-w-[95%] text-white">
              <div className="absolute right-5 top-2 z-10 flex">
                {
                  room.participants[me._id] ? 
                  reactionElement(room.participants[me._id].reaction)
                  : <div></div>
                  
                }
              </div>
              <CustomAgoraLocalVideo audioTrack={localStreams.audioTrack} 
              videoTrack={localStreams.videoTrack} isUser={true}
              name={me.username}
              isAudioEnabled= {userSetting.isAudioEnabled} // atur ini
              isVideoEnabled = {userSetting.isVideoEnabled}
              />
            </div>
            
          </div>
        );
      case modes.peerToPeer:
        return (
          <div className="w-screen  items-center md:mt-0 md:mb-0 flex flex-col justify-center h-full">
            {participants.map((participant)=>{
            return <div className="relative w-full h-full"
            key={participant.participantId}>

            <div className="absolute right-16 top-3 z-10 flex">
                {
                  room.participants[participant.participantId] ? 
                  reactionElement(room.participants[participant.participantId].reaction)
                  : <div></div>
                  
                }
              </div>

              <CustomFullScreenAgoraVideo 
            audioTrack={participant.audioTrack}
            videoTrack={participant.videoTrack}
            isUser={false}
            name={room? room.participants[participant.participantId]? room.participants[participant.participantId].guestId.username : 'loading...' : 'loading...'}
            isAudioEnabled={participant.isAudioEnabled}
            isVideoEnabled={participant.isVideoEnabled}/>
            </div>
          })}
            <div className={`fixed bottom-20 right-4 w-[25vw] max-w-[25vw] ${isLandscape? 'aspect-[16/9]' : 'aspect-[9/16]'}`}>
            <div className="absolute right-1 top-1 z-10 flex">
                {
                  room.participants[me._id] ? 
                  reactionElement(room.participants[me._id].reaction)
                  : <div></div>
                  
                }
              </div>
            <CustomFullScreenAgoraLocalVideo audioTrack={localStreams.audioTrack} 
              videoTrack={localStreams.videoTrack} isUser={true}
              name={me.username}
              showControl={false}
              isAudioEnabled= {userSetting.isAudioEnabled} 
              isVideoEnabled = {userSetting.isVideoEnabled}
              />
            </div>
          </div>
        );
        
      case modes.screenShare:
        return <div className="w-screen flex flex-col  justify-center h-full items-center max-h-full">

        <div className="fixed z-10 flex flex-col space-y-1 max-h-[80vh]  rounded-md  bg-slate-950 items-center top-20 right-4 px-1 py-2">
          { expandMiniVideo && <div onClick={()=> {
            console.log('kena tap')
          }} className="w-full   flex flex-col ">
            <MdOutlineExpandLess onClick={()=>{
              console.log('perkecil video')
              setExpandMiniVideo(false)
            }} color="white" className="ml-auto mr-1 w-6 h-6 "/>
          </div> }

          { !expandMiniVideo && <div onClick={()=> {
            console.log('kena tap')
          }} className="w-full  flex flex-col ">
            <MdOutlineExpandMore onClick={()=>{
              console.log('perkecil video')
              setExpandMiniVideo(true)
            }} color="white" className="ml-auto  w-6 h-6 "/>
          </div> }

          <div className="flex flex-col space-y-1 relative overflow-y-auto">
          {expandMiniVideo &&
           <div className={`relative border-4 border-teal-700 min-w-[25vw] w-[25vw] max-w-[25vw] ${isLandscape? 'aspect-[16/9]' : 'aspect-[9/16]'}`}>
            
            <div className="absolute right-1 top-1 z-10 flex">
                {
                  room.participants[me._id] ? 
                  reactionElement(room.participants[me._id].reaction)
                  : <div></div>
                  
                }
              </div>
            <CustomFullScreenAgoraLocalVideo audioTrack={localStreams.audioTrack} 
              videoTrack={localStreams.videoTrack} isUser={true}
              name={''}
              showControl={false}
              isAudioEnabled= {userSetting.isAudioEnabled} 
              isVideoEnabled = {userSetting.isVideoEnabled}
              />
            </div>}
          {expandMiniVideo && participants.map((participant,index)=>{
            
            return (
              <div key={`mini-video-expand-${index}`} className={` relative border-4 border-blue-700 min-w-[25vw] w-[25vw] max-w-[25vw] ${isLandscape? 'aspect-[16/9]' : 'aspect-[9/16]'}`}>
            
            <div className="absolute right-1 top-1 z-10 flex">
                {
                  room.participants[participant.participantId] ? 
                  reactionElement(room.participants[participant.participantId].reaction)
                  : <div></div>
                  
                }
              </div>
            <CustomFullScreenAgoraLocalVideo audioTrack={participant.audioTrack} 
              videoTrack={participant.videoTrack} isUser={false}
              name={''}
              showControl={false}
              isAudioEnabled= {participant.isAudioEnabled} 
              isVideoEnabled = {participant.isVideoEnabled}
              />
            </div>
            )
            
          })}
          </div>

          
        </div>
            <div className="w-full h-full"
            key={'abcdefg'}>
              <CustomFullScreenAgoraVideo 
            audioTrack={null}
            videoTrack={screenStream? screenStream : remoteScreenStream}
            isUser={false}
            name={'Screen Share'}
            showControl={false}
            isAudioEnabled={true}
            isVideoEnabled={true}/>
            </div>
        
      </div>;
      case modes.allParticipants:
        return (
          <div className="w-screen  items-center md:mt-0 md:mb-0 flex flex-col justify-center h-full">
            <div className={`grid h-full w-full  gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-4`}>
              <div className="relative w-full h-full md:w-full lg:w-full mx-auto h-auto max-w-full text-white">
              <div className="absolute right-5 top-2 z-10 flex">
                {
                  room.participants[me._id] ? 
                  reactionElement(room.participants[me._id].reaction)
                  : <div></div>
                  
                }
              </div>
                <CustomAgoraLocalVideo
                  audioTrack={localStreams.audioTrack}
                  videoTrack={localStreams.videoTrack}
                  isUser={true}
                  name={me.username}
                  isAudioEnabled={userSetting.isAudioEnabled}
                  isVideoEnabled={userSetting.isVideoEnabled}
                />
              </div>
              {participants.map((participant) => (
                <div
                  className="relative w-full md:w-full lg:w-full  mx-auto h-auto max-w-full text-white"
                  key={participant.participantId}
                >
                  <div className="absolute right-5 top-2 z-10 flex">
                {
                  room.participants[participant.participantId] ? 
                  reactionElement(room.participants[participant.participantId].reaction)
                  : <div></div>
                  
                }
              </div>
                  <CustomAgoraVideo
                    audioTrack={participant.audioTrack}
                    videoTrack={participant.videoTrack}
                    isUser={false}
                    name={room? room.participants[participant.participantId]? room.participants[participant.participantId].guestId.username : 'loading...' : 'loading...'}
                    isAudioEnabled={participant.isAudioEnabled}
                    isVideoEnabled={participant.isVideoEnabled}
                  />
                </div>
              ))}
            </div>
          </div>
        );
        
      case modes.focusToOneParticipant:
        return <div></div>;
      default:
        return <div>Tampilan default</div>;
    }
  };
  return <div onClick={()=>{
    openBottomNavbar()
  }} className="flex flex-col  w-screen h-screen ">
    {loadingOverlayState && <LoadingOverlay/>}
    {!isPermissionGranted && <AccessPopUp notifier={()=>{
      setUpdatePermissionStatus(prev=> !prev)
    }}/>}
    {/* Chat Sidebar */}
    {openSidebar && <div onClick={()=>{setOpenSidebar(false)}} className="fixed top-0 left-0 z-20 flex w-screen h-screen justify-end ">
      { <Sidebar room={room} me={me} onSelect={onSelectChat} options={chatOptions} selectedValue={selectedChatValue} isOpen={openSidebar} closeSidebar={()=>{setOpenSidebar(false)}}/>}
    </div>}
    {openParticipantsSidebar && <div onClick={()=>{setOpenParticipantsSidebar(false)}} className="fixed top-0 left-0 z-20 flex w-screen h-screen justify-end ">
      { <ParticipantsSidebar openChatSidebar={()=>{
        setOpenParticipantsSidebar(false)
        setOpenSidebar(true)
      }}  
      setParticipants={setParticipants}
      setLocalMutedParticipantsAudio={setLocalMutedParticipantsAudio}
      setLocalMutedParticipantsVideo={setLocalMutedParticipantsVideo}
      localMutedParticipantsAudio={localMutedParticipantsAudio}
      localMutedParticipantsVideo={localMutedParticipantsVideo}
      setSelectedOptionChat={onSelectChat}
      room={room} participants={participants} me={me} isOpen={openParticipantsSidebar} closeSidebar={()=>{setOpenParticipantsSidebar(false)}}/>}
    </div>}

    {/* Setting & Participants*/}
    <div onClick={async (e)=>{
      e.stopPropagation()
      //await agoraClient.unpublish();
      await agoraClient.leave()
      //navigate('/video', {replace:true});
      navigate(-1);
      
    }} className="px-2 py-2 rounded-md z-10 bg-slate-800 fixed top-2 left-2">
      <FaDoorOpen color="red" className=" w-6 h-6 "/>
    </div>
    <div onClick={(e)=>{
        e.stopPropagation();
        setOpenParticipantsSidebar(true)
    }} className="px-2 py-2 z-10  rounded-md bg-slate-800 fixed top-2 right-2">
      <FaUser color="#00A8FF" className=" w-6 h-6 "/>
      <div className="absolute bg-slate-950 rounded-full w-5 h-5 flex items-center justify-center text-white top-0 right-0">{participants? participants.length + 1 : 1}</div>
    </div>
    {/* Konten */}
    <div className=" my-auto  overflow-x-hidden">
    {!isPermissionGranted ? 
    <div className="flex items-center my-auto h-full">
    <div className=" my-auto h-full flex justify-center items-center mx-auto md:flex-row flex-col-reverse">
    <div className="mx-8">
    <h1 className=" text-red-400 lg:text-5xl md:text-4xl text-3xl mx-auto md:text-left text-center mt-3">Atur Ulang Izin</h1>
    <p className=" text-gray-200 lg:text-2xl md:text-2xl text-lg text-center md:text-left"> Kami mendeteksi akses kamera atau mikrofon ditolak. <br></br>Kami sedang menginvestigasinya</p>
    </div>
    <div className="">
        <img className= " lg:min-h-[200px] lg:h-[210px] md:min-h-[180px] md:h-[190px] h-[180px]"src={Error} alt="" />
    </div>
    </div>
</div>
    :localStreams? renderContentBasedOnMode() : <div className="w-screen h-screen flex items-center justify-center"><LoadingOverlay/></div>}
    </div>

    {/* Bottom Bar */}
    { showBottomNavbar && <div className="w-full min-h-[4rem] fixed bottom-0 left-0  flex items-center justify-between px-4 md:px-8 lg:px-16 py-2 bg-slate-800">
        <div>
          {userSetting.isVideoEnabled ? (
            <FaVideo onClick={userSetting.matikanVideo} color="#00A8FF" className="ml-4 w-6 h-auto" />
          ) : (
            <FaVideoSlash onClick={userSetting.hidupkanVideo} color="red" className="ml-4 w-6 h-auto" />
          )}
        </div>
        <div>
          {userSetting.isAudioEnabled ? (
            <FaMicrophone onClick={userSetting.matikanAudio} color="#00A8FF" className="ml-4 w-6 h-auto" />
          ) : (
            <FaMicrophoneSlash onClick={userSetting.hidupkanAudio} color="red" className="ml-4 w-6 h-auto" />
          )}
        </div>
      {isShareScreen && screenStream? <div onClick={()=>{
        stopScreenStream()
      }} className="flex items-center justify-center p-2 bg-teal-700"> <MdScreenShare color="#00A8FF" className="w-7 h-7 "/></div> : <MdScreenShare onClick={()=>{
        startScreenStream()
      }} color="#00A8FF" className="w-7 h-7 "/>}
      <div className="relative"  onClick={()=>{
        setOpenSidebar(true);
        setUnreadMessages(0)
        }} >
      <MdChatBubble color="#00A8FF" className="w-7 h-7 "/>
      {unreadMessages > 0 && (
    <div className="absolute bg-slate-950 rounded-full w-5 h-5 flex items-center justify-center text-white top-0 -right-1">
      {unreadMessages}
    </div>
  )}
      </div>
      {
         <div className="relative">
        {isReactionModalOpen && <div className="z-50 absolute bottom-16 right-2 ">
        <ReactionPopUp setRoom={setRoom} me={me} room={room} onClose={()=>{
          setReactionModalOpen(false)
        }} />
        </div>}
      <MdAddReaction onClick={()=>{
        setReactionModalOpen(prev => !prev)
      }} color="#00A8FF" className="w-6 h-6 "/>
      </div>
      }
    </div>}
  </div>
}



export default RoomPage;