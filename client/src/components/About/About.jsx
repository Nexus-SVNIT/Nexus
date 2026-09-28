import React, { useEffect } from "react";
import { FaLinkedinIn, FaInstagram, FaBookOpen, FaUsers, FaLaptopCode, FaNetworkWired, FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import NexusLogo from "../../data/images/nexus.png";
import SVNITLogo from "../../data/images/svnit.svg";
import HeadTags from "../HeadTags/HeadTags";
import increamentCounter from "../../libs/increamentCounter";

const missions = [
  {
    title: "Fostering Academic Excellence",
    text: "Empower students with the knowledge, skills, and resources to excel in computer science, both academically and professionally.",
    icon: <FaBookOpen className="h-8 w-8 text-blue-400" />
  },
  {
    title: "Promoting Collaboration",
    text: "Facilitate a collaborative platform where students, regardless of their academic year, can exchange ideas, share knowledge, and work together on innovative projects.",
    icon: <FaUsers className="h-8 w-8 text-cyan-400" />
  },
  {
    title: "Organizing Impactful Events",
    text: "Conduct coding competitions, workshops, and seminars to provide hands-on experience and exposure to the latest trends and technologies in the field.",
    icon: <FaLaptopCode className="h-8 w-8 text-green-400" />
  },
  {
    title: "Building a Supportive Network",
    text: "Establish a strong support system within the CSE & AI community, creating mentorship programs to bridge the gap between seniors and juniors.",
    icon: <FaNetworkWired className="h-8 w-8 text-yellow-400" />
  },
  {
    title: "Encouraging Holistic Development",
    text: "Emphasize the importance of extracurricular activities and soft skills, ensuring that students graduate not only as proficient coders but also as well-rounded individuals.",
    icon: <FaStar className="h-8 w-8 text-orange-400" />
  }
];

const About = () => {
  useEffect(() => {
    increamentCounter();
  }, []);

  return (
    <div className="relative mx-auto min-h-[100svh] w-full overflow-hidden pb-16 pt-12 md:pb-24 md:pt-20">
      <HeadTags 
        title={"About | Nexus - NIT Surat"}
        description={"Welcome to Nexus, the dynamic hub of computer science enthusiasts at Sardar Vallabhbhai National Institute of Technology (SVNIT) Surat."}
      />

      {/* Main Content Container */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col-reverse items-center gap-12 md:flex-row md:items-start md:justify-between mb-24">
          <div className="flex w-full flex-col md:w-3/5">
            <h1 className="mb-6 bg-[linear-gradient(to_right,#3b82f6,#22d3ee,#4ade80)] bg-clip-text text-transparent drop-shadow-sm text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
              About Nexus
            </h1>
            <p className="mb-6 font-sans text-base leading-relaxed text-zinc-300 sm:text-lg sm:leading-loose">
              Welcome to Nexus, the dynamic hub of computer science enthusiasts at
              Sardar Vallabhbhai National Institute of Technology (SVNIT) Surat. At
              Nexus, we envision a vibrant community where students passionate about
              computer science come together to thrive and excel. Our mission is to
              create a conducive environment that goes beyond academic boundaries,
              fostering holistic growth and learning.
            </p>
            
            <div className="mt-8 rounded-2xl border border-zinc-700/50 bg-zinc-900/50 p-8 shadow-2xl shadow-blue-500/5">
              <h2 className="mb-4 text-2xl font-semibold text-white">Our Vision</h2>
              <p className="font-sans text-sm leading-relaxed text-zinc-400 sm:text-base">
                To be the catalyst for innovation and excellence in the field of
                computer science at SVNIT, nurturing a community of forward-thinking
                individuals equipped to face the challenges of the digital era.
              </p>
            </div>
          </div>

          {/* Logo & Info Section */}
          <div className="flex w-full flex-col items-center justify-center rounded-2xl border border-zinc-700/50 bg-zinc-900/30 p-10 md:w-[35%] shadow-2xl backdrop-blur-sm">
            <div className="flex items-center justify-center gap-6 mb-8 relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full"></div>
              <img
                src={NexusLogo}
                alt="Nexus Logo"
                className="relative z-10 h-28 w-28 object-contain transition-transform hover:scale-110 duration-300"
              />
              <img
                src={SVNITLogo}
                alt="SVNIT Logo"
                className="relative z-10 h-28 w-28 object-contain transition-transform hover:scale-110 duration-300"
              />
            </div>
            
            <h3 className="mb-3 font-mono text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 text-center">
              NEXUS NIT Surat
            </h3>
            
            <p className="mb-8 text-center text-xs sm:text-sm text-zinc-400 max-w-[85%] leading-relaxed">
              Departmental Cell of Computer Science And Engineering Department and
              Artificial Intelligence Department
            </p>

            <div className="flex gap-5">
              <Link to={"https://www.linkedin.com/company/nexus-svnit/"} target="_blank">
                <div className="group flex h-12 w-12 items-center justify-center rounded-full border border-zinc-700/80 bg-zinc-800 text-zinc-300 transition-all duration-300 hover:border-[#0077b5] hover:bg-[#0077b5] hover:text-white hover:shadow-[0_0_15px_rgba(0,119,181,0.5)]">
                  <FaLinkedinIn size={22} className="transition-transform duration-300 group-hover:scale-110" />
                </div>
              </Link>
              <Link to={"https://www.instagram.com/nexus_svnit/"} target="_blank">
                <div className="group flex h-12 w-12 items-center justify-center rounded-full border border-zinc-700/80 bg-zinc-800 text-zinc-300 transition-all duration-300 hover:border-[#cd486b] hover:bg-gradient-to-br hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:text-white hover:shadow-[0_0_15px_rgba(205,72,107,0.5)]">
                  <FaInstagram size={22} className="transition-transform duration-300 group-hover:scale-110" />
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Section Divider */}
        <div className="mx-auto my-16 h-px w-3/4 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />

        {/* Mission Section */}
        <div className="flex flex-col items-center">
          <h2 className="mb-12 text-3xl font-bold sm:text-4xl">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Mission</span>
          </h2>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {missions.map((mission, index) => (
              <div 
                key={index} 
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-700/50 bg-zinc-900/40 p-8 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/50 hover:bg-zinc-800/80 hover:shadow-2xl hover:shadow-blue-500/10"
              >
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-xl bg-zinc-800/80 shadow-inner transition-colors duration-300 group-hover:bg-zinc-900/50">
                  {mission.icon}
                </div>
                <h3 className="mb-3 text-xl font-semibold text-zinc-100">{mission.title}</h3>
                <p className="text-sm leading-relaxed text-zinc-400 transition-colors duration-300 group-hover:text-zinc-300">
                  {mission.text}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;
