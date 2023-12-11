import React from 'react'

const Button = ({ children }) => {
    return (
        <button className='my-4 px-8 py-3 w-fit rounded-md bg-white/20 border border-white/10 transition-colors  active:scale-95 hover:bg-transparent hover:border-white/100  '>
            {children}
        </button>
    )
}

export default Button