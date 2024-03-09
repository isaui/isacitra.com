import { useState } from "react";
import ContactPopup from "../../../components/contact/ContactPopUp";
import { ToastContainer, toast } from "react-toastify";
export default function MoneyManagementGreeting(){
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
        <div className=" rounded-xl px-2 lg:px-8 mt-6 grid grid-cols-4 gap-2 lg:gap-8 mb-12">
            <div className=" order-2 bg-slate-800 lg:bg-opacity-0  rounded-md  bg-opacity-30  pt-4 pb-3 lg:col-span-2 col-span-4 flex flex-col justify-center text-center mx-auto lg:text-left text-white w-full greeting-style">
        <div className=" font-bold"></div>
        <h1 className=" lg:ml-auto greeting-style pb-3 px-6 font-bold md:text-6xl sm:text-5xl text-4xl md:py-3">Money Management<span className=" text-[#00A8FF]"> Web</span></h1>
        <div className="filosofi">
        <p className=" text-justify md:text-xl sm:text-lg text-sm md:py-7 py-5 px-6">Platform manajemen keuangan yang mudah digunakan untuk membantu Anda mengelola dan melacak keuangan pribadi dengan efisien. Kamu dapat mengatur anggaran dan memantau pengeluaran dengan lebih baik. Sederhana, praktis, dan didesain untuk membantu kamu mencapai tujuan keuangan kamu.</p>
        </div>
        <div className="flex justify-center lg:justify-end px-6">
            <button onClick={ () => {
                window.location.href = "https://rfinance.up.railway.app"
                //
            }} className=" bg-[#00A8FF] hover:bg-blue-900 hover:text-white rounded-md py-3 px-3 text-sm md:text-base min-w-[200px] text-black">Lihat Selengkapnya</button>
        </div>
        </div>
        <div className=" order-1   lg:mt-0  col-span-4 lg:col-span-2 flex flex-col justify-center items-center">
        <div className=" mb-1">
        <img className=" h-80 w-auto lg:h-96 "src={"moneymanagement.svg"} alt="" />
        </div>
        </div>

        </div>
        {popUpOpen && <ContactPopup onClickOutside={()=> {setPopUpOpen(false)}} notify={notify}/>}
        </>
    
    )
}