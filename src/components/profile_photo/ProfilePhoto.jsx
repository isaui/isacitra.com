import React, { useRef } from 'react';
import Loading from '../loading/Loading';

function ProfilePhoto({ imageUrl, altText, onUploadClick, loading=false }) {
  const fileInputRef = useRef(null);
  const handleInputChange = () => {
    const file = fileInputRef.current.files[0];
    if (file) {
      onUploadClick(file);
    }
  };
  return (
    <div className="flex items-center justify-between">
      <div className="relative">
        <img
          src={imageUrl}
          alt={altText}
          className=
          "rounded-full w-28 h-28 sm:w-20 sm:h-20 object-cover cursor-pointer"
        /><input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleInputChange}
      />
        <div
          onClick={()=>{
            fileInputRef.current.click();
          }}
          className="absolute top-0 right-0 bg-blue-500 text-white rounded-full w-8 h-8 sm:w-6 sm:h-6 flex items-center justify-center cursor-pointer"
        >
          +
        </div>
        {loading && (
        <div
          className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-800 bg-opacity-70 rounded-full"
        >
          <Loading/>
        </div>
      )}
      </div>
    </div>
  );
}

export default ProfilePhoto;