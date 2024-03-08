import { HomepageNav } from "../nav/Nav";
import Footer from "../footer/Footer";
import 'react-toastify/dist/ReactToastify.css';
import { useState } from "react";

const QueryScreen =  ()=>{
    const [isQuery, setIsQuery] = useState(false);
    
    return <div className=" bg-slate-900">
    <div className='mx-auto min-h-screen flex justify-center items-center flex-col w-full max-w-[1600px] '>
        <HomepageNav floatingButtonOpen={false}/>
     <div className='homepage-content  min-h-screen w-full flex flex-col my-auto items-center max-w-full'>
      <div className=" min-h-screen w-full pt-24 px-4 max-w-6xl mx-auto">
            <div className="flex flex-col w-full mb-4">
            <h1 className="text-2xl text-white mb-3">Current Schema</h1>
            <div className="flex border border-neutral-700 rounded-md
                     w mt-1 w-full min-h-48  text-white p-3  bg-neutral-900">
                            <p className="text-justify">Belum Ada Hasil</p>
                </div>
            </div>
            <div className="flex md:flex-row flex-col w-full md:space-x-4 space-y-4 md:space-y-0">
                <div className="flex flex-col w-full md:grow md:max-w-[1/2] ">
                    <h1 className="text-2xl text-white mb-3">Query Simulator</h1>
                    <textarea placeholder="Tuliskan query di sini..." className="border border-neutral-700 rounded-md
                     w mt-1 w-full min-h-48 h-48 text-white p-3  bg-neutral-900"></textarea>
                     <div className="flex w-full mt-4">
                        <button className="px-4 py-2 w-full rounded-md text-center 
                        text-lg font-bold text-white bg-teal-700">Query</button>
                     </div>
                    
                </div>
                <div className="flex flex-col w-full md:grow md:max-w-[1/2] ">
                <h1 className="text-2xl text-white mb-3">Result</h1>
                <div className="flex border border-neutral-700 rounded-md
                     w mt-1 w-full min-h-48  text-white p-3  bg-neutral-900">
                        {
                            !isQuery && <p className="text-center">Belum Ada Hasil</p>
                        }
                </div>
                </div>
            </div>
            </div>
        </div>
    </div>
    <Footer/>
</div>
}

export default QueryScreen