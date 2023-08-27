import React from "react";
import NavLogo from "../../assets/logo/logo.svg"
export default function ({register, loginData, setLoginData, onSubmit}) {
    return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="sm:rounded-lg  pt-4 pb-8  px-8 w-full sm:w-auto sm:min-w-[30rem]">
            
            <h2 className="lg:text-3xl md:text-2xl text-xl font-semibold text-white mb-6">Masuk ke <span className="text-[#00A8FF]">Akunmu</span></h2>
            <div className="">
                
              <div className="mb-4 ">
                <label htmlFor="username" className="text-white mb-1 block text-base">
                  Username / Email
                </label>
                <input
                value={loginData.username}
                onChange={ (event) => {setLoginData({...loginData, username:event.target.value})}}
                  type="text"
                  id="username"
                  name="username"
                  className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="text-white mb-1 block text-base">
                  Password
                </label>
                <input
                value={loginData.password}
                onChange={event => setLoginData({...loginData, password: event.target.value})}
                  type="password"
                  id="password"
                  name="password"
                  className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className=" text-white mb-6 flex justify-between items-center">
                <p className=" text-sm text-gray-400">Ingin mendaftar?</p>
                <div onClick={register}className=" text-[#00A8FF]">
                    <p>Daftar</p>
                </div>
              </div>
              <button
              onClick={onSubmit}
                type="button"
                className="bg-[#00A8FF] text-gray-800 px-4 py-2 w-full rounded hover:bg-blue-600 "
              >
                Login
              </button>
            </div>
          </div>
        </div>
      );
}