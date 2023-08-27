import React from 'react';
import { FiMessageCircle, FiList, FiHeart, FiThumbsUp, FiThumbsDown} from "react-icons/fi"

import { useSelector, useDispatch } from 'react-redux'

const FloatingTabBar = ({toggleComment, toggleLike, toggleDislike, post, toggleTOC }) => {
  const user = useSelector((state) => state.auth.user)
  return (
    <div className="fixed bottom-12 left-1/2 transform -translate-x-1/2 flex  justify-center bg-slate-950 z-20 md:px-3 px-2 shadow-md rounded-full">
      <div className="flex p-2">
        <div className="w-1/3 flex justify-center items-center mr-2 md:mr-4">
          <button onClick={toggleLike} className="p-2 hover:bg-neutral-800 rounded-full" >
            <FiThumbsUp size={24} color={user && post.likes.includes(user._id)? '#00A8FF' : 'white'}/>
          </button>
          <h1 className='text-white '>{post.likes.length}</h1>
        </div>
        <div className="w-1/3 flex justify-center items-center mr-2 md:mr-4">
          <button onClick={toggleDislike} className="p-2 hover:bg-neutral-800 rounded-full" >
            <FiThumbsDown size={24} color={user && post.dislikes.includes(user._id)? '#00A8FF' : 'white'}/>
          </button>
          <h1 className='text-white '>{post.dislikes.length}</h1>
        </div>
        <div className="w-1/3 flex justify-center mr-2 md:mr-4">
          <button onClick={ ()=> toggleComment()}className="p-2 hover:bg-neutral-800 rounded-full">
            <FiMessageCircle size={24} color='white'/>
          </button>
        </div>
        <div className="w-1/3 flex justify-center ">
          <button onClick={()=>toggleTOC()} className="p-2 hover:bg-neutral-800 rounded-full">
            <FiList size={24} color='white'/>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FloatingTabBar;
