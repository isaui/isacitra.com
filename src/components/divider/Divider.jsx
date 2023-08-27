import React from "react";

const CircleWithDivider = ({number}) => {
    return <div className="flex items-center justify-center w-full space-x-2">
    <div className="border-t w-1/4"></div>
    <div className="rounded-full bg-gray-300 w-12 h-12 flex items-center justify-center">
      <span className="text-black text-lg font-bold">{number}</span>
    </div>
    <div className="border-t w-1/4"></div>
  </div>
}

export {CircleWithDivider}