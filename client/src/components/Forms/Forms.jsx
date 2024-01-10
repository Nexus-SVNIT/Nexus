import React from 'react'
import Title from '../Title/Title'
import FormCard from './FormCard'

const Forms = () => {
    return (
        <div className='relative mx-auto mb-20 max-w-7xl space-y-8 pb-12'>
            <Title>
                Forms
            </Title>
            <div className='flex items-center justify-center flex-wrap gap-x-12 gap-y-12'>
                <FormCard />
                <FormCard />
                <FormCard />
                <FormCard />
            </div>
        </div>

    )
}

export default Forms