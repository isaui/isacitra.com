/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { FaBook} from "react-icons/fa";
import { AiOutlineClose, AiOutlineEdit } from "react-icons/ai";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from "../../../components/loading/Loading";
import mongoose from "mongoose";
import { useSelector, useDispatch } from "react-redux";
import { updateCurrentActiveMateri } from "../../../slice/mapMatkulSlice";
import { HashtagList } from "../../../components/article/ArticleCard";
import { getDayString, getMonthString } from "../../../../utils/date";
import Ably from 'ably/build/ably-webworker.min';
import BASE_URL from "../../../api/base_url";
import AddSectionBox from "../module-elements/AddSectionBox";
import EditVideoBox from "../module-elements/EditVideoBox";
import AddVideoBox from "../module-elements/AddVideoBox";
import Sidebar from "../module-elements/Sidebar";
import SidePanel from "../module-elements/Sidepanel";


const ably = new Ably.Realtime({
  key: 'o7gv-w.ulW0zw:olcD9FroY5pv3a9EhFzb4X7Hth-nedgovu4bdz8bsFI'
})
const channel = ably.channels.get('update-matkul-channel')
const formatDateAndTime = (dateObject) => {
    const formattedDay = getDayString(dateObject.getDay()); 
    const formattedMonth = getMonthString(dateObject.getMonth() + 1);
    return `${formattedDay}, ${dateObject.getDate()} ${formattedMonth} ${dateObject.getFullYear()}`;
};

