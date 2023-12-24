import React from 'react'
import ModernProfile from '../ProfileCard/ModernProfile'

const TeamCard = ({ data }) => {
    return (
        <div className='my-10 mb-20 w-full flex flex-col items-center justify-center mx-auto'>
            <h2 className='mb-4 font-semibold text-orange text-xl'>{"< Our_Core_Team />"}</h2>
            <div className='grid mx-auto gap-8 sm:gap-20 lg:gap-22 md:grid-cols-2    xl:grid-cols-4 xl:gap-8 place-content-center'>
                {data.map(item => <ModernProfile profile={item} />)}
            </div>
        </div>
    )
}

export default TeamCard