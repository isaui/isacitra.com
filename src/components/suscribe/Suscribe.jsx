import axios from "axios";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
export default function () {
    const [email, setEmail] = useState('');
    const [subscribe, setSubscribe] = useState(false);
    const handleSubmit = async (event) => {
      event.preventDefault();
      if (email.trim().length < 1) {
        return toast.error('Email tidak boleh kosong', { autoClose: 2000 });
      }
      if (!email.trim().includes('@')) {
        return toast.error('Email tidak valid', { autoClose: 2000 });
      }
      if( email.includes(' ')){
        return toast.error('Email tidak valid', { autoClose: 2000 });
      }
      try {
        const res = await axios.post('http://localhost:3001/articles/subscription', { email });
        toast.success(res.data.message, { autoClose: 2000 });
        setEmail('');
        setSubscribe(true);
      } catch (error) {
        console.log(error);
      }
    }
  
    return (
      <>
        <ToastContainer />
        <div className="break-inside-avoid-column bg-transparent">
          <div className={`p-4 md:px-4 md:py-2 md:rounded-lg w-full h-auto max-w-5xl ${subscribe ? 'bg-green-700' : ''}`}>
            {subscribe ? (
              <div className="flex items-center text-white">
                <svg className="w-8 h-8 mr-2 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M0 11l2-2 5 5L18 3l2 2L7 18z"/></svg>
                <p>Terima kasih telah melakukan subscribe terhadap artikel.</p>
              </div>
            ) : (
              <>
                <h2 className="text-lg font-semibold mb-2 text-white">Mengikuti Artikel</h2>
                <p className="text-gray-600 mb-5">Dapatkan artikel terbaru langsung di email Anda {'(Gratis)'}.</p>
                <form>
                  <input
                    type="email"
                    placeholder="Email Anda"
                    value={email}
                    onChange={(event) => { setEmail(event.target.value) }}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                  <button
                    onClick={(event) => handleSubmit(event)}
                    className="mt-5 bg-[#00A8FF] text-black px-4 py-2 rounded-md hover:bg-blue-900 transition duration-300"
                  >
                    Berlangganan
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </>
    );
  }
  
  