import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import BASE_URL from "../../../api/base_url";
import Loading from "../../../components/loading/Loading";

const EditVideoBox = ({  onCancel, matkul, activeChapter, activeMateri, currentVideo,  text, buttonText }) => {
    const [judulMateri, setJudulMateri] = useState('');
    const [urlVideo, setUrlVideo] = useState('');
    const [deskripsi, setDeskripsi] = useState('');
    const [loadingDel, setLoadingDel] = useState(false);
    const [loading,setLoading] = useState(false);
  
    useEffect(()=>{
      if(currentVideo){
        setJudulMateri(currentVideo.title);
        setDeskripsi(currentVideo.description);
        setUrlVideo(currentVideo.url);
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    const handleInputChange = (event) => {
      const { name, value } = event.target;
      if (name === 'judulMateri') {
        setJudulMateri(value);
      } else if (name === 'urlVideo') {
        setUrlVideo(value);
      } else if (name === 'deskripsi') {
        setDeskripsi(value);
      }
    };
  
    return (
      <>
      <ToastContainer/>
      <div onClick={() => onCancel()} className="fixed inset-0 flex items-center justify-center z-50">
        <div className="relative w-full max-w-md mx-auto my-6">
          <div onClick={(e) => { e.stopPropagation() }} className="relative flex flex-col w-full bg-gray-900 border-2 border-blue-600 rounded-lg shadow-lg outline-none focus:outline-none">
            <div className="flex items-start justify-between p-5 border-b border-gray-700 rounded-t">
              <h3 className="text-2xl font-semibold text-white">{text}</h3>
              <button
                className="p-1 ml-auto bg-transparent border-0 text-white opacity-70 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={onCancel}
              >
                <span className="text-white h-6 w-6 text-2xl block outline-none focus:outline-none">
                  ×
                </span>
              </button>
            </div>
            <div className="relative p-6 flex-auto">
              <label className="text-white md:text-lg text-base leading-relaxed">Judul Video:</label>
              <input
                type="text"
                name="judulMateri"
                value={judulMateri}
                onChange={handleInputChange}
                className="my-2 px-3 py-2 w-full bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring focus:border-blue-300"
              />
  
              <label className="text-white md:text-lg text-base leading-relaxed">URL Video Youtube:</label>
              <input
                type="text"
                name="urlVideo"
                value={urlVideo}
                onChange={handleInputChange}
                className="my-2 px-3 py-2 w-full bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring focus:border-blue-300"
              />
  
              <label className="text-white md:text-lg text-base leading-relaxed">Deskripsi:</label>
              <textarea
                name="deskripsi"
                value={deskripsi}
                onChange={handleInputChange}
                className="my-2 px-3 py-2 w-full h-24 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring focus:border-blue-300"
              ></textarea>
            </div>
            <div className="flex items-center justify-end p-6 border-t border-gray-700 rounded-b">
              <button
                className="text-white bg-blue-600 rounded-md hover:bg-blue-800 px-6 py-2 text-sm font-medium outline-none focus:outline-none mr-2"
                onClick={() => {
                  if(judulMateri.trim().length == 0){
                    return toast.error('Maaf judul tidak boleh kosong', {autoClose:2000});
                  }
                  if(urlVideo.trim().length == 0){
                    return toast.error('Maaf url tidak boleh kosong', {autoClose:2000});
                  }
                  if(deskripsi.trim().length == 0){
                    return toast.error('Maaf deskripsi tidak boleh kosong',{autoClose:2000});
                  }
                  setLoading(true)
                  try {
                    axios.post(BASE_URL+"/learn/editVideo",{
                      idMatkul: matkul._id, idChapter:activeChapter._id, idMateri:
                      activeMateri._id, idVideo:currentVideo._id ,dataVideo:{
                        title: judulMateri,
                        url:urlVideo,
                        description:deskripsi
                      }
                    })
                    setLoading(false)
                    onCancel()
                    
                  } catch (error) {
                    console.log(error)
                    setLoading(false)
                  }
                
                }}
                  
                  
  
  
              >
                {loading ? <Loading /> : <h1>{buttonText}</h1>}
              </button>
  
              <button
                className="text-white bg-red-600 rounded-md hover:bg-red-800 px-6 py-2 text-sm font-medium outline-none focus:outline-none mr-2"
                onClick={ async() => {
                  try {
                    setLoadingDel(true);
                    await axios.post(BASE_URL+"/learn/deleteVideo",
                    {idMatkul:matkul._id, idChapter: activeChapter._id, idMateri: activeMateri._id,  idVideo: currentVideo._id })
                 setLoadingDel(false)
                 onCancel()
                  } catch (error) {
                    setLoadingDel(false)
                  }}}
                 
              >
                {loadingDel ? <Loading /> : <h1>{'Delete'}</h1>}
              </button>
  
              <button
                className="text-white bg-gray-600 rounded-md hover:bg-gray-700 px-6 py-2 text-sm font-medium outline-none focus:outline-none"
                onClick={onCancel}
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      </div></>
    );
  };

  export default EditVideoBox