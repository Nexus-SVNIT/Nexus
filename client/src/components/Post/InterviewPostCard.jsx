import React from 'react';
import { Link } from 'react-router-dom';

const InterviewPostCard = ({ post, handleCompanyClick, handleTagClick }) => {
  return (
    <div className="bg-zinc-900 rounded-lg shadow-zinc-800 shadow-lg p-4 hover:shadow-xl transition duration-200">
      {/* Title and Date */}
      <div className="flex justify-between items-start">
        <Link 
          to={`/interview-experiences/post/${post._id}`}
          className="text-xl font-bold text-white hover:text-blue-400 transition-colors"
        >
          {post.title}
        </Link>
        <span className="text-sm text-gray-400">
          {new Date(post.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </span>
      </div>

      {/* Author and Company Info */}
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

      {/* Quick Stats */}
      <div className="mt-3 flex flex-wrap gap-3 text-sm text-gray-400">
        <span>{post.jobType}</span>
        <span>•</span>
        <span>{post.workMode}</span>
        <span>•</span>
        <span className="flex gap-1">
          {Array.isArray(post.location) ? post.location.join(', ') : post.location}
        </span>
        {post.compensation?.stipend && (
          <>
            <span>•</span>
            <span>₹{post.compensation.stipend}/month</span>
          </>
        )}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mt-3">
        {post.tags.map((tag, index) => (
          <button 
            key={index} 
            className="bg-zinc-800/50 text-zinc-300 text-xs px-2 py-1 rounded-full hover:bg-zinc-800/70 transition-colors cursor-pointer inline-flex items-center"
            onClick={() => handleTagClick(tag)}
          >
            #{tag}
          </button>
        ))}
      </div>

      {/* Interaction Stats and Show More */}
      <div className="mt-4 flex justify-between items-center">
        <div className="flex gap-4 text-sm text-gray-400">
          <span>{post.comments?.length || 0} comments</span>
          <span>{post.questions?.length || 0} questions</span>
        </div>
        <Link 
          to={`/interview-experiences/post/${post._id}`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-all duration-200"
        >
          Show More
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default InterviewPostCard;
