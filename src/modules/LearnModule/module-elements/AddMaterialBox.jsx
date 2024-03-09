import Loading from "../../../components/loading/Loading";
import { useState } from "react";

const AddMaterialBox = ({ onConfirm, onCancel, text, buttonText, loading }) => {
    const [judulMateri, setJudulMateri] = useState('');
  
    const handleInputChange = (event) => {
      setJudulMateri(event.target.value);
    };
  
    return (
      <div onClick={() => onCancel()} className="fixed inset-0 flex items-center justify-center z-50">
        <div className="relative w-full max-w-md mx-auto my-6">
          <div onClick={(e) => { e.stopPropagation() }} className="relative flex flex-col w-full bg-gray-900 border-2 border-blue-600 rounded-lg shadow-lg outline-none focus:outline-none">
            {/* Header */}
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
            {/* Content */}
            <div className="relative p-6 flex-auto">
              <label className="text-white md:text-lg text-base leading-relaxed">Judul Materi:</label>
              <input
                type="text"
                value={judulMateri}
                onChange={handleInputChange}
                className="my-2 px-3 py-2 w-full bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            {/* Footer */}
            <div className="flex items-center justify-end p-6 border-t border-gray-700 rounded-b">
              <button
                className="text-white bg-blue-600 rounded-md hover:bg-blue-800 px-6 py-2 text-sm font-medium outline-none focus:outline-none mr-2"
                onClick={() => onConfirm(judulMateri)}
              >
                {loading? <Loading/> : <h1>{buttonText}</h1>}
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
      </div>
    );
  };
  export default AddMaterialBox