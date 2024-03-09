/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from "react";
import { useEffect } from "react";
import BASE_URL from "../../../api/base_url";
import axios from "axios";
import formatTimestampToWIB from "../utils/FormatterToWIB";
import Loading from "../../../components/loading/Loading";
import { AiFillCloseCircle } from "react-icons/ai";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MdSend } from "react-icons/md";
import DropdownChat from "./DropdownChat";


const Sidebar = ({ closeSidebar, onSelect, options, selectedValue, room, me, })=>{
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
        const res = await  axios.post(BASE_URL+'/video/addCommentToRoom', {roomId:room._id, senderId:me._id, receiverId: selectedValue, message: pesan});
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
              filteredChats.map((chat,index)=>{
                if(chat.sender == me._id){
                  return <div key={`${index}${chat.sender}-chat`} className="w-full flex flex-col text-white">
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
  
                return <div key={`${index}${chat.sender}-chat`} className="w-full flex flex-col text-white">
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

  export default Sidebar