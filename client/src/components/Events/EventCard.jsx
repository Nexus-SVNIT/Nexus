/* eslint-disable jsx-a11y/img-redundant-alt */
import { FaCode } from "react-icons/fa";
import React from 'react'

const EventCard = () => {
    return (
        <div className="flex flex-col px-[15vw]">

            {/* <div className="w-2 rounded-full h-80 bg-gradient-to-b from-blue-600 to-green-600"></div> */}
            <div className="text-5xl flex gap-4 items-center relative">
                <FaCode className="absolute -left-5 p-1 rounded-full   filter shadow-xl shadow-teal-900" />
                <h2 className="ml-12">Web Wonders</h2>
            </div>
            <div className="border-l-4 border-green-300 px-4 py-2 flex flex-col gap-2 ">

                <div>A 3 week web development competition for the 1st year students</div>
                <div>

                    <img src="/assets/git_imgg.png" alt="Image" />
                </div>
            </div>
        </div >
    )
}

export default EventCard