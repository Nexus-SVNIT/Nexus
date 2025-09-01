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
    <div className="bg-gray-900 mb-36 min-h-screen p-4 sm:p-6 md:mx-36">
      <HeadTags
        title={"Interview Experiences | NIT Surat"}
        description={
          "Read and share interview experiences of students from NIT Surat. Get insights into the recruitment process, questions asked, and more."
        }
        keywords={
          "interview experiences, nit surat, placements, campus placements, job interviews, recruitment process, on-campus, off-campus, pool campus, nit surat students, cdc, tnp, training and placement cell"
        }
      />
      <h1 className="mb-8 text-center text-4xl font-bold tracking-tight text-white md:text-5xl">
        Interview Experiences
      </h1>
      {/* Controls Row */}
      <div className="mb-4 flex justify-between items-center">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-white transition duration-200 ${
            showFilters 
            ? 'bg-blue-600 hover:bg-blue-700' 
            : 'bg-gray-700 hover:bg-gray-600'
          }`}
        >
          <FaFilter className={`${showFilters ? 'text-white' : 'text-gray-300'}`} />
          <span>Filters</span>
          {showFilters ? <FaChevronUp /> : <FaChevronDown />}
        </button>
        <Link
          to="/interview-experiences/create"
          className="flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white transition duration-200 hover:bg-green-700"
        >
          <FaPenToSquare />
          Create New Post
        </Link>
      </div>

      {/* Filters Section */}
      {showFilters && (
        <div className="mb-6 flex flex-col flex-wrap gap-4 sm:flex-row">
          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {/* Filter controls */}
            <select
              value={formState.companyFilter}
              onChange={(e) =>
                handleFilterChange("companyFilter", e.target.value)
              }
              className="border-gray-700 rounded-lg border bg-zinc-800 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Companies</option>
              {companies.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <select
              value={formState.tagFilter}
              onChange={(e) => handleFilterChange("tagFilter", e.target.value)}
              className="border-gray-700 rounded-lg border bg-zinc-800 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Tags</option>
              {tags.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Filter by admission number"
              value={formState.admissionFilter}
              onChange={(e) =>
                handleFilterChange("admissionFilter", e.target.value)
              }
              className="border-gray-700 rounded-lg border bg-zinc-800 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={formState.startDate}
                onChange={(e) => handleFilterChange("startDate", e.target.value)}
                className="border-gray-700 rounded-lg border bg-zinc-800 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-white">to</span>
              <input
                type="date"
                value={formState.endDate}
                onChange={(e) => handleFilterChange("endDate", e.target.value)}
                className="border-gray-700 rounded-lg border bg-zinc-800 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={formState.campusTypeFilter}
              onChange={(e) =>
                handleFilterChange("campusTypeFilter", e.target.value)
              }
              className="border-gray-700 rounded-lg border bg-zinc-800 px-4 py-2 text-white"
            >
              <option value="">All Campus Types</option>
              <option value="On Campus">On Campus</option>
              <option value="Off Campus">Off Campus</option>
              <option value="Pool Campus">Pool Campus</option>
            </select>

            <select
              value={formState.jobTypeFilter}
              onChange={(e) =>
                handleFilterChange("jobTypeFilter", e.target.value)
              }
              className="border-gray-700 rounded-lg border bg-zinc-800 px-4 py-2 text-white"
            >
              <option value="">All Job Types</option>
              <option value="2 Month Internship">2 Month Internship</option>
              <option value="6 Month Internship">6 Month Internship</option>
              <option value="Full Time">Full Time</option>
              <option value="6 Month Internship + Full Time">
                Internship + Full Time
              </option>
            </select>

            {/* Salary Range Filters */}
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min Stipend"
                value={formState.minStipendFilter}
                onChange={(e) =>
                  handleFilterChange("minStipendFilter", e.target.value)
                }
                className="w-32 rounded-lg bg-zinc-800 px-4 py-2 text-white"
              />
              <span className="text-white">-</span>
              <input
                type="number"
                placeholder="Max Stipend"
                value={formState.maxStipendFilter}
                onChange={(e) =>
                  handleFilterChange("maxStipendFilter", e.target.value)
                }
                className="w-32 rounded-lg bg-zinc-800 px-4 py-2 text-white"
              />
            </div>
            <select
              value={formState.locationFilter}
              onChange={(e) =>
                handleFilterChange("locationFilter", e.target.value)
              }
              className="border-gray-700 rounded-lg border bg-zinc-800 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Locations</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
            <select
              value={pageLimit}
              onChange={(e) => {
                setCurrentPage(1);
                setPageLimit(parseInt(e.target.value, 10));
              }}
              className="border-gray-700 rounded-lg border bg-zinc-800 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={30}>30 per page</option>
              <option value={50}>50 per page</option>
            </select>
            <button
              onClick={handleFilter}
              className="rounded-lg bg-blue-600 px-6 py-2 text-white transition duration-200 hover:bg-blue-700"
            >
              Filter
            </button>
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
                className="rounded-lg bg-red-600 px-6 py-2 text-white transition duration-200 hover:bg-red-700"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      )}
     <CompanyAIChatBox companies={companies} defaultCompany={formState.companyFilter} /> 
     <br/>

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
      <div className="mt-24 flex justify-center gap-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="disabled:bg-gray-600 rounded bg-blue-600 px-3 py-1 text-white"
        >
          Previous
        </button>
        <span className="text-white">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="disabled:bg-gray-600 rounded bg-blue-600 px-3 py-1 text-white"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default InterviewExperiencePage;
