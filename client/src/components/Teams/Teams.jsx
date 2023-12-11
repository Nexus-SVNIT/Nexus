import React from 'react'
import { Title } from "../index"
import ProfileCard from '../ProfileCard/ProfileCard'

const Teams = () => {
    const data = [{}, {}, {}, {}]
    const data1 = [{}, {}, {}, {}, {}, {}]
    return (
        <div className='mx-auto h-full max-w-7xl space-y-8'>
            <Title>Our Team</Title>

            <div className='w-3/4 flex items-center justify-center flex-wrap gap-x-10 xl:gap-x-40  gap-y-10 xl:gap-y-20 mx-auto pt-10'>
                {
                    data.map(item => <ProfileCard />)
                }
            </div>


            <div className=' flex items-center justify-center flex-wrap gap-x-4 xl:gap-x-20 gap-y-6 xl:gap-y-20 mx-auto pt-10'>
                {
                    data1.map(item => <ProfileCard />)
                }
            </div>


            <div className='w-3/4 flex items-center justify-center flex-wrap gap-x-10 xl:gap-x-40  gap-y-6 xl:gap-y-20 mx-auto pt-10'>
                {
                    data.map(item => <ProfileCard />)
                }
            </div>

            <div className=' flex items-center justify-center flex-wrap gap-x-4 xl:gap-x-20 gap-y-10 xl:gap-y-20 mx-auto pt-10'>
                {
                    data1.map(item => <ProfileCard />)
                }
            </div>
        </div>
    )
}

export default Teams