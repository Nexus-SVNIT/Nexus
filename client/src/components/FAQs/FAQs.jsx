import React from 'react'
import Dropdown from './Dropdown'
import { FAQsList } from '../../data/index'
const FAQs = () => {
    return (
        <div className='flex flex-col items-center justify-center gap-4 max-w-7xl mx-auto h-fit max-h-full transition-all'>
            <h2 className='text-4xl mb-4 font-semibold'>FAQ's</h2>

            {
                FAQsList.map(faq => (<Dropdown key={faq.id} question={faq.question} answer={faq.answer} />))
            }
        </div>

    )
}

export default FAQs