import React, { useEffect, useState } from "react";
import { getContests } from "../../services/codingService";
import { SiCodeforces, SiLeetcode, SiCodechef } from "react-icons/si";
import { FaCalendarAlt, FaClock, FaExternalLinkAlt, FaFire } from "react-icons/fa";

const UpcomingContests = () => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [now, setNow] = useState(new Date());

  // Update current time periodically for live countdowns
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 10000); // Check every 10 seconds
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const localData = JSON.parse(localStorage.getItem("upcoming-contests"));
        if (
          localData &&
          localData.lastUpdated &&
          new Date() - new Date(localData.lastUpdated) < 3600000 && // 1 hour cache
          Array.isArray(localData.data) &&
          localData.data.length > 0
        ) {
          setContests(localData.data);
          setLoading(false);
          return;
        }

        const response = await getContests();
        if (!response.success) {
          console.error("Failed to fetch contests:", response.message);
        } else {
          const data = response.data;
          let contestsArray = [];
          if (data && data.success !== false && Array.isArray(data.data)) {
            contestsArray = data.data;
          }
          setContests(contestsArray);
          localStorage.setItem(
            "upcoming-contests",
            JSON.stringify({ data: contestsArray, lastUpdated: new Date() })
          );
        }
      } catch (error) {
        console.error("Error fetching contests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContests();
  }, []);

  // Format relative countdown
  const getCountdown = (startTime) => {
    const start = new Date(startTime);
    const diff = start - now;

    if (diff <= 0) {
      return { text: "Live Now!", isUrgent: true, isLive: true };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);

    if (days > 1) {
      return { text: `in ${days} days`, isUrgent: false };
    } else if (days === 1) {
      return { text: `in 1d ${hours}h`, isUrgent: false };
    } else if (hours >= 2) {
      return { text: `in ${hours}h ${minutes}m`, isUrgent: false };
    } else {
      return { text: `in ${hours}h ${minutes}m`, isUrgent: true };
    }
  };

  const formatISTDate = (startTime) => {
    try {
      const date = new Date(startTime);
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Kolkata",
      }) + " IST";
    } catch {
      return new Date(startTime).toString().split("GMT")[0].trim();
    }
  };

  const formatDuration = (contest) => {
    if (!contest.duration) return "";
    const isLC = contest.site === "leetcode";
    const totalMinutes = isLC
      ? Math.floor(contest.duration / 60000)
      : Math.floor(contest.duration / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    if (hours > 0 && mins > 0) return `${hours}h ${mins}m`;
    if (hours > 0) return `${hours}h`;
    return `${mins}m`;
  };

  const filteredContests = contests.filter((c) => {
    if (selectedPlatform === "all") return true;
    return c.site === selectedPlatform;
  });

  const getPlatformMeta = (site) => {
    switch (site) {
      case "leetcode":
        return {
          icon: <SiLeetcode className="text-amber-400" size={14} />,
          badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
          name: "LeetCode",
          border: "hover:border-amber-500/40",
        };
      case "codeforces":
        return {
          icon: <SiCodeforces className="text-blue-400" size={14} />,
          badge: "bg-blue-500/10 text-blue-400 border-blue-500/20",
          name: "Codeforces",
          border: "hover:border-blue-500/40",
        };
      case "codechef":
        return {
          icon: <SiCodechef className="text-emerald-400" size={14} />,
          badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
          name: "CodeChef",
          border: "hover:border-emerald-500/40",
        };
      default:
        return {
          icon: <FaCalendarAlt className="text-zinc-400" size={14} />,
          badge: "bg-zinc-800 text-zinc-300 border-zinc-700",
          name: site,
          border: "hover:border-zinc-700",
        };
    }
  };

  return (
    <div className="w-full rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 backdrop-blur-xl shadow-2xl flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col gap-3 pb-3 border-b border-zinc-800/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <FaCalendarAlt size={13} />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Upcoming Contests
            </h3>
          </div>
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {contests.length} Scheduled
          </span>
        </div>

        {/* Filter Chips inside Sidebar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          {[
            { id: "all", label: "All" },
            { id: "leetcode", label: "LeetCode" },
            { id: "codeforces", label: "Codeforces" },
            { id: "codechef", label: "CodeChef" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedPlatform(item.id)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
                selectedPlatform === item.id
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-zinc-800/60 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Contests List */}
      {loading ? (
        <div className="flex flex-col gap-3 py-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-28 w-full rounded-xl bg-zinc-800/40 border border-zinc-800 animate-pulse"
            />
          ))}
        </div>
      ) : filteredContests.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900/30">
          <FaCalendarAlt className="text-zinc-600 text-2xl mb-2" />
          <p className="text-sm font-medium text-zinc-400">
            No upcoming contests found
          </p>
          <span className="text-xs text-zinc-500 mt-0.5">
            Check back later for new rounds
          </span>
        </div>
      ) : (
        <div className="flex flex-col gap-3 max-h-[580px] overflow-y-auto pr-1 no-scrollbar">
          {filteredContests.map((contest, idx) => {
            const meta = getPlatformMeta(contest.site);
            const countdown = getCountdown(contest.startTime);

            return (
              <a
                key={idx}
                href={contest.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative flex flex-col justify-between gap-2.5 rounded-xl border border-zinc-800/80 bg-zinc-900/40 hover:bg-zinc-800/60 p-3.5 transition-all duration-200 ${meta.border}`}
              >
                {/* Top Row: Platform & Countdown Badge */}
                <div className="flex items-center justify-between gap-2">
                  <div
                    className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${meta.badge}`}
                  >
                    {meta.icon}
                    <span>{meta.name}</span>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono font-bold tracking-tight ${
                      countdown.isLive
                        ? "bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse"
                        : countdown.isUrgent
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        : "bg-zinc-800 text-zinc-400"
                    }`}
                  >
                    {countdown.isUrgent && <FaFire size={10} className="text-amber-400" />}
                    {countdown.text}
                  </span>
                </div>

                {/* Contest Title */}
                <h4 className="text-[13px] font-semibold text-zinc-200 line-clamp-2 leading-snug group-hover:text-white transition-colors">
                  {contest.title}
                </h4>

                {/* Footer Info: Date & Duration */}
                <div className="flex items-center justify-between pt-1 border-t border-zinc-800/40 text-[11px] text-zinc-400 font-mono">
                  <div className="flex items-center gap-1.5">
                    <FaClock size={10} className="text-zinc-500" />
                    <span>{formatISTDate(contest.startTime)}</span>
                  </div>
                  {contest.duration && (
                    <span className="text-zinc-500">
                      ⏱ {formatDuration(contest)}
                    </span>
                  )}
                </div>

                {/* External link hint on hover */}
                <div className="absolute right-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <FaExternalLinkAlt size={10} className="text-blue-400" />
                </div>
              </a>
            );
          })}
        </div>
      )}

      {/* Opt-in / Help tip banner */}
      <div className="mt-1 rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-3.5 flex items-start gap-3">
        <div className="text-blue-400 text-base mt-0.5">💡</div>
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-zinc-200">
            Want your handles tracked?
          </span>
          <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">
            Link your handles in your Nexus Profile to participate in the departmental leaderboards.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UpcomingContests;
