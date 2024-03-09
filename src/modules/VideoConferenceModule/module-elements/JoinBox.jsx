/* eslint-disable no-unused-vars */
import { useState } from "react"
import Loading from "../../../components/loading/Loading"

const JoinBox = ({closeBox=()=>{},   submitJoin= async(username,password)=>{
    return "success"
  } }) =>{
  
  
    const [joinInfo, setJoinInfo] = useState({
     'password':'',
     'username':'',
    })
    const [loading, setLoading] = useState(false)
    const updateJoinInfo = (key, value) => {
     // Clone objek joinInfo saat ini untuk menghindari mutasi langsung
     const updatedJoinInfo = { ...joinInfo };
   
     // Mengubah nilai properti yang sesuai dengan key
     updatedJoinInfo[key] = value;
   
     // Menetapkan objek joinInfo yang telah diperbarui
     setJoinInfo(updatedJoinInfo);
   };
  
  
    return <div
    onClick={(e)=>{
      e.stopPropagation()
    }}
      className=" inline-block min-w-[20rem] max-w-[95%] align-bottom bg-slate-800 text-left z-50 shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-headline"
    >
      {/* Tombol close di ujung kanan atas */}
      <button
        onClick={()=>{closeBox()}}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
  
      <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
        <div className="sm:flex sm:items-start">
          <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
            <h3
              className="text-lg leading-6 font-medium text-gray-900 dark:text-white"
              id="modal-headline"
            >
              Masuk ke Room
            </h3>
            <div className="mt-2">
              <div className="mb-4">
                <label
                  htmlFor="username"
                  className="block text-gray-700 dark:text-gray-300"
                >
                  Display Name Kamu
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  value={joinInfo.username}
                  className="mt-1 p-2 w-full border rounded-md bg-gray-100 dark:bg-gray-700 dark:text-gray-300"
                  placeholder="Masukkan nama kamu"
                  onChange={(e)=>{ updateJoinInfo("username", e.target.value)}}
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-gray-700 dark:text-gray-300"
                >
                  Password Room ini
                </label>
                <input
                  type="password"
                  name="password"
                  value={joinInfo.password}
                  id="password"
                  className="mt-1 p-2 w-full border rounded-md bg-gray-100 dark:bg-gray-700 dark:text-gray-300"
                  placeholder="Masukkan password room ini"
                  onChange={(e)=>{updateJoinInfo("password",e.target.value)}}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-100 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
        <button
          type="button"
          onClick={async ()=>{
            setLoading(true)
            const res = await submitJoin(joinInfo.username, joinInfo.password);
            setLoading(false)
            if(res == "success"){
              closeBox()
            }
  
          }}
          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#00A8FF] text-base font-medium text-black hover:text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
        >
          {loading? <Loading/> : 'Join'}
        </button>
        <button
          type="button"
          onClick={()=>{}}
          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 dark:focus:ring-gray-500 sm:mt-0 sm:w-auto sm:text-sm"
        >
          Join as Host
        </button>
      </div>
    </div>
  }   
 export default JoinBox