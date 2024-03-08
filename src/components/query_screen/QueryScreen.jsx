import { HomepageNav } from "../nav/Nav";
import Footer from "../footer/Footer";
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import BASE_URL from "../../api/base_url";

const QueryScreen =  ()=>{
    const [isQuery, setIsQuery] = useState(false);
    const [schema, setSchema] = useState('');
    const [queryResult, setQueryResult] = useState('');
    const ref = useRef(null);

    useEffect(()=>{
        getSchema()
    },[])

    const submitQuery = async () => {
        if(! ref.current && ref.current.value.trim().length != 0){
            return
        }
        const queryString = ref.current.value
        const res = await axios.post(BASE_URL+"/query-simulator", {query: queryString})
        setIsQuery(true)
        setQueryResult(res.data.query_result)

        
}

    const getSchema = async () => {
        const querySchema = `
        SELECT 
        table_schema,
        table_name,
        column_name,
        data_type,
        character_maximum_length
    FROM 
        information_schema.columns
    WHERE table_schema = 'sistel'
    ORDER BY 
        table_name, 
        ordinal_position`;

        const res = await axios.post(BASE_URL+"/query-simulator", {query: querySchema})
        const schemaString = res.data.query_result;
        setSchema(schemaString)
    }

    return <div className=" bg-slate-900">
    <div className='mx-auto min-h-screen flex justify-center items-center flex-col w-full max-w-[1600px] '>
        <HomepageNav floatingButtonOpen={false}/>
     <div className='homepage-content  min-h-screen w-full flex flex-col my-auto items-center max-w-full'>
      <div className=" min-h-screen w-full pt-24 px-4 max-w-6xl mx-auto">
            <div className="flex flex-col w-full mb-4">
            <h1 className="text-2xl text-white mb-3">Current Schema</h1>
            <div className="flex border border-neutral-700 rounded-md
                     w mt-1 w-full min-h-48  text-white p-3 max-h-[16rem] overflow-y-auto  bg-neutral-900">
                            {
                                schema.length == 0 ? <p className="text-center">Belum Ada Hasil</p> :
                                <p className="w-full break-words">{schema}</p>
                            }
                </div>
            </div>
            <div className="flex md:grid grid-cols-2 flex-col w-full md:gap-x-4 space-y-4 md:space-y-0">
                <div className="flex flex-col w-full md:grow md:max-w-[1/2] ">
                    <h1 className="text-2xl text-white mb-3">Query Simulator</h1>
                    <textarea ref={ref} placeholder="Tuliskan query di sini..." className="border border-neutral-700 rounded-md
                     w mt-1 w-full min-h-48 h-48 text-white p-3  bg-neutral-900"></textarea>
                     <div className="flex w-full mt-4">
                        <button onClick={submitQuery} className="px-4 py-2 w-full rounded-md text-center 
                        text-lg font-bold text-white bg-teal-700">Query</button>
                     </div>
                    
                </div>
                <div className="flex flex-col w-full md:grow md:max-w-[1/2] ">
                <h1 className="text-2xl text-white mb-3">Result</h1>
                <div className="flex border border-neutral-700 rounded-md
                     w mt-1 w-full min-h-48 max-h-[16rem] overflow-y-auto  text-white p-3  bg-neutral-900">
                        {
                            !isQuery && <p className="text-center">Belum Ada Hasil</p>
                        }
                        {
                            isQuery && <p className="text-left w-full break-words">{queryResult}</p>
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