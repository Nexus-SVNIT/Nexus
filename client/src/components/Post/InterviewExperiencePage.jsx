import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import InterviewPostCard from './InterviewPostCard';
import { FaPenToSquare } from "react-icons/fa6";

const formatCompensation = (compensation) => {
  if (!compensation) return 'Not disclosed';
  const parts = [];
  if (compensation.stipend) parts.push(`Stipend: ₹${compensation.stipend}/month`);
  if (compensation.ctc) parts.push(`CTC: ₹${compensation.ctc} LPA`);
  if (compensation.baseSalary) parts.push(`Base: ₹${compensation.baseSalary} LPA`);
  return parts.length ? parts.join(' | ') : 'Not disclosed';
};

const formatSelectionProcess = (process) => {
  if (!process) return 'Not specified';
  const steps = [];
  
  if (process.onlineAssessment) {
    const assessments = Object.entries(process.onlineAssessment)
      .filter(([_, value]) => value)
      .map(([key]) => key.replace(/([A-Z])/g, ' $1').toLowerCase());
    if (assessments.length) steps.push(...assessments);
  }
  
  if (process.groupDiscussion) steps.push('group discussion');
  if (process.onlineInterview) steps.push('online interview');
  if (process.offlineInterview) steps.push('offline interview');
  if (process.others?.length) steps.push(...process.others);
  
  return steps.length ? steps.join(', ') : 'Not specified';
};

const formatRounds = (rounds) => {
  if (!rounds) return 'Not specified';
  const { technical = 0, hr = 0, hybrid = 0 } = rounds;
  return `${technical} Tech, ${hr} HR, ${hybrid} Hybrid`;
};

const formatCGPA = (cgpa) => {
  if (!cgpa) return 'Not specified';
  return `Boys: ${cgpa.boys || 'N/A'} | Girls: ${cgpa.girls || 'N/A'}`;
};

const formatCount = (count) => {
  if (!count) return 'Not specified';
  return `Boys: ${count.boys || 0} | Girls: ${count.girls || 0}`;
};

