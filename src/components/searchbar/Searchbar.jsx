import React, { useState } from "react";
import {AiOutlineMenu, AiOutlineClose, AiFillCloseCircle, AiOutlineSearch} from 'react-icons/ai'
import { useNavigate} from 'react-router-dom'
const Searchbar = () => {
    const [query, setQuery] = useState('');
    const [error, setError] = useState(false);
    const navigate = useNavigate();

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSubmit = (event) => {
   // console.log(' i want to submit');
    event.preventDefault();
    if(query.trim().length >=1){
      navigate('/search?q='+query);
    }
    setQuery('');
  };
    return (<>
    <form className="flex items-center w-72 lg:w-80 " onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Cari sesuatu..."
        className=" bg-slate-800 rounded-md py-2 mr-2 px-4 w-full focus:outline-none focus:ring-1 focus:ring-[#00A8FF]"
        value={query}
        onChange={handleInputChange}
      />
      <button type="submit"><AiOutlineSearch size={24} color="#00A8FF"/></button>
      
    </form>
    </>)
}

const MobileSearchbar = () => {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (event) => {
      setQuery(event.target.value);
    };
  
   
  const handleSubmit = (event) => {
  //  console.log(' i want to submit');
    event.preventDefault();
    if(query.trim().length >=1){
      navigate('/search?q='+query);
    }
    setQuery('');
  };
    return (<div className=" bg-slate-900 py-2 px-4 fixed top-[64px] left-0 w-full z-10">
    <form className="flex items-center" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Cari sesuatu..."
        className=" bg-slate-800 rounded-md py-2 pr-10 pl-4 w-full focus:outline-none focus:ring-1 focus:ring-[#00A8FF]"
        value={query}
        onChange={handleInputChange}
      />
      <button
        type="submit"
        className="absolute right-5 top-1/2 transform -translate-y-1/2"
      >
        <AiOutlineSearch size={24} color="#00A8FF" />
      </button>
    </form>
  </div>
)
}

export {Searchbar, MobileSearchbar}