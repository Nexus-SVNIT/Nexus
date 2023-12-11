import React from 'react'
import { NavList } from '../../data'
import { Link, useLocation } from 'react-router-dom'

const Navbar = () => {
    const { pathname } = useLocation()
    return <nav className='flex justify-between text-base max-w-7xl w-full mx-auto h-[5rem]'>
        <div className='flex items-center'>
            <Link to={'/'}>
                <img src='./assets/nexus_logo.png' alt='Nexus_Official' className='w-20 h-20' />
            </Link>
            <span className='uppercase text-white'>Nexus</span>
        </div>
        <ul className='hidden md:flex items-center gap-12 mr-5'>
            {NavList.map(item => {
                return (
                    <Link to={item.path} >
                        <li key={item.path} className={`${item.path === pathname ? "text-orange underline underline-offset-8" : "text-white"} transition-colors`}>
                            {item.label}
                        </li>
                    </Link>
                )
            })}
        </ul>
    </nav>
}

export default Navbar
