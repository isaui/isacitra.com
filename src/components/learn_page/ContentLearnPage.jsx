import React, { useEffect, useRef, useState } from "react";

import { HomepageNav } from "../nav/Nav";
import Footer from "../footer/Footer";
import Error from '../../assets/error/error.svg'
import { FaBook, FaCaretDown, FaCaretUp, FaPencilAlt } from "react-icons/fa";
import { AiOutlineClose, AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from "../loading/Loading";
import mongoose from "mongoose";
import { useSelector } from "react-redux";
import { HashtagList } from "../article/ArticleCard";
import { getDayString, getMonthString } from "../../../utils/date";
import {io} from 'socket.io-client';

const socket = io('https://isa-citra.adaptable.app', {
  reconnectionDelay: 1000,
  reconnection: true,
  reconnectionAttemps: 10,
  transports: ['websocket'],
  agent: false,
  upgrade: false,
  rejectUnauthorized: false
})

const AddVideoBox = ({ onConfirm, onCancel, text, buttonText, loading }) => {
  const [judulMateri, setJudulMateri] = useState('');
  const [urlVideo, setUrlVideo] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const user = useSelector((state) => state.auth.user);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'judulMateri') {
      setJudulMateri(value);
    } else if (name === 'urlVideo') {
      setUrlVideo(value);
    } else if (name === 'deskripsi') {
      setDeskripsi(value);
    }
  };

  return (
    <>
    <ToastContainer/>
    <div onClick={() => onCancel()} className="fixed inset-0 flex items-center justify-center z-50">
      <div className="relative w-full max-w-md mx-auto my-6 mx-[10%]">
        <div onClick={(e) => { e.stopPropagation() }} className="relative flex flex-col w-full bg-gray-900 border-2 border-blue-600 rounded-lg shadow-lg outline-none focus:outline-none">
          <div className="flex items-start justify-between p-5 border-b border-gray-700 rounded-t">
            <h3 className="text-2xl font-semibold text-white">{text}</h3>
            <button
              className="p-1 ml-auto bg-transparent border-0 text-white opacity-70 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
              onClick={onCancel}
            >
              <span className="text-white h-6 w-6 text-2xl block outline-none focus:outline-none">
                ×
              </span>
            </button>
          </div>
          <div className="relative p-6 flex-auto">
            <label className="text-white md:text-lg text-base leading-relaxed">Judul Video:</label>
            <input
              type="text"
              name="judulMateri"
              value={judulMateri}
              onChange={handleInputChange}
              className="my-2 px-3 py-2 w-full bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring focus:border-blue-300"
            />

            <label className="text-white md:text-lg text-base leading-relaxed">URL Video Youtube:</label>
            <input
              type="text"
              name="urlVideo"
              value={urlVideo}
              onChange={handleInputChange}
              className="my-2 px-3 py-2 w-full bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring focus:border-blue-300"
            />

            <label className="text-white md:text-lg text-base leading-relaxed">Deskripsi:</label>
            <textarea
              name="deskripsi"
              value={deskripsi}
              onChange={handleInputChange}
              className="my-2 px-3 py-2 w-full h-24 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring focus:border-blue-300"
            ></textarea>
          </div>
          <div className="flex items-center justify-end p-6 border-t border-gray-700 rounded-b">
            <button
              className="text-white bg-blue-600 rounded-md hover:bg-blue-800 px-6 py-2 text-sm font-medium outline-none focus:outline-none mr-2"
              onClick={() => {
                if(judulMateri.trim().length == 0){
                  return toast.error('Maaf judul tidak boleh kosong', {autoClose:2000});
                }
                if(urlVideo.trim().length == 0){
                  return toast.error('Maaf url tidak boleh kosong', {autoClose:2000});
                }
                if(deskripsi.trim().length == 0){
                  return toast.error('Maaf deskripsi tidak boleh kosong',{autoClose:2000});
                }
                onConfirm({title:judulMateri, url:urlVideo, description:deskripsi,author:user})}}
            >
              {loading ? <Loading /> : <h1>{buttonText}</h1>}
            </button>
            <button
              className="text-white bg-gray-600 rounded-md hover:bg-gray-700 px-6 py-2 text-sm font-medium outline-none focus:outline-none"
              onClick={onCancel}
            >
              Batal
            </button>
          </div>
        </div>
      </div>
    </div></>
  );
};


