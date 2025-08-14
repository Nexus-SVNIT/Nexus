import React from "react";
import { FaFilter } from "react-icons/fa";
import SearchBar from "./SearchBar";
import { useState, useEffect } from "react";

function FilterSection({activePlatform, searchParams, setSearchParams}) {
  const [showGlobalRank, setShowGlobalRank] = useState(
    searchParams.get("globalRank") === "true",
  );
  // Replace useState initializations with URL params
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || "",
  );
  
  const [gradFilter, setGradFilter] = useState(
    searchParams.get("grad") || "all",
  );
  const [branchFilter, setBranchFilter] = useState(
    searchParams.get("branch") || "all",
  );
  const [yearFilter, setYearFilter] = useState(
    searchParams.get("year") || "all",
  );
  const [activeStatusFilter, setActiveStatusFilter] = useState(
    searchParams.get("status") || "all",
  );
  const [tempGradFilter, setTempGradFilter] = useState(
    searchParams.get("grad") || "all",
  );
  const [tempBranchFilter, setTempBranchFilter] = useState(
    searchParams.get("branch") || "all",
  );
  const [tempYearFilter, setTempYearFilter] = useState(
    searchParams.get("year") || "all",
  );
  const [studentStatusFilter, setTempStudentStatusFilter] = useState(
    searchParams.get("status") || "all",
  );
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams();

    if (searchTerm) params.set("search", searchTerm);
    if (branchFilter !== "all") params.set("branch", branchFilter);
    if (gradFilter !== "all") params.set("grad", gradFilter);
    if (yearFilter !== "all") params.set("year", yearFilter);
    if (activeStatusFilter !== "all") params.set("status", activeStatusFilter);
    if (showGlobalRank) params.set("globalRank", "true");

    setSearchParams(params, { replace: true });
  }, [
    searchTerm,
    activePlatform,
    branchFilter,
    gradFilter,
    yearFilter,
    activeStatusFilter,
    showGlobalRank,
  ]);
  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };
  const handleApplyFilters = () => {
    setBranchFilter(tempBranchFilter);
    setYearFilter(tempYearFilter);
    setGradFilter(tempGradFilter);
    setActiveStatusFilter(studentStatusFilter);
  };

  const handleClearFilters = () => {
    setTempBranchFilter("all");
    setTempYearFilter("all");
    setTempGradFilter("all");
    setTempStudentStatusFilter("all");
    setBranchFilter("all");
    setYearFilter("all");
    setGradFilter("all");
    setActiveStatusFilter("all");
    setSearchTerm("");
    // Clear URL params
    setSearchParams({});
  };


  return (
    <div className="relative mb-6 mt-10">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-center justify-center gap-4 md:flex-row">
          <div className="w-full flex-1 md:max-w-fit">
            <SearchBar
              placeholder="Search..."
              onChange={handleSearchChange}
              initialValue={searchTerm}
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-colors ${
              showFilters
                ? "bg-blue-600 hover:bg-blue-500"
                : "bg-white/10 hover:bg-white/20"
            }`}
          >
            <FaFilter
              className={showFilters ? "text-white" : "text-gray-300"}
            />
            <span>Filters</span>
          </button>
        </div>

        {/* Filters Section */}
        <div
          className={`transition-all duration-300 ${
            showFilters
              ? "max-h-96 opacity-100"
              : "max-h-0 overflow-hidden opacity-0"
          }`}
        >
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <div className="flex flex-wrap gap-4">
              <select
                value={showGlobalRank ? "global" : "filtered"}
                onChange={(e) => setShowGlobalRank(e.target.value === "global")}
                className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-white backdrop-blur-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="global" className="bg-slate-900">
                  Nexus Ranking
                </option>
                <option value="filtered" className="bg-slate-900">
                  Filtered Ranking
                </option>
              </select>
              {/* ... existing filter selects ... */}
              <select
                value={tempBranchFilter}
                onChange={(e) => setTempBranchFilter(e.target.value)}
                className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-white backdrop-blur-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="all" className="bg-slate-900">
                  All Branches
                </option>
                <option value="CS" className="bg-slate-900">
                  CS/CO
                </option>
                <option value="AI" className="bg-slate-900">
                  AI
                </option>
                <option value="DS" className="bg-slate-900">
                  DS
                </option>
                <option value="IS" className="bg-slate-900">
                  IS
                </option>
              </select>

              <select
                value={tempGradFilter}
                onChange={(e) => setTempGradFilter(e.target.value)}
                className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-white backdrop-blur-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="all" className="bg-slate-900">
                  All Graduation Levels
                </option>
                <option value="U" className="bg-slate-900">
                  UG
                </option>
                <option value="P" className="bg-slate-900">
                  PG
                </option>
                <option value="D" className="bg-slate-900">
                  PhD
                </option>
              </select>

              <select
                value={tempYearFilter}
                onChange={(e) => setTempYearFilter(e.target.value)}
                className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-white backdrop-blur-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="all" className="bg-slate-900">
                  All Years
                </option>
                <option value="21" className="bg-slate-900">
                  2021
                </option>
                <option value="22" className="bg-slate-900">
                  2022
                </option>
                <option value="23" className="bg-slate-900">
                  2023
                </option>
                <option value="24" className="bg-slate-900">
                  2024
                </option>
              </select>

              <select
                value={studentStatusFilter}
                onChange={(e) => setTempStudentStatusFilter(e.target.value)}
                className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-white backdrop-blur-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="all" className="bg-slate-900">
                  All Students
                </option>
                <option value="current" className="bg-slate-900">
                  Current Students
                </option>
                <option value="alumni" className="bg-slate-900">
                  Alumni
                </option>
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleApplyFilters}
                className="rounded-lg bg-blue-600 px-4 py-2 transition-colors hover:bg-blue-500"
              >
                Apply Filters
              </button>
              <button
                onClick={handleClearFilters}
                className="rounded-lg bg-white/10 px-4 py-2 transition-colors hover:bg-white/20"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FilterSection;
