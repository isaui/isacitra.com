/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import axios from "axios";
import BASE_URL from "../../../api/base_url";
import { toast } from "react-toastify";
import { AiFillCloseCircle } from "react-icons/ai";
import { FaSmile } from "react-icons/fa";
import { MdFrontHand } from "react-icons/md";
import { MdThumbUp } from "react-icons/md";
import { MdWavingHand } from "react-icons/md";
import { FaGrinTears } from "react-icons/fa";

const ReactionPopUp = ({onClose,room, me, setRoom}) => {
    const [reaction, setReaction] = useState('no-reaction');
    useEffect(()=>{
      const itsUpdateOfMe = room.participants[me._id];
      const newReact = itsUpdateOfMe ? itsUpdateOfMe.reaction : 'no-reaction';
      setReaction(newReact)
    },[ ])
    const submitReaction = async (react) => {
      try {
        const res = await axios.post(BASE_URL+"/video/reaction",{
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

export default ReactionPopUp