import React, { useState } from 'react'
import { NavList } from '../../data'
import { Link, useLocation } from 'react-router-dom'
import { CgClose, CgMenuLeftAlt } from "react-icons/cg";
import Logo from '../../data/images/nexus.png'
const Navbar = () => {
    const { pathname } = useLocation()
    const [mobileMenu, setMobileMenu] = useState(false)
    return <nav className='flex justify-between text-base max-w-7xl w-[100vw] md:w-full mx-auto h-[5rem] z-[999]'>
        <div className='flex items-center ml-4'>
            <Link to={'/'}>
                <img src={Logo} alt='Nexus_Official' className='w-8 h-8' />
            </Link>
            <span className='uppercase text-white/80 text-2xl mx-2'>Nexus</span>
        </div>
        <div className='flex items-center relative'>
            <ul className='hidden text-sm lg:text-base md:flex items-center gap-[3vw] lg:gap-12 mr-5'>
                {NavList.map(item => {
                    return (
                        <Link to={item.path} key={item.path} >
                            <li key={item.path} className={`${item.path === pathname ? "text-[#3586ff] underline underline-offset-8" : "text-white"} transition-colors`}>
                                {item.label}
                            </li>
                        </Link>
                    )
                })}
            </ul>

            {mobileMenu && <ul className={`absolute py-14 top-0 right-1 bg-black  bg-opacity-80 w-[16rem] flex flex-col items-center h-[200vh] gap-6 text-xl pt-20`}>
                {NavList.map(item => {
                    return (
                        <Link key={item.path} to={item.path} onClick={e => setMobileMenu(false)}>
                            <li key={item.path} className={`${item.path === pathname ? "text-[#3586ff] underline underline-offset-8" : "text-white"} transition-colors hover:text-[#3586ff]`}>
                                {item.label}
                            </li>
                        </Link>
                    )
                })}
            </ul>}
            <div className='transition-all duration-300 text-3xl mr-4 p-1 cursor-pointer  md:hidden hover:bg-white/20 rounded-full z-[99] active:scale-50' onClick={e => setMobileMenu(!mobileMenu)} >{mobileMenu ? <CgClose size={34} /> : <CgMenuLeftAlt size={34} />}</div>
        </div>

    </nav>
}

export default Navbar
