import React from 'react'
import "./footer.css"

const Footer = () => {
    return (
        <div className='flex'>
            <div className='section flex-1'>
                <div className='w-full h-full bg-gradient-to-b from-dark_primary to-transparent '></div>
            </div>
            <div className='flex-1 p-10 text-orange text-lg flex flex-col justify-between'>
                <ul className='flex gap-10 '>
                    <li>Teams</li>
                    <li>Forms</li>

                </ul>
                <ul className='flex gap-10 '>
                    <li>About</li>
                    <li>Contacts</li>

                </ul>

                <p>Managed By: XYZ Surname</p>
            </div>
        </div >
    )
}

export default Footer