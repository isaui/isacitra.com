import React, { useState, useEffect, useRef } from "react";
import Logo from "./Logo";
import  '../../App.css';
import {AiOutlineMenu, AiOutlineClose, AiFillCloseCircle, AiOutlineSearch} from 'react-icons/ai'
import {Searchbar, MobileSearchbar} from "../searchbar/Searchbar";
import { useNavigate } from "react-router-dom";
import AuthBtn from "../auth_btn/AuthBtn";
import { HiPencilAlt } from "react-icons/hi";
import { useDispatch, useSelector } from 'react-redux';
import  {setUser, logoutUser} from '../../slice/authSlice.js';
import UnknownAvatar from '../../assets/unknown/unknown_avatar.svg';
import { FaAddressBook, FaPencilAlt, FaUserCircle, FaDoorOpen } from "react-icons/fa";


const NavLink = ({title, link}) => {
    
    return <a  className= 'p-5 hover:bg-slate-800 flex text-base justify-center' href={link}>{title}</a>
}
const Sidebar = ({links, closeSidebar, isSidebarOpen}) => {
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch()
    const sidebarRef = useRef(null); 
    const navigate = useNavigate();
    
    const handleResize = () => {
        if (window.innerWidth > 768) {
          closeSidebar()
        } 
      };

      useEffect(()=>{
        const handleOutside = (e) =>{
            if(sidebarRef.current && !sidebarRef.current.contains(e.target)){
                closeSidebar()
            }
        }
        window.addEventListener('click', handleOutside)
        return () => {
            document.removeEventListener('click', handleOutside);
          };
      }, [])
    
      useEffect(() => {
        window.addEventListener('resize', handleResize);
        handleResize(); // Panggil handleResize pada awal render
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }, []);
    return (
    <div ref={sidebarRef} className={isSidebarOpen?'flex flex-col  border-r-4 border-[#0E2954]  min-h-screen sidebar fixed left-0 top-0 w-[70%] max-w-xs h-screen nav-style bg-slate-900  ease-in-out duration-500' : 'ease-in-out duration-500 h-screen fixed left-[-100%]'}>
    <div className=" my-4 flex flex-col " >
        { !user? <><div className=" flex justify-center mb-4">
            <Logo/>
        </div>
        <div className="  w-full  flex space-x-2 justify-center">
        <button onClick={()=>{navigate('/authentication')}}
      className="rounded-full border-2  text-sm border-[#00A8FF]  px-4 py-1 transition duration-300 ease-in-out bg-transparent hover:bg-slate-950 hover:border-slate-950 text-white"
         >
            Sign In
        </button>
        <button
        onClick={()=>{navigate('/authentication?reg=true')}}
      className="rounded-full border-2  text-sm border-[#00A8FF]  px-4 py-1 transition duration-300 ease-in-out bg-transparent hover:bg-slate-950 hover:border-slate-950 text-white"
         >
            Sign Up
        </button>
        </div></>:
         <>
        
            
            <div className=" flex-col  items-center flex   text-white w-full">
                <img className="  w-16 h-16 rounded-full sm:w-24 sm:h-24" src={user.profile.avatar == ''? UnknownAvatar : user.profile.avatar} alt="" />
                <h1 className=" mt-2 text-base font-bold">{user.profile.firstName.length + user.profile.lastName.length + 1 > 15? (user.profile.firstName + ' ' +user.profile.lastName).slice(0,11)+'...': user.profile.firstName + ' '+user.profile.lastName}</h1>
                <h3 className=" mt-1 text-sm">@{user.username.length > 14 ? user.username.slice(0,11)+'...': user.username}</h3>
                <div className="flex  w-full justify-center items-center space-x-2 mt-4 ">
                <div onClick={()=>{navigate('/dashboard')}} className=" flex justify-center  items-center space-x-2 rounded-full border-2  text-sm border-[#00A8FF]  px-4 py-1 transition duration-300 ease-in-out bg-transparent hover:bg-slate-950 hover:border-slate-950 text-white">
                    <h1>Akun</h1>
                    <FaUserCircle className=" w-4 h-4"/>
                </div>
                <div onClick={()=>{navigate('/articles/edit')}} className=" flex justify-center  items-center space-x-2 rounded-full border-2  text-sm border-[#00A8FF]  px-4 py-1 transition duration-300 ease-in-out bg-transparent hover:bg-slate-950 hover:border-slate-950 text-white">
                    <h1>Post</h1>
                    <FaPencilAlt className=" w-4 h-4"/>
                </div>
                </div>
            </div>
         
         
         
         </>}
    </div>

    <hr className=" border-[#00A8FF] mx-4"/>

    <div className="h-full">
    <ul className=" bg-teal-700 mx-4 rounded-md mt-4 bg-opacity-10">
        {links.map((value, index)=> <div key={index + 1002}className={`${index !== links.length - 1 ? 'border-b-2 border-slate-900' : ''}`}><NavLink key={index} title={value.title} link={value.link}/></div>)}
    </ul>
    </div>

            {user && <div className=" justify-self-end w-full px-4 mb-16">
                <hr className="border-t-2 border-slate-600"/>
            <button
            onClick={()=> {dispatch(logoutUser())}}
                className=" ml-auto block text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                <div className=" flex space-x-4 items-center mb-1">
                    <h1>Log Out</h1>
                    <FaDoorOpen className=" w-6 h-6"/>
                </div>
                
              </button>
            </div>}
</div>)
}

