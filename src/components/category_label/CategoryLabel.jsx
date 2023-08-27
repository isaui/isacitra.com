import React from 'react';

function CategoryLabel({ categoryName, onDelete }) {
  return (
    <div className="flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded mt-2 mr-2">
      <span>{categoryName}</span>
      <button
        className="ml-2 text-red-500"
        onClick={() => onDelete(categoryName)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-label="Delete"
        >
          <path
            fillRule="evenodd"
            d="M6.293 5.293a1 1 0 011.414 0L10 8.586l2.293-2.293a1 1 0 111.414 1.414L11.414 10l2.293 2.293a1 1 0 01-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 01-1.414-1.414L8.586 10 6.293 7.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
}

export default CategoryLabel;