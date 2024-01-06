import React, { useState } from 'react'

const Dropdown = ({ question, answer }) => {
    const [isShowAns, setIsShowAns] = useState(false)
    return (
        <div className={`p-4 bg-gray-400/25 w-[90%] max-h-[50rem] md:w-3/4  transition-all duration-300 rounded-md sm:text-base md:text-lg `} >
            <div className='px-2 font-semibold flex justify-between items-center cursor-pointer ' onClick={e => setIsShowAns(!isShowAns)}>
                <h2 className='w-3/4'>{question ?? "Your Question?"}</h2>
                <img src="/assets/down_arrow.svg" alt="DownArrow" className={`h-4 w-4 transition duration-300 ${isShowAns && "rotate-180"}`} />
            </div>
            <div className={`overflow-hidden transition-all duration-300 ${isShowAns ? "max-h-[30rem] opacity-100 " : "max-h-0 opacity-0"}`}>
                <p className='p-2 text-gray-400'>{answer ?? "Your answer shown here \n "}</p>
            </div>
        </div>
    )
}

export default Dropdown