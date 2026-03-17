import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import InterviewPostCard from "./InterviewPostCard";
import { FaPenToSquare } from "react-icons/fa6";
import { FaFilter, FaChevronUp, FaChevronDown } from "react-icons/fa";
import increamentCounter from "../../libs/increamentCounter";
import MaintenancePage from "../Error/MaintenancePage";
import CompanyAIChatBox from "./CompanyAIChatBox";
import HeadTags from "../HeadTags/HeadTags";

const InterviewExperiencePage = () => {
  const [posts, setPosts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [tags, setTags] = useState([]);
  const [locations, setLocations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const [isError, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const [formState, setFormState] = useState({
    companyFilter: "",
    tagFilter: "",
    admissionFilter: "",
    startDate: "",
    endDate: "",
    campusTypeFilter: "",
    jobTypeFilter: "",
    minStipendFilter: "",
    maxStipendFilter: "",
    locationFilter: "",
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // New function to sync form state to URL
  const updateURLParams = (newFormState) => {
    const params = new URLSearchParams();
    Object.entries(newFormState).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    setSearchParams(params);
  };

  // New function to load filters from URL
  const loadFiltersFromURL = () => {
    const params = Object.fromEntries(searchParams.entries());
    const initialState = {
      companyFilter: params.companyFilter || "",
      tagFilter: params.tagFilter || "",
      admissionFilter: params.admissionFilter || "",
      startDate: params.startDate || "",
      endDate: params.endDate || "",
      campusTypeFilter: params.campusTypeFilter || "",
      jobTypeFilter: params.jobTypeFilter || "",
      minStipendFilter: params.minStipendFilter || "",
      maxStipendFilter: params.maxStipendFilter || "",
      locationFilter: params.locationFilter || "",
    };
    setFormState(initialState);
    
    // Apply filters if any params exist
    if (Object.values(params).some(value => value)) {
      fetchPosts(params);
    }
  };

  // Load saved form state from localStorage on component mount
  useEffect(() => {
    const savedFormState = JSON.parse(localStorage.getItem("formState")) || {};
    setFormState(savedFormState);
  }, []);

  // Save form state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("formState", JSON.stringify(formState));
  }, [formState]);

  const fetchPosts = async (filters = {}) => {
    try {
      toast.loading("Loading posts...");
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/posts`,
        {
          params: {
            companyName: filters.companyName || "",
            tag: filters.tag || "",
            admissionNumber: filters.admissionNumber || "",
            startDate: filters.startDate || "",
            endDate: filters.endDate || "",
            campusType: filters.campusType || "",
            jobType: filters.jobType || "",
            minStipend: filters.minStipend || "",
            maxStipend: filters.maxStipend || "",
            location: filters.location || "",
            page: currentPage,
            limit: pageLimit,
          },
        }
      );
      
      setPosts(response.data.posts);
      setTotalPages(response.data.totalPages);
      const uniqueCompanies = [
        ...new Set(response.data.posts.map((p) => p.company)),
      ]
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b));

      const uniqueTags = [
        ...new Set(response.data.posts.flatMap((p) => p.tags)),
      ]
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b));

      const uniqueLocations = [
        ...new Set(response.data.posts.flatMap((p) => p.location)),
      ]
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b));

      setCompanies(uniqueCompanies);
      setTags(uniqueTags);
      setLocations(uniqueLocations);
      toast.dismiss();
      toast.success("Posts loaded successfully!");
    } catch (error) {
      setError(error);
      toast.dismiss();
      toast.error("Error fetching posts.");
      console.error("Error fetching posts:", error.response?.data || error);
    }
  };

  // Fetch all posts on component mount
  useEffect(() => {
    fetchPosts();
  }, [currentPage, pageLimit]);

  useEffect(() => {
    increamentCounter();
  }, []);

  // Modified handleFilterChange to update URL
  const handleFilterChange = (key, value) => {
    const newFormState = {
      ...formState,
      [key]: value,
    };
    setFormState(newFormState);
    updateURLParams(newFormState);
  };

  const handleFilter = () => {
    fetchPosts({
      companyName: formState.companyFilter,
      tag: formState.tagFilter,
      admissionNumber: formState.admissionFilter,
      startDate: formState.startDate,
      endDate: formState.endDate,
      campusType: formState.campusTypeFilter,
      jobType: formState.jobTypeFilter,
      minStipend: formState.minStipendFilter,
      maxStipend: formState.maxStipendFilter,
      location: formState.locationFilter,
    });
  };

  // Modified handleClearFilters to clear URL
  const handleClearFilters = () => {
    const emptyState = {
      companyFilter: "",
      tagFilter: "",
      admissionFilter: "",
      startDate: "",
      endDate: "",
      campusTypeFilter: "",
      jobTypeFilter: "",
      minStipendFilter: "",
      maxStipendFilter: "",
      locationFilter: "",
    };
    setFormState(emptyState);
    setSearchParams(new URLSearchParams());
    fetchPosts({});
  };

  // Modified handleCompanyClick and handleTagClick
  const handleCompanyClick = (companyName) => {
    const newState = { ...formState, companyFilter: companyName };
    setFormState(newState);
    updateURLParams(newState);
    fetchPosts({ companyName, tag: formState.tagFilter });
  };

  const handleTagClick = (tag) => {
    const newState = { ...formState, tagFilter: tag };
    setFormState(newState);
    updateURLParams(newState);
    fetchPosts({ companyName: formState.companyFilter, tag });
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (isError) {
    return <MaintenancePage />;
  }

  return (
    <div className="bg-[#000000] mb-36 min-h-screen p-4 sm:p-6 md:mx-auto md:max-w-7xl">
      <HeadTags
        title={"Interview Experiences | NIT Surat"}
        description={
          "Read and share interview experiences of students from NIT Surat. Get insights into the recruitment process, questions asked, and more."
        }
        keywords={
          "interview experiences, nit surat, placements, campus placements, job interviews, recruitment process, on-campus, off-campus, pool campus, nit surat students, cdc, tnp, training and placement cell"
        }
      />

      {/* Hero Section */}
      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-4 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-400">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Placements & Internships
          </div>
          <h1 className="text-4xl font-bold text-white md:text-5xl">
            Interview
            <span className="inline-block bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent ml-2">
              Experiences
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-400">
            Read real stories, questions, and insights from NIT Surat students navigating placements and internships. Learn from their experiences to ace yours.
          </p>
        </div>
      </div>

      {/* Controls Row */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4 bg-zinc-900/40 p-3 rounded-2xl border border-zinc-800/50 backdrop-blur-sm">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 rounded-xl px-5 py-2.5 font-medium transition-all duration-300 ${
            showFilters 
            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]' 
            : 'bg-zinc-800/50 text-gray-300 border border-zinc-700/50 hover:bg-zinc-800 hover:text-white'
          }`}
        >
          <FaFilter className={`${showFilters ? 'text-blue-400' : 'text-gray-400'}`} />
          <span>Filters</span>
          {showFilters ? <FaChevronUp className="ml-1 text-xs" /> : <FaChevronDown className="ml-1 text-xs" />}
        </button>
        <Link
          to="/interview-experiences/create"
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 px-5 py-2.5 font-medium text-white shadow-lg shadow-green-500/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-green-500/30"
        >
          <FaPenToSquare />
          Share Experience
        </Link>
      </div>

      {/* Filters Section */}
      <div 
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          showFilters ? 'max-h-[1000px] opacity-100 mb-8' : 'max-h-0 opacity-0 mb-0'
        }`}
      >
        <div className="flex flex-col flex-wrap gap-4 rounded-2xl border border-zinc-800/60 bg-zinc-900/50 p-6 backdrop-blur-md shadow-xl sm:flex-row">
          <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {/* Filter controls */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider pl-1">Company</label>
              <select
                value={formState.companyFilter}
                onChange={(e) =>
                  handleFilterChange("companyFilter", e.target.value)
                }
                className="w-full rounded-xl border border-zinc-700/50 bg-zinc-800/80 px-4 py-2.5 text-sm text-gray-200 transition-colors focus:border-blue-500/50 focus:bg-zinc-800 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
              >
                <option value="">All Companies</option>
                {companies.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider pl-1">Tags</label>
              <select
                value={formState.tagFilter}
                onChange={(e) => handleFilterChange("tagFilter", e.target.value)}
                className="w-full rounded-xl border border-zinc-700/50 bg-zinc-800/80 px-4 py-2.5 text-sm text-gray-200 transition-colors focus:border-blue-500/50 focus:bg-zinc-800 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
              >
                <option value="">All Tags</option>
                {tags.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider pl-1">Admission No</label>
              <input
                type="text"
                placeholder="U2XX..."
                value={formState.admissionFilter}
                onChange={(e) =>
                  handleFilterChange("admissionFilter", e.target.value)
                }
                className="w-full rounded-xl border border-zinc-700/50 bg-zinc-800/80 px-4 py-2.5 text-sm text-gray-200 placeholder-zinc-500 transition-colors focus:border-blue-500/50 focus:bg-zinc-800 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
              />
            </div>

            <div className="flex flex-col gap-1.5 lg:col-span-2 xl:col-span-1">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider pl-1">Date Range</label>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={formState.startDate}
                  onChange={(e) => handleFilterChange("startDate", e.target.value)}
                  className="w-full rounded-xl border border-zinc-700/50 bg-zinc-800/80 px-3 py-2.5 text-sm text-gray-200 transition-colors focus:border-blue-500/50 focus:bg-zinc-800 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                  style={{ colorScheme: "dark" }}
                />
                <span className="text-zinc-600 font-medium px-1">-</span>
                <input
                  type="date"
                  value={formState.endDate}
                  onChange={(e) => handleFilterChange("endDate", e.target.value)}
                  className="w-full rounded-xl border border-zinc-700/50 bg-zinc-800/80 px-3 py-2.5 text-sm text-gray-200 transition-colors focus:border-blue-500/50 focus:bg-zinc-800 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                  style={{ colorScheme: "dark" }}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider pl-1">Campus Type</label>
              <select
                value={formState.campusTypeFilter}
                onChange={(e) =>
                  handleFilterChange("campusTypeFilter", e.target.value)
                }
                className="w-full rounded-xl border border-zinc-700/50 bg-zinc-800/80 px-4 py-2.5 text-sm text-gray-200 transition-colors focus:border-blue-500/50 focus:bg-zinc-800 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
              >
                <option value="">All Types</option>
                <option value="On Campus">On Campus</option>
                <option value="Off Campus">Off Campus</option>
                <option value="Pool Campus">Pool Campus</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider pl-1">Job Type</label>
              <select
                value={formState.jobTypeFilter}
                onChange={(e) =>
                  handleFilterChange("jobTypeFilter", e.target.value)
                }
                className="w-full rounded-xl border border-zinc-700/50 bg-zinc-800/80 px-4 py-2.5 text-sm text-gray-200 transition-colors focus:border-blue-500/50 focus:bg-zinc-800 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
              >
                <option value="">All Job Types</option>
                <option value="2 Month Internship">2 Month Internship</option>
                <option value="6 Month Internship">6 Month Internship</option>
                <option value="Full Time">Full Time</option>
                <option value="6 Month Internship + Full Time">Internship + Full Time</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5 lg:col-span-2 xl:col-span-1">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider pl-1">Stipend (Monthly)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min ₹"
                  value={formState.minStipendFilter}
                  onChange={(e) =>
                    handleFilterChange("minStipendFilter", e.target.value)
                  }
                  className="w-full rounded-xl border border-zinc-700/50 bg-zinc-800/80 px-4 py-2.5 text-sm text-gray-200 placeholder-zinc-500 transition-colors focus:border-blue-500/50 focus:bg-zinc-800 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                />
                <span className="text-zinc-600 font-medium px-1">-</span>
                <input
                  type="number"
                  placeholder="Max ₹"
                  value={formState.maxStipendFilter}
                  onChange={(e) =>
                    handleFilterChange("maxStipendFilter", e.target.value)
                  }
                  className="w-full rounded-xl border border-zinc-700/50 bg-zinc-800/80 px-4 py-2.5 text-sm text-gray-200 placeholder-zinc-500 transition-colors focus:border-blue-500/50 focus:bg-zinc-800 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider pl-1">Location</label>
              <select
                value={formState.locationFilter}
                onChange={(e) =>
                  handleFilterChange("locationFilter", e.target.value)
                }
                className="w-full rounded-xl border border-zinc-700/50 bg-zinc-800/80 px-4 py-2.5 text-sm text-gray-200 transition-colors focus:border-blue-500/50 focus:bg-zinc-800 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
              >
                <option value="">All Locations</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5 sm:col-span-2 lg:col-span-1 xl:col-span-4 flex-row items-end justify-between border-t border-zinc-800 pt-4 mt-2">
              <div className="flex items-center gap-3">
                <select
                  value={pageLimit}
                  onChange={(e) => {
                    setCurrentPage(1);
                    setPageLimit(parseInt(e.target.value, 10));
                  }}
                  className="rounded-xl border border-zinc-700/50 bg-zinc-800/80 px-4 py-2 text-sm text-gray-200 focus:border-blue-500/50 focus:bg-zinc-800 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                >
                  <option value={10}>10 per page</option>
                  <option value={20}>20 per page</option>
                  <option value={30}>30 per page</option>
                  <option value={50}>50 per page</option>
                </select>
                <span className="text-xs text-zinc-500">Results per page</span>
              </div>
              
              <div className="flex gap-3">
                {(formState.companyFilter ||
                  formState.tagFilter ||
                  formState.admissionFilter ||
                  formState.startDate ||
                  formState.endDate ||
                  formState.campusTypeFilter ||
                  formState.jobTypeFilter ||
                  formState.minStipendFilter ||
                  formState.maxStipendFilter ||
                  formState.locationFilter) && (
                  <button
                    onClick={handleClearFilters}
                    className="rounded-xl bg-red-500/10 border border-red-500/20 px-6 py-2.5 text-sm font-medium text-red-500 transition-all hover:bg-red-500/20 hover:border-red-500/30"
                  >
                    Clear Filters
                  </button>
                )}
                <button
                  onClick={handleFilter}
                  className="rounded-xl bg-blue-600 hover:bg-blue-500 px-8 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-500/20 transition-all hover:shadow-blue-500/30"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

     <CompanyAIChatBox companies={companies} defaultCompany={formState.companyFilter} /> 
     <div className="mb-8"></div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {posts.length === 0 ? (
          <p className="text-gray-400">
            No posts available. Be the first to share your experience!
          </p>
        ) : (
          posts.map((post) => (
            <InterviewPostCard
              key={post._id}
              post={post}
              handleCompanyClick={handleCompanyClick}
              handleTagClick={handleTagClick}
            />
          ))
        )}
      </div>

      {/* Pagination Controls */}
      <div className="mt-16 flex items-center justify-center gap-3">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="flex items-center justify-center rounded-xl bg-zinc-800/80 border border-zinc-700/50 px-4 py-2.5 text-sm font-medium text-gray-300 transition-all hover:bg-zinc-700 hover:text-white disabled:pointer-events-none disabled:opacity-50"
        >
          Previous
        </button>
        <div className="flex items-center justify-center rounded-xl bg-zinc-900/60 border border-zinc-800 px-5 py-2.5 text-sm font-medium text-gray-400">
          Page <span className="text-white mx-1">{currentPage}</span> of <span className="text-white mx-1">{totalPages}</span>
        </div>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="flex items-center justify-center rounded-xl bg-zinc-800/80 border border-zinc-700/50 px-4 py-2.5 text-sm font-medium text-gray-300 transition-all hover:bg-zinc-700 hover:text-white disabled:pointer-events-none disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default InterviewExperiencePage;
