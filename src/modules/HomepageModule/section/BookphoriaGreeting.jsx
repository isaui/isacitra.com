import  { useState } from "react";
import ContactPopup from "../../../components/contact/ContactPopUp";
import { ToastContainer, toast } from "react-toastify";

const BookphoriaGreeting = ()=>{
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
        <div className=" mx-4 mt-6 grid grid-cols-4 gap-2 lg:gap-8 mb-12">
            <div className=" bg-slate-800 lg:bg-opacity-0 mt-3 rounded-md lg:mt-0 bg-opacity-30 lg:order-1 order-2 pt-4 pb-3 lg:col-span-2 col-span-4 flex flex-col justify-center md:justify-start text-center mx-auto lg:text-left text-white w-full greeting-style">
        <div className=" font-bold"></div>
        <h1 className="greeting-style pb-3 px-6 font-bold md:text-6xl sm:text-5xl text-4xl md:py-3">Book<span className=" text-[#00A8FF]">phoria</span></h1>
        <div className="filosofi">
        <p className="text-center md:text-justify md:text-xl sm:text-lg text-sm md:py-7 py-5 px-6">Bookphoria adalah platform web yang bertindak sebagai database buku yang komprehensif. Didesain untuk pencinta buku, Bookphoria memungkinkan pengguna untuk menjelajahi koleksi buku yang luas, mencari informasi tentang buku-buku favorit, dan menemukan rekomendasi berdasarkan preferensi mereka. Dengan antarmuka yang ramah pengguna dan fitur pencarian yang canggih, Bookphoria menjadi destinasi utama bagi mereka yang ingin mengeksplorasi dunia literatur dengan lebih baik.</p>
        </div>
        <div className="flex justify-center lg:justify-start px-6">
            <button onClick={ () => {
                window.location.href = "https://book.isacitra.com"
            }} className=" bg-[#00A8FF] hover:bg-blue-900 hover:text-white rounded-md py-3 px-3 text-sm md:text-base min-w-[200px] text-black">Lihat Selengkapnya</button>
        </div>
        </div>
        <div className="  order-1  lg:mt-0 lg:order-2 col-span-4 lg:col-span-2 flex flex-col justify-center items-center">
        <div className=" mb-1">
        <img className=" h-80 w-auto lg:h-96 "src={"bookphoria.svg"} alt="" />
        </div>
        </div>

        </div>
        {popUpOpen && <ContactPopup onClickOutside={()=> {setPopUpOpen(false)}} notify={notify}/>}
        </>
    
    )
}

export default BookphoriaGreeting