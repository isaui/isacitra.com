import React from "react";
import NavLogo from "../../assets/logo/logo.svg"
import ProfilePhoto from "../profile_photo/ProfilePhoto";
import { Storage } from "../../../firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
export default function ({login, loading, setLoading, registerData, usernameValidation ,onSubmitted ,setRegisterData, registeredPasswordValidation, emailValidation, nameValidation}) {
    
  const GetURLFromFirebase = async (file) => {
    
    if (!file) {
      return;
    }
    setLoading(true)
    const storageRef = ref(Storage, `files/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
  
    try {
      const snapshot = await uploadTask;
      const downloadURL = await getDownloadURL(snapshot.ref);
  
      // Lakukan tindakan setelah mendapatkan URL gambar dari Firebase
      // Misalnya, Anda dapat memperbarui state, mengirim URL ke server, dll.
       // Contoh: mencetak URL ke konsol
      setLoading(false)
      return downloadURL;
    } catch (error) {
      console.error(error);
      alert(error.message); // Menampilkan pesan kesalahan
      throw error; // Melempar error untuk penanganan lebih lanjut jika perlu
    }
  };
  
  return (
        <div className="flex items-center justify-center mt-16">
          <div className=" sm:rounded-lg  mb-6  pt-4 pb-8 px-8 w-full sm:w-auto">
            <h2 className="lg:text-3xl md:text-2xl text-xl font-semibold text-white mb-6">Buat <span className="text-[#00A8FF]">Akun Baru</span></h2>
            <div className="">
              <div className=" flex justify-center mb-6">
              <ProfilePhoto
                imageUrl= {registerData.avatar.trim().length < 1? "https://i1.sndcdn.com/avatars-000269110152-wi3adu-t500x500.jpg" : registerData.avatar}
                loading={loading}
                altText="Deskripsi Gambar"
                onUploadClick={async (file) => {
                  try {
                    const downloadUrl = await GetURLFromFirebase(file)
                    setRegisterData({...registerData, avatar:downloadUrl});
                  } catch (error) {
                    
                  }
                  
  }}
/>
              </div>
              <div className=" grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="mb-3 ">
                <label htmlFor="username" className="text-white mb-1 block text-base">
                Username <span className=" text-xs">{'(required)'}</span>
                </label>
                <input
                  value={registerData.username}
                  onChange={(event) => setRegisterData({...registerData, username: event.target.value})}
                  type="text"
                  id="username"
                  name="username"
                  className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {
                  (!usernameValidation() && registerData.username.length > 0) &&<p className="text-red-500 text-sm  mt-1">
                  space between words is not allowed
                </p>
        
                }
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="text-white mb-1 block text-base">
                Password <span className=" text-xs">{'(required)'}</span>
                </label>
                <input
                  value={registerData.password}
                  onChange={
                    (event) => {
                      setRegisterData({...registerData, password: event.target.value})
                    }
                  } 
                  type="password"
                  id="password"
                  name="password"
                  className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {
                  (!registeredPasswordValidation() && registerData.password.length > 0) &&<p className="text-red-500 text-sm  mt-1">
                  Password must be at least 8 characters.
                </p>
        
                }
              </div>
              </div>


              <div className=" grid grid-cols-1 gap-4">
              <div className="mb-3">
                <label htmlFor="email" className="text-white mb-1 block text-base">
                  Email <span className=" text-xs">{'(required)'}</span>
                </label>
                <input
                  type="text"
                  id="email"
                  value={registerData.email}
                  onChange={
                    (event) => {
                      setRegisterData({...registerData, email: event.target.value})}
                  }
                  name="email"
                  className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                 {
                  (!emailValidation() && registerData.email.length > 0) &&<p className="text-red-500 text-sm  mt-1">
                  Email is not valid.
                </p>
        
                }
              </div>
              </div>

              <div className=" grid grid-cols-1 gap-4">
              <div className="mb-3">
                <label htmlFor="bio" className="text-white mb-1 block text-base">
                  Bio
                </label>
                <textarea
                  value={registerData.bio}
                  type="text"
                  onChange={(event) => {
                    setRegisterData({...registerData, bio: event.target.value})}}
                  rows={3}
                  id="bio"
                  name="bio"
                  className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
              </div>

              <div className=" grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-3 ">
                <label htmlFor="firstName" className="text-white mb-1 block text-base">
                First Name <span className=" text-xs">{'(required)'}</span>
                </label>
                <input
                  value={registerData.firstName}
                  onChange={(event) => {
                    setRegisterData({...registerData, firstName: event.target.value})}}
                  type="text"
                  id="firstName"
                  name="firstName"
                  className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="lastName" className="text-white mb-1 block text-base">
                Last Name <span className=" text-xs">{'(required)'}</span>
                </label>
                <input
                  value={registerData.lastName}
                  onChange={(event) => {
                    setRegisterData({...registerData, lastName: event.target.value})}}
                  type="text"
                  id="lastName"
                  name="lastName"
                  className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              </div>






              <div className=" text-white mb-3 flex justify-between items-center">
                <p className=" text-sm text-gray-400">Sudah punya akun?</p>
                <div onClick= {()=> {
                  login();
                }}className=" text-[#00A8FF]">
                    <p>Masuk</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onSubmitted}
                className="bg-[#00A8FF] text-gray-800 px-4 py-2 w-full rounded hover:bg-blue-600"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      );
}