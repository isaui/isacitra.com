import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Dropdown from "../dropdown/Dropdown";
import axios from "axios";
import DefaultThumbnail from '../../assets/no_thumbnail/default.svg'
import ZeroArticle from '../../assets/Zero/zero.svg'
import { useNavigate} from 'react-router-dom'
import { extractParagraphs } from "../../../utils/paragraph-parser";
import ViewCounter from "../view_counter/ViewCounter";
import Loading from "../loading/Loading";



const HashtagBox = ({ hashtag, color='bg-slate-900', }) => {
  const navigate = useNavigate()
   const styles = `inline-block ${color} text-white px-2 py-1 mb-2 rounded-md mr-2`
   const hastagSearch = ()=> {
    navigate('/search?q='+hashtag)
   }
    return (
      <div onClick={hastagSearch} className={styles} >
        #{hashtag}
      </div>
    );
  }

  const HashtagBox2 = ({ hashtag, color='bg-slate-900', }) => {
     const styles = `inline-block ${color} px-2 py-1 mb-2 rounded-md mr-2`
      return (
        <button  className={styles} >
          #{hashtag}
        </button>
      );
    }
  
  const HashtagList = ({categories}) => {
    return (
      <div>
        {categories.map((category, index) => (
          <HashtagBox color={' bg-slate-950'} key={index} hashtag={category} />
          
        ))}
      </div>
    );
  }
  const HashtagListToggler = ({categories, onClick, selectedValue}) => {
    
    return (
      <div>
        {categories.map((category, index) => (
          <div className="inline-block" onClick={()=>{onClick(category)}} >{
            category != selectedValue? <HashtagBox2 color='bg-slate-800 text-white'key={index} hashtag={category} /> : <HashtagBox2 color=" bg-[#00A8FF] text-black" key={index} hashtag={category}/>
          
            }</div>
           
        ))}
      </div>
    );
  }

const ArticleSlider = function ({ posts, heading, isLoading=false, seeAll = true}) {
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0);
  const previewMaxLength = 200;
  const headingSplit = heading.split(' ')
  const firstWord = headingSplit[0];
  const lastWord = headingSplit[1];



  const articles = posts

  const mouseDownCoords = e => {
    window.checkForDrag = e.clientX;
  };
  const clickOrDrag = (e,action) => {
    const mouseUp = e.clientX;
    if (
      mouseUp < window.checkForDrag + 6 &&
      mouseUp > window.checkForDrag - 6
    ) {
      
      action()
    }
  };
  

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    beforeChange: (current, next) => {
      setCurrentIndex(next);
    },
  };
  

  // ...

  return (
    <div className="block mt-3 md:pb-2 w-full bg-slate-800 rounded-xl mx-auto px-6 relative">
      <div className="max-w-[1275px] pb-3 flex  flex-col justify-center mx-auto">
        <div className="text-white pb-2 pt-2 mb-4 mt-4 font-bold md:text-4xl text-3xl filosofi items-center flex justify-between">
          <h1>{firstWord+' '}
            <span className=" text-[#00A8FF]">{lastWord}</span> 
          </h1>
         {seeAll && <div className="flex items-center relative z-10">
          
          <div className=" ml-2 pl-4">
          <button onClick={()=> {
            navigate('/articles')
          }} className=" font-light text-base">Lihat Semua</button>
          </div>
          </div>
}
          
        </div>
        <div className="slickpos relative  w-full" onMouseDown={e=>mouseDownCoords(e)} >
        { isLoading? <div className=" flex flex-col h-full justify-center my-auto items-center"><Loading/></div> :
          articles.length >= 1 ? <div className="  flex flex-col h-full" ><Slider {...settings}>
          {articles.map((article, index) => (
              <div key={index} className="h-full flex  items-stretch">
                <BlogCard article={article} onClick={clickOrDrag} previewMaxLength={previewMaxLength}/>
              </div>
              
            ))}
          </Slider></div> : 
          <div>
            <div className="flex items-center my-auto h-full">
                <div className=" my-auto h-full flex justify-center items-center mx-auto md:flex-row flex-col-reverse">
                <div className="mx-8">
                <h1 className=" text-red-400 lg:text-5xl md:text-4xl text-3xl mx-auto md:text-left text-center mt-3">Maaf</h1>
                <p className=" text-gray-200 lg:text-2xl md:text-2xl text-lg text-center md:text-left">Belum ada artikel.</p>
                </div>
                <div className="">
                    <img className= " lg:min-h-[200px] lg:h-[210px] md:min-h-[180px] md:h-[190px] h-[180px]"src={ZeroArticle} alt="" />
                </div>
                </div>
            </div>
          </div>
        } 
        </div>
        
      </div>
    </div>
  );
};

const BlogCard = ({article, previewMaxLength=120, onClick, isCRUD = false, onDelete = () => {}}) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/articles/'+article._id)
  }
  return <div key={article._id} className=" relative  flex-col  h-full">
    <div className="absolute top-3 left-3 rounded-lg z-10 bg-slate-900">
    <ViewCounter views={article.views}/>
    </div>
  <div onClick={(e) =>  onClick(e, handleNavigate) }className="  mx-auto md:grid md:grid-cols-2 md:gap-4 mr-2 h-full  items-start flex flex-col md:grid-flow-row md:auto-rows-max">
    <div className=" relative w-full">
      <img className='  md:max-w-lg w-full aspect-video  rounded-md md:rounded-lg 'src={article.thumbnail == ''? DefaultThumbnail : article.thumbnail} alt="thumbnail" />
    </div>
    
    
    <div className="md:my-0  flex flex-col mt-2 justify-start self-stretch  text-white h-full">
      <div className=" md:hidden lg:flex flex"> 
      <HashtagList categories={article.categories}/>
      </div>
      <h1 className=" extra-space-included lg:text-3xl md:text-xl text-2xl text-[#00A8FF] my-2">
        {article.title.length > 60 ? article.title.substring(0,57) + '...' : article.title}
      </h1>
      <div className="mb-2 text-sm md:text-sm lg:text-base text-ellipsis text-justify">
        <div>
          <p className="">
            {extractParagraphs(article.content, previewMaxLength)}
          </p>
        </div>
      </div>
      <div className="mt-auto md:self-start justify-self-end self-end">
      {!isCRUD? <button className=" md:flex bg-neutral-950 mt-auto hover:bg-neutral-800 rounded-md py-3 px-3 text-sm md:text-base max-w-[200px] text-white">
        Baca Selengkapnya
      </button> :
       <div className=" flex">
        <button onClick={()=>{ navigate('/articles/'+article._id+'/edit')}} className=" mr-3 md:flex bg-slate-800 mt-auto hover:bg-slate-700 rounded-md py-2 px-5 text-sm md:text-base max-w-[200px] text-white">
        Edit
      </button>
      <button onClick={()=> onDelete()}className=" mr-3 md:flex bg-red-700 mt-auto hover:bg-red-500 rounded-md py-2 px-3 text-sm md:text-base max-w-[200px] text-white">
        Delete
      </button>
      <button onClick={handleNavigate}className=" md:flex bg-blue-700 mt-auto hover:bg-blue-500 rounded-md py-2 px-3 text-sm md:text-base max-w-[200px] text-white">
        Open
      </button>
        </div>}
      </div>
    </div>
  </div>
</div>
}


export {ArticleSlider, HashtagList, BlogCard, HashtagListToggler}