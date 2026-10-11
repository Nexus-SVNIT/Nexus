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
  githubProfile,
  leetcodeProfile,
  codeforcesProfile,
  codechefProfile,
}) => {
  const [githubData, setGithubData] = useState(null);
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
      setGithubData(data?.data?.github);
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
  }, [githubProfile, leetcodeProfile, codeforcesProfile, codechefProfile]);


  if (loading) {
    return (
      <div className="space-y-4 p-3 sm:p-4">
        {Array(3).fill().map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="h-4 sm:h-5 w-24 sm:w-32 animate-pulse rounded bg-zinc-700" />
            <div className="h-16 w-16 sm:h-24 sm:w-24 animate-pulse rounded-full bg-zinc-700" />
            <div className="h-3 sm:h-4 w-36 sm:w-48 animate-pulse rounded bg-zinc-700" />
            <div className="h-3 sm:h-4 w-32 sm:w-40 animate-pulse rounded bg-zinc-700" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-zinc-900/40 p-4 sm:p-6">
        <div className="flex flex-col items-center justify-center py-6 sm:py-8 text-center">
          <svg className="h-8 w-8 sm:h-10 sm:w-10 text-red-400/80 mb-3 sm:mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <p className="text-red-400 text-base sm:text-lg font-medium mb-1">Failed to load coding profiles</p>
          <p className="text-zinc-500 text-sm mb-3 sm:mb-4 px-2">{error}</p>
          <button
            onClick={fetchData}
            className="rounded-lg bg-blue-600 px-4 sm:px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
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
  const githubUser = githubData?.data || githubData;

  const getGitHubTier = (contributions = 0) => {
    if (contributions >= 1000) return { name: "Legendary", style: "border-emerald-400 text-emerald-300 bg-emerald-500/20 shadow-[0_0_12px_rgba(52,211,153,0.3)]" };
    if (contributions >= 500) return { name: "Master", style: "border-green-400 text-green-300 bg-green-500/20" };
    if (contributions >= 250) return { name: "Pro", style: "border-teal-400 text-teal-300 bg-teal-500/20" };
    if (contributions >= 100) return { name: "Explorer", style: "border-cyan-400 text-cyan-300 bg-cyan-500/20" };
    return { name: "Newbie", style: "border-zinc-500 text-zinc-300 bg-zinc-600/20" };
  };

  // Empty state: no coding profiles set
  const hasAnyProfile = githubUser || leetcodeUser || codeforcesProfileData || codechefUser;

  if (!hasAnyProfile) {
    return (
      <div className="rounded-xl border border-zinc-700/30 bg-zinc-800/30 p-4 sm:p-6">
        <div className="flex flex-col items-center justify-center py-6 sm:py-8 text-center">
          <svg className="mb-3 sm:mb-4 h-8 w-8 sm:h-10 sm:w-10 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
          </svg>
          <p className="text-zinc-300 text-base sm:text-lg font-medium mb-1">No coding profiles found</p>
          <p className="text-zinc-500 text-sm px-2">Add your GitHub, LeetCode, Codeforces, or CodeChef usernames above and save to see your stats here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 text-white overflow-hidden">
      {/* GitHub Profile */}
      {githubUser && (
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
              <img
                src={githubUser?.avatarUrl || `https://github.com/${githubUser?.profileId || githubUser?.login}.png`}
                alt="GitHub Avatar"
                className="h-12 w-12 sm:h-16 sm:w-16 rounded-full border border-zinc-700/50 flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h3 className="text-lg sm:text-2xl font-bold">GitHub</h3>
                <a
                  href={`https://github.com/${githubUser?.profileId || githubUser?.login}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 font-medium text-sm sm:text-base break-all"
                >
                  @{githubUser?.profileId || githubUser?.login}
                </a>
              </div>
            </div>
            {(() => {
              const tier = getGitHubTier(githubUser?.totalContributions || githubUser?.sortingKey || 0);
              return (
                <span className={`rounded-full border px-3 py-1 text-xs font-semibold self-start sm:self-auto ${tier.style}`}>
                  {tier.name} Tier
                </span>
              );
            })()}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="rounded-xl border border-zinc-700/50 bg-zinc-800/30 p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-zinc-400">Total Contributions</p>
              <p className="text-lg sm:text-xl font-bold text-emerald-400">{githubUser?.totalContributions || githubUser?.sortingKey || 0}</p>
            </div>
            <div className="rounded-xl border border-zinc-700/50 bg-zinc-800/30 p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-zinc-400">Lifetime Commits</p>
              <p className="text-lg sm:text-xl font-bold text-white">{githubUser?.commits || 0}</p>
            </div>
            <div className="rounded-xl border border-zinc-700/50 bg-zinc-800/30 p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-zinc-400">Pull Requests & Reviews</p>
              <p className="text-lg sm:text-xl font-bold text-white">{githubUser?.prs || 0}</p>
            </div>
            <div className="rounded-xl border border-zinc-700/50 bg-zinc-800/30 p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-zinc-400">Public Repos & Stars</p>
              <p className="text-lg sm:text-xl font-bold text-white">{githubUser?.publicRepos || 0} <span className="text-xs sm:text-sm text-yellow-400">({githubUser?.stars || 0} ⭐)</span></p>
            </div>
          </div>
        </div>
      )}

      {/* LeetCode Profile */}
      {leetcodeUser && (
        <div className="mb-6">
          <div className="flex items-center gap-3 sm:gap-4 mb-6">
            <img
              src={leetcodeUser?.profile?.userAvatar}
              alt="User Avatar"
              className="h-12 w-12 sm:h-16 sm:w-16 rounded-full border border-zinc-700/50 flex-shrink-0"
            />
            <div className="min-w-0 flex-1">
              <h3 className="text-lg sm:text-2xl font-bold">LeetCode</h3>
              <p className="text-blue-400 font-medium text-sm sm:text-base break-all">@{leetcodeUser?.username}</p>
            </div>
          </div>

          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="rounded-xl border border-zinc-700/50 bg-zinc-800/30 p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-zinc-400">Streak</p>
              <p className="text-lg sm:text-xl font-bold text-white">{leetcodeUser?.userCalendar?.streak} days</p>
            </div>
            <div className="rounded-xl border border-zinc-700/50 bg-zinc-800/30 p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-zinc-400">Contests</p>
              <p className="text-lg sm:text-xl font-bold text-white">{leetcodeContestRanking?.attendedContestsCount || 0}</p>
            </div>
            <div className="rounded-xl border border-zinc-700/50 bg-zinc-800/30 p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-zinc-400">Rating</p>
              <p className="text-lg sm:text-xl font-bold text-white">{leetcodeContestRanking?.rating?.toFixed(2) || 'N/A'}</p>
            </div>
            <div className="rounded-xl border border-zinc-700/50 bg-zinc-800/30 p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-zinc-400">Global Rank</p>
              <p className="text-lg sm:text-xl font-bold text-white">{leetcodeContestRanking?.globalRanking || 'N/A'}</p>
            </div>
          </div>

          {/* Submission stats */}
          <div className="rounded-xl border border-zinc-700/50 bg-zinc-900/40 p-4 sm:p-5 mb-6 sm:mb-8">
            <h4 className="mb-4 sm:mb-6 text-base sm:text-lg font-semibold">Submission Stats</h4>
            <div className="w-full overflow-hidden">
              <div className="min-h-[250px] sm:min-h-[300px]">
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart
                    data={leetcodeStats || []}
                    margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
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
                      height={60}
                      tick={{ fontSize: 10 }}
                    />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(0, 0, 0, 0.9)",
                        borderRadius: "8px",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        color: "white",
                        fontSize: "12px",
                      }}
                      itemStyle={{ color: "white", fontSize: "12px" }}
                      cursor={{ fill: "rgba(255, 255, 255, 0.1)" }}
                    />
                    <Legend
                      verticalAlign="top"
                      layout="horizontal"
                      align="center"
                      wrapperStyle={{
                        paddingBottom: "10px",
                        fontSize: "12px",
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
                      activeDot={{ r: 4, strokeWidth: 0, fill: "#3b82f6" }}
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
                      activeDot={{ r: 4, strokeWidth: 0, fill: "#10b981" }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Language Stats */}
          <div className="mt-4">
            <h4 className="text-base sm:text-lg font-semibold mb-3">Problems Solved by Language:</h4>
            <div className="space-y-2">
              {leetcodeLanguages?.map((lang) => (
                <div key={lang?.languageName} className="flex justify-between items-center py-2 px-3 rounded-lg bg-zinc-800/30 border border-zinc-700/50">
                  <span className="text-sm text-zinc-300 break-all">{lang?.languageName}</span>
                  <span className="text-sm font-semibold text-white ml-2 flex-shrink-0">{lang?.problemsSolved} problems</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Codeforces Profile */}
      {codeforcesProfileData && (
        <div>
          <div className="flex items-center gap-3 sm:gap-4 mb-6 mt-8 sm:mt-12">
            <img
              src={codeforcesProfileData?.avatar}
              alt="User Avatar"
              className="h-12 w-12 sm:h-16 sm:w-16 rounded-full border border-zinc-700/50 flex-shrink-0"
            />
            <div className="min-w-0 flex-1">
              <h3 className="text-lg sm:text-2xl font-bold">Codeforces</h3>
              <p className="text-blue-400 font-medium text-sm sm:text-base break-all">@{codeforcesProfileData?.handle}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="rounded-xl border border-zinc-700/50 bg-zinc-800/30 p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-zinc-400">Current Rating</p>
              <p className="text-lg sm:text-xl font-bold text-white">{codeforcesProfileData?.rating}</p>
              <p className="text-xs text-zinc-500 capitalize">{codeforcesProfileData?.rank}</p>
            </div>
            <div className="rounded-xl border border-zinc-700/50 bg-zinc-800/30 p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-zinc-400">Max Rating</p>
              <p className="text-lg sm:text-xl font-bold text-white">{codeforcesProfileData?.maxRating}</p>
              <p className="text-xs text-zinc-500 capitalize">{codeforcesProfileData?.maxRank}</p>
            </div>
            <div className="rounded-xl border border-zinc-700/50 bg-zinc-800/30 p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-zinc-400">Friends</p>
              <p className="text-lg sm:text-xl font-bold text-white">{codeforcesProfileData?.friendOfCount}</p>
            </div>
          </div>

          {/* Rating Progress */}
          <div className="rounded-xl border border-zinc-700/50 bg-zinc-900/40 p-4 sm:p-5 mb-6 sm:mb-8">
            <h4 className="mb-4 sm:mb-6 text-base sm:text-lg font-semibold">Rating Progress</h4>
            <div className="w-full overflow-hidden">
              <div className="min-h-[250px] sm:min-h-[300px]">
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart
                    data={codeforcesRatings || []}
                    margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
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
                      interval="preserveStartEnd"
                      angle={-45}
                      textAnchor="end"
                      tick={{ fontSize: 10 }}
                      height={60}
                    />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip
                      content={({ payload, label }) => {
                        if (payload?.length) {
                          return (
                            <div
                              style={{
                                backgroundColor: "rgba(0, 0, 0, 0.9)",
                                borderRadius: "8px",
                                border: "1px solid rgba(255, 255, 255, 0.2)",
                                color: "white",
                                padding: "8px",
                                fontSize: "12px",
                              }}
                            >
                              <p>{`Date: ${label}`}</p>
                              <p>{`Contest: ${payload[0].payload.contestName}`}</p>
                              <p>{`New Rating: ${payload[0].payload.newRating}`}</p>
                              <p>{`Old Rating: ${payload[0].payload.oldRating}`}</p>
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
                      align="center"
                      wrapperStyle={{
                        paddingBottom: "10px",
                        fontSize: "12px",
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
                      dot={{ r: 2, fill: "#8b5cf6", strokeWidth: 0 }}
                      activeDot={{ r: 4, strokeWidth: 0, fill: "#c4b5fd" }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* CodeChef Profile */}
      {codechefUser && (
        <div>
          <div className="flex items-center gap-3 sm:gap-4 mb-6 mt-8 sm:mt-12">
            <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full border border-zinc-700/50 bg-zinc-800 text-lg sm:text-2xl font-bold text-white flex-shrink-0">
              C
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg sm:text-2xl font-bold">CodeChef</h3>
              <p className="text-blue-400 font-medium text-sm sm:text-base break-all">@{codechefUser?.username}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="rounded-xl border border-zinc-700/50 bg-zinc-800/30 p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-zinc-400">Current Rating</p>
              <p className="text-lg sm:text-xl font-bold text-white">{codechefUser?.rating} <span className="text-sm font-normal text-amber-500">{codechefUser?.rating_number}</span></p>
            </div>
            <div className="rounded-xl border border-zinc-700/50 bg-zinc-800/30 p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-zinc-400">Global Rank</p>
              <p className="text-lg sm:text-xl font-bold text-white">{codechefUser?.global_rank}</p>
            </div>
            <div className="rounded-xl border border-zinc-700/50 bg-zinc-800/30 p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-zinc-400">Country Rank</p>
              <p className="text-lg sm:text-xl font-bold text-white">{codechefUser?.country_rank} <span className="text-xs text-zinc-500">({codechefUser?.country})</span></p>
            </div>
            <div className="rounded-xl border border-zinc-700/50 bg-zinc-800/30 p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-zinc-400">Max Rank</p>
              <p className="text-lg sm:text-xl font-bold text-white">{codechefUser?.max_rank}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodingProfile;