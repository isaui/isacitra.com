import React, { useEffect, useState } from "react";
import { HomepageNav } from "../nav/Nav";
import Footer from "../footer/Footer";
import Error from '../../assets/error/error.svg';
import {AiOutlineMenu, AiOutlineClose, AiFillCloseCircle, AiOutlineSearch} from 'react-icons/ai'
import { useNavigate} from 'react-router-dom';
import ZeroArticle from '../../assets/Zero/zero.svg';
import { HashtagList } from "../article/ArticleCard";
import DefaultThumbnail from '../../assets/no_thumbnail/default.svg'
import axios from "axios";
import Loading from "../loading/Loading";

function formatDateToDDMMYYYY(dateString) {
  // Buat objek Date dari string tanggal yang diberikan
  const date = new Date(dateString);

  // Ambil tanggal, bulan, dan tahun dari objek Date
  const day = date.getDate().toString().padStart(2, '0'); // padStart digunakan untuk menambahkan '0' jika angkanya kurang dari 10
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Bulan dimulai dari 0, jadi perlu ditambah 1
  const year = date.getFullYear();

  // Gabungkan dalam format "tanggal-bulan-tahun"
  const formattedDate = `${day}-${month}-${year}`;

  return formattedDate;
}
export default function () {
    
    const navigate = useNavigate();
    const [arr, setArr] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const setCourses =  async () => {
        try {
          setLoading(true)
          const res = await axios.get('https://isa-citra.adaptable.app/learn');
          setArr(res.data)
          setLoading(false)
        } catch (error) {
          setLoading(false)
        }
      }
      setCourses()
    }, [])
    return (
        <div className="">
        <div className=' min-h-screen flex justify-center flex-col items-center w-full'>
            <HomepageNav/>
         <div className=' min-h-screen w-full max-w-[1240px] flex flex-col'>
           <div className=" mt-28 md:mt-24 flex justify-center items-center flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 ">
           <div className="w-full md:max-w-lg">
           <MobileSearchbar/>
           </div>
           <div className="ml-auto md:ml-0 mr-4">
            <div onClick={
              ()=>{
                navigate('/learn/add')
              }
            } className=" text-white rounded-md bg-neutral-950 px-5 py-2 hover:bg-neutral-800 text-base">
                <h1>+ Tambahkan Matkul</h1>
            </div>
           </div>
           </div>
           {loading? 
           <div className="flex items-center my-auto h-full">
           <div className="w-full my-auto h-full flex justify-center items-center mx-auto md:flex-row flex-col-reverse">
           <Loading/>
           </div>
       </div>:
            arr.length == 0? <div className="flex items-center my-auto h-full">
            <div className="w-full my-auto h-full flex justify-center items-center mx-auto md:flex-row flex-col-reverse">
            <div className="mx-8">
            <h1 className=" text-red-400 lg:text-5xl md:text-4xl text-3xl mx-auto md:text-left text-center mt-3">Tidak Ada</h1>
            <p className=" text-gray-200 lg:text-2xl md:text-2xl text-lg text-center md:text-left">Matkul belum tersedia. Silahkan menambahkan.</p>
            </div>
            <div className="">
                <img className= " lg:min-h-[200px] lg:h-[210px] md:min-h-[180px] md:h-[190px] h-[180px]"src={ZeroArticle} alt="" />
            </div>
            </div>
        </div>:
           <div className="my-4 mx-auto text-center md:my-8 justify-center grid grid-flow-row auto-rows-max md:grid-cols-2 lg:grid-cols-3 md:gap-4 lg:gap-6">
                {arr.map((data, index)=> {
                    return <CourseCard data={data} key={index}/>
                })}
           </div>}
            
        </div>
        </div>
        <Footer/>
    </div>
    )
}
const MobileSearchbar = () => {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (event) => {
      setQuery(event.target.value);
    };
  
   
  const handleSubmit = (event) => {
  //  console.log(' i want to submit');
    event.preventDefault();
    if(query.trim().length >=1){
      navigate('/search?q='+query);
    }
    setQuery('');
  };
  //fixed top-[64px] left-0
    return (<div className=" py-2 px-4  w-full relative text-white"> 
    <form className="flex items-center" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Cari Mata Kuliah..."
        className=" bg-zinc-950 rounded-full py-2 pr-10 pl-4 w-full focus:outline-none focus:ring-1 focus:ring-[#00A8FF]"
        value={query}
        onChange={handleInputChange}
      />
      <button
        type="submit"
        className="absolute right-5 top-1/2 transform -translate-y-1/2"
      >
        <AiOutlineSearch size={24} color="#00A8FF" />
      </button>
    </form>
  </div>
)
}

const CourseCard = ({data}) => {
   // const navigate = useNavigate()
    return <div className=" flex-auto my-3 rounded-lg max-w-xs certificate-card w-auto flex flex-col">
             
             <div>
                <img className=' w-full h-auto aspect-video rounded-t-lg'src={data.thumbnail.trim() == ""? DefaultThumbnail : data.thumbnail} alt="" />
             </div>
             <div className=" text-gray-100 mx-2 mb-1 mt-3 certificate-title font-bold text-base">
                <h1>{data.title}</h1>
             </div>
             <div className=" text-gray-700 mx-2 text-sm">
                <p>Dibuat pada {formatDateToDDMMYYYY(data.createdAt.toString())}</p>
             </div>
             <div className=" text-white mx-2 text-sm certificate-detail">
             <hr className="border-t-1 border-[#19A7CE] my-2 -mx-2" />
                <p>Semester:  <span>{data.semester.trim()  == ""? "-":data.semester}</span></p>
             </div>
             <div className=" text-white mx-2 text-sm certificate-detail">
             <hr className="border-t-1 border-[#19A7CE] my-2 -mx-2" />
                <p>Dibuat oleh:  <span>{data.author.profile.firstName +" " +data.author.profile.lastName}</span></p>
             </div>

            {
              data.categories.length > 0 && <div className=" text-white mx-2 text-sm certificate-detail">
               <hr className="border-t-1 border-[#19A7CE] my-2 -mx-2" />
                   {data.categories.length  != 0 && <HashtagList categories={data.categories.slice(0,4)}/>}
               </div>
            }
             <div className=" text-white mx-2 text-sm certificate-detail">
             <hr className="border-t-1 border-[#19A7CE] my-2 -mx-2" />
             </div>
             <div className="mx-2 mt-auto">
                <button className="w-full bg-slate-900 hover:bg-slate-950 text-white py-2 mb-2 rounded-md"><a >Buka</a></button>
             </div>


    </div>
}