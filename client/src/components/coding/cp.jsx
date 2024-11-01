import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
import SearchInput from "react-search-input";
import "tailwindcss/tailwind.css";
import SortableTable from "./SortedTable";
import SearchBar from "./SearchBar";
import CustomBarChart from "./BarChart";
import Loader from "../Loader/Loader"; // Assuming you have a Loader component

const Cp = () => {
  const [userData, setUserData] = useState([]);
  const [batchData, setBatchData] = useState({});
  const [codeforcesLeaderboard, setCodeforcesLeaderboard] = useState([]);
  const [leetcodeLeaderboard, setLeetcodeLeaderboard] = useState([]);
  const [codechefLeaderboard, setCodechefLeaderboard] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true); // Loader state

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/api/user/get/`
        );
        const data = await response.json();
        const batchWiseData = {};
        const cfLeaderboard = [];
        const lcLeaderboard = [];
        const ccLeaderboard = [];

        await Promise.all(
          data.users.map(async (user) => {
            const batch = user.admissionNumber.slice(1, 3);

            if (!batchWiseData[batch]) {
              batchWiseData[batch] = {
                Codeforces: { totalRating: 0, userCount: 0 },
                LeetCode: { totalRating: 0, totalSolved: 0, userCount: 0 },
                CodeChef: { totalRating: 0, userCount: 0 },
              };
            }

            const leetcodeUsername = user.leetcodeProfile
              ? user.leetcodeProfile
              : null;
            const codeforcesUsername = user.codeforcesProfile
              ? user.codeforcesProfile
              : null;
            const codechefUsername = user.codechefProfile
              ? user.codechefProfile
              : null;

            // Fetch Codeforces data
            if (codeforcesUsername) {
              const cfResponse = await fetch(
                `https://competeapi.vercel.app/user/codeforces/${codeforcesUsername}`
              );
              const cfData = await cfResponse.json();
              if (cfData && cfData.length > 0) {
                const { rating, rank, avatar } = cfData[0];
                const latestContest = cfData[1]?.ratings?.[0] || {};
                cfLeaderboard.push({
                  fullName: user.fullName,
                  admissionNumber: user.admissionNumber,
                  codeforcesProfile: user.codeforcesProfile,
                  rating,
                  rank,
                  avatar,
                  latestContest: latestContest.contestName || "No contests",
                  contestRanking: latestContest.rank || "Not given",
                });
                
                
                  batchWiseData[batch].Codeforces.totalRating += rating;
                  batchWiseData[batch].Codeforces.userCount++;
                
              }
            }

            // Fetch LeetCode data
            if (leetcodeUsername) {
              const lcResponse = await fetch(
                `https://competeapi.vercel.app/user/leetcode/${leetcodeUsername}`
              );
              const lcData = await lcResponse.json();
              if (lcData.data) {
                const userContestRanking = lcData.data.userContestRanking || {};
                const totalSolved =
                  lcData.data.matchedUser?.submitStats?.acSubmissionNum[0]?.count;
                lcLeaderboard.push({
                  fullName: user.fullName,
                  admissionNumber: user.admissionNumber,
                  leetcodeProfile: user.leetcodeProfile,
                  globalRanking: userContestRanking.globalRanking || "N/A",
                  rating:userContestRanking.rating || 0,
                  ContestAttended:userContestRanking.attendedContestsCount||0,
                  totalSolved,
                });
                batchWiseData[batch].LeetCode.totalRating += userContestRanking.rating
                batchWiseData[batch].LeetCode.userCount++;
                batchWiseData[batch].LeetCode.totalSolved += totalSolved;
              }
            }

            // Fetch CodeChef data
            if (codechefUsername) {
              const ccResponse = await fetch(
                `https://competeapi.vercel.app/user/codechef/${codechefUsername}`
              );
              const ccData = await ccResponse.json();
              if (ccData) {
                ccLeaderboard.push({
                  fullName: user.fullName,
                  admissionNumber: user.admissionNumber,
                  codechefProfile: user.codechefProfile,
                  rating: ccData.rating || "N/A",
                  globalRank: ccData.global_rank || "N/A",
                });
                
                batchWiseData[batch].CodeChef.totalRating += ccData.rating;
                batchWiseData[batch].CodeChef.userCount++;
              }
            }
          })
        );
         // Calculate average ratings for each batch on each platform
         Object.keys(batchWiseData).forEach((batch) => {
          const platformData = batchWiseData[batch];
          platformData.Codeforces.avgRating =
            platformData.Codeforces.userCount > 0
              ? (platformData.Codeforces.totalRating / platformData.Codeforces.userCount).toFixed(2)
              : 0;
          platformData.LeetCode.avgRating =
            platformData.LeetCode.userCount > 0
              ? (platformData.LeetCode.totalRating / platformData.LeetCode.userCount).toFixed(2)
              : 0;
          platformData.LeetCode.avgSolved =
            platformData.LeetCode.userCount > 0
              ? (platformData.LeetCode.totalSolved / platformData.LeetCode.userCount).toFixed(2)
              : 0;
          platformData.CodeChef.avgRating =
            platformData.CodeChef.userCount > 0
              ? (platformData.CodeChef.totalRating / platformData.CodeChef.userCount).toFixed(2)
              : 0;
        });

        // Sort leaderboards by rating in descending order
        cfLeaderboard.sort((a, b) => b.rating - a.rating);
        lcLeaderboard.sort((a, b) => b.globalRanking - a.globalRanking);
        ccLeaderboard.sort((a, b) => b.rating - a.rating);

        setUserData(data.users);
        setBatchData(batchWiseData);
        setCodeforcesLeaderboard(cfLeaderboard);
        setLeetcodeLeaderboard(lcLeaderboard);
        setCodechefLeaderboard(ccLeaderboard);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false); // Stop loading after data is fetched
      }
    };

    fetchUsers();
  }, []);

  const filterData = (data) => {
    return data.filter((user) =>
      Object.values(user).some((val) =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  const columns = {
    codeforces: [
      { Header: "Name", accessor: "fullName" },
      { Header: "Admission Number", accessor: "admissionNumber" },
      { Header: "Profile", accessor: "codeforcesProfile" },
      { Header: "Rating", accessor: "rating" },
      { Header: "Rank", accessor: "rank" },
      { Header: "Latest Contest", accessor: "latestContest" },
      { Header: "Contest Rank", accessor: "contestRanking" },
    ],
    leetcode: [
      { Header: "Name", accessor: "fullName" },
      { Header: "Admission Number", accessor: "admissionNumber" },
      { Header: "Profile", accessor: "leetcodeProfile" },
      { Header: "Global Ranking", accessor: "globalRanking" },
      { Header:"Rating",accessor: "rating"},
      { Header: "Total Solved", accessor: "totalSolved" },
      {Header:"Contest Attended",accessor:"ContestAttended"},
    ],
    codechef: [
      { Header: "Name", accessor: "fullName" },
      { Header: "Admission Number", accessor: "admissionNumber" },
      { Header: "Profile", accessor: "codechefProfile" },
      { Header: "Rating", accessor: "rating" },
      { Header: "Global Rank", accessor: "globalRank" },
    ],
  };

  return (
    <div className="App text-gray-200 min-h-screen p-8">
      {loading ? (
        <div className="w-full h-screen flex justify-center items-center">
          <Loader />
        </div>
      ) : (
        <>
          <h1 className="mb-10 text-center text-4xl text-blue-400">
            User Report by Platform and Batch
          </h1>
          <CustomBarChart batchData={batchData}  />

          {/* Search Bar Component */}
          <SearchBar placeholder="Search..." onChange={setSearchTerm} />

          {/* Leaderboard Tables */}
          <h2 className="mt-12 text-3xl font-semibold text-blue-400">
            Codeforces Leaderboard
          </h2>
          <SortableTable
            columns={columns.codeforces}
            data={filterData(codeforcesLeaderboard)}
          />

          <h2 className="mt-12 text-3xl font-semibold text-blue-400">
            LeetCode Leaderboard
          </h2>
          <SortableTable
            columns={columns.leetcode}
            data={filterData(leetcodeLeaderboard)}
          />

          <h2 className="mt-12 text-3xl font-semibold text-blue-400">
            CodeChef Leaderboard
          </h2>
          <SortableTable
            columns={columns.codechef}
            data={filterData(codechefLeaderboard)}
          />
        </>
      )}
    </div>
  );
};

export default Cp;
