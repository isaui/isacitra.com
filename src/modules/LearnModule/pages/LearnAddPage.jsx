/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { HomepageNav } from "../../../components/nav/Nav";
import Footer from "../../../components/footer/Footer";
import { useNavigate} from 'react-router-dom';
import CategoryLabel from "../../../components/category_label/CategoryLabel";
import { Storage } from "../../../../firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import ImageUpload from '../../../components/file_upload/UploadImage';
import AddCategoryForm from "../../../components/add_category/AddCategoryForm";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from "react-redux";
import axios from "axios";
import mongoose from "mongoose";
import BASE_URL from "../../../api/base_url";



export default function Page() {
    const user = useSelector((state) => state.auth.user);
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [semester, setSemester] = useState('');
    const [uploadStatus,setUploadStatus] = useState(false);
    const [thumbnail,setThumbnail] = useState('');
    const [categories, setCategories] = useState([]);
    const [showOverlay, setShowOverlay] = useState(false);

    useEffect(()=>{
      if(!user){
        navigate('/authentication', {state:{message:'Anda belum mendapatkan izin untuk mengaksesnya. silahkan masuk atau membuat akun baru'}});
        return;
    }
    }, [user])
    const closeOverlay = ()=> {
        setShowOverlay(false)
    }
    const handleUploadThumbnail = async (e, file) => {
        e.preventDefault();
        if(!file) return;
        setUploadStatus('uploading')
        const storageRef = ref(Storage, `files/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on("state_changed",
      (snapshot) => {
          Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      },
      (error) => {
        console.error(error)
        setUploadStatus('error')
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setThumbnail(downloadURL)
          setUploadStatus('success')
        });
      }
    );

    }
    const handleAddCategory = (categoryName) => {
        if(! categories.includes(categoryName)){
            const newCategories = [...categories, categoryName];
            setCategories(newCategories);
        }
    
        setShowOverlay(false);
  };
  const handleDeleteCategory = (categoryName) => {
    const updatedCategories = categories.filter((category) => category !== categoryName);
    setCategories(updatedCategories);}

  const handleSubmit = async (e) => {
      e.preventDefault();
      //console.log(htmlText)
      if(!title.trim()){
          toast.error('Judul wajib diisi', {
              autoClose: 2000,
            })
          return;
      }
      
      try {
          const data = {
            _id: new mongoose.Types.ObjectId(),
            title:title,
            semester:semester,
            categories:categories,
            chapters:[],
            thumbnail:thumbnail,
            author:user
          };
          await axios.post(BASE_URL+'/learn', data)
          toast.success('Berhasil menambahkan mata kuliah', {
            autoClose: 2000,
          })
          navigate(-1)
  
      } catch (error) {
          console.log(error);
          toast.error(error.response.data['message'], {
            autoClose: 2000,
          })
      }
      
  
    }

    return (
        <div className="">
        <div className=' min-h-screen flex justify-center flex-col items-center w-full'>
            <HomepageNav/>
            <ToastContainer position="top-center" /> 
         <div className=' min-h-screen w-full max-w-5xl flex flex-col items-center px-2'>
         <div className="md:mt-20 mt-24 flex justify-between items-center text-white w-full   py-3  bg-slate-900 ">
            <h1 className=" text-2xl md:text-3xl ">Tambahkan Mata Kuliah</h1>
            <button onClick={(event)=>{
              handleSubmit(event)
            }} className=" bg-neutral-950 hover:bg-neutral-800 rounded-sm px-4 py-2 text-base">
                Save
            </button>
            </div>

            <div className=" my-2 mx-4  w-full ">
            <label htmlFor="title" className="block mb-2 text-sm font-medium text-white">Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)}type="text" id="title" className=" bg-slate-800 focus:border  text-white  text-sm rounded-xs focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Nama Mata Kuliah"></input>
        </div>

        <div className=" my-2 mx-4  w-full">
            <label htmlFor="semester" className="block mb-2 text-sm font-medium text-white">Semester</label>
            <input value={semester} onChange={e => setSemester(e.target.value)}type="text" id="semester" className=" bg-slate-800 focus:border  text-white  text-sm rounded-xs focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="3"></input>
        </div>

        <div className=" my-2 mx-4  w-full">
            <label htmlFor="thumbnail" className="block mb-2 text-sm font-medium text-white ">Thumbnail</label>
            <ImageUpload setToUpload={handleUploadThumbnail} status={uploadStatus} setStatus={setUploadStatus}/>
        </div>

        <div className=" my-2 mx-4 flex justify-between items-center flex-wrap w-full">
        <div onClick={()=>setShowOverlay(true)}className=" px-5 py-2 my-2 bg-slate-950 text-white rounded hover:bg-slate-800">Add A Category</div>
        <div className="flex flex-wrap">
            {categories.map((value,index)=>{
                return <><div className=" inline-block mr-2"><CategoryLabel key={index} onDelete={handleDeleteCategory} categoryName={value}/></div></>
            })}
        </div>
        </div>


        {showOverlay && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          
            <AddCategoryForm onAddCategory={handleAddCategory} closeOverlay={closeOverlay} />
            
    
        </div>
      )}
        </div>
        </div>
        <Footer/>
    </div>
    )
}