import React, { useEffect, useState } from "react";
import axios from "axios";
import parse from 'react-html-parser';

const InterviewExperience = () => {
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
  const token = localStorage.getItem("token");

  const fetchPosts = async (filters = {}) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/posts?companyName=${filters.companyName || ""}&tag=${filters.tag || ""}&admissionNumber=${filters.admissionNumber || ""}&startDate=${filters.startDate || ""}&endDate=${filters.endDate || ""}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include Bearer token in headers
          },
        }
      );
      setPosts(response.data);
      const uniqueCompanies = [...new Set(response.data.map((p) => p.company))]
        .filter(Boolean)  // Remove any null/undefined values
        .sort((a, b) => a.localeCompare(b));  // Sort alphabetically
      
      const uniqueTags = [...new Set(response.data.flatMap((p) => p.tags))]
        .filter(Boolean)  // Remove any null/undefined values
        .sort((a, b) => a.localeCompare(b));  // Sort alphabetically
      
      setCompanies(uniqueCompanies);
      setTags(uniqueTags);
    } catch (error) {
      console.error("Error fetching posts:", error.response?.data || error);
    }
  };

  // Fetch all posts on component mount
  useEffect(() => {
    fetchPosts();
  }, [token]);

  const handleFilter = () => {
    fetchPosts({ 
      companyName: companyFilter, 
      tag: tagFilter,
      admissionNumber: admissionFilter,
      startDate,
      endDate
    });
  };

  const handleClearFilters = () => {
    setCompanyFilter("");
    setTagFilter("");
    setAdmissionFilter("");
    setStartDate("");
    setEndDate("");
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

  return (
    <div className="min-h-screen bg-gray-900 p-6 md:mx-46">
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
        <button 
          onClick={handleFilter}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Filter
        </button>
        {(companyFilter || tagFilter || admissionFilter || startDate || endDate) && (
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div key={post._id} className="bg-zinc-900 rounded-lg shadow-zinc-800 shadow-lg p-6 hover:shadow-lg transition duration-200">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-white">{post.title}</h3>
                <span className="text-sm text-gray-400">
                  {new Date(post.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <button 
                  className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm hover:bg-blue-600/30 transition-colors cursor-pointer inline-flex items-center"
                  onClick={() => handleCompanyClick(post.company)}
                >
                  @{post.company}
                </button>
                {post.author && (
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-400">
                      #{post.author.admissionNumber}
                    </span>
                    <a
                      href={post.author.linkedInProfile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2"
                    >
                      <span>by {post.author.fullName}</span>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                    </a>
                  </div>
                )}
              </div>
              <div className="text-gray-300 mt-4 prose prose-invert max-w-none">
                {parse(post.content)}
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {post.tags.map((tag, index) => (
                  <button 
                    key={index} 
                    className="bg-zinc-700/50 text-zinc-300 text-xs px-3 py-1 rounded-full hover:bg-gray-700/70 transition-colors cursor-pointer inline-flex items-center"
                    onClick={() => handleTagClick(tag)}
                  >
                    #{tag}
                  </button>
                ))}
              </div>

              {/* New Interview Details Section */}
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div className="text-blue-400">Campus Type: <span className="text-gray-300">{post.campusType}</span></div>
                <div className="text-blue-400">Job Type: <span className="text-gray-300">{post.jobType}</span></div>
                
                <div className="text-blue-400">Selection Process:</div>
                <div className="text-gray-300">
                  {Object.entries(post.selectionProcess.onlineAssessment)
                    .filter(([_, value]) => value)
                    .map(([key]) => key)
                    .join(', ')}
                  {post.selectionProcess.groupDiscussion && ', Group Discussion'}
                  {post.selectionProcess.onlineInterview && ', Online Interview'}
                  {post.selectionProcess.offlineInterview && ', Offline Interview'}
                </div>

                <div className="text-blue-400">Rounds:</div>
                <div className="text-gray-300">
                  {post.rounds.technical} Tech, {post.rounds.hr} HR, {post.rounds.hybrid} Hybrid
                </div>

                <div className="text-blue-400">Compensation:</div>
                <div className="text-gray-300">
                  {post.compensation.stipend && `Stipend: ₹${post.compensation.stipend}`}
                  {post.compensation.ctc && ` | CTC: ₹${post.compensation.ctc}LPA`}
                </div>

                <div className="text-blue-400">Difficulty Level:</div>
                <div className="text-gray-300">{post.difficultyLevel}/10</div>

                <div className="text-blue-400">Hiring Period:</div>
                <div className="text-gray-300">
                  {new Date(0, post.hiringPeriod.month - 1).toLocaleString('default', { month: 'long' })} {post.hiringPeriod.year}
                </div>
              </div>

              {/* Comment Section */}
              <div className="mt-6">
                <textarea
                  className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Write a comment..."
                  value={comments[post._id] || ""}
                  onChange={(e) => handleCommentChange(post._id, e.target.value)}
                />
                <button
                  className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                  onClick={() => handleCommentSubmit(post._id)}
                >
                  Submit Comment
                </button>
              </div>

              {/* Question Section */}
              <div className="mt-6">
                <textarea
                  className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ask a question..."
                  value={questions[post._id] || ""}
                  onChange={(e) => handleQuestionChange(post._id, e.target.value)}
                />
                <button
                  className="mt-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200"
                  onClick={() => handleQuestionSubmit(post._id)}
                >
                  Submit Question
                </button>
              </div>

              {/* Display Comments */}
              <div className="mt-6">
                <h4 className="font-semibold text-white mb-2">Comments:</h4>
                {post.comments && post.comments.length > 0 ? (
                  <div className="space-y-2">
                    {post.comments.map((comment) => (
                      <p key={comment._id} className="text-gray-300 text-sm bg-gray-700 p-2 rounded">
                        {comment.content}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No comments yet.</p>
                )}
              </div>

              {/* Display Questions */}
              <div className="mt-6">
                <h4 className="font-semibold text-white mb-2">Questions:</h4>
                {post.questions && post.questions.length > 0 ? (
                  <div className="space-y-2">
                    {post.questions.map((question) => (
                      <p key={question._id} className="text-gray-300 text-sm bg-gray-700 p-2 rounded">
                        {question.question}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No questions yet.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InterviewExperience;
