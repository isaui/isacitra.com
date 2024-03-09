import { useState } from "react";
import TypingText from "../../../components/typing_text/TypingText";
import ProfilePicture from "../../../assets//profile/profile.svg";
import ContactPopup from "../../../components/contact/ContactPopUp";
import { ToastContainer, toast } from "react-toastify";
export default function Greeting(){
    const  [popUpOpen, setPopUpOpen] = useState(false)

    const notify = (data) => {
        if(data.status == 'success'){
            toast.success(data.message, {autoClose:2000})
        }
        else{
            toast.error(data.message, {autoClose:2000})
        }
    }
    return (<>
    <ToastContainer/>
        <div className=" mt-24 grid grid-cols-3 gap-4 lg:gap-12">
            <div className=" pt-12 pb-4 px-6 lg:col-span-2 col-span-3 flex flex-col justify-center text-center mx-auto lg:text-left text-white w-full greeting-style">
        <div className=" font-bold"><TypingText input={'<div className="text-white flex justify-between items-center px-4"></div>'}/></div>
        <h1 className="greeting-style px-6 font-bold md:text-6xl sm:text-5xl text-4xl md:py-6">Merangkai <span className=" text-[#00A8FF]">Kode</span>, Membangun <span className=" text-[#00A8FF]">Cerita</span>.</h1>
        <div className="filosofi">
        <p className=" text-justify md:text-xl sm:text-lg text-sm md:py-7 py-5 px-6">Halo, perkenalkan saya <span>Isa Citra Buana</span>, seorang mahasiswa Ilmu Komputer yang percaya bahwa setiap baris kode adalah <span>awal dari kisah baru</span>. Dengan <span>fokus pada desain yang estetis dan fungsionalitas yang kuat</span>, saya dengan antusias merangkai kode untuk <span>membawa cerita-cerita digital menjadi nyata</span>.</p>
        </div>
        <div className="flex justify-center lg:justify-start px-6">
            <button onClick={ () => {setPopUpOpen(true)}} className=" bg-[#00A8FF] hover:bg-blue-900 hover:text-white rounded-md py-3 px-3 text-sm md:text-base min-w-[200px] text-black">Hubungi Saya</button>
        </div>
        </div>
        <div className=" col-span-3 lg:col-span-1 flex flex-col justify-center items-center">
        <div className=" mb-3">
        <img className=" w-40 h-40 md:w-64 md:h-64"src={ProfilePicture} alt="" />
        </div>
        <div className="filosofi">
        <h1 className=" text-white text-base md:text-2xl lg:text-xl"> <span>Isa Citra Buana</span> - Apollo CSUI 2022 </h1>
        </div>
        </div>

        </div>
        {popUpOpen && <ContactPopup onClickOutside={()=> {setPopUpOpen(false)}} notify={notify}/>}
        </>
    
    )
}