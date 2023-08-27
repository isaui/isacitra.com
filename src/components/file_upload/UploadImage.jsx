import React, { useState } from 'react';
import Loading from '../loading/Loading';

const FileUploadComponent = ({setToUpload, status, setStatus}) => {
  const [file, setFile] = useState(null);
 

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setStatus('undefined')
  };

  //const handleUpload = (e) => {
   // e.preventDefault()
   // console.log('ajojing')
   // if (file) {
      // Lakukan tindakan unggah berkas ke server di sini
   //   console.log('Unggah berkas:', file.name);
   //   setUrlImage()
   // }
 // };

  return (
    <div className="flex items-center justify-center w-full">
      <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full min-h-[22rem] border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-slate-800  hover:bg-slate-700">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          {file != null? <>
          <img src={URL.createObjectURL(file)} alt="Preview" className=" w-3/5 md:w-1/3 rounded-lg aspect-[4/3] mb-4" />
          <div className='  w-[60%] md:w-[33%] text-sm md:text-base '>
          <h1 className=' text-white truncate'>Selected: <span className=' text-[#00A8FF] overflow-ellipsis'>{ file.name
          }</span> </h1>
          <h1 className=' text-white'> Hasil: {status == 'undefined'? <span className='text-[#00A8FF]'> Belum Di-upload</span> :
            status == 'error'? <span className='text-red-500'> Upload Gagal</span> : status == 'uploading' ? 
            <span className='text-[#00A8FF]'> Sedang mengupload...</span> : <span className='text-green-500'> Upload Berhasil</span>
          } </h1>

          </div>
          </> :
          <>
          <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
          </svg>
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
          </>}
          
        </div>
        <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} />
        <button className="mt-3 px-4 mb-3 py-2 bg-blue-500 text-white rounded" onClick={(e)=> {setToUpload(e,file)}}>{status=='uploading'? <Loading/> : "Upload"}</button>
      </label>
    </div>
  );
}

export default FileUploadComponent;