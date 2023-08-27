import React from 'react';
import { FiEye } from 'react-icons/fi'; // Import dari library icons seperti react-icons

const ViewCounter = ({ views }) => {
  return (
    <div className="   text-white p-2 rounded-md flex items-center">
      <FiEye className="mr-1" />
      <p className="text-sm">{views}</p>
    </div>
  );
};

export default ViewCounter;