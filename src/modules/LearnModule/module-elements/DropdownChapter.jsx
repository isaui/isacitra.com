import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import mongoose from "mongoose";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import BASE_URL from "../../../api/base_url";
import DeleteConfirmationBox from "./DeleteConfirmationBox";
import AddMaterialBox from "./AddMaterialBox";
import AddSectionBox from "./AddSectionBox";
import {  AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { FaCaretUp, FaCaretDown } from "react-icons/fa"
import { updateCurrentActiveMateri } from "../../../slice/mapMatkulSlice";

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
    const dispatch = useDispatch();
    useSelector(state => state.matkul.savedData);

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
        const newChapter = {
          _id: new mongoose.Types.ObjectId(),
          title: judul.trim(),
          bab:bab.trim(),
          materi:[]
        }
        const res = await axios.post(BASE_URL+"/learn/addSection", 
        {idMatkul:mataKuliah._id, dataChapter: newChapter});
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
        const res = await axios.post(BASE_URL+"/learn/editSection",
          {idMatkul: mataKuliah._id, idChapter: chapter._id, title:judul, bab:bab }
        );
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
        const newMateri = {
          _id: new mongoose.Types.ObjectId(),
          title: str,
          videos: [],
          notes:[]
        }
        const res = await axios.post(BASE_URL+"/learn/addMateri", 
        {idMatkul:mataKuliah._id, idChapter:chapter._id, dataMateri:newMateri } );
        setMataKuliah(res.data)
        setLoading(false)
        setAddBox(false)
        toast.success("Berhasil menambahkan materi", {autoClose:2000})
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
        const res = await axios.post(BASE_URL+"/learn/editMateri", 
        {idMatkul: mataKuliah._id, idChapter:chapter._id, idMateri:idMateriToEdit.current, title: str });
        setMataKuliah(res.data)
        setLoading(false)
        setEditMateri(false)
        toast.success("Berhasil mengedit materi", {autoClose:2000})
      } catch (error) {
        console.log(error)
        setLoading(false)
        toast.error("Terjadi kesalahan dalam mengedit materi", {autoClose:2000})
      }
    }


    const handleSubmitDeleteMateri = async (id) => {
      if(!mataKuliah) {
        return
      }
      try {
        setLoading(true)
        const res = await axios.post(BASE_URL+"/learn/deleteMateri", 
        {idMatkul:mataKuliah._id, idChapter:chapter._id, idMateri:id });
        setMataKuliah(res.data)
        setLoading(false)
        setDeleteMateri(false)
        setActiveMateri(null)
        toast.success("Berhasil menghapus materi", {autoClose:2000})
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
        const res = await axios.post(BASE_URL+"/learn/deleteSection", 
        {idMatkul:mataKuliah._id, idChapter: id });
        setMataKuliah(res.data)
        console.log(res)
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
                  dispatch(updateCurrentActiveMateri({idMatkul: mataKuliah._id, key:"active-materi", value: materi._id}))
                  dispatch(updateCurrentActiveMateri({idMatkul: mataKuliah._id, key:"active-chapter", value: chapter._id}))
                  
                }} className={` truncate ml-auto mr-2  text-white flex ${!activeMateri ? 'bg-slate-900' : activeMateri._id == materi._id? 'bg-teal-900' : 'bg-slate-900'}  rounded-sm p-2 w-[95%] text-xs truncate`}>
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

  export default ChapterDropdown