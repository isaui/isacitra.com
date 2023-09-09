import React, { useState } from "react";
import { HomepageNav } from "../nav/Nav";
import Footer from "../footer/Footer";
import Error from '../../assets/error/error.svg'
import { FaBook } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";

export default function () {
    const [sidebarActive, setSidebarActive] = useState(false);
    const toggleSidebar = () => {
        setSidebarActive(prev => !prev);
    }
    return (
        <div className="">
        <div className=' min-h-screen flex justify-center flex-col items-center w-full'>
            {sidebarActive && <div className=" fixed top-0 left-0 md:hidden z-20 w-[60%]">
                <Sidebar/>
            </div>}
            <button onClick={()=> {
                toggleSidebar()
            }}className="fixed top-3 right-5  p-3 rounded-lg bg-neutral-950 hover:bg-neutral-800">{
            sidebarActive? <AiOutlineClose size={24} color="white"/> : <FaBook  size={24} color="white"/>
            }</button>
        </div>
    </div>
    )
}

const Sidebar = ()=>{
    return (
        <div className=" h-screen bg-slate-950 w-full">

        </div>
    )
}