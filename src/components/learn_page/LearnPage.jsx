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
    return (<div className=" bg-red-600 py-2 px-4  w-full relative"> 
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