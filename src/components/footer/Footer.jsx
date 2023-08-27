import React from "react";
import Logo from "../nav/Logo";
import {FaFacebookSquare, FaLinkedin, FaGithubSquare, FaTwitterSquare} from 'react-icons/fa';
import { DisqusCommentsDummy } from "../discussion/Discussion";

export default function () {
    return (
        <div className=" bg-[#000000]">
            <div className=" max-w-[1240px] mx-auto px-3 pt-6 pb-6 grid lg:grid-cols-4 gap-8 text-gray-300">
            <div className="lg:-mt-2"><Logo/></div>
            <div className="-mt-[16px] lg:mt-0 px-2 w-full lg:col-span-2">
            <h1 className="text-xl mb-2 text-[#00A8FF]">Tentang Saya</h1>
            <p className=" text-justify text-sm text-gray-300">Saya adalah mahasiswa Fasilkom UI jurusan Ilmu Komputer yang sedang menjalani semester 3. Meskipun demikian, saya tidak pernah merasa puas dengan apa yang telah saya capai. saya ingin terus maju untuk membangun diri dan karir saya kedepannya. Pengunjung yang budiman, terimakasih telah meluangkan waktu untuk mengunjungi website Isa Citra.</p>
            </div>
            <div className="flex justify-between mx-2 my-4 lg:mt-0 md:w-[75%]">
            <a href="https://web.facebook.com/people/Isa-Citra-Buana/pfbid026RjWKyQW2eaPzFQ7tgyoQbkSEtHvAxpqsAwsUxDQHoz4JLZSRHZmRXqoEBZJJKwxl/"><FaFacebookSquare size={40}/></a>
            <a href="https://linkedin.com/in/isacitra"><FaLinkedin size={40}/></a>
            <a href="https://github.com/isaui"><FaGithubSquare size={40}/></a>
            <a href="https://twitter.com/isa_buana"><FaTwitterSquare size={40}/></a>
            </div>
            <div className="w-full lg:col-span-4 mx-auto">
                <p className="text-white text-xs text-center ">@ 2023 Isa Citra Buana. Seluruh hak cipta dilindungi</p>
            </div>
        </div>
        </div>
    )
}