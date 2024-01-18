import  { useState } from 'react';
import Modal from 'react-modal';
import { v4 as uuidv4 } from 'uuid';

Modal.setAppElement('#root'); 

const DemoScheduler = ({onEventSubmit}) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [email, setEmail] = useState('');
  const initialId = uuidv4()
  const [infoSesi, setInfoSesi] = useState({[initialId]:{id: initialId, date: '', sessions: [{ startTime: '', endTime: '',  id: uuidv4()}]}});
  const tambahSesi = (sessionId) => {
    const updatedSessions = {...infoSesi};
    updatedSessions[sessionId].sessions.push({startTime:'',endTime:'',id: uuidv4(),})
    setInfoSesi(updatedSessions)
  }
  const hapusSesi = (sessionId, index) => {
    const updatedSessions = {...infoSesi};
    updatedSessions[sessionId].sessions.splice(index,1)
    setInfoSesi(updatedSessions)
  }
  const tambahTanggalSesi = (sessionId) => {
    const updatedSessions = {...infoSesi, [sessionId]:  {date:'', id: sessionId ,sessions:[]} };
    setInfoSesi(updatedSessions)
  }
  const editSesi = (sessionId, index, key, value) =>{
    const updatedSessions = {...infoSesi};
    updatedSessions[sessionId].sessions[index][key] = value
    setInfoSesi(updatedSessions)
  }
  const editTanggalSesi = (sessionId, newDate) => {
    const updatedSessions = {...infoSesi};
    updatedSessions[sessionId].date = newDate
    setInfoSesi(updatedSessions)
  }
  const hapusTanggalSesi = (sessionId) => {
    const updatedSessions = {...infoSesi}
    delete updatedSessions[sessionId]
    setInfoSesi(updatedSessions)
  }


  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  

  const handleSubmit = (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      // Jika email tidak valid, tampilkan popup alert
      alert("Email tidak valid");
      return;
    }
    const newEvent = {
    id:uuidv4(),
    email:email,
      title,
      startDate,
      endDate,
      infoSesi,
    };
    onEventSubmit(newEvent)
   // console.log(newEvent); // Output newEvent to console for testing purposes
    closeModal();
  };

  return (
    <div className="w-full mx-auto">
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={openModal}
      >
        Buat Event
      </button>

      <Modal isOpen={modalIsOpen} style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)' // Warna latar belakang gelap
          },
          
        }} onRequestClose={closeModal} className="modal bg-neutral-800 p-2 rounded-2xl mx-auto max-w-2xl max-h-[80vh]  flex flex-col mt-24">
        <div className='flex flex-col w-full p-6 overflow-y-auto'>
        <h2 className="text-2xl font-bold mb-4 text-white">Buat Event Jadwal Demo</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Judul Event:
            </label>
            <input
              className="border rounded w-full py-2 px-3"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              className="border rounded w-full py-2 px-3"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Tanggal Mulai:
            </label>
            <input
              className="border rounded w-full py-2 px-3"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Tanggal Selesai:
            </label>
            <input
              className="border rounded w-full py-2 px-3"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>

          <div className="mb-4 w-full flex flex-col">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Info Sesi
            </label>
            <div onClick={()=>{
                tambahTanggalSesi(uuidv4())
            }} className='ml-auto my-2 px-3 py-2 text-white bg-slate-900'>Tambah Tanggal</div>
            {
                Object.entries(infoSesi).map(([key, value]) => {
                    return <div key={key} className='flex flex-col w-full p-4 mb-2 rounded-md bg-slate-950'>
                        <label className="block text-gray-700 text-sm font-bold mb-1">
                            Tanggal
                        </label>
                        <div className='flex w-full items-center space-x-4'>
                        <input
                            className="border rounded w-full mb-2 py-2 px-3 grow"
                            type="date"
                            value={value.date}
                            onChange={(e) => editTanggalSesi(key, e.target.value)}
                            required
                        />
                        <div
                        
                        onClick={()=>{
                            hapusTanggalSesi(key)
                        }}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                        >
                        Hapus
                        </div>

                        </div>
                        {
                            value.sessions.map((sesi, index)=>{
                                return <div key={key+'-'+sesi.startTime+'-'+sesi.endTime}
                                 className='flex rounded-md p-2 mb-2 bg-slate-800 items-center '>
                                    <input
                                        className="border rounded w-1/3 py-2 px-3 mr-2"
                                        type="time"
                                        value={sesi.startTime}
                                        onChange={(e) =>
                                        {
                                            editSesi(key,index,'startTime',e.target.value)
                                        }
                                        }
                                        required
                                    />
                                    <input
                                        className="border rounded w-1/3 py-2 px-3 mr-2"
                                        type="time"
                                        value={sesi.endTime}
                                        onChange={(e) =>
                                        editSesi(key,index, 'endTime', e.target.value)
                                        }
                                        required
                                    />

                                    <div
                                       
                                        onClick={() => hapusSesi(key,index)}
                                        className="bg-red-500 text-white px-2 py-1 rounded"
                                    >
                                        Hapus
                                    </div>
                                </div>
                            })
                        }
                        <div
                       
                        onClick={()=>{
                            tambahSesi(key)
                        }}
                        className="bg-green-500 text-center text-white px-3 py-1 rounded"
                        >
                        Tambah Sesi
                        </div>

                    </div>
                })
            }
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Simpan
          </button>
        </form>
        </div>
      </Modal>
    </div>
  );
};

export default DemoScheduler;





