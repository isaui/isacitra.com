import React, { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import Footer from "../footer/Footer";
import { useNavigate, useNavigation, useParams } from 'react-router-dom';
import Loading from "../loading/Loading";
import LandingImage from "../../assets/new_meet/zoomcreate.svg";
import Scheduled from "../../assets/meet_status/scheduled.svg";
import NoUserVideo from "../../assets/meet_status/novideo.svg";
import Error from '../../assets/error/error.svg'
import ErrorPage from "../error/ErrorPage";
import CountdownTimer from "../time_counter/TimeCounter";
import { AiFillCloseCircle, AiFillMessage, AiFillSetting, AiFillSmile, AiFillVideoCamera, AiOutlineDotChart } from "react-icons/ai";
import { FaDoorOpen, FaGrinTears, FaHandHolding, FaMicrophone, FaMicrophoneSlash, FaRegWindowClose, FaRegWindowMinimize, FaSmile, FaUser, FaVideo, FaVideoSlash } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import mongoose, { Mongoose, set } from "mongoose";
import { MdAddReaction, MdChatBubble, MdContacts, MdFrontHand, MdMoreVert, MdOutlineExpand, MdOutlineExpandCircleDown, MdOutlineExpandLess, MdOutlineExpandMore, MdOutlineTopic, MdScreenShare, MdSend, MdSettings, MdThumbUp, MdWavingHand } from "react-icons/md";
import Cookie from 'js-cookie';
import {
  createMicrophoneAudioTrack,
  createCameraVideoTrack,
  createMicrophoneAndCameraTracks,
  AgoraVideoPlayer
} from "agora-rtc-react";
import AgoraRTC from "agora-rtc-sdk-ng";
import {decodeToken, isExpired} from 'react-jwt'

import Ably from 'ably/build/ably-webworker.min';

const ably = new Ably.Realtime({
  key: 'o7gv-w.ulW0zw:olcD9FroY5pv3a9EhFzb4X7Hth-nedgovu4bdz8bsFI'
})
const roomChannel = ably.channels.get('room-channel')


const agoraSetting = {
  AGORA_APP_ID:  'd91d04d113ba4e6181f6da7f4cb9a1cc',
  AGORA_CERTIFICATE: '5ee0129a61234f65bd4bfd5619178643',
  config:{ 
  mode: "rtc", codec: "vp8",
}
}

//const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();

const agoraClient = AgoraRTC.createClient({...agoraSetting.config})


const verifyToken = (token)=>{
  try{
    const decoded = decodeToken(token);
    const isTokenExpired = isExpired(token);
    console.log(decoded)
    if(isTokenExpired){
      return false
    }
    if(!decoded){
      return false;
    }
    return true
   
  }catch(error){
        console.log(error)
        return false;
  }
}
//agoraClient.

const ReactionPopUp = ({onClose,room, me, setRoom}) => {
  console.log('dibuat lagi...')
  const [reaction, setReaction] = useState('no-reaction');
  console.log('reaksi baru-> ', reaction)
  useEffect(()=>{
    console.log('pembuktian...')
    const itsUpdateOfMe = room.participants[me._id];
    const newReact = itsUpdateOfMe ? itsUpdateOfMe.reaction : 'no-reaction';
    setReaction(newReact)
  },[ ])
  const submitReaction = async (react) => {
    try {
      console.log('ini id saya => ', me._id )
      const res = await axios.post("https://isacitra-com-api.vercel.app/video/reaction",{
        roomId:room._id,
        guestId:me._id,
        reaction: react
      })
      const {room:newRoom} = res.data;
      const itsUpdateOfMe = newRoom.participants[me._id];
      const newReact = itsUpdateOfMe ? itsUpdateOfMe.reaction : 'no-reaction';
      setReaction(newReact)
      setRoom(newRoom)


    } catch (error) {
      console.log(error)
      toast.error("Terdapat kesalahan dalam bereaksi")
    }
  }
  return (
    <div className="flex justify-start flex-col px-2 pt-1 pb-3 bg-slate-800 rounded-lg">
      <div className="mb-2 flex  w-full  justify-between items-center ">
        <h1 className=" text-white text-xs">Reactions</h1>
        <AiFillCloseCircle onClick={()=>{
          onClose()
        }} color="red"className="w-6 h-6"/>
      </div>
      
       <div className="flex flex-row space-x-3">
       <FaSmile onClick={()=>{
        submitReaction('smile-reaction')
       }} color={`${reaction == 'smile-reaction'? 'yellow':'#00A8FF'}`} className=" w-8 h-8 "/>
        <MdFrontHand onClick={()=>{
        submitReaction('ask-reaction')
       }} color={`${reaction == 'ask-reaction'? 'yellow':'#00A8FF'}`} className=" w-8 h-8 "/>
        <MdThumbUp onClick={()=>{
        submitReaction('thumbUp-reaction')
       }} color={`${reaction == 'thumbUp-reaction'? 'yellow':'#00A8FF'}`} className=" w-8 h-8 "/>
        <MdWavingHand onClick={()=>{
        submitReaction('wavingHand-reaction')
       }} color={`${reaction == 'wavingHand-reaction'? 'yellow':'#00A8FF'}`} className=" w-8 h-8 "/>
        <FaGrinTears onClick={()=>{
        submitReaction('grinTears-reaction')
       }} color={`${reaction == 'grinTears-reaction'? 'yellow':'#00A8FF'}`} className=" w-8 h-8 "/>
       </div>
      
    </div>
  );
}

const LoadingOverlay = () => {
  return (
    <div id="loadingOverlay" className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-20">
   
    <div  role="status" className="bg-white bg-opacity-50 rounded-lg p-4 shadow-lg flex justify-center items-center">
        <svg aria-hidden="true" className="w-10 h-10  text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
        </svg>
    </div>
</div>
  )
}

const LocalSettingDropDown = ({userId, onClose ,setLocalMutedParticipantsAudio,setLocalMutedParticipantsVideo ,localMutedParticipantsAudio, localMutedParticipantsVideo,participants,setParticipants }) => {
  const dropdownRef = useRef(null);
  const handleClickOutside = (event) => {
    //console.log('here')
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      onClose();
    }
  };

  
  const muteAudio = async (userId) => {
    //console.log(participants)
    const newParticipants = [...participants]
    const targetUser = newParticipants.find(participant => participant.participantId == userId);
    if(!targetUser){
        return toast.error('Terjadi kesalahan dalam me-mute audio', {autoClose:2000});
    }
    //console.log('ini dia remoteUser: ', agoraClient.remoteUsers)
    const userToMute = agoraClient.remoteUsers.find(user => user.uid == userId) ?? targetUser.user;
    if(userToMute && targetUser){
      try {
        await agoraClient.unsubscribe(userToMute, "audio")
        targetUser.audioTrack = null;
        setParticipants(newParticipants);
        setLocalMutedParticipantsAudio(prev => [...prev, userId])
        return toast.success('Berhasil me-mute audio', {autoClose:2000})
      } catch (error) {
        console.log("error", error)
        return toast.error('Terjadi kesalahan dalam me-mute audio', {autoClose:2000});
      }
    }
  }

 const unMuteAudio =  async (userId) => {
    const newParticipants = [...participants]
    const targetUser = newParticipants.find(participant => participant.participantId == userId);
    if(!targetUser){
        return toast.error('Terjadi kesalahan dalam unmute audio', {autoClose:2000});
    }
    const userToUnMute = agoraClient.remoteUsers.find(user => user.uid == userId) ?? targetUser.user;
    if(userToUnMute && targetUser){
      try {
        const res = await agoraClient.subscribe(userToUnMute, "audio");
        if(res){
          targetUser.audioTrack = res;
          setParticipants(newParticipants);
          setLocalMutedParticipantsAudio(prev => prev.filter(id => id != userId));
          return toast.success('Berhasil unmute audio', {autoClose:2000})
        }
        return toast.error('Terjadi kesalahan dalam unmute audio', {autoClose:2000});

      } catch (error) {
        console.log("error", error)
        return toast.error('Terjadi kesalahan dalam unmute audio', {autoClose:2000});
      }
    }
  }

  const muteVideo = async (userId) => {
    //console.log(participants)
    const newParticipants = [...participants]
    const targetUser = newParticipants.find(participant => participant.participantId == userId);
    if(!targetUser){
        return toast.error('Terjadi kesalahan dalam me-mute video', {autoClose:2000});
    }
    console.log('ini dia remoteUser: ', agoraClient.remoteUsers)
    const userToMute = agoraClient.remoteUsers.find(user => user.uid == userId) ?? targetUser.user;
    if(userToMute && targetUser){
      try {
        await agoraClient.unsubscribe(userToMute, "video")
        targetUser.videoTrack = null;
        setParticipants(newParticipants);
        setLocalMutedParticipantsVideo(prev => [...prev, userId])
        return toast.success('Berhasil me-mute video', {autoClose:2000})
      } catch (error) {
        console.log("error", error)
        return toast.error('Terjadi kesalahan dalam me-mute video', {autoClose:2000});
      }
    }
  }

  const unMuteVideo = async (userId) => {
    const newParticipants = [...participants]
    const targetUser = newParticipants.find(participant => participant.participantId == userId);
    if(!targetUser){
        return toast.error('Terjadi kesalahan dalam unmute video', {autoClose:2000});
    }
    const userToUnMute = agoraClient.remoteUsers.find(user => user.uid == userId) ?? targetUser.user;
    if(userToUnMute && targetUser){
      try {
        const res = await agoraClient.subscribe(userToUnMute, "video");
        if(res){
          targetUser.videoTrack = res;
          setParticipants(newParticipants);
          setLocalMutedParticipantsVideo(prev => prev.filter(id => id != userId));
          return toast.success('Berhasil unmute video', {autoClose:2000})
        }
        return toast.error('Terjadi kesalahan dalam unmute video', {autoClose:2000});

      } catch (error) {
        console.log("error", error)
        return toast.error('Terjadi kesalahan dalam unmute video', {autoClose:2000});
      }
    }
  }

  
  
  useEffect(() => {
    // Tambahkan event listener ketika komponen sudah ter-mount
    document.addEventListener("mousedown", handleClickOutside);

    // Hapus event listener ketika komponen akan di-unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const findParticipantInList = (userId, mode) => {
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
  return (
    <div
          className="origin-top-right absolute right-0 mt-4 w-40 rounded-md shadow-lg bg-blue-950 ring-1 ring-black ring-opacity-5"
          role="menu"
          ref={dropdownRef}
          aria-orientation="vertical"
          aria-labelledby="user-dropdown"
        >
          <div className="py-1" role="none">
            <button
             role="menuitem"
             onClick={()=>{
              if(!findParticipantInList(userId, 'AUDIO')){
                return muteAudio(userId)
              }
              return unMuteAudio(userId)
             }}
             className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">
              <h1>{findParticipantInList(userId, 'AUDIO')? 'Unmute audio' : 'Mute audio'}</h1>
            </button>
            <button
             role="menuitem"
             onClick={()=>{
              if(!findParticipantInList(userId, 'VIDEO')){
                return muteVideo(userId)
              }
              return unMuteVideo(userId)
             }}
             className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">
              <h1>{findParticipantInList(userId, 'VIDEO')? 'Unmute video' : 'Mute video'}</h1>
            </button>
          </div>
        </div>
  )
}

const JoinPage = () =>{
    const {id:roomId} = useParams();
    const user = useSelector((state) => state.auth.user);
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
      console.log('mencoba share screen....')
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


    //console.log(participants)
    //console.log('apa isinya? ',room)
    
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
                const res = await axios.get(`https://isacitra-com-api.vercel.app/video/${roomId}`);
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
        //await agoraClient.leave()
        // Memasang event listener ketika pengguna lain mempublikasikan media
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
          setRemoteScreenStream(null)
          setIsShareScreen(false)
          user.videoTrack?.stop()
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
            user.leave()
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
        // Memublikasikan trek audio dan video lokal
       // if (tracks) {
       //   await agoraClient.publish([tracks[0], tracks[1]]);
          
      
       //   setLocalStreams({
        //    audioTrack: tracks[0], // Tentukan trek audio yang sesuai
     //       videoTrack: tracks[1], // Tentukan trek video yang sesuai
       //   });
     //   }
      };
    init().then((res)=>{
      setSetup(true)
    });
    console.log('UPPPPPP')
   // if(ready && tracks){

   //   setIsPermissionGranted(true)
   //   init().then((res)=>{
    //   setSetup(true)
   //   })
      
      
   // }
   
      
  
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
    const res = await axios.post('https://isacitra-com-api.vercel.app/video/addToRoomViaToken',{token: cookie});
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

const submitJoin = async (username, password) =>{
  try {
    if(username.trim().length == 0){
      toast.error("Maaf nama tidak boleh kosong", {autoClose:2000})
      return "failed"
    }
      const guestId = new mongoose.Types.ObjectId();
      await axios.post('https://isacitra-com-api.vercel.app/video/guest',{
              roomId:roomId,
              guestId: guestId,
              username: username,
            });
      const res = await axios.post('https://isacitra-com-api.vercel.app/video/addToRoom', {roomId:roomId,password:password, isUser:false, participantId:guestId})
      console.log(res);
      Cookie.set(`room-${roomId}-session`, res.data.token)
      setRtcToken(res.data.rtcToken)
      setScreenRtcToken(res.data.screenRtcToken)
      setCookie(res.data.token)
      setScreen('room')
    //  setRoom(res.data.room);
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
          setUpdatePermissionStatus={setUpdatePermissionStatus} setIsPermissionGranted={setIsPermissionGranted} startScreenStream={handleStartShareScreen} stopScreenStream={handleCloseShareScreen} isShareScreen={isShareScreen} screenStream={screenStream} remoteScreenStream={remoteScreenStream} screenStreamSetting={userScreenStreamConfig} isPermissionGranted={isPermissionGranted} onSelectChat={onSelectChat} setUnreadMessages={setUnreadMessages} unreadMessages={unreadMessages} chatOptions={['all', ...participants.map((participant)=> participant.participantId)]} selectedChatValue={selectedOptionChat} me={me} room={room} roomId={roomId} setRoom={setRoom} rtcToken={rtcToken} localStreams={localStreams} userSetting={userVideoSetting} remoteStreamData={streamData} participants={participants}/>
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
function formatTimestampToWIB(timestamp) {
  const options = {
    hour: "numeric",
    minute: "numeric",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta", // Atur zona waktu ke Waktu Indonesia Barat (WIB)
  };

  return new Intl.DateTimeFormat("id-ID", options).format(new Date(timestamp));
}

const Sidebar = ({isOpen, closeSidebar, onSelect, options, selectedValue, room, me, })=>{
  const [loading, setLoading] = useState(false);
  const [pesan, setPesan] = useState('');
  const [filteredChats, setFilteredChats] = useState([]);
  useEffect(()=>{
    if(!room){
      return
    }
    const chats = room.chats;
    if(selectedValue == 'all'){
      const selectedChats = chats.filter((chat)=> (chat.receiver == null || chat.receiver == "all"));
      setFilteredChats(selectedChats);
    }
    else{
      const selectedChats = chats.filter((chat)=>((chat.sender == me._id || chat.sender == selectedValue) && 
      (chat.receiver == me._id  || chat.receiver == selectedValue)))
      setFilteredChats(selectedChats)
    }
  }, [room, selectedValue])
  const submitMessage= async () => {
    if(pesan.trim().length == 0){
      return toast.error("Maaf pesan Anda masih kosong", {autoClose:2000})
    }
    setLoading(true)
    try {
      const res = await  axios.post('https://isacitra-com-api.vercel.app/video/addCommentToRoom', {roomId:room._id, senderId:me._id, receiverId: selectedValue, message: pesan});
      toast("Berhasil mengirim pesan", {autoClose:2000})
      setPesan('')
      console.log('ini room kmoeh',res.data)
    } catch (error) {
      console.log(error)
      toast.error("gagal mengirim pesan", {autoClose:2000})
    }
    setLoading(false)
  }
  const handleChangePesan = async (e) => {
    setPesan(e.target.value);
    
  }

  return <div onClick={(e)=>{e.stopPropagation()}} className={`fixed  bottom-0 left-0 flex flex-col min-w-[18rem] h-screen max-h-screen w-screen md:max-w-[40%] lg:max-w-[30%] bg-neutral-900 `}>
    <div className="fixed flex  z-10 flex-col top-0 left-0 w-screen min-w-[18rem] md:max-w-[40%] lg:max-w-[30%]">
      <ToastContainer/>
    <div className=" bg-neutral-950 h-16 flex items-center  w-full">
      <h1 className="ml-2 text-white text-2xl mr-auto">CHATS</h1>
      <DropdownChat onSelect={onSelect} options={options} selectedValue={selectedValue} room={room} />
      <AiFillCloseCircle onClick={closeSidebar} color="#00A8FF" className="ml-2 mr-2 w-8 h-8 "/>
    </div>
    </div>
    <div className={`${filteredChats.length > 0 ? 'mt-20 mb-20' : 'my-auto'} w-full flex flex-col overflow-y-auto`}>
      {filteredChats.length  == 0? <h1 className="mx-auto text-white text-sm">Belum ada pesan</h1>:
        <div className=" w-full flex flex-col items-center justify-start">
          {
            filteredChats.map((chat)=>{
              if(chat.sender == me._id){
                return <div className="w-full flex flex-col text-white">
                <h1 className="text-sm ml-auto mr-2 my-1 break-words text-teal-400">
                  Anda
                </h1>
                <div className="max-w-[90%] bg-teal-800 mb-1 text-sm break-words  rounded-lg px-2 py-2 ml-auto mr-1">
                {chat.message}
              </div>
              <div className="mb-2 breaks-word mr-2 text-xs text-teal-200 ml-auto">
                {formatTimestampToWIB(chat.createdAt)}
              </div>
              </div>
              }

              return <div className="w-full flex flex-col text-white">
                <h1 className="text-sm mr-auto ml-2 my-1 break-word text-blue-500">
                  {room? room.participants[chat.sender]? room.participants[chat.sender].guestId.username : 'loading...' : 'loading...'}
                </h1>
                <div className="max-w-[90%] bg-slate-800 mb-1 text-sm break-words  rounded-lg px-2 py-2 mr-auto ml-1">
                {chat.message} 
              </div>
              <div className="mb-2 breaks-word ml-2 text-xs text-blue-300 mr-auto">
                {formatTimestampToWIB(chat.createdAt)}
              </div>
              </div>
            })
          }
        </div>
      }
    </div>
    <div className="fixed -z-10 bottom-0 left-0 w-full min-w-[18rem] md:max-w-[40%] lg:max-w-[30%]">
    <div className=" px-2 h-16 flex justify-between items-center bg-neutral-950  w-full ">
      <input value={pesan} onChange={handleChangePesan} type="text" className="text-white grow text-sm py-3 px-2 rounded-md outline-none bg-transparent focus:border-[#00A8FF] border-2 border-[#00A8FF]" placeholder="Masukkan pesan Anda"/>
      <div className="ml-2" onClick={submitMessage}>
      {loading? <Loading/> : <MdSend color="#00A8FF" className="ml-4 w-6 h-6 "/>}
      </div>
    </div>
    </div>
    

  </div>
}
const ParticipantsSidebar = ({room, setParticipants,localMutedParticipantsAudio,localMutedParticipantsVideo,setLocalMutedParticipantsAudio,setLocalMutedParticipantsVideo,setSelectedOptionChat, isOpen, closeSidebar, me, participants=[], openChatSidebar})=>{

  return <div onClick={(e)=>{e.stopPropagation()}} className={`flex flex-col min-w-[18rem] relative h-screen w-screen md:max-w-[40%] lg:max-w-[30%] bg-slate-950 `}>
    <div className=" absolute right-0 top-0  my-2 flex items-center justify-between w-full">
      <h1 className=" ml-2 text-white text-2xl">Participants</h1>
      <AiFillCloseCircle onClick={closeSidebar} color="#00A8FF" className="mr-2 w-8 h-8 "/>
    </div>
    <div className="mt-16 flex flex-col bg-neutral-900 h-full overflow-y-auto">
      <div className= {` text-white text-sm w-full py-4  flex items-center`}>
        <div  className={`ml-2 bg-teal-700  w-12 h-12 flex items-center justify-center rounded-full`}>
           {me.username[0]}
        </div>
        <div className="ml-4 flex flex-col items-start space-y-1">
        <h1 className=" text-sm break-words">
          {me? me.username : '...'} {'(Anda)'}
        </h1>
        <div className="text-white bg-blue-400 px-2 py-1 rounded-md text-xs">
          Guest
        </div>
        </div>

      </div>
      {participants.map((participant)=>{
        const data = room.participants[participant.participantId];
        return (
          <ParticipantSetting key={data? data.guestId : 'abcdefghijklmn'} 
          data={data}
          setLocalMutedParticipantsAudio={setLocalMutedParticipantsAudio}
          setLocalMutedParticipantsVideo={setLocalMutedParticipantsVideo}
          setSelectedOptionChat={setSelectedOptionChat}
          openChatSidebar={openChatSidebar}
          participant={participant}
          participants={participants}
          localMutedParticipantsAudio={localMutedParticipantsAudio}
          localMutedParticipantsVideo={localMutedParticipantsVideo}
          setParticipants={setParticipants}
          />
        )
      })}
    </div>

  </div>
}

const ParticipantSetting = ({data, setSelectedOptionChat, openChatSidebar, participant, participants, setParticipants,
localMutedParticipantsAudio, localMutedParticipantsVideo,
setLocalMutedParticipantsAudio,setLocalMutedParticipantsVideo})=>{
  const [isMutedSettingOpen,setIsMutedSettingOpen] = useState(false);
  return ( 
  <div className= {`mb-auto text-white text-sm w-full py-4  flex items-center`}>
  <div  className={`ml-2 bg-teal-700  w-12 h-12 flex items-center justify-center rounded-full`}>
     {data? data.guestId.username[0] : '?' }
  </div>
  <div className="ml-4 flex flex-col items-start space-y-1">
  <h1 className=" text-sm break-words">
    {data? data.guestId.username : '...'} 
  </h1>
  <div className="text-white bg-blue-400 px-2 py-1 rounded-md text-xs">
    Guest
  </div>
  </div>
  <div className="relative flex ml-auto mr-4 items-center space-x-2">
    { isMutedSettingOpen && 
    <div className="absolute top-0 right-0 z-20">
      <LocalSettingDropDown 
    userId={participant? participant.participantId : 'undefined'}
    onClose={()=>{setIsMutedSettingOpen(false)}}
    participants={participants}
    setLocalMutedParticipantsAudio={setLocalMutedParticipantsAudio}
    setLocalMutedParticipantsVideo={setLocalMutedParticipantsVideo}
    localMutedParticipantsAudio={localMutedParticipantsAudio}
    localMutedParticipantsVideo={localMutedParticipantsVideo}
    setParticipants={setParticipants}
     />
    </div>}
    <AiFillMessage onClick={()=>{
      setSelectedOptionChat(participant.participantId)
      openChatSidebar()
    }} color="white" className="w-8 h-8"/>
    <MdMoreVert onClick={()=>{
      setIsMutedSettingOpen(true);
    }} color="white" className="w-8 h-8"/>
  </div>
  </div> )

}

function CustomFullScreenAgoraVideo({showControl=true, audioTrack, videoTrack, isUser, name, isVideoEnabled=true, isAudioEnabled=true }) {

  const videoRef = useRef(null);
    useEffect(() => {
      if (videoTrack && videoRef.current) {
        // Dapatkan MediaStreamTrack dari videoTrack
        const mediaStreamTrack = videoTrack.getMediaStreamTrack();
  
        // Buat MediaStream baru yang berisi MediaStreamTrack
        const mediaStream = new MediaStream();
        mediaStream.addTrack(mediaStreamTrack);
  
        // Assign MediaStream ke elemen video
        videoRef.current.srcObject = mediaStream;
      }
    }, [videoTrack]);
  return (
    
    <div className="flex flex-col bg-slate-950 w-full h-full rounded-lg">
      {isVideoEnabled && videoTrack? ( // i change this
        <video
          className=" w-screen md:h-[93vh] h-[95vh] object-cover rounded-t-lg"
          style={{}}
          ref={videoRef}
          autoPlay
          playsInline
          muted    
        />
      ) : (
        <img src={NoUserVideo} className=" w-screen md:h-[93vh] h-[95vh] object-cover rounded-t-lg" alt="No Video" />
      )}

      <div className="w-full mx-2  py-2 flex items-center justify-between">
        {(!isUser && showControl )&& (
          <div className="ml-2 flex items-center space-x-4">
            <div>
              { !isVideoEnabled ? (
                <FaVideoSlash
                  color="red"
                  className="w-6 h-auto"
                  // Logic to toggle video track on/off
                />
              ) : (
                <FaVideo
                  color="#00A8FF"
                  className="w-6 h-auto"
                  // Logic to toggle video track on/off
                />
              )}
            </div>
            <div>
              {!isAudioEnabled ? (
                <FaMicrophoneSlash
                  color="red"
                  className="w-6 h-auto"
                  // Logic to toggle audio track on/off
                />
              ) : (
                <FaMicrophone
                  color="#00A8FF"
                  className="w-6 h-auto"
                  // Logic to toggle audio track on/off
                />
              )}
            </div>
          </div>
        )}
        <div className="truncate ml-auto">
          <h1 className="text-white text-sm mr-4 truncate">
            {name}
            {isUser ? ' (Anda)' : ''}
          </h1>
        </div>
      </div>
    </div>
  );
}
// i change this
function CustomAgoraVideo({ audioTrack, videoTrack, isUser, name, isVideoEnabled=true, isAudioEnabled=true }) {
  const videoRef = useRef(null);
    useEffect(() => {
      if (videoTrack && videoRef.current) {
        // Dapatkan MediaStreamTrack dari videoTrack
        const mediaStreamTrack = videoTrack.getMediaStreamTrack();
  
        // Buat MediaStream baru yang berisi MediaStreamTrack
        const mediaStream = new MediaStream();
        mediaStream.addTrack(mediaStreamTrack);
  
        // Assign MediaStream ke elemen video
        videoRef.current.srcObject = mediaStream;
      }
    }, [videoTrack]);
  return (
    
    <div className="flex flex-col bg-slate-950 w-full h-full rounded-lg">
      {isVideoEnabled && videoTrack? ( // i change this
        <video
          className="aspect-video object-cover rounded-t-lg"
          style={{}}
          ref={videoRef}
          autoPlay
          playsInline
          muted    
        />
      ) : (
        <img src={NoUserVideo} className="aspect-video object-cover rounded-t-lg" alt="No Video" />
      )}

      <div className="w-full mx-2  py-2 flex items-center justify-between">
        {!isUser && (
          <div className="ml-2 flex items-center space-x-4">
            <div>
              { !isVideoEnabled ? (
                <FaVideoSlash
                  color="red"
                  className="w-6 h-auto"
                  // Logic to toggle video track on/off
                />
              ) : (
                <FaVideo
                  color="#00A8FF"
                  className="w-6 h-auto"
                  // Logic to toggle video track on/off
                />
              )}
            </div>
            <div>
              {!isAudioEnabled ? (
                <FaMicrophoneSlash
                  color="red"
                  className="w-6 h-auto"
                  // Logic to toggle audio track on/off
                />
              ) : (
                <FaMicrophone
                  color="#00A8FF"
                  className="w-6 h-auto"
                  // Logic to toggle audio track on/off
                />
              )}
            </div>
          </div>
        )}
        <div className="truncate ml-auto">
          <h1 className="text-white text-sm mr-4 truncate">
            {name}
            {isUser ? ' (Anda)' : ''}
          </h1>
        </div>
      </div>
    </div>
  );
}

function CustomAgoraLocalVideo({ audioTrack, videoTrack, isUser, name, isVideoEnabled=true, isAudioEnabled=true }) {

  
  return (
    
    <div className="flex flex-col bg-slate-950 w-full h-full rounded-lg">
      {isVideoEnabled && videoTrack? ( // i change this
        <AgoraVideoPlayer
          className="aspect-video object-cover rounded-t-lg"
          style={{}} 
          videoTrack={videoTrack}  
        />
      ) : (
        <img src={NoUserVideo} className="aspect-video object-cover rounded-t-lg" alt="No Video" />
      )}

      <div className="w-full mx-2  py-2 flex items-center justify-between">
        {!isUser && (
          <div className="ml-2 flex items-center space-x-4">
            <div>
              { !isVideoEnabled ? (
                <FaVideoSlash
                  color="red"
                  className="w-6 h-auto"
                  // Logic to toggle video track on/off
                />
              ) : (
                <FaVideo
                  color="#00A8FF"
                  className="w-6 h-auto"
                  // Logic to toggle video track on/off
                />
              )}
            </div>
            <div>
              {!isAudioEnabled ? (
                <FaMicrophoneSlash
                  color="red"
                  className="w-6 h-auto"
                  // Logic to toggle audio track on/off
                />
              ) : (
                <FaMicrophone
                  color="#00A8FF"
                  className="w-6 h-auto"
                  // Logic to toggle audio track on/off
                />
              )}
            </div>
          </div>
        )}
        <div className="truncate ml-auto">
          <h1 className="text-white text-sm mr-4 truncate">
            {name}
            {isUser ? ' (Anda)' : ''}
          </h1>
        </div>
      </div>
    </div>
  );
}


function CustomFullScreenAgoraLocalVideo({ showControl= true,audioTrack, videoTrack, isUser, name, isVideoEnabled=true, isAudioEnabled=true }) {

  
  return (
    
    <div className="flex flex-col bg-slate-950 w-full h-full rounded-lg">
      {isVideoEnabled && videoTrack? ( // i change this
        <AgoraVideoPlayer
          className="w-full h-full object-cover rounded-t-lg"
          style={{}} 
          videoTrack={videoTrack}  
        />
      ) : (
        <img src={NoUserVideo} className="w-full h-full object-cover rounded-t-lg" alt="No Video" />
      )}

      {showControl && <div className="w-full mx-2  py-2 flex items-center justify-between">
        {!isUser && (
          <div className="ml-2 flex items-center space-x-4">
            <div>
              { !isVideoEnabled ? (
                <FaVideoSlash
                  color="red"
                  className="w-6 h-auto"
                  // Logic to toggle video track on/off
                />
              ) : (
                <FaVideo
                  color="#00A8FF"
                  className="w-6 h-auto"
                  // Logic to toggle video track on/off
                />
              )}
            </div>
            <div>
              {!isAudioEnabled ? (
                <FaMicrophoneSlash
                  color="red"
                  className="w-6 h-auto"
                  // Logic to toggle audio track on/off
                />
              ) : (
                <FaMicrophone
                  color="#00A8FF"
                  className="w-6 h-auto"
                  // Logic to toggle audio track on/off
                />
              )}
            </div>
          </div>
        )}
        <div className="truncate ml-auto">
          <h1 className="text-white text-sm mr-4 truncate">
            {name}
            {isUser ? ' (Anda)' : ''}
          </h1>
        </div>
      </div>
      }
    </div>
  );
}


function VideoControl({ setting, isUser = false, name = "Ucok GTA" }) {
  

  return (
    <div className="flex flex-col  bg-slate-800 w-full h-full rounded-lg">
      
        {isVideoEnabled ? (
          <video
            muted
            autoPlay
            playsInline
            ref={mediaRef}
            className=" aspect-video object-cover"
          />
        ) : (
          <img src={NoUserVideo} className="aspect-video object-cover "/>
       
        )}

      <div className="w-full bg-slate-950 py-2 flex items-center space-x-4">
        {!isUser && (
          <div className="flex items-center space-x-4">
            <div>
              {isVideoEnabled ? (
                <FaVideo
                  onClick={matikanVideo}
                  color="#00A8FF"
                  className="w-6 h-auto"
                />
              ) : (
                <FaVideoSlash
                  onClick={hidupkanVideo}
                  color="red"
                  className="w-6 h-auto"
                />
              )}
            </div>
            <div>
              {isAudioEnabled ? (
                <FaMicrophone
                  onClick={matikanAudio}
                  color="#00A8FF"
                  className="w-6 h-auto"
                />
              ) : (
                <FaMicrophoneSlash
                  onClick={hidupkanAudio}
                  color="red"
                  className="w-6 h-auto"
                />
              )}
            </div>
          </div>
        )}
        <div className="truncate ml-auto">
          <h1 className="text-white text-sm mr-4 truncate">
            {name}
            {isUser ? "(Anda)" : ""}
          </h1>
        </div>
      </div>
    </div>
  );
}

const AccessPopUp = ({notifier=()=>{}})=>{
  return(
    <div className="fixed  justify-center md:top-4 top-12 w-full px-4 flex items-center text-white text-sm  py-2">
      <div className="flex flex-col px-2 py-2 max-w-[24rem] bg-slate-800 rounded-md">
      <h1 className=" mb-4 mx-2">
        Izinkan kamera atau mikrofon untuk menyambungkan ke  room ini.
      </h1>
      <button onClick={async()=>{
          await getPermission()
          notifier()
      }} className=" ml-auto px-2 py-1 bg-[#00A8FF] hover:bg-blue-800 text-black rounded-sm">
        Izinkan
      </button>
      </div>
    </div>
  )
}
const getPermission = async () => {
  
  try{
   // const res = await AgoraRTC.createMicrophoneAudioTrack();
   const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true // Gunakan state video
    // Gunakan state audio
  });
    console.log('ini berjalan?')
  }
  catch (error) {
    console.log('set ulang')
    console.log(error)
    toast.error("DOM Exception: Permission denied by system")
  }
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
     const stream = await navigator.mediaDevices.getUserMedia({
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
          {expandMiniVideo && participants.map((participant)=>{
            
            return (
              <div className={` relative border-4 border-blue-700 min-w-[25vw] w-[25vw] max-w-[25vw] ${isLandscape? 'aspect-[16/9]' : 'aspect-[9/16]'}`}>
            
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
        {isReactionModalOpen && <div className="z-20 absolute bottom-16 right-2 ">
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
const JoinBox = ({closeBox=()=>{},   submitJoin= async(username,password)=>{
  return "success"
} }) =>{


  const [joinInfo, setJoinInfo] = useState({
   'password':'',
   'username':'',
  })
  const [loading, setLoading] = useState(false)
  const updateJoinInfo = (key, value) => {
   // Clone objek joinInfo saat ini untuk menghindari mutasi langsung
   const updatedJoinInfo = { ...joinInfo };
 
   // Mengubah nilai properti yang sesuai dengan key
   updatedJoinInfo[key] = value;
 
   // Menetapkan objek joinInfo yang telah diperbarui
   setJoinInfo(updatedJoinInfo);
 };


  return <div
  onClick={(e)=>{
    e.stopPropagation()
  }}
    className=" inline-block min-w-[20rem] max-w-[95%] align-bottom bg-slate-800 text-left z-50 shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-headline"
  >
    {/* Tombol close di ujung kanan atas */}
    <button
      onClick={()=>{closeBox()}}
      className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>

    <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
      <div className="sm:flex sm:items-start">
        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
          <h3
            className="text-lg leading-6 font-medium text-gray-900 dark:text-white"
            id="modal-headline"
          >
            Masuk ke Room
          </h3>
          <div className="mt-2">
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-gray-700 dark:text-gray-300"
              >
                Display Name Kamu
              </label>
              <input
                type="text"
                name="username"
                id="username"
                value={joinInfo.username}
                className="mt-1 p-2 w-full border rounded-md bg-gray-100 dark:bg-gray-700 dark:text-gray-300"
                placeholder="Masukkan nama kamu"
                onChange={(e)=>{ updateJoinInfo("username", e.target.value)}}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-gray-700 dark:text-gray-300"
              >
                Password Room ini
              </label>
              <input
                type="password"
                name="password"
                value={joinInfo.password}
                id="password"
                className="mt-1 p-2 w-full border rounded-md bg-gray-100 dark:bg-gray-700 dark:text-gray-300"
                placeholder="Masukkan password room ini"
                onChange={(e)=>{updateJoinInfo("password",e.target.value)}}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="bg-gray-100 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
      <button
        type="button"
        onClick={async ()=>{
          setLoading(true)
          const res = await submitJoin(joinInfo.username, joinInfo.password);
          setLoading(false)
          if(res == "success"){
            closeBox()
          }

        }}
        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#00A8FF] text-base font-medium text-black hover:text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
      >
        {loading? <Loading/> : 'Join'}
      </button>
      <button
        type="button"
        onClick={()=>{}}
        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 dark:focus:ring-gray-500 sm:mt-0 sm:w-auto sm:text-sm"
      >
        Join as Host
      </button>
    </div>
  </div>
}   
const DropdownChat = ({ onSelect, options=[], selectedValue, room}) => {
  const [isOpen, setIsOpen] = useState(false);
  console.log('ini optionnya',options)
  console.log('ini roomnya', room)
  //const [selectedValue, setSelectedValue] = useState(options[0].label);
  const dropdownRef = useRef(null)

  useEffect(() => {
    // Tambahkan event listener ketika komponen sudah ter-mount
    document.addEventListener("mousedown", handleClickOutside);

    // Hapus event listener ketika komponen akan di-unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    //console.log('here')
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        type="button"
        className="inline-flex justify-center w-full rounded-md border border-gray-700 shadow-sm px-4 py-2 bg-gray-800 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
        id="options-menu"
        aria-haspopup="true"
        aria-expanded="true"
      >
        {selectedValue == 'all'? 'Semua' : room? room.participants[selectedValue].guestId.username : 'loading...'}
        <svg
          className="-mr-1 ml-2 h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M6.293 6.293a1 1 0 011.414 0L10 8.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          <div className="py-1" role="none">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => {
                  onSelect(option);
                  setIsOpen(false)
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                role="menuitem"
              >
                {option == 'all'? 'Semua' : room? room.participants[option].guestId.username ?? 'loading...': "loading..." }
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default JoinPage;