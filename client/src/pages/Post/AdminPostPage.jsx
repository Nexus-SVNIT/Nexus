import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

const AdminPostPage = () => {
  const [pendingPosts, setPendingPosts] = useState([]);
  const coreToken = localStorage.getItem('core-token');

  const fetchPendingPosts = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/posts/pending`,
        {
          headers: { 'Authorization': `Bearer ${coreToken}` }
        }
      );
      setPendingPosts(response.data);
    } catch (error) {
        console.log(error)
      toast.error('Error fetching pending posts');
    }
  };

  const handleVerify = async (postId) => {
    try {
      const loadingToast = toast.loading('Verifying post...');
      await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/posts/${postId}/verify`,
        {},
        {
          headers: { 'Authorization': `Bearer ${coreToken}` }
        }
      );
      toast.dismiss(loadingToast);
      toast.success('Post verified successfully');
      setPendingPosts(posts => posts.filter(post => post._id !== postId));
    } catch (error) {
      toast.error('Error verifying post');
    }
  };

  useEffect(() => {
    fetchPendingPosts();
  }, []);

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-white">Pending Posts</h2>
      <div className="space-y-4">
        {pendingPosts.map(post => (
          <div key={post._id} className="bg-zinc-800 p-4 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl text-white mb-2">{post.title}</h3>
                <p className="text-gray-400">by {post.author.fullName}</p>
                <p className="text-gray-400">Company: {post.company}</p>
                <Link 
                  to={`/core/admin/verify-posts/${post._id}`}
                  className="text-blue-400 hover:text-blue-300 text-sm mt-2 inline-block"
                >
                  View Details
                </Link>
              </div>
              <button
                onClick={() => handleVerify(post._id)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-200"
              >
                Verify Post
              </button>
            </div>
          </div>
        ))}
        {pendingPosts.length === 0 && (
          <p className="text-gray-400">No pending posts to verify</p>
        )}
      </div>
    </div>
  );
};

export default AdminPostPage;
