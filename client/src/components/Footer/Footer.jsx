import { Link } from 'react-router-dom'
import './footer.css'
import Logo from '../../data/images/nexus.png'
const Footer = () => {
    return (
        <div className='container-footer  bg-gradient-to-b from-[#153666] via-[#060e1c] to-[#1a2f4d] py-10 px-4  md:px-32 flex flex-col justify-between flex-wrap gap-y-10 relative '>
            <div className='z-10'>
                <div className='wave absolute -top-16 left-0 h-[4rem] w-full z-50 ' id='wave1' />
                <div className='wave absolute -top-16 left-0 h-[4rem] w-full z-50 ' id='wave2' />
                <div className='wave absolute -top-16 left-0 h-[4rem] w-full z-50 ' id='wave3' />
                <div className='wave absolute -top-16 left-0 h-[4rem] w-full z-50 ' id='wave4' />
            </div>
            <div className='flex flex-col md:flex-row  gap-4 md:gap-0 w-full mx-auto '>
                <div className="w-[100%] md:w-[32rem] lg:w-[40rem]">
                    <h2 className="flex items-center text-sm">
                        <img src={Logo} alt="Nexus" className='h-12 w-12 mx-8 my-4 ' />
                        NEXUS <br />Departmental Cell of Computer Science & Engineering </h2>

                    <p className="text-xs pl-6 font-mono">Empowering CSE students at SVNIT, Nexus is a community that cultivates coding excellence, fosters diverse extracurricular interests, and champions holistic growth, shaping educational journeys with passion and purpose.</p>
                </div>
                <div className='flex justify-between md:justify-center md:gap-[25%] w-full'>
                    <div className="flex flex-col mt-4 gap-4 px-8 md:px-0">
                        <h4 className="text-xl">Quick Links</h4>
                        <ul className="flex flex-col gap-2">
                            <Link to={'/events'}>Events</Link>
                            <Link to={'/forms'}>Forms</Link>
                            <Link to={'/connect'}>Nexus Connect</Link>
                            <Link to={'/aboutUs'}>About Us</Link>

                        </ul>
                    </div>
                    <div className="flex flex-col mt-4 gap-4 px-8 md:px-0" >
                        <h4 className="text-xl">Social Media</h4>
                        <ul className="flex flex-col gap-2">
                            <Link to={'/nexus'}>Instagram</Link>
                            <Link>LinkedIn</Link>
                            <Link>nexus@gmail.com</Link>
                        </ul>
                    </div>
                </div>
            </div>
            <div className='text-center border-t-2 border-blue-800 pt-4 font-mono'>Made with <span className='animate-pulse'>❤️</span> by NEXUS NIT Surat • © 2024</div>

            {
                // Just for commit
            }
        </div >
    )
}

export default Footer