import { useState} from "react";
import Footer from "../../../components/footer/Footer";
import { HomepageNav } from "../../../components/nav/Nav";
import LandingImage from "../../../assets/new_meet/zoomcreate.svg";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import CreateRoomDialog from "../module-elements/CreateRoomDialog";



export default function VideoConferenceHomeScreen  ()  {

    const [isCreateRoomDialogOpen, setOpenCreateRoomDialog] = useState(false);
    const [isSearchRoomDialogOpen, setSearchRoomDialogOpen] = useState(false);
    return <div className=" bg-slate-900">
      <HomepageNav/>
        {isCreateRoomDialogOpen && <CreateRoomDialog onClose={()=>setOpenCreateRoomDialog(false)}/>}
        {isSearchRoomDialogOpen && <SearchRoom onClose={()=> setSearchRoomDialogOpen(false)}/>}
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
            <button onClick={ () => {
              setSearchRoomDialogOpen(true)
            }} className=" bg-[#00A8FF] hover:bg-blue-900 hover:text-white rounded-md py-3 px-3 text-sm md:text-base min-w-[100px] text-black">Join</button>
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

function SearchRoom({isOpen = true, onClose = () => {}}){
  const navigate = useNavigate();
  const [idRoom,setIdRoom] = useState('');
  const handleChangeIdRoom = (event) => {
    setIdRoom(event.target.value)
  }
  const handleSubmit = () => {
    if(idRoom.trim().length == 0){
      return toast.error("Maaf, id room masih kosong", {autoClose: 2000})
    }
    onClose()
    navigate('/video/'+idRoom)
  }
  return (
  <div className={`fixed z-50 inset-0 overflow-y-auto ${isOpen? 'block' : 'hidden'}`}>
    <ToastContainer/>
    <div onClick={onClose} className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0 overflow-y-auto">
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
          <div
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
                    Cari Berdasarkan Id Room
                  </h3>
                  <div className="mt-2">
                    <div className="mb-4">
                      <label
                        htmlFor="idRoom"
                        className="block text-gray-700 dark:text-gray-300"
                      >
                        Id Room
                      </label>
                      <input
                        type="text"
                        name="idRoom"
                        id="idRoom"
                        value={idRoom}
                        className="mt-1 p-2 w-full border rounded-md bg-gray-100 dark:bg-gray-700 dark:text-gray-300"
                        placeholder="Masukkan Id Room"
                        onChange={handleChangeIdRoom}
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
                {'Join'}
              </button>
            </div>
          </div>
    </div>
    
    
    </div>)

}

