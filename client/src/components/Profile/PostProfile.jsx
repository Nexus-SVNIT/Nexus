import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

function PostProfile() {
  const navigate = useNavigate();
  const [userPosts, setUserPosts] = useState([]); // Add this line

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/user/posts`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        setUserPosts(response.data); // Set the fetched posts to state
      } catch (error) {
        console.error("Error fetching user posts:", error);
      }
    };
    fetchUserPosts();
  }, []); // Add this line

  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/posts/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Post deleted successfully!");
      // Remove the deleted post from the state
      setUserPosts(userPosts.filter(post => post._id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post. Please try again.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Profile Form Box */}
      <div className="rounded-lg border border-zinc-700/50 bg-zinc-800/50 p-6 backdrop-blur-sm">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-gray-200 text-xl font-semibold">
            My Interview Experiences
          </h3>
          <button
            onClick={() => navigate("/interview-experiences/create")}
            className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create New
          </button>
        </div>

        {userPosts.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-gray-400 mb-4">
              You haven't shared any interview experiences yet.
            </p>
            <p className="text-gray-500 text-sm">
              Share your experience to help others prepare better!
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {userPosts.map((post) => (
              <div
                key={post._id}
                className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 transition-colors hover:bg-zinc-900"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h4
                      className="cursor-pointer text-lg font-medium text-white hover:text-blue-400"
                      onClick={() =>
                        navigate(`/interview-experiences/post/${post._id}`)
                      }
                    >
                      {post.title}
                    </h4>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="rounded-full bg-blue-600/20 px-2 py-0.5 text-blue-400">
                        {post.company}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-400">{post.role}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-400">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        navigate(`/interview-experiences/post/${post._id}`)
                      }
                      className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white transition-colors hover:bg-blue-700"
                    >
                      View
                    </button>
                    <button
                      onClick={() => navigate(`/post/edit/${post._id}`)}
                      className="rounded bg-yellow-600 px-3 py-1.5 text-sm text-white transition-colors hover:bg-yellow-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="rounded bg-red-600 px-3 py-1.5 text-sm text-white transition-colors hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PostProfile;
