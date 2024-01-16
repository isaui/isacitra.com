import { useState, useRef, useEffect} from 'react';

const BookingModal = ({ onClose, onSubmit, onError }) => {
  const [selectedPlatform, setSelectedPlatform] = useState('discord');
  const textRef = useRef(null);
  const modalRef = useRef();

  const handlePlatformChange = (event) => {
    setSelectedPlatform(event.target.value);
  };
  const validateEmail = (email) => {
    // Format email yang sederhana (gunakan ekspresi reguler yang lebih lengkap jika diperlukan)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const handleSubmit = () => {
    // Lakukan sesuatu berdasarkan platform yang dipilih
   // console.log(`Anda memilih platform: ${selectedPlatform}`);
    // ... Lakukan sesuatu dengan platform yang dipilih
    if(!textRef.current){
      onError('Terjadi error pada sistem')
      return;
    }
    if(textRef.current.value.trim() == '' || !validateEmail(textRef.current.value)){
      onError('Email tidak valid')
      return
    }
    onSubmit(selectedPlatform, textRef.current.value); // Panggil callback onSubmit dengan platform yang dipilih
    onClose(); // Tutup modal setelah menyelesaikan tindakan
  };
  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  };

  useEffect(() => {
    // Menambahkan event listener ketika komponen dimounted
    document.addEventListener('mousedown', handleClickOutside);
    
    // Membersihkan event listener ketika komponen diunmounted
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  

  return (
    <div  className="modal fixed inset-0 flex items-center justify-center ">
      <div ref={modalRef}  className="bg-white p-8 rounded shadow-lg">
        <div className='mb-4'>
          <label htmlFor="" className='font-bold'>Email</label>
          <input ref={textRef} type="text" placeholder='Enter your Email'className="border  border-neutral-700 rounded-md w-full text-white px-3 py-3 mt-1 bg-neutral-900" />
        </div>
        <h2 className="font-bold mb-4">Pilih Platform</h2>
        <label className="block mb-2">
          <input
            type="radio"
            value="discord"
            checked={selectedPlatform === 'discord'}
            onChange={handlePlatformChange}
            className="mr-2"
          />
          <span className="text-blue-500">Discord (Rekomendasi)</span>
        </label>
        <label className="block mb-2">
          <input
            type="radio"
            value="google meet"
            checked={selectedPlatform === 'google meet'}
            onChange={handlePlatformChange}
            className="mr-2"
          />
          <span className="text-green-500">Google Meet</span>
        </label>
        <label className="block mb-2">
          <input
            type="radio"
            value="website"
            checked={selectedPlatform === 'website'}
            onChange={handlePlatformChange}
            className="mr-2"
          />
          <span className="text-red-500">Website Saya (Tidak Direkomendasikan)</span>
        </label>
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default BookingModal;
