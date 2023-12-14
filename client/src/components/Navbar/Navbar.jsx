import React from 'react'
import { NavList } from '../../data'
import { Link, useLocation } from 'react-router-dom'
import { CgMenuLeftAlt } from "react-icons/cg";
const Navbar = () => {
    const { pathname } = useLocation()
    return <nav className='flex justify-between text-base max-w-7xl w-full mx-auto h-[4rem]'>
        <div className='flex items-center'>
            <Link to={'/'}>
                <img src='./assets/nexus_logo.png' alt='Nexus_Official' className='w-20 h-20' />
            </Link>
            <span className='uppercase text-white'>Nexus</span>
        </div>
        <div className='flex items-center'>
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
            <div className='text-3xl mr-4 p-1 cursor-pointer  md:hidden hover:bg-white/20 rounded-full' ><CgMenuLeftAlt /></div>
        </div>

    </nav>
}

export default Navbar
