import React, { useState } from "react";
import { HomepageNav } from "../nav/Nav";
import Footer from "../footer/Footer";
import Error from '../../assets/error/error.svg';
import {AiOutlineMenu, AiOutlineClose, AiFillCloseCircle, AiOutlineSearch} from 'react-icons/ai'
import { useNavigate} from 'react-router-dom';

export default function () {
    
    const arr = [1,2,3,4,5,6];
    return (
        <div className="">
        <div className=' min-h-screen flex justify-center flex-col items-center w-full'>
            <HomepageNav/>
         <div className=' min-h-screen w-full max-w-[1240px] flex flex-col'>
           <div className=" mt-28 md:mt-24 flex justify-center items-center flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 ">
           <div className="w-full max-w-lg">
           <MobileSearchbar/>
           </div>
           <div className="ml-auto md:ml-0 mr-4">
            <div className=" text-white rounded-md bg-neutral-950 px-5 py-2 hover:bg-neutral-800 text-base">
                <h1>+ Tambahkan Matkul</h1>
            </div>
           </div>
           </div>
           {
            arr.length == 0? <div className="flex items-center my-auto h-full">
            <div className="w-full my-auto h-full flex justify-center items-center mx-auto md:flex-row flex-col-reverse">
            <div className="mx-8">
            <h1 className=" text-red-400 lg:text-5xl md:text-4xl text-3xl mx-auto md:text-left text-center mt-3">Tidak Ada</h1>
            <p className=" text-gray-200 lg:text-2xl md:text-2xl text-lg text-center md:text-left">Matkul belum tersedia. Silahkan menambahkan.</p>
            </div>
            <div className="">
                <img className= " lg:min-h-[200px] lg:h-[210px] md:min-h-[180px] md:h-[190px] h-[180px]"src={Error} alt="" />
            </div>
            </div>
        </div>:
           <div className="my-4 mx-auto text-center md:my-8 justify-center grid grid-flow-row auto-rows-max md:grid-cols-2 lg:grid-cols-3 md:gap-4 lg:gap-6">
                {arr.map((value, index)=> {
                    return <CourseCard/>
                })}
           </div>}
            
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
    return (<div className=" py-2 px-4  w-full relative text-white"> 
    <form className="flex items-center" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Cari Mata Kuliah..."
        className=" bg-zinc-950 rounded-full py-2 pr-10 pl-4 w-full focus:outline-none focus:ring-1 focus:ring-[#00A8FF]"
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

const CourseCard = ({data}) => {
   // const navigate = useNavigate()
    return <div className=" flex-auto my-3 rounded-lg max-w-xs certificate-card w-auto flex flex-col">
             
             <div>
                <img className=' w-full h-auto rounded-t-lg'src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjHo8LPH0dr05KyZ9p_HC-kHB9p36dt2zWOg&usqp=CAU' alt="" />
             </div>
             <div className=" text-gray-100 mx-2 mb-1 mt-3 certificate-title font-bold text-base">
                <h1>Struktur Data Algoritma</h1>
             </div>
             <div className=" text-gray-700 mx-2 text-sm">
                <p>Diterbitkan pada 07 Juni 2016</p>
             </div>
             <div className=" text-white mx-2 text-sm certificate-detail">
             <hr className="border-t-1 border-[#19A7CE] my-2 -mx-2" />
                <p>Semester:  <span>3</span></p>
             </div>
             <div className=" text-white mx-2 text-sm certificate-detail">
             <hr className="border-t-1 border-[#19A7CE] my-2 -mx-2" />
                <p>Dibuat oleh:  <span>Isa Citra Buana</span></p>
             </div>
             <div className=" text-white mx-2 text-sm certificate-detail">
             <hr className="border-t-1 border-[#19A7CE] my-2 -mx-2" />
             </div>
             <div className="mx-2 mt-auto">
                <button className="w-full bg-slate-900 hover:bg-slate-950 text-white py-2 mb-2 rounded-md"><a >Buka</a></button>
             </div>


    </div>
}