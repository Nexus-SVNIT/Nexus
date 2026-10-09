import React, { useEffect } from "react";
import { FaLinkedinIn, FaInstagram, FaBookOpen, FaUsers, FaLaptopCode, FaNetworkWired, FaStar, FaArrowRight } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import { Link } from "react-router-dom";
import NexusLogo from "../../data/images/nexus.png";
import SVNITLogo from "../../data/images/svnit.svg";
import HeadTags from "../HeadTags/HeadTags";
import increamentCounter from "../../libs/increamentCounter";

/* ─── Mission data ───────────────────────────────────────────────── */
const missions = [
  {
    title: "Fostering Academic Excellence",
    text: "Empower students with the knowledge, skills, and resources to excel in computer science, both academically and professionally.",
    icon: FaBookOpen,
    color: "blue",
    accent: "from-blue-500/10 to-blue-500/0",
    border: "hover:border-blue-500/40",
    iconBg: "bg-blue-500/10 border-blue-500/20",
    iconColor: "text-blue-400",
  },
  {
    title: "Promoting Collaboration",
    text: "Facilitate a collaborative platform where students, regardless of their academic year, can exchange ideas, share knowledge, and work together on innovative projects.",
    icon: FaUsers,
    color: "cyan",
    accent: "from-cyan-500/10 to-cyan-500/0",
    border: "hover:border-cyan-500/40",
    iconBg: "bg-cyan-500/10 border-cyan-500/20",
    iconColor: "text-cyan-400",
  },
  {
    title: "Organizing Impactful Events",
    text: "Conduct coding competitions, workshops, and seminars to provide hands-on experience and exposure to the latest trends and technologies in the field.",
    icon: FaLaptopCode,
    color: "emerald",
    accent: "from-emerald-500/10 to-emerald-500/0",
    border: "hover:border-emerald-500/40",
    iconBg: "bg-emerald-500/10 border-emerald-500/20",
    iconColor: "text-emerald-400",
  },
  {
    title: "Building a Supportive Network",
    text: "Establish a strong support system within the CSE & AI community, creating mentorship programs to bridge the gap between seniors and juniors.",
    icon: FaNetworkWired,
    color: "amber",
    accent: "from-amber-500/10 to-amber-500/0",
    border: "hover:border-amber-500/40",
    iconBg: "bg-amber-500/10 border-amber-500/20",
    iconColor: "text-amber-400",
  },
  {
    title: "Encouraging Holistic Development",
    text: "Emphasize the importance of extracurricular activities and soft skills, ensuring that students graduate not only as proficient coders but also as well-rounded individuals.",
    icon: FaStar,
    color: "rose",
    accent: "from-rose-500/10 to-rose-500/0",
    border: "hover:border-rose-500/40",
    iconBg: "bg-rose-500/10 border-rose-500/20",
    iconColor: "text-rose-400",
  },
];

