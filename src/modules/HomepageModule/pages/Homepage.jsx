import { useState, useEffect } from "react";
import { HomepageNav } from "../../../components/nav/Nav.jsx";
import {ArticleSlider} from "../../../components/article/ArticleCard.jsx";
import Greeting from "../section/greeting.jsx";
import Footer from "../../../components/footer/Footer.jsx";
import 'react-toastify/dist/ReactToastify.css';
import { CertificateContainer, certificationArray } from "../../../components/certificate/Certificate.jsx";
import axios from "axios";
import CourseGreeting from "../section/CourseGreeting.jsx";
import SchedulerGreeting from "../section/SchedulerGreeting.jsx";
import VideoGreeting from "../section/VideoGreeting.jsx"
import BASE_URL from "../../../api/base_url.js";
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

