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
import { getProfiles } from "../../services/codingService";

const Cp = () => {
  // Add new state for rank display preference

  const [searchParams, setSearchParams] = useSearchParams();
  const [batchData, setBatchData] = useState({});
  const [codeforcesLeaderboard, setCodeforcesLeaderboard] = useState([]);
  const [leetcodeLeaderboard, setLeetcodeLeaderboard] = useState([]);
  const [codechefLeaderboard, setCodechefLeaderboard] = useState([]);
  const [githubLeaderboard, setGithubLeaderboard] = useState([]);
  const [totalProfiles, setTotalProfiles] = useState(0);
  const [loading, setLoading] = useState(false); // Loader state
  const [isError, setIsError] = useState(false);
  const [activePlatform, setActivePlatform] = useState(
    searchParams.get("platform") || "codeforces",
  );

  const handlePlatformChange = (platform) => {
    // Update the URL with the new platform and reset to page 1
    const params = new URLSearchParams(searchParams);
    params.set("platform", platform);
    params.set("page", "1");
    setSearchParams(params);
    setActivePlatform(platform);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setIsError(false);
      try {
        const params = new URLSearchParams(searchParams);

        // Always include platform
        if (!params.has("platform")) {
          params.set("platform", activePlatform);
        }

        // Set default values for pagination if not present
        if (!params.has("page")) params.set("page", "1");
        if (!params.has("limit")) params.set("limit", "10");

        // Set default sorting if not present
        if (!params.has("sortBy")) {
          params.set("sortBy", "sortingKey");
        }
        if (!params.has("sortOrder")) {
          params.set("sortOrder", "desc");
        }

        // Make the API call
        const response = await getProfiles(params);

        if (!response.success) {
          throw new Error(response.message || "Failed to fetch data");
        }

        const { data, totalProfiles } = response.data;
        setTotalProfiles(totalProfiles || data.length);

        // Update the appropriate leaderboard based on platform
        const currentPlatform = params.get("platform") || activePlatform;
        switch (currentPlatform) {
          case "codeforces":
            setCodeforcesLeaderboard(data);
            setLeetcodeLeaderboard([]);
            setCodechefLeaderboard([]);
            setGithubLeaderboard([]);
            break;
          case "leetcode":
            setLeetcodeLeaderboard(data);
            setCodeforcesLeaderboard([]);
            setCodechefLeaderboard([]);
            setGithubLeaderboard([]);
            break;
          case "codechef":
            setCodechefLeaderboard(data);
            setCodeforcesLeaderboard([]);
            setLeetcodeLeaderboard([]);
            setGithubLeaderboard([]);
            break;
          case "github":
            setGithubLeaderboard(data);
            setCodeforcesLeaderboard([]);
            setLeetcodeLeaderboard([]);
            setCodechefLeaderboard([]);
            break;
          default:
            break;
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsError(true);
      } finally {
        setLoading(false);
      }
    };

    // Call fetchData whenever URL parameters change
    fetchData();
  }, [searchParams, activePlatform]); // Add all dependencies that should trigger a refetch

  if (isError) {
    return <MaintenancePage />;
  }

  const rankingScheme = searchParams.get("rankingScheme") || "filtered";

  const columns = {
    codeforces: [
      {
        Header: "Rank",
        accessor: rankingScheme === "nexus" ? "nexusRank" : "tableRank",
        disableSortBy: rankingScheme !== "nexus",
      },
      { Header: "Name", accessor: "fullName" },
      { Header: "Admission Number", accessor: "admissionNo" },
      {
        Header: "Profile",
        accessor: "profileId",
        disableSortBy: true,
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
      {
        Header: "Rank",
        accessor: rankingScheme === "nexus" ? "nexusRank" : "tableRank",
        disableSortBy: rankingScheme !== "nexus",
      },
      { Header: "Name", accessor: "fullName" },
      { Header: "Admission Number", accessor: "admissionNo" },
      {
        Header: "Profile",
        accessor: "profileId",
        disableSortBy: true,
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
      { Header: "Contest Attended", accessor: "attendedContestsCount" },
    ],
    codechef: [
      {
        Header: "Rank",
        accessor: rankingScheme === "nexus" ? "nexusRank" : "tableRank",
        disableSortBy: rankingScheme !== "nexus",
      },
      { Header: "Name", accessor: "fullName" },
      { Header: "Admission Number", accessor: "admissionNo" },
      {
        Header: "Profile",
        accessor: "profileId",
        disableSortBy: true,
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
    github: [
      {
        Header: "Rank",
        accessor: rankingScheme === "nexus" ? "nexusRank" : "tableRank",
        disableSortBy: rankingScheme !== "nexus",
      },
      { Header: "Name", accessor: "fullName" },
      { Header: "Admission Number", accessor: "admissionNo" },
      {
        Header: "Profile",
        accessor: "profileId",
        disableSortBy: true,
        Cell: ({ value }) => (
          <a
            href={`https://github.com/${value}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 underline hover:text-blue-300"
          >
            @{value}
          </a>
        ),
      },
      { Header: "Contributions", accessor: "totalContributions" },
      { Header: "Commits", accessor: "commits" },
      { Header: "PRs", accessor: "prs" },
      { Header: "Issues", accessor: "issues" },
      { Header: "Repos", accessor: "publicRepos" },
      { Header: "Stars ⭐", accessor: "stars" },
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
          "Coding, Competitive Programming, CP, DSA, Data Structure, Algorithm, LeetCode, CodeForces, CodeChef, GitHub, Open Source, Coding Culture, Coding Contest, LeaderBoard, Coding Statistics, Placement, Internship"
        }
      />
        <div className="w-full flex flex-col gap-8 max-w-[90rem] mx-auto px-4 md:px-0">
          <NoticeBar />
          <div className="w-full flex flex-col gap-6">
            {/* Upcoming Contests Component */}
            <UpcomingContests />

            {/* Centered Tab-styled Platform Toggle */}
            <PlateformButtons
              handlePlatformChange={handlePlatformChange}
              activePlatform={activePlatform}
            />

            {/* Centered Filter Section */}
            <div className="flex w-full justify-center flex-col items-center gap-0">
              <FilterSection
                activePlatform={activePlatform}
                searchParams={searchParams}
                setSearchParams={setSearchParams}
              />
              {/* Thin loading bar — non-disruptive, replaces full overlay */}
              <div className="w-full max-w-4xl h-0.5 rounded-full overflow-hidden bg-transparent">
                {loading && (
                  <div className="h-full w-1/3 rounded-full bg-blue-500 animate-loading-bar" />
                )}
              </div>
            </div>

            {/* Table area — always visible, updates silently */}
            <div>

              {activePlatform === "codeforces" && (
                <>
                  <RatingLegend platform="codeforces" />
                  <SortableTable
                    columns={columns.codeforces}
                    data={codeforcesLeaderboard}
                    searchParams={searchParams}
                    setSearchParams={setSearchParams}
                    totalProfiles={totalProfiles}
                  />
                </>
              )}

              {activePlatform === "leetcode" && (
                <>
                  <RatingLegend platform="leetcode" />
                  <SortableTable
                    columns={columns.leetcode}
                    data={leetcodeLeaderboard}
                    searchParams={searchParams}
                    setSearchParams={setSearchParams}
                    totalProfiles={totalProfiles}
                  />
                </>
              )}

              {activePlatform === "codechef" && (
                <>
                  <RatingLegend platform="codechef" />
                  <SortableTable
                    columns={columns.codechef}
                    data={codechefLeaderboard}
                    searchParams={searchParams}
                    setSearchParams={setSearchParams}
                    totalProfiles={totalProfiles}
                  />
                </>
              )}

              {activePlatform === "github" && (
                <>
                  <RatingLegend platform="github" />
                  <SortableTable
                    columns={columns.github}
                    data={githubLeaderboard}
                    searchParams={searchParams}
                    setSearchParams={setSearchParams}
                    totalProfiles={totalProfiles}
                  />
                </>
              )}
            </div>
          </div>
        </div>
    </div>
  );

};

export default Cp;
