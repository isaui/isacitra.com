import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const certificationArray = [
    {
      title: "The Web Developer Bootcamp",
      publisher: "Udemy",
      instructor: "Colt Steele",
      time: "12 Agustus 2023",
      credentialId: "UC-9f408b4f-a051-45d6-8a13-bf6352c846a7",
      imgsrc: "https://img-b.udemycdn.com/course/240x135/4297574_42d1_4.jpg"
    },
    {
      title: "Flutter and Dart - The Complete Guide",
      publisher: "Academind",
      instructor: "Maximilian Schwamuller",
      time: "17 Juli 2023",
      credentialId: "UC-64f2544b-28dc-41a9-a244-3889882a71e5",
      imgsrc: "https://img-c.udemycdn.com/course/480x270/1708340_7108_5.jpg"
    },
    {
      title: "Figma UI UX Design Essentials",
      publisher: "Udemy",
      instructor: "Daniel Walter Scott",
      time: "1 Juni 2023",
      credentialId: "UC-9c56d3c2-8812-4a8a-9bc2-10f2eaee796b",
      imgsrc: "https://img-c.udemycdn.com/course/750x422/4359576_b9e1_2.jpg"
    },
    {
        title: "The Complete 2023 Web Development Bootcamp",
        publisher: "Udemy",
        instructor: "Dr.Angela Yu",
        time: "22 Agustus 2023",
        credentialId: "UC-1805b288-410b-436c-a8c1-a0d8f114c128",
        imgsrc: "https://process.fs.teachablecdn.com/ADNupMnWyR7kCWRvm76Laz/resize=width:705/https://www.filepicker.io/api/file/FSIjaoI2QtKWZL65cogd"
      },
    // You can continue adding more objects as needed
  ];

const CertificateContainer = ({ data }) => {
    const [showAll, setShowAll] = useState(false);

    const toggleShowAll = () => {
        setShowAll(!showAll);
    };

    return (
        <div className="">
            <div className="mt-3 -mb-3 flex justify-center items-center">
                <h1 className="text-white md:text-3xl text-2xl font-bold text-center"><span className="text-[#00A8FF]">Sertifikasi</span> Saya</h1>
                <div className="ml-3">
            <button
                    className="px-4 py-2 text-white bg-slate-800  text-xs rounded-md hover:bg-slate-700"
                    onClick={toggleShowAll}
                >
                    {showAll ? 'Tampilkan Lebih Sedikit' : 'Tampilkan Semua'}
                </button>
            </div>
            </div>
            
            <div className="flex justify-center">
                <div className="my-4 mx-auto text-center md:my-8 justify-center grid grid-flow-row auto-rows-max md:grid-cols-2 lg:grid-cols-3 md:gap-4 lg:gap-6 max-w-[1240px]">
                    {data.slice(0, showAll ? data.length : 3).map((value, index) => (
                        <div key={index} className="flex flex-col">
                            <CertificateCard data={value} />
                        </div>
                    ))}
                </div>
                
            </div>
        </div>
    );
}

const CertificateCard = ({data}) => {
    const navigate = useNavigate()
    return <div className=" flex-auto my-3 rounded-lg max-w-xs certificate-card w-auto flex flex-col">
             
             <div>
                <img className=' w-full h-auto rounded-t-lg'src={data.imgsrc} alt="" />
             </div>
             <div className=" text-gray-100 mx-2 mb-1 mt-3 certificate-title font-bold text-base">
                <h1>{data.title}</h1>
             </div>
             <div className=" text-gray-700 mx-2 text-sm">
                <p>Diterbitkan pada {data.time}</p>
             </div>
             <div className=" text-white mx-2 text-sm certificate-detail">
                 <hr className="border-t-1 border-[#19A7CE] my-2 -mx-2" />
                <p>Instruktur:  <span>{data.instructor}</span></p>
             </div>
             <div className=" text-white mx-2 text-sm certificate-detail">
             <hr className="border-t-1 border-[#19A7CE] my-2 -mx-2" />
                <p>Penerbit:  <span>{data.publisher}</span></p>
             </div>
             <div className=" text-white mx-2 text-sm certificate-detail">
             <hr className="border-t-1 border-[#19A7CE] my-2 -mx-2" />
                <p>Kode Kredensial:  <span>{data.credentialId}</span></p>
             </div>
             <div className=" text-white mx-2 text-sm certificate-detail">
             <hr className="border-t-1 border-[#19A7CE] my-2 -mx-2" />
             </div>
             <div className="mx-2 mt-auto">
                <button className="w-full bg-slate-900 hover:bg-slate-950 text-white py-2 mb-2 rounded-md"><a href={'https://www.udemy.com/certificate/'+data.credentialId}>Buka</a></button>
             </div>


    </div>
}

export {CertificateCard, CertificateContainer, certificationArray}