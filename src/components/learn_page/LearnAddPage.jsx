import React, { useState } from "react";
import { HomepageNav } from "../nav/Nav";
import Footer from "../footer/Footer";
import Error from '../../assets/error/error.svg';
import {AiOutlineMenu, AiOutlineClose, AiFillCloseCircle, AiOutlineSearch} from 'react-icons/ai'
import { useNavigate} from 'react-router-dom';
import ZeroArticle from '../../assets/Zero/zero.svg';

export default function () {
    const [title, setTitle] = useState('');
    const [semester, setSemester] = useState('');
    return (
        <div className="">
        <div className=' min-h-screen flex justify-center flex-col items-center w-full'>
            <HomepageNav/>
         <div className=' min-h-screen w-full max-w-5xl flex flex-col items-center'>
         <div className="md:mt-20 mt-24 flex justify-between items-center text-white w-full   py-3 px-8 bg-slate-900 ">
            <h1 className=" text-2xl md:text-3xl ">Tambahkan Mata Kuliah</h1>
            <button className=" bg-neutral-950 hover:bg-neutral-800 rounded-sm px-4 py-2 text-base mr-8">
                Simpan Matkul
            </button>
            </div>

            <div className=" my-2 mx-4 px-8">
            <label htmlFor="title" class="block mb-2 text-sm font-medium text-white">Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)}type="text" id="title" class=" bg-slate-800 focus:border  text-white  text-sm rounded-xs focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Nama Mata Kuliah"></input>
        </div>

        <div className=" my-2 mx-4 px-8">
            <label htmlFor="semester" class="block mb-2 text-sm font-medium text-white">Semester</label>
            <input value={semester} onChange={e => setSemester(e.target.value)}type="text" id="semester" class=" bg-slate-800 focus:border  text-white  text-sm rounded-xs focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Semester 3"></input>
        </div>
        </div>
        </div>
        <Footer/>
    </div>
    )
}