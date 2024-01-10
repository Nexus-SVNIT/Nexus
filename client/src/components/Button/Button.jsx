import React from 'react'
import { Link } from 'react-router-dom'

const Button = ({ isButton = false, href, children, variant = "primary" }) => {
    const classNames = ['font-semibold border border-blue-700 px-4 py-2 w-full transition-all duration-300', variant === "primary" ?
        ' outline-none bg-blue-700 rounded-md text-white hover:bg-transparent hover:text-blue-700' : ' bg-transparent rounded-md text-blue-700 hover:bg-blue-700 hover:text-white'].join("");
    return (
        isButton ?
            <button className={classNames}>{children}</button>
            :
            <a className='my-4 px-8 py-3 w-fit rounded-md bg-white/20 border border-white/10 transition-colors  active:scale-95 hover:bg-transparent hover:border-white/100 ' href={href}>
                {children}
            </a >

    )
}

export default Button