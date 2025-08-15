import React from "react";
import { FaFilter } from "react-icons/fa";
import SearchBar from "./SearchBar";
import { useState, useEffect, useCallback } from "react";

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

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    const hasParams = Array.from(params.entries()).length > 0;

    if (!hasParams) {
      // If no params, don't do anything
      return;
    }

    // Only update if these values are different from the current URL params
    const currentSearch = params.get("search") || "";
    const currentBranch = params.get("branch") || "all";
    const currentGrad = params.get("grad") || "all";
    const currentYear = params.get("year") || "all";
    const currentStatus = params.get("status") || "all";

    let hasChanges = false;

    if (searchTerm !== currentSearch) {
      if (searchTerm) params.set("search", searchTerm);
      else params.delete("search");
      hasChanges = true;
    }
    
    if (branchFilter !== currentBranch) {
      if (branchFilter !== "all") params.set("branch", branchFilter);
      else params.delete("branch");
      hasChanges = true;
    }
    
    if (gradFilter !== currentGrad) {
      if (gradFilter !== "all") params.set("grad", gradFilter);
      else params.delete("grad");
      hasChanges = true;
    }
    
    if (yearFilter !== currentYear) {
      if (yearFilter !== "all") params.set("year", yearFilter);
      else params.delete("year");
      hasChanges = true;
    }
    
    if (activeStatusFilter !== currentStatus) {
      if (activeStatusFilter !== "all") params.set("status", activeStatusFilter);
      else params.delete("status");
      hasChanges = true;
    }

    // Only update URL if there are actual changes
    if (hasChanges) {
      params.set('page', '1'); // Reset to first page when filters change
      setSearchParams(params, { replace: true });
    }
  }, [searchTerm, branchFilter, gradFilter, yearFilter, activeStatusFilter, searchParams, setSearchParams]);

  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
    const params = new URLSearchParams(searchParams);
    if (value.trim()) {
      params.set('search', value.trim());
      params.set('page', '1'); // Reset to first page when searching
    } else {
      params.delete('search');
    }
    setSearchParams(params, { replace: true }); // Using replace to prevent adding to history
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
              <label htmlFor="rankingScheme" className="text-white flex items-center gap-2">
                <select
                  id="rankingScheme"
                  value={rankingScheme}
                  onChange={(e) => {
                    const params = new URLSearchParams(searchParams);
                    params.set('rankingScheme', e.target.value);
                    params.set('page', '1'); // Reset to first page when changing ranking scheme
                    setSearchParams(params);
                    setRankingScheme(e.target.value);
                  }}
                  className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-white backdrop-blur-sm focus:border-blue-500 focus:outline-none"
                >
                  <option value="filtered" className="bg-slate-900">
                    Filtered Ranking
                  </option>
                  <option value="nexus" className="bg-slate-900">
                    Nexus Ranking
                  </option>
                </select>
              </label>
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
