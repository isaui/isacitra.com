import React, { useState, useRef } from 'react';
import { FaLine, FaLinkedin, FaDiscord,  } from 'react-icons/fa';
import axios from 'axios';
import {AiOutlineMenu, AiOutlineClose, AiFillCloseCircle, AiOutlineSearch} from 'react-icons/ai'
import emailjs from '@emailjs/browser';



const ContactPopup = ({onClickOutside, notify}) => {
  const [selectedOption, setSelectedOption] = useState('social');
  const [name,setName] = useState('')
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const SERVICE_ID = 'service_az10jpg'
  const TEMPLATE_ID = 'template_mct95gi'
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

  const textToCopy = '@isabuana2022'; // Teks yang akan disalin
  const copyButtonRef = useRef(null);

  const copyToClipboard = () => {
    const textArea = document.createElement('textarea');
    textArea.value = textToCopy;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);

    // Menampilkan pesan atau efek setelah berhasil menyalin
    copyButtonRef.current.textContent = 'Copied!';
    setTimeout(() => {
      copyButtonRef.current.textContent = 'Copy';
    }, 2000);
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
        message:message
      }, PUBLIC_KEY);
      onClickOutside();
      notify({message:"Berhasil mengirimkan pesan ke Isa Citra", status:"success"});
    } catch (error) {
      notify({message:"Gagal mengirimkan pesan ke Isa Citra", status:"error"});
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
          <h2 className="text-2xl text-center font-bold mb-4">Hubungi Saya</h2>
          <div className="flex space-x-2 mb-4 justify-center">
            <button
              className={`${
                selectedOption === 'social'
                  ? ' text-white bg-teal-700 bg-opacity-10'
                  : 'bg-slate-950 text-gray-300'
              } py-1 px-3 rounded min-w-[8rem]`}
              onClick={() => handleOptionChange('social')}
            >
              Media Sosial
            </button>
            <button
              className={`${
                selectedOption === 'email'
                  ? 'bg-teal-700 bg-opacity-10 text-white'
                  : 'bg-slate-950 text-gray-300'
              } py-1 px-3 rounded min-w-[8rem]`}
              onClick={() => handleOptionChange('email')}
            >
              Email
            </button>
          </div>
          {selectedOption === 'social' && (
            <div className="text-gray-300 flex flex-col bg-teal-700 bg-opacity-10 rounded-md px-2 py-2 my-auto">
               <div className="flex items-center text-base justify-between border-b-2 border-slate-900 pb-2 pt-2 mb-2">
                    <div className="flex space-x-2 items-center ">
                    <FaLine className=" w-12 h-12"/> 
                    <h1>@isabuana2022</h1>
                    </div>
                    <div ref={copyButtonRef} onClick={copyToClipboard} className=" bg-gray-700 hover:bg-gray-500 text-xs px-2 py-2 rounded-md flex justify-center">
                      <h1>Copy</h1>
                    </div>
                </div>
                <div className="flex items-center text-base justify-between border-b-2 border-slate-900 pb-2 pt-2 mb-2">
                    <div className="flex space-x-2 items-center">
                    <FaLinkedin className=" w-12 h-12"/> 
                    <h1>@isa.citra</h1>
                    </div>
                    <a href="https://www.linkedin.com/in/isacitra" className="bg-gray-700 text-xs px-4 py-2 rounded-md hover:bg-gray-500 flex justify-center">
                      <h1>Go</h1>
                    </a>
                </div>

                <div className="flex items-center text-base justify-between pb-2 pt-2">
                    <div className="flex space-x-2 items-center">
                    <FaDiscord className=" w-12 h-12"/> 
                    <h1>@isagantengz</h1>
                    </div>
                    <a href="https://discord.com/channels/@me/998372624268787763"className="bg-gray-700 hover:bg-gray-500 text-xs px-4 py-2 rounded-md flex justify-center">
                      <h1>Go</h1>
                    </a>
                </div>
            </div>
          )}
          {selectedOption === 'email' && (
            <div className="text-gray-300 text-sm">
              <input
                type="text"
                name='name'
                value={name}
                onChange={handleNameChange}
                className="bg-slate-800 text-white rounded w-full p-2.5 mb-2"
                placeholder="Nama Anda *"
                required={true}
              />
              <input
                type="email"
                name='email'
                value={email}
                onChange={handleEmailChange}
                className="bg-slate-800 text-white rounded w-full p-2.5 mb-2"
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
                className="bg-teal-700 mt-3 py-2 px-4 rounded text-white hover:bg-teal-600"
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

export default ContactPopup;
