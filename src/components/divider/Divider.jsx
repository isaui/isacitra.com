const CircleWithDivider = ({number}) => {
    return <div className="flex items-center justify-center w-full space-x-2 opacity-80">
    <div className="border-2 border-[#0a88ff] grow rounded-full"></div>
    <div className="rounded-full bg-[#0a88ff] w-12 h-12 flex items-center justify-center">
      <span className="text-black text-xl font-bold">{number}</span>
    </div>
    <div className="border-2 border-[#0a88ff] grow rounded-full"></div>
  </div>
}

export {CircleWithDivider}