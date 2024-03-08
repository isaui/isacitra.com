import React, { useState, useRef } from 'react';
import {AiOutlineMenu, AiOutlineClose, AiFillCloseCircle, AiOutlineSearch} from 'react-icons/ai'
import emailjs from '@emailjs/browser';
import BASE_URL from '../../api/base_url';



const ContactAuthor = ({onClickOutside, notify= (data)=>{}, post}) => {
  const [name,setName] = useState('')
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const SERVICE_ID = 'service_az10jpg'
  const TEMPLATE_ID = 'template_lrhk551'
  const PUBLIC_KEY = 'uWTR3dHRLwczGTO6z'

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };
  const handleNameChange = (event) => {
    setName(event.target.value)
  }

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleInputChange = (event) => {
    setMessage(event.target.value);
  };

  

  const sendEmail = async (e) => {
    e.preventDefault();
    if(name.trim().length < 1){
        return notify({message:"Nama tidak boleh kosong", status:"error"});
      }
      if(email.trim().length < 1){
        return notify({message:"Email tidak boleh kosong", status:"error"});
      }
      if(message.trim().length < 1){
        return notify({message:"Pesan tidak boleh kosong", status:"error"});
      }
      if(!email.trim().includes('@')){
        return notify({message:"Email tidak valid", status:"error"});
      }
      if( email.includes(' ')){
        return notify({message:"email tidak valid", status:"error"})
      }
    try {
      // Kirim data email dan pesan ke server
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
        name:name,
        email:email,
        message:message,
        post_title: post.title,
        post_url:BASE_URL+'/articles/'+post._id,
        author_email:post.author.email,
        author_name: post.author.profile.firstName + ' '+post.author.profile.lastName,


      }, PUBLIC_KEY);
      onClickOutside();
      notify({message:"Berhasil mengirimkan pesan ke" + post.author.profile.firstName + ' ' +post.author.profile.lastName, status:"success"});
    } catch (error) {
      notify({message:"Gagal mengirimkan pesan ke " + post.author.profile.firstName + ' ' +post.author.profile.lastName, status:"error"});
    }
  };

  return (
    <div onClick={
      (event) => {
        event.stopPropagation();
        onClickOutside()
      }
    }className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70 ">
      
        <AiFillCloseCircle onClick={(event)=>{
          event.stopPropagation();
          onClickOutside();
        }}className='w-10 h-10 absolute top-4 right-6 ' color='#00A8FF'/>
  
      <div className="flex items-center justify-center w-full">
        <div onClick={(event)=>{
            event.stopPropagation();
        }}className="bg-slate-900 p-6 rounded-lg shadow-md max-w-[20rem] text-white h-[26rem] flex flex-col">
          <h2 className="text-2xl text-center font-bold mb-4">Hubungi Author</h2>
          
          { (
            <div className="text-gray-300 text-sm  h-full flex flex-col items-start min-w-[16rem]">
              <input
                type="text"
                name='name'
                value={name}
                onChange={handleNameChange}
                className="bg-slate-800 text-white rounded w-full p-2.5 mb-4"
                placeholder="Nama Anda *"
                required={true}
              />
              <input
                type="email"
                name='email'
                value={email}
                onChange={handleEmailChange}
                className="bg-slate-800 text-white rounded w-full p-2.5 mb-4"
                placeholder="Email Anda *"
                required={true}
              />
              <textarea
                value={message}
                name='message'
                onChange={handleInputChange}
                className="bg-slate-800 text-white rounded w-full p-2.5 h-32"
                placeholder="Tulis pesan Anda di sini... *"
                required={true}
              />
              <button
                onClick={(event)=>{sendEmail(event)}}
                className="bg-teal-700 mt-auto py-2 px-4 rounded text-white hover:bg-teal-600"
              >
                Kirim Email
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactAuthor;