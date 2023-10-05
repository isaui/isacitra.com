import React, { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import Footer from "../footer/Footer";
import { useParams } from 'react-router-dom';
import Loading from "../loading/Loading";
import LandingImage from "../../assets/new_meet/zoomcreate.svg";
import Scheduled from "../../assets/meet_status/scheduled.svg";
import NoUserVideo from "../../assets/meet_status/novideo.svg";
import ErrorPage from "../error/ErrorPage";
import CountdownTimer from "../time_counter/TimeCounter";
import { AiFillCloseCircle, AiFillMessage, AiFillSetting, AiFillVideoCamera, AiOutlineDotChart } from "react-icons/ai";
import { FaMicrophone, FaMicrophoneSlash, FaUser, FaVideo, FaVideoSlash } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import mongoose, { Mongoose } from "mongoose";
import { MdAddReaction, MdChatBubble, MdContacts, MdMoreVert, MdScreenShare, MdSend, MdSettings } from "react-icons/md";
import Cookie from 'js-cookie';
import {
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

const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();

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
    const [currPeer, setCurrPeer] = useState(null);
    const [streamData, setStreamData] = useState({});
    const [rtcToken, setRtcToken] = useState({});
    const [localStreams, setLocalStreams] = useState(null)
    const [participants,setParticipants] = useState([]);
    const { ready, tracks } = useMicrophoneAndCameraTracks();
    const [firstTime, setFirstTime] = useState(true);
    //console.log(participants)
    console.log('apa isinya? ',room)

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

       const {room,roomId:remoteRoomId} = message.data;
       if(roomId != remoteRoomId){
        console.log("room yang diupdate bukan room saat ini")
        return
       }
       setRoom(room);
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
        } catch (error) {
          console.error('Error accessing media devices:', error);
          setDapatIzin(false)
        }
      };
    
      getMediaStream();
    }, [isAudioEnabled, isVideoEnabled, me]);
    
    useEffect(()=>{
      const cleanUpUser = async () => {
        const res = await axios.post('http://localhost:3001/video/removeFromRoom', {"roomId":roomId, "participantId": me? me._id : 'x'})
        // edit this
      }
      window.addEventListener('unload', cleanUpUser)
      //window.addEventListener('')
      return () => {
        window.removeEventListener('unload', cleanUpUser)
      }
    },[])
   

    useEffect(()=>{
      if(!me) {
        return
      }
      const init = async () => {
        // Memasang event listener ketika pengguna lain mempublikasikan media
        agoraClient.on("user-published", async (user, mediaType) => {
          await agoraClient.subscribe(user, mediaType);
          console.log("subscribe success");
      
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
          }
      
          if (mediaType === "audio") {
             user.audioTrack?.play();
          }
          if(mediaType === "video") {
            user.videoTrack?.play();
          }

        });
      
        // Memasang event listener ketika pengguna lain menghentikan publikasi media
        agoraClient.on("user-unpublished", async (user, type) => {
          console.log("unpublished ", user, type);
        //  await agoraClient.unsubscribe(user, type)
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
           
        });
      
        // Memasang event listener ketika pengguna meninggalkan sesi
        agoraClient.on("user-left", async (user) => {
          console.log("leaving ", user.uid);
          setParticipants((prevParticipants) =>
            prevParticipants.filter((participant) => participant.participantId !== user.uid)
          );
          const res = await axios.post('http://localhost:3001/video/removeFromRoom', {"roomId":roomId, "participantId": user.uid})
          //roomChannel.unsubscribe('update-room');
          //edit this
          console.log("RES DISINI")
          console.log("ADA YG LEFT")
         // 
        });
        // Bergabung ke sesi Agora dengan token dan ID yang sesuai
        await agoraClient.join(agoraSetting.AGORA_APP_ID, roomId, rtcToken, me._id);
      
        // Memublikasikan trek audio dan video lokal
        if (tracks) {
          await agoraClient.publish([tracks[0], tracks[1]]);
          
      
          setLocalStreams({
            audioTrack: tracks[0], // Tentukan trek audio yang sesuai
            videoTrack: tracks[1], // Tentukan trek video yang sesuai
          });
      
          setFirstTime(false);
        }
      };
      
    if(ready && tracks){
      init()
    }
      
  
    }, [ready,tracks, me])
  

// connect to others
    



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
}

