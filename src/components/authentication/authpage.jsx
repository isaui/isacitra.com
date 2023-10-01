import React, { useEffect, useRef, useState } from "react";
import { HomepageNav } from "../nav/Nav";
import Footer from "../footer/Footer";
import LoginBox from "./Login";
import RegisterBox from './Register'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { redirect, useLocation, useNavigate } from "react-router-dom";
import {setUser, logoutUser } from '../../slice/authSlice.js'
import { useSelector, useDispatch } from 'react-redux'


export default function ({message='', authenticationState=''}) {
    const [isLoginState, setLoginState] = useState(true);
    const [navigationTime, setNavigationTime] = useState(-1)
    const navigate = useNavigate();
    const location = useLocation();
    const initialized = useRef(false);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        // Mendapatkan parameter dari URL
        const urlSearchParams = new URLSearchParams(window.location.search);
        const regParam = urlSearchParams.get('reg');
    
        if (regParam === 'true') {
          setLoginState(false)
        }
      }, []);
    

    const [loginData, setLoginData] = useState({
        'username': '',
        'email': '',
        'password': '',
    })
    const [registerData, setRegisterData] = useState( {
        'username': '',
        'email':'',
        'password':'',
        'avatar':'',
        'bio':'',
        'firstName':'',
        'lastName':''
    })

    useEffect(()=>{
        
        if (!initialized.current && location.state && location.state.message ) {
            // UserData ada, lakukan sesuatu dengan data ini
            initialized.current = true;
            message = location.state.message;
            toast.error(message, {autoClose:2000})
          }
    }, [])
    const scrollToTop = () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth' // Animasi smooth scrolling
        });
      };
    
      useEffect(() => {
        // Panggil fungsi scrollToTop() saat komponen dimuat
        scrollToTop();
      }, []);

    

    const validateRegisteredPassword =  () => {
        if(registerData.password.length < 8 ) {
            return false
        }
        return true
    }
    const validateRegisteredEmail =() => {
        if(! registerData.email.includes ('@') || registerData.email.startsWith('@') || registerData.email.trim().length == 0){
            return false;
        }
        return true;
    }
    const usernameValidation = () => {
        if (registerData.username.includes(' ') || registerData.username.trim().length == 0) {
          return false;
        }
        return true;
      };
    const nameValidation= (name) => {
        if(name.trim().length == 0){
            return false;
        }
        return true;
    }
    const validateRegister = () => {
        return validateRegisteredEmail() && validateRegisteredEmail() && validateRegisteredPassword() && nameValidation(registerData.firstName)
        && nameValidation(registerData.lastName) && usernameValidation()}
    const resetLogin = () => {
        setLoginData({username:'', email: '', password: ''})
    }

    const handleSubmit = async () => {
        
        if(isLoginState){
            // todo next lecture
            try {
                
                const res = await axios.post('https://isacitra-com-api.vercel.app/authentication/login', {username: loginData.username, password: loginData.password
            },);
            
            //navigate(navigationTime, {state: {message: `Halo selamat datang kembali, ${loginData.username}`}})
           // console.log(res.data.user)
            
            dispatch(setUser(res.data.user))
            toast.success('Halo Selamat Datang Kembali', {
                autoClose: 2000,
              })
            navigate(-1)

            } catch (error) {
                toast.error('Username atau kata sandi salah', {
                    autoClose: 2000,
                  })
            }
            resetLogin();

        }
        else {
            if(!validateRegister()){
                toast.error('Data tidak lengkap', {
                    autoClose: 2000,
                  })
                  return;
            }
            var res;
            try {
               res = await axios.post('https://isacitra-com-api.vercel.app/authentication/register', registerData);
               const data = res.data;
             //  console.log(data)
               if(data.type === 'success'){
                toast.success('Berhasil membuat akun '+registerData.firstName+' '+registerData.lastName, {
                    autoClose: 2000,
                  })
                  //navigate(-1, {state:{message: 'Selamat datang, '+registerData.firstName+' '+registerData.lastName}})

               } else{
           //     console.log('haii error')
                toast.error(data.message.message, {
                    autoClose: 2000,
                  })
               }
               if(data.message.code && data.message.code == 11000){
                toast.error('email already used in another account', {
                    autoClose: 2000,
                  })
               }
               resetRegister()
               setLoginState(true)
            } catch (error) {
             //   console.log('sini')
                toast.error('error', {
                    autoClose: 2000,
                  })
            }
        }
    }

    const resetRegister = () => {
        setRegisterData({
            'username': '',
            'email':'',
            'password':'',
            'avatar':'',
            'bio':'',
            'firstName':'',
            'lastName':''
        })
    }


    const goRegister = () => {
        resetLogin();
        setLoginState(false)
    }
    const goLogin = () => {
        resetRegister()
        setLoginState(true)
    }
    return <div className=" bg-slate-900">
        <div className=' min-h-screen flex justify-center flex-col w-full'>
            <HomepageNav/>
            <ToastContainer position="top-center" /> 
         <div className='min-h-screen max-h-fit w-full flex flex-col justify-center homepage-content'>
            {isLoginState? <LoginBox register={goRegister} loginData={loginData} setLoginData={setLoginData} onSubmit={handleSubmit}/> :  <RegisterBox login={goLogin} registerData={registerData} setRegisterData={setRegisterData}
            registeredPasswordValidation={validateRegisteredPassword}
            loading={loading}
            setLoading={setLoading}
            emailValidation={validateRegisteredEmail}
            nameValidation={nameValidation}
            onSubmitted={handleSubmit}
            usernameValidation={usernameValidation}/>}
        </div>
        <Footer/>
        </div>
    </div>
}
