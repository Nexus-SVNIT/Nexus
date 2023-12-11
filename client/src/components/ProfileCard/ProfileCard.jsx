import React from 'react'

const ProfileCard = () => {
    return (
        <div className='bg-white text-black flex 
        md:w-[20rem] lg:w-[20.5rem] xl:w-[22rem] h-[11rem] rounded-2xl items-center justify-center'>
            <div className='flex-1'>
                <img src="/assets/sneh.png" alt="sneh" className='rounded-lg mx-3' />
            </div>
            <div className='flex-1 flex justify-center items-center flex-col gap-4'>
                <h2 className='text-lg font-semibold'>Sneh Chaudhary</h2>
                <p className='text-black/75'>Chairman</p>
                <div className='flex gap-2'>
                    <p className='h-8 w-8 rounded-full flex justify-center items-center bg-green-300'>F</p>
                    <p className='h-8 w-8 rounded-full flex justify-center items-center bg-green-300'>L</p>
                    <p className='h-8 w-8 rounded-full flex justify-center items-center bg-green-300'>I</p>
                </div>
            </div>
        </div>
    )
}

export default ProfileCard