const InterviewExperiencePage = () => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [questions, setQuestions] = useState({});
  const [companyFilter, setCompanyFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [companies, setCompanies] = useState([]);
  const [tags, setTags] = useState([]);
  const [admissionFilter, setAdmissionFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [campusTypeFilter, setCampusTypeFilter] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("");
  const [minStipendFilter, setMinStipendFilter] = useState("");
  const [maxStipendFilter, setMaxStipendFilter] = useState("");
  const [minCTCFilter, setMinCTCFilter] = useState("");
  const [maxCTCFilter, setMaxCTCFilter] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [locations, setLocations] = useState([]); // New state for locations
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageLimit, setPageLimit] = useState(5); // New limit state
  const token = localStorage.getItem("token");

  const fetchPosts = async (filters = {}) => {
    try {
      toast.loading("Loading posts...");
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/posts`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include Bearer token in headers
          },
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
          }
        }
      );
      setPosts(response.data.posts);
      setTotalPages(response.data.totalPages);
      const uniqueCompanies = [...new Set(response.data.posts.map((p) => p.company))]
        .filter(Boolean)  // Remove any null/undefined values
        .sort((a, b) => a.localeCompare(b));  // Sort alphabetically
      
      const uniqueTags = [...new Set(response.data.posts.flatMap((p) => p.tags))]
        .filter(Boolean)  // Remove any null/undefined values
        .sort((a, b) => a.localeCompare(b));  // Sort alphabetically

      const uniqueLocations = [...new Set(response.data.posts.flatMap((p) => p.location))]
        .filter(Boolean)  // Remove any null/undefined values
        .sort((a, b) => a.localeCompare(b));  // Sort alphabetically
      
      setCompanies(uniqueCompanies);
      setTags(uniqueTags);
      setLocations(uniqueLocations); // Set unique locations
      toast.dismiss();
      toast.success("Posts loaded successfully!");
    } catch (error) {
      toast.dismiss();
      toast.error("Error fetching posts.");
      console.error("Error fetching posts:", error.response?.data || error);
    }
  };

  // Fetch all posts on component mount
  useEffect(() => {
    fetchPosts();
  }, [token, currentPage, pageLimit]);

  const handleFilter = () => {
    fetchPosts({ 
      companyName: companyFilter, 
      tag: tagFilter,
      admissionNumber: admissionFilter,
      startDate,
      endDate,
      campusType: campusTypeFilter,
      jobType: jobTypeFilter,
      minStipend: minStipendFilter,
      maxStipend: maxStipendFilter,
      location: locationFilter,
    });
  };

  const handleClearFilters = () => {
    setCompanyFilter("");
    setTagFilter("");
    setAdmissionFilter("");
    setStartDate("");
    setEndDate("");
    setCampusTypeFilter("");
    setJobTypeFilter("");
    setMinStipendFilter("");
    setMaxStipendFilter("");
    setLocationFilter("");
    fetchPosts({});
  };

  const handleCommentChange = (postId, value) => {
    setComments((prev) => ({
      ...prev,
      [postId]: value,
    }));
  };

  const handleQuestionChange = (postId, value) => {
    setQuestions((prev) => ({
      ...prev,
      [postId]: value,
    }));
  };

  const handleCommentSubmit = async (postId) => {
    try {
      const payload = { content: comments[postId], postId };
      await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/comments`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Comment submitted successfully!");
      // Update the local state instead of re-fetching
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? { ...post, comments: [...post.comments, { content: comments[post._id] }] }
            : post
        )
      );
      setComments((prev) => ({ ...prev, [postId]: "" }));
    } catch (error) {
      console.error("Error submitting comment:", error.response?.data || error);
      alert("Error submitting comment. Please try again.");
    }
  };

  const handleQuestionSubmit = async (postId) => {
    try {
      const payload = { question: questions[postId], postId };
      await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/questions/`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Question submitted successfully!");
      // Update the local state instead of re-fetching
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? { ...post, questions: [...post.questions, { question: questions[post._id] }] }
            : post
        )
      );
      setQuestions((prev) => ({ ...prev, [postId]: "" }));
    } catch (error) {
      console.error("Error submitting question:", error.response?.data || error);
      alert("Error submitting question. Please try again.");
    }
  };

  const handleCompanyClick = (companyName) => {
    setCompanyFilter(companyName);
    fetchPosts({ companyName, tag: tagFilter });
  };

  const handleTagClick = (tag) => {
    setTagFilter(tag);
    fetchPosts({ companyName: companyFilter, tag });
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6 md:mx-46 mb-36">
      <div className="flex justify-end mb-4">
        <Link
          to="/interview-experiences/create"
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200 flex justify-center items-center gap-2"
        >
          <FaPenToSquare />
          Create New Post
        </Link>
      </div>
      <h2 className="text-3xl font-bold mb-6 text-white">Interview Experiences</h2>
      <div className="flex flex-wrap gap-4 mb-6">
        <select 
          value={companyFilter} 
          onChange={(e) => setCompanyFilter(e.target.value)}
          className="bg-zinc-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Companies</option>
          {companies.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select 
          value={tagFilter} 
          onChange={(e) => setTagFilter(e.target.value)}
          className="bg-zinc-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Tags</option>
          {tags.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Filter by admission number"
          value={admissionFilter}
          onChange={(e) => setAdmissionFilter(e.target.value)}
          className="bg-zinc-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex gap-2 items-center">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-zinc-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-white">to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-zinc-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select 
          value={campusTypeFilter} 
          onChange={(e) => setCampusTypeFilter(e.target.value)}
          className="bg-zinc-800 text-white px-4 py-2 rounded-lg border border-gray-700"
        >
          <option value="">All Campus Types</option>
          <option value="In Campus">In Campus</option>
          <option value="Off Campus">Off Campus</option>
          <option value="Pool Campus">Pool Campus</option>
        </select>

        <select 
          value={jobTypeFilter}
          onChange={(e) => setJobTypeFilter(e.target.value)}
          className="bg-zinc-800 text-white px-4 py-2 rounded-lg border border-gray-700"
        >
          <option value="">All Job Types</option>
          <option value="2 Month Internship">2 Month Internship</option>
          <option value="6 Month Internship">6 Month Internship</option>
          <option value="Full Time">Full Time</option>
          <option value="6 Month Internship + Full Time">Internship + Full Time</option>
        </select>

        {/* Salary Range Filters */}
        <div className="flex gap-2 items-center">
          <input
            type="number"
            placeholder="Min Stipend"
            value={minStipendFilter}
            onChange={(e) => setMinStipendFilter(e.target.value)}
            className="bg-zinc-800 text-white px-4 py-2 rounded-lg w-32"
          />
          <span className="text-white">-</span>
          <input
            type="number"
            placeholder="Max Stipend"
            value={maxStipendFilter}
            onChange={(e) => setMaxStipendFilter(e.target.value)}
            className="bg-zinc-800 text-white px-4 py-2 rounded-lg w-32"
          />
        </div>
        <select 
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="bg-zinc-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Locations</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
        <select
          value={pageLimit}
          onChange={(e) => {
            setCurrentPage(1);
            setPageLimit(parseInt(e.target.value, 10));
          }}
          className="bg-zinc-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={10}>10 per page</option>
          <option value={20}>20 per page</option>
          <option value={30}>20 per page</option>
          <option value={50}>50 per page</option>
        </select>
        <button 
          onClick={handleFilter}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Filter
        </button>
        {(companyFilter || tagFilter || admissionFilter || startDate || endDate || campusTypeFilter || jobTypeFilter || minStipendFilter || maxStipendFilter || locationFilter) && (
          <button 
            onClick={handleClearFilters}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition duration-200"
          >
            Clear Filters
          </button>
        )}
      </div>
      {posts.length === 0 ? (
        <p className="text-gray-400">
          No posts available. Be the first to share your experience!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <InterviewPostCard
              key={post._id}
              post={post}
              handleCompanyClick={handleCompanyClick}
              handleTagClick={handleTagClick}
            />
          ))}
        </div>
      )}
      {/* Pagination Controls */}
      <div className="flex justify-center gap-2 mt-24">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="bg-blue-600 text-white px-3 py-1 rounded disabled:bg-gray-600"
        >
          Previous
        </button>
        <span className="text-white">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="bg-blue-600 text-white px-3 py-1 rounded disabled:bg-gray-600"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default InterviewExperiencePage;
