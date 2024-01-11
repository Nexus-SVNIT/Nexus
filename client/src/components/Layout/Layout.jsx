import React from 'react'
import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'

const Layout = ({ children }) => {

    return (
        <div className=' bg-gradient-to-b text-white from-black via-[#13243e] to-black h-full scroll-smooth w-fit md:w-full'>
            <header className='bg-black sticky top-0 left-0 backdrop-filter backdrop-blur-sm bg-opacity-75 z-50'>
                <Navbar />
            </header>
            <main className='relative w-full mx-auto overflow-hidden isolate z-10 mb-10'>

                {children}
            </main>
            <footer>
                <Footer />
            </footer>
        </div>
    )
}

export default Layout
