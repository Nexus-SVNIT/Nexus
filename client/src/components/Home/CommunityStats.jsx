import React, { useState, useEffect } from "react";
import CountUp from "react-countup";
import { 
  HiOutlineUserGroup, 
  HiOutlineCalendar, 
  HiOutlineDocumentText, 
  HiOutlineCode 
} from "react-icons/hi";
import { getCounter, incrementCounter } from "../../services/counterService";
import { getAllEvents } from "../../services/eventService";
import { getContributors } from "../../services/contributorService";
import { getAllPosts } from "../../services/postService";

const CommunityStats = ({ onComplete }) => {
  const [visitorCount, setVisitorCount] = useState(0);
  const [eventCount, setEventCount] = useState(0);
  const [interviewCount, setInterviewCount] = useState(0);
  const [contributorCount, setContributorCount] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchAllLiveStats = async () => {
      try {
        // 1. Visitors
        await incrementCounter().catch(() => {});
        const counterRes = await getCounter().catch(() => null);
        if (isMounted && counterRes?.success) {
          setVisitorCount(counterRes.data);
        }

        // 2. Events Count directly from DB
        const eventsRes = await getAllEvents().catch(() => null);
        if (isMounted && eventsRes?.success && Array.isArray(eventsRes.data)) {
          setEventCount(eventsRes.data.length);
        }

        // 3. Interview Posts count directly from DB
        const postsRes = await getAllPosts({ limit: 1 }).catch(() => null);
        if (isMounted && postsRes?.success && postsRes.data) {
          // totalPages * pageSize or totalCount
          const totalPosts = postsRes.data.totalCount || (postsRes.data.posts ? postsRes.data.posts.length : 0);
          setInterviewCount(totalPosts);
        }

        // 4. Contributors count
        const contribRes = await getContributors().catch(() => null);
        if (isMounted && contribRes?.success && contribRes.data) {
          const allContributors = new Set();
          Object.values(contribRes.data).forEach((yearGroup) => {
            if (Array.isArray(yearGroup)) {
              yearGroup.forEach((c) => {
                if (c.username || c.name || c.id) {
                  allContributors.add(c.username || c.name || c.id);
                }
              });
            }
          });
          setContributorCount(allContributors.size || 25);
        }

        if (isMounted) setLoaded(true);
      } catch (err) {
        console.error("Live stats sync error:", err);
        if (isMounted) setLoaded(true);
      }
    };

    fetchAllLiveStats();

    return () => {
      isMounted = false;
    };
  }, []);

  const stats = [
    {
      label: "Total Visitors",
      count: visitorCount,
      suffix: "",
      icon: HiOutlineUserGroup,
      accent: "from-blue-500 to-cyan-400",
      borderGlow: "hover:border-cyan-500/40",
      subtext: "Community impressions",
    },
    {
      label: "Interview Archives",
      count: interviewCount,
      suffix: "+",
      icon: HiOutlineDocumentText,
      accent: "from-emerald-400 to-teal-300",
      borderGlow: "hover:border-emerald-500/40",
      subtext: "MAANG & Tier-1 transcripts",
    },
    {
      label: "Active Contributors",
      count: contributorCount,
      suffix: "+",
      icon: HiOutlineCode,
      accent: "from-amber-400 to-orange-400",
      borderGlow: "hover:border-amber-500/40",
      subtext: "Open-source builders",
    },
  ];

  return (
    <div className="w-full max-w-5xl px-4 mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5">
        {stats.map((item, idx) => {
          const Icon = item.icon;

          return (
            <div
              key={idx}
              className={`group relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-4 sm:p-5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-950/20 ${item.borderGlow}`}
            >
              {/* Subtle radial corner glow */}
              <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-blue-500/5 blur-2xl group-hover:bg-blue-500/15 transition-all" />

              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 group-hover:text-zinc-300 transition-colors">
                  {item.label}
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800/60 border border-zinc-700/40 text-zinc-300 group-hover:text-white transition-colors">
                  <Icon className="text-base" />
                </div>
              </div>

              <div className="flex items-baseline gap-1">
                <span className={`bg-gradient-to-r ${item.accent} bg-clip-text text-3xl sm:text-4xl font-extrabold text-transparent tracking-tight`}>
                  <CountUp
                    end={item.count}
                    duration={2.0}
                    separator=","
                    enableScrollSpy
                    scrollSpyOnce
                    onEnd={idx === 0 ? onComplete : undefined}
                  />
                </span>
                {item.suffix && item.count > 0 && (
                  <span className={`text-xl font-bold bg-gradient-to-r ${item.accent} bg-clip-text text-transparent`}>
                    {item.suffix}
                  </span>
                )}
              </div>

              <p className="mt-1 text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors line-clamp-1">
                {item.subtext}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CommunityStats;
