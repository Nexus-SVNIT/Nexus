import React from 'react'

const About = () => {
    return (
        <div className='mt-10 mb-20 flex flex-col gap-2 max-w-7xl mx-auto sm:px-10 md:p-0'>
            <div className='flex flex-col md:flex-row gap-20'>

                <div className='flex-1 p-6'>
                    <h2 className='text-4xl font-semibold mb-4 '>About Nexus</h2>
                    Welcome to Nexus, the dynamic hub of computer science enthusiasts at Sardar Vallabhbhai National Institute of Technology (SVNIT) Surat. At Nexus, we envision a vibrant community where students passionate about computer science come together to thrive and excel. Our mission is to create a conducive environment that goes beyond academic boundaries, fostering holistic growth and learning.

                    <div className='mt-10'>
                        <h2 className='text-4xl font-semibold mb-4 '>Our Vision</h2>
                        To be the catalyst for innovation and excellence in the field of computer science at SVNIT, nurturing a community of forward-thinking individuals equipped to face the challenges of the digital era.
                    </div>
                </div>
                <img src="/assets/comp_dept.jpg" alt="" className='h-[25rem] w-[40rem] object-fill' />
            </div>

            <div className='mt-10 flex flex-col gap-4 mb-10 p-6'>
                <h2 className='text-4xl font-semibold mb-4'>Our Mission</h2>

                <p>Fostering Academic Excellence: Empower students with the knowledge, skills, and resources to excel in computer science, both academically and professionally.
                </p>
                <p>Promoting Collaboration: Facilitate a collaborative platform where students, regardless of their academic year, can exchange ideas, share knowledge, and work together on innovative projects.
                </p>
                <p>Organizing Impactful Events: Conduct coding competitions, workshops, and seminars to provide hands-on experience and exposure to the latest trends and technologies in the field.
                </p>
                <p>Building a Supportive Network: Establish a strong support system within the CSE community, creating mentorship programs to bridge the gap between seniors and juniors.
                </p>
                <p>Encouraging Holistic Development: Emphasize the importance of extracurricular activities and soft skills, ensuring that students graduate not only as proficient coders but also as well-rounded individuals.</p>
            </div>
        </div>
    )
}

export default About