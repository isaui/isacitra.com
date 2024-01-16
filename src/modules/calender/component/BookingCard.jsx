
const BookingCard = ({props={
    time: 'NOT DEFINED',
    title: 'Demo',
    onCancel: () => {},
    platform: 'Discord',
    status: 'Active',
    email: 'dot@example',
    administrator: null,
    npm: null
}}) =>{
    const {time, title, status, onCancel, platform, email, administrator, npm} = props;
    return (
        <div className="w-full p-4 flex flex-col space-y-2 rounded-md text-white bg-slate-950">
            <div className="w-full text-base  flex justify-between">
                <h1>{title}</h1>
                <button  className={`ml-2 px-2 py-1 text-xs rounded-md ${status == 'active'? 'bg-green-500' : 
                status == 'completed'? 'bg-orange-500' : 'bg-red-500'} text-white`}> 
                {status}</button>
            </div>
            <div className="w-full text-justify text-sm flex items-center">
                <p>{time}</p>
            </div>
            <div className="w-full text-sm flex items-center">
                <p>{platform}</p>
            </div>
            <div className="w-full text-sm flex text-blue-600 items-center">
                <p>{email}</p>
            </div>
            {
                npm != null && 
                <div className="w-full text-sm flex text-blue-400 items-center">
                <p>{npm}</p>
            </div>
            }
            {
                <div className="w-full text-justify text-base flex-wrap flex items-center space-x-3">
                {
                    status == 'active' && <button onClick={()=>{
                        onCancel()
                    }} className="px-2 py-1 rounded-md bg-red-500 text-center">Cancel</button>
                }
                {
                    status == 'active' && administrator!= null && <button onClick={()=>{
                        administrator.onCompleted()
                    }} className="px-2 py-1 rounded-md bg-teal-500 text-center">Set Completed</button>
                }
                {
                    administrator!= null && <button onClick={()=>{
                        administrator.onDelete()
                    }} className="px-2 py-1 rounded-md bg-orange-700 text-center">Delete</button>
                }

            </div>
            }

        </div>
    )
}

export default BookingCard