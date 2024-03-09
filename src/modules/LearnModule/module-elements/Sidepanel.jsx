import Loading from "../../../components/loading/Loading";
import ChapterDropdown from "./DropdownChapter";

const SidePanel = ({activeChapter,setActiveChapter ,chapters ,activeMateri, setActiveMateri, mataKuliah, setMataKuliah, setAddSectionBox, loading}, )=>{
    const groupedChapters = chapters.reduce((result, chapter) =>{
        const {bab} = chapter;
        const key = bab || "Tanpa Nama";
        if(!result[key]){
            result[key] =[]
        }
        result[key].push(chapter);
        return result;
    }, {});
    const data = Object.keys(groupedChapters);
    return (
        <div onClick={(e)=>{e.stopPropagation()}} className="h-screen max-h-screen bg-slate-950 w-full ">
            <div className="flex flex-col items-center  w-full min-h-screen max-h-screen bg-slate-950">
                <div onClick={()=>{
                     //navigate(`/learn/${idMatkul}/addSection`)
                     setAddSectionBox(true)
                     
                }} className=" mt-6 w-[90%] py-2 rounded-sm flex justify-center text-white bg-[#1D1C1C] hover:bg-[#333030] mr-2">
                    <h1> + Tambah Section</h1>
                </div>{
                  loading? <div className=" my-auto mx-auto">
                    <Loading/>
                  </div> :
                <div className={`${data.length == 0 ? 'my-auto' : 'mt-6'} h-full  w-[90%] text-white overflow-y-auto`}>
                    {
                        data.length == 0? <div className=" mt-auto mx-auto flex justify-center text-white">
                            <h1 className="text-sm">
                                Belum Ada Materi
                            </h1>
                        </div> : data.map((val,index)=>{
                           return  <div key={index+100}>
                            <h1 className=" text-white text-sm truncate mx-2 mb-3">{val}</h1>
                            {groupedChapters[val].map((dt,idx)=>{
                               return <ChapterDropdown activeChapter={activeChapter} setActiveChapter={setActiveChapter} setActiveMateri={setActiveMateri} activeMateri = {activeMateri}setMataKuliah={setMataKuliah} key={idx} chapter={dt} mataKuliah={mataKuliah}/>
                            })}
                           </div>
                        })
                    }
                </div>}
            </div>
        </div>
    )
}

export default SidePanel