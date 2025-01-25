import React, { useEffect, useState } from "react";
import axios from "axios";

const InterviewExperience = () => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [questions, setQuestions] = useState({});

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/posts`);
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, []);

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
      const payload = { comment: comments[postId] };
      await axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/comments/${postId}`, payload);
      alert("Comment submitted successfully!");
      setComments((prev) => ({ ...prev, [postId]: "" }));
    } catch (error) {
      console.error("Error submitting comment:", error);
      alert("Error submitting comment. Please try again.");
    }
  };

  const handleQuestionSubmit = async (postId) => {
    try {
      const payload = { question: questions[postId] };
      await axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/questions/`, payload);
      alert("Question submitted successfully!");
      setQuestions((prev) => ({ ...prev, [postId]: "" }));
    } catch (error) {
      console.error("Error submitting question:", error);
      alert("Error submitting question. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Interview Experiences</h2>
      {posts.length === 0 ? (
        <p className="text-gray-600">No posts available. Be the first to share your experience!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-black">
          {posts.map((post) => (
            <div key={post._id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl">
              <h3 className="text-xl font-bold text-gray-800">{post.title}</h3>
              <p className="text-sm text-gray-500 mt-2">{post.company}</p>
              <p className="text-gray-700 mt-4">{post.content.substring(0, 100)}...</p>
              <p className="text-sm text-gray-500 mt-2">Tags: {post.tags.join(", ")}</p>

              {/* Comment Section */}
              <div className="mt-4">
                <textarea
                  className="w-full p-2 border rounded mb-2"
                  placeholder="Write a comment..."
                  value={comments[post._id] || ""}
                  onChange={(e) => handleCommentChange(post._id, e.target.value)}
                />
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  onClick={() => handleCommentSubmit(post._id)}
                >
                  Submit Comment
                </button>
              </div>

              {/* Question Section */}
              <div className="mt-4">
                <textarea
                  className="w-full p-2 border rounded mb-2"
                  placeholder="Ask a question..."
                  value={questions[post._id] || ""}
                  onChange={(e) => handleQuestionChange(post._id, e.target.value)}
                />
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  onClick={() => handleQuestionSubmit(post._id)}
                >
                  Submit Question
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InterviewExperience;
