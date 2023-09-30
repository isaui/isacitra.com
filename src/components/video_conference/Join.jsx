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
import { AiFillCloseCircle, AiFillVideoCamera } from "react-icons/ai";
import { FaMicrophone, FaMicrophoneSlash, FaUser, FaVideo, FaVideoSlash } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import mongoose, { Mongoose } from "mongoose";
import { MdAddReaction, MdChatBubble, MdContacts, MdScreenShare, MdSend, MdSettings } from "react-icons/md";
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
    const [localStreams, setLocalStreams] = useState({})
    const [participants,setParticipants] = useState([]);
    const { ready, tracks } = useMicrophoneAndCameraTracks();
    const saveStreamData = (userId, streamData) => {
      // Duplikat objek streamData saat ini
      const updatedStreamData = { ...streamData };
      
      // Simpan stream dengan kunci userId
      updatedStreamData[userId] = streamData;
      
      // Perbarui state streamData
      setStreamData(updatedStreamData);
    };

    console.log(participants)

    //console.log(participants)


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
      roomChannel.subscribe('update-room', (message)=>{
        if(!message.data){
          console.log("Data kosong sehingga tidak ada yang perlu dikerjakan")
          return
        }
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

    const handleUserJoin = async (user, mediaType) => {
      
    }
    const handleUserLeft = () => {

    }


    useEffect(()=>{
      if(!me) {
        return
      }
      const init = async () => {
        agoraClient.on("user-published", async (user, mediaType)=>{
          await agoraClient.subscribe(user, mediaType);
          console.log("subscribe success");
          if(mediaType == "video"){
            setParticipants(prev => [...prev, {
              user:user,
              participantId: user.uid,
              videoTrack: user.videoTrack,
              audioTrack:user.audioTrack,
            }])
          
          }
          if(mediaType == "audio"){
            user.audioTrack?.play()
            
          }
        })
        agoraClient.on("user-unpublished", async (user, type)=>{
          console.log("unpublished ", user,type);
          if (type === "audio") {
            user.audioTrack?.stop();
          }
          if (type === "video") {
            setParticipants((prevUsers) => {
              return prevUsers.filter((data) => data.participantId !== user.uid);
            });
          }
        });
  
        agoraClient.on("user-left", (user) => {
          console.log("leaving", user);
          setParticipants((prevUsers) => {
            return prevUsers.filter((data) => data.participantId !== user.uid);
          });
        });
  
        await agoraClient.join(agoraSetting.AGORA_APP_ID,roomId, rtcToken, me._id);
        if (tracks) {
          await agoraClient.publish([tracks[0], tracks[1]])
          setLocalStreams({
            localTrack:tracks[0],
            videoTrack:tracks[1]
          })
        }
  
      }
    if(ready && tracks){
      init()
    }
      
  
    }, [ready,tracks, me])
  

// connect to others
    

useEffect(() => {
    
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
}, [isAudioEnabled, isVideoEnabled]);

const matikanVideo = () => {
    if(mediaRef.current){
       mediaRef.current.srcObject?.getVideoTracks().forEach((track) => {
        track.enabled = false;
      });
    }
    setIsVideoEnabled(false)
}

const hidupkanVideo = () => {
    if(mediaRef.current){
       mediaRef.current.srcObject?.getVideoTracks().forEach((track) => {
        track.enabled = true;
      });
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
    if(!user){
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
    }
    else{
      const res = await axios.post('https://isacitra-com-api.vercel.app/video/addToRoom', {roomId:roomId,password:password, isUser:true, participantId:user._id})
      console.log(res);
      Cookie.set(`room-${roomId}-session`, res.data.token)
      setCookie(res.data.token)
      setRtcToken(res.data.rtcToken)
      setScreen('room')
   //   setRoom(res.data.room)
      setMe(res.data.participant)
    }
    toast('Berhasil masuk ke room')
    return "success";
  } catch (error) {
    console.log(error)
    toast.error(error.response.data.message)
    return "failed";
  }
}

const matikanAudio= () =>{
    if(mediaRef.current){
        mediaRef.current.srcObject?.getAudioTracks().forEach((track) => {
         track.enabled = false;
       });
     }
     setIsAudioEnabled(false)
}
const hidupkanAudio= () => {
    if(mediaRef.current){
        mediaRef.current.srcObject?.getAudioTracks().forEach((track) => {
         track.enabled = true;
       });
     }
     setIsAudioEnabled(true)
}
const userVideoSetting = {
  matikanAudio,hidupkanAudio,matikanVideo,hidupkanVideo,mediaRef,isAudioEnabled,isVideoEnabled
}
    return <div className={`max-h-[${window.innerHeight}px] bg-slate-900`}>
        <ToastContainer/>
        {isError? <ErrorPage statusCode={statusCode} message={errorMessage} />:<>

    <div className='mx-auto min-h-screen flex justify-center items-center flex-col min-w-screen   '>
      {loading? <Loading/> :
        screen == 'room' ? <div className="mx-auto min-h-screen max-h-screen flex justify-center items-center flex-col min-w-screen max-w-screen  ">
          <RoomScreen rtcToken={rtcToken} localStreams={localStreams} userSetting={userVideoSetting} remoteStreamData={streamData} participants={participants}/>
        </div> :<div className='homepage-content  min-h-screen w-full flex flex-col my-auto items-center max-w-full'>
        {isJoinBoxOpen &&
         <div onClick={()=>{setJoinBoxOpen(false)}} className="fixed z-50 top-0 left-0 w-screen flex bg-black bg-opacity-30 flex-col justify-center items-center min-h-screen">
          <JoinBox closeBox={()=>{setJoinBoxOpen(false)}} submitJoin={submitJoin}/>
          </div>}
      <div className=" min-h-screen w-full ">
      <div className="mb-4 lg:mt-24 grid grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-12">
            <div className={` pt-12 md:pt-0 pb-4 px-6 lg:${status == 'actived'? 'col-span-2':'col-span-3'} col-span-3 flex flex-col justify-center text-center mx-auto lg:text-left text-white w-full greeting-style`}>
        
        <div className="flex mx-4 flex-col items-start">
        <div className="flex justify-between  items-start w-full">
        <h1 className="text-left  font-bold md:text-3xl  text-2xl md:pb-3">{room.title}</h1>
        <h1 className={`mt-2 px-2 py-1 ${status == 'actived'? "bg-green-600": status == 'scheduled'?"bg-yellow-600":"bg-red-600"} text-white rounded-lg  text-sm`}>{status}</h1>
        </div>
        <h1 className="text-[#00A8FF]  tracking-wide md:text-lg text-base  ">Dibuat oleh {room.host.userId? room.host.userId.username : room.host.guestId.username }</h1>
        <hr className={` self-center w-full border-b-4 rounded-md ${status == 'scheduled'? "border-yellow-600": status == 'actived'?"border-green-600": "border-red-600"} my-2`}></hr>
        <h1 className="text-[#00A8FF]  tracking-wide md:text-xl text-lg md:py-3">DESKRIPSI</h1>
        </div>
        
        <div className="mx-4 mb-4 filosofi max-h-[14rem]  overflow-y-auto bg-slate-800 rounded-md">
        <p className=" text-justify md:text-xl sm:text-lg text-sm md:py-7 py-3 px-6">{room.description.trim().length > 0?room.description : "Tidak ada deskripsi yang ditampilkan" }.</p>
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
  
  return <div onClick={(e)=>{e.stopPropagation()}} className={`flex flex-col min-w-[18rem] h-screen w-screen md:max-w-[30%] md:max-w-[25%] bg-slate-950 `}>
    <div className="mx-2 my-2 flex items-center justify-between">
      <h1 className=" text-white text-2xl">CHATS</h1>
      <AiFillCloseCircle onClick={closeSidebar} color="#00A8FF" className=" w-8 h-8 "/>
    </div>
    <div className="flex grow bg-slate-900">
      <h1 className="mx-auto my-auto text-white text-sm">Belum ada pesan</h1>
    </div>
    <div className="pt-4 pb-4 md:pb-8 my-2 mx-2 min-h-[3rem] flex justify-between items-center">
      <input type="text" className="text-white grow text-sm py-3 px-2 rounded-md outline-none bg-transparent focus:border-[#00A8FF] border-2 border-[#00A8FF]" placeholder="Masukkan pesan Anda"/>
      <MdSend color="#00A8FF" className="ml-4 w-6 h-6 "/>
    </div>

  </div>
}

function CustomAgoraVideo({ audioTrack, videoTrack, isUser, name }) {
  return (
    <div className="flex flex-col bg-slate-950 w-full h-full rounded-lg">
      {videoTrack ? (
        <AgoraVideoPlayer
          className="aspect-video object-cover rounded-t-lg"
          style={{}}
          videoTrack={videoTrack}
        />
      ) : (
        <img src={NoUserVideo} className="aspect-video object-cover" alt="No Video" />
      )}

      <div className="w-full mx-2  py-2 flex items-center justify-between">
        {!isUser && (
          <div className="ml-2 flex items-center space-x-4">
            <div>
              {videoTrack ? (
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
              {audioTrack ? (
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




const RoomScreen= ({userSetting={}, rtcToken, remoteStreamData = {},localStreams ,participants = []}) => {


//const { ready, tracks } = useMicrophoneAndCameraTracks();
 


  useEffect(()=>{
    if(participants.length > 0){
      changeLayoutMode(modes.allParticipants)
      console.log('ganti')
    }
    else{
      changeLayoutMode(modes.onlyMe)
    }
  },[participants])
  const modes = {
    onlyMe: "only-me",
    screenShare: "screen-share",
    allParticipants: "all-participant",
    focusToOneParticipant: "focus-to-one-participant"
  }
  const [layoutSetting, setLayoutSetting] = useState({
    'mode': modes.onlyMe,
  }) 
  const [openSidebar, setOpenSidebar] = useState(false)

  const changeLayoutMode = (newMode) => {
    setLayoutSetting({ mode: newMode });
  };

  const renderContentBasedOnMode = () => {
    switch (layoutSetting.mode) {
      case modes.onlyMe:
        return (
          <div className="w-screen flex flex-col justify-center h-full items-center max-h-full">
            <div className="w-[120vh] h-auto max-w-[95%] text-white">
              <CustomAgoraVideo audioTrack={localStreams.audioTrack} 
              videoTrack={localStreams.videoTrack} isUser={true}
              name={"Ucok"}
              />
            </div>
            
          </div>
        );
        
      case modes.screenShare:
        return <div className="w-screen flex flex-col justify-center h-full items-center max-h-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-4">
        <div className="w-[120vh] h-auto max-w-[95%] text-white">
              <CustomAgoraVideo audioTrack={localStreams.audioTrack} 
              videoTrack={localStreams.videoTrack} isUser={true}
              name={"Ucok"}
              />
        </div>
        {participants.map((participant) => {
          return <div className="w-[120vh] h-auto max-w-[95%] text-white">
          <CustomAgoraVideo audioTrack={participant.audioTrack} 
          videoTrack={participant.videoTrack} isUser={false}
          name={"Remote"}
          />
    </div>

        })}
        </div>
      </div>;
      case modes.allParticipants:
        return <div className="w-screen flex flex-col justify-center h-full items-center max-h-full">
        <div className={`grid grid-cols-1  justify-center md:grid-cols-2 lg:${participants.length > 2?'grid-cols-3':'grid-cols-2'} gap-x-2 gap-y-2 mx-2 content-center	`}>
        <div className="w-[80vh] lg:w-[100vh] mx-auto h-auto max-w-[85%] md:max-w-[95%] text-white">
              <CustomAgoraVideo audioTrack={localStreams.audioTrack} 
              videoTrack={localStreams.videoTrack} isUser={true}
              name={"Ucok"}
              />
        </div>
        {participants.map((participant) => {
          return <div className="mx-auto w-[80vh] lg:w-[100vh]  h-auto max-w-[85%] md:max-w-[95%] text-white">
          <CustomAgoraVideo audioTrack={participant.audioTrack} 
          videoTrack={participant.videoTrack} isUser={false}
          name={"Remote"}
          />
    </div>

        })}
        </div>
      </div>;
      case modes.focusToOneParticipant:
        return <div></div>;
      default:
        return <div>Tampilan default</div>;
    }
  };


  return <div className="flex  flex-col w-screen h-screen max-h-screen ">

    {/* Chat Sidebar */}
    {openSidebar && <div onClick={()=>{setOpenSidebar(false)}} className="fixed top-0 left-0 z-20 flex w-screen h-screen justify-end ">
      { <Sidebar  isOpen={openSidebar} closeSidebar={()=>{setOpenSidebar(false)}}/>}
    </div>}

    {/* Setting & Participants*/}
    <div className="px-2 py-2 rounded-md z-10 bg-slate-800 fixed top-2 left-2">
      <MdSettings color="#00A8FF" className=" w-6 h-6 "/>
    </div>
    <div className="px-2 py-2 z-10  rounded-md bg-slate-800 fixed top-2 right-2">
      <FaUser color="#00A8FF" className=" w-6 h-6 "/>
    </div>

    {/* Konten */}
    <div className="w-screen grow flex flex-col  bg-[#0F2041] overflow-x-hidden">
    {renderContentBasedOnMode()}
    </div>

    {/* Bottom Bar */}
    <div className="w-full min-h-[4rem]  flex items-center justify-between px-4 md:px-8 lg:px-16 py-2 bg-[#071829]">
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
    </div>
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