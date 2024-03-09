import getPermission from "../utils/Permission"

const AccessPopUp = ({notifier=()=>{}})=>{
    return(
      <div className="fixed  justify-center md:top-4 top-12 w-full px-4 flex items-center text-white text-sm  py-2">
        <div className="flex flex-col px-2 py-2 max-w-[24rem] bg-slate-800 rounded-md">
        <h1 className=" mb-4 mx-2">
          Izinkan kamera atau mikrofon untuk menyambungkan ke  room ini.
        </h1>
        <button onClick={async()=>{
            await getPermission()
            notifier()
        }} className=" ml-auto px-2 py-1 bg-[#00A8FF] hover:bg-blue-800 text-black rounded-sm">
          Izinkan
        </button>
        </div>
      </div>
    )
  }
export default AccessPopUp