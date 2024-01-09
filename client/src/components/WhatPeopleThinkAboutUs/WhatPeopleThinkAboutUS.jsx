import React from 'react'
import Title from '../Title/Title'
import Testimonial from './Testimonial'

const WhatPeopleThinkAboutUS = () => {
  return (
    <div className='mx-auto h-full max-w-7xl my-10 mb-20 flex flex-col items-center justify-center '>
      <Title>
        What People Think About Us
      </Title>
      <div className='w-full flex flex-wrap justify-evenly mt-10 gap-10'>
        <Testimonial text={"Nexus has successfully cultivated a spirit of collaboration and excellence within our CSE community. The events are not just about coding; they're about building lasting connections and preparing us for the dynamic world of technology"} author={"Kunal Mehta, Senior Member "} />
        <Testimonial text={"Nexus has been a game-changer for me at SVNIT. The coding competitions not only sharpened my technical skills but also connected me with a supportive community. It's more than a club; it's a family."} author={" Rahul Sharma, 2nd Year CSE "} />
      </div>
    </div>
  )
}

export default WhatPeopleThinkAboutUS