const NotesPage = ({matkul, activeMateri, activeChapter }) => {
  const navigate = useNavigate()
  const user = useSelector((state) => state.auth.user);
  return <div className=" w-full h-screen flex-col flex items-center">
    <div onClick={(e)=>{
      e.stopPropagation();
      const lastUrl = "/learn/"+matkul._id
      navigate('/learn/'+activeChapter._id+"/addNote", {state: {matkulId:matkul._id, activeMateriId: activeMateri._id, activeChapterId: activeChapter._id, lastUrl}})
    }} className="fixed lg:hidden bottom-12  right-6 text-white text-sm flex justify-center rounded-md items-center px-4 py-2 bg-neutral-800 hover:bg-neutral-700">
      <h1> + Tambah Note</h1>
    </div>
    <div onClick={(e)=>{
      e.stopPropagation();
      const lastUrl = "/learn/"+matkul._id;

      navigate('/learn/'+activeChapter._id+"/addNote", {state: {matkulId:matkul._id, activeMateriId: activeMateri._id, activeChapterId: activeChapter._id, lastUrl}})
    }}
     className="absolute hidden top-4  right-6 text-white text-sm lg:flex justify-center rounded-md items-center px-4 py-2 bg-neutral-800 hover:bg-neutral-700">
      <h1> + Tambah Note</h1>
    </div>

    {activeMateri.notes.length == 0? <div className=" flex flex-col w-full h-full justify-center items-center text-white text-base">
      <h1>Belum ada note. Silahkan menambahkan</h1>
    </div>: <div className="flex flex-col items-center w-full  mt-24 md:mt-20">
      {activeMateri.notes.map((note)=>{
        //console.log(matkul)
        return <div key={note._id} className="overflow-x-auto lg:max-w-3xl max-w-full mx-auto mb-4 mx-2 bg-slate-950 bg-opacity-20 pb-3 mb-3 w-full md:min-w-[32rem] lg:min-w-[36rem] xl:min-w-[40rem] text-ellipsis  pt-3 -mt-1 rounded-lg ">
                
        <div className="text-white  text-xl md:text-2xl h-auto lg:text-3xl px-6 md:px-3 mb-3">
            <div className=" text-sm  h-auto  ">
            <HashtagList categories={note.categories}/> 
            </div>
            <div className="  max-w-full  flex overflow-ellipsis justify-between">
            <h1 className=" break-words font-bold pr-2">{note.title}</h1>
            {user? note.author._id == user._id && <AiOutlineEdit onClick={ async ()=>{
                navigate('/learn/'+matkul._id+'/editNote',{state:{matkulId:matkul._id, activeMateriId: activeMateri._id, activeChapterId: activeChapter._id, note: note}});
            }}color="white" className=" ml-4 min-w-[2rem] w-8 h-8"/> : <></>}
            </div>
            <p className=" text-sm mt-2 text-[#9ca3af]">Ditulis oleh {note.author.profile.firstName+ " "+ note.author.profile.lastName}</p>
            <p className=" text-sm mt-2 text-[#9ca3af]">Terakhir diperbarui pada {formatDateAndTime(new Date(note.lastModified))}</p>
            <hr className="border-2 border-[#1D5B79] my-2 rounded-full" />
        </div>
        {
            note.thumbnail.trim() !== '' && <div className="w-full  px-6 md:px-3 mx-auto text-[#9ca3af] my-4">
            {note.thumbnail != '' && <><img  className='my-3 w-full h-auto rounded-lg 'src={note.thumbnail} alt="" /></>}
        </div>
        }
        
        <div className= 'mb-2 w-full article px-6 md:px-3 mx-auto text-[#9ca3af]' dangerouslySetInnerHTML={{__html:note.content}}>
        </div>
        
        
     </div>
      })}
    </div>}
  </div>
}
const VideosPage = ( {setAddVideoBox, activeMateri, matkul, activeChapter}) => {
  const [edit, setEdit] = useState(false);
  const currVideo = useRef(null);
  function extractYouTubeVideoId(url) {
    const regExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?([a-zA-Z0-9_-]{11})/;
    const match = url.match(regExp);
  
    if (match && match[1]) {
      return match[1]; // Mengembalikan ID video YouTube
    } else {
      return null; // Tidak ditemukan ID video
    }
  }
  const navigate = useNavigate()
  const user = useSelector((state) => state.auth.user);
  return <>
  {edit && <EditVideoBox text={'Edit Video'} buttonText={'Edit'} activeChapter={activeChapter} currentVideo = {currVideo.current}activeMateri={activeMateri} matkul={matkul}  onCancel={()=>{
    setEdit(false)
  }}/>}
  <div className=" w-full h-screen flex-col flex items-center">
    <div  onClick={(e)=>{
      e.stopPropagation();
      if(!user){
        navigate('/authentication', {state:{message:'Anda belum mendapatkan izin untuk mengaksesnya. silahkan masuk atau membuat akun baru'}})
      }
      setAddVideoBox(true)
    }}className="fixed lg:hidden bottom-12  right-6 text-white text-sm flex justify-center rounded-md items-center px-4 py-2 bg-neutral-800 hover:bg-neutral-700">
      <h1> + Tambah Video</h1>
    </div>
    <div onClick={(e)=>{
      e.stopPropagation();
      if(!user){
        navigate('/authentication', {state:{message:'Anda belum mendapatkan izin untuk mengaksesnya. silahkan masuk atau membuat akun baru'}})
        
      }
      setAddVideoBox(true)

    }} className="absolute hidden top-4  right-6 text-white text-sm lg:flex justify-center rounded-md items-center px-4 py-2 bg-neutral-800 hover:bg-neutral-700">
      <h1> + Tambah Video</h1>
    </div>
    {activeMateri.videos.length == 0? <div className=" flex flex-col w-full h-full justify-center items-center text-white text-base">
      <h1>Belum ada video. Silahkan menambahkan</h1>
    </div>: <div className="flex flex-col items-center w-full  mt-24 md:mt-20">
      {activeMateri.videos.map((video)=>{
        return <div key={video._id} className="lg:max-w-3xl max-w-full mx-auto mb-4 mx-2 bg-slate-950 bg-opacity-20  pb-3 mb-3 w-full md:min-w-[32rem] lg:min-w-[36rem] xl:min-w-[40rem] text-ellipsis  pt-3 -mt-1 rounded-lg ">
                
        <div className="text-white  text-xl md:text-2xl h-auto lg:text-3xl px-6 md:px-3 mb-3">
            <div className="  max-w-full flex flex-wrap overflow-ellipsis justify-between">
            <h1 className=" font-bold pr-2">{video.title}</h1>
            {user? video.author._id == user._id && <AiOutlineEdit onClick={
              (e)=>{
                e.stopPropagation();
                if(!user){
                  navigate('/authentication', {state:{message:'Anda belum mendapatkan izin untuk mengaksesnya. silahkan masuk atau membuat akun baru'}})
                  
                }
                currVideo.current = video
                setEdit(true);
              }
            }color="white" size={24} className=" ml-2"/>:<></>}
            </div>
            <p className=" text-sm mt-2 text-[#9ca3af]">Dikirim oleh {video.author.profile.firstName+ " "+ video.author.profile.lastName}</p>
            <hr className="border-2 border-[#1D5B79] my-2 rounded-full" />
        </div>
        {
           <div className="w-[97%] aspect-video rounded-md  mx-auto text-[#9ca3af] my-4">
            <iframe className="w-full h-full" src={"https://www.youtube.com/embed/"+extractYouTubeVideoId(video.url)} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
        </div>
        }
        
        <div className= ' mb-2 w-full  article px-6 md:px-3 mx-auto text-[#9ca3af]' >
          <p>{video.description}</p>
        </div>
        
        
     </div>
      })}
    </div>}
  </div> </> 
}


