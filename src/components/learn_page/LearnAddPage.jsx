import React, { useState } from "react";
import { HomepageNav } from "../nav/Nav";
import Footer from "../footer/Footer";
import Error from '../../assets/error/error.svg';
import {AiOutlineMenu, AiOutlineClose, AiFillCloseCircle, AiOutlineSearch} from 'react-icons/ai'
import { useNavigate} from 'react-router-dom';
import ZeroArticle from '../../assets/Zero/zero.svg';

export default function () {
    return (
        <div className="">
        <div className=' min-h-screen flex justify-center flex-col items-center w-full'>
            <HomepageNav/>
         <div className=' min-h-screen w-full max-w-[1240px] flex flex-col'>
         <div className="md:mt-20 mt-24 flex justify-between items-center text-white w-full   py-3 px-8 z-20 bg-slate-900 ">
            <h1 className=" text-2xl md:text-3xl ">Tambahkan Mata Kuliah</h1>
            <button className=" bg-neutral-950 hover:bg-neutral-800 rounded-sm px-4 py-2 text-base mr-8">
                Simpan Matkul
            </button>
            </div>
        </div>
        </div>
        <Footer/>
    </div>
    )
}