import React from 'react'
import Dropdown from './Dropdown'
import { FAQsList } from '../../data/index'
const FAQs = () => {
    return (
        <div className='z-20 flex flex-col items-center justify-center gap-6 max-w-7xl mx-auto h-fit max-h-full transition-all '>
            <h2 className='text-4xl font-semibold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent'>FAQ's</h2>
            <p className="text-gray-500 text-sm md:text-base mb-4">Common questions about Nexus</p>

            {
                FAQsList.map(faq => (<Dropdown key={faq.id} question={faq.question} answer={faq.answer} />))
            }
        </div>

    )
}

export default FAQs