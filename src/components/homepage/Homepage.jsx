import { useState, useEffect } from "react";
import { HomepageNav } from "../nav/Nav";
import {ArticleSlider} from "../article/ArticleCard";
import Greeting from "../greeting/greeting";
import Footer from "../footer/Footer";
import 'react-toastify/dist/ReactToastify.css';
import { CertificateContainer, certificationArray } from "../certificate/Certificate";
import axios from "axios";
import CourseGreeting from "../course_greeting/CourseGreeting";
import SchedulerGreeting from "../course_greeting/SchedulerGreeting.jsx";
import VideoGreeting from "../greeting/VideoGreeting.jsx"
import BASE_URL from "../../api/base_url.js";
const Home =  ()=>{
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(()=>{
        setLoading(true)
        axios.get(BASE_URL+'/').then( res => {
          setPosts(res.data.topPicks)
          setLoading(false)
        }).catch(err =>{ 
          console.log(err)
          setLoading(false)
        })
      }, [])
      
    
    return <div className=" bg-slate-900">
    <div className='mx-auto min-h-screen flex justify-center items-center flex-col w-full max-w-[1600px] '>
        <HomepageNav floatingButtonOpen={true}/>
     <div className='homepage-content  min-h-screen w-full flex flex-col my-auto items-center max-w-full'>
      <div className=" min-h-screen w-full ">
      <Greeting/>
      <ArticleSlider isLoading={loading} posts={posts} heading={'Artikel Aku'}/>
      <CourseGreeting/>
      <hr className="mx-auto border border-[#0a88ff] opacity-20 border-spacing-1 border-dashed w-[100vw] max-w-[1240px]"/>
      <VideoGreeting/>
      <hr className="mx-auto border border-[#0a88ff] opacity-20 border-spacing-1 border-dashed w-[100vw] max-w-[1240px]"/>
      <SchedulerGreeting/>
      <hr className="mb-12 mt-6 mx-auto border border-[#0a88ff] opacity-20 border-spacing-1 border-dashed w-[100vw] max-w-[1240px]"/>
      <CertificateContainer data={certificationArray}/>
      </div>
      
    
    </div>
    </div>
    <Footer/>
</div>
}

export default Home

