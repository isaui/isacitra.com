import React, { useEffect, useState, } from "react";
import { HomepageNav } from "../nav/Nav";
import Footer from "../footer/Footer";
import {ArticlesBodyPage}from './Articles'
import { ArticlesGroupCard, ArticlesGroupCardType2, formatDateAndTime} from "./Article";
import { ArticleSlider, } from "./ArticleCard";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import YoutubePlayer from "../react-yt/YtVideoPlayer";
import BASE_URL from "../../api/base_url";



export default function (){
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    useEffect(()=>{
        setLoading(true)
        axios.get(BASE_URL+'/articles').then( res => {
          setArticles(res.data.articles)
          setLoading(false)

        }).catch(err => {
            console.log(err);
            setLoading(false)
        })
      }, [])
    
    return (
        <div className=" w-full  bg-slate-900">
        <div className=" w-full ">
            <HomepageNav floatingButtonOpen={true}/>
        <div className='mx-auto max-w-[1600px] min-h-screen flex justify-center xl:items-start  items-center flex-col w-full'>
        <div className=" w-full mt-12 ">
            <ArticleSlider posts={articles} heading={'Relevan Untukmu'}  isLoading={loading} seeAll={false}/>
        </div>
        <div className=" xl:-mt-5 flex justify-center items-start  w-full">

        <div className='mt-2 min-h-screen w-full max-w-[1240px] '>
         <div className=" text-center w-full  h-full">
        <div className="">
            
        </div>

        <div className="w-full h-full  flex justify-center  xl:ml-2  items-start">
            <ArticlesBodyPage posts={articles} loading={loading} /></div>
         </div>
        </div>
        <div className="hidden xl:flex xl:flex-col h-min px-2 max-w-sm justify-start ml-5 mt-14 space-y-3 mb-2 mr-5">

            <div className=" flex justify-between mb-2">
            <h1 className=" text-white font-normal  text-2xl">Lihat Projek Kami</h1>
            <button onClick={()=>{
                navigate('/projects')
            }}
            className="bg-slate-950 hover:bg-slate-800 text-white text-xs py-2 px-3 rounded-sm transition duration-300">
            Lihat Semua
            </button>
            </div>
        
        <YoutubePlayer videoId={'50wgd8Kz8Qc'} name={"Ally"} label={'UI UX Design'} contributors={[{
            name: 'Abbil Haidar',
            link: 'https://www.linkedin.com/in/abbilville/'
        },
            {
                name:'Samuel Taniel Mulyadi',
                link:'https://www.linkedin.com/in/samuel-taniel-mulyadi/'
            },
            {
                name:'Isa Citra Buana',
                link:'https://www.linkedin.com/in/isacitra/'
            },
            
        ]}/>
        <YoutubePlayer videoId={'kNTI3uQzmxs'} name={"Pantau"} label={'Mobile App'} contributors={
            [{
                name: 'Naufal Ichsan',
                link: 'https://www.linkedin.com/in/naufal-ichsan-5423b722a/'
            },
                {
                    name:'Muhammad Nanda Pratama',
                    link:'https://www.linkedin.com/in/nanda-pratama-885338254/'
                },
                {
                    name:'Isa Citra Buana',
                    link:'https://www.linkedin.com/in/isacitra/'
                },
                
            ]
        }/>

            
            </div>
        </div>
        
        </div>
        <Footer/>
    </div>
    </div>
    )
}
//<YoutubePlayer videoId={'kNTI3uQzmxs'} name={"Pantau"} label={'Mobile App'}/>