export default function Page() {
    const {id} = useParams();
    const dispatch = useDispatch();
    const savedData = useSelector(state => state.matkul.savedData);
    const [sidebarActive, setSidebarActive] = useState(false);
    const [mataKuliah, setMataKuliah] = useState(null);
    const [SidePanelOpen ,setSidePanelOpen] = useState(false);
    const [load, setLoad] = useState(true);
    const [activeMateri, setActiveMateri] = useState(null);
    const [activeChapter, setActiveChapter] = useState(null);


    const [loading, setLoading] = useState(false);
    const [addSectionBox, setAddSectionBox] = useState(false);
    const [addVideoBox, setAddVideoBox] = useState(false);
    const [page, setPage] = useState('notes');
    const [sekali, setSudahSekali] = useState(false)

    const handleAddVideo = async (video)=>{
      if(!mataKuliah){
        return;
      }
      try {
        setLoading(true)
        const res = await axios.post(BASE_URL+"/learn/addVideo", 
        {idMatkul: mataKuliah._id, idChapter: activeChapter._id, idMateri: activeMateri._id,  dataMateri:video }
        );
        setMataKuliah(res.data)
        toast.success("Berhasil menambahkan video", {autoClose:2000})
        setAddVideoBox(false)
        setLoading(false)
      } catch (error) {
        setLoading(false)
        console.log(error)
      }
    }

      // fix
    const handleSubmitAddSection = async (judul,bab) => {
      if(!mataKuliah) {
        return
      }
      if(judul.trim()==""){
        return toast.error("Maaf judul tidak boleh kosong!!!", {autoClose:2000})
      }
      try {
        setLoading(true)
        const newSection = {
          _id: new mongoose.Types.ObjectId(),
          title: judul.trim(),
          bab:bab.trim(),
          materi:[]
        }
        const res = await axios.post(BASE_URL+"/learn/addSection", 
        {idMatkul: mataKuliah._id, dataChapter: newSection });

        setMataKuliah(res.data)
        setLoading(false)
        setAddSectionBox(false)
        toast.success("Berhasil menambahkan section", {autoClose:2000})
        console.log(mataKuliah)
      } catch (error) {
        console.log(error)
        setLoading(false)
        toast.error("Terjadi kesalahan dalam menambahkan section", {autoClose:2000})
      }
    }

    useEffect(()=>{
      const fetchData = async ()=>{
        try {
            const MataKuliah = (await axios.get(BASE_URL+'/learn/' + id)).data;
            setMataKuliah(MataKuliah);
            setLoad(false)
        } catch (error) {
            console.log(error)
            setLoad(false)
        }
    };
    fetchData();
    }, [])

    useEffect(()=>{
          channel.subscribe('update-matkul', (message)=>{
          console.log(message)
          console.log("heiii update ini!!")
          if(message.data.chapters != undefined  && mataKuliah !== message.data){
            console.log('aku di sini! bersama mu...')
            setMataKuliah(message.data)
            console.log('active ch -> ', activeChapter)
            console.log('active materi - >', activeMateri)
            if(! activeChapter || !activeMateri){
              return
            }
            if(message.data && activeChapter && activeMateri){
              const chapterId = activeChapter._id;
                  const materiId = activeMateri._id;
                    if(chapterId){
                      const chapterSelected = message.data.chapters.find(chapter => chapter._id == chapterId)
                      if(chapterSelected){
                        const materiSelected = chapterSelected.materi.find(materi=> materi._id == materiId)
                        if(materiSelected){
                          setActiveChapter(chapterSelected)
                          setActiveMateri(materiSelected)
                          dispatch(updateCurrentActiveMateri({key: "active-materi", value: materiSelected._id,
                          idMatkul:mataKuliah._id
                          }))
                          dispatch(updateCurrentActiveMateri({key: "active-chapter", value: chapterSelected._id,
                          idMatkul:mataKuliah._id
                          }))
                        }
                      }
                    }
            }
          }
          }
        )
    
        return () => {
          channel.unsubscribe('update-matkul')
        };


    },[activeChapter, activeMateri])

   


    useEffect(()=>{
      if(! mataKuliah) {
        return
      }
    var edited = false;
    console.log('pusing gw')
   // console.log('ini saved data: ', savedData)

      try {
        console.log('huh apasih ini error kah?')
        console.log(savedData['active-chapter'+'-'+mataKuliah._id],'-' ,savedData['active-materi'+'-'+mataKuliah._id])
        if(!sekali && savedData['active-chapter'+'-'+mataKuliah._id] && savedData['active-materi'+'-'+mataKuliah._id]){
          console.log('di sini !!!!')
          const chapterId = savedData['active-chapter'+'-'+mataKuliah._id];
          const materiId = savedData['active-materi'+'-'+mataKuliah._id];
          if(chapterId){
            const chapterSelected = mataKuliah.chapters.find(chapter => chapter._id == chapterId)
            if(chapterSelected){
              const materiSelected = chapterSelected.materi.find(materi=> materi._id == materiId)
              if(materiSelected){
                setActiveChapter(chapterSelected)
                setActiveMateri(materiSelected)
                edited = true;
              }
            }
          }
          setSudahSekali(true)
        }
  
        //
        
        else if(! activeMateri && ! edited){
          let materiPertama = null;
          console.log('berarti di sini dong? rute errornya mana sih dek dek')
          for (let i = 0; i < mataKuliah.chapters.length; i++) {
            const chapter = mataKuliah.chapters[i];
            if (chapter.materi.length > 0) {
                setActiveChapter(chapter)
                materiPertama = chapter.materi[0]; // Mengambil materi pertama jika ada materi
                break; // Menghentikan pencarian setelah menemukan materi pertama
             }
            }
            if(materiPertama){
              setActiveMateri(materiPertama);
            }
        }
        setSudahSekali(true)
      } catch (error) {
        console.log(error)
      }
      
    },[mataKuliah, activeMateri])


    const toggleSidebar = () => {
        setSidebarActive(prev => !prev);
    }
    const closeSidebar = ()=> {
        setSidebarActive(false);
    }

    const handleResize = () => {
        if (window.innerWidth >= 1024) {
          closeSidebar()
          setSidePanelOpen(true)
        }
        if( window.innerWidth < 1024) {
            setSidePanelOpen(false)
        }
      };
      useEffect(() => {
        window.addEventListener('resize', handleResize);
        handleResize(); // Panggil handleResize pada awal render
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }, []);
      

    
    return (
        <div className="">
        <div className=' min-h-screen flex justify-center items-center w-full'>
          {addVideoBox && <AddVideoBox loading={loading} onCancel={()=>{setAddVideoBox(false)}} buttonText={'Add'} text={'Tambahkan Video'} onConfirm={(data)=>{ handleAddVideo(data)}}/>}
        <ToastContainer/> {addSectionBox && <AddSectionBox loading={loading} onCancel={()=>{setAddSectionBox(false)}} buttonText={'Add'} text={'Tambahkan Section'} onConfirm={(judul,bab)=>{handleSubmitAddSection(judul,bab)}}/>}
            {<div onClick={()=>{

                closeSidebar()
            }} className={` bg-gray-950 bg-opacity-20 fixed ease-in-out duration-500 top-0  z-10 w-full ${sidebarActive? 'left-0':'left-[-100%]'}`}>
                <Sidebar setSidebar={setSidebarActive} activeChapter={activeChapter}setActiveChapter={setActiveChapter} setActiveMateri={setActiveMateri} activeMateri={activeMateri} loading={load} setAddSectionBox={setAddSectionBox} mataKuliah={mataKuliah} setMataKuliah={setMataKuliah} idMatkul={id} chapters={mataKuliah? mataKuliah.chapters : []}/>
            </div>}
            <button onClick={()=> {
                toggleSidebar()
            }}className="fixed top-3 right-5 z-20  p-3 rounded-lg bg-neutral-950 hover:bg-neutral-800 lg:hidden">{
            sidebarActive? <AiOutlineClose size={24} color="white"/> : <FaBook  size={24} color="white"/>
            }</button>

            <div className={`w-[25%] h-screen ${SidePanelOpen ? 'flex' : 'fixed left-[-100%]'}`}>

                <SidePanel activeChapter={activeChapter} setActiveChapter={setActiveChapter} setActiveMateri={setActiveMateri} activeMateri={activeMateri} loading={load} setAddSectionBox={setAddSectionBox} mataKuliah={mataKuliah} setMataKuliah={setMataKuliah} chapters={mataKuliah? mataKuliah.chapters : []} idMatkul={id}/>
            </div>
            <div className=" w-full lg:w-[75%] min-h-screen  max-h-screen  relative ">
                  {load ? <div className=" flex justify-center h-full items-center min-h-screen w-full"> <Loading/> </div> : !activeMateri? 
                  <div className="flex justify-center h-full items-center w-full  min-h-screen my-auto mx-auto text-white text-base">
                    <h1>Belum Ada Materi. Silahkan Menambahkan</h1>
                  </div> : 
                  <div className=" w-full h-full overflow-y-auto">
                    <TabBar activeTab={page} onTabClick={(str)=>{setPage(str)}}/>
                    {page == 'notes' && <NotesPage matkul={mataKuliah} activeChapter={activeChapter} activeMateri={activeMateri}/>}
                    {page == 'videos' && <VideosPage activeChapter={activeChapter} matkul={mataKuliah} setAddVideoBox={setAddVideoBox} activeMateri={activeMateri}/>}
                    </div>}
            </div>
        </div>
    </div>
    )
}

// eslint-disable-next-line no-unused-vars
function TabBar({ activeTab='notes', onTabClick=(_str)=>{} }) {
  return (
    <div className=" text-sm fixed lg:absolute top-2 left-1/2 transform -translate-x-1/2 bg-gray-800 rounded-full p-2 shadow-lg">
      <button
        className={`rounded-full mr-2 py-2 px-4 focus:outline-none ${
          activeTab === 'notes' ? 'bg-slate-950 text-white' : 'bg-gray-600 text-gray-400'
        }`}
        onClick={() => onTabClick('notes')}
      >
        Notes
      </button>
      <button
        className={`rounded-full py-2 px-4 focus:outline-none ${
          activeTab === 'videos' ? 'bg-slate-950 text-white' : 'bg-gray-600 text-gray-400'
        }`}
        onClick={() => onTabClick('videos')}
      >
        Videos
      </button>
    </div>
  );
}







