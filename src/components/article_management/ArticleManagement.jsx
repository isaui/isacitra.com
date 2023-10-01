import { HomepageNav } from "../nav/Nav"
import Footer from "../footer/Footer"
import { useEffect, useState } from "react"
import { BlogCard } from "../article/ArticleCard";
import axios from "axios";
import Loading from "../loading/Loading";
import { useNavigate } from "react-router-dom";
import {setUser, logoutUser } from '../../slice/authSlice.js'
import { useSelector, useDispatch } from 'react-redux'
import ZeroArticle from '../../assets/Zero/zero.svg'
export default function ({navbarEnabled = true, footerEnabled=true}) {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user)
    const dispatch = useDispatch();
    const handleDelete = async (articleId) => {
        try {
            
                axios.delete('https://isacitra-com-api.vercel.app/articles/'+articleId).then((res)=>{
                setPosts((prevPosts) => prevPosts.filter((post) => post._id !== articleId));
                //console.log(res)
            })
            
        } catch (error) {
           // console.log(error)
        }
    }
    const handdleAdd = () => {
        navigate('/articles/new')
    }
    useEffect(()=>{
        if(!user){
            navigate('/authentication', {state:{message:'Anda belum mendapatkan izin untuk mengaksesnya. silahkan masuk atau membuat akun baru'}})
            return
        }
        //console.log('ini adalah user kamu deck, ', user)
        axios.post('https://isacitra-com-api.vercel.app/articles/edit', {user:user}).then( res => {
          setPosts(res.data.articles)
         // console.log('Berhasil mendapatkan artikel-artikel -> ', 'jumlah artikel : ', res.data.articles.length)
          setLoading(false)
          
        }).catch(err => {
            if(err.response.status == '401'){
                navigate('/authentication', {state:{message:'Anda belum mendapatkan izin untuk mengaksesnya. silahkan masuk atau membuat akun baru'}})
            }
           // console.log(err)
        })
      }, [user])
    return <div>
    <div className=' min-h-screen flex justify-start flex-col w-full'>
        {navbarEnabled && <HomepageNav/>}
     <div className={`  min-h-screen w-full  ${navbarEnabled? 'mt-16' : 'mt-2'} flex flex-col items-center justify-start`}>
        <div className="  justify-items-start  w-full mx-auto max-w-5xl flex justify-end">
        <button  type="button" onClick={handdleAdd} className="mt-3 px-5 py-2 mr-2 bg-slate-950 text-white rounded hover:bg-slate-800">+ Tambah Artikel</button>
        </div>


     <div className={`w-full  mx-auto   ${posts.length >= 1? ' ' : ' my-auto'}`} >
     {loading? <><div className="w-full mx-auto my-auto flex items-center -mt-12  min-h-screen justify-center"><Loading/></div></>:( posts.length > 0? posts.map((post, index) => {
        return <div key={post._id} className=" my-3 max-w-5xl mx-auto">
            <BlogCard key={ post._id} article={post} isCRUD={true} onClick={()=>{}} onDelete={()=>{handleDelete(post._id)}} previewMaxLength={200}/>
        </div>
      }): 
      <div className="flex items-center   ">
          <div className=" my-auto h-full flex justify-center items-center mx-auto md:flex-row flex-col-reverse">
          <div className="mx-8">
          <h1 className=" text-red-400 lg:text-5xl md:text-4xl text-3xl mx-auto md:text-left text-center mt-3">Upss...</h1>
          <p className=" text-gray-200 lg:text-2xl md:text-2xl text-lg text-center md:text-left">Tidak ada artikel.</p>
          </div>
          <div className="">
              <img className= " lg:min-h-[200px] lg:h-[210px] md:min-h-[180px] md:h-[190px] h-[180px]"src={ZeroArticle} alt="" />
          </div>
          </div>
      </div>
    )}
     </div>
      
    </div>
    {footerEnabled && <Footer/>}
    </div>
</div>
}
