import { useRef } from "react";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { agoraClient } from "../utils/AgoraConfig";

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
      
      const newParticipants = [...participants]
      const targetUser = newParticipants.find(participant => participant.participantId == userId);
      if(!targetUser){
          return toast.error('Terjadi kesalahan dalam me-mute video', {autoClose:2000});
      }
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

  export default LocalSettingDropDown