/* ─── About Component ────────────────────────────────────────────── */
const About = () => {
  useEffect(() => { increamentCounter(); }, []);

  return (
    <div className="relative min-h-[100svh] w-full pb-24 pt-10">
      <HeadTags
        title="About | Nexus - NIT Surat"
        description="Welcome to Nexus, the dynamic hub of computer science enthusiasts at Sardar Vallabhbhai National Institute of Technology (SVNIT) Surat."
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-8">

        {/* ══ Hero Section ══════════════════════════════════════════ */}
        <div className="mb-16 flex flex-col-reverse gap-10 md:flex-row md:items-center md:gap-16">

          {/* Left: Text */}
          <div className="flex-1">
            <p className="text-xs font-mono text-blue-400 uppercase tracking-widest mb-3">
              {"// about nexus"}
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-5">
              About Nexus
            </h1>
            <p className="text-zinc-200 text-base leading-relaxed mb-8 max-w-xl">
              Welcome to Nexus, the dynamic hub of computer science enthusiasts at
              Sardar Vallabhbhai National Institute of Technology (SVNIT) Surat. At
              Nexus, we envision a vibrant community where students passionate about
              computer science come together to thrive and excel. Our mission is to
              create a conducive environment that goes beyond academic boundaries,
              fostering holistic growth and learning.
            </p>

            {/* Vision card */}
            <div className="relative rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl p-6 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
              <div className="flex items-center gap-2 mb-2">
                <HiSparkles className="text-blue-400" size={15} />
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Our Vision</span>
              </div>
              <p className="text-sm text-zinc-100 leading-relaxed">
                To be the catalyst for innovation and excellence in the field of
                computer science at SVNIT, nurturing a community of forward-thinking
                individuals equipped to face the challenges of the digital era.
              </p>
            </div>

            {/* CTA links */}
            <div className="flex flex-wrap gap-3 mt-6">
              <Link to="/interview-experiences"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20">
                Explore Experiences <FaArrowRight size={12} />
              </Link>
              <Link to="/coding-profile"
                className="inline-flex items-center gap-2 rounded-xl border border-white/[0.10] bg-white/[0.05] px-5 py-2.5 text-sm font-semibold text-zinc-300 hover:text-white hover:bg-white/[0.10] transition-all backdrop-blur">
                View Leaderboard
              </Link>
            </div>
          </div>

          {/* Right: Logo card */}
          <div className="relative flex w-full flex-col items-center justify-center md:w-80 flex-shrink-0">
            <div className="relative w-full rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl p-8 flex flex-col items-center gap-6 overflow-hidden">
              {/* Glow */}
              <div className="absolute inset-0 bg-blue-500/5 rounded-2xl" />
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />

              {/* Logos */}
              <div className="relative flex items-center justify-center gap-6">
                <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full" />
                <img src={NexusLogo} alt="Nexus Logo"
                  className="relative z-10 h-24 w-24 object-contain hover:scale-110 transition-transform duration-300 drop-shadow-2xl" />
                <img src={SVNITLogo} alt="SVNIT Logo"
                  className="relative z-10 h-24 w-24 object-contain hover:scale-110 transition-transform duration-300 drop-shadow-2xl" />
              </div>

              <div className="text-center">
                <h3 className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 mb-1">
                  NEXUS NIT Surat
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed max-w-[200px] mx-auto">
                  Departmental Cell of Computer Science And Engineering Department and
                  Artificial Intelligence Department
                </p>
              </div>

              {/* Social links */}
              <div className="flex gap-4">
                <Link to="https://www.linkedin.com/company/nexus-svnit/" target="_blank"
                  className="group flex h-11 w-11 items-center justify-center rounded-full border border-white/[0.10] bg-white/[0.05] text-zinc-400 transition-all duration-300 hover:border-[#0077b5] hover:bg-[#0077b5] hover:text-white hover:shadow-[0_0_20px_rgba(0,119,181,0.35)]">
                  <FaLinkedinIn size={18} className="group-hover:scale-110 transition-transform" />
                </Link>
                <Link to="https://www.instagram.com/nexus_svnit/" target="_blank"
                  className="group flex h-11 w-11 items-center justify-center rounded-full border border-white/[0.10] bg-white/[0.05] text-zinc-400 transition-all duration-300 hover:border-[#cd486b] hover:bg-gradient-to-br hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:text-white hover:shadow-[0_0_20px_rgba(205,72,107,0.35)]">
                  <FaInstagram size={18} className="group-hover:scale-110 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ══ Mission Section ═══════════════════════════════════════ */}
        <div>
          <div className="mb-10 text-center">
            <p className="text-xs font-mono text-blue-400 uppercase tracking-widest mb-2">{"// mission"}</p>
            <h2 className="text-4xl sm:text-5xl font-bold text-white">
              Our Mission
            </h2>
            <p className="text-zinc-400 text-sm mt-2 max-w-lg mx-auto">
              Five pillars that guide everything we do at Nexus.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {missions.map((m, i) => {
              const Icon = m.icon;
              return (
                <div
                  key={i}
                  className={`relative group flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${m.border}`}
                >
                  {/* Top gradient shimmer */}
                  <div className={`absolute top-0 left-0 right-0 h-20 bg-gradient-to-b ${m.accent} pointer-events-none`} />

                  <div className={`relative z-10 mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl border ${m.iconBg}`}>
                    <Icon size={20} className={m.iconColor} />
                  </div>
                  <h3 className="relative z-10 text-lg font-bold text-white mb-2">{m.title}</h3>
                  <p className="relative z-10 text-sm leading-relaxed text-zinc-300 group-hover:text-zinc-200 transition-colors">
                    {m.text}
                  </p>
                </div>
              );
            })}

            {/* Join CTA card — takes last grid spot */}
            <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-white/[0.12] bg-white/[0.02] p-6 text-center">
              <HiSparkles className="text-blue-400 mb-3" size={28} />
              <h3 className="text-lg font-bold text-white mb-2">Be part of it.</h3>
              <p className="text-sm text-zinc-400 mb-5 leading-relaxed">
                Join Nexus and become part of NIT Surat's most vibrant CS community.
              </p>
              <Link to="/interview-experiences/create"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20">
                Share Your Story <FaArrowRight size={11} />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;
