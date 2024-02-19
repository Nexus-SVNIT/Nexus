import React from 'react'
import { FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import { Link } from 'react-router-dom'

const ProfileDetail = ({ profile }) => {

  return (
    <div aria-describedby='modal-desc' id='modal-desc' className='flex w-[24rem] flex-col items-center justify-center gap-2 rounded-md bg-white  p-10 text-blue-800 md:h-[26rem] md:w-[26rem] '>
      <img src={`https://lh3.googleusercontent.com/d/${profile.imageLink}`} alt='alumnus' className='h-40 w-40 rounded-full object-scale-down' />
      <p className='text-lg font-bold'>
        {profile['Name']}
      </p>
      <div className='flex w-[80%] justify-between px-2  md:w-[75%]'>
        <p className='font-mono'>
          U21CS134
        </p>
        <p className='pl-4'>
          Passing Year:
          {profile['Passing Year']}
        </p>
      </div>
      <p>
        {profile['Current Role']}
      </p>
      <div className='my-2 flex gap-4 '>
        <Link to={"#"} target='_blank'>
          <FaLinkedinIn className='duration-400 h-10 w-10 rounded-full  border bg-[#0077b5]
                                                                p-2 text-white transition-all hover:border-[#0077b5] hover:bg-transparent hover:text-[#0077b5]' size={24}
          />
        </Link>
        <Link to={"#"} target='_blank'>
          <FaInstagram className='duration-400 h-10 w-10 rounded-full border bg-[#cd486b]
                                                                p-2 text-white transition-all hover:border-[#cd486b] hover:bg-transparent hover:text-[#cd486b]' size={24}
          />
        </Link>
        <Link to={"#"} target='_blank'>
          <FaFacebookF className='duration-400 h-10 w-10 rounded-full border bg-[#316FF6]
                                                                p-2 text-white transition-all hover:border-[#316FF6] hover:bg-transparent hover:text-[#316FF6]' size={24}
          />
        </Link>
        <Link to={"#"} target='_blank'>
          <FaXTwitter className='duration-400 hover:text-[#316FF6]duration-400 h-10 w-10 rounded-full border bg-[#75787B] p-2
                                                                hover:border-[#75787B] hover:bg-transparent  hover:text-[#75787B]' size={24} />
        </Link>
      </div>
    </div>
  )
}

export default ProfileDetail
