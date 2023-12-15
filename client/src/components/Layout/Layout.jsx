import React from 'react'
import Navbar from '../Navbar/Navbar'

const Layout = ({ children }) => {

    return (
        <div className=' bg-gradient-to-b text-white from-black via-slate-800 to-dark_primary/80 h-full '>
            <header className='bg-black sticky top-0 left-0 backdrop-filter backdrop-blur-sm bg-opacity-75 z-50 '>
                <Navbar />
            </header>
            <main className='relative w-full mx-auto overflow-hidden'>

                <div className='absolute top-[70vh] left-0 h-60 w-60  bg-green-600/50 filter blur-3xl ' />

                <div className='absolute top-[80vh] left-[80vw] h-60 w-60  bg-green-600/40 filter blur-3xl  ' />

                <div className='absolute bottom-0 right-0 h-60 w-60  bg-green-600 filter blur-3xl -z-0' />

                {children}
            </main>

        </div>
    )
}

export default Layout
