
const SectionButton = ({props}) => {
    const callback = props.callback
    const title = props.title
    const isActive = props.isActive
    return (
        <button onClick={()=> {
            callback(title)
        }} className={`px-2 py-1  space-y-1 text-white flex flex-col items-center text-base font-light text-center`}>
            <h1 className={`${isActive}`}>{title}</h1>
            {
                isActive &&
                <hr className="border-2 w-full  border-gray-400 rounded"/>
            }

        </button>
    )
}

export default SectionButton