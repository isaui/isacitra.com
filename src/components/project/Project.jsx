import React from "react";
import YoutubePlayer from "../react-yt/YtVideoPlayer";
import { AiFillGithub } from "react-icons/ai";
import { FaGoogleDrive } from "react-icons/fa";

const ProjectWithVideo =  ({videoId, name, contributors, label, widgetTitle, widgetContent, index })=>{
    return (
        <div className=" px-4  mt-24 grid grid-cols-3 gap-4 lg:gap-12">

        <div className={` col-span-3 ${index % 2 != 0? 'lg:order-last':''} lg:col-span-1 flex flex-col justify-start items-center`}>
        <YoutubePlayer videoId={videoId} name={name} contributors={contributors} label={label}/>
        </div>
        <div className="  pb-4 px-6 lg:col-span-2 col-span-3 flex flex-col justify-start text-center mx-auto lg:text-left text-white w-full greeting-style">
        
        <h1 className="greeting-style px-6 font-bold md:text-5xl sm:text-4xl text-3xl ">{widgetTitle}</h1>
        <div className="filosofi">
        <p className=" text-justify lg:text-lg text-gray-400 md:text-base sm:text-sm text-sm md:py-7 py-5 px-6">{widgetContent}</p>
        </div>
        <div className="flex justify-center md:space-x-4 space-x-2 lg:justify-start px-6">
            <button className=" bg-slate-950 hover:bg-neutral-950  rounded-md py-3 px-2 text-sm md:text-base md:min-w-[180px] text-white">
             <div className=" flex justify-center items-center">
                <h1 className=" mr-2">Lihat di </h1>
                <AiFillGithub size={28}/>
                </div></button>
                <button className=" bg-slate-950 hover:bg-neutral-950  rounded-md py-3 px-2 text-sm md:text-base md:min-w-[180px] text-white">
             <div className=" flex justify-center items-center">
                <h1 className=" mr-2">Lihat di </h1>
                <FaGoogleDrive size={28}/>
                </div></button>
                <button className=" bg-slate-950 hover:bg-neutral-950  rounded-md py-3 px-2 text-sm md:text-base md:min-w-[180px] text-white">
             <div className=" flex justify-center items-center">
                <h1 className=" mr-2">Lihat Artikel </h1>
                
                </div></button>
        </div>
        </div>
        

        </div>
    
    )}


export {ProjectWithVideo}