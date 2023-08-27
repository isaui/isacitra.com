import React, { useRef, useState , useEffect} from "react";
import UnknownAvatar from '../../assets/unknown/unknown_avatar.svg';
import { AiOutlineAccountBook } from "react-icons/ai";
import { FaAddressBook, FaPencilAlt, FaUserCircle, FaDoorOpen } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import  {setUser, logoutUser} from '../../slice/authSlice.js';


const UserDropdown = ({user}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const handleClickOutside = (event) => {
    //console.log('here')
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    // Tambahkan event listener ketika komponen sudah ter-mount
    document.addEventListener("mousedown", handleClickOutside);

    // Hapus event listener ketika komponen akan di-unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOptionClick = (optionTitle) => {
    // Handle option click here
    if(optionTitle == "My Post"){
        navigate('/articles/edit')
    }
    else if(optionTitle == "Log Out"){
        dispatch(logoutUser())
    }
    else if(optionTitle == "Account"){
        navigate('/dashboard')
    }
    // You can add specific logic for each option, such as navigation or logging out
  };

  const dropdownOptions = [{title:"Account", icon: FaUserCircle}, {title: "My Post", icon: FaPencilAlt}, {title: "Log Out", icon: FaDoorOpen}];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        type="button"
        className="inline-flex items-center justify-center w-full rounded-md  shadow-sm px-4 py-2 bg-transparent text-sm font-medium text-white  focus:outline-none focus:ring  focus:ring-offset-slate-800 "
        id="user-dropdown"
        aria-haspopup="true"
        aria-expanded="true"
      >
        <img
          className="w-8 h-8 rounded-full mr-2"
          src={user.profile.avatar == ''? UnknownAvatar :user.profile.avatar}
          alt="User Profile"
        />
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
          className="origin-top-right absolute right-0 mt-4 w-40 rounded-md shadow-lg bg-blue-950 ring-1 ring-black ring-opacity-5"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="user-dropdown"
        >
          <div className="py-1" role="none">
            {dropdownOptions.map((option) => (
              <button
                key={option.title}
                onClick={() => handleOptionClick(option.title)}
                className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                role="menuitem"
              >
                <div className=" flex justify-between items-center">
                    <h1>{option.title}</h1>
                    <option.icon className=" w-6 h-6"/>
                </div>
                
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;