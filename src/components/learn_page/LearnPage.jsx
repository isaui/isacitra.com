import React, { useState } from "react";
import { HomepageNav } from "../nav/Nav";
import Footer from "../footer/Footer";
import Error from '../../assets/error/error.svg';
import {AiOutlineMenu, AiOutlineClose, AiFillCloseCircle, AiOutlineSearch} from 'react-icons/ai'
import { useNavigate} from 'react-router-dom';

export default function ({statusCode, message}) {
    
    
    return (
        <div className="">
        <div className=' min-h-screen flex justify-center flex-col items-center w-full'>
            <HomepageNav/>
         <div className=' min-h-screen w-full max-w-[1240px] flex flex-col'>
            <MobileSearchbar/>
            <div className="flex items-center my-auto h-full">
                <div className=" my-auto h-full flex justify-center items-center mx-auto md:flex-row flex-col-reverse">
                <div className="mx-8">
                <h1 className=" text-red-400 lg:text-5xl md:text-4xl text-3xl mx-auto md:text-left text-center mt-3">{!statusCode? '404' : statusCode}</h1>
                <p className=" text-gray-200 lg:text-2xl md:text-2xl text-lg text-center md:text-left"> {!message? 'Maaf Halaman Tidak Ditemukan.' : message} <br></br> Silahkan Kembali Hehey.</p>
                </div>
                <div className="">
                    <img className= " lg:min-h-[200px] lg:h-[210px] md:min-h-[180px] md:h-[190px] h-[180px]"src={Error} alt="" />
                </div>
                </div>
            </div>
        </div>
        </div>
        <Footer/>
    </div>
    )
}
const MobileSearchbar = () => {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (event) => {
      setQuery(event.target.value);
    };
  
   
  const handleSubmit = (event) => {
  //  console.log(' i want to submit');
    event.preventDefault();
    if(query.trim().length >=1){
      navigate('/search?q='+query);
    }
    setQuery('');
  };
  //fixed top-[64px] left-0
    return (<div className=" bg-slate-900 py-2 px-4  w-full z-10"> 
    <form className="flex items-center" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Cari Matkul..."
        className=" bg-slate-800 rounded-md py-2 pr-10 pl-4 w-full focus:outline-none focus:ring-1 focus:ring-[#00A8FF]"
        value={query}
        onChange={handleInputChange}
      />
      <button
        type="submit"
        className="absolute right-5 top-1/2 transform -translate-y-1/2"
      >
        <AiOutlineSearch size={24} color="#00A8FF" />
      </button>
    </form>
  </div>
)
}