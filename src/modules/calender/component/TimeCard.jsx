const TimeCard = (
    {props={callback: ()=>{console.log('Callback is not defined')}, timeRange: 'Unknown', date: '14 Januari 2014'  }}) =>{
    const callback = props.callback
    const timeRange = props.timeRange
    const date = props.date
    return (
        <div className="w-full h-auto flex flex-col p-4 text-white space-y-2 rounded-md bg-slate-950">
            <div className="w-full flex items-center justify-between">
                <h1>{timeRange}</h1>
                <h1 className="ml-2 text-xs">{date}</h1>
            </div>
            {
                <div className="w-full flex justify-start">
                <button onClick={()=>{
                    callback()
                }} className="px-3 py-2 text-sm rounded-md bg-slate-900 text-white">Book Now</button>
            </div>
            }

        </div>
    )
}

export default TimeCard