const AddSectionBox = ({ onConfirm, onCancel, text, buttonText, loading }) => {
  const [judulMateri, setJudulMateri] = useState('');
  const [babMateri, setBabMateri] = useState('');

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'judulMateri') {
      setJudulMateri(value);
    } else if (name === 'babMateri') {
      setBabMateri(value);
    }
  };

  return (
    <div onClick={() => onCancel()} className="fixed inset-0 flex items-center justify-center z-50">
      <div className="relative w-full max-w-md mx-auto my-6 mx-[10%]">
        <div onClick={(e) => { e.stopPropagation() }} className="relative flex flex-col w-full bg-gray-900 border-2 border-blue-600 rounded-lg shadow-lg outline-none focus:outline-none">
          {/* Header */}
          <div className="flex items-start justify-between p-5 border-b border-gray-700 rounded-t">
            <h3 className="text-2xl font-semibold text-white">{text}</h3>
            <button
              className="p-1 ml-auto bg-transparent border-0 text-white opacity-70 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
              onClick={onCancel}
            >
              <span className="text-white h-6 w-6 text-2xl block outline-none focus:outline-none">
                ×
              </span>
            </button>
          </div>
          {/* Content */}
          <div className="relative p-6 flex-auto">
            <label className="text-white md:text-lg text-base leading-relaxed">Judul Materi:</label>
            <input
              type="text"
              name="judulMateri"
              value={judulMateri}
              onChange={handleInputChange}
              className="my-2 px-3 py-2 w-full bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring focus:border-blue-300"
            />
            <label className="text-white md:text-lg text-base leading-relaxed">Bab Materi:</label>
            <input
              type="text"
              name="babMateri"
              value={babMateri}
              onChange={handleInputChange}
              className="my-2 px-3 py-2 w-full bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          {/* Footer */}
          <div className="flex items-center justify-end p-6 border-t border-gray-700 rounded-b">
            <button
              className="text-white bg-blue-600 rounded-md hover:bg-blue-800 px-6 py-2 text-sm font-medium outline-none focus:outline-none mr-2"
              onClick={() => onConfirm(judulMateri, babMateri)}
            >
              {loading ? <Loading /> : <h1>{buttonText}</h1>}
            </button>
            <button
              className="text-white bg-gray-600 rounded-md hover:bg-gray-700 px-6 py-2 text-sm font-medium outline-none focus:outline-none"
              onClick={onCancel}
            >
              Batal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AddMaterialBox = ({ onConfirm, onCancel, text, buttonText, loading }) => {
    const [judulMateri, setJudulMateri] = useState('');
  
    const handleInputChange = (event) => {
      setJudulMateri(event.target.value);
    };
  
    return (
      <div onClick={() => onCancel()} className="fixed inset-0 flex items-center justify-center z-50">
        <div className="relative w-full max-w-md mx-auto my-6 mx-[10%]">
          <div onClick={(e) => { e.stopPropagation() }} className="relative flex flex-col w-full bg-gray-900 border-2 border-blue-600 rounded-lg shadow-lg outline-none focus:outline-none">
            {/* Header */}
            <div className="flex items-start justify-between p-5 border-b border-gray-700 rounded-t">
              <h3 className="text-2xl font-semibold text-white">{text}</h3>
              <button
                className="p-1 ml-auto bg-transparent border-0 text-white opacity-70 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={onCancel}
              >
                <span className="text-white h-6 w-6 text-2xl block outline-none focus:outline-none">
                  ×
                </span>
              </button>
            </div>
            {/* Content */}
            <div className="relative p-6 flex-auto">
              <label className="text-white md:text-lg text-base leading-relaxed">Judul Materi:</label>
              <input
                type="text"
                value={judulMateri}
                onChange={handleInputChange}
                className="my-2 px-3 py-2 w-full bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            {/* Footer */}
            <div className="flex items-center justify-end p-6 border-t border-gray-700 rounded-b">
              <button
                className="text-white bg-blue-600 rounded-md hover:bg-blue-800 px-6 py-2 text-sm font-medium outline-none focus:outline-none mr-2"
                onClick={() => onConfirm(judulMateri)}
              >
                {loading? <Loading/> : <h1>{buttonText}</h1>}
              </button>
              <button
                className="text-white bg-gray-600 rounded-md hover:bg-gray-700 px-6 py-2 text-sm font-medium outline-none focus:outline-none"
                onClick={onCancel}
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

const DeleteConfirmationBox = ({ onConfirm, onCancel, text, loading }) => {
    return (
      <div onClick={()=>{onCancel()}} className="fixed inset-0 flex items-center justify-center z-50 ">
        <div className="relative w-full max-w-md mx-auto my-6 mx-[10%]">
          <div onClick={(e)=>{
            e.stopPropagation()
          }} className="relative flex flex-col w-full bg-gray-900 border-2 border-red-600 rounded-lg shadow-lg outline-none focus:outline-none">
            {/* Header */}
            <div className="flex items-start justify-between p-5 border-b border-gray-700 rounded-t">
              <h3 className="text-2xl font-semibold text-white">Konfirmasi Hapus</h3>
              <button
                className="p-1 ml-auto bg-transparent border-0 text-white opacity-70 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={onCancel}
              >
                <span className="text-white h-6 w-6 text-2xl block outline-none focus:outline-none">
                  ×
                </span>
              </button>
            </div>
            {/* Content */}
            <div className="relative p-6 flex-auto">
              <p className="my-4 text-white md:text-lg text-base leading-relaxed">
                {text}
              </p>
            </div>
            {/* Footer */}
            <div className="flex items-center justify-end p-6 border-t border-gray-700 rounded-b">
              <button
                className="text-white bg-red-600 rounded-md hover:bg-red-700 px-6 py-2 text-sm font-medium outline-none focus:outline-none mr-2"
                onClick={onConfirm}
              >
                {loading?<Loading/>:<h1>Hapus</h1>}
              </button>
              <button
                className="text-white bg-gray-600 rounded-md hover:bg-gray-700 px-6 py-2 text-sm font-medium outline-none focus:outline-none"
                onClick={onCancel}
              >
                Tidak
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };


function ChapterDropdown({ onClickInside=()=>{},activeChapter,setActiveChapter,chapter, mataKuliah, setMataKuliah, activeMateri, setActiveMateri }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [deleteBoxShowing, setDeleteBoxShowing] = useState(false);
    const [deleteMateri, setDeleteMateri] = useState(false);
    const [addBox, setAddBox] = useState(false);
    const [addSectionBox, setAddSectionBox] = useState(false);
    const [editSection, setEditSection] = useState(false);
    const [editMateri, setEditMateri] = useState(false);
    const [loading,setLoading] = useState(false);
    const idToDelete = useRef("");
    const idMateriToEdit = useRef("");
    const toggleExpansion = () => {
      setIsExpanded(!isExpanded);
    };

    useEffect(()=>{
      if(!activeMateri){
        return;
      }
      if(chapter.materi.includes(activeMateri)){
        setIsExpanded(true)
      }
    },[activeMateri])
    

    const handleSubmitAddSection = async (judul,bab) => {
      if(!mataKuliah) {
        return
      }
      if(judul.trim()==""){
        return toast.error("Maaf judul tidak boleh kosong!!!", {autoClose:2000})
      }
      try {
        setLoading(true)
        const editedMataKuliah = {...mataKuliah};
        editedMataKuliah.chapters.push({
          title: judul.trim(),
          bab:bab.trim(),
          materi:[]
        })
        const res = await axios.post("https://isa-citra.adaptable.app/learn/edit/"+mataKuliah._id, editedMataKuliah);
        //socket.emit('update-matkul', editedMataKuliah);
        setMataKuliah(res.data)
        setLoading(false)
        setAddSectionBox(false)
        toast.success("Berhasil menambahkan materi", {autoClose:2000})
        console.log(mataKuliah)
      } catch (error) {
        console.log(error)
        setLoading(false)
        toast.error("Terjadi kesalahan dalam menambahkan materi", {autoClose:2000})
      }
    }

    const handleSubmitEditSection = async (judul,bab) => {
      if(!mataKuliah) {
        return
      }
      if(judul.trim()==""){
        return toast.error("Maaf judul tidak boleh kosong!!!", {autoClose:2000})
      }
      try {
        setLoading(true)
        const editedMataKuliah = {...mataKuliah};
        const chp = editedMataKuliah.chapters.find((ch) => ch._id == chapter._id);
        if(chp){
          chp.title = judul;
          chp.bab = bab;
        }
        const res = await axios.post("https://isa-citra.adaptable.app/learn/edit/"+mataKuliah._id, editedMataKuliah);
        setMataKuliah(res.data)
        setLoading(false)
        setEditSection(false)
        toast.success("Berhasil mengedit materi", {autoClose:2000})
        console.log(mataKuliah)
      } catch (error) {
        console.log(error)
        setLoading(false)
        toast.error("Terjadi kesalahan dalam menambahkan materi", {autoClose:2000})
      }
    }

    const handleSubmitAddMateri = async (str) => {
      if(!mataKuliah) {
        return
      }
      if(str.trim()==""){
        return toast.error("Maaf judul tidak boleh kosong!!!", {autoClose:2000})
      }
      try {
        setLoading(true)
        const editedMataKuliah = {...mataKuliah};
        const chapterToEdit = editedMataKuliah.chapters.find((anotherChapter)=> chapter._id === anotherChapter._id);
        chapterToEdit.materi.push(
          {
            _id:new mongoose.Types.ObjectId(),
            title:str,
            videos: [],
            notes:[]
          }
        )
        const res = await axios.post("https://isa-citra.adaptable.app/learn/edit/"+mataKuliah._id, editedMataKuliah);
        setMataKuliah(res.data)
        setLoading(false)
        setAddBox(false)
        toast.success("Berhasil menambahkan materi", {autoClose:2000})
        //console.log(mataKuliah)
      } catch (error) {
        console.log(error)
        setLoading(false)
        toast.error("Terjadi kesalahan dalam menambahkan materi", {autoClose:2000})
      }
    }

    const handleSubmitEditMateri = async (str) => {
      if(!mataKuliah) {
        return
      }
      if(str.trim()==""){
        return toast.error("Maaf judul tidak boleh kosong!!!", {autoClose:2000})
      }
      try {
        setLoading(true)
        const editedMataKuliah = {...mataKuliah};
        const chapterToEdit = editedMataKuliah.chapters.find((anotherChapter)=> chapter._id === anotherChapter._id);
        const materiToEdit = chapterToEdit.materi.find((materi)=> materi._id == idMateriToEdit.current);
        if(materiToEdit){
          materiToEdit.title = str
        }
        const res = await axios.post("https://isa-citra.adaptable.app/learn/edit/"+mataKuliah._id, editedMataKuliah);
        setMataKuliah(res.data)
        setLoading(false)
        setEditMateri(false)
        toast.success("Berhasil mengedit materi", {autoClose:2000})
        //console.log(mataKuliah)
      } catch (error) {
        console.log(error)
        setLoading(false)
        toast.error("Terjadi kesalahan dalam mengedit materi", {autoClose:2000})
      }
    }


    const handleSubmitDeleteMateri = async (id) => {
      //console.log('hai ini id: '+id)
      if(!mataKuliah) {
        return
      }
      try {
        setLoading(true)
        const editedMataKuliah = {...mataKuliah};
        const chapterToEdit = editedMataKuliah.chapters.find((anotherChapter)=> chapter._id === anotherChapter._id);
        //todo
        chapterToEdit.materi = chapterToEdit.materi.filter((materi) => materi._id !== id);
        const res = await axios.post("https://isa-citra.adaptable.app/learn/edit/"+mataKuliah._id, editedMataKuliah);
        setMataKuliah(res.data)
        setLoading(false)
        setDeleteMateri(false)
        setActiveMateri(null)
        toast.success("Berhasil menghapus materi", {autoClose:2000})
        //console.log(mataKuliah)
      } catch (error) {
        console.log(error)
        setLoading(false)
        toast.error("Terjadi kesalahan dalam menghapus materi", {autoClose:2000})
      }
    }
    const deleteSection = async (id) => {
      if(!mataKuliah){
        return;
      }
      try {
        setLoading(true)
        const editedMataKuliah = {...mataKuliah};
        const chapterIndexToDelete = editedMataKuliah.chapters.findIndex((chapter) => chapter._id === id)
        if(chapterIndexToDelete != -1){
          editedMataKuliah.chapters.splice(chapterIndexToDelete, 1)
        }
        const res = await axios.post("https://isa-citra.adaptable.app/learn/edit/"+mataKuliah._id, editedMataKuliah);
        setMataKuliah(res.data)
        setLoading(false)
        toast.success("Berhasil menghapus section", {autoClose:2000})
        if(activeChapter._id == id){
          setActiveMateri(null)
        }
        setDeleteBoxShowing(false)
        
      } catch (error) {
        console.log(error)
        setLoading(false)
        toast.error("Terjadi kesalahan dalam menghapus section", {autoClose:2000})
      }
    }
  
    return (<><ToastContainer/>{editSection && <AddSectionBox loading={loading}
     onCancel={()=>{setEditSection(false)}} buttonText={'Add'} text={'Edit Section'}
      onConfirm={(judul,bab)=>{handleSubmitEditSection(judul,bab)}}/>}
    {deleteMateri &&<DeleteConfirmationBox loading={loading} onConfirm={()=>{handleSubmitDeleteMateri(idToDelete.current)}} text={'Apakah Anda yakin ingin menghapus materi ini?'} onCancel={()=>{setDeleteMateri(false)}}/> } {addSectionBox && <AddSectionBox loading={loading} onCancel={()=>{setAddSectionBox(false)}}
     buttonText={'Add'} text={'Tambahkan Section'} onConfirm={(judul,bab)=>{handleSubmitAddSection(judul,bab)}}/>} 
     { addBox && <AddMaterialBox loading={loading} onConfirm={(str)=>{
       handleSubmitAddMateri(str)}} onCancel={()=>{setAddBox(false)}} text={'Tambahkan Materi'} buttonText={'Add'}/>}

{ editMateri && <AddMaterialBox loading={loading} onConfirm={(str)=>{
       handleSubmitEditMateri(str)}} onCancel={()=>{setEditMateri(false)}} text={'Edit Materi'} buttonText={'Edit'}/>}
        { deleteBoxShowing && <DeleteConfirmationBox loading={loading} onConfirm={()=>{deleteSection(chapter._id)}} text={'Apakah Anda yakin ingin menghapus section ini?'} onCancel={()=>{setDeleteBoxShowing(false)}}/>}
      <div className="w-full  mb-4">
        <div
          className={`cursor-pointer ${ 'bg-gray-800'} rounded-sm p-2 flex items-center justify-between truncate mr-2`}
          onClick={toggleExpansion}
        >
          <div className="flex items-center truncate mr-auto">
            <label htmlFor="chapter" className="text-white truncate text-xs ">
              {chapter.title}
            </label>
          </div>
          <div className="text-gray-400 mr-2">
            {isExpanded ? (
              <FaCaretUp color="white" size={18} />
            ) : (
              <FaCaretDown color="white" size={18} />
            )}
          </div>
          <div onClick={
            (e)=> {
              e.stopPropagation();
              setEditSection(true)
            }
          } className="text-gray-400 mr-2">
            <AiOutlineEdit color="white" size={18}/>
          </div>
          <div onClick={(e)=>{
            e.stopPropagation();
            setDeleteBoxShowing(true)}}className="text-gray-400">
            <AiOutlineDelete color="white" size={18}/>
          </div>
        </div>
        {isExpanded && (
          <div className="mt-2">
            {chapter.materi.map((materi) => (
              <div key={materi._id} className="mb-2">
                <label onClick={()=>{
                  setActiveMateri(materi)
                  setActiveChapter(chapter)
                  onClickInside();
                }} className={` truncate ml-auto mr-2 block text-white flex ${!activeMateri ? 'bg-slate-900' : activeMateri._id == materi._id? 'bg-teal-900' : 'bg-slate-900'}  rounded-sm p-2 w-[95%] text-xs truncate`}>
                  <h1 className="truncate  mr-auto">{materi.title}</h1>
                  <div onClick={(e)=>{
                    e.stopPropagation();
                    idMateriToEdit.current = materi._id;
                    setEditMateri(true);

                  }} className="text-gray-400 mr-2">
            <AiOutlineEdit  color="white" size={18}/>
          </div>
          <div className="text-gray-400" onClick={(e)=>{
            e.stopPropagation();
            idToDelete.current = materi._id;
            setDeleteMateri(true)
          }}>
            <AiOutlineDelete color="white" size={18}/>
          </div>

                </label>
              </div>
            ))}
            <div  className="mb-2">
                <label onClick={()=>{
                    setAddBox(true)
                }} className="ml-auto mr-2 block text-white border-dashed border border-gray-300 rounded-sm p-2 w-[95%] text-xs truncate bg-opacity-60">
                  {'+ Tambah Materi'}
                  
                </label>
                
              </div>
          </div>
        )}
      </div></>
    );

  }
  const formatDateAndTime = (dateObject) => {
    const formattedDay = getDayString(dateObject.getDay()); 
    const formattedMonth = getMonthString(dateObject.getMonth() + 1);
    return `${formattedDay}, ${dateObject.getDate()} ${formattedMonth} ${dateObject.getFullYear()}`;
};

const NotesPage = ({matkul, activeMateri, activeChapter }) => {
  const navigate = useNavigate()
  const id = "7ghqgshvdbsvxvajwyqy";
  const user = useSelector((state) => state.auth.user);
  return <div className=" w-full h-screen flex-col flex items-center">
    <div onClick={(e)=>{
      e.stopPropagation();
      navigate('/learn/'+id+"/addNote", {state: {matkul, activeMateri, activeChapter}})
    }} className="fixed lg:hidden bottom-12  right-6 text-white text-sm flex justify-center rounded-md items-center px-4 py-2 bg-neutral-800 hover:bg-neutral-700">
      <h1> + Tambah Note</h1>
    </div>
    <div onClick={(e)=>{
      e.stopPropagation();
      navigate('/learn/'+activeChapter._id+"/addNote", {state: {matkul, activeMateri, activeChapter}})
    }}
     className="absolute hidden top-4  right-6 text-white text-sm lg:flex justify-center rounded-md items-center px-4 py-2 bg-neutral-800 hover:bg-neutral-700">
      <h1> + Tambah Note</h1>
    </div>

    {activeMateri.notes.length == 0? <div className=" flex flex-col w-full h-full justify-center items-center text-white text-base">
      <h1>Belum ada note. Silahkan menambahkan</h1>
    </div>: <div className="flex flex-col items-center w-full  mt-24 md:mt-20">
      {activeMateri.notes.map((note, index)=>{
        //console.log(matkul)
        return <div key={note._id} className="overflow-x-auto lg:max-w-3xl max-w-full mx-auto mb-4 mx-2 bg-slate-950 pb-3 mb-3 w-full md:min-w-[32rem] lg:min-w-[36rem] xl:min-w-[40rem] text-ellipsis  pt-3 -mt-1 rounded-lg ">
                
        <div className="text-white  text-xl md:text-2xl h-auto lg:text-3xl px-6 md:px-3 mb-3">
            <div className=" text-sm  h-auto  ">
            <HashtagList categories={note.categories}/> 
            </div>
            <div className="  max-w-full flex flex-wrap overflow-ellipsis justify-between">
            <h1 className=" break-words font-bold pr-2">{note.title}</h1>
            <AiOutlineEdit size={24} className=" ml-2" color="white"/>
            </div>
            <p className=" text-sm mt-2 text-[#9ca3af]">Ditulis oleh {note.author.profile.firstName+ " "+ note.author.profile.lastName}</p>
            <p className=" text-sm mt-2 text-[#9ca3af]">Terakhir diperbarui pada {formatDateAndTime(new Date(note.lastModified))}</p>
            <hr className="border-2 border-[#1D5B79] my-2 rounded-full" />
        </div>
        {
            note.thumbnail.trim() !== '' && <div className="w-full article px-6 md:px-3 mx-auto text-[#9ca3af] my-4">
            {note.thumbnail != '' && <><img  className='article rounded-lg 'src={note.thumbnail} alt="" /></>}
        </div>
        }
        
        <div className= ' whitespace-pre-wrap mb-2 w-full break-words article px-6 md:px-3 mx-auto text-[#9ca3af]' dangerouslySetInnerHTML={{__html:note.content}}>
        </div>
        
        
     </div>
      })}
    </div>}
  </div>
}
const VideosPage = ( {setAddVideoBox, activeMateri}) => {

  function extractYouTubeVideoId(url) {
    const regExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?([a-zA-Z0-9_-]{11})/;
    const match = url.match(regExp);
  
    if (match && match[1]) {
      return match[1]; // Mengembalikan ID video YouTube
    } else {
      return null; // Tidak ditemukan ID video
    }
  }
  const navigate = useNavigate()
  const user = useSelector((state) => state.auth.user);
  return <div className=" w-full h-screen flex-col flex items-center">
    <div  onClick={(e)=>{
      e.stopPropagation();
      if(!user){
        navigate('/authentication', {state:{message:'Anda belum mendapatkan izin untuk mengaksesnya. silahkan masuk atau membuat akun baru'}})
      }
      setAddVideoBox(true)
    }}className="fixed lg:hidden bottom-12  right-6 text-white text-sm flex justify-center rounded-md items-center px-4 py-2 bg-neutral-800 hover:bg-neutral-700">
      <h1> + Tambah Video</h1>
    </div>
    <div onClick={(e)=>{
      e.stopPropagation();
      if(!user){
        navigate('/authentication', {state:{message:'Anda belum mendapatkan izin untuk mengaksesnya. silahkan masuk atau membuat akun baru'}})
        
      }
      setAddVideoBox(true)

    }} className="absolute hidden top-4  right-6 text-white text-sm lg:flex justify-center rounded-md items-center px-4 py-2 bg-neutral-800 hover:bg-neutral-700">
      <h1> + Tambah Video</h1>
    </div>
    {activeMateri.videos.length == 0? <div className=" flex flex-col w-full h-full justify-center items-center text-white text-base">
      <h1>Belum ada video. Silahkan menambahkan</h1>
    </div>: <div className="flex flex-col items-center w-full  mt-24 md:mt-20">
      {activeMateri.videos.map((video, index)=>{
       // console.log(matkul)
        return <div key={video._id} className="lg:max-w-3xl max-w-full mx-auto mb-4 mx-2 bg-slate-950 bg-opacity-20  pb-3 mb-3 w-full md:min-w-[32rem] lg:min-w-[36rem] xl:min-w-[40rem] text-ellipsis  pt-3 -mt-1 rounded-lg ">
                
        <div className="text-white  text-xl md:text-2xl h-auto lg:text-3xl px-6 md:px-3 mb-3">
            <div className="  max-w-full flex flex-wrap overflow-ellipsis">
            <h1 className=" font-bold pr-2">{video.title}</h1>
            </div>
            <p className=" text-sm mt-2 text-[#9ca3af]">Dikirim oleh {video.author.profile.firstName+ " "+ video.author.profile.lastName}</p>
            <hr className="border-2 border-[#1D5B79] my-2 rounded-full" />
        </div>
        {
           <div className="w-[97%] aspect-video rounded-md  mx-auto text-[#9ca3af] my-4">
            <iframe className="w-full h-full" src={"https://www.youtube.com/embed/"+extractYouTubeVideoId(video.url)} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
        </div>
        }
        
        <div className= ' mb-2 w-full  article px-6 md:px-3 mx-auto text-[#9ca3af]' >
          <p>{video.description}</p>
        </div>
        
        
     </div>
      })}
    </div>}
  </div>
}


export default function () {
    const {id} = useParams();
    const [sidebarActive, setSidebarActive] = useState(false);
    const [mataKuliah, setMataKuliah] = useState(null);
    const [SidePanelOpen ,setSidePanelOpen] = useState(false);
    const [load, setLoad] = useState(true);
    const [activeMateri, setActiveMateri] = useState(null);
    const [activeChapter, setActiveChapter] = useState(null);


    const [loading, setLoading] = useState(false);
    const [addSectionBox, setAddSectionBox] = useState(false);
    const [addVideoBox, setAddVideoBox] = useState(false);
    const [page, setPage] = useState('notes');
    //console.log(mataKuliah)
    const handleAddVideo = async (video)=>{
      try {
        setLoading(true)
        const mataKuliahDiedit = {...mataKuliah};
        const chapter = mataKuliah.chapters.find(chap => chap._id == activeChapter._id);
        if(chapter){
          const materi = chapter.materi.find(mtr => mtr._id == activeMateri._id);
          if(materi){
            materi.videos.push(video);
          }
        }
        const res = await axios.post("https://isa-citra.adaptable.app/learn/edit/"+ mataKuliah._id, mataKuliahDiedit);
        setMataKuliah(res.data)
        toast.success("Berhasil menambahkan video", {autoClose:2000})
        setAddVideoBox(false)
        setLoading(false)
      } catch (error) {
        setLoading(false)
        console.log(error)
      }
    }

    const handleSubmitAddSection = async (judul,bab) => {
      if(!mataKuliah) {
        return
      }
      if(judul.trim()==""){
        return toast.error("Maaf judul tidak boleh kosong!!!", {autoClose:2000})
      }
      try {
        setLoading(true)
        const editedMataKuliah = {...mataKuliah};
        editedMataKuliah.chapters.push({
          _id: new mongoose.Types.ObjectId(),
          title: judul.trim(),
          bab:bab.trim(),
          materi:[]
        })
        const res = await axios.post("https://isa-citra.adaptable.app/learn/edit/"+mataKuliah._id, editedMataKuliah);
        setMataKuliah(res.data)
        setLoading(false)
        setAddSectionBox(false)
        toast.success("Berhasil menambahkan section", {autoClose:2000})
        console.log(mataKuliah)
      } catch (error) {
        console.log(error)
        setLoading(false)
        toast.error("Terjadi kesalahan dalam menambahkan section", {autoClose:2000})
      }
    }

    useEffect(()=>{
        const fetchData = async ()=>{
            try {
                const MataKuliah = (await axios.get('https://isa-citra.adaptable.app/learn/' + id)).data;
                setMataKuliah(MataKuliah);
                setLoad(false)
            } catch (error) {
                console.log(error)
                setLoad(false)
            }
        };
        fetchData();

        socket.on('update-matkul', (updatedMataKuliah) => {
          // Ketika ada pembaruan dari server melalui Socket.io, perbarui state
          if(mataKuliah !== updatedMataKuliah){
            setMataKuliah(updatedMataKuliah)
          }
        });
    
        return () => {
          socket.off('update-matkul'); // Unsubscribe dari perubahan Socket.io ketika komponen dibongkar
        };


    },[])



    useEffect(()=>{
      if(! mataKuliah) {
        return
      }
      if(! activeMateri){
        let materiPertama = null;

        for (let i = 0; i < mataKuliah.chapters.length; i++) {
          const chapter = mataKuliah.chapters[i];
          if (chapter.materi.length > 0) {
              setActiveChapter(chapter)
              materiPertama = chapter.materi[0]; // Mengambil materi pertama jika ada materi
              break; // Menghentikan pencarian setelah menemukan materi pertama
           }
          }
          setActiveMateri(materiPertama);
      }
    },[mataKuliah])
    const toggleSidebar = () => {
        setSidebarActive(prev => !prev);
    }
    const closeSidebar = ()=> {
        setSidebarActive(false);
    }

    const handleResize = () => {
        if (window.innerWidth >= 1024) {
          closeSidebar()
          setSidePanelOpen(true)
        }
        if( window.innerWidth < 1024) {
            setSidePanelOpen(false)
        }
      };
      useEffect(() => {
        window.addEventListener('resize', handleResize);
        handleResize(); // Panggil handleResize pada awal render
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }, []);
      

    
    return (
        <div className="">
        <div className=' min-h-screen flex justify-center items-center w-full'>
          {addVideoBox && <AddVideoBox loading={loading} onCancel={()=>{setAddVideoBox(false)}} buttonText={'Add'} text={'Tambahkan Video'} onConfirm={(data)=>{ handleAddVideo(data)}}/>}
        <ToastContainer/> {addSectionBox && <AddSectionBox loading={loading} onCancel={()=>{setAddSectionBox(false)}} buttonText={'Add'} text={'Tambahkan Section'} onConfirm={(judul,bab)=>{handleSubmitAddSection(judul,bab)}}/>}
            {<div onClick={()=>{

                closeSidebar()
            }} className={` bg-gray-950 bg-opacity-20 fixed ease-in-out duration-500 top-0  z-10 w-full ${sidebarActive? 'left-0':'left-[-100%]'}`}>
                <Sidebar setSidebar={setSidebarActive} activeChapter={activeChapter}setActiveChapter={setActiveChapter} setActiveMateri={setActiveMateri} activeMateri={activeMateri} loading={load} setAddSectionBox={setAddSectionBox} mataKuliah={mataKuliah} setMataKuliah={setMataKuliah} idMatkul={id} chapters={mataKuliah? mataKuliah.chapters : []}/>
            </div>}
            <button onClick={()=> {
                toggleSidebar()
            }}className="fixed top-3 right-5 z-20  p-3 rounded-lg bg-neutral-950 hover:bg-neutral-800 lg:hidden">{
            sidebarActive? <AiOutlineClose size={24} color="white"/> : <FaBook  size={24} color="white"/>
            }</button>

            <div className={`w-[25%] h-screen ${SidePanelOpen ? 'flex' : 'fixed left-[-100%]'}`}>

                <SidePanel activeChapter={activeChapter} setActiveChapter={setActiveChapter} setActiveMateri={setActiveMateri} activeMateri={activeMateri} loading={load} setAddSectionBox={setAddSectionBox} mataKuliah={mataKuliah} setMataKuliah={setMataKuliah} chapters={mataKuliah? mataKuliah.chapters : []} idMatkul={id}/>
            </div>
            <div className=" w-full lg:w-[75%] min-h-screen  max-h-screen  relative ">
                  {load ? <div className=" flex justify-center h-full items-center min-h-screen w-full"> <Loading/> </div> : !activeMateri? 
                  <div className="flex justify-center h-full items-center w-full  min-h-screen my-auto mx-auto text-white text-base">
                    <h1>Belum Ada Materi. Silahkan Menambahkan</h1>
                  </div> : 
                  <div className=" w-full h-full overflow-y-auto">
                    <TabBar activeTab={page} onTabClick={(str)=>{setPage(str)}}/>
                    {page == 'notes' && <NotesPage matkul={mataKuliah} activeChapter={activeChapter} activeMateri={activeMateri}/>}
                    {page == 'videos' && <VideosPage setAddVideoBox={setAddVideoBox} activeMateri={activeMateri}/>}
                    </div>}
            </div>
        </div>
    </div>
    )
}

function TabBar({ activeTab='notes', onTabClick=(str)=>{} }) {
  return (
    <div className=" text-sm fixed lg:absolute top-2 left-1/2 transform -translate-x-1/2 bg-gray-800 rounded-full p-2 shadow-lg">
      <button
        className={`rounded-full mr-2 py-2 px-4 focus:outline-none ${
          activeTab === 'notes' ? 'bg-slate-950 text-white' : 'bg-gray-600 text-gray-400'
        }`}
        onClick={() => onTabClick('notes')}
      >
        Notes
      </button>
      <button
        className={`rounded-full py-2 px-4 focus:outline-none ${
          activeTab === 'videos' ? 'bg-slate-950 text-white' : 'bg-gray-600 text-gray-400'
        }`}
        onClick={() => onTabClick('videos')}
      >
        Videos
      </button>
    </div>
  );
}

const SidePanel = ({activeChapter,setActiveChapter ,chapters ,activeMateri, setActiveMateri, idMatkul, mataKuliah, setMataKuliah, setAddSectionBox, loading}, )=>{
    const navigate = useNavigate();
    const groupedChapters = chapters.reduce((result, chapter) =>{
        const {bab} = chapter;
        const key = bab || "Tanpa Nama";
        if(!result[key]){
            result[key] =[]
        }
        result[key].push(chapter);
        return result;
    }, {});
    const data = Object.keys(groupedChapters);
    return (
        <div onClick={(e)=>{e.stopPropagation()}} className="h-screen max-h-screen bg-slate-950 w-full ">
            <div className="flex flex-col items-center  w-full min-h-screen max-h-screen bg-slate-950">
                <div onClick={()=>{
                     //navigate(`/learn/${idMatkul}/addSection`)
                     setAddSectionBox(true)
                     
                }} className=" mt-6 w-[90%] py-2 rounded-sm flex justify-center text-white bg-[#1D1C1C] hover:bg-[#333030] mr-2">
                    <h1> + Tambah Section</h1>
                </div>{
                  loading? <div className=" my-auto mx-auto">
                    <Loading/>
                  </div> :
                <div className={`${data.length == 0 ? 'my-auto' : 'mt-6'} h-full  w-[90%] text-white overflow-y-auto`}>
                    {
                        data.length == 0? <div className=" mt-auto mx-auto flex justify-center text-white">
                            <h1 className="text-sm">
                                Belum Ada Materi
                            </h1>
                        </div> : data.map((val,index)=>{
                           return  <div key={index+100}>
                            <h1 className=" text-white text-sm truncate mx-2 mb-3">{val}</h1>
                            {groupedChapters[val].map((dt,idx)=>{
                               return <ChapterDropdown activeChapter={activeChapter} setActiveChapter={setActiveChapter} setActiveMateri={setActiveMateri} activeMateri = {activeMateri}setMataKuliah={setMataKuliah} key={idx} chapter={dt} mataKuliah={mataKuliah}/>
                            })}
                           </div>
                        })
                    }
                </div>}
            </div>
            

        </div>
    )
}


const Sidebar = ({setSidebar,activeChapter,setActiveChapter,setMataKuliah, chapters ,activeMateri, setActiveMateri ,idMatkul, mataKuliah, setAddSectionBox, loading}, )=>{
    const navigate = useNavigate();
    const groupedChapters = chapters.reduce((result, chapter) =>{
        const {bab} = chapter;
        const key = bab || "Tanpa Nama";
        if(!result[key]){
            result[key] =[]
        }
        result[key].push(chapter);
        return result;
    }, {});
    const data = Object.keys(groupedChapters);
    return (
        <div onClick={(e)=>{e.stopPropagation()}} className="h-screen max-h-screen bg-slate-950 w-[65%]  md:w-[40%] lg:w-[30%] ">
            <div className="flex flex-col items-center  w-full min-h-screen max-h-screen bg-slate-950">
                <div onClick={()=>{
                     setAddSectionBox(true)
                }} className=" mt-6 w-[90%] py-2 rounded-sm flex justify-center text-white bg-[#1D1C1C] hover:bg-[#333030] mr-2">
                    <h1> + Tambah Section</h1>
                </div>{
                  loading? <div className=" my-auto mx-auto">
                      <Loading/>
                  </div> :
                <div className={`${data.length == 0 ? 'my-auto' : 'mt-6'} h-full  w-[90%] text-white overflow-y-auto`}>
                    {
                        data.length == 0? <div className=" mt-auto mx-auto flex justify-center text-white">
                            <h1 className="text-sm">
                                Belum Ada Materi
                            </h1>
                        </div> : data.map((val,index)=>{
                           return  <div key={index+100}>
                            <h1 className=" text-white text-sm truncate mx-2 mb-3">{val}</h1>
                            {groupedChapters[val].map((dt,idx)=>{
                               return <ChapterDropdown onClickInside={()=>{setSidebar(false)}} activeChapter={activeChapter} setActiveChapter={setActiveChapter} setActiveMateri={setActiveMateri} activeMateri={activeMateri}setMataKuliah={setMataKuliah} key={idx} chapter={dt} mataKuliah={mataKuliah}/>
                            })}
                           </div>
                        })
                    }
                </div>}
            </div>
            

        </div>
    )
}


