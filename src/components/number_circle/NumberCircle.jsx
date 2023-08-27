import React from "react";
const NumberCircle = ({ number }) => {
    return (
        <div className="flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full text-white text-xl font-bold">
            {number}
        </div>
    );
};
export default NumberCircle