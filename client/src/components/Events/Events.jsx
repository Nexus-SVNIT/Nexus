
import React from 'react'
import Title from '../Title/Title'
import './events.css'

const Events = () => {
    return (
        <div className='mx-auto overflow-hidden bg-[#111] pb-32'>
            <Title >
                Events
            </Title>
            <div className="container">
                <div class="timeline">
                    <ul className='transition-all pt-10'>
                        <li >
                            <div className="timeline-content">
                                <div className="date">
                                    <p>20th September, 2023</p>
                                    <span className=' btn upcoming'>Upcoming</span>
                                </div>
                                <h1>CodeSprint</h1>
                                <p >
                                    CodeSprint by Nexus is a fast-paced coding contest for CSE students. It challenges participants with time-bound algorithmic problems, promoting skill enhancement and problem-solving. Emphasizing competitiveness and learning, it encourages practice on platforms like LeetCode. CodeSprint provides a platform for students to showcase coding prowess and improve problem-solving abilities.</p>
                                <img src="/assets/coding.png" alt="GitHub" className='mt-4 rounded-md w-full' />
                            </div>
                        </li>
                        <li>
                            <div className="timeline-content">
                                <div className="date">
                                    <p>20th September, 2023</p>
                                    <span className=' btn active'>On Going</span>
                                </div>
                                <h1>CodeSprint</h1>
                                <p >
                                    CodeSprint by Nexus is a fast-paced coding contest for CSE students. It challenges participants with time-bound algorithmic problems, promoting skill enhancement and problem-solving. Emphasizing competitiveness and learning, it encourages practice on platforms like LeetCode. CodeSprint provides a platform for students to showcase coding prowess and improve problem-solving abilities.</p>
                                <img src="/assets/git.png" alt="GitHub" className='mt-4 w-full rounded-md' />
                            </div>
                        </li>

                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Events