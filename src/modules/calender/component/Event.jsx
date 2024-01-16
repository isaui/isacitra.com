import axios from "axios"
 import BASE_URL from "../../../api/base_url";
 import { useState } from 'react';
const EventCard = (
    {props={title: 'Unknown', callback: ()=>{console.log('Callback is not defined')}, action: 'Selected', timeRange: 'Unknown', isActive: true }}) =>{
    const title = props.title
    const callback = props.callback
    const timeRange = props.timeRange
    const isActive = props.isActive
    const action = props.action
    return (
        <div className="w-full h-auto flex flex-col p-4 text-white space-y-2 rounded-md bg-slate-950">
            <div className="w-full flex items-center justify-between">
                <h1>{title}</h1>
                <button  className={`ml-2 px-2 py-1 text-xs rounded-md ${isActive? 'bg-green-500' : 'bg-orange-500'} text-white`}> 
                {isActive? 'Dibuka' : 'Ditutup'}</button>
            </div>
            <div className="w-full text-xs">
                <h1>{timeRange}</h1>
            </div>
            {
                <div className="w-full flex justify-start">
                <button onClick={()=>{
                    callback()
                }} className="px-3 py-2 text-sm rounded-md bg-slate-900 text-white">{isActive? action : 'Contact Me'}</button>
            </div>
            }

        </div>
    )
}

const AuthorizedEventCard = ({ props = { title: 'Unknown', eventId: '?', callback: () => { console.log('Callback is not defined') }, timeRange: 'Unknown', isActive: true } }) => {
    const { title, callback, timeRange, eventId } = props;
    const [isActive, setIsActive] = useState(props.isActive); // Menggunakan state untuk menyimpan status isActive
  
    const onToggleStatus = async () => {
      const newStatus = !isActive;
      const queryStr = `UPDATE DEMO_EVENT SET isActive = ${newStatus} WHERE demoEventId = '${eventId}' RETURNING 1;`;
  
      try {
        // Kirim query untuk mengubah status
        await axios.post(BASE_URL + '/postgres/', {
          queryString: queryStr
        });
  
        // Jika query berhasil, perbarui state dan panggil callback
        setIsActive(newStatus);
        callback();
      } catch (error) {
        console.error('Error updating status:', error);
      }
    };
  
    const onDelete = async () => {
      const queryStr = `DELETE FROM DEMO_EVENT WHERE demoEventId = '${eventId}' RETURNING 1;`;
      try {
        // Kirim query untuk menghapus
        await axios.post(BASE_URL + '/postgres/', {
          queryString: queryStr
        });
  
        // Jika query berhasil, panggil callback
        callback();
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    };
  
    return (
      <div className="w-full h-auto flex flex-col p-4 text-white space-y-2 rounded-md bg-slate-950">
        <div className="w-full flex items-center justify-between">
          <h1>{title}</h1>
          <div>
            {/* Dropdown untuk mengubah status isActive */}
            <select
              value={isActive ? 'open' : 'closed'}
              onChange={onToggleStatus}
              className={`ml-2 px-2 py-1 text-xs rounded-md ${isActive ? 'bg-green-500' : 'bg-orange-500'} text-white`}
            >
              <option value="open">Dibuka</option>
              <option value="closed">Ditutup</option>
            </select>
          </div>
        </div>
        <div className="w-full text-xs">
          <h1>{timeRange}</h1>
        </div>
        {
          <div className="w-full flex justify-start">
            <button onClick={onDelete} className="px-3 py-2 text-sm rounded-md bg-red-700 text-white">{'Delete'}</button>
          </div>
        }
      </div>
    );
  }

export {AuthorizedEventCard}

export default EventCard