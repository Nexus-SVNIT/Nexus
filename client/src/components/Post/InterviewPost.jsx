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
      <div className="p-4 sm:p-8">
        {/* Header */}
        <div className="mb-8 space-y-4 border-b border-zinc-700 pb-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row">
            <h1 className="text-2xl font-bold text-white sm:text-3xl">
              {post.title}
            </h1>
            <span className="text-gray-400 whitespace-nowrap text-sm">
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <button
              className="inline-flex cursor-pointer items-center rounded-full bg-blue-600/20 px-4 py-2 text-sm text-blue-400 transition-colors hover:bg-blue-600/30"
              onClick={() => handleCompanyClick(post.company)}
            >
              @{post.company}
            </button>
            {post.author && (
              <div className="flex items-center gap-4">
                <span className="text-gray-400 text-sm">
                  #{post.author.admissionNumber}
                </span>
                <a
                  href={post.author.linkedInProfile}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-blue-400 transition-colors hover:text-blue-300"
                >
                  <span>by {post.author.fullName}</span>
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>{post?.views || 0} views</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          {/* Left Column - Main Content */}
          <div className="order-2 space-y-8 lg:order-1 lg:col-span-3 ">
            <div className="prose prose-invert max-w-none break-words">
              {parse(post.content)}
            </div>

            {/* Comments and Questions */}
            <div className="space-y-6 border-t border-zinc-700 pt-8">
              {token ? (
                <>
                  <div className="mt-6">
                    <textarea
                      className="border-gray-600 w-full rounded-lg border bg-zinc-800 p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Write a comment..."
                      value={comments[post._id] || ""}
                      onChange={(e) =>
                        handleCommentChange(post._id, e.target.value)
                      }
                    />
                    <button
                      className="mt-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition duration-200 hover:bg-blue-700"
                      onClick={() => handleCommentSubmit(post._id)}
                    >
                      Submit Comment
                    </button>
                  </div>

                  <div className="mt-6">
                    <textarea
                      className="border-gray-600 w-full rounded-lg border bg-zinc-800 p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ask a question..."
                      value={questions[post._id] || ""}
                      onChange={(e) =>
                        handleQuestionChange(post._id, e.target.value)
                      }
                    />
                    <button
                      className="mt-2 rounded-lg bg-green-600 px-4 py-2 text-white transition duration-200 hover:bg-green-700"
                      onClick={() => handleQuestionSubmit(post._id)}
                    >
                      Submit Question
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center text-gray-400">
                  <button 
                    onClick={() => navigate('/login')}
                    className="text-blue-400 hover:underline"
                  >
                    Login
                  </button> to comment or ask questions
                </div>
              )}

              <div className="mt-6">
                <h4 className="mb-2 font-semibold text-white">Comments:</h4>
                {comments && comments.length > 0 ? (
                  <div className="space-y-2">
                    {comments.map((comment) => (
                      <div className="text-gray-300 mb-2 rounded bg-zinc-800 p-2 text-sm">
                        <p key={comment._id} className="">
                          {comment.content}
                        </p>
                        <p className="text-gray-400 mt-2 flex items-center justify-between text-xs">
                          {comment.author?.linkedInProfile ? (
                            <a
                              href={comment.author.linkedInProfile}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300"
                            >
                              {comment.author.fullName}
                            </a>
                          ) : (
                            comment.author?.fullName
                          )}
                          {new Date(comment.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No comments yet.</p>
                )}
              </div>

              <div className="mt-6">
                <h4 className="mb-2 font-semibold text-white">Questions:</h4>
                {questionsWithAnswers && questionsWithAnswers.length > 0 ? (
                  <div className="space-y-4">
                    {questionsWithAnswers.map((question) => (
                      <div
                        key={question._id}
                        className="rounded bg-zinc-800 p-2"
                      >
                        <div className="mb-2">
                          <p className="text-gray-300">{question.question}</p>
                          <p className="text-gray-400 mt-2 flex items-center justify-between text-xs">
                            {question.askedBy?.linkedInProfile ? (
                              <a
                                href={question.askedBy.linkedInProfile}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300"
                              >
                                {question.askedBy.fullName}
                              </a>
                            ) : (
                              question.askedBy?.fullName
                            )}
                            {new Date(question.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              },
                            )}
                          </p>
                        </div>

                        {/* Answers section */}
                        {question.answers && question.answers.length > 0 && (
                          <div className="mt-2 border-l border-zinc-700 pl-4">
                            <h5 className="mb-2 text-sm font-semibold text-white">
                              Answers:
                            </h5>
                            {question.answers.map((answer, index) => (
                              <div
                                key={index}
                                className="mb-2 rounded-md bg-zinc-700 p-2 text-sm"
                              >
                                <p className="text-gray-300">
                                  {answer.content}
                                </p>
                                <p className="text-gray-400 mt-2 flex items-center justify-between text-xs">
                                  {answer.author?.linkedInProfile ? (
                                    <a
                                      href={answer.author.linkedInProfile}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-400 hover:text-blue-300"
                                    >
                                      {answer.author.fullName}
                                    </a>
                                  ) : (
                                    answer.author?.fullName
                                  )}
                                  {new Date(
                                    answer.createdAt,
                                  ).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Add answer form - only for post author */}
                        {isPostAuthor ? (
                          <div className="mt-4">
                            <textarea
                              className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Write an answer..."
                              value={answers[question._id] || ""}
                              onChange={(e) =>
                                handleAnswerChange(question._id, e.target.value)
                              }
                            />
                            <button
                              className="mt-2 rounded bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700"
                              onClick={() => handleAnswerSubmit(question._id)}
                            >
                              Submit Answer
                            </button>
                          </div>
                        ) : (
                          token && (
                            <p className="text-gray-400 mt-4 text-sm italic">
                              Only the original post author can answer questions
                            </p>
                          )
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No questions yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Interview Details */}
          <div className="order-1 space-y-6 lg:order-2 lg:col-span-2">
            <div className="rounded-lg bg-zinc-800 p-2">
              <div className="mt-2 grid grid-cols-2 gap-4 rounded-lg bg-zinc-800/50 p-4 text-sm">
                <div className="text-blue-400">Role:</div>
                <div className="text-gray-300">
                  {post.role || "Not specified"}
                </div>
                <div className="text-blue-400">Campus Type:</div>
                <div className="text-gray-300">
                  {post.campusType || "Not specified"}
                </div>

                <div className="text-blue-400">Job Type:</div>
                <div className="text-gray-300">
                  {post.jobType || "Not specified"}
                </div>

                <div className="text-blue-400">Selection Process:</div>
                <div className="text-gray-300">
                  {formatSelectionProcess(post.selectionProcess)}
                </div>

                <div className="text-blue-400">Interview Rounds:</div>
                <div className="text-gray-300">{formatRounds(post.rounds)}</div>

                <div className="text-blue-400">Compensation:</div>
                <div className="text-gray-300">
                  {formatCompensation(post.compensation)}
                </div>

                <div className="text-blue-400">Difficulty Level:</div>
                <div className="text-gray-300">
                  {post.difficultyLevel
                    ? `${post.difficultyLevel}/10`
                    : "Not rated"}
                </div>

                <div className="text-blue-400">Hiring Period:</div>
                <div className="text-gray-300">
                  {post.hiringPeriod?.month && post.hiringPeriod?.year
                    ? `${new Date(
                        0,
                        post.hiringPeriod.month - 1,
                      ).toLocaleString("default", { month: "long" })} ${
                        post.hiringPeriod.year
                      }`
                    : "Not specified"}
                </div>

                {/* Placement Statistics */}
                <div className="col-span-2 mt-2">
                  <h4 className="mb-2 font-semibold text-white">
                    Placement Statistics
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-blue-400">CGPA Criteria:</div>
                    <div className="text-gray-300">
                      Boys: {post.cgpaCriteria?.boys || "N/A"} | Girls:{" "}
                      {post.cgpaCriteria?.girls || "N/A"}
                    </div>

                    <div className="text-blue-400">Shortlist Criteria:</div>
                    <div className="text-gray-300">
                      {formatCGPA(post.shortlistCriteria)}
                    </div>

                    <div className="text-blue-400">Shortlisted:</div>
                    <div className="text-gray-300">
                      {formatCount(post.shortlistedCount)}
                    </div>

                    <div className="text-blue-400">Selected:</div>
                    <div className="text-gray-300">
                      {formatCount(post.selectedCount)}
                    </div>

                    <div className="text-blue-400">Work Mode:</div>
                    <div className="text-gray-300">
                      {post.workMode || "Not specified"}
                    </div>

                    <div className="text-blue-400">Location:</div>
                    <div className="text-gray-300">
                      {post.location?.length > 0
                        ? post.location.join(", ")
                        : "Not specified"}
                    </div>

                    <div className="text-blue-400">Offer Status:</div>
                    <div className="text-gray-300">
                      {post.offerDetails.receivedOffer ? (
                        <>
                          Received offer{" "}
                          {post.offerDetails.acceptedOffer
                            ? "- Accepted"
                            : "- Not accepted"}
                        </>
                      ) : (
                        "No offer received"
                      )}
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