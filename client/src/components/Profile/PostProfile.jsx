import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FaPenAlt, FaEye, FaEdit, FaTrash, FaPlus, FaBuilding, FaExclamationTriangle } from "react-icons/fa";
import { HiOfficeBuilding } from "react-icons/hi";

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });

function PostProfile() {
  const navigate = useNavigate();
  const [userPosts, setUserPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchUserPosts = async () => {
    try {
      setError(null);
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/user/posts`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setUserPosts(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError("Failed to load your interview experiences. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUserPosts(); }, []);

  const handleDelete = async (postId) => {
    if (!window.confirm("Delete this experience? This action cannot be undone.")) return;
    setDeletingId(postId);
    try {
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/posts/${postId}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      toast.success("Post deleted.");
      setUserPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch {
      toast.error("Failed to delete. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  /* ── Loading skeleton ── */
  if (loading) {
    return (
      <div className="p-6 space-y-3 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 rounded-xl bg-white/[0.05]" />
        ))}
      </div>
    );
  }

  /* ── Error state ── */
  if (error) {
    return (
      <div className="p-8 flex flex-col items-center justify-center text-center">
        <FaExclamationTriangle className="text-red-400 text-3xl mb-3" />
        <p className="text-red-400 font-semibold mb-1">Failed to load posts</p>
        <p className="text-zinc-500 text-sm mb-4">{error}</p>
        <button onClick={fetchUserPosts} className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.07]">
        <div className="flex items-center gap-2">
          <FaPenAlt className="text-blue-400" size={14} />
          <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-widest">My Interview Experiences</h3>
          {userPosts.length > 0 && (
            <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/15 text-blue-300 border border-blue-500/25">
              {userPosts.length}
            </span>
          )}
        </div>
        <button
          onClick={() => navigate("/interview-experiences/create")}
          className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-sm font-semibold text-white hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-500/20"
        >
          <FaPlus size={11} />
          Add New
        </button>
      </div>

      {/* Posts list */}
      <div className="p-5">
        {userPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02]">
            <FaPenAlt className="text-zinc-700 text-3xl mb-3" />
            <p className="text-zinc-400 font-semibold text-sm">No experiences shared yet</p>
            <p className="text-zinc-600 text-xs mt-1">Help others by sharing your placement or internship journey!</p>
            <button
              onClick={() => navigate("/interview-experiences/create")}
              className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <FaPlus size={10} /> Share your first experience
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {userPosts.map((post) => (
              <div
                key={post._id}
                className="group flex items-start justify-between gap-3 rounded-xl border border-white/[0.07] bg-white/[0.03] p-4 transition-all hover:border-white/[0.12] hover:bg-white/[0.06]"
              >
                {/* Left: Info */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  <h4
                    className="text-sm font-semibold text-white hover:text-blue-300 cursor-pointer transition-colors line-clamp-1"
                    onClick={() => navigate(`/interview-experiences/post/${post._id}`)}
                  >
                    {post.title}
                  </h4>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-300 border border-blue-500/20">
                      <HiOfficeBuilding size={11} />
                      {post.company}
                    </span>
                    {post.role && (
                      <span className="px-2 py-0.5 rounded-md bg-white/[0.05] text-zinc-400 border border-white/[0.07] truncate max-w-[140px]">
                        {post.role}
                      </span>
                    )}
                    <span className="text-zinc-600 font-mono">{formatDate(post.createdAt)}</span>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-1.5 flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => navigate(`/interview-experiences/post/${post._id}`)}
                    title="View"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-zinc-400 hover:text-white hover:bg-blue-500/20 hover:border-blue-500/30 transition-all"
                  >
                    <FaEye size={12} />
                  </button>
                  <button
                    onClick={() => navigate(`/post/edit/${post._id}`)}
                    title="Edit"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-zinc-400 hover:text-white hover:bg-amber-500/20 hover:border-amber-500/30 transition-all"
                  >
                    <FaEdit size={12} />
                  </button>
                  <button
                    onClick={() => handleDelete(post._id)}
                    disabled={deletingId === post._id}
                    title="Delete"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-zinc-400 hover:text-white hover:bg-red-500/20 hover:border-red-500/30 transition-all disabled:opacity-50"
                  >
                    {deletingId === post._id
                      ? <span className="h-3 w-3 rounded-full border-2 border-red-400 border-t-transparent animate-spin" />
                      : <FaTrash size={11} />}
                  </button>
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
