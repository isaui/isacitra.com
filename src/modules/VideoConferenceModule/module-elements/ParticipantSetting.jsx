import { useState } from "react";
import { AiFillMessage } from "react-icons/ai";
import LocalSettingDropDown from "./DropdownSetting";
import { MdMoreVert } from "react-icons/md";

const ParticipantSetting = ({data, setSelectedOptionChat, openChatSidebar, participant, participants, setParticipants,
    localMutedParticipantsAudio, localMutedParticipantsVideo,
    setLocalMutedParticipantsAudio,setLocalMutedParticipantsVideo})=>{
      const [isMutedSettingOpen,setIsMutedSettingOpen] = useState(false);
      return ( 
      <div className= {` text-white text-sm w-full py-4  flex items-center`}>
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
    export default ParticipantSetting