import React from "react";
import { 
  HiOutlineSparkles, 
  HiOutlineCode, 
  HiOutlineAcademicCap, 
  HiOutlineUserGroup, 
  HiOutlineLightBulb 
} from "react-icons/hi";
import { FaLaptopCode, FaShieldAlt } from "react-icons/fa";

const HIGHLIGHTS = [
  { name: "Web Wonders 4.0", type: "Flagship Hackathon", icon: HiOutlineSparkles, color: "text-amber-400" },
  { name: "Code Combat", type: "Competitive Programming", icon: HiOutlineCode, color: "text-blue-400" },
  { name: "E-Rakshak CTF", type: "Cybersecurity Challenge", icon: FaShieldAlt, color: "text-red-400" },
  { name: "Arbitrum Builder Labs", type: "Web3 & Blockchain", icon: FaLaptopCode, color: "text-cyan-400" },
  { name: "Placement Talk Series", type: "MAANG / Tier-1 Insights", icon: HiOutlineAcademicCap, color: "text-emerald-400" },
  { name: "AI/ML Innovate", type: "Research & Projects", icon: HiOutlineLightBulb, color: "text-purple-400" },
  { name: "Open Source Sprint", type: "Community Dev", icon: HiOutlineUserGroup, color: "text-pink-400" },
];

const EventMarquee = () => {
  return (
    <div 
      className="relative w-full overflow-hidden py-4 border-y border-zinc-800/60 bg-zinc-950/40 backdrop-blur-md"
      style={{
        maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        WebkitMaskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
      }}
    >
      {/* Ticker rail */}
      <div className="flex w-max items-center animate-marquee hover:[animation-play-state:paused]">
        {/* Render twice for continuous infinite loop */}
        {[...HIGHLIGHTS, ...HIGHLIGHTS].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={`${item.name}-${idx}`}
              className="flex items-center gap-3 px-6 md:px-8 py-1 group cursor-default select-none transition-transform duration-200 hover:scale-105"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800/50 border border-zinc-700/40 group-hover:border-blue-500/40 transition-colors">
                <Icon className={`text-base ${item.color}`} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold tracking-wide text-zinc-200 group-hover:text-white transition-colors">
                  {item.name}
                </span>
                <span className="text-[11px] font-mono text-zinc-500 group-hover:text-zinc-400 transition-colors">
                  {item.type}
                </span>
              </div>
              <span className="ml-4 text-xs text-zinc-700 select-none">•</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EventMarquee;
