/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { HomepageNav } from "../../../components/nav/Nav";
import Footer from "../../../components/footer/Footer";
import { useNavigate, useParams} from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from "react-redux";
import axios from "axios";
import BASE_URL from "../../../api/base_url";



export default function Page() {
    const {id} = useParams()
    const user = useSelector((state) => state.auth.user);

    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [bab, setBab] = useState('');

    useEffect(()=>{
      if(!user){
        navigate('/authentication', {state:{message:'Anda belum mendapatkan izin untuk mengaksesnya. silahkan masuk atau membuat akun baru'}});
        return;
    }
    }, [user])
    
  

  const handleSubmit = async (e) => {
      e.preventDefault();
      //console.log(htmlText)
      if(!title.trim()){
          toast.error('Judul wajib diisi', {
              autoClose: 2000,
            })
          return;
      }
      
      try {
          const data = {
            title:title,
            bab:bab.trim(),
            materi:[]
          };
         await axios.post(BASE_URL+'/learn/addSection/'+id, data).data;
          toast.success('Berhasil menambahkan section', {
            autoClose: 2000,
          })
          navigate(-1)
  
      } catch (error) {
          console.log(error);
          toast.error(error.response.data['message'], {
            autoClose: 2000,
          })
      }
      
  
    }

    return (
        <div className="">
        <div className=' min-h-screen flex justify-center flex-col items-center w-full'>
            <HomepageNav/>
            <ToastContainer position="top-center" /> 
         <div className=' min-h-screen w-full max-w-5xl flex flex-col items-center px-2'>
         <div className="md:mt-20 mt-24 flex justify-between items-center text-white w-full   py-3  bg-slate-900 ">
            <h1 className=" text-2xl md:text-3xl ">Tambahkan Section</h1>
            <button onClick={(event)=>{
              handleSubmit(event)
            }} className=" bg-neutral-950 hover:bg-neutral-800 rounded-sm px-4 py-2 text-base">
                Save
            </button>
            </div>

            <div className=" my-2 mx-4  w-full ">
            <label htmlFor="title" className="block mb-2 text-sm font-medium text-white">Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)}type="text" id="title" className=" bg-slate-800 focus:border  text-white  text-sm rounded-xs focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Nama Section"></input>
        </div>

        <div className=" my-2 mx-4  w-full">
            <label htmlFor="bab" className="block mb-2 text-sm font-medium text-white">Bab</label>
            <input value={bab} onChange={e => setBab(e.target.value)}type="text" id="bab" className=" bg-slate-800 focus:border  text-white  text-sm rounded-xs focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Dynamic Programming"></input>
        </div>
        </div>
        </div>
        <Footer/>
    </div>
    )
}