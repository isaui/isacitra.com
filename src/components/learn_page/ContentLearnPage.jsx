import React from "react";
import { HomepageNav } from "../nav/Nav";
import Footer from "../footer/Footer";
import Error from '../../assets/error/error.svg'
import { FaBook } from "react-icons/fa";

export default function () {
    return (
        <div className="">
        <div className=' min-h-screen flex justify-center flex-col items-center w-full'>
            <button className="fixed top-3 left-5  p-4 rounded-md bg-neutral-950 hover:bg-neutral-800"><FaBook  size={24} color="white"/></button>
        </div>
    </div>
    )
}