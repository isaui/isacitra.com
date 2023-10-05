import React, { useState, useEffect, useRef } from "react";
import Footer from "../footer/Footer";
import { HomepageNav } from "../nav/Nav";
import LandingImage from "../../assets/new_meet/zoomcreate.svg";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useSelector, useDispatch } from "react-redux";
import mongoose from "mongoose";
import axios from "axios";
import {v4 as uuidv4} from "uuid";
import Loading from "../loading/Loading";
import { ToastContainer, toast } from 'react-toastify';



export default () => {


    const [isCreateRoomDialogOpen, setOpenCreateRoomDialog] = useState(false)
    const user = useSelector((state) => state.auth.user);
    return <div className=" bg-slate-900">
        {isCreateRoomDialogOpen && <CreateRoomDialog onClose={()=>setOpenCreateRoomDialog(false)}/>}
    <div  className='mx-auto min-h-screen flex justify-center items-center flex-col w-full max-w-[1600px] '>
        
     <div className='homepage-content  min-h-screen w-full flex flex-col my-auto items-center max-w-full'>
      <div className=" min-h-screen w-full ">

        <div className="mb-4 mt-24 grid grid-cols-3 gap-4 lg:gap-12">
            <div className=" pt-12 pb-4 px-6 lg:col-span-2 col-span-3 flex flex-col justify-center text-center mx-auto lg:text-left text-white w-full greeting-style">
        
        <h1 className="greeting-style px-6 font-bold md:text-6xl sm:text-5xl text-4xl md:py-6">Terhubung <span className=" text-[#00A8FF]"> Kapan Saja, Dimana Saja.</span> <span className=" text-[#00A8FF]"></span></h1>
        <div className="filosofi">
        <p className=" text-justify md:text-xl sm:text-lg text-sm md:py-7 py-5 px-6">Saatnya meraih kebebasan dalam berkomunikasi dan berkolaborasi tanpa batasan. Dengan Room video conference ini, Anda dapat mengatur pertemuan dengan mudah dan stabil. Buat Room eksklusifmu sekarang dan nikmati pengalaman video conference yang lebih baik secara gratis.</p>
        </div>
        <div className="mt-4 flex justify-center lg:justify-start px-6 space-x-3">
            <button onClick={ () => {}} className=" bg-[#00A8FF] hover:bg-blue-900 hover:text-white rounded-md py-3 px-3 text-sm md:text-base min-w-[100px] text-black">Join</button>
            <button onClick={ () => {
                setOpenCreateRoomDialog(true)
            }} className=" bg-[#00A8FF] hover:bg-blue-900 hover:text-white rounded-md py-3 px-3 text-sm md:text-base min-w-[200px] text-black">Create New Room</button>
        </div>
        </div>
        <div className=" col-span-3 lg:col-span-1 flex flex-col justify-center items-center">
        <div className=" mb-3">
        <img className=" w-48 h-48 md:w-72 md:h-72"src={LandingImage} alt="" />
        </div>
        </div>

        </div>

      </div>
    </div>
    </div>
    <Footer/>
</div>
}

