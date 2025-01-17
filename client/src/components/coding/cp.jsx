import React, { useEffect, useState } from "react";
import "tailwindcss/tailwind.css";
import SortableTable from "./SortedTable";
import SearchBar from "./SearchBar";
import CustomBarChart from "./BarChart";
import { BatchCard } from "./BatchCard";
import Loader from "../Loader/Loader"; // Assuming you have a Loader component
import UpcomingContests from "./UpcomingContests"; // Import the new component
import { FaInfoCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

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
        const batchWiseData = {};
        const cfLeaderboard = [];
        const lcLeaderboard = [];
        const ccLeaderboard = [];

        const localData = JSON.parse(localStorage.getItem('coding-profile-data'));
        if(localData && Date.now() - localData.lastUpdate < 1000 * 60 * 60 * 24){
          setBatchData(localData.batchData);
          setCodeforcesLeaderboard(localData.codeforcesLeaderboard);
          setLeetcodeLeaderboard(localData.leetcodeLeaderboard);
          setCodechefLeaderboard(localData.codechefLeaderboard);
          setLoading(false);
          return;
        }

        // Fetch platform-specific data
        const [cfProfiles, lcProfiles, ccProfiles] = await Promise.all([
          fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/coding-profiles/users/codeforces`).then(res => res.json()),
          fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/coding-profiles/users/leetcode`).then(res => res.json()),
          fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/coding-profiles/users/codechef`).then(res => res.json())
        ]);

        // Process Codeforces data
        cfProfiles.forEach(profile => {
          const batch = profile.admissionNumber.slice(1, 3);
          if (!batchWiseData[batch]) {
            batchWiseData[batch] = {
              Codeforces: { totalRating: 0, userCount: 0 },
              LeetCode: { totalRating: 0, totalSolved: 0, userCount: 0 },
              CodeChef: { totalRating: 0, userCount: 0 },
            };
          }

          const userInfo = profile.data[0]; // First object contains user info
          const contestInfo = profile.data[1]; // Second object contains contest info
          
          if (userInfo) {
            cfLeaderboard.push({
              fullName: profile.fullName,
              admissionNumber: profile.admissionNumber,
              codeforcesProfile: userInfo.handle,
              rating: userInfo.rating || 0,
              maxRating: userInfo.maxRating || 0,
              rank: userInfo.rank || "Unrated",
              latestContest: contestInfo?.ratings?.[contestInfo.ratings.length - 1]?.contestName || "No contests",
              contestRanking: contestInfo?.ratings?.[contestInfo.ratings.length - 1]?.rank || "N/A"
            });

            if (userInfo.rating) {
              batchWiseData[batch].Codeforces.totalRating += userInfo.rating;
              batchWiseData[batch].Codeforces.userCount++;
            }
          }
        });

        // Process LeetCode data
        lcProfiles.forEach(profile => {
          const batch = profile.admissionNumber.slice(1, 3);
          if (!batchWiseData[batch]) {
            batchWiseData[batch] = {
              Codeforces: { totalRating: 0, userCount: 0 },
              LeetCode: { totalRating: 0, totalSolved: 0, userCount: 0 },
              CodeChef: { totalRating: 0, userCount: 0 },
            };
          }

          const userData = profile.data.matchedUser;
          const contestData = profile.data.userContestRanking;
          
          if (userData) {
            const totalSolved = userData.submitStats?.acSubmissionNum[0]?.count || 0;
            
            lcLeaderboard.push({
              fullName: profile.fullName,
              admissionNumber: profile.admissionNumber,
              leetcodeProfile: userData.username,
              globalRanking: contestData?.globalRanking || "N/A",
              rating: contestData?.rating || 0,
              totalSolved: totalSolved,
              ContestAttended: contestData?.attendedContestsCount || 0
            });

            if (contestData?.rating) {
              batchWiseData[batch].LeetCode.totalRating += contestData.rating;
              batchWiseData[batch].LeetCode.totalSolved += totalSolved;
              batchWiseData[batch].LeetCode.userCount++;
            }
          }
        });

        // Process CodeChef data
        ccProfiles.forEach(profile => {
          const batch = profile.admissionNumber.slice(1, 3);
          if (!batchWiseData[batch]) {
            batchWiseData[batch] = {
              Codeforces: { totalRating: 0, userCount: 0 },
              LeetCode: { totalRating: 0, totalSolved: 0, userCount: 0 },
              CodeChef: { totalRating: 0, userCount: 0 },
            };
          }

          const profileData = profile.data;
          if (profileData && profileData.rating_number) {
            ccLeaderboard.push({
              fullName: profile.fullName,
              admissionNumber: profile.admissionNumber,
              codechefProfile: profileData.username,
              rating_number: profileData.rating_number || 0,
              rating: profileData.rating || "Unrated",
              globalRank: profileData.global_rank || "N/A"
            });

            batchWiseData[batch].CodeChef.totalRating += profileData.rating_number;
            batchWiseData[batch].CodeChef.userCount++;
          }
        });

        // Sort leaderboards by rating before setting state
        cfLeaderboard.sort((a, b) => b.rating - a.rating);
        lcLeaderboard.sort((a, b) => b.rating - a.rating);
        ccLeaderboard.sort((a, b) => b.rating_number - a.rating_number);

        // Calculate averages for each batch
        Object.keys(batchWiseData).forEach(batch => {
          const data = batchWiseData[batch];
          if (data.Codeforces.userCount > 0) {
            data.Codeforces.avgRating = (data.Codeforces.totalRating / data.Codeforces.userCount).toFixed(2);
          }
          if (data.LeetCode.userCount > 0) {
            data.LeetCode.avgRating = (data.LeetCode.totalRating / data.LeetCode.userCount).toFixed(2);
            data.LeetCode.avgSolved = (data.LeetCode.totalSolved / data.LeetCode.userCount).toFixed(2);
          }
          if (data.CodeChef.userCount > 0) {
            data.CodeChef.avgRating = (data.CodeChef.totalRating / data.CodeChef.userCount).toFixed(2);
          }
        });

        setBatchData(batchWiseData);
        setCodeforcesLeaderboard(cfLeaderboard);
        setLeetcodeLeaderboard(lcLeaderboard);
        setCodechefLeaderboard(ccLeaderboard);

        const dataToStore = {
          batchData: batchWiseData,
          codeforcesLeaderboard: cfLeaderboard,
          leetcodeLeaderboard: lcLeaderboard,
          codechefLeaderboard: ccLeaderboard,
          lastUpdate: Date.now(),
        };
        localStorage.setItem('coding-profile-data', JSON.stringify(dataToStore));
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filterData = (data) => {
    return data.filter((user) =>
      Object.values(user).some((val) =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    );
  };

  const columns = {
    codeforces: [
      { Header: "Name", accessor: "fullName" },
      { Header: "Admission Number", accessor: "admissionNumber" },
      { Header: "Profile", accessor: "codeforcesProfile" },
      { Header:"MaxRating",accessor:"maxRating"},
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
      { Header: "Rating", accessor: "rating" },
      { Header: "Total Solved", accessor: "totalSolved" },
      { Header: "Contest Attended", accessor: "ContestAttended" },
    ],
    codechef: [
      { Header: "Name", accessor: "fullName" },
      { Header: "Admission Number", accessor: "admissionNumber" },
      { Header: "Profile", accessor: "codechefProfile" },
      { Header: "rating_number", accessor: "rating_number" },
      { Header: "Rating", accessor: "rating" },
      { Header: "Global Rank", accessor: "globalRank" },
    ],
  };

  return (
    <div className="App text-gray-200 min-h-screen p-8">
      {loading ? (
        <div className="flex h-screen w-full items-center justify-center">
          <Loader />
        </div>
      ) : (
        <>
          <div className="mx-2 flex w-fit items-center justify-center gap-3 rounded-md bg-yellow-400/25 p-2 px-4 md:mx-auto ">
            <FaInfoCircle size={42} className="h-auto text-yellow-500" />
            <p className="w-[90%] text-xs text-white/80 md:w-full md:text-base">
              If you registered but did not get your coding profile data here in leaderboard, then go to 
              <Link
                to="/profile"
                className="mx-1 font-bold text-blue-500  underline underline-offset-4"
              >
                Profile Page
              </Link>
              and turn on "Share Your Coding Profile" feature.
            </p>
          </div>
          <div className="bg-gray-800 mt-12 rounded-lg p-6 pt-0 shadow-lg">
            {/* Upcoming Contests Component */}
            <UpcomingContests />
            <h2 className="mb-4 border-b border-blue-600 pb-2 text-3xl font-semibold text-blue-400">
              User Report by Platform and Batch
            </h2>
            <CustomBarChart batchData={batchData} />

            {/* Render Batch Data */}
            <div className="mb-8 mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {Object.keys(batchData).map((batch) => (
                <BatchCard
                  key={batch}
                  batch={batch}
                  avgCodeforcesRating={batchData[batch].Codeforces.avgRating}
                  avgLeetcodeRating={batchData[batch].LeetCode.avgRating}
                  avgLeetcodeSolved={batchData[batch].LeetCode.avgSolved}
                  avgCodechefRating={batchData[batch].CodeChef.avgRating}
                />
              ))}
            </div>

            <h1 className="mb-4 border-b border-blue-600 pb-2 text-center text-3xl font-semibold  text-blue-400">
              Coding Profile Leaderboard
            </h1>

            {/* Search Bar Component */}
            <div className="mb-10 mt-10">
              <SearchBar placeholder="Search..." onChange={setSearchTerm} />
            </div>

            {/* Leaderboard Tables */}
            <h2 className="mb-4 border-b border-blue-600 pb-2 text-3xl font-semibold text-blue-400">
              Codeforces Leaderboard
            </h2>
            <SortableTable
              columns={columns.codeforces}
              data={filterData(codeforcesLeaderboard)}
            />

            <h2 className="mb-4 border-b border-blue-600 pb-2 text-3xl font-semibold text-blue-400">
              LeetCode Leaderboard
            </h2>
            <SortableTable
              columns={columns.leetcode}
              data={filterData(leetcodeLeaderboard)}
            />

            <h2 className="mb-4 border-b border-blue-600 pb-2 text-3xl font-semibold text-blue-400">
              CodeChef Leaderboard
            </h2>
            <SortableTable
              columns={columns.codechef}
              data={filterData(codechefLeaderboard)}
            />
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="App text-gray-200 min-h-screen p-8">
      <div className="flex h-screen w-full items-center justify-center">
        This Page currently is Under Maintanance.
      </div>
    </div>
  )
};

export default Cp;
