import { useDispatch, useSelector } from 'react-redux';
import  {setUser, logoutUser} from '../../slice/authSlice.js';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { useState } from 'react';
import UserDropdown from '../user_dropdown/UserDropdown.jsx';
import { HiPencilAlt } from "react-icons/hi";


export default function (){
    const user = useSelector((state) => state.auth.user)
    const navigate = useNavigate()
    const dispatch = useDispatch();
    //console.log('ini current user ', user)

    
    return (
        <div>
          
          {user ? (
            <div className=' flex space-x-2 items-center'>
              <UserDropdown user={user}/>
              <HiPencilAlt onClick={()=> {navigate('/articles/new')}} className='hidden lg:flex w-7 h-7 rounded-full' color='#00A8FF'/>
            </div>
          ) : (
            <a
              onClick={()=> {
                if(!user){
                  navigate('/authentication')
                }
              }}
              className=" bg-neutral-950 hover:bg-neutral-600 text-white  py-2 px-4 rounded-md"
            >
              Login
            </a>
          )}
        </div>
      );
    }
    
    
