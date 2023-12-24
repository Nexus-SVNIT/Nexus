import React from 'react'

const ProfileCard = ({ profile }) => {
    return (
        <div className='bg-white text-black flex 
        md:w-[16rem] lg:w-[18rem] xl:w-[20rem] h-[25rem] rounded-2xl items-center justify-center'>
            <div className='flex-1'>
                <img src="/assets/person.jpg" alt="sneh" className='rounded-lg mx-3' />
            </div>
            <div className='flex-1 flex justify-center items-center flex-col gap-4'>
                <h2 className='text-lg font-semibold'>{profile.name}</h2>
                <p className='text-black/75'>{profile.role}</p>
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