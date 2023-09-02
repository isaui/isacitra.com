import React, { useEffect, useState } from "react";
import DefaultThumbnail from "../../assets/no_thumbnail/default.svg"
import Suscribe from "../suscribe/Suscribe";
import Dropdown from "../dropdown/Dropdown";
import {formatDateAndTime} from './Article'
import { HashtagList, HashtagListToggler} from "./ArticleCard";
import UnknownAvatar from '../../assets/unknown/unknown_avatar.svg';
import { extractParagraphs } from "../../../utils/paragraph-parser";
import { useNavigate } from "react-router-dom";

const ArticlesBodyPage = ({posts, categories, loading=false}) => { // Data artikel Anda
    const kategori = ['Semua', 'Kampus', 'Opini', 'Teknologi','Review']
    const [selectedCategory, setCategory] = useState(kategori[0])
    
    const navigate = useNavigate()
    const handleNavigate = (id) => {
        navigate('/articles/'+id)
    }
    const [originalArticles, setOriginalArticles] = useState(posts) // ini artikel-artikel asli
    const [articles, setArticles] = useState([]); // ini adalah artikel-artikel yang terfilter berdasarkan kategori yang dipilih

    useEffect(()=>{
        
        if(posts){
            //sort berdasar terbaru
            const sortedPosts = posts.slice().sort((firstPost, secondPost) =>  new Date(secondPost.lastModified) - new Date(firstPost.lastModified ) )
            setOriginalArticles(sortedPosts)
            
            return
        }
        setOriginalArticles(posts)
        
    },[posts])

    useEffect(() => {
        if (selectedCategory === 'Semua') {
          setArticles(originalArticles);
        } else {
          const filtered = originalArticles.filter((article) =>
            article.categories.includes(selectedCategory)
          );
          setArticles(filtered);
        }
      }, [selectedCategory, originalArticles]);

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

    return ( 
        <div className=" mx-auto   w-full my-2 max-w-5xl ">
            
            <div className="hidden mb-8 mt-8 lg:flex lg:flex-row flex-col items-center">
            <h1 className=" text-4xl lg:text-5xl xl:text-4xl 2xl:text-5xl font-bold text-white text-left">Artikel <span className="text-[#00A8FF]">Aku</span> 📰</h1>
            <div className="md:mt-3 mt-4 ml-2 ">
                <HashtagListToggler onClick= {setCategory}selectedValue={selectedCategory}categories={kategori}/>
            </div>
           
                <div  className=" mt-2">
                <Dropdown onSelect={setArticles} posts={articles}options={[{ label: 'Terbaru', value: 'terbaru' },
    { label: 'Terpopuler', value: 'terpopuler' }, {label: 'Terlama', value: 'terlama'}]}/>
                </div>
            
            </div>


            <div className="w-full lg:hidden mb-8 flex lg:flex-row flex-col items-center">
                <div>
                <div  className=" w-full mt-2 flex justify-between items-center">
                <h1 className=" mr-2  md:text-4xl text-3xl font-bold text-white text-left">Artikel<span className=" text-[#00A8FF]"> Aku</span> 📰</h1>
                <Dropdown onSelect={setArticles} posts={articles} options={[{ label: 'Terbaru', value: 'terbaru' },
    { label: 'Terpopuler', value: 'terpopuler' }, {label: 'Rekomendasi', value: 'rekomendasi'}]}/>
                </div>
                </div>
            
            <div className="md:mt-3 mt-4 ml-2 ">
                <HashtagListToggler onClick={setCategory} selectedValue={selectedCategory} categories={kategori}/>
            </div>
            
            </div>



            

            <div className={`xl:-mt-4 w-full space-y-4 lg:max-w-5xl md:columns-3 xl:max-w-5xl`}>
            
            <div className=" ">
            <Suscribe/>
            </div>
            {loading? <div><h1 className=" text-white text-base md:text-lg lg:text-2xl"> Loading...</h1> </div> : articles.length == 0? <div>
                <h1 className=" text-white text-base md:text-lg lg:text-2xl"> Belum ada Artikel</h1>
            </div> :articles.map((article, index) => {
                return (
                    ((index +1)% 2 * 123 % 11) != 0? <RegularArticleCard  navigate={handleNavigate} article={article} key={index} index={index}/> : <WithoutThumbnailArticleCard navigate={handleNavigate}article={article} index= {index} key={index}/>
                )
            })}
        </div>
        </div>
        
    ); 
};

const WithoutThumbnailArticleCard = ({article, index, navigate}) => {
    
    return (
        <div onClick= {() => navigate(article._id)}className="break-inside-avoid-column">
             <div className=" md:rounded-md md:max-w-md pb-2 lg:max-w-sm certificate-card w-auto flex flex-col bg-slate-800 article-card">
            
             
             <div className=" text-[#00A8FF] mx-2 mb-1 mt-2 certificate-title font-bold text-lg md:text-base lg:text-base text-justify">
                <h1>{article.title}</h1>
             </div>
             <div className=" text-gray-700 px-2 mb-2 text-sm md:text-left flex justify-between w-full h-auto items-center">
                <div className="dosis-text md:text-xs lg:text-sm">
                <p>{formatDateAndTime(new Date(article.lastModified))}</p>
                </div>
                <div className="">
                    <img  className= ' mr-3 w-8 h-8 rounded-full'src={article.author.profile.avatar == ''? UnknownAvatar : article.author.profile.avatar} alt="" />
                </div>
             </div>
             <div className=" overflow-ellipsis article-card text-white mx-2 text-base md:text-sm lg:text-base lg:mt-2 text-justify certificate-detail">
                 
                <p>{extractParagraphs(article.content, 200)} </p>
             </div>
             <div className="  mx-1 text-xs certificate-detail text-left mt-3  lg:flex">
                <HashtagList categories={article.categories.slice(0,4).filter(category => category !== "semua")}/>
             </div>
             


    </div>
        </div>
    )

}
const RegularArticleCard = ({article, index, navigate}) => {
    return (
        <div onClick={() => navigate(article._id)}className="break-inside-avoid-column">
             <div className=" md:rounded-md md:max-w-md pb-2 lg:max-w-sm certificate-card w-auto flex flex-col bg-slate-900 md:bg-slate-800  article-card">
             
             <div>
                <img className=' w-full aspect-video md:rounded-md'src={article.thumbnail == '' ? DefaultThumbnail : article.thumbnail} alt="" />
             </div>
             
             
             <div className=" text-[#00A8FF] mx-2 mb-1 mt-2 certificate-title font-bold text-lg md:text-base lg:text-base text-justify">
                <h1>{article.title}</h1>
             </div>
             <div className=" text-gray-700 px-2 mb-2 text-sm md:text-left flex justify-between w-full h-auto items-center">
                <div className="dosis-text md:text-xs lg:text-sm">
                <p>{formatDateAndTime(new Date(article.lastModified))}</p>
                </div>
                <div className="">
                <img  className= ' mr-3 w-8 h-8 rounded-full'src={article.author.profile.avatar == ''? UnknownAvatar : article.author.profile.avatar} alt="" />
                </div>
             </div>
             <div className=" overflow-ellipsis article-card text-white mx-2 text-base md:text-sm lg:text-base lg:mt-2 text-justify certificate-detail">
                 
               <p>{extractParagraphs(article.content, 200)} </p>
             </div>
             <div className="  lg:flex mx-1 text-xs certificate-detail text-left mt-3">
                <HashtagList categories={article.categories.slice(0,4).filter(category => category !== "semua")}/>
             </div>
             


    </div>
        </div>
    )
}

export {ArticlesBodyPage};