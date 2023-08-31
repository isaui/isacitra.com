import React, { useEffect, useState } from "react";
import { HomepageNav } from "../nav/Nav";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Footer from "../footer/Footer";
import ProfileSettings from "./ProfileSettings";
import  {setUser, logoutUser} from '../../slice/authSlice.js';
import { AiFillLock, AiFillProfile, AiTwotoneAccountBook, AiTwotoneEdit } from "react-icons/ai";
import { FaDoorOpen } from "react-icons/fa";
import PasswordSettings from "./PasswordSettings";
import ArticleManagement from "../article_management/ArticleManagement";
import { ToastContainer, toast } from "react-toastify";
import { Storage } from "../../../firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import axios from "axios";

const Dashboard = () => {
    const user = useSelector((state) => state.auth.user)
    const dispatch = useDispatch()
    const contents = [{title: 'Profil Setting', value:'profilSetting', icon: AiFillProfile},
     {title:'Password', icon: AiFillLock, value:'password'},
                    {title:"My Post", icon: AiTwotoneEdit, value:'myPost'}]
    const navigate = useNavigate()
    const [currentContent, setCurrentContent] = useState(contents[0].value)

    useEffect(()=> {
        if(!user){
            navigate('/authentication')
        }
    }, [user])

    return <div className=" bg-slate-900 ">
    <div className=' min-h-screen flex justify-center items-center flex-col w-full '>
     <div className=' h-full w-full flex  my-auto  max-w-full bg-slate-900'>
       <DashboardSet panels={contents} setCurrentContent={setCurrentContent} currentContent={currentContent}/>
       <div className=" h-screen w-full lg:w-[80%] bg-slate-900 px-4  lg:ml-auto">
            {user && currentContent == contents[0].value && <ProfileSetting />}
            { user && currentContent == contents[1].value && <PasswordSetting/>}
            {user && currentContent == contents[2].value && <ArticleManagement navbarEnabled={false} footerEnabled={false}/>}
       </div>
       <div className=" lg:hidden bg-slate-950 fixed bottom-8 left-1/2 transform -translate-x-1/2 rounded-full px-3 py-3 flex justify-betweens space-x-5">
            {contents.map((data, index)=> <div key={data.title} className="hover:bg-gray-500 rounded-full w-8 h-8 flex justify-center items-center" onClick={()=>{setCurrentContent(data.value)}}><data.icon  color={currentContent == data.value? '#00A8FF':'white'}className="hover:bg-gray-500 rounded-full w-6 h-6"/></div>)}
       </div>
    </div>
    
    
    </div>
</div>
}
const PasswordSetting = () => {
    return (
        <div className=" relative w-full h-screen bg-slate-900 flex flex-col">
            <div className="fixed z-20 top-0 flex justify-center lg:justify-start items-center text-white w-full lg:w-[80%]  py-3 px-8  ">
                <h1 className="  text-2xl md:text-3xl ">Password Setting</h1>
                
                </div>
            <div className="mt-24 text-2xl md:text-3xl text-white ml-3 w-full ">
                <PasswordSettings/>
            </div>
        </div>)
}
const ProfileSetting = () => {
    const dispatch = useDispatch()
    const user = useSelector((state) => state.auth.user)
    const [email, setEmail] = useState(user.email);
    const [username, setUsername] = useState(user.username);
    const [firstName, setFirstName] = useState(user.profile.firstName);
    const [lastName, setLastName] = useState(user.profile.lastName);
    const [bio, setBio] = useState(user.profile.bio);
    const [avatarFile, setAvatarFile] = useState(user.profile.avatar);
    const [loading, setLoading] = useState(false);

    const handleUploadThumbnail = async (e, file) => {
        e.preventDefault();
        if (!file) return;
      
        setLoading(true);
      
        const storageRef = ref(Storage, `files/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
      
        uploadTask
          .then((snapshot) => {
            const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            return getDownloadURL(snapshot.ref);
          })
          .then((downloadURL) => {
            setAvatarFile(downloadURL);
            setLoading(false); // Menghentikan loading setelah berhasil
          })
          .catch((error) => {
            setLoading(false); // Menghentikan loading jika terjadi kesalahan
            alert(error);
          });
      };
      

    const handleSubmit = async () => {
        
        if(username.trim().length == 0){
            return toast.error('Maaf username tidak boleh kosong',{autoClose:2000})
        }
        if(username.trim().includes(' ')){
            return toast.error('Maaf username tidak boleh ada spasi', {autoClose:2000}) 
        }
        if(email.trim().length == 0){
            return toast.error('Maaf email tidak boleh kosong', {autoClose:2000})
        }
        if(!email.trim().includes('@')){
            return toast.error('Maaf email tidak valid', {autoClose:2000})
        }
        if(firstName.trim().length == 0){
            return toast.error('Maaf nama awal tidak boleh kosong', {autoClose:2000})
        }
        if(lastName.trim().length == 0){
            return toast.error('Maaf nama akhir tidak boleh kosong', {autoClose:2000})
        }

        try {
            const res = await axios.post('https://isa-citra.adaptable.app/authentication/updateProfil',{
                _id: user._id,
                newData: {
                    email, username, firstName, lastName, bio, avatar:avatarFile, 
                }

            })
            //console.log(res.data.user)
           setTimeout(()=>{
            dispatch(setUser(res.data.user))
           },2000)
           // console.log(res.data.user)
            toast.success('Berhasil memperbarui profil', {autoClose:2000})
            
        } catch (error) {
            
            if(error.response.status == 400){
                toast.error(error.response.data.message, {autoClose:2000})
            }
        }
        


    }

    return (
    <div className=" relative w-full h-screen  flex flex-col">
        <ToastContainer/>
        <div className="fixed top-0 flex justify-between items-center text-white w-full lg:w-[80%]  py-3 px-8 z-20 ">
            <h1 className=" text-2xl md:text-3xl ">Profile Setting</h1>
            <button onClick={handleSubmit}className=" bg-neutral-950 hover:bg-neutral-800 rounded-sm px-4 py-2 text-base mr-8">
                Save
            </button>
            </div>
        <div className="mt-24 text-2xl md:text-3xl text-white lg:ml-3 w-full  mx-auto ">
            <ProfileSettings user={user} data={{
                email,
                setEmail,
                username,
                setUsername,
                firstName,
                setFirstName,
                lastName,
                setLastName,
                bio,
                setBio,
                avatarFile,
                setAvatarFile:handleUploadThumbnail,
                loading
            }}/>
        </div>
    </div>)
}

const DashboardSet = ({panels, currentContent, setCurrentContent}) => {
    const dispatch = useDispatch()
    const user = useSelector((state) => state.auth.user)
    return (
        <div className=" hidden fixed top-0 left-0 w-[20%] bg-black h-screen lg:flex flex-col ">
            <h1 className=" mt-4 mx-auto text-2xl md:text-3xl text-white mb-2">Dashboard</h1>
            <ul className="  bg-slate-950 mx-4 rounded-md mt-4">
        {panels.map((data, index)=> <div onClick={()=>{setCurrentContent(data.value)}}key={index} className={`${index !== panels.length - 1 ? 'border-b-2 border-slate-900' : ''} ${data.value == currentContent? 'bg-slate-900' : ''}`}><DashboardSideButton option={data}/></div>)}
    </ul>
    <div onClick={()=> {dispatch(logoutUser())}}className=" text-white text-base flex self-end bg-black hover:bg-slate-900  mt-auto p-4 items-center space-x-3 mx-4 mb-6">
        <h1>
            Log Out
        </h1>
        <div>
            <FaDoorOpen className=" w-8 h-8"/>
        </div>
    </div>
        </div>
    )
}

const DashboardSideButton = ({option}) => {
    
    return <button  className= 'p-5 hover:bg-slate-900 flex text-base items-center space-x-3 text-white w-full ' >
        <div className="">
            {<option.icon className='w-8 h-8'/>}
        </div>
        <h1 className=" ml-auto">{option.title}</h1>
        </button>
}

export default Dashboard


