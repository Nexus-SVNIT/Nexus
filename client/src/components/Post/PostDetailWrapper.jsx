import React from 'react';
import { useNavigate } from 'react-router-dom';

const PostDetailWrapper = ({ children }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 px-4 py-6 md:px-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Experiences
        </button>
        
        <div className="bg-zinc-800/50 rounded-xl shadow-xl backdrop-blur-sm border border-zinc-700/50">
          {children}
        </div>
      </div>
    </div>
  );
};

export default PostDetailWrapper;
