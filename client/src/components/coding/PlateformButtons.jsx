import React from "react";
import { SiCodeforces, SiLeetcode, SiCodechef, SiGithub } from "react-icons/si";

function PlateformButtons({ handlePlatformChange, activePlatform }) {
  const platforms = [
    {
      id: "codeforces",
      label: "Codeforces",
      icon: <SiCodeforces size={16} />,
      activeClasses:
        "text-white bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.4)] border-blue-500/50",
    },
    {
      id: "leetcode",
      label: "LeetCode",
      icon: <SiLeetcode size={16} />,
      activeClasses:
        "text-white bg-gradient-to-r from-amber-500 to-orange-500 shadow-[0_0_20px_rgba(245,158,11,0.4)] border-amber-400/50",
    },
    {
      id: "codechef",
      label: "CodeChef",
      icon: <SiCodechef size={16} />,
      activeClasses:
        "text-white bg-gradient-to-r from-emerald-600 to-teal-600 shadow-[0_0_20px_rgba(16,185,129,0.4)] border-emerald-400/50",
    },
    {
      id: "github",
      label: "GitHub",
      icon: <SiGithub size={16} />,
      activeClasses:
        "text-white bg-gradient-to-r from-purple-600 to-indigo-600 shadow-[0_0_20px_rgba(147,51,234,0.4)] border-purple-400/50",
    },
  ];

  return (
    <div className="w-full flex items-center justify-start overflow-x-auto pb-1 no-scrollbar">
      <div className="inline-flex items-center gap-1.5 rounded-2xl border border-zinc-800/80 bg-zinc-950/70 p-1.5 shadow-xl backdrop-blur-xl">
        {platforms.map((platform) => {
          const isActive = activePlatform === platform.id;
          return (
            <button
              key={platform.id}
              onClick={() => handlePlatformChange(platform.id)}
              className={`
                relative flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-semibold rounded-xl
                transition-all duration-300 ease-in-out border
                ${
                  isActive
                    ? platform.activeClasses
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/60 border-transparent"
                }
              `}
            >
              <span className="relative z-10">{platform.icon}</span>
              <span className="relative z-10">{platform.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default PlateformButtons;
