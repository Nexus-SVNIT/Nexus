import React from 'react'

const Title = ({ children }) => {
    return (
        <h1 className='text-center uppercase flex items-center justify-center text-[2.25rem] md:text-[3rem] lg:text-[3.5rem] pt-10 font-bold bg-gradient-to-r from-blue-300 to-cyan-200 bg-clip-text text-transparent'>{children}</h1>

    )
}

export default Title