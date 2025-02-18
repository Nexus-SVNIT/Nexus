import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import InterviewPostCard from './InterviewPostCard';
import { FaPenToSquare } from "react-icons/fa6";
import increamentCounter from "../../libs/increamentCounter";
import MaintenancePage from "../Error/MaintenancePage";

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
  // const [posts, setPosts] = useState([]);
  // const [comments, setComments] = useState({});
  // const [questions, setQuestions] = useState({});
  // const [companies, setCompanies] = useState([]);
  // const [tags, setTags] = useState([]);
  // const [locations, setLocations] = useState([]);
  // const [currentPage, setCurrentPage] = useState(1);
  // const [totalPages, setTotalPages] = useState(1);
  // const [pageLimit, setPageLimit] = useState(5);
  // const [isError, setError] = useState(null);
  // const token = localStorage.getItem("token");

  // const [formState, setFormState] = useState({
  //   companyFilter: "",
  //   tagFilter: "",
  //   admissionFilter: "",
  //   startDate: "",
  //   endDate: "",
  //   campusTypeFilter: "",
  //   jobTypeFilter: "",
  //   minStipendFilter: "",
  //   maxStipendFilter: "",
  //   locationFilter: "",
  // });

  // // Load saved form state from localStorage on component mount
  // useEffect(() => {
  //   const savedFormState = JSON.parse(localStorage.getItem("formState")) || {};
  //   setFormState(savedFormState);
  // }, []);

  // // Save form state to localStorage whenever it changes
  // useEffect(() => {
  //   localStorage.setItem("formState", JSON.stringify(formState));
  // }, [formState]);

  // const fetchPosts = async (filters = {}) => {
  //   try {
  //     toast.loading("Loading posts...");
  //     const response = await axios.get(
  //       `${process.env.REACT_APP_BACKEND_BASE_URL}/api/posts`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //         params: {
  //           companyName: filters.companyName || "",
  //           tag: filters.tag || "",
  //           admissionNumber: filters.admissionNumber || "",
  //           startDate: filters.startDate || "",
  //           endDate: filters.endDate || "",
  //           campusType: filters.campusType || "",
  //           jobType: filters.jobType || "",
  //           minStipend: filters.minStipend || "",
  //           maxStipend: filters.maxStipend || "",
  //           location: filters.location || "",
  //           page: currentPage,
  //           limit: pageLimit,
  //         }
  //       }
  //     );
  //     setPosts(response.data.posts);
  //     setTotalPages(response.data.totalPages);
  //     const uniqueCompanies = [...new Set(response.data.posts.map((p) => p.company))]
  //       .filter(Boolean)
  //       .sort((a, b) => a.localeCompare(b));
      
  //     const uniqueTags = [...new Set(response.data.posts.flatMap((p) => p.tags))]
  //       .filter(Boolean)
  //       .sort((a, b) => a.localeCompare(b));

  //     const uniqueLocations = [...new Set(response.data.posts.flatMap((p) => p.location))]
  //       .filter(Boolean)
  //       .sort((a, b) => a.localeCompare(b));
      
  //     setCompanies(uniqueCompanies);
  //     setTags(uniqueTags);
  //     setLocations(uniqueLocations);
  //     toast.dismiss();
  //     toast.success("Posts loaded successfully!");
  //   } catch (error) {
  //     setError(error);
  //     toast.dismiss();
  //     toast.error("Error fetching posts.");
  //     console.error("Error fetching posts:", error.response?.data || error);
  //   }
  // };

  // // Fetch all posts on component mount
  // useEffect(() => {
  //   fetchPosts();
  // }, [token, currentPage, pageLimit]);

  // useEffect(() => {
  //   increamentCounter();
  // }, []);

  // const handleFilterChange = (key, value) => {
  //   setFormState((prevState) => ({
  //     ...prevState,
  //     [key]: value,
  //   }));
  // };

  // const handleFilter = () => {
  //   fetchPosts({ 
  //     companyName: formState.companyFilter, 
  //     tag: formState.tagFilter,
  //     admissionNumber: formState.admissionFilter,
  //     startDate: formState.startDate,
  //     endDate: formState.endDate,
  //     campusType: formState.campusTypeFilter,
  //     jobType: formState.jobTypeFilter,
  //     minStipend: formState.minStipendFilter,
  //     maxStipend: formState.maxStipendFilter,
  //     location: formState.locationFilter,
  //   });
  // };

  // const handleClearFilters = () => {
  //   setFormState({
  //     companyFilter: "",
  //     tagFilter: "",
  //     admissionFilter: "",
  //     startDate: "",
  //     endDate: "",
  //     campusTypeFilter: "",
  //     jobTypeFilter: "",
  //     minStipendFilter: "",
  //     maxStipendFilter: "",
  //     locationFilter: "",
  //   });
  //   fetchPosts({});
  // };

  // const handleCommentChange = (postId, value) => {
  //   setComments((prev) => ({
  //     ...prev,
  //     [postId]: value,
  //   }));
  // };

  // const handleQuestionChange = (postId, value) => {
  //   setQuestions((prev) => ({
  //     ...prev,
  //     [postId]: value,
  //   }));
  // };

  // const handleCommentSubmit = async (postId) => {
  //   try {
  //     const payload = { content: comments[postId], postId };
  //     await axios.post(
  //       `${process.env.REACT_APP_BACKEND_BASE_URL}/api/comments`,
  //       payload,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //     alert("Comment submitted successfully!");
  //     setPosts((prevPosts) =>
  //       prevPosts.map((post) =>
  //         post._id === postId
  //           ? { ...post, comments: [...post.comments, { content: comments[post._id] }] }
  //           : post
  //       )
  //     );
  //     setComments((prev) => ({ ...prev, [postId]: "" }));
  //   } catch (error) {
  //     console.error("Error submitting comment:", error.response?.data || error);
  //     alert("Error submitting comment. Please try again.");
  //   }
  // };

  // const handleQuestionSubmit = async (postId) => {
  //   try {
  //     const payload = { question: questions[postId], postId };
  //     await axios.post(
  //       `${process.env.REACT_APP_BACKEND_BASE_URL}/api/questions/`,
  //       payload,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //     alert("Question submitted successfully!");
  //     setPosts((prevPosts) =>
  //       prevPosts.map((post) =>
  //         post._id === postId
  //           ? { ...post, questions: [...post.questions, { question: questions[post._id] }] }
  //           : post
  //       )
  //     );
  //     setQuestions((prev) => ({ ...prev, [postId]: "" }));
  //   } catch (error) {
  //     console.error("Error submitting question:", error.response?.data || error);
  //     alert("Error submitting question. Please try again.");
  //   }
  // };

  // const handleCompanyClick = (companyName) => {
  //   setFormState((prev) => ({ ...prev, companyFilter: companyName }));
  //   fetchPosts({ companyName, tag: formState.tagFilter });
  // };

  // const handleTagClick = (tag) => {
  //   setFormState((prev) => ({ ...prev, tagFilter: tag }));
  //   fetchPosts({ companyName: formState.companyFilter, tag });
  // };

  // const handlePageChange = (newPage) => {
  //   setCurrentPage(newPage);
  // };

  // if(isError) {
  //   return <MaintenancePage />;
  // }

  // return (
  //   <div className="min-h-screen bg-gray-900 p-4 sm:p-6 md:mx-36 mb-36">
  //     <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-8 tracking-tight">
  //       Interview Experiences
  //     </h1>
  //     {/* Create Post Button */}
  //     <div className="flex justify-end mb-4">
  //       <Link
  //         to="/interview-experiences/create"
  //         className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200 flex justify-center items-center gap-2"
  //       >
  //         <FaPenToSquare />
  //         Create New Post
  //       </Link>
  //     </div>

  //     {/* Filters Section */}
  //     <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-6">
  //       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
  //         {/* Filter controls */}
  //         <select 
  //           value={formState.companyFilter} 
  //           onChange={(e) => handleFilterChange("companyFilter", e.target.value)}
  //           className="bg-zinc-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
  //         >
  //           <option value="">All Companies</option>
  //           {companies.map((c) => (
  //             <option key={c} value={c}>{c}</option>
  //           ))}
  //         </select>
  //         <select 
  //           value={formState.tagFilter} 
  //           onChange={(e) => handleFilterChange("tagFilter", e.target.value)}
  //           className="bg-zinc-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
  //         >
  //           <option value="">All Tags</option>
  //           {tags.map((t) => (
  //             <option key={t} value={t}>{t}</option>
  //           ))}
  //         </select>
  //         <input
  //           type="text"
  //           placeholder="Filter by admission number"
  //           value={formState.admissionFilter}
  //           onChange={(e) => handleFilterChange("admissionFilter", e.target.value)}
  //           className="bg-zinc-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
  //         />
  //         <div className="flex gap-2 items-center">
  //           <input
  //             type="date"
  //             value={formState.startDate}
  //             onChange={(e) => handleFilterChange("startDate", e.target.value)}
  //             className="bg-zinc-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
  //           />
  //           <span className="text-white">to</span>
  //           <input
  //             type="date"
  //             value={formState.endDate}
  //             onChange={(e) => handleFilterChange("endDate", e.target.value)}
  //             className="bg-zinc-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
  //           />
  //         </div>
  //         <select 
  //           value={formState.campusTypeFilter} 
  //           onChange={(e) => handleFilterChange("campusTypeFilter", e.target.value)}
  //           className="bg-zinc-800 text-white px-4 py-2 rounded-lg border border-gray-700"
  //         >
  //           <option value="">All Campus Types</option>
  //           <option value="In Campus">In Campus</option>
  //           <option value="Off Campus">Off Campus</option>
  //           <option value="Pool Campus">Pool Campus</option>
  //         </select>

  //         <select 
  //           value={formState.jobTypeFilter}
  //           onChange={(e) => handleFilterChange("jobTypeFilter", e.target.value)}
  //           className="bg-zinc-800 text-white px-4 py-2 rounded-lg border border-gray-700"
  //         >
  //           <option value="">All Job Types</option>
  //           <option value="2 Month Internship">2 Month Internship</option>
  //           <option value="6 Month Internship">6 Month Internship</option>
  //           <option value="Full Time">Full Time</option>
  //           <option value="6 Month Internship + Full Time">Internship + Full Time</option>
  //         </select>

  //         {/* Salary Range Filters */}
  //         <div className="flex gap-2 items-center">
  //           <input
  //             type="number"
  //             placeholder="Min Stipend"
  //             value={formState.minStipendFilter}
  //             onChange={(e) => handleFilterChange("minStipendFilter", e.target.value)}
  //             className="bg-zinc-800 text-white px-4 py-2 rounded-lg w-32"
  //           />
  //           <span className="text-white">-</span>
  //           <input
  //             type="number"
  //             placeholder="Max Stipend"
  //             value={formState.maxStipendFilter}
  //             onChange={(e) => handleFilterChange("maxStipendFilter", e.target.value)}
  //             className="bg-zinc-800 text-white px-4 py-2 rounded-lg w-32"
  //           />
  //         </div>
  //         <select 
  //           value={formState.locationFilter}
  //           onChange={(e) => handleFilterChange("locationFilter", e.target.value)}
  //           className="bg-zinc-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
  //         >
  //           <option value="">All Locations</option>
  //           {locations.map((loc) => (
  //             <option key={loc} value={loc}>{loc}</option>
  //           ))}
  //         </select>
  //         <select
  //           value={pageLimit}
  //           onChange={(e) => {
  //             setCurrentPage(1);
  //             setPageLimit(parseInt(e.target.value, 10));
  //           }}
  //           className="bg-zinc-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
  //         >
  //           <option value={10}>10 per page</option>
  //           <option value={20}>20 per page</option>
  //           <option value={30}>30 per page</option>
  //           <option value={50}>50 per page</option>
  //         </select>
  //         <button 
  //           onClick={handleFilter}
  //           className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
  //         >
  //           Filter
  //         </button>
  //         {(formState.companyFilter || formState.tagFilter || formState.admissionFilter || formState.startDate || formState.endDate || formState.campusTypeFilter || formState.jobTypeFilter || formState.minStipendFilter || formState.maxStipendFilter || formState.locationFilter) && (
  //           <button 
  //             onClick={handleClearFilters}
  //             className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition duration-200"
  //           >
  //             Clear Filters
  //           </button>
  //         )}
  //       </div>
  //     </div>

  //     {/* Posts Grid */}
  //     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  //       {posts.length === 0 ? (
  //         <p className="text-gray-400">
  //           No posts available. Be the first to share your experience!
  //         </p>
  //       ) : (
  //         posts.map((post) => (
  //           <InterviewPostCard
  //             key={post._id}
  //             post={post}
  //             handleCompanyClick={handleCompanyClick}
  //             handleTagClick={handleTagClick}
  //           />
  //         ))
  //       )}
  //     </div>

  //     {/* Pagination Controls */}
  //     <div className="flex justify-center gap-2 mt-24">
  //       <button
  //         onClick={() => handlePageChange(currentPage - 1)}
  //         disabled={currentPage <= 1}
  //         className="bg-blue-600 text-white px-3 py-1 rounded disabled:bg-gray-600"
  //       >
  //         Previous
  //       </button>
  //       <span className="text-white">
  //         Page {currentPage} of {totalPages}
  //       </span>
  //       <button
  //         onClick={() => handlePageChange(currentPage + 1)}
  //         disabled={currentPage >= totalPages}
  //         className="bg-blue-600 text-white px-3 py-1 rounded disabled:bg-gray-600"
  //       >
  //         Next
  //       </button>
  //     </div>
  //   </div>
  // );
  return <MaintenancePage />;
};

export default InterviewExperiencePage;