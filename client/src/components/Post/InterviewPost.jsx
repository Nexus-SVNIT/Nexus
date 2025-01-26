import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import parse from 'react-html-parser';
import PostDetailWrapper from './PostDetailWrapper';

// Utility functions
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

const InterviewPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState({});
  const [questions, setQuestions] = useState({});
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        toast.loading("Loading post...");
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/api/posts/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setPost(response.data);
        setLoading(false);
        toast.dismiss();
        toast.success("Post loaded successfully!");
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch post');
        setLoading(false);
        toast.dismiss();
        toast.error("Error fetching post.");
      }
    };

    fetchPost();
  }, [id, token]);

  if (loading) return <div className="text-white">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!post) return <div className="text-white">Post not found</div>;

  const handleCompanyClick = (company) => {
    // handle company click
  };

  const handleTagClick = (tag) => {
    // handle tag click
  };

  const handleCommentChange = (postId, value) => {
    setComments((prevComments) => ({
      ...prevComments,
      [postId]: value,
    }));
  };

  const handleCommentSubmit = (postId) => {
    // handle comment submit
  };

  const handleQuestionChange = (postId, value) => {
    setQuestions((prevQuestions) => ({
      ...prevQuestions,
      [postId]: value,
    }));
  };

  const handleQuestionSubmit = (postId) => {
    // handle question submit
  };

  return (
    <PostDetailWrapper>
      <div className="p-8">
        {/* Header */}
        <div className="space-y-4 mb-8 pb-8 border-b border-zinc-700">
          <div className="flex justify-between items-start gap-4">
            <h1 className="text-3xl font-bold text-white">{post.title}</h1>
            <span className="text-sm text-gray-400 whitespace-nowrap">
              {new Date(post.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <button 
              className="px-4 py-2 bg-blue-600/20 text-blue-400 rounded-full text-sm hover:bg-blue-600/30 transition-colors cursor-pointer inline-flex items-center"
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
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="md:col-span-2 space-y-8">
            <div className="prose prose-invert max-w-none">
              {parse(post.content)}
            </div>

            {/* Comments and Questions */}
            <div className="space-y-6 pt-8 border-t border-zinc-700">
              <div className="mt-6">
                <textarea
                  className="w-full p-3 bg-zinc-800 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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

              <div className="mt-6">
                <textarea
                  className="w-full p-3 bg-zinc-800 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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

              <div className="mt-6">
                <h4 className="font-semibold text-white mb-2">Comments:</h4>
                {post.comments && post.comments.length > 0 ? (
                  <div className="space-y-2">
                    {post.comments.map((comment) => (
                      <p key={comment._id} className="text-gray-300 text-sm bg-zinc-800 p-2 rounded">
                        {comment.content}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No comments yet.</p>
                )}
              </div>

              <div className="mt-6">
                <h4 className="font-semibold text-white mb-2">Questions:</h4>
                {post.questions && post.questions.length > 0 ? (
                  <div className="space-y-2">
                    {post.questions.map((question) => (
                      <p key={question._id} className="text-gray-300 text-sm bg-zinc-800 p-2 rounded">
                        {question.question}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No questions yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Interview Details */}
          <div className="space-y-6">
            <div className="bg-zinc-800 rounded-lg p-6">
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm bg-zinc-800/50 p-4 rounded-lg">
                <div className="text-blue-400">Campus Type:</div>
                <div className="text-gray-300">{post.campusType || 'Not specified'}</div>
                
                <div className="text-blue-400">Job Type:</div>
                <div className="text-gray-300">{post.jobType || 'Not specified'}</div>
                
                <div className="text-blue-400">Selection Process:</div>
                <div className="text-gray-300">
                  {formatSelectionProcess(post.selectionProcess)}
                </div>

                <div className="text-blue-400">Interview Rounds:</div>
                <div className="text-gray-300">
                  {formatRounds(post.rounds)}
                </div>

                <div className="text-blue-400">Compensation:</div>
                <div className="text-gray-300">
                  {formatCompensation(post.compensation)}
                </div>

                <div className="text-blue-400">Difficulty Level:</div>
                <div className="text-gray-300">
                  {post.difficultyLevel ? `${post.difficultyLevel}/10` : 'Not rated'}
                </div>

                <div className="text-blue-400">Hiring Period:</div>
                <div className="text-gray-300">
                  {post.hiringPeriod?.month && post.hiringPeriod?.year
                    ? `${new Date(0, post.hiringPeriod.month - 1).toLocaleString('default', { month: 'long' })} ${post.hiringPeriod.year}`
                    : 'Not specified'}
                </div>

                {/* Placement Statistics */}
                <div className="col-span-2 mt-2">
                  <h4 className="text-white font-semibold mb-2">Placement Statistics</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-blue-400">CGPA Criteria:</div>
                    <div className="text-gray-300">{formatCGPA(post.cgpaCriteria)}</div>

                    <div className="text-blue-400">Shortlist Criteria:</div>
                    <div className="text-gray-300">{formatCGPA(post.shortlistCriteria)}</div>

                    <div className="text-blue-400">Shortlisted:</div>
                    <div className="text-gray-300">{formatCount(post.shortlistedCount)}</div>

                    <div className="text-blue-400">Selected:</div>
                    <div className="text-gray-300">{formatCount(post.selectedCount)}</div>

                    <div className="text-blue-400">Work Mode:</div>
                    <div className="text-gray-300">{post.workMode || 'Not specified'}</div>

                    <div className="text-blue-400">Location:</div>
                    <div className="text-gray-300">
                      {post.location?.length > 0 
                        ? post.location.join(', ')
                        : 'Not specified'
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PostDetailWrapper>
  );
};

export default InterviewPost;
