
const History = ({props={
    time: '12.02 AM',
    message: 'No message',
    eventName: 'No event name'
}}) => {
    const {time, message, eventName} = props
    return (
        <div className="w-full h-auto flex flex-col p-4 text-white space-y-2 rounded-md bg-slate-950">
            <div className="flex text-xs w-full text-blue-600 items-center">
                <h1>{eventName}</h1>
            </div>
            <div className="w-full text-justify text-sm flex items-center">
                <p>{message}</p>
            </div>
            <div className="w-full justify-end text-right text-xs flex items-center">
                <p>{time}</p>
            </div>
        </div>
    )
}

export default History