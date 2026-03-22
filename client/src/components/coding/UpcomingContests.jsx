import axios from "axios";
import React, { useEffect, useState } from "react";
import { getContests } from "../../services/codingService";

const UpcomingContests = () => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const localData = JSON.parse(localStorage.getItem('upcoming-contests'));
        if (
          localData &&
          localData.lastUpdated &&
          (new Date() - new Date(localData.lastUpdated)) < 86400000 &&
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
          localStorage.setItem('upcoming-contests', JSON.stringify({ data: contestsArray, lastUpdated: new Date() }));
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching contests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContests();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <p className="text-xl text-gray-500">Loading upcoming contests...</p>
      </div>
    );
  }

  return (
    <div className="mb-8 w-full">
      <div className="flex items-center gap-2 mb-6 text-white">
        <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <h2 className="text-xl font-bold tracking-tight">
          Upcoming Contests
        </h2>
      </div>

      {Array.isArray(contests) && contests.length === 0 ? (
        <div className="flex h-32 items-center justify-center rounded-xl border border-zinc-800/50 bg-[#09090b]">
          <p className="text-zinc-500 text-sm font-medium">No upcoming contests available.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.isArray(contests) && contests.map((contest, index) => {
            const lcColors = "bg-orange-500/10 text-orange-400 border border-orange-500/20";
            const cfColors = "bg-blue-500/10 text-blue-400 border border-blue-500/20";
            const ccColors = "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
            
            const pColors = contest.site === "leetcode" ? lcColors : contest.site === "codeforces" ? cfColors : ccColors;

            return (
              <a
                href={contest.url} target="_blank" rel="noopener noreferrer"
                key={index}
                className="group flex flex-col justify-between gap-3 rounded-xl border border-zinc-800/80 bg-[#0c0c0e] hover:bg-[#111114] p-5 transition-all duration-300 relative"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-[0.95rem] font-semibold text-zinc-100 leading-snug group-hover:text-white">
                      {contest.title}
                    </h3>
                    <svg className="w-4 h-4 flex-shrink-0 text-zinc-500 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                  <span className={`w-fit rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold tracking-wider capitalize ${pColors}`}>
                    {contest.site}
                  </span>
                </div>
                
                <div className="mt-2 flex flex-col gap-1.5 text-[0.75rem] font-medium text-zinc-400">
                  <div className="flex items-center gap-1.5">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(contest.startTime).toString().replace('India Standard Time','IST').split('GMT')[0].trim()}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {(contest.site==="leetcode")?Math.floor(contest.duration / 3600000):Math.floor(contest.duration / 60000)}{(contest.site==="leetcode") ? 'h' : 'm'}
                    {(contest.site==="leetcode" && contest.duration % 3600000 > 0) ? ` ${Math.floor((contest.duration % 3600000) / 60000)}m` : ""}
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UpcomingContests;
