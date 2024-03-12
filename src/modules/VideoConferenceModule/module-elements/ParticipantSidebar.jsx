/* eslint-disable no-unused-vars */
import { AiFillCloseCircle } from "react-icons/ai";
import ParticipantSetting from "./ParticipantSetting";

const ParticipantsSidebar = ({room, setParticipants,localMutedParticipantsAudio,localMutedParticipantsVideo,setLocalMutedParticipantsAudio,setLocalMutedParticipantsVideo,setSelectedOptionChat, isOpen, closeSidebar, me, participants=[], openChatSidebar})=>{
    console.log(room)
    return <div onClick={(e)=>{e.stopPropagation()}} className={`flex flex-col min-w-[18rem] relative h-screen w-screen md:max-w-[40%] lg:max-w-[30%] bg-slate-950 `}>
      <div className=" absolute right-0 top-0  my-2 flex items-center justify-between w-full">
        <h1 className=" ml-2 text-white text-2xl">Participants</h1>
        <AiFillCloseCircle onClick={closeSidebar} color="#00A8FF" className="mr-2 w-8 h-8 "/>
      </div>
      <div className="mt-16 flex flex-col bg-neutral-900 h-full justify-start overflow-y-auto">
        <div className= {` text-white text-sm w-full py-4  flex items-center`}>
          <div  className={`ml-2 bg-teal-700  w-12 h-12 flex items-center justify-center rounded-full`}>
             {me.username[0]}
          </div>
          <div className="ml-4 flex flex-col items-start space-y-1">
          <h1 className=" text-sm break-words">
            {me? me.username : '...'} {'(Anda)'}
          </h1>
          <div className="text-white bg-blue-400 px-2 py-1 rounded-md text-xs">
            {room.host.guestId._id == me._id? 'Host' : 'Guest'}
          </div>
          </div>
  
        </div>
        {participants.map((participant,index)=>{
          const data = room.participants[participant.participantId];
          if(!data){
            return <div key={`${index}-partisipan-ngelag`}></div>
          }
          return (
            <ParticipantSetting key={data? data.guestId : 'abcdefghijklmn'} 
            data={data}
            room={room}
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
  export default ParticipantsSidebar