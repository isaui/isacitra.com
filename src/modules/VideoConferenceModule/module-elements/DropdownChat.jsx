import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";

const DropdownChat = ({ onSelect, options=[], selectedValue, room}) => {
    const [isOpen, setIsOpen] = useState(false);
    //const [selectedValue, setSelectedValue] = useState(options[0].label);
    const dropdownRef = useRef(null)
  
    useEffect(() => {
      // Tambahkan event listener ketika komponen sudah ter-mount
      document.addEventListener("mousedown", handleClickOutside);
  
      // Hapus event listener ketika komponen akan di-unmount
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);
    const toggleDropdown = () => {
      setIsOpen(!isOpen);
    };
  
    const handleClickOutside = (event) => {
      //console.log('here')
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
  
    return (
      <div className="relative inline-block text-left" ref={dropdownRef}>
        <button
          onClick={toggleDropdown}
          type="button"
          className="inline-flex justify-center w-full rounded-md border border-gray-700 shadow-sm px-4 py-2 bg-gray-800 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
          id="options-menu"
          aria-haspopup="true"
          aria-expanded="true"
        >
          {selectedValue == 'all'? 'Semua' : room? room.participants[selectedValue].guestId.username : 'loading...'}
          <svg
            className="-mr-1 ml-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M6.293 6.293a1 1 0 011.414 0L10 8.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
  
        {isOpen && (
          <div
            className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            <div className="py-1" role="none">
              {options.map((option, index) => {
                if(! room.participants[option].guestId.username){
                    return <div key={`null-${index}`}></div>
                }
                return <button
                  key={option}
                  onClick={() => {
                    onSelect(option);
                    setIsOpen(false)
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                  role="menuitem"
                >
                  {option == 'all'? 'Semua' : room? room.participants[option].guestId.username ?? 'loading...': "loading..." }
                </button>
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  export default DropdownChat