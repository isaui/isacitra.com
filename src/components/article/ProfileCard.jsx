import React from "react";
import ProfilePicture from "../../assets//profile/profile.svg";
import UnknownAvatar from '../../assets/unknown/unknown_avatar.svg';


const ProfileCard = ({author, click}) => {
    return <div className="flex flex-col  md:min-h-[20rem] mx-auto px-5 bg-teal-700 bg-opacity-10 my-3 pb-1 md:pb-3 md:rounded-lg w-full md:min-w-[200px]   md:max-w-xs certificate-card"><div className="   w-full mx-auto  flex justify-start items-center flex-col">
             
             <div className=" mt-4  w-full ">
             <div>
                <img className=' w-32 h-32 md:w-36 md:h-36 rounded-full mx-auto my-1 md:my-6'src={author.profile.avatar == ''? UnknownAvatar : author.profile.avatar} alt="" />
             </div>
             <div className="hidden md:block  text-center text-gray-100 mx-2 mb-1 mt-3 certificate-title font-bold text-sm md:text-base">
                <h1>{author.profile.firstName} {author.profile.lastName}</h1>
             </div>
        
             <div className=" hidden md:block text-white mx-2 text-sm certificate-detail">
                 <hr className="border-t-1 border-[#19A7CE] my-2 -mx-2" />
             </div>
             </div>

             <div className=" w-full md:w-auto pl-2 md:pl-0 md:pt-0 pt-4 flex flex-col h-full mb-3">
             <div className="  text-gray-100 mx-2 mb-1 mt-3 certificate-title font-bold text-xl md:hidden text-center">
                <h1>{author.profile.firstName} {author.profile.lastName}</h1>
             </div>
             <div className=" text-gray-500 font-normal mx-2 text-sm mb-4 text-center">
                <p>{author.profile.bio}</p>
             </div>
             
             </div>
             


    </div>
    <div onClick={()=>{click()}} className=" self-center mx-2 mt-auto w-1/2">
                <button className="w-full hover:bg-slate-700 bg-slate-900 text-white py-2 mb-2 rounded-md">Hubungi Author</button>
             </div>
    </div>
}
export default ProfileCard;

//