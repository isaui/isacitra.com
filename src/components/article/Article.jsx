import React, { useEffect, useRef, useState,  } from "react";
import Footer from "../footer/Footer";
import { HomepageNav } from "../nav/Nav";
import axios from 'axios'
import Loading from "../loading/Loading";
import ProfileCard from "./ProfileCard";
import {FacebookShareButton, FacebookIcon, TwitterIcon, TwitterShareButton, WhatsappIcon, WhatsappShareButton, LineShareButton, LineIcon} from 'react-share';
import { Disqus } from "../discussion/Discussion";
import { useNavigate, useParams } from "react-router-dom";
import {getDayString, getMonthString} from '../../../utils/date.js'
import { HashtagList, HashtagListToggler} from "./ArticleCard";
import ErrorPage from "../error/ErrorPage";
import FloatingTabbar from "../floating_tabbar/Floating_TabBar";
import ArticleComments from "./ArticleComments";
import { useDispatch, useSelector } from 'react-redux';
import ViewCounter from "../view_counter/ViewCounter";
import { ToastContainer, toast } from 'react-toastify';
import CopyLinkApp from "../copy_link/CopyLink";
import TableOfContentOverlay from "../toc/TOC";
import Suscribe from "../suscribe/Suscribe";
import ContactAuthor from "../contact/ContactAuthor";




const ShareButtons = ({url, quote}) => {
    const hastag = '#InterestingArticle'
    return (
        <div className="flex flex-start w-full">
            <div className=" mr-3">
            <FacebookShareButton
        url={url}
        quote={quote}
        hashtag={hastag}>
        <FacebookIcon size={42} round />
      </FacebookShareButton>
            </div>

            <div className=" mr-3">
            <TwitterShareButton
        url={url}
        quote={quote}
        hashtag={hastag}>
        <TwitterIcon size={42} round />
      </TwitterShareButton>
            </div>

            <div className=" mr-3">
            <LineShareButton
        url={url}
        quote={quote}
        hashtag={hastag}>
        <LineIcon size={42} round />
      </LineShareButton>
            </div>

            <div className=" mr-3">
            <WhatsappShareButton
        url={url}
        quote={quote}
        hashtag={hastag}>
        <WhatsappIcon size={42} round />
      </WhatsappShareButton>
            </div>

      
        </div>
    )
}

const ArticlesGroupCard = ({title, data, imgSrc}) => {

    const navigate = useNavigate(); // Pastikan useNavigate digunakan di dalam komponen ini

  const handleNavigate = (id) => {
    console.log(id)
    // Gunakan navigate untuk melakukan navigasi dengan URL yang sesuai
   navigate(`/articles/${id}`,{ replace: true });

  };

  
    return (
        <>
        <div className=" w-full flex flex-col h-auto md:min-w-[300px]  min-w-[200px] min-h-[400px] rounded-lg bg-teal-700 bg-opacity-10 my-2 md:mr-12 md:max-w-xl">
            <div className="py-2">
            <h1 className=" text-2xl text-white mx-auto text-center">
                {title}
            </h1>
            
            <hr className="border-t-4 border-[#19A7CE] mx-2" />
            </div>
            <div className={`flex flex-col ${data.length != 0? 'justify-start' : 'justify-center my-auto'}`}>
            { data.length == 0? (
            <>
            <div className="my-auto mx-auto px-12 text-center text-white">
                <h1>Tidak ada artikel yang terkait dengan ini</h1>
            </div>
            </>):data.map((article,index) => (
            <>
            <div onClick={()=>handleNavigate(article._id)} key= {article._id}className="my-2 flex justify-start items-start hover:bg-slate-800">
                <div className=" ml-2 rounded-full w-[24px] h-[24px] min-w-[24px] min-h-[24px] bg-[#19A7CE] flex justify-center items-center">
                    <div>{index+1}</div>
                </div>
                <div className=" text-gray-300 text-base pb-2 font-normal ml-2 mr-4 relevant-article-subtitle text-justify">
                    <h1>{article.title}</h1>
                </div>
            </div>
            </>))}
            </div>
            
            <div>

            </div>
        </div>
        </>
    )
}

const ArticlesGroupCardType2 = ({title, data}) => {
    console.log(data.length)
    return (
        <>
        <div className=" w-full flex flex-col h-auto md:min-w-[300px]  min-w-[250px] min-h-[400px] rounded-lg bg-slate-800 my-2 md:max-w-xl">
            <div className="py-2">
            <h1 className=" text-2xl text-white mx-auto text-center">
                {title}
            </h1>
            <hr className="border-t-4 border-[#19A7CE] mx-2" />
            </div>
            <div className={`flex flex-col ${data.length != 0? 'justify-start' : 'justify-center my-auto'}`}>
            { data.length == 0? (
            <>
            <div className="my-auto mx-auto px-12 text-center text-white">
                <h1>Tidak ada artikel yang terkait dengan ini</h1>
            </div>
            </>):data.map((value,index) => (
            <>
            <div key= {index}className="my-2 flex justify-start items-start hover:bg-slate-800">
                <div className=" ml-2 rounded-full w-[24px] h-[24px] min-w-[24px] min-h-[24px] bg-[#19A7CE] flex justify-center items-center">
                    <div>{index+1}</div>
                </div>
                <div className=" text-gray-300 text-base pb-2 font-normal ml-2 mr-4 relevant-article-subtitle text-justify">
                    <h1>{value.title}</h1>
                </div>
            </div>
            </>))}
            </div>
            
            <div>

            </div>
        </div>
        </>
    )
}

