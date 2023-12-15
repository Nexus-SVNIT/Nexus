
import React from 'react'
import Title from '../Title/Title'
import EventCard from './EventCard'

const Events = () => {
    return (
        <div className='mx-auto  max-w-7xl  overflow-hidden'>
            <Title >
                Events
            </Title>
            <div className='mt-10'>
                <EventCard />
                <EventCard />
            </div>
        </div>
    )
}

export default Events