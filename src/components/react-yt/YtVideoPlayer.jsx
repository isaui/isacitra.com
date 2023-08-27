
import React from 'react';
import YouTube from 'react-youtube';
import { FaLinkedin, FaLinkedinIn,  } from 'react-icons/fa';
import { LinkedinIcon } from 'react-share';
import { AiFillLinkedin } from 'react-icons/ai';

const YoutubePlayer = ({ videoId, name, contributors, label }) => {
  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 0,
    },
  };

  return (
    <div className="w-full h-auto mx-auto bg-slate-950 rounded-md ">
      <YouTube videoId={videoId} opts={opts} className=' aspect-video min-h-[200px] w-full rounded-full ' />
      <div className=' bg-neutral-950 min-h-[80px] rounded-b-lg p-2'>
        <div className=' flex justify-between mb-1 items-center'>
        <h1 className=' text-white text-lg '>{name}</h1>
        <button
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs py-1 px-3 rounded-sm transition duration-300">
            {label}
            </button>

        </div>
        <hr className=' border border-[#00A8FF]'/>
        <h2 className=' text-white text-sm mt-1 mb-1'> Kontributor:</h2>

        
        
        <div className=' bg-slate-950 p-3'>
        {contributors.map((value,index)=> 
        <div key={index} className='   flex justify-between items-center mb-1'>
        <h2 className=' text-white text-sm mr-3'> {value.name}</h2>
        <a href={value.link}><AiFillLinkedin color='#00A8FF' size={24}/></a>
        </div>)}

        </div>
      </div>
    </div>
  );
};

export default YoutubePlayer;