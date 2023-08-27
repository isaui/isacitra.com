import React, { useState, useRef, useEffect } from 'react';

function AddCategoryForm({ onAddCategory, closeOverlay }) {
  const [categoryName, setCategoryName] = useState('');
  const inputRef = useRef(null);

  const handleAddCategory = () => {
    if (categoryName) {
      onAddCategory(categoryName);
      setCategoryName('');
      closeOverlay(); // Menutup overlay setelah menambah kategori
    }
  };
  useEffect(() => {
    // Memberikan fokus pada input setelah komponen dipasang
    inputRef.current.focus();
  }, []);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddCategory();
    }
  };

  return (
    <div className="bg-slate-800 p-8 rounded shadow-md">
      <input
        type="text"
        placeholder="Enter category name"
        value={categoryName}
        onChange={(e) => setCategoryName(e.target.value)}
        ref={inputRef} // Mengaitkan inputRef dengan elemen input
        onKeyDown={handleKeyPress}
        className="border rounded px-2 py-1 mb-2"
      />
      <div className="flex justify-start">
        <button
          className="bg-blue-500 text-white px-4 py-2 mr-2 rounded"
          onClick={handleAddCategory}
        >
          Add
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={closeOverlay}
        >
          Close
        </button>
      </div>
    </div>
  );
}



export default AddCategoryForm;