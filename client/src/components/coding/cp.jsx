import React, { use, useEffect, useState } from "react";
import "tailwindcss/tailwind.css";
import CustomBarChart from "./BarChart";
import { BatchCard } from "./BatchCard";
import Loader from "../Loader/Loader"; // Assuming you have a Loader component
import UpcomingContests from "./UpcomingContests"; // Import the new component
import { useSearchParams } from "react-router-dom";
import increamentCounter from "../../libs/increamentCounter";
import MaintenancePage from "../Error/MaintenancePage";
import HeadTags from "../HeadTags/HeadTags";
import NoticeBar from "./NoticeBar";
import FilterSection from "./FilterSection";
import PlateformButtons from "./PlateformButtons";
import axios from "axios";
import SortableTable from "./SortedTable";
import RatingLegend from "./RatingLegend";

const Cp = () => {
  // Add new state for rank display preference

  const [searchParams, setSearchParams] = useSearchParams();
  const [batchData, setBatchData] = useState({});
  const [codeforcesLeaderboard, setCodeforcesLeaderboard] = useState([]);
  const [leetcodeLeaderboard, setLeetcodeLeaderboard] = useState([]);
  const [codechefLeaderboard, setCodechefLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false); // Loader state
  const [isError, setIsError] = useState(false);
  const [activePlatform, setActivePlatform] = useState(
    searchParams.get("platform") || "codeforces",
  );

  const handlePlatformChange = (platform) => {
    setActivePlatform(platform);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [cfResponse, lcResponse, ccResponse] = await Promise.all([
          axios.get(process.env.REACT_APP_BACKEND_BASE_URL+"/coding-profiles/get-profiles?platform=codeforces"),
          axios.get(process.env.REACT_APP_BACKEND_BASE_URL+"/coding-profiles/get-profiles?platform=leetcode"),
          axios.get(process.env.REACT_APP_BACKEND_BASE_URL+"/coding-profiles/get-profiles?platform=codechef"),
        ]);

        setCodeforcesLeaderboard(cfResponse?.data?.data);
        setLeetcodeLeaderboard(lcResponse?.data?.data);
        setCodechefLeaderboard(ccResponse?.data?.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    increamentCounter();
  }, []);

  if (isError) {
    return <MaintenancePage />;
  }

  const columns = {
    codeforces: [
      { Header: "Rank", accessor: "tableRank" }, // Changed to avoid confusion with CF rank
      { Header: "Name", accessor: "fullName" },
      { Header: "Admission Number", accessor: "admissionNo" },
      {
        Header: "Profile",
        accessor: "profileId",
        Cell: ({ value }) => (
          <a
            href={`https://codeforces.com/profile/${value}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 underline hover:text-blue-300"
          >
            Link
          </a>
        ),
      },
      { Header: "MaxRating", accessor: "maxRating" },
      { Header: "Rating", accessor: "rating" },
      { Header: "CF Rank", accessor: "rank" },
    ],
    leetcode: [
      { Header: "Rank", accessor: "tableRank" }, // Change to use pre-calculated rank
      { Header: "Name", accessor: "fullName" },
      { Header: "Admission Number", accessor: "admissionNo" },
      {
        Header: "Profile",
        accessor: "profileId",
        Cell: ({ value }) => (
          <a
            href={`https://leetcode.com/${value}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 underline hover:text-blue-300"
          >
            Link
          </a>
        ),
      },
      { Header: "Global Ranking", accessor: "globalRanking" },
      { Header: "Rating", accessor: "rating" },
      { Header: "Total Solved", accessor: "totalSolved" },
      { Header: "Contest Attended", accessor: "ContestAttended" },
    ],
    codechef: [
      { Header: "Rank", accessor: "tableRank" }, // Change to use pre-calculated rank
      { Header: "Name", accessor: "fullName" },
      { Header: "Admission Number", accessor: "admissionNo" },
      {
        Header: "Profile",
        accessor: "profileId",
        Cell: ({ value }) => (
          <a
            href={`https://www.codechef.com/users/${value}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 underline hover:text-blue-300"
          >
            Link
          </a>
        ),
      },
      { Header: "rating_number", accessor: "rating_number" },
      { Header: "Rating", accessor: "rating" },
      { Header: "Global Rank", accessor: "globalRank" },
    ],
  };

  return (
    <div className="App text-gray-200 min-h-screen py-8 md:mx-24">
      <HeadTags
        title={"Coding Profile LeaderBoard | Nexus - NIT Surat"}
        description={
          "Check out the LeaderBoard of Coding Profiles of different plateforms of students of CSE and AI at NIT Surat."
        }
        keywords={
          "Coding, Competitive Programming, CP, DSA, Data Structure, Algorithm, LeetCode, CodeForces, CodeChef, Coding Culture, Coding Contest, LeaderBoard, Coding Statistics, Placement, Internship"
        }
      />
      {loading ? (
        <div className="flex h-screen w-full items-center justify-center">
          <Loader />
        </div>
      ) : (
        <>
          <NoticeBar />
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

            <h1 className="mb-4 border-b border-blue-600 pb-2 text-3xl font-semibold  text-blue-400">
              Coding Profile Leaderboard
            </h1>

            {/* Search and Filter Controls */}
            <FilterSection activePlatform={activePlatform} searchParams={searchParams} setSearchParams={setSearchParams} />

            {/* Platform Toggle Buttons */}
            <PlateformButtons handlePlatformChange={handlePlatformChange} activePlatform={activePlatform} />

            Conditional Table Rendering
            {activePlatform === "codeforces" && (
              <>
                <RatingLegend platform="codeforces" />
                <SortableTable
                  columns={columns.codeforces}
                  data={codeforcesLeaderboard}
                />
              </>
            )}

            {activePlatform === "leetcode" && (
              <>
                <h2 className="mb-4 border-b border-blue-600 pb-2 text-3xl font-semibold text-blue-400">
                  LeetCode Leaderboard
                </h2>
                <RatingLegend platform="leetcode" />
                <SortableTable
                  columns={columns.leetcode}
                  data={leetcodeLeaderboard}
                />
              </>
            )}

            {activePlatform === "codechef" && (
              <>
                <h2 className="mb-4 border-b border-blue-600 pb-2 text-3xl font-semibold text-blue-400">
                  CodeChef Leaderboard
                </h2>
                <RatingLegend platform="codechef" />
                <SortableTable
                  columns={columns.codechef}
                  data={codechefLeaderboard}
                />
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Cp;