const formatDateAndTime = (dateObject) => {
    const formattedDay = getDayString(dateObject.getDay());
    const formattedMonth = getMonthString(dateObject.getMonth() + 1);
    return `${formattedDay}, ${dateObject.getDate()} ${formattedMonth} ${dateObject.getFullYear()}`;
};

const Article =   function (){

    const { id } = useParams();
    const user = useSelector((state) => state.auth.user)

    const [popUpAuthor, setPopUpAuthor] = useState(false)

    const navigation = useNavigate();
    const handleNavigate = (id) => {
        navigation('/articles/'+id)
        
      }
    
    const [post, setPost] = useState(null);
    const [relatedPosts, setRelatedPosts] = useState([]);
    const [isReady, setReady] = useState(false);
    const [isError, setError] = useState(false);
    const [isCommentOpen, setCommentOpen] = useState(false);
    const [isTOCOpen, setTOC] = useState(false)
    
    useEffect(() => {
        const handleNavigation = () => {
            setCommentOpen(false);
            document.body.style.overflow = 'unset';
        };

        window.addEventListener('beforeunload', handleNavigation);

        return () => {
            window.removeEventListener('beforeunload', handleNavigation);
        };
    }, []);
    

    const toggleComment = () => {
        
        if(isCommentOpen){
            setCommentOpen(false)
            document.body.style.overflow = 'unset';
        }
        else{
            setCommentOpen(true)
            setTOC(false)

            if (typeof window != 'undefined' && window.document) {
                document.body.style.overflow = 'hidden';
            }
        }
    }
    const toggleTOC = () => {
        if(isTOCOpen){
            
            setTOC(false)
            document.body.style.overflow = 'unset';
            
        } else{
            setTOC(true)
            if (typeof window != 'undefined' && window.document) {
                document.body.style.overflow = 'hidden';
            }}
    }
    

    const likePost = async () =>{
        if(!user){
            toast.error('Anda harus login untuk menilai artikel ini', {autoClose:2000} )
            return
        }
        if(post.likes.includes(user._id)) {
            const updatedLikes = post.likes.filter((userId) => userId !== user._id);
            setPost((prev)=>({...prev, likes: updatedLikes}))
            await axios.post('https://isa-citra.adaptable.app/articles/update-reaction', {likes: updatedLikes, dislikes:post.dislikes, postId: post._id, userId: user._id})
            
            return;
        }
        const updatedLikes = [...post.likes, user._id]
        const updatedDislikes = post.dislikes.filter((userId) => userId !== user._id)
        setPost((prev) => ({ ...prev, likes: updatedLikes, dislikes:updatedDislikes }))
        await axios.post('https://isa-citra.adaptable.app/articles/update-reaction', {likes: updatedLikes, dislikes:updatedDislikes, postId: post._id, userId: user._id})
        
        
    }
    const dislikePost = async () => {
        if(!user){
            toast.error('Anda harus login untuk menilai artikel ini', {autoClose:2000} )
            return
        }
        if(post.dislikes.includes(user._id)){
            const updatedDislikes = post.dislikes.filter((userId) => userId !== user._id);
            setPost((prev)=>({...prev, dislikes: updatedDislikes }))
            await axios.post('https://isa-citra.adaptable.app/articles/update-reaction', {likes: post.likes, dislikes:updatedDislikes, postId: post._id, userId: user._id})
            return;
        }

        const updatedDislikes = [...post.dislikes, user._id]
        const updatedLikes = post.likes.filter((userId) => userId !== user._id)
        setPost((prev) => ({ ...prev, dislikes: updatedDislikes, likes:updatedLikes }))
        await axios.post('https://isa-citra.adaptable.app/articles/update-reaction', {likes: updatedLikes, dislikes:updatedDislikes, postId: post._id, userId: user._id})
        
        
    }

    
    
    useEffect(() => {
        axios.get(`https://isa-citra.adaptable.app/articles/${id}`).
        then((result) => {
            const {post} = result.data;
            const {relatedArticles} = result.data;
            setPost(prev => post);
           setRelatedPosts(relatedArticles);
           //console.log(JSON.parse(post.tableOfContents))
           setReady(prev=>true)
        }).catch(err => {
            console.log(err)
            setError(prev => true)
            console.log(err)
        
        })


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




      const notify = (data) => {
        if(data.status == 'success'){
            toast.success(data.message, {autoClose:2000})
        }
        else{
            toast.error(data.message, {autoClose:2000})
        }
    }

    


    
    return isError?  <ErrorPage statusCode={'404'} message={'Maaf Artikel Tidak Ditemukan'}/>:<div className=" ">
            <HomepageNav/> 
            <ToastContainer/>
            {post!=null && popUpAuthor &&  <ContactAuthor post={post} onClickOutside={()=> {setPopUpAuthor(false)}} notify={notify}/>}
            {post!=null && isTOCOpen && <><div onClick={toggleTOC} className="fixed bg-black bg-opacity-40 w-full min-h-screen z-20"><div onClick={(e)=>{
                e.stopPropagation();
            }}className="  fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 z-30 "><TableOfContentOverlay title={'Table of Contents'} toggle={toggleTOC}tableOfContents={JSON.parse(post.tableOfContents)}/></div></div></>}
           {post!=null && <> <FloatingTabbar toggleTOC={toggleTOC}toggleComment={toggleComment} toggleLike={likePost} toggleDislike={dislikePost} post={post}/>
            <ArticleComments toggle={toggleComment} isOpen={isCommentOpen} post={post} isReady={isReady} toggleComment={toggleComment}/> </>}
        <div className={` min-h-screen flex justify-center  ${isCommentOpen? 'bg-black bg-opacity-40' : ''} flex-wrap flex-col items-center w-full`}>
         <div className='mt-24 min-h-screen w-full flex flex-col items-center relative'>
        {  
            post == null ? <div className=" absolute top-1/2 left-1/2"><Loading/></div> : <div className="  min-h-screen flex flex-col w-full max-w-6xl lg:pr-4  lg:items-start items-center  justify-center  lg:flex-row  mb-4">
            {post == null ? <Loading/> : 
             <div className="max-w-2xl  mx-auto bg-red-600   -mb-3 w-full md:min-w-[28rem] lg:min-w-[36rem] xl:min-w-[40rem] text-ellipsis h-full pt-3 -mt-1 rounded-lg lg:max-w-2xl  min-h-screen">
                
                <div className="text-white  text-xl md:text-2xl h-auto lg:text-3xl px-6 md:px-3 mb-3">
                    <div className=" text-sm  h-auto  ">
                    <HashtagList categories={post.categories}/>
                    <ViewCounter views={post.views}/>
                    </div>
                    <div className="  max-w-full flex flex-wrap overflow-ellipsis">
                    <h1 className="  pr-2">{post.title}</h1>
                    </div>
                    <p className=" text-sm mt-2 text-[#9ca3af]">Ditulis oleh {post.author.profile.firstName + " "+post.author.profile.lastName}</p>
                    <p className=" text-sm mt-2 text-[#9ca3af]">Terakhir diperbarui pada {formatDateAndTime(new Date(post.lastModified))}</p>
                    <hr className="border-2 border-[#1D5B79] my-2 rounded-full" />
                </div>
                {
                    post.thumbnail.trim() !== '' && <div className="w-full article px-6 md:px-3 mx-auto text-[#9ca3af] my-12">
                    {post.thumbnail != '' && <><img  className='article rounded-lg 'src={post.thumbnail} alt="" /></>}
                </div>
                }
                
                <div className= ' mb-2 w-full  article px-6 md:px-3 mx-auto text-[#9ca3af]' dangerouslySetInnerHTML={{__html:post.content}}>
                </div>
                
                
             </div>
            }
            <div className="mx-auto w-full  lg:max-w-xs max-w-3xl">
            <div className="  py-3 h-min  flex flex-col items-center justify-center space-y-4  md:mb-auto md:min-h-[150px] rounded-lg w-full mx-auto md:mr-4 md:ml-0 my-8 md:mt-0">
                
                <div className=" flex flex-col md:flex md:flex-row lg:flex lg:flex-col justify-center items-center ">
                <div >
                <ShareButtons url={'isacitra.com/articles/'+post._id} quote={`Check out this interesting article: ${post.title}`}/>
                </div>
                <CopyLinkApp initialUrl={'isacitra.com/articles/'+post._id}/>
                </div>
                
                <div className=" mx-auto  flex flex-col w-full space-x-4 md:grid  lg:items-center md:justify-center md:grid-cols-2 lg:flex lg:flex-col items-center md:items-start justify-center">
                <div className=" w-full flex md:min-h-[400px]  ">
                <ProfileCard author={post.author} click={()=>{setPopUpAuthor(true)}}/>
                </div>
                <div className=" w-full lg:hidden  h-auto max-w-xs">
                    <ArticlesGroupCard data={relatedPosts}  title={'Artikel Terkait'}/>
                </div>
                <div className="  hidden lg:flex w-full max-w-xs">
                <Suscribe/>
                </div>
                </div>
                <div className=" w-full hidden lg:flex  h-auto max-w-xs">
                    <ArticlesGroupCard data={relatedPosts}  title={'Artikel Terkait'}/>
                </div>
                
            </div>
            </div>
            </div>
        }
        </div>
        </div>
        <div className=" ">
        <Footer/>
        </div>
    </div>
}

export {Article, ArticlesGroupCard, ArticlesGroupCardType2, formatDateAndTime}
