import React, { useEffect, useState } from "react";
import {useLocation, useNavigate} from 'react-router-dom';
import { HomepageNav } from "../nav/Nav";
import Footer from "../footer/Footer";
import Error from '../../assets/error/error.svg'
import {BlogCard} from '../article/ArticleCard'
import articles from "../../dummy/article";
import Unknown from "../../assets/unknown/unknown.svg"
import axios from "axios";
import Loading from "../loading/Loading";


export default function () { // Edit ini untuk argument jika perlu
    const location = useLocation();
    const searchQuery = new URLSearchParams(location.search).get('q');
    const [articles, setArticles] = useState([])
    const [loading, setLoading] = useState(false)
    const scrollToTop = () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth' // Animasi smooth scrolling
        });
      };
      const searchPosts = async (searchTerm) => {
        setLoading(true)
        try {
          const response = await axios.get('https://isa-citra.adaptable.app/articles/search', {
            params: { searchTerm },
          });
      
          const {searchResults} = response.data;
          setLoading(false);
          return searchResults;
        } catch (error) {
          console.error('Error searching posts:', error);
          setLoading(false);
          return [];
        }
      };

      useEffect(()=>{
        try {
          //  console.log('sedang mencari...')
           searchPosts(searchQuery).then((value) => setArticles(value))
            //setArticles(data)
        } catch (error) {
            setArticles([])
        }
      }, [searchQuery])


    
      useEffect(() => {
        // Panggil fungsi scrollToTop() saat komponen dimuat
        scrollToTop();
      }, []);
    return (
        <div className="w-full relative">
        <div className=' min-h-screen flex justify-center flex-col items-center w-full'>
            <HomepageNav/> 
            {loading? <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"><Loading/></div> :
         <div className=' min-h-screen w-full max-w-[1240px] items-start flex flex-col'>
            <div className="  mt-28 lg:mt-24 ml-6 lg:ml-11 mb-5">
            <div className=" mt-2 lg:mt-0 text-white lg:text-2xl  text-2xl md:text-xl">
                <h1 className="">Hasil Pencarian untuk <span className=" text-[#00A8FF]">{searchQuery}</span></h1>
            </div>
            <div className=" text-blue-500 lg:text-xl text-xl md:text-lg">
                <p>{articles.length} hasil ditemukan</p> {/* Edit ini untuk menunjukkan jumlah hasil pencarian*/}
            </div>
            </div>
            <div className=" w-full h-full p-4">
                <ResultCardsContainers results={articles}/>
            </div>
            
        </div> }
        </div>
        <Footer/>
    </div>
    )
}

const ResultCardsContainers = ({results}) => {
    const navigate = useNavigate()
    const handleNavigate = (article) => {
        navigate('/articles/'+article._id)
      }
    return (
        <>{ results.length >= 1? results.map((article, index)=>{
            return <div className=' mb-6'key={index}><BlogCard article={article} previewMaxLength={200} onClick={()=>{
                handleNavigate(article)
            }} isCRUD={false}/></div>
        }):
        <div className=" w-full mt-auto h-full">
            <div className="flex items-center h-full">
                <div className=" my-auto h-full flex justify-center items-center mx-auto md:flex-row flex-col-reverse">
                <div className="mx-8">
                <h1 className=" text-yellow-400 lg:text-5xl md:text-4xl text-3xl mx-auto md:text-left text-center mt-3">Tidak Ditemukan</h1>
                <p className=" text-gray-200 lg:text-2xl md:text-2xl text-lg text-center md:text-left"> Maaf Tidak Ada Konten yang Sesuai<br></br>dengan Pencarianmu. Silahkan Kembali.</p>
                </div>
                <div className="">
                    <img className= " lg:min-h-[200px] lg:h-[210px] md:min-h-[180px] md:h-[190px] h-[180px]"src={Unknown} alt="" />
                </div>
                </div>
            </div>
        </div>

        }</>
    )
}
