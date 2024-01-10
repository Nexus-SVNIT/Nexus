import React, { useEffect } from 'react'
import Title from '../Title/Title'
import './events.css'
import useFetch from '../../hooks/useFetch'

const Events = () => {

    const { data, loading, error } = useFetch('/events', [])

    if (loading) return <p className='w-full h-screen flex justify-center items-center'>Loading Events...</p>
    return (
        <div className='mx-auto overflow-hidden bg-[#111] pb-20 md:pb-48'>
            <Title>
                Events
            </Title>
            <div className='container'>
                <div class='timeline'>
                    <ul className='transition-all py-10 '>
                        {
                            data.map(item => (
                                <li key={item._id}>
                                    <div className='timeline-content  '>
                                        <div className='date'>
                                            <p>
                                                {item.date}
                                            </p>
                                            <span className={`btn text-xs ${item.status === "Upcoming" ? "upcoming" : "active"}`}>{item.status}</span>
                                        </div>
                                        <h1>{item.name}</h1>
                                        <p>
                                            {/* CodeSprint by Nexus is a fast-paced coding contest for CSE students. It challenges participants with time-bound algorithmic problems, promoting skill enhancement
                                            and problem-solving. Emphasizing competitiveness and learning, it encourages practice on platforms like LeetCode. CodeSprint provides a platform for
                                            students to showcase coding prowess and improve problem-solving abilities. */}
                                            {
                                                item.description
                                            }
                                        </p>
                                        <img src={item?.imageLink ?? "https://images.pexels.com/photos/1097930/pexels-photo-1097930.jpeg?auto=compress&cs=tinysrgb&w=800"} alt='Banner' className='mt-4 rounded-md w-full min-h-[12rem]' />
                                    </div>
                                </li>
                            ))
                        }
                        {/* <li>
                            <div className='timeline-content'>
                                <div className='date'>
                                    <p>
                                        20th September, 2023
                                    </p>
                                    <span className=' btn bg-yellow-600 text-xs'>On Going</span>
                                </div>
                                <h1>CodeSprint</h1>
                                <p>
                                    CodeSprint by Nexus is a fast-paced coding contest for CSE students. It challenges participants with time-bound algorithmic problems, promoting skill enhancement
                                    and problem-solving. Emphasizing competitiveness and learning, it encourages practice on platforms like LeetCode. CodeSprint provides a platform for
                                    students to showcase coding prowess and improve problem-solving abilities.
                                </p>
                                <img src='/assets/git.png' alt='GitHub' className='mt-4 w-full rounded-md' />
                            </div>
                        </li> */}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Events
