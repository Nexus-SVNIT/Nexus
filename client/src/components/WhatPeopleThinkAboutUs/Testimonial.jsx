import React from 'react'

const Testimonial = ({ text, author }) => {
  return (
    <div className='bg-testimonials object-contain h-[15rem] md:h-[20rem] w-[28rem] md:w-[30rem] flex flex-col items-center justify-center px-10 leading-8 rounded-xl backdrop-blur-md mx-4 md:mx-10 '>
      <p className=' text-sm md:text-base font-thin text-center line-clamp-5'>{text}</p>
      <h2 className='mt-2 text-sm md:text-base border-t-4 border-[#3586ff] rounded-sm'>{author}</h2>
    </div>
  )
}

export default Testimonial