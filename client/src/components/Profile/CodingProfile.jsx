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
  const [codechefData, setCodechefData] = useState(null); // State for CodeChef data
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeetcodeData = async () => {
      try {
        if (leetcodeProfile) {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_BASE_URL}/coding-profiles/user/leetcode/${leetcodeProfile}`,
          );
          const data = await response.json();
          
          setLeetcodeData(data.data);
        } else {
          setLeetcodeData(null);
        }
      } catch (error) {
        console.error("Error fetching LeetCode data:", error);
      }
    };

    const fetchCodeforcesData = async () => {
      try {
        if (codeforcesProfile) {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_BASE_URL}/coding-profiles/user/codeforces/${codeforcesProfile}`,
          );
          const data = await response.json();
          setCodeforcesData(data);
        } else {
          setCodeforcesData(null);
        }
      } catch (error) {
        console.error("Error fetching Codeforces data:", error);
      }
    };

    const fetchCodechefData = async () => {
      try {
        if (codechefProfile) {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_BASE_URL}/coding-profiles/user/codechef/${codechefProfile}`,
          );
          const data = await response.json();
          setCodechefData(data);
        } else {
          setCodechefData(null);
        }
      } catch (error) {
        console.error("Error fetching CodeChef data:", error);
      }
    };

    Promise.all([
      fetchLeetcodeData(),
      fetchCodeforcesData(),
      fetchCodechefData(),
    ]).then(() => setLoading(false));
  }, [leetcodeProfile, codeforcesProfile, codechefProfile]);

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  // if (!leetcodeData || !codeforcesData || !codechefData) {
  //   return <div className="text-white">Data not found.</div>;
  // }
console.log(leetcodeData);
  const leetcodeUser = leetcodeData?.matchedUser;
  console.log("-------");
  console.log(leetcodeUser);
  const leetcodeStats = leetcodeUser?.submitStats?.acSubmissionNum;
  const leetcodeLanguages = leetcodeUser?.languageProblemCount;

  const codeforcesProfileData = codeforcesData ? codeforcesData?.data[0] : null;
  const codeforcesRatings = codeforcesData ? codeforcesData?.data[1]?.ratings?.map((rating) => ({
    date: new Date(rating.ratingUpdateTimeSeconds * 1000).toLocaleDateString(),
    contestName: rating.contestName,
    oldRating: rating.oldRating,
    newRating: rating.newRating,
  })) : [];

  const codechefUser = codechefData?.data; // Assuming the API response structure is correct

  return (
    <div className="rounded-lg p-6 text-white">
      {/* LeetCode Profile */}
      {leetcodeData && (
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
            Contests Attended:{" "}
            {leetcodeData?.userContestRanking?.attendedContestsCount}
          </p>
          <p>
            Global Ranking: {leetcodeData?.userContestRanking?.globalRanking}
          </p>
          <p>
            Rating: {leetcodeData?.userContestRanking?.rating.toFixed(2)}
          </p>
          <p>
            Top Percentage: {leetcodeData?.userContestRanking?.topPercentage}
          </p>

          {/* Submission stats */}
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={leetcodeStats}
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
      {codeforcesData && (
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
              data={codeforcesRatings}
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
                  if (payload.length) {
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
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
      {/* CodeChef Profile */}
      {codechefData && (
        <div>
          <h3 className="mb-2 text-xl">CodeChef</h3>
          <p>Username: {codechefUser?.username}</p>
          <p>Current Rating: {codechefUser?.rating}</p>
          <p>Rating Number: {codechefUser?.rating_number}</p>
          <p>Global Rank: {codechefUser?.global_rank}</p>
          <p>Country Rank: {codechefUser?.country_rank}</p>
          <p>Max Rank: {codechefUser?.max_rank}</p>
          <p>Country: {codechefUser?.country}</p>

          {/* Note: Add more CodeChef statistics if available and desired */}
        </div>
      )}
    </div>
  );
};

export default CodingProfile;
