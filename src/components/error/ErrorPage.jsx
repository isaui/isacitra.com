import React from "react";
import { HomepageNav } from "../nav/Nav";
import Footer from "../footer/Footer";
import Error from '../../assets/error/error.svg'

export default function ({statusCode, message}) {
    return (
        <div className="">
        <div className=' min-h-screen flex justify-center flex-col items-center w-full'>
            <HomepageNav/>
         <div className=' min-h-screen w-full max-w-[1240px] flex flex-col'>
            <div className="flex items-center my-auto h-full">
                <div className=" my-auto h-full flex justify-center items-center mx-auto md:flex-row flex-col-reverse">
                <div className="mx-8">
                <h1 className=" text-red-400 lg:text-5xl md:text-4xl text-3xl mx-auto md:text-left text-center mt-3">{!statusCode? '404' : statusCode}</h1>
                <p className=" text-gray-200 lg:text-2xl md:text-2xl text-lg text-center md:text-left"> {!message? 'Maaf Halaman Tidak Ditemukan.' : message} <br></br> Silahkan Kembali.</p>
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