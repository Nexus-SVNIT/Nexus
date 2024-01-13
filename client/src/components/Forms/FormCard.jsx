import React from 'react'
import { Button } from "../index"
import { FaShareSquare } from "react-icons/fa";
const FormCard = () => {
    return (
        <div className='p-6 bg-white/90 text-black min-w-[20rem] w-2/5 flex flex-col gap-2 rounded-md'>
            <div className='font-semibold flex justify-between'>
                <div>
                    <h2 className='text-xl md:text-2xl font-bold'>CodeSprint</h2>
                    <p className='font-mono font-medium text-gray-400  text-xs md:text-sm'>Coding Challenge</p>
                </div>

                <div>
                    <button className='border-none outline-none  text-blue-700 px-4 py-2 rounded-md text-xs md:text-sm' isButton={true} title='Share This Form'><FaShareSquare size={20} /></button>
                </div>
            </div>
            <div className='font-semibold flex flex-col justify-between gap-2 md:my-2'>
                <div className='text-sm md:text-base font-bold'>Deadline : 30/12/23</div>
                <div className='text-gray-800 font-mono text-xs md:text-base '>Status: NOT ACCEPTING</div>
            </div>
            <div className='font-semibold flex  md:gap-6 md:flex-row justify-between items-center md:my-2'>
                <div className='bg-gray-400 rounded-full py-2 px-4 text-white font-bold w-fit text-xs md:text-base'>Starts 01/01/24</div>
                <div className='text-green-800 font-mono text-sm md:text-lg'>{Math.floor(Math.random() * 100)}+ Participating</div>
            </div>
            <div className='flex flex-col md:flex-row justify-between gap-4 md:gap-6'>

                <Button className='border border-blue-700 font-semibold bg-transparent  px-4 py-2 w-full rounded-md text-blue-700 text-sm' isButton={true} variant='secondary'>More Details</Button>
                <Button className='border border-blue-700 font-semibold outline-none bg-blue-700 px-4 py-2 w-full rounded-md text-white text-sm' isButton={true} variant='primary' to={'/register/2'}>Register Now</Button>
            </div>
        </div>
    )
}

export default FormCard