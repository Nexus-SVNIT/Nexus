import React from 'react'
import { VscBracketError } from 'react-icons/vsc'

const Error = () => {
  return (
    <div className='h-screen w-full flex items-center justify-center'>
      <div className='w-1/3 h-1/2 bg-white/90 rounded-lg flex flex-col items-center justify-center'>
        <h1 className='text-red-900 text-5xl'>Oops...</h1>
        <VscBracketError className='text-red-900 h-[10rem] w-[10rem]' />

        <p className='text-red-900 text-lg'>Something Went Wrong. Please Try Again Later</p></div></div>
  )
}

export default Error