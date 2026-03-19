import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
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
          <h3 className="mb-2 text-xl">LeetCode</h3>
          <img
            src={leetcodeUser?.profile?.userAvatar}
            alt="User Avatar"
            className="mb-2 h-24 w-24 rounded-full"
          />
          <p>Username: {leetcodeUser?.username}</p>
          <p>Streak: {leetcodeUser?.userCalendar?.streak} days</p>
          <p>
            Contests Attended: {leetcodeContestRanking?.attendedContestsCount}
          </p>
          <p>
            Global Ranking: {leetcodeContestRanking?.globalRanking}
          </p>
          <p>
            Rating: {leetcodeContestRanking?.rating?.toFixed(2)}
          </p>
          <p>
            Top Percentage: {leetcodeContestRanking?.topPercentage}
          </p>

          {/* Submission stats */}
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={leetcodeStats || []}
              margin={{ top: 20, right: 30, left: 0, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
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
              <Line
                type="monotone"
                dataKey="count"
                stroke="#8884d8"
                name="Solved"
              />
              <Line
                type="monotone"
                dataKey="submissions"
                stroke="#82ca9d"
                name="Submissions"
              />
            </LineChart>
          </ResponsiveContainer>

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
          <h3 className="mb-2 text-xl">Codeforces</h3>
          <img
            src={codeforcesProfileData?.avatar}
            alt="User Avatar"
            className="mb-2 h-24 w-24 rounded-full"
          />
          <p>Username: {codeforcesProfileData?.handle}</p>
          <p>Rank: {codeforcesProfileData?.rank}</p>
          <p>
            Max Rating: {codeforcesProfileData?.maxRating} (
            {codeforcesProfileData?.maxRank})
          </p>
          <p>Current Rating: {codeforcesProfileData?.rating}</p>
          <p>Friend of Count: {codeforcesProfileData?.friendOfCount}</p>

          {/* Rating Progress */}
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={codeforcesRatings || []}
              margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
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
              <Line
                type="monotone"
                dataKey="newRating"
                stroke="#8884d8"
                name="New Rating"
              />
              <Line
                type="monotone"
                dataKey="oldRating"
                stroke="#82ca9d"
                name="Old Rating"
              /> {/* Comment to hide old rating */}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
      {/* CodeChef Profile */}
      {codechefUser && (
        <div>
          <h3 className="mb-2 text-xl">CodeChef</h3>
          <p>Username: {codechefUser?.username}</p>
          <p>Current Rating: {codechefUser?.rating}</p>
          <p>Rating Number: {codechefUser?.rating_number}</p>
          <p>Global Rank: {codechefUser?.global_rank}</p>
          <p>Country Rank: {codechefUser?.country_rank}</p>
          <p>Max Rank: {codechefUser?.max_rank}</p>
          <p>Country: {codechefUser?.country}</p>
        </div>
      )}
    </div>
  );
};

export default CodingProfile;