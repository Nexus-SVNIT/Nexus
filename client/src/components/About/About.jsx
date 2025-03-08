import React, { useEffect } from "react";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { GoGoal } from "react-icons/go";
import { Link } from "react-router-dom";
import NexusLogo from "../../data/images/nexus.png";
import SVNITLogo from "../../data/images/svnit.svg";
import HeadTags from "../HeadTags/HeadTags";
import increamentCounter from "../../libs/increamentCounter";
const About = () => {
  useEffect(() => {
    increamentCounter();
  }, []);
  return (
    <div className="mx-auto mb-20 mt-10 flex max-w-7xl flex-col gap-2 text-white/75 sm:px-10 md:p-0">
      <HeadTags title={"About - Nexus NIT Surat"} />
      <div className="mb-4 flex flex-col-reverse gap-20 md:flex-row">
        <div className="p-6 md:w-2/3 ">
          <h2 className="mb-4 w-3/4  text-3xl font-semibold md:text-4xl ">
            About Nexus
          </h2>
          Welcome to Nexus, the dynamic hub of computer science enthusiasts at
          Sardar Vallabhbhai National Institute of Technology (SVNIT) Surat. At
          Nexus, we envision a vibrant community where students passionate about
          computer science come together to thrive and excel. Our mission is to
          create a conducive environment that goes beyond academic boundaries,
          fostering holistic growth and learning.
          <div className="mt-10">
            <h2 className="mb-4 text-4xl font-semibold ">Our Vision </h2>
            To be the catalyst for innovation and excellence in the field of
            computer science at SVNIT, nurturing a community of forward-thinking
            individuals equipped to face the challenges of the digital era.
          </div>
        </div>
        <div className=" flex flex-col items-center justify-center  md:w-1/3 ">
          <div className="flex justify-center items-center gap-5">
            <img
              src={NexusLogo}
              alt="Nexus Logo"
              className="h-[8rem] w-[8rem] object-cover md:h-[10rem]  md:w-[10rem] "
            />
            <img
              src={SVNITLogo}
              alt="SVNIT Logo"
              className="h-[8rem] w-[8rem] object-cover md:h-[10rem]  md:w-[10rem] "
            />
          </div>
          <h3 className="my-8 font-mono text-3xl  font-bold text-white md:my-4">
            NEXUS NIT Surat
          </h3>
          <p className="w-[50%] text-center text-sm md:w-[75%] ">
            Departmental Cell of Computer Science And Engineering Department and
            Artificial Intelligence Department{" "}
          </p>

          <div className="my-4 flex gap-4 ">
            <Link to={"#"} target="_blank">
              <FaLinkedinIn
                className="duration-400 h-10 w-10 rounded-full  border bg-[#0077b5]  
                        p-2 text-white transition-all hover:border-[#0077b5] hover:bg-transparent hover:text-[#0077b5]"
                size={24}
              />
            </Link>
            <Link to={"#"} target="_blank">
              <FaInstagram
                className="duration-400 h-10 w-10 rounded-full border bg-[#cd486b]  
                        p-2 text-white transition-all hover:border-[#cd486b] hover:bg-transparent hover:text-[#cd486b]"
                size={24}
              />
            </Link>
            <Link to={"#"} target="_blank">
              <FaFacebookF
                className="duration-400 h-10 w-10 rounded-full border bg-[#316FF6]  
                        p-2 text-white transition-all hover:border-[#316FF6] hover:bg-transparent hover:text-[#316FF6]"
                size={24}
              />
            </Link>
          </div>
        </div>
      </div>

      <div className="mb-10 mt-10 flex flex-col gap-0 p-6 md:gap-4">
        <h2 className="mb-4 text-4xl font-semibold">Our Mission</h2>
        <div className="flex flex-col flex-wrap items-center md:flex-row md:justify-around ">
          <p className="flex items-center gap-4  text-xs md:w-[35vw] md:text-sm">
            <GoGoal className="h-44 w-44" />
            Fostering Academic Excellence: Empower students with the knowledge,
            skills, and resources to excel in computer science, both
            academically and professionally.
          </p>
          <p className="flex items-center gap-4 text-xs md:w-[35vw] md:text-sm">
            <GoGoal className="h-44 w-44" />
            Promoting Collaboration: Facilitate a collaborative platform where
            students, regardless of their academic year, can exchange ideas,
            share knowledge, and work together on innovative projects.
          </p>
          <p className="flex items-center gap-4 text-xs md:w-[35vw] md:text-sm">
            <GoGoal className="h-44 w-44" />
            Organizing Impactful Events: Conduct coding competitions, workshops,
            and seminars to provide hands-on experience and exposure to the
            latest trends and technologies in the field.
          </p>
          <p className="flex items-center gap-4 text-xs md:w-[35vw] md:text-sm">
            <GoGoal className="h-44 w-44" />
            Building a Supportive Network: Establish a strong support system
            within the CSE & AI community, creating mentorship programs to
            bridge the gap between seniors and juniors.
          </p>
          <p className="flex items-center gap-4 text-xs md:w-[35vw] md:text-sm">
            <GoGoal className="h-44 w-44" />
            Encouraging Holistic Development: Emphasize the importance of
            extracurricular activities and soft skills, ensuring that students
            graduate not only as proficient coders but also as well-rounded
            individuals.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
