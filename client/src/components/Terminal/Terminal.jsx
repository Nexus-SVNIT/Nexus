import React from 'react'

const Terminal = () => {
    return (
        <div className='flex flex-col items-center justify-center gap-4 max-w-7xl mx-auto '>
            <h2 className='text-2xl font-semibold'>$ Nexus Terminal</h2>
            <p className='text-[1.25rem] text-gray-400'>Interact to know more about Nexus...</p>
            <div className="h-[70vh] md:h-[75vh] w-[90%] md:w-[70vw] bg-white rounded-2xl overflow-hidden text-black">
                <div className='bg-gray-300 h-10 flex items-center pl-6 list-none gap-2'>
                    <li className='bg-red-800 h-4 w-4 rounded-full'></li>
                    <li className='bg-yellow-400 h-4 w-4 rounded-full'></li>
                    <li className='bg-green-800 h-4 w-4 rounded-full'></li>
                </div>
                <div className='p-4 text-orange-500 font-semibold flex '>
                    <p>SVNIT/CSE/Nexus/User:~$</p>
                    <input type="text" placeholder='info' className='outline-none border-none ml-1' />
                </div>
            </div>

        </div>
    )
}

export default Terminal