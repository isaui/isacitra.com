import axios from 'axios';
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { ToastContainer, toast } from 'react-toastify';
const PasswordSettings = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch()
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const handleChangePassword = async () => {
    // Add logic here to handle password change
    if (newPassword === confirmPassword) {
      // Update password logic
      try {
        const res = await axios.post('https://isacitra-com-api.vercel.app/authentication/changePassword', {password: currentPassword, username: user.username, newPassword: newPassword})
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('')
        return toast.success('Berhasil mengganti password',{autoClose:2000})

      } catch (error) {
        return toast.error('Terdapat kesalahan dalam mengganti password',{autoClose:2000})
      }
    } else if( newPassword.trim().length < 8 || confirmPassword.length < 8){
        return toast.error('Password harus memiliki panjang minimal 8 huruf',{autoClose:2000})
    }else {
      return toast.error('Maaf password yang dimasukkan tidak sama',{autoClose:2000})
    }
    
  };

  return (
    <div className="w-full mx-auto p-4 text-white max-w-sm ">
        
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <div className="mb-4">
            <label className="block text-base md:text-lg">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-gray-700 text-white md:text-base text-sm rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-base md:text-lg">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-gray-700 md:text-base text-sm text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className='text-base'>
          <ToastContainer/>
          </div>
          <div className="mb-4">
            <label className="block text-base md:text-lg">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-gray-700 md:text-base text-sm text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="lg:mt-8 mt-6 w-full  flex">
            <button
              onClick={handleChangePassword}
              className="bg-neutral-950 hover:bg-neutral-800 text-white py-2 px-4 text-sm ml-auto rounded"
            >
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordSettings;
