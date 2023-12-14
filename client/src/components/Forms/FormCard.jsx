import React from 'react'
import { Button } from "../index"
import { FaShareSquare } from "react-icons/fa";
const FormCard = () => {
    return (
        <div className='p-6 bg-white text-black w-2/5 flex flex-col gap-2 rounded-md'>
            <div className='font-semibold flex justify-between'>
                <div>
                    <h2 className='text-2xl font-bold'>CodeSprint</h2>
                    <p className='font-mono font-medium text-gray-400 text-sm'>Coding Challenge</p>
                </div>

                <div>
                    <Button className='border-none outline-none bg-blue-700 px-4 py-2 rounded-md text-white text-sm' isButton={true}><FaShareSquare /></Button>
                </div>
            </div>
            <div className='font-semibold flex justify-between my-2'>
                <div className='font-bold'>Deadline : 30/12/23</div>
                <div className='text-gray-800 font-mono '>Status: ACCEPTING</div>
            </div>
            <div className='font-semibold flex justify-between my-4'>
                <div className='bg-gray-400 rounded-full py-2 px-4 text-white font-bold'>Starts 01/01/24</div>
                <div className='text-green-800 font-mono text-xl'>1500+ Participating</div>
            </div>
            <div className='flex justify-between gap-6'>

                <Button className='border border-blue-700 font-semibold bg-transparent  px-4 py-2 w-full rounded-md text-blue-700 text-sm' isButton={true} variant='secondary'>More Details</Button>
                <Button className='border border-blue-700 font-semibold outline-none bg-blue-700 px-4 py-2 w-full rounded-md text-white text-sm' isButton={true} variant='primary'>Register Now</Button>
            </div>
        </div>
    )
}

export default FormCard