import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import parse from "html-react-parser";
import PostDetailWrapper from "./PostDetailWrapper";
import Loader from "../Loader/Loader";
import increamentCounter from "../../libs/increamentCounter";

// Utility functions
const formatCompensation = (compensation) => {
  if (!compensation) return "Not disclosed";
  const parts = [];
  if (compensation.stipend)
    parts.push(`Stipend: ₹${compensation.stipend}/month`);
  if (compensation.ctc) parts.push(`CTC: ₹${compensation.ctc} LPA`);
  if (compensation.baseSalary)
    parts.push(`Base: ₹${compensation.baseSalary} LPA`);
  return parts.length ? parts.join(" | ") : "Not disclosed";
};

const formatSelectionProcess = (process) => {
  if (!process) return "Not specified";
  const steps = [];

  if (process.onlineAssessment) {
    const assessments = Object.entries(process.onlineAssessment)
      .filter(([_, value]) => value)
      .map(([key]) => key.replace(/([A-Z])/g, " $1").toLowerCase());
    if (assessments.length) steps.push(...assessments);
  }

  if (process.groupDiscussion) steps.push("group discussion");
  if (process.onlineInterview) steps.push("online interview");
  if (process.offlineInterview) steps.push("offline interview");
  if (process.others?.length) steps.push(...process.others);

  return steps.length ? steps.join(", ") : "Not specified";
};

const formatRounds = (rounds) => {
  if (!rounds) return "Not specified";
  const { technical = 0, hr = 0, hybrid = 0 } = rounds;
  return `${technical} Tech, ${hr} HR, ${hybrid} Hybrid`;
};

const formatCGPA = (cgpa) => {
  if (!cgpa) return "Not specified";
  return `Boys: ${cgpa.boys || "N/A"} | Girls: ${cgpa.girls || "N/A"}`;
};

const formatCount = (count) => {
  if (!count) return "Not specified";
  return `Boys: ${count.boys || 0} | Girls: ${count.girls || 0}`;
};

const InterviewPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [questionsWithAnswers, setQuestionsWithAnswers] = useState([]);
  const [answers, setAnswers] = useState({});
  const token = localStorage.getItem("token");

  useEffect(() => {
    increamentCounter();
  }, []);

  const incrementView = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/posts/${id}/increment-view`
      );
    } catch (error) {
      console.error('Error incrementing view:', error);
    }
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        toast.loading("Loading post...");
        const [postResponse, questionsResponse, commentResponse] =
          await Promise.all([
            axios.get(
              `${process.env.REACT_APP_BACKEND_BASE_URL}/posts/${id}`
            ),
            axios.get(
              `${process.env.REACT_APP_BACKEND_BASE_URL}/questions/${id}`
            ),
            axios.get(
              `${process.env.REACT_APP_BACKEND_BASE_URL}/comments/${id}`
            ),
          ]);

        setPost(postResponse.data);
        setQuestionsWithAnswers(questionsResponse.data);
        setComments(commentResponse.data);
        
        await incrementView();
        
        setLoading(false);
        toast.dismiss();
        toast.success("Post loaded successfully!");
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch post");
        setLoading(false);
        toast.dismiss();
        toast.error("Error fetching post.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) return <div className="text-white min-h-screen minw-full"><Loader/></div>;
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

  const handleCommentSubmit = async (postId) => {
    try {
      if (!token) {
        toast.error("Please login to comment");
        navigate('/login');
        return;
      }

      const loadingToast = toast.loading("Submitting comment...");
      const payload = { content: comments[postId], postId };
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/comments`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.dismiss(loadingToast);
      toast.success("Comment submitted successfully!");

      const populatedComment = {
        ...response.data,
        author: {
          fullName: response.data.author.fullName,
          linkedInProfile: response.data.author.linkedInProfile,
        },
      };

      setPost((prevPost) => ({
        ...prevPost,
        comments: [...prevPost.comments, populatedComment],
      }));
      setComments((prev) => ({ ...prev, [postId]: "" }));
    } catch (error) {
      toast.dismiss();
      toast.error("Error submitting comment. Please try again.");
      console.error("Error submitting comment:", error.response?.data || error);
    }
  };

  const handleQuestionChange = (postId, value) => {
    setQuestions((prevQuestions) => ({
      ...prevQuestions,
      [postId]: value,
    }));
  };

  const handleQuestionSubmit = async (postId) => {
    try {
      if (!token) {
        toast.error("Please login to ask a question");
        navigate('/login');
        return;
      }

      const loadingToast = toast.loading("Submitting question...");
      const payload = { question: questions[postId], postId };
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/questions/`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.dismiss(loadingToast);
      toast.success("Question submitted successfully!");

      const newQuestion = {
        ...response.data,
        answers: [],
        askedBy: {
          fullName: response.data.askedBy.fullName,
          linkedInProfile: response.data.askedBy.linkedInProfile,
        },
        createdAt: new Date(),
      };

      setQuestionsWithAnswers((prev) => [newQuestion, ...prev]);
      setQuestions((prev) => ({ ...prev, [postId]: "" }));
    } catch (error) {
      toast.dismiss();
      toast.error("Error submitting question. Please try again.");
      console.error("Error submitting question:", error);
    }
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleAnswerSubmit = async (questionId) => {
    try {
      if (!token) {
        toast.error("Please login to answer questions");
        navigate('/login');
        return;
      }

      const loadingToast = toast.loading("Submitting answer...");
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/questions/${questionId}/answers`,
        { content: answers[questionId] },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.dismiss(loadingToast);
      toast.success("Answer submitted successfully!");

      setQuestionsWithAnswers((prev) =>
        prev.map((q) => {
          if (q._id === questionId) {
            return {
              ...q,
              answers: [...q.answers, response.data],
            };
          }
          return q;
        }),
      );

      setAnswers((prev) => ({ ...prev, [questionId]: "" }));
    } catch (error) {
      toast.dismiss();
      toast.error("Error submitting answer. Please try again.");
      console.error("Error submitting answer:", error);
    }
  };

  if (isLoading) return <Loader />;

  const isPostAuthor = token && 
    post.author?._id === JSON.parse(atob(token.split(".")[1])).id;

  return (
    <PostDetailWrapper>
      <div className="p-4 sm:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 space-y-6 border-b border-zinc-800/60 pb-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <h1 className="text-3xl font-bold text-white sm:text-4xl md:text-5xl tracking-tight leading-tight max-w-4xl">
              {post.title}
            </h1>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                className="inline-flex cursor-pointer items-center rounded-xl bg-blue-500/10 border border-blue-500/20 px-5 py-2 text-sm font-medium text-blue-400 transition-colors hover:bg-blue-500/20 hover:border-blue-500/40"
                onClick={() => handleCompanyClick(post.company)}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {post.company}
              </button>
              
              <span className="text-gray-500 uppercase tracking-widest text-[10px] font-bold px-2">|</span>
              
              <span className="flex items-center gap-1.5 text-sm text-gray-400 font-medium">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z" />
                </svg>
                {new Date(post.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1.5 text-sm font-medium text-gray-400 bg-zinc-800/50 px-3 py-1.5 rounded-lg">
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>{post?.views || 0} views</span>
              </div>
            
              {post.author && (
                <div className="flex items-center gap-3 bg-zinc-900/40 border border-zinc-800/60 pl-3 pr-4 py-1.5 rounded-full backdrop-blur-sm">
                  <span className="text-xs font-mono text-zinc-500 bg-zinc-800/80 px-2 py-0.5 rounded">
                    #{post.author.admissionNumber}
                  </span>
                  <a
                    href={post.author.linkedInProfile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm font-medium text-gray-300 transition-colors hover:text-white group"
                  >
                    <span>{post.author.fullName}</span>
                    <svg
                      className="h-4 w-4 text-[#0A66C2] opacity-80 group-hover:opacity-100 transition-opacity"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          {/* Left Column - Main Content */}
          <div className="order-2 space-y-10 lg:order-1 lg:col-span-3">
            <div className="prose prose-invert prose-lg max-w-none break-words bg-zinc-900/20 p-6 md:p-8 rounded-2xl border border-zinc-800/40 leading-relaxed shadow-lg">
              {parse(post.content)}
            </div>

            {/* Comments and Questions Section */}
            <div className="space-y-10 border-t border-zinc-800/60 pt-10">
              
              {/* Write Comment / Question Tabs wrapper (simplified to stacked for now) */}
              <div className="bg-zinc-900/40 border border-zinc-800/50 p-6 rounded-2xl backdrop-blur-sm shadow-xl">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Join the Discussion
                </h3>
                
                {token ? (
                  <div className="space-y-8">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Share your thoughts</label>
                      <textarea
                        className="w-full rounded-xl border border-zinc-700/50 bg-zinc-800/50 p-4 text-white placeholder-zinc-500 focus:border-blue-500/50 focus:bg-zinc-800 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all resize-none h-24"
                        placeholder="Write a comment..."
                        value={comments[post._id] || ""}
                        onChange={(e) =>
                          handleCommentChange(post._id, e.target.value)
                        }
                      />
                      <div className="flex justify-end mt-3">
                        <button
                          className="rounded-lg bg-blue-600 hover:bg-blue-500 px-6 py-2 text-sm font-medium text-white shadow-lg shadow-blue-500/20 transition-all hover:shadow-blue-500/30"
                          onClick={() => handleCommentSubmit(post._id)}
                        >
                          Post Comment
                        </button>
                      </div>
                    </div>

                    <div className="border-t border-zinc-800/50 pt-8">
                      <label className="block text-sm font-medium text-gray-400 mb-2">Have a specific question?</label>
                      <textarea
                        className="w-full rounded-xl border border-zinc-700/50 bg-zinc-800/50 p-4 text-white placeholder-zinc-500 focus:border-green-500/50 focus:bg-zinc-800 focus:outline-none focus:ring-1 focus:ring-green-500/50 transition-all resize-none h-24"
                        placeholder="Ask the author a question..."
                        value={questions[post._id] || ""}
                        onChange={(e) =>
                          handleQuestionChange(post._id, e.target.value)
                        }
                      />
                      <div className="flex justify-end mt-3">
                        <button
                          className="rounded-lg bg-green-600 hover:bg-green-500 px-6 py-2 text-sm font-medium text-white shadow-lg shadow-green-500/20 transition-all hover:shadow-green-500/30"
                          onClick={() => handleQuestionSubmit(post._id)}
                        >
                          Ask Question
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center bg-zinc-800/30 rounded-xl p-8 border border-zinc-700/30">
                    <p className="text-gray-400 mb-4">You must be logged in to participate in the discussion.</p>
                    <button 
                      onClick={() => navigate('/login')}
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors shadow-lg shadow-blue-500/20"
                    >
                      Login to Nexus
                    </button>
                  </div>
                )}
              </div>

              {/* Comments Display */}
              <div className="mt-12 space-y-6">
                <h4 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="bg-zinc-800 px-3 py-1 rounded-lg text-sm text-gray-400">{comments?.length || 0}</span>
                  Comments
                </h4>
                {comments && comments.length > 0 ? (
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <div key={comment._id} className="group relative rounded-2xl bg-zinc-900/40 border border-zinc-800/50 p-5 transition-all hover:bg-zinc-800/40 hover:border-zinc-700/50">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-zinc-700">
                            <span className="text-blue-400 font-medium text-sm">
                              {(comment.author?.fullName || "?")[0].toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium">
                              {comment.author?.linkedInProfile ? (
                                <a href={comment.author.linkedInProfile} target="_blank" rel="noopener noreferrer" className="text-gray-200 hover:text-blue-400 transition-colors">
                                  {comment.author.fullName}
                                </a>
                              ) : (
                                <span className="text-gray-300">{comment.author?.fullName}</span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(comment.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed pl-11">
                          {comment.content}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 bg-zinc-900/20 border border-zinc-800/30 border-dashed rounded-2xl">
                    <p className="text-gray-500 text-sm">No comments yet. Be the first to share your thoughts!</p>
                  </div>
                )}
              </div>

              {/* Questions Display */}
              <div className="mt-12 space-y-6">
                <h4 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="bg-zinc-800 px-3 py-1 rounded-lg text-sm text-gray-400">{questionsWithAnswers?.length || 0}</span>
                  Questions & Answers
                </h4>
                {questionsWithAnswers && questionsWithAnswers.length > 0 ? (
                  <div className="space-y-6">
                    {questionsWithAnswers.map((question) => (
                      <div key={question._id} className="rounded-2xl bg-zinc-900/40 border border-zinc-800/50 overflow-hidden shadow-sm">
                        
                        {/* Question Block */}
                        <div className="p-5 bg-zinc-800/20">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center border border-zinc-700">
                              <span className="text-green-400 font-bold text-sm">Q</span>
                            </div>
                            <div>
                              <div className="text-sm font-medium">
                                {question.askedBy?.linkedInProfile ? (
                                  <a href={question.askedBy.linkedInProfile} target="_blank" rel="noopener noreferrer" className="text-gray-200 hover:text-blue-400 transition-colors">
                                    {question.askedBy.fullName}
                                  </a>
                                ) : (
                                  <span className="text-gray-300">{question.askedBy?.fullName}</span>
                                )}
                              </div>
                              <div className="text-xs text-gray-500">
                                {new Date(question.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-200 text-sm font-medium leading-relaxed pl-11">
                            {question.question}
                          </p>
                        </div>

                        {/* Answers Block */}
                        <div className="border-t border-zinc-800/50 bg-black/20 p-5 pl-16">
                          {question.answers && question.answers.length > 0 ? (
                            <div className="space-y-5">
                              {question.answers.map((answer, index) => (
                                <div key={index} className="relative">
                                  {/* Line connecting Q to A */}
                                  <div className="absolute -left-7 top-4 w-4 h-px bg-zinc-700"></div>
                                  <div className="absolute -left-7 -top-6 w-px h-10 bg-zinc-700"></div>
                                  
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="text-blue-400 font-bold text-xs bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">Author</span>
                                    <span className="text-gray-300 text-sm font-medium">{answer.author?.fullName}</span>
                                    <span className="text-xs text-gray-500 ml-auto">
                                      {new Date(answer.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                                    </span>
                                  </div>
                                  <p className="text-gray-400 text-sm leading-relaxed">
                                    {answer.content}
                                  </p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-xs text-zinc-500 italic">No answers yet.</span>
                          )}

                          {/* Add answer form - only for post author */}
                          {isPostAuthor && (
                            <div className="mt-5 relative">
                               <div className="absolute -left-7 top-6 w-4 h-px bg-zinc-700"></div>
                               <div className="absolute -left-7 -top-2 w-px h-8 bg-zinc-700"></div>
                              <textarea
                                className="w-full rounded-xl border border-zinc-700/50 bg-zinc-800/50 p-3 text-sm text-white placeholder-zinc-500 focus:border-blue-500/50 focus:bg-zinc-800 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all resize-none h-20"
                                placeholder="Reply to this question as the author..."
                                value={answers[question._id] || ""}
                                onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                              />
                              <div className="flex justify-end mt-2">
                                <button
                                  className="rounded-lg bg-blue-600/80 hover:bg-blue-500 px-4 py-1.5 text-xs font-medium text-white transition-all"
                                  onClick={() => handleAnswerSubmit(question._id)}
                                >
                                  Reply
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 bg-zinc-900/20 border border-zinc-800/30 border-dashed rounded-2xl">
                    <p className="text-gray-500 text-sm">No questions asked yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Interview Details */}
          <div className="order-1 lg:order-2 lg:col-span-2 space-y-6">
            
            {/* Quick Overview Card */}
            <div className="rounded-2xl bg-zinc-900/40 border border-zinc-800/60 p-6 shadow-xl backdrop-blur-sm">
              <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Overview
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-start border-b border-zinc-800 pb-3">
                  <span className="text-sm text-zinc-400">Role</span>
                  <span className="text-sm font-medium text-gray-200 text-right">{post.role || "Not specified"}</span>
                </div>
                <div className="flex justify-between items-start border-b border-zinc-800 pb-3">
                  <span className="text-sm text-zinc-400">Campus Type</span>
                  <span className="text-sm font-medium text-gray-200">{post.campusType || "Not specified"}</span>
                </div>
                <div className="flex justify-between items-start border-b border-zinc-800 pb-3">
                  <span className="text-sm text-zinc-400">Job Type</span>
                  <span className="text-sm font-medium text-gray-200">{post.jobType || "Not specified"}</span>
                </div>
                <div className="flex justify-between items-start border-b border-zinc-800 pb-3">
                  <span className="text-sm text-zinc-400">Location</span>
                  <span className="text-sm font-medium text-gray-200 text-right">
                    {post.location?.length > 0 ? post.location.join(", ") : "Not specified"}
                  </span>
                </div>
                <div className="flex justify-between items-start pb-1">
                  <span className="text-sm text-zinc-400">Work Mode</span>
                  <span className="text-sm font-medium text-gray-200">{post.workMode || "Not specified"}</span>
                </div>
              </div>
            </div>

            {/* Compensation & Process Card */}
            <div className="rounded-2xl bg-zinc-900/40 border border-zinc-800/60 p-6 shadow-xl backdrop-blur-sm">
              <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Details & Offer
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-start border-b border-zinc-800 pb-3">
                  <span className="text-sm text-zinc-400">Compensation</span>
                  <span className="text-sm font-medium text-green-400 text-right">{formatCompensation(post.compensation)}</span>
                </div>
                <div className="flex justify-between items-start border-b border-zinc-800 pb-3">
                  <span className="text-sm text-zinc-400">Selection Process</span>
                  <span className="text-sm font-medium text-gray-200 text-right capitalize">{formatSelectionProcess(post.selectionProcess)}</span>
                </div>
                <div className="flex justify-between items-start border-b border-zinc-800 pb-3">
                  <span className="text-sm text-zinc-400">Interview Rounds</span>
                  <span className="text-sm font-medium text-gray-200">{formatRounds(post.rounds)}</span>
                </div>
                <div className="flex justify-between items-start border-b border-zinc-800 pb-3">
                  <span className="text-sm text-zinc-400">Difficulty</span>
                  <span className="text-sm font-medium text-gray-200">
                    {post.difficultyLevel ? (
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                        post.difficultyLevel > 7 ? 'bg-red-500/20 text-red-400' :
                        post.difficultyLevel > 4 ? 'bg-yellow-500/20 text-yellow-500' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {post.difficultyLevel}/10
                      </span>
                    ) : (
                      "Not rated"
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-sm text-zinc-400">Offer Status</span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                    post.offerDetails?.receivedOffer 
                      ? post.offerDetails?.acceptedOffer 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                  }`}>
                    {post.offerDetails?.receivedOffer ? (
                      post.offerDetails.acceptedOffer ? "Accepted" : "Received (Not Accepted)"
                    ) : (
                      "No Offer"
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Placement Statistics Card */}
            <div className="rounded-2xl bg-zinc-900/40 border border-zinc-800/60 p-6 shadow-xl backdrop-blur-sm">
              <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Placement Stats
              </h3>
              
              <div className="space-y-4">
                <div className="flex flex-col gap-1 border-b border-zinc-800 pb-3">
                  <span className="text-xs text-zinc-400 uppercase tracking-widest font-semibold">Eligibility (CGPA)</span>
                  <span className="text-sm font-medium text-gray-200">
                    Boys: {post.cgpaCriteria?.boys || "N/A"} <span className="text-zinc-600 mx-1">|</span> Girls: {post.cgpaCriteria?.girls || "N/A"}
                  </span>
                </div>

                <div className="flex flex-col gap-1 border-b border-zinc-800 pb-3">
                  <span className="text-xs text-zinc-400 uppercase tracking-widest font-semibold">Shortlist Criteria</span>
                  <span className="text-sm font-medium text-gray-200">{formatCGPA(post.shortlistCriteria)}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-1">
                  <div className="bg-zinc-800/50 rounded-xl p-3 border border-zinc-700/50">
                    <span className="block text-xs text-zinc-400 mb-1">Shortlisted</span>
                    <span className="text-sm font-bold text-blue-400">{formatCount(post.shortlistedCount)}</span>
                  </div>
                  <div className="bg-zinc-800/50 rounded-xl p-3 border border-zinc-700/50">
                    <span className="block text-xs text-zinc-400 mb-1">Selected</span>
                    <span className="text-sm font-bold text-green-400">{formatCount(post.selectedCount)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tags Box */}
            {post.tags && post.tags.length > 0 && (
              <div className="pt-2">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <span key={tag} className="text-xs font-medium bg-zinc-800 text-zinc-300 px-3 py-1.5 rounded-lg border border-zinc-700/50">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PostDetailWrapper>
  );
};

export default InterviewPost;