const joinWithCookie = async () => {
  try {
    const res = await axios.post('https://isacitra-com-api.vercel.app/video/addToRoomViaToken',{token: cookie});
    setRoom(res.data.room)
    setMe(res.data.participant)
    Cookie.set(`room-${roomId}-session`, res.data.token)
    setCookie(res.data.token)
    setRtcToken(res.data.rtcToken)
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
      toast.error("Maaf nama tidak boleh kosong")
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
    toast.error(error.response.data.message)
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
}




const userVideoSetting = {
  matikanAudio,hidupkanAudio,matikanVideo,hidupkanVideo,mediaRef,isAudioEnabled,isVideoEnabled
}
    return <div className=" bg-slate-900">
        {isError? <ErrorPage statusCode={statusCode} message={errorMessage} />:<>

    <div className='mx-auto min-h-screen flex justify-center items-center flex-col min-w-screen   '>
      {loading? <Loading/> :
        screen == 'room' ? <div className="mx-auto min-h-screen  flex justify-center items-center flex-col min-w-screen max-w-screen  ">
          <RoomScreen me={me} room={room} roomId={roomId} setRoom={setRoom} rtcToken={rtcToken} localStreams={localStreams} userSetting={userVideoSetting} remoteStreamData={streamData} participants={participants}/>
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

const Sidebar = ({isOpen, closeSidebar})=>{
  
  return <div onClick={(e)=>{e.stopPropagation()}} className={`fixed  bottom-0 left-0 flex flex-col min-w-[18rem] h-screen max-h-screen w-screen md:max-w-[40%] lg:max-w-[30%] bg-slate-800 `}>
    <div className="fixed top-0 left-0 w-screen">
    <div className=" bg-slate-950 h-16 flex items-center justify-between w-full min-w-[18rem] md:max-w-[40%] lg:max-w-[30%]">
      <h1 className="ml-2 text-white text-2xl">CHATS</h1>
      <AiFillCloseCircle onClick={closeSidebar} color="#00A8FF" className="mr-2 w-8 h-8 "/>
    </div>
    </div>
    <div className="my-auto w-full bg-slate-800">
      <h1 className=" my-auto mx-auto text-white text-sm">Belum ada pesan</h1>
    </div>
    <div className="fixed bottom-0 left-0 w-screen">
    <div className=" h-16 flex justify-between items-center bg-slate-950  w-full min-w-[18rem] md:max-w-[40%] lg:max-w-[30%]">
      <input type="text" className="text-white grow text-sm py-3 px-2 rounded-md outline-none bg-transparent focus:border-[#00A8FF] border-2 border-[#00A8FF]" placeholder="Masukkan pesan Anda"/>
      <MdSend color="#00A8FF" className="ml-4 w-6 h-6 "/>
    </div>
    </div>
    

  </div>
}

const ParticipantsSidebar = ({room, isOpen, closeSidebar, me, participants=[]})=>{
  
  return <div onClick={(e)=>{e.stopPropagation()}} className={`flex flex-col min-w-[18rem] h-screen w-screen md:max-w-[40%] lg:max-w-[30%] bg-slate-950 `}>
    <div className="mx-2 my-2 flex items-center justify-between">
      <h1 className=" text-white text-2xl">Participants</h1>
      <AiFillCloseCircle onClick={closeSidebar} color="#00A8FF" className=" w-8 h-8 "/>
    </div>
    <div className="flex flex-col bg-slate-900">
      <div className= {`mb-auto text-white text-sm w-full py-4  flex items-center`}>
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
        <div className="flex ml-auto mr-4 items-center space-x-2">
          <AiFillMessage color="white" className="w-8 h-8"/>
          <MdMoreVert color="white" className="w-8 h-8"/>
        </div>
        </div>
        )
      })}
    </div>

  </div>
}


