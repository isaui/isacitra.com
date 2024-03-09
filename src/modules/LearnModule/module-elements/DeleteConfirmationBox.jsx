
import Loading from "../../../components/loading/Loading";

const DeleteConfirmationBox = ({ onConfirm, onCancel, text, loading }) => {
    return (
      <div onClick={()=>{onCancel()}} className="fixed inset-0 flex items-center justify-center z-50 ">
        <div className="relative w-full max-w-md mx-auto my-6 ">
          <div onClick={(e)=>{
            e.stopPropagation()
          }} className="relative flex flex-col w-full bg-gray-900 border-2 border-red-600 rounded-lg shadow-lg outline-none focus:outline-none">
            {/* Header */}
            <div className="flex items-start justify-between p-5 border-b border-gray-700 rounded-t">
              <h3 className="text-2xl font-semibold text-white">Konfirmasi Hapus</h3>
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
              <p className="my-4 text-white md:text-lg text-base leading-relaxed">
                {text}
              </p>
            </div>
            {/* Footer */}
            <div className="flex items-center justify-end p-6 border-t border-gray-700 rounded-b">
              <button
                className="text-white bg-red-600 rounded-md hover:bg-red-700 px-6 py-2 text-sm font-medium outline-none focus:outline-none mr-2"
                onClick={onConfirm}
              >
                {loading?<Loading/>:<h1>Hapus</h1>}
              </button>
              <button
                className="text-white bg-gray-600 rounded-md hover:bg-gray-700 px-6 py-2 text-sm font-medium outline-none focus:outline-none"
                onClick={onCancel}
              >
                Tidak
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
export default DeleteConfirmationBox