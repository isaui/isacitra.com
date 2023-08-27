import React
, { useEffect,
useRef, 
useState} from "react";
 import { AiOutlineClose } from "react-icons/ai";
 import { Disqus } from "../discussion/Discussion";


 export default function({isOpen, post, isReady, toggleComment, toggle}){
    return <div onClick={toggleComment} className={  `${isOpen? 'fixed w-full h-full min-h-screen min-w-full z-20' : ''}`}><div  className={isOpen?' overflow-y-auto sidebar z-30 fixed right-0 top-0 w-full md:w-[60%] md:max-w-sm  h-screen nav-style  bg-slate-950 blur-none ease-in-out duration-500' : ' z-20 h-full  min-h-screen ease-in-out duration-500 fixed right-[-100%]'}>
        <div className="flex justify-between items-center pt-3 pl-6 pr-6">
            <h1 className="text-white text-2xl ">COMMENTS</h1>
            <button onClick={toggleComment}><AiOutlineClose color="white" size={26}/></button>
        </div>
        <div className=" pt-3 mt-6 overscroll-y-auto pl-6 pr-6 w-full">
        { isReady && <Disqus post={post}/>}
        </div>
    </div>
    </div>
 }