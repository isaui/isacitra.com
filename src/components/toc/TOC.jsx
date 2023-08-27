import React from 'react';import { useNavigate } from 'react-router-dom';


const TableOfContentOverlay = ({ isOpen, tableOfContents, toggleTOC }) => {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-yellow-300 ${
        isOpen ? 'block' : 'hidden'
      }`}
    >
      <div className="bg-gray-800 rounded-lg p-4 w-4/5 lg:w-1/2">
        <h2 className="text-white text-lg font-semibold mb-4">Table of Contents</h2>
        <ul>
          {tableOfContents.map((item, index) => (
            <li key={index} className="mb-2">
              <a
                href={`#${item.id}`}
                className="text-blue-400 hover:text-blue-300"
              >
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const TOG = ({title, tableOfContents, toggle}) => {
    const scrollToHeading = (id) => {
        const headingElement = document.getElementById(id);
        if (headingElement) {
          headingElement.scrollIntoView({ behavior: 'smooth' });
        }
      };
    console.log(tableOfContents)
    const navigate = useNavigate()
    return <div className=" max-h-[50%]  flex-auto my-3 rounded-lg max-w-[18rem] md:max-w-xs  px-4 py-2 certificate-card w-auto flex flex-col bg-slate-950">
             
             <div className=" text-gray-100 mx-2 mb-1 mt-3 certificate-title font-bold md:text-2xl text-xl">
                <h1>{title}</h1>
             </div>
             {
                <div className=' overflow-y-auto'>{tableOfContents.map((value, index) => <div className=" text-white mx-2 md:text-lg text-base  certificate-detail">
                <hr className="border-t-1 border-[#19A7CE] my-2 -mx-2" />
               <p>{index+1}:   <a onClick={(e)=>{
                    e.preventDefault;
                    scrollToHeading(value.id);
                    toggle();
               }} ><span>{value.text}</span></a></p>
            </div>)}</div>
             }
             
             <div className=" text-white mx-2 text-sm certificate-detail">
             <hr className="border-t-1 border-[#19A7CE] my-2 -mx-2" />
             </div>
             <div className="mx-2  mt-auto">
                <button onClick={toggle}className="w-full bg-slate-900 hover:bg-slate-950 text-white py-2 mb-2 rounded-md">Tutup</button>
             </div>


    </div>
}

export default TOG;