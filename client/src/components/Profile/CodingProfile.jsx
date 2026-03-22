import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const CodingProfile = ({
  leetcodeProfile,
  codeforcesProfile,
  codechefProfile,
}) => {
  const [leetcodeData, setLeetcodeData] = useState(null);
  const [codeforcesData, setCodeforcesData] = useState(null);
  const [codechefData, setCodechefData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setError(null);
      setLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/coding-profiles/get-profile`,
        {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }
      const data = await response.json();
      setLeetcodeData(data?.data?.leetcode);
      setCodeforcesData(data?.data?.codeforces);
      setCodechefData(data?.data?.codechef);
    } catch (err) {
      console.error("Error fetching coding profiles:", err);
      setError("Failed to load coding profiles. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [leetcodeProfile, codeforcesProfile, codechefProfile]);

  if (loading) {
    return (
      <div className="space-y-4 p-4">
        {Array(3).fill().map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="h-5 w-32 animate-pulse rounded bg-zinc-700" />
            <div className="h-24 w-24 animate-pulse rounded-full bg-zinc-700" />
            <div className="h-4 w-48 animate-pulse rounded bg-zinc-700" />
            <div className="h-4 w-40 animate-pulse rounded bg-zinc-700" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-zinc-900/40 p-6">
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <svg className="h-10 w-10 text-red-400/80 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <p className="text-red-400 text-lg font-medium mb-1">Failed to load coding profiles</p>
          <p className="text-zinc-500 text-sm mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const leetcodeUser = leetcodeData?.data?.matchedUser;
  const leetcodeStats = leetcodeUser?.submitStats?.acSubmissionNum;
  const leetcodeLanguages = leetcodeUser?.languageProblemCount;
  const leetcodeContestRanking = leetcodeData?.data?.userContestRanking;

  const codeforcesProfileData = Array.isArray(codeforcesData?.data) ? codeforcesData.data[0] : null;
  const codeforcesRatings = Array.isArray(codeforcesData?.data) ? codeforcesData.data[1]?.ratings?.map((rating) => ({
    date: new Date(rating.ratingUpdateTimeSeconds * 1000).toLocaleDateString(),
    contestName: rating.contestName,
    oldRating: rating.oldRating, // Comment to hide old rating
    newRating: rating.newRating,
  })) || [] : [];
  
  const codechefUser = Array.isArray(codechefData) ? codechefData[0] : null;

  // Empty state: no coding profiles set
  const hasAnyProfile = leetcodeUser || codeforcesProfileData || codechefUser;

  if (!hasAnyProfile) {
    return (
      <div className="rounded-xl border border-zinc-700/30 bg-zinc-800/30 p-6">
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <svg className="mb-4 h-10 w-10 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
          </svg>
          <p className="text-zinc-300 text-lg font-medium mb-1">No coding profiles found</p>
          <p className="text-zinc-500 text-sm">Add your LeetCode, Codeforces, or CodeChef usernames above and save to see your stats here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-white">
      {/* LeetCode Profile */}
      {leetcodeUser && (
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-6">
            <img
              src={leetcodeUser?.profile?.userAvatar}
              alt="User Avatar"
              className="h-16 w-16 rounded-full border border-zinc-700/50"
            />
            <div>
              <h3 className="text-2xl font-bold">LeetCode</h3>
              <p className="text-blue-400 font-medium">@{leetcodeUser?.username}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="rounded-xl border border-zinc-700/50 bg-zinc-800/30 p-4">
              <p className="text-sm text-zinc-400">Streak</p>
              <p className="text-xl font-bold text-white">{leetcodeUser?.userCalendar?.streak} days</p>
            </div>
            <div className="rounded-xl border border-zinc-700/50 bg-zinc-800/30 p-4">
              <p className="text-sm text-zinc-400">Contests</p>
              <p className="text-xl font-bold text-white">{leetcodeContestRanking?.attendedContestsCount || 0}</p>
            </div>
            <div className="rounded-xl border border-zinc-700/50 bg-zinc-800/30 p-4">
              <p className="text-sm text-zinc-400">Rating</p>
              <p className="text-xl font-bold text-white">{leetcodeContestRanking?.rating?.toFixed(2) || 'N/A'}</p>
            </div>
            <div className="rounded-xl border border-zinc-700/50 bg-zinc-800/30 p-4">
              <p className="text-sm text-zinc-400">Global Rank</p>
              <p className="text-xl font-bold text-white">{leetcodeContestRanking?.globalRanking || 'N/A'}</p>
            </div>
          </div>

          {/* Submission stats */}
          <div className="rounded-xl border border-zinc-700/50 bg-zinc-900/40 p-5 mb-8">
            <h4 className="mb-6 text-lg font-semibold">Submission Stats</h4>
            <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={leetcodeStats || []}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorSubmissions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" vertical={false} />
              <XAxis
                dataKey="difficulty"
                interval={0}
                angle={-45}
                textAnchor="end"
                padding={{ bottom: 100 }}
              />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                  borderRadius: "10px",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  color: "white",
                  width: "auto",
                  maxWidth: "200px",
                }}
                itemStyle={{ color: "white" }}
                cursor={{ fill: "rgba(255, 255, 255, 0.1)" }}
              />
              <Legend
                verticalAlign="top"
                layout="horizontal"
                align="right"
                wrapperStyle={{
                  paddingLeft: "10px",
                }}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorCount)"
                name="Solved"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, strokeWidth: 0, fill: "#3b82f6" }}
              />
              <Area
                type="monotone"
                dataKey="submissions"
                stroke="#10b981"
                fillOpacity={1}
                fill="url(#colorSubmissions)"
                name="Submissions"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, strokeWidth: 0, fill: "#10b981" }}
              />
            </AreaChart>
          </ResponsiveContainer>
          </div>

          {/* Language Stats */}
          <h4 className="mt-4">Problems Solved by Language:</h4>
          <ul>
            {leetcodeLanguages?.map((lang) => (
              <li key={lang?.languageName}>
                {lang?.languageName}: {lang?.problemsSolved} problems
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Codeforces Profile */}
      {codeforcesProfileData && (
        <div>
          <div className="flex items-center gap-4 mb-6 mt-12">
            <img
              src={codeforcesProfileData?.avatar}
              alt="User Avatar"
              className="h-16 w-16 rounded-full border border-zinc-700/50"
            />
            <div>
              <h3 className="text-2xl font-bold">Codeforces</h3>
              <p className="text-blue-400 font-medium">@{codeforcesProfileData?.handle}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="rounded-xl border border-zinc-700/50 bg-zinc-800/30 p-4">
              <p className="text-sm text-zinc-400">Current Rating</p>
              <p className="text-xl font-bold text-white">{codeforcesProfileData?.rating}</p>
              <p className="text-xs text-zinc-500 capitalize">{codeforcesProfileData?.rank}</p>
            </div>
            <div className="rounded-xl border border-zinc-700/50 bg-zinc-800/30 p-4">
              <p className="text-sm text-zinc-400">Max Rating</p>
              <p className="text-xl font-bold text-white">{codeforcesProfileData?.maxRating}</p>
              <p className="text-xs text-zinc-500 capitalize">{codeforcesProfileData?.maxRank}</p>
            </div>
            <div className="rounded-xl border border-zinc-700/50 bg-zinc-800/30 p-4">
              <p className="text-sm text-zinc-400">Friends</p>
              <p className="text-xl font-bold text-white">{codeforcesProfileData?.friendOfCount}</p>
            </div>
          </div>

          {/* Rating Progress */}
          <div className="rounded-xl border border-zinc-700/50 bg-zinc-900/40 p-5 mb-8">
            <h4 className="mb-6 text-lg font-semibold">Rating Progress</h4>
            <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={codeforcesRatings || []}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorRating" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" vertical={false} />
              <XAxis
                dataKey="date"
                interval={0}
                angle={-45}
                textAnchor="end"
                tick={{ fontSize: 10 }}
                padding={{ left: 20, right: 20 }}
              />
              <YAxis />
              <Tooltip
                content={({ payload, label }) => {
                  if (payload?.length) {
                    return (
                      <div
                        style={{
                          backgroundColor: "rgba(0, 0, 0, 0.8)",
                          borderRadius: "10px",
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                          color: "white",
                          padding: "10px",
                          maxWidth: "200px",
                        }}
                      >
                        <p>{`Date: ${label}`}</p>
                        <p>{`Contest: ${payload[0].payload.contestName}`}</p>
                        <p>{`New Rating: ${payload[0].payload.newRating}`}</p>
                        <p>{`Old Rating: ${payload[0].payload.oldRating}`}</p> {/* comment to hide old rating */}
                      </div>
                    );
                  }
                  return null;
                }}
                cursor={{ fill: "rgba(255, 255, 255, 0.1)" }}
              />
              <Legend
                verticalAlign="top"
                layout="horizontal"
                align="right"
                wrapperStyle={{
                  paddingLeft: "10px",
                }}
              />
              <Area
                type="monotone"
                dataKey="newRating"
                stroke="#8b5cf6"
                fillOpacity={1}
                fill="url(#colorRating)"
                name="Rating"
                strokeWidth={2}
                dot={{ r: 3, fill: "#8b5cf6", strokeWidth: 0 }}
                activeDot={{ r: 6, strokeWidth: 0, fill: "#c4b5fd" }}
              />
            </AreaChart>
          </ResponsiveContainer>
          </div>
        </div>
      )}
      {/* CodeChef Profile */}
      {codechefUser && (
        <div>
          <div className="flex items-center gap-4 mb-6 mt-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-zinc-700/50 bg-zinc-800 text-2xl font-bold text-white">
              C
            </div>
            <div>
              <h3 className="text-2xl font-bold">CodeChef</h3>
              <p className="text-blue-400 font-medium">@{codechefUser?.username}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-xl border border-zinc-700/50 bg-zinc-800/30 p-4">
              <p className="text-sm text-zinc-400">Current Rating</p>
              <p className="text-xl font-bold text-white">{codechefUser?.rating} <span className="text-sm font-normal text-amber-500">{codechefUser?.rating_number}</span></p>
            </div>
            <div className="rounded-xl border border-zinc-700/50 bg-zinc-800/30 p-4">
              <p className="text-sm text-zinc-400">Global Rank</p>
              <p className="text-xl font-bold text-white">{codechefUser?.global_rank}</p>
            </div>
            <div className="rounded-xl border border-zinc-700/50 bg-zinc-800/30 p-4">
              <p className="text-sm text-zinc-400">Country Rank</p>
              <p className="text-xl font-bold text-white">{codechefUser?.country_rank} <span className="text-xs text-zinc-500">({codechefUser?.country})</span></p>
            </div>
            <div className="rounded-xl border border-zinc-700/50 bg-zinc-800/30 p-4">
              <p className="text-sm text-zinc-400">Max Rank</p>
              <p className="text-xl font-bold text-white">{codechefUser?.max_rank}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodingProfile;