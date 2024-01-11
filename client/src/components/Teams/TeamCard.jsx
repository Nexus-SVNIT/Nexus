import React from 'react'
import ModernProfile from '../ProfileCard/ModernProfile'

const TeamCard = ({ data, isFaculty = false }) => {
    return (
        <div className='my-10 w-full flex flex-col items-center justify-center '>

            <div className='w-full flex flex-wrap items-center justify-center  gap-8 md:gap-10 lg:gap-12 '>
                {data.map(item => <ModernProfile key={item.email} profile={item} isFaculty={isFaculty} />)}
            </div>
        </div>
    )
}

export default TeamCard