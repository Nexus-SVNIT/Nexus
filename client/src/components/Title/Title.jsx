import React from 'react'

const Title = ({ children }) => {
    return (
        <h1 className='text-center uppercase flex items-center justify-center text-[1.75rem] md:text-[2.25rem] pt-10 font-semibold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent'>{children}</h1>

    )
}

export default Title