import React from 'react'
import { Button, FAQs, Terminal } from '../index'

const Home = () => {
    return (
        <div className='mx-auto overflow-x-hidden transition-all delay-300 bg-[#111] '>
            <div className='flex justify-between max-w-7xl my-8 px-6 md:px-4 mx-auto '>
                <div className='flex flex-col  justify-center items-center md:items-start  flex-1 text-white gap-12 md:gap-10 '>
                    <h1 className='nexus_gradient '>NEXUS</h1>
                    <p className='md:w-[24rem] text-[1.25rem] w-[90%] sm:w-3/4'>
                        A community for the students of Computer Science and Engineering
                        <br />NIT Surat.
                    </p>
                    <p className='text-gray-400 w-[90%] sm:w-10/12 md:w-[28rem] text-[1.25rem] '>
                        We foster engagement with students from all years to create a connected and inclusive learning community.
                    </p>
                    <Button href={'#terminal'} >
                        Explore More
                    </Button>
                </div>
                <div className='hidden md:flex relative flex-1 z-0 '>
                    <div className='bg-screen-gradient my-12 '>
                        <img className='w-80 h-40 drop-shadow-[0_35px_35px_rgba(0,0,0,0.25)] brightness-75 absolute left-[20rem] -top-4 ' src='/assets/learning.png' alt='' />
                        <img className='w-80 h-40 drop-shadow-[0_35px_35px_rgba(0,0,0,0.45)] brightness-75 absolute left-[10rem] top-[10rem]' src='/assets/coding.png' alt='' />
                        <img className='w-80 h-40 drop-shadow-[0_35px_35px_rgba(0,0,0,0.25)] brightness-75 absolute left-[20rem] -bottom-4' src='/assets/play.png' alt='' />
                    </div>
                </div>
            </div>
            <label id='terminal' />
            <div className='my-48 w-full' >
                <Terminal />
            </div>
            <div className='my-48 w-full relative '>
                <FAQs />
            </div>
        </div>
    )
}

export default Home
