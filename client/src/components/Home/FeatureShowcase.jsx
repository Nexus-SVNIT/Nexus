import React from "react";
import { Link } from "react-router-dom";
import { 
  HiOutlineDocumentText, 
  HiOutlineAcademicCap, 
  HiOutlineCube, 
  HiOutlineTerminal, 
  HiOutlineUserGroup,
  HiOutlineArrowNarrowRight,
  HiOutlineSparkles
} from "react-icons/hi";

const FEATURES = [
  {
    title: "Interview Experiences",
    tag: "Placements & Internships",
    description: "Read real transcripts, round-by-round breakdown, and tips from seniors placed at Google, Microsoft, Amazon, Oracle, and more.",
    link: "/interview-experiences",
    badge: "120+ Posts",
    icon: HiOutlineDocumentText,
    accent: "from-blue-500/20 via-cyan-500/10 to-transparent",
    borderHover: "hover:border-cyan-500/50",
    iconBg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
    colSpan: "lg:col-span-7",
  },
  {
    title: "Competitive Arena",
    tag: "CP & Contests",
    description: "Real-time upcoming contests on Codeforces, LeetCode, CodeChef, and departmental leaderboards.",
    link: "/coding",
    badge: "Live Ticker",
    icon: HiOutlineTerminal,
    accent: "from-purple-500/20 via-pink-500/10 to-transparent",
    borderHover: "hover:border-purple-500/50",
    iconBg: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    colSpan: "lg:col-span-5",
  },
  {
    title: "Open Projects",
    tag: "Builders & Innovation",
    description: "Showcase of web applications, AI models, and systems built by CSE & AI students of SVNIT.",
    link: "/projects",
    badge: "Showcase",
    icon: HiOutlineCube,
    accent: "from-amber-500/20 via-orange-500/10 to-transparent",
    borderHover: "hover:border-amber-500/50",
    iconBg: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    colSpan: "lg:col-span-4",
  },
  {
    title: "Study Material & Guides",
    tag: "Academics",
    description: "Curated syllabus notes, previous year question archives, roadmaps, and lab assignments for all semesters.",
    link: "/study-material",
    badge: "Curated",
    icon: HiOutlineAcademicCap,
    accent: "from-emerald-500/20 via-teal-500/10 to-transparent",
    borderHover: "hover:border-emerald-500/50",
    iconBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    colSpan: "lg:col-span-4",
  },
  {
    title: "Alumni & Mentorship",
    tag: "Network",
    description: "Connect with SVNIT alumni across industry and academia worldwide for career guidance and referrals.",
    link: "/alumni-network",
    badge: "Global",
    icon: HiOutlineUserGroup,
    accent: "from-blue-600/20 via-indigo-500/10 to-transparent",
    borderHover: "hover:border-blue-500/50",
    iconBg: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    colSpan: "lg:col-span-4",
  },
];

const FeatureShowcase = () => {
  return (
    <section className="relative w-full max-w-6xl px-4 mx-auto my-16 md:my-24">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-xs font-medium text-blue-400 mb-3 backdrop-blur-md">
          <HiOutlineSparkles className="text-sm" />
          <span>The Nexus Ecosystem</span>
        </div>
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white">
          Everything You Need, Built for{" "}
          <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
            SVNITians
          </span>
        </h2>
        <p className="mt-3 max-w-xl text-sm sm:text-base text-zinc-400">
          From cracking tier-1 interviews to collaborative project building and algorithmic contests — explore the pillars driving our department.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
        {FEATURES.map((item, idx) => {
          const Icon = item.icon;
          return (
            <Link
              key={idx}
              to={item.link}
              className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-6 sm:p-7 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-950/20 ${item.colSpan} ${item.borderHover}`}
            >
              {/* Radial gradient backdrop on hover */}
              <div 
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${item.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} 
              />

              {/* Card Top */}
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl border ${item.iconBg} transition-transform duration-300 group-hover:scale-110`}>
                    <Icon className="text-xl" />
                  </div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border border-zinc-800 bg-zinc-900/80 text-zinc-400 group-hover:text-zinc-200 transition-colors">
                    {item.badge}
                  </span>
                </div>

                <span className="text-xs font-mono font-medium text-cyan-400/90 tracking-wide uppercase">
                  {item.tag}
                </span>
                <h3 className="mt-1 text-xl sm:text-2xl font-bold text-zinc-100 group-hover:text-white transition-colors">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors">
                  {item.description}
                </p>
              </div>

              {/* Card Footer Link */}
              <div className="relative z-10 mt-6 pt-4 border-t border-zinc-800/60 flex items-center justify-between text-xs font-medium text-zinc-400 group-hover:text-cyan-300 transition-colors">
                <span>Explore Section</span>
                <HiOutlineArrowNarrowRight className="text-base transition-transform duration-300 group-hover:translate-x-1.5" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default FeatureShowcase;