function CreateRoomDialog({ isOpen = true, onClose = () => {} }) {
    const user = useSelector((state) => state.auth.user);
    const [roomInfo, setRoomInfo] = useState({
      title: '',
      description: '',
      password: '',
      schedule:new Date(),
      status:'actived',
      username:'',
    });
    const [loading, setLoading] = useState(false);
    const  [createdRoom, setCreatedRoom] = useState(null);
    const minDate = new Date()
    const [isScheduling, setScheduling] = useState(false);
    const [isCreatingHost, setCreatingHost] = useState(false);
    const [result, setResult] = useState(false);

    function formatISODateToCustomFormat(isoDateString, locale = 'id-ID', formatOptions = {}) {
      const dateObj = new Date(isoDateString);
    
      // Default format options jika tidak disediakan
      const defaultOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short',
      };
    
      // Gabungkan opsi default dengan opsi yang diberikan (jika ada)
      const mergedOptions = { ...defaultOptions, ...formatOptions };
    
      // Format tanggal dan waktu menjadi string dalam format yang diinginkan
      const formattedDate = dateObj.toLocaleDateString(locale, mergedOptions);
    
      return formattedDate;
    }
  
    const handleChange = (e) => {
      //console.log(e.target.name)
      const { name, value } = e.target;
      setRoomInfo({ ...roomInfo, [name]: value });
      //console.log(roomInfo)
    };
    const handleCreate = () => {
      if(!user){
        setCreatingHost(true)
      }
      else{
      handleSubmit()
    }}
  
    const handleScheduleRoom = () => {
      // Lakukan sesuatu untuk menjadwalkan ruangan
      // Setelah itu, tutup dialog
      setScheduling(true)
      setRoomInfo({...roomInfo, "status":"scheduled"})
    };

    const handleBackfromSchedule = ()=>{
      //setRoomInfo({...roomInfo, "status":"actived"})
      setScheduling(false)
    }
    const handleSubmit = async ()=> {
      try {
        setLoading(true)
            const uuid = uuidv4();
            const roomId = new mongoose.Types.ObjectId();
            const guestId = new mongoose.Types.ObjectId();
            const data = {
              roomId: roomId,
              title: roomInfo.title,
              description: roomInfo.description,
              password: roomInfo.password,
              host: {
                userId: null,
                guestId: guestId,
                participantType: "guest"
              },
              scheduledTime: roomInfo.status == "actived"? new Date() : new Date(roomInfo.schedule),
              hostKey: uuid.slice(0,6),
              status:roomInfo.status
            }
            
            const guest = await axios.post('https://isacitra-com-api.vercel.app/video/guest',{
              roomId:roomId,
              guestId: guestId,
              username: roomInfo.username,
            });
            const room = await axios.post('https://isacitra-com-api.vercel.app/video/createRoom', data);
            setCreatedRoom(room.data)
            console.log(guest, room);
            setLoading(false)
            setResult(true)
        toast.success("Berhasil membuat room",{autoClose:2000})
      } catch (error) {
        setLoading(false)
        setCreatedRoom(null)
        toast.error("Tidak terhubung dengan server. Cobalah beberapa saat lagi",{autoClose:2000})
        console.log(error)
      }
    }
  
    // Menonaktifkan overflow pada elemen <body> saat dialog terbuka
    useEffect(() => {
      const handleBodyOverflow = (event) => {
        document.body.style.overflow = isOpen ? 'hidden' : 'auto';
      };
  
      if (isOpen) {
        document.body.style.overflow = 'hidden';
        window.addEventListener('scroll', handleBodyOverflow);
      } else {
        document.body.style.overflow = 'auto';
        window.removeEventListener('scroll', handleBodyOverflow);
      }
  
      return () => {
        window.removeEventListener('scroll', handleBodyOverflow);
      };
    }, [isOpen]);
  
    return (
      <div
      onClick={
        ()=>{
            onClose()
        }
    } 
        className={`fixed z-50 inset-0 overflow-y-auto ${
          isOpen ? 'block' : 'hidden'
        }`}
      >
        <ToastContainer/>
        {/* Lapisan overlay dengan bayangan */}
        <div className="fixed inset-0 "></div>
  
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0 overflow-y-auto">
          <div
            className="fixed inset-0 -z-20 transition-opacity"
            aria-hidden="true"
          >
            <div className="absolute inset-0 bg-gray-900 bg-opacity-50  "></div>
          </div>
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen text-black"
            aria-hidden="true"
          >
            &#8203;
          </span>
          {/* Konten dialog */}
         {result? <div
  onClick={(e) => {
    e.stopPropagation();
  }}
  className="inline-block min-w-[20rem] max-w-[95%] align-bottom bg-slate-800 text-left z-50 shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-headline"
>
  <button
    onClick={onClose}
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
      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full min-h-[21rem]">
        <h3
          className="text-xl  font-bold leading-6 font-medium text-green-700 "
          id="modal-headline"
        >
          YOUR MEETING IS READY
        </h3>
        <div className="mt-2 text-base">
          <div className="mb-4">
            <label
              htmlFor="hostKey"
              className="block text-gray-700 dark:text-gray-300"
            >
              Host Key
            </label>
            <div className="">
              <pre
                name="hostKeyContainer"
                id="hostKeyContainer"
                className="flex justify-between items-center mt-1 p-2 w-full border rounded-md bg-gray-100 dark:bg-gray-700 dark:text-gray-300"
              >
                <h1 className="w-[85%] truncate" id="hostKey">{!createdRoom? "Terdapat kesalahan" : createdRoom.hostKey }</h1>
                <button
                onClick={() => {
                  const usernamePre = document.getElementById('hostKey');
                  if (usernamePre) {
                    const textToCopy = usernamePre.textContent;
                    navigator.clipboard.writeText(textToCopy)
                      .then(() => {
                        // Teks berhasil disalin ke clipboard
                        
                      })
                      .catch((error) => {
                        // Gagal menyalin teks ke clipboard
                       
                      });
                  }
                }}
                className="px-2 py-1 bg-[#00A8FF] text-sm text-black rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
              >
                Salin
              </button>
              </pre>
              
              
            </div>

            <div className="mt-2 text-base">
            <div className="mb-4">
            <label
              htmlFor="hostKey"
              className="block text-gray-700 dark:text-gray-300"
            >
              Link Meeting
            </label>
            <div className="">
              <pre
                name="linkContainer"
                id="linkContainer"
                className="flex justify-between items-center mt-1  p-2 w-full border rounded-md bg-gray-100 dark:bg-gray-700 dark:text-gray-300"
              >
                <h1 className="w-[85%] truncate" id="videoLink">{!createdRoom? "Terdapat kesalahan" : "isacitra.com/video/"+createdRoom._id }</h1>
                <button
                onClick={() => {
                  const usernamePre = document.getElementById('videoLink');
                  if (usernamePre) {
                    const textToCopy = usernamePre.textContent;
                    navigator.clipboard.writeText(textToCopy)
                      .then(() => {
                        // Teks berhasil disalin ke clipboard
                       
                      })
                      .catch((error) => {
                        // Gagal menyalin teks ke clipboard
                       
                      });
                  }
                }}
                className=" px-2 py-1 bg-[#00A8FF] text-sm text-black rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
              >
                Salin
              </button>
              </pre>
              
              
            </div>
            </div>
            </div>
          </div>
          {
            createdRoom && <div className="text-gray-700 dark:text-gray-300 w-full flex justify-between items-center text-base">
            <h1>Status Pertemuan: </h1> 
            <div className={`px-2 rounded-md py-1 ${createdRoom.status == 'actived'? 'bg-green-600': 'bg-yellow-600'}`}>
            {roomInfo.status == 'actived' ? 'Sedang Aktif' : 'Berjadwal'}
            </div>
          </div>
          }
          {
            createdRoom && <div className="mt-2 w-full text-gray-300 flex flex-col md:flex-row md:justify-between justify-start items-start md:items-center">
            <h1 className="">Jadwal Meet: </h1>
            <h1 className="text-[#00A8FF]">{formatISODateToCustomFormat(createdRoom.scheduledTime)}</h1>
          </div>
          }
        </div>
      </div>
    </div>
  </div>
  <div className="bg-gray-100 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
    <button
      type="button"
      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#00A8FF] text-base font-medium text-black hover:text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
    >
      {!createdRoom?"Room is Not Open yet":new Date() > new Date(createdRoom.scheduledTime) ? "Join Now" : 'Room is Not Open yet'}
    </button>
    <button
      type="button"
      onClick={() => {
        onClose()
      }}
      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 dark:focus:ring-gray-500 sm:mt-0 sm:w-auto sm:text-sm"
    >
      Close
    </button>
  </div>
</div>
:isCreatingHost? <div
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
              onClick={onClose}
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
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full min-h-[21rem]">
                  <h3
                    className="text-lg leading-6 font-medium text-gray-900 dark:text-white"
                    id="modal-headline"
                  >
                    Host Setup
                  </h3>
                  <div className="mt-2">
                    <div className="mb-4">
                      <label
                        htmlFor="username"
                        className="block text-gray-700 dark:text-gray-300"
                      >
                        Host Username
                      </label>
                      <input
                        type="text"
                        name="username"
                        id="username"
                        value={roomInfo.username}
                        className="mt-1 p-2 w-full border rounded-md bg-gray-100 dark:bg-gray-700 dark:text-gray-300"
                        placeholder="Create your username"
                        onChange={handleChange}
                      />
                    </div>
                   
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#00A8FF] text-base font-medium text-black hover:text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                {loading? <Loading/>:'Create Room'}
              </button>
              <button
                type="button"
                onClick={()=>{
                  setCreatingHost(false)

                }}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 dark:focus:ring-gray-500 sm:mt-0 sm:w-auto sm:text-sm"
              >
                Back
              </button>
            </div>
          </div>:!isScheduling?  <div
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
              onClick={onClose}
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
                    Create New Room
                  </h3>
                  <div className="mt-2">
                    <div className="mb-4">
                      <label
                        htmlFor="title"
                        className="block text-gray-700 dark:text-gray-300"
                      >
                        Room Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        id="title"
                        value={roomInfo.title}
                        className="mt-1 p-2 w-full border rounded-md bg-gray-100 dark:bg-gray-700 dark:text-gray-300"
                        placeholder="Your room title"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="description"
                        className="block text-gray-700 dark:text-gray-300"
                      >
                        Room Description
                      </label>
                      <textarea
                        name="description"
                        id="description"
                        value={roomInfo.description}
                        rows="3"
                        className="mt-1 p-2 w-full border rounded-md bg-gray-100 dark:bg-gray-700 dark:text-gray-300"
                        placeholder="Your room description (optional)"
                        onChange={handleChange}
                      ></textarea>
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="password"
                        className="block text-gray-700 dark:text-gray-300"
                      >
                        Room Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={roomInfo.password}
                        id="password"
                        className="mt-1 p-2 w-full border rounded-md bg-gray-100 dark:bg-gray-700 dark:text-gray-300"
                        placeholder="your room password"
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                onClick={handleCreate}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#00A8FF] text-base font-medium text-black hover:text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                {loading? <Loading/>:user? "Create Room" : "Create Host"}
              </button>
              <button
                type="button"
                onClick={handleScheduleRoom}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 dark:focus:ring-gray-500 sm:mt-0 sm:w-auto sm:text-sm"
              >
                Schedule Room
              </button>
            </div>
          </div>:
           <div
           onClick={(e)=>{
             e.stopPropagation()
           }}
             className=" inline-block md:min-w-[20rem] min-w-[24rem]  max-w-[95%] align-bottom bg-slate-800 text-left z-50 shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
             role="dialog"
             aria-modal="true"
             aria-labelledby="modal-headline"
           >
             {/* Tombol close di ujung kanan atas */}
             <button
               onClick={onClose}
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
                 <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full min-h-[21rem]">
                   <h3
                     className="text-lg leading-6 font-medium text-gray-900 dark:text-white"
                     id="modal-headline"
                   >
                     Schedule Your Room
                   </h3>
                   <div className="mt-2 w-full flex overflow-x-auto">
                   <DatePicker
                        selected={roomInfo.schedule}
                        onChange={(date) => {
                            if(date > minDate){
                                setRoomInfo({ ...roomInfo, schedule: date })
                            }
                        }}
                        open
                        showPopperArrow={false}
                    
                        showTimeSelect
                        timeFormat="HH:mm"
                        dateFormat="MMMM d, yyyy h:mm aa"
                        customInput={
                            <input
                              type="text"
                              className="mt-1 py-2 px-4 w-full min-w-[16rem] rounded-sm bg-slate-900 text-sm text-gray-300"
                              placeholder="Select date and time"
                            />
                          }
                          minDate={minDate}
                          
                          monthClassName={(month)=>{
                            return "bg-slate-950 text-white"
                          }}
                        weekDayClassName={(weekDay)=>{
                            return "bg-slate-950 text-white"
                        }}
                        calendarClassName="bg-slate-800 text-black"
                        wrapperClassName="bg-slate-800 text-white w-full"
                        className="bg-[#00A8FF]"
                        timeClassName={(time) => {
                            // Fungsi ini akan dipanggil untuk setiap waktu dalam kalender.
                            // Anda dapat menentukan kelas yang akan diterapkan pada waktu-waktu tertentu.
                            
                            if(time < minDate){
                                return "bg-red-950 text-white"
                            }
                            return "bg-slate-950  text-white"
                        }}
                        dayClassName={(date)=>{
                            if(date.getUTCDate() + 1 === roomInfo.schedule.getUTCDate() && date.getUTCMonth() === roomInfo.schedule.getUTCMonth() && date.getUTCFullYear() === roomInfo.schedule.getUTCFullYear()){
                                return "bg-blue-900 text-white"
                            }

                            if (date.getUTCDate() + 1 === minDate.getUTCDate() && date.getUTCMonth() === minDate.getUTCMonth() && date.getUTCFullYear() === minDate.getUTCFullYear()) {
                                return "bg-slate-950 text-white"; // Tanggal hari ini
                              }
                              if (date < minDate) {
                                return "bg-red-950 text-white"; // Tanggal sebelum hari ini
                              }
                              return "bg-slate-900 text-white"; 
                        }}
                        

                    />
                   </div>
                 </div>
               </div>
             </div>
             <div className="bg-gray-100 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
               <button
                 type="button"
                 onClick={handleCreate}
                 className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#00A8FF] text-base font-medium text-black hover:text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
               >
                 {loading? <Loading/>: user? "Create Room" : "Create Host"}
               </button>
               <button
                 type="button"
                 onClick={handleBackfromSchedule}
                 className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 dark:focus:ring-gray-500 sm:mt-0 sm:w-auto sm:text-sm"
               >
                 Back
               </button>
             </div>
           </div>}
        </div>
      </div>
    );
  }