function CustomFullScreenAgoraVideo({ audioTrack, videoTrack, isUser, name, isVideoEnabled=true, isAudioEnabled=true }) {
  console.log('ini video track babi', videoTrack)
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



// i change this
function CustomAgoraVideo({ audioTrack, videoTrack, isUser, name, isVideoEnabled=true, isAudioEnabled=true }) {
  console.log('ini video track babi', videoTrack)
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




const RoomScreen= ({userSetting={}, me,room,  roomId ,setRoom, rtcToken, remoteStreamData = {},localStreams ,participants = []}) => {
  const [showBottomNavbar, setShowBottomNavbar] = useState(false);
  const [timeOutId, setTimeOutId] = useState(null)
  const [isLandscape, setIsLandscape] = useState(false);
  useEffect(()=>{
    if(participants.length == 1){
      changeLayoutMode(modes.peerToPeer)
    }
    else if(participants.length > 0){
      changeLayoutMode(modes.allParticipants)
      console.log('ganti')
    }
    else{
      changeLayoutMode(modes.onlyMe)
    }
  },[participants]);


  

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
    switch (layoutSetting.mode) {
      case modes.onlyMe:
        return (
          <div className="w-screen flex flex-col justify-center h-full items-center max-h-full">
            <div className="w-[120vh] h-auto max-w-[95%] text-white">
              <CustomAgoraLocalVideo audioTrack={localStreams.audioTrack} 
              videoTrack={localStreams.videoTrack} isUser={true}
              name={"Ucok"}
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
            return <div className="w-full h-full"
            key={participant.participantId}>
              <CustomFullScreenAgoraVideo 
            audioTrack={participant.audioTrack}
            videoTrack={participant.videoTrack}
            isUser={false}
            name={"Belum Diberi Nama"}
            isAudioEnabled={participant.isAudioEnabled}
            isVideoEnabled={participant.isVideoEnabled}/>
            </div>
          })}
            <div className={`fixed bottom-20 right-4 w-[25vw] max-w-[25vw] ${isLandscape? 'aspect-[16/9]' : 'aspect-[9/16]'}`}>
            <CustomFullScreenAgoraLocalVideo audioTrack={localStreams.audioTrack} 
              videoTrack={localStreams.videoTrack} isUser={true}
              name={"Ucok"}
              showControl={false}
              isAudioEnabled= {userSetting.isAudioEnabled} 
              isVideoEnabled = {userSetting.isVideoEnabled}
              />
            </div>
          </div>
        );
        
      case modes.screenShare:
        return <div className="w-screen flex flex-col justify-center h-full items-center max-h-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-4">
        <div className="w-[120vh] h-auto max-w-[95%] text-white">
              <CustomAgoraLocalVideo audioTrack={localStreams.audioTrack} 
              videoTrack={localStreams.videoTrack} isUser={true}
              name={"Ucok"}
              isAudioEnabled= {userSetting.isAudioEnabled} // atur ini
              isVideoEnabled = {userSetting.isVideoEnabled}
              />
        </div>
        {
          participants.map((participant)=>{
            return <div className="w-[80vh] lg:w-[100vh] mx-auto h-auto max-w-[85%] md:max-w-[95%] text-white"
            key={participant.participantId}>
              <CustomAgoraVideo 
            audioTrack={participant.audioTrack}
            videoTrack={participant.videoTrack}
            isUser={false}
            name={"Belum Diberi Nama"}
            isAudioEnabled={participant.isAudioEnabled}
            isVideoEnabled={participant.isVideoEnabled}/>
            </div>
          })
        }
        </div>
      </div>;
      case modes.allParticipants:
        return (
          <div className="w-screen  items-center md:mt-0 md:mb-0 flex flex-col justify-center h-full">
            <div className={`grid h-full w-full  gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-4`}>
              <div className="w-full h-full md:w-full lg:w-full mx-auto h-auto max-w-full text-white">
                <CustomAgoraLocalVideo
                  audioTrack={localStreams.audioTrack}
                  videoTrack={localStreams.videoTrack}
                  isUser={true}
                  name={"Ucok"}
                  isAudioEnabled={userSetting.isAudioEnabled}
                  isVideoEnabled={userSetting.isVideoEnabled}
                />
              </div>
              {participants.map((participant) => (
                <div
                  className="w-full md:w-full lg:w-full  mx-auto h-auto max-w-full text-white"
                  key={participant.participantId}
                >
                  <CustomAgoraVideo
                    audioTrack={participant.audioTrack}
                    videoTrack={participant.videoTrack}
                    isUser={false}
                    name={"Belum Diberi Nama"}
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
    

    {/* Chat Sidebar */}
    {openSidebar && <div onClick={()=>{setOpenSidebar(false)}} className="fixed top-0 left-0 z-20 flex w-screen h-screen justify-end ">
      { <Sidebar  isOpen={openSidebar} closeSidebar={()=>{setOpenSidebar(false)}}/>}
    </div>}
    {openParticipantsSidebar && <div onClick={()=>{setOpenParticipantsSidebar(false)}} className="fixed top-0 left-0 z-20 flex w-screen h-screen justify-end ">
      { <ParticipantsSidebar room={room} participants={participants} me={me} isOpen={openParticipantsSidebar} closeSidebar={()=>{setOpenParticipantsSidebar(false)}}/>}
    </div>}

    {/* Setting & Participants*/}
    <div className="px-2 py-2 rounded-md z-10 bg-slate-800 fixed top-2 left-2">
      <MdSettings color="#00A8FF" className=" w-6 h-6 "/>
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
    {localStreams? renderContentBasedOnMode() : <div className="w-screen h-screen flex items-center justify-center"><Loading/></div>}
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
      <MdScreenShare color="#00A8FF" className="w-7 h-7 "/>
      <MdChatBubble color="#00A8FF" onClick={()=>{setOpenSidebar(true)}} className="w-6 h-6 "/>
      <MdAddReaction color="#00A8FF" className="w-6 h-6 "/>
    </div>}
  </div>
}


const JoinBox = ({closeBox=()=>{}, submitJoin= async(username,password)=>{
  return "success"
} }) =>{
  const [joinInfo, setJoinInfo] = useState({
   'password':'',
   'username':'',
  })
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
          const res = await submitJoin(joinInfo.username, joinInfo.password);
          if(res == "success"){
            closeBox()
          }
        }}
        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#00A8FF] text-base font-medium text-black hover:text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
      >
        Join
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

export default JoinPage;