const NavLinks = ({links}) =>  {
    return (
        <ul className="hidden md:flex">
            {links.map((value, index)=> <NavLink key={index} title={value.title} link={value.link}/>)}
        </ul>
    )
}


const Navbar = ({links, floatingButtonOpen = false}) => {
    const user = useSelector((state) => state.auth.user)
    const [isSidebarOpen, setSidebar] = useState(false);
    const [isSearchbarOpen, setSearchbar] = useState(false)
    const [scrolling, setScrolling] = useState(false);
    const navigate = useNavigate()

    const handleScroll = () => {
        if (window.scrollY > 0) {
            setScrolling(true);
        } else {
            setScrolling(false);
        }
    };

    
    

    const handleResize = () => {
        if (window.innerWidth > 768) {
          setSearchbar(false)
        } 
      };
    
      useEffect(() => {
        window.addEventListener('resize', handleResize);
        window.addEventListener('scroll', handleScroll);
        handleResize(); // Panggil handleResize pada awal render
        
        return () => {
          window.removeEventListener('resize', handleResize);
          window.removeEventListener('scroll', handleScroll);
        };
      }, []);

    const openSidebar = () => {
        setSidebar(true)
        closeSearchbar()
        
    }
    const closeSidebar = () => {
        setSidebar(false)
        
    }
    const toggleSearchbar = () => {
        setSearchbar(prev => !prev)
    }
    const closeSearchbar = () => {
        setSearchbar(prev => false)
    }

    return (<><div className="    fixed top-0 z-20 w-full">
        <div className={`w-full nav-style ${scrolling? ' bg-slate-950' : ' bg-slate-900'} z-30`}>
            <div className="text-white flex justify-between items-center px-4 max-w-[1240px] h-16 mx-auto">
                <div onClick={(e)=>{
                    e.stopPropagation()
                    openSidebar()}} className=" p-3 block md:hidden">
                    <AiOutlineMenu className=' 'size={20} color="#00A8FF"/>
                </div>
                {!isSidebarOpen && <Logo/>}
                <NavLinks links={links}/>
                <div className="  flex items-center mr-3">
                {!isSidebarOpen && <><div onClick= {toggleSearchbar}className="lg:hidden">{isSearchbarOpen? <AiFillCloseCircle size={32}  color="#00A8FF"/> : <div><AiOutlineSearch size={24} color="#00A8FF"/></div>}</div>
                <div className="hidden lg:flex items-center">
                    <Searchbar/>
                    </div></>}
                    {!isSidebarOpen && !isSearchbarOpen && <div className="hidden md:flex ml-3">
                        <AuthBtn/></div>}
                </div>
                <div className='my-sidebar  fixed top-0 right-0'>
                <Sidebar closeSidebar={closeSidebar} links={links} isSidebarOpen={isSidebarOpen}/>
                </div>
                {isSidebarOpen && (
                <div className="fixed right-6 top-4"><AiFillCloseCircle size={32} onClick= {closeSidebar} color="#00A8FF"/></div>
                )}
                {
                    isSearchbarOpen && <><MobileSearchbar/></>
                }
                

                
            
            
            </div>
        </div>
        </div>
        {user && floatingButtonOpen && <div className="fixed bottom-12 right-8 p-4 lg:hidden rounded-full bg-[#00A8FF]  hover:bg-blue-300 z-20">
        <HiPencilAlt onClick={()=> {navigate('/articles/new')}} className=' w-6 h-6 md:w-8 md:h-8 rounded-full' color='black'/>
        </div>}
        </>
        
    )
 };
 const HomepageNav = ({floatingButtonOpen=false}) => {
    return <Navbar floatingButtonOpen={floatingButtonOpen} links={[{link: '/', title: 'Beranda'}, {link: '/articles', title: 'Artikel'}, {link: '/projects', title: 'Projects'}, {link: '/karir', title: 'Karir'}]}/>
 };
 
 export { HomepageNav, NavLink }