import React from "react";
import { FaFilter } from "react-icons/fa";
import SearchBar from "./SearchBar";
import { useState, useCallback } from "react";

function FilterSection({activePlatform, searchParams, setSearchParams}) {
  const [rankingScheme, setRankingScheme] = useState(
    searchParams.get("rankingScheme") || "filtered",
  );
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

  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
    const params = new URLSearchParams(searchParams);
    if (value.trim()) {
      params.set('search', value.trim());
      params.set('page', '1');
    } else {
      params.delete('search');
      params.set('page', '1');
    }
    setSearchParams(params, { replace: true });
  }, [searchParams, setSearchParams]);

  const handleApplyFilters = () => {
    const params = new URLSearchParams(searchParams);
    
    // Update params with new filter values
    params.set('page', '1'); // Reset to first page when applying filters
    if (tempGradFilter !== 'all') params.set('program', tempGradFilter);
    else params.delete('program');
    
    if (tempBranchFilter !== 'all') params.set('branch', tempBranchFilter);
    else params.delete('branch');
    
    if (tempYearFilter !== 'all') params.set('year', tempYearFilter);
    else params.delete('year');
    
    if (studentStatusFilter !== 'all') params.set('status', studentStatusFilter);
    else params.delete('status');
    
    // Update state and URL params
    setGradFilter(tempGradFilter);
    setBranchFilter(tempBranchFilter);
    setYearFilter(tempYearFilter);
    setActiveStatusFilter(studentStatusFilter);
    setShowFilters(false);
    
    setSearchParams(params);
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

  const activeFilterCount = [
    rankingScheme !== "filtered",
    branchFilter !== "all",
    gradFilter !== "all",
    yearFilter !== "all",
    activeStatusFilter !== "all",
  ].filter(Boolean).length;

  return (
    <div className="relative mb-8 w-full max-w-5xl">
      <div className="flex flex-col justify-center gap-4">
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <div className="w-full max-w-md">
            <SearchBar
              placeholder="Search Profiles..."
              onChange={handleSearchChange}
              initialValue={searchTerm}
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 rounded-xl border px-5 py-2.5 font-medium transition-all duration-300 ${
              showFilters
                ? "border-blue-500 bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] backdrop-blur-md"
                : "border-white/10 bg-white/5 text-gray-300 backdrop-blur-md hover:bg-white/10 hover:text-white"
            }`}
          >
            <FaFilter
              className={`transition-colors duration-300 ${showFilters ? "text-white" : "text-gray-400"}`}
            />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-[11px] font-bold text-white shadow-sm">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Collapsible Filters Card */}
        <div
          className={`transition-all duration-300 ease-in-out ${
            showFilters
              ? "max-h-[600px] opacity-100"
              : "max-h-0 overflow-hidden opacity-0 pointer-events-none"
          }`}
        >
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/75 p-5 shadow-2xl backdrop-blur-xl sm:p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {/* Ranking Scheme */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="rankingScheme" className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Ranking Scheme
                </label>
                <select
                  id="rankingScheme"
                  value={rankingScheme}
                  onChange={(e) => {
                    const params = new URLSearchParams(searchParams);
                    params.set('rankingScheme', e.target.value);
                    params.set('page', '1');
                    setSearchParams(params);
                    setRankingScheme(e.target.value);
                  }}
                  className="rounded-xl border border-zinc-700/60 bg-zinc-800/80 px-3.5 py-2 text-sm text-zinc-200 outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50"
                >
                  <option value="filtered" className="bg-zinc-900">
                    Filtered Ranking
                  </option>
                  <option value="nexus" className="bg-zinc-900">
                    Nexus Ranking
                  </option>
                </select>
              </div>

              {/* Branch */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="branchFilter" className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Branch
                </label>
                <select
                  id="branchFilter"
                  value={tempBranchFilter}
                  onChange={(e) => setTempBranchFilter(e.target.value)}
                  className="rounded-xl border border-zinc-700/60 bg-zinc-800/80 px-3.5 py-2 text-sm text-zinc-200 outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50"
                >
                  <option value="all" className="bg-zinc-900">All Branches</option>
                  <option value="CS" className="bg-zinc-900">CS/CO</option>
                  <option value="AI" className="bg-zinc-900">AI</option>
                  <option value="DS" className="bg-zinc-900">DS</option>
                  <option value="IS" className="bg-zinc-900">IS</option>
                </select>
              </div>

              {/* Graduation Level */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="gradFilter" className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Program
                </label>
                <select
                  id="gradFilter"
                  value={tempGradFilter}
                  onChange={(e) => setTempGradFilter(e.target.value)}
                  className="rounded-xl border border-zinc-700/60 bg-zinc-800/80 px-3.5 py-2 text-sm text-zinc-200 outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50"
                >
                  <option value="all" className="bg-zinc-900">All Programs</option>
                  <option value="U" className="bg-zinc-900">UG</option>
                  <option value="P" className="bg-zinc-900">PG</option>
                  <option value="D" className="bg-zinc-900">PhD</option>
                </select>
              </div>

              {/* Year */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="yearFilter" className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Batch Year
                </label>
                <select
                  id="yearFilter"
                  value={tempYearFilter}
                  onChange={(e) => setTempYearFilter(e.target.value)}
                  className="rounded-xl border border-zinc-700/60 bg-zinc-800/80 px-3.5 py-2 text-sm text-zinc-200 outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50"
                >
                  <option value="all" className="bg-zinc-900">All Years</option>
                  <option value="21" className="bg-zinc-900">2021</option>
                  <option value="22" className="bg-zinc-900">2022</option>
                  <option value="23" className="bg-zinc-900">2023</option>
                  <option value="24" className="bg-zinc-900">2024</option>
                  <option value="25" className="bg-zinc-900">2025</option>
                  <option value="26" className="bg-zinc-900">2026</option>
                </select>
              </div>

              {/* Status */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="statusFilter" className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Student Status
                </label>
                <select
                  id="statusFilter"
                  value={studentStatusFilter}
                  onChange={(e) => setTempStudentStatusFilter(e.target.value)}
                  className="rounded-xl border border-zinc-700/60 bg-zinc-800/80 px-3.5 py-2 text-sm text-zinc-200 outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50"
                >
                  <option value="all" className="bg-zinc-900">All Students</option>
                  <option value="current" className="bg-zinc-900">Current Students</option>
                  <option value="alumni" className="bg-zinc-900">Alumni</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-5 flex items-center justify-end gap-3 border-t border-zinc-800/70 pt-4">
              <button
                onClick={handleClearFilters}
                className="rounded-xl border border-zinc-700/60 bg-zinc-800/50 px-5 py-2 text-sm font-medium text-zinc-300 transition-all hover:bg-zinc-700/50 hover:text-white"
              >
                Clear Filters
              </button>
              <button
                onClick={handleApplyFilters}
                className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all hover:bg-blue-500"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FilterSection;
