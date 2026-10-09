import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import InterviewPostCard from "./InterviewPostCard";
import InterviewPostCardSkeleton from "./InterviewPostCardSkeleton";
import { FaPenToSquare } from "react-icons/fa6";
import { FaFilter, FaChevronUp, FaChevronDown } from "react-icons/fa";
import increamentCounter from "../../libs/increamentCounter";
import MaintenancePage from "../Error/MaintenancePage";
import CompanyAIChatBox from "./CompanyAIChatBox";
import HeadTags from "../HeadTags/HeadTags";

const InterviewExperiencePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
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
    loadFiltersFromURL();
  }, []);

  // Save form state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("formState", JSON.stringify(formState));
  }, [formState]);

  const fetchPosts = async (filters = {}) => {
    let toastId;
    try {
      setLoading(true);
      toastId = toast.loading("Loading posts...");
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

      const companies = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/companies`
      );

      setPosts(response.data.posts);
      setTotalPages(response.data.totalPages);

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
      
      setCompanies(companies.data.map((c) => c.name).sort((a, b) => a.localeCompare(b)));
      setTags(uniqueTags);
      setLocations(uniqueLocations);
      setLoading(false);
      toast.dismiss(toastId);
      toast.success("Posts loaded successfully!");
    } catch (error) {
      setError(error);
      setLoading(false);
      if (toastId) toast.dismiss(toastId);
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
    <div className="min-h-screen mb-36 py-8 px-4 sm:px-6 md:mx-auto md:max-w-7xl">
      <HeadTags
        title={"Interview Experiences | NIT Surat"}
        description={"Read and share interview experiences of students from NIT Surat. Get insights into the recruitment process, questions asked, and more."}
        keywords={"interview experiences, nit surat, placements, campus placements, job interviews, recruitment process, on-campus, off-campus, pool campus, nit surat students, cdc, tnp, training and placement cell"}
      />

      {/* ── Page Header ── */}
      <div className="mb-8">
        <p className="text-xs font-mono text-blue-400 uppercase tracking-widest mb-2">
          {"// interview-experiences"}
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
          Real stories.{" "}
          <span className="text-zinc-400">Real companies.</span>
        </h1>
        <p className="text-zinc-500 text-sm mt-2 max-w-2xl">
          Placement and internship experiences shared by NIT Surat students — questions asked, rounds faced, tips earned.
        </p>
      </div>

      {/* ── Controls Row ── */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3 backdrop-blur-xl">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 border ${
            showFilters
              ? 'bg-blue-500/15 text-blue-300 border-blue-500/30'
              : 'bg-white/[0.04] text-zinc-400 border-white/[0.08] hover:bg-white/[0.08] hover:text-white'
          }`}
        >
          <FaFilter size={12} className={showFilters ? 'text-blue-400' : 'text-zinc-500'} />
          <span>Filters</span>
          {showFilters ? <FaChevronUp size={10} className="ml-1" /> : <FaChevronDown size={10} className="ml-1" />}
        </button>
        <Link
          to="/interview-experiences/create"
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all duration-200 hover:scale-[1.02] hover:shadow-emerald-500/30"
        >
          <FaPenToSquare size={13} />
          Share Your Experience
        </Link>
      </div>

      {/* ── Filters Panel ── */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          showFilters ? 'max-h-[1200px] opacity-100 mb-8' : 'max-h-0 opacity-0 mb-0'
        }`}
      >
        <div className="flex flex-col flex-wrap gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.04] p-6 backdrop-blur-xl shadow-2xl sm:flex-row">
          <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {/* Filter controls */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider pl-1">Company</label>
              <select
                value={formState.companyFilter}
                onChange={(e) =>
                  handleFilterChange("companyFilter", e.target.value)
                }
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.05] px-4 py-2.5 text-sm text-zinc-200 transition-colors focus:border-blue-500/40 focus:outline-none focus:ring-1 focus:ring-blue-500/20 backdrop-blur"
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
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.05] px-4 py-2.5 text-sm text-zinc-200 transition-colors focus:border-blue-500/40 focus:outline-none focus:ring-1 focus:ring-blue-500/20 backdrop-blur"
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
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.05] px-4 py-2.5 text-sm text-zinc-200 transition-colors focus:border-blue-500/40 focus:outline-none focus:ring-1 focus:ring-blue-500/20 backdrop-blur"
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
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.05] px-4 py-2.5 text-sm text-zinc-200 transition-colors focus:border-blue-500/40 focus:outline-none focus:ring-1 focus:ring-blue-500/20 backdrop-blur"
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
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.05] px-4 py-2.5 text-sm text-zinc-200 transition-colors focus:border-blue-500/40 focus:outline-none focus:ring-1 focus:ring-blue-500/20 backdrop-blur"
              >
                <option value="">All Locations</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row items-start sm:items-center justify-between border-t border-white/[0.06] pt-4 mt-1 sm:col-span-2 lg:col-span-3 xl:col-span-4">
              <div className="flex items-center gap-2">
                <select
                  value={pageLimit}
                  onChange={(e) => { setCurrentPage(1); setPageLimit(parseInt(e.target.value, 10)); }}
                  className="rounded-xl border border-white/[0.08] bg-white/[0.05] px-3 py-2 text-sm text-zinc-300 focus:border-blue-500/40 focus:outline-none backdrop-blur"
                >
                  <option value={10}>10 per page</option>
                  <option value={20}>20 per page</option>
                  <option value={30}>30 per page</option>
                  <option value={50}>50 per page</option>
                </select>
                <span className="text-xs text-zinc-500">per page</span>
              </div>
              <div className="flex gap-2">
                {(formState.companyFilter || formState.tagFilter || formState.admissionFilter ||
                  formState.startDate || formState.endDate || formState.campusTypeFilter ||
                  formState.jobTypeFilter || formState.minStipendFilter ||
                  formState.maxStipendFilter || formState.locationFilter) && (
                  <button
                    onClick={handleClearFilters}
                    className="rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-2 text-sm font-medium text-red-400 hover:bg-red-500/20 transition-all"
                  >
                    Clear
                  </button>
                )}
                <button
                  onClick={handleFilter}
                  className="rounded-xl bg-blue-600 hover:bg-blue-500 px-7 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all"
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
        {loading ? (
          Array(6)
            .fill(0)
            .map((_, index) => <InterviewPostCardSkeleton key={index} />)
        ) : posts.length === 0 ? (
          <div className="col-span-2 flex flex-col items-center justify-center py-20 text-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02]">
            <svg className="w-10 h-10 text-zinc-700 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            <p className="text-zinc-400 font-semibold text-sm">No experiences found</p>
            <p className="text-zinc-600 text-xs mt-1">Try adjusting your filters, or be the first to share!</p>
            <Link to="/interview-experiences/create" className="mt-4 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors">+ Share your experience</Link>
          </div>
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

      {/* ── Pagination ── */}
      <div className="mt-12 flex items-center justify-center gap-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2 text-sm font-medium text-zinc-400 transition-all hover:bg-white/[0.08] hover:text-white disabled:pointer-events-none disabled:opacity-30 backdrop-blur"
        >
          ← Prev
        </button>
        <div className="flex items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] px-5 py-2 text-sm font-mono text-zinc-400 backdrop-blur">
          <span className="text-white font-bold mx-1">{currentPage}</span> / <span className="text-white font-bold mx-1">{totalPages}</span>
        </div>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2 text-sm font-medium text-zinc-400 transition-all hover:bg-white/[0.08] hover:text-white disabled:pointer-events-none disabled:opacity-30 backdrop-blur"
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default InterviewExperiencePage;
