import React, { useState } from "react";
import { FaChevronDown, FaChevronUp, FaInfoCircle } from "react-icons/fa";

const RatingLegend = ({ platform }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getLegendItems = () => {
    switch (platform) {
      case "codeforces":
        return [
          { color: "border-yellow-400 bg-yellow-500/20 text-yellow-300", label: "Master (≥2100)" },
          { color: "border-violet-400 bg-violet-500/20 text-violet-300", label: "Candidate Master (≥1900)" },
          { color: "border-blue-400 bg-blue-500/20 text-blue-300", label: "Expert (≥1600)" },
          { color: "border-cyan-400 bg-cyan-500/20 text-cyan-300", label: "Specialist (≥1400)" },
          { color: "border-emerald-400 bg-emerald-500/20 text-emerald-300", label: "Pupil (≥1200)" },
          { color: "border-zinc-500 bg-zinc-500/20 text-zinc-400", label: "Newbie (<1200)" },
        ];
      case "leetcode":
        return [
          { color: "border-rose-400 bg-rose-500/20 text-rose-300", label: "Guardian (≥2100)" },
          { color: "border-amber-400 bg-amber-500/20 text-amber-300", label: "Knight (≥1900)" },
          { color: "border-yellow-400 bg-yellow-500/20 text-yellow-300", label: "Advanced (≥1700)" },
          { color: "border-violet-400 bg-violet-500/20 text-violet-300", label: "Intermediate (≥1500)" },
          { color: "border-emerald-400 bg-emerald-500/20 text-emerald-300", label: "Beginner (<1500)" },
          { color: "border-zinc-500 bg-zinc-500/20 text-zinc-400", label: "Unrated (0)" },
        ];
      case "codechef":
        return [
          { color: "border-rose-400 bg-rose-500/20 text-rose-300", label: "7★ (≥2500)" },
          { color: "border-amber-400 bg-amber-500/20 text-amber-300", label: "6★ (≥2200)" },
          { color: "border-yellow-400 bg-yellow-500/20 text-yellow-300", label: "5★ (≥2000)" },
          { color: "border-violet-400 bg-violet-500/20 text-violet-300", label: "4★ (≥1800)" },
          { color: "border-cyan-400 bg-cyan-500/20 text-cyan-300", label: "3★ (≥1600)" },
          { color: "border-emerald-400 bg-emerald-500/20 text-emerald-300", label: "2★ (≥1400)" },
          { color: "border-zinc-500 bg-zinc-500/20 text-zinc-400", label: "1★ (<1400)" },
        ];
      case "github":
        return [
          { color: "border-emerald-400 bg-emerald-500/20 text-emerald-300", label: "Legendary (≥1000)" },
          { color: "border-green-400 bg-green-500/20 text-green-300", label: "Master (≥500)" },
          { color: "border-teal-400 bg-teal-500/20 text-teal-300", label: "Pro (≥250)" },
          { color: "border-cyan-400 bg-cyan-500/20 text-cyan-300", label: "Explorer (≥100)" },
          { color: "border-zinc-500 bg-zinc-500/20 text-zinc-400", label: "Contributor (<100)" },
        ];
      default:
        return [];
    }
  };

  const items = getLegendItems();
  if (items.length === 0) return null;

  return (
    <div className="w-full rounded-xl border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-md transition-all duration-300 overflow-hidden mb-3">
      {/* Toggle header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
      >
        <div className="flex items-center gap-2 font-mono">
          <FaInfoCircle className="text-blue-400 text-xs" />
          <span>
            {platform === "github" ? "GitHub Contribution Tiers" : `${platform.toUpperCase()} Rating Legend`}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
          <span>{isOpen ? "Hide" : "Show tiers"}</span>
          {isOpen ? <FaChevronUp size={10} /> : <FaChevronDown size={10} />}
        </div>
      </button>

      {/* Expanded grid */}
      {isOpen && (
        <div className="px-4 pb-3.5 pt-1 border-t border-zinc-800/60">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {items.map(({ color, label }) => (
              <div
                key={label}
                className={`flex items-center justify-center rounded-lg border px-2 py-1 text-center text-[11px] font-medium ${color}`}
              >
                {label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RatingLegend;
