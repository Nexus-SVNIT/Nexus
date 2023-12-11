import React from 'react'
import { Button } from '../index'

const Home = () => {
    return (
        <div className='mx-auto overflow-x-hidden'>
            <div className='flex justify-between max-w-7xl my-8 px-6 md:px-4 mx-auto '>
                <div className='flex flex-col  justify-center  flex-1 text-white gap-6'>
                    <h1 className='nexus_gradient'>NEXUS</h1>
                    <p className='md:w-[24rem] text-[1.5rem]'>
                        A community for the students of Computer Science and Engineering
                        <br />NIT Surat.
                    </p>
                    <p className='text-gray-400 md:w-[28rem] text-[1.25rem]'>
                        We foster engagement with students from all years to create a connected and inclusive learning community.
                    </p>
                    <Button>Explore More</Button>
                </div>
                <div className='hidden md:flex relative flex-1 z-0'>
                    <div className='bg-screen-gradient my-12'>
                        <img className='w-80 h-40 drop-shadow-[0_35px_35px_rgba(0,0,0,0.25)] absolute left-[20rem] -top-4' src='/assets/learning.png' alt='' />
                        <img className='w-80 h-40 drop-shadow-[0_35px_35px_rgba(0,0,0,0.45)] absolute left-[10rem] top-[10rem]' src='/assets/coding.png' alt='' />
                        <img className='w-80 h-40 drop-shadow-[0_35px_35px_rgba(0,0,0,0.25)] absolute left-[20rem] -bottom-4' src='/assets/play.png' alt='' />
                    </div>
                </div>

            </div>


            <div className='relative my-40 w-full'>
                {/* <img src="/assets/wave.svg" alt="" className='absolute left-0 top-0 -z-10 ' /> */}

                <div className='flex flex-col items-center justify-center gap-4 max-w-7xl mx-auto '>
                    <h3 className='text-lg font-semibold'>$ Nexus Terminal</h3>
                    <p className='text-[1.25rem]'>Interact to know more about Nexus</p>
                    <div className="h-12 bg-red-500 w-full"></div>
                </div>
            </div>

        </div>
    )
}

export default Home
