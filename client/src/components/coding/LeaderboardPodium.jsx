import React from "react";
import { FaCrown, FaMedal } from "react-icons/fa";
import { SiCodeforces, SiLeetcode, SiCodechef, SiGithub } from "react-icons/si";

const LeaderboardPodium = ({ data, platform }) => {
  if (!Array.isArray(data) || data.length < 3) return null;

  const first = data[0];
  const second = data[1];
  const third = data[2];

  const getProfileUrl = (item) => {
    if (!item?.profileId) return "#";
    switch (platform) {
      case "codeforces":
        return `https://codeforces.com/profile/${item.profileId}`;
      case "leetcode":
        return `https://leetcode.com/${item.profileId}`;
      case "codechef":
        return `https://www.codechef.com/users/${item.profileId}`;
      case "github":
        return `https://github.com/${item.profileId}`;
      default:
        return "#";
    }
  };

  const getMetricLabel = (item) => {
    if (!item) return "";
    switch (platform) {
      case "codeforces":
        return `${item.maxRating || item.rating || item.sortingKey || 0} max`;
      case "leetcode":
        return `${Math.round(item.rating || item.sortingKey || 0)} rating`;
      case "codechef":
        return `${item.rating || item.sortingKey || 0} rating`;
      case "github":
        return `${item.totalContributions || item.sortingKey || 0} contribs`;
      default:
        return item.sortingKey || "";
    }
  };

  const PlatformIcon = () => {
    switch (platform) {
      case "codeforces":
        return <SiCodeforces className="text-blue-400" size={13} />;
      case "leetcode":
        return <SiLeetcode className="text-amber-400" size={13} />;
      case "codechef":
        return <SiCodechef className="text-emerald-400" size={13} />;
      case "github":
        return <SiGithub className="text-purple-400" size={13} />;
      default:
        return null;
    }
  };

  return (
    <div className="relative w-full rounded-2xl border border-zinc-800/80 bg-gradient-to-b from-zinc-900/70 to-zinc-950/90 p-5 backdrop-blur-xl shadow-2xl overflow-hidden mb-6">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 h-36 w-72 rounded-full bg-amber-500/10 blur-[80px]" />

      <div className="flex items-center justify-between pb-4 border-b border-zinc-800/60 mb-5">
        <div className="flex items-center gap-2">
          <FaCrown className="text-amber-400 text-base" />
          <h3 className="text-sm font-semibold tracking-wide text-zinc-100 uppercase">
            Top Podium · {platform.toUpperCase()}
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
          <PlatformIcon />
          <span>Department Top 3</span>
        </div>
      </div>

      {/* Podium Cards Grid: 2nd (Silver), 1st (Gold), 3rd (Bronze) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 items-end">
        {/* RANK 2 - SILVER */}
        <div className="order-2 md:order-1 flex flex-col items-center justify-between rounded-xl border border-slate-400/25 bg-zinc-900/60 p-4 transition-all duration-300 hover:border-slate-300/50 hover:bg-zinc-900/80">
          <div className="flex flex-col items-center text-center w-full">
            <div className="relative mb-2.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-800/80 border border-slate-400/40 text-slate-200 font-bold text-sm shadow-md">
                🥈
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-slate-500 text-[10px] font-black text-black">
                2
              </span>
            </div>
            <h4 className="text-sm font-bold text-zinc-100 line-clamp-1">
              {second?.fullName || "Anonymous"}
            </h4>
            <a
              href={getProfileUrl(second)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-0.5 text-xs font-mono text-zinc-400 hover:text-slate-200 hover:underline transition-colors flex items-center gap-1"
            >
              @{second?.profileId}
            </a>
          </div>
          <div className="mt-3 w-full rounded-lg bg-slate-400/10 border border-slate-400/20 py-1.5 px-3 text-center">
            <span className="text-xs font-bold text-slate-200 font-mono">
              {getMetricLabel(second)}
            </span>
          </div>
        </div>

        {/* RANK 1 - GOLD (Elevated) */}
        <div className="order-1 md:order-2 flex flex-col items-center justify-between rounded-xl border border-amber-500/40 bg-gradient-to-b from-amber-500/10 to-zinc-900/80 p-5 shadow-[0_0_25px_rgba(245,158,11,0.12)] transition-all duration-300 hover:border-amber-400/60 md:-translate-y-2">
          <div className="flex flex-col items-center text-center w-full">
            <div className="relative mb-2.5">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 border-2 border-amber-300 text-black font-black text-lg shadow-[0_0_20px_rgba(245,158,11,0.4)]">
                🥇
              </div>
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-amber-400 animate-bounce">
                <FaCrown size={14} />
              </span>
              <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-[10px] font-black text-black shadow">
                1
              </span>
            </div>
            <h4 className="text-base font-bold text-white line-clamp-1">
              {first?.fullName || "Anonymous"}
            </h4>
            <a
              href={getProfileUrl(first)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-0.5 text-xs font-mono text-amber-300 hover:text-amber-200 hover:underline transition-colors flex items-center gap-1"
            >
              @{first?.profileId}
            </a>
          </div>
          <div className="mt-3.5 w-full rounded-lg bg-amber-500/20 border border-amber-400/40 py-2 px-3 text-center shadow">
            <span className="text-xs font-black text-amber-200 font-mono tracking-wide">
              {getMetricLabel(first)}
            </span>
          </div>
        </div>

        {/* RANK 3 - BRONZE */}
        <div className="order-3 md:order-3 flex flex-col items-center justify-between rounded-xl border border-amber-700/30 bg-zinc-900/60 p-4 transition-all duration-300 hover:border-amber-600/50 hover:bg-zinc-900/80">
          <div className="flex flex-col items-center text-center w-full">
            <div className="relative mb-2.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-zinc-800 border border-amber-700/50 text-amber-400 font-bold text-sm shadow-md">
                🥉
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-700 text-[10px] font-black text-white">
                3
              </span>
            </div>
            <h4 className="text-sm font-bold text-zinc-100 line-clamp-1">
              {third?.fullName || "Anonymous"}
            </h4>
            <a
              href={getProfileUrl(third)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-0.5 text-xs font-mono text-zinc-400 hover:text-amber-400 hover:underline transition-colors flex items-center gap-1"
            >
              @{third?.profileId}
            </a>
          </div>
          <div className="mt-3 w-full rounded-lg bg-amber-700/10 border border-amber-700/30 py-1.5 px-3 text-center">
            <span className="text-xs font-bold text-amber-300 font-mono">
              {getMetricLabel(third)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPodium;
