import React, { useState, useRef, useEffect } from "react";
import { HomepageNav } from "../nav/Nav";
import ReactQuill from "react-quill"
import 'react-quill/dist/quill.snow.css';
import Footer from "../footer/Footer";
import Editor from "../editor/Editor";
import ImageUpload from '../../components/file_upload/UploadImage'
import AddCategoryForm from "../add_category/AddCategoryForm";
import CategoryLabel from "../category_label/CategoryLabel";
import axios, { formToJSON } from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from "react-redux";
import { Storage } from "../../../firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import mongoose from "mongoose";
import Loading from "../loading/Loading";
import BASE_URL from "../../api/base_url";



export default function () {

    
    const data = useLocation().state;
    //console.log(data)
    const [showOverlay, setShowOverlay] = useState(false);
    const [categories, setCategories] = useState([]);
    const [title, setTitle] = useState('');
    const [htmlText, setHtmlText] = useState('');
    const [thumbnail, setThumbnail] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingDel,setLoadingDel] = useState(false);
    const [currentId, setCurrentId] = useState('');
    const [isUpdate, setIsUpdate] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [uploadStatus, setUploadStatus] = useState('undefined')
    const navigate = useNavigate();
    const {id} = useParams();
    const user = useSelector((state) => state.auth.user)
    const [progresspercent, setProgresspercent] = useState(0);

    useEffect(()=>{
        if(data.note){
            const note = data.note
            setTitle(note.title);
            setCategories(note.categories);
            setThumbnail(note.thumbnail);
            setHtmlText(note.content);
            setCurrentId(note._id)
            setIsReady(true)
        }
        
    }, [])

    useEffect(() => {
        if(!user){
            navigate('/authentication', {state:{message:'Anda belum mendapatkan izin untuk mengaksesnya. silahkan masuk atau membuat akun baru'}})
            return
        }
        
    },[user])

    const handleUploadThumbnail = async (e, file) => {
        e.preventDefault();
        if(!file) return;
        setUploadStatus('uploading')
        const storageRef = ref(Storage, `files/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on("state_changed",
      (snapshot) => {
        const progress =
          Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setProgresspercent(progress);
      },
      (error) => {
        //alert(error);
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

    const handleDelete = async (id) => {
        try {
          setLoadingDel(true)
                if(isReady){
                    const res = await axios.post(BASE_URL+"/learn/deleteNote", {
                        "idMatkul": data.matkulId,
                        "idChapter": data.activeChapterId,
                        "idMateri": data.activeMateriId,
                        "idNote": currentId
                      });
                      setLoadingDel(false)
                      navigate(-1);
                }
                
            
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
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
    setCategories(updatedCategories);
  };
  const setContent = value => {
    setHtmlText(value)
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    const { toc, updatedHtmlString } = generateTableOfContents(htmlText)
    //console.log(htmlText)
    if(!title.trim()){
        toast.error('Judul wajib diisi', {
            autoClose: 2000,
          })
        return;
    }
    else if(!htmlText.trim()){
        toast.error('Konten tidak boleh kosong', {
            autoClose: 2000,
          })
        return;
    }
    try {
        
    const res = await axios.post(BASE_URL+"/learn/editNote", {
      "idMatkul": data.matkulId,
      "idChapter": data.activeChapterId,
      "idMateri": data.activeMateriId,
      "dataMateri": {"title": title, "content":updatedHtmlString, createdAt:Date.now, lastModified: Date.now,
      "categories":categories, "thumbnail":thumbnail},
      "idNote": currentId
    });
    setLoading(false)
    navigate(-1);
    
    

    } catch (error) {
      toast.error("Terjadi kesalahan dalam menambahkan notes", {autoClose: 2000})
        setLoading(false)
        console.log(error)
    }
    

  }

  function generateTableOfContents(htmlString) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const body = doc.querySelector('body');
    const headings = Array.from(body.querySelectorAll('h1, h2, h3, h4, h5, h6'));
  
    headings.forEach((heading, index) => {
      if (!heading.id) {
        heading.outerHTML = `<${heading.tagName.toLowerCase()} id="toc-${index + 1}">${heading.innerHTML}</${heading.tagName.toLowerCase()}>`;
      }
    });
  
    const toc = headings.map((heading, index) => {
      const id = `toc-${index + 1}`;
      const text = heading.textContent;
      return { text, id };
    });
  
    const updatedHtmlString = body.innerHTML;
  
    return { toc, updatedHtmlString };
  }

    const closeOverlay = ()=> {
        setShowOverlay(false)
    }
    return <div>
        <div className=' min-h-screen flex justify-center flex-col w-full'>
            <HomepageNav/>
         <div className='homepage-content flex-grow min-h-screen w-full mt-20'>
         <ToastContainer position="top-center" /> 
         <form  onSubmit={handleSubmit} className=" max-w-[1024px] flex flex-col  mx-auto">
            <div className="my-2 mx-4 flex justify-between items-center">
                <h1 className="text-white text-2xl md:text-4xl">Edit Note</h1>
                {<button  onClick={() => handleDelete(id)}type="button"  className="mt-3 px-5 py-2 bg-red-700 text-white rounded hover:bg-red-500">{loadingDel? <Loading/> : <h1>Delete</h1> }</button>}

            </div>
            <div className=" my-2 mx-4">
            <label htmlFor="title" className="block mb-2 text-sm font-medium text-white">Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)}type="text" id="title" class=" bg-slate-800 focus:border  text-white  text-sm rounded-xs focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Teori relativitas dan pembuktiannya"></input>
        </div>
        <div className=" my-2 mx-4">
            <label htmlFor="thumbnail" className="block mb-2 text-sm font-medium text-white ">Thumbnail</label>
            <ImageUpload setToUpload={handleUploadThumbnail} status={uploadStatus} setStatus={setUploadStatus}/>
        </div>

        <div className=" my-2 mx-4 flex justify-between items-center flex-wrap">
        <div onClick={()=>setShowOverlay(true)}className=" px-5 py-2 my-2 bg-slate-950 text-white rounded hover:bg-slate-800">Add A Category</div>
        <div className="flex flex-wrap">
            {categories.map((value,index)=>{
                return <><div className=" inline-block mr-2"><CategoryLabel key={index} onDelete={handleDeleteCategory} categoryName={value}/></div></>
            })}
        </div>
        </div>
            <div  className="my-2 mx-4">
            <label htmlFor="content" className="block mb-2 text-sm font-medium text-white">Content</label>
            <div className=" bg-slate-800   self-center rounded-lg">
            <Editor setText={setContent} initialText= {htmlText}/>
            </div>
            <div className=" my-2  flex">
            <button  type="button" onClick={async (e) =>{await handleSubmit(e)}} className="mt-3 px-5 py-2 bg-slate-950 text-white rounded hover:bg-slate-800">{!loading? <h1>Post</h1> : <Loading/> }</button>
            </div>
            {showOverlay && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          
            <AddCategoryForm onAddCategory={handleAddCategory} closeOverlay={closeOverlay} />
            
    
        </div>
      )}
            </div>
            

        
         
         </form>
        </div>
        <Footer/>
        </div>
    </div>
}