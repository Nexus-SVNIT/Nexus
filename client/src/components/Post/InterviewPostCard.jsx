import React from 'react';
import { Link } from 'react-router-dom';

const InterviewPostCard = ({ post, handleCompanyClick, handleTagClick }) => {
  // Add truncate helper function
  const truncateText = (text, limit) => {
    if (!text) return '';
    return text.length > limit ? text.substring(0, limit) + '...' : text;
  };

  return (
    <div className="bg-zinc-900 hover:bg-zinc-800 rounded-lg hover:shadow-zinc-700 p-4 hover:shadow-md transition duration-200">
      {/* Title and Date */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
        <Link 
          to={`/interview-experiences/post/${post._id}`}
          className="text-xl font-bold text-white hover:text-blue-400 transition-colors max-w-[500px]"
          title={post.title}
        >
          <div className="truncate">
            {truncateText(post.title, 40)}
          </div>
        </Link>
        <span className="text-sm text-gray-400 whitespace-nowrap">
          {new Date(post.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </span>
      </div>

      {/* Author and Company Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-2 gap-2">
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

      {/* Quick Stats - Modified */}
      <div className="mt-3 flex flex-wrap gap-2 text-sm text-gray-400">
        <span title={post.role} className="max-w-[200px] truncate">
          {truncateText(post.role, 15)}
        </span>
        <span>•</span>
        <span>{post.jobType}</span>
        <span>•</span>
        <span>{post.campusType}</span>
        <span>•</span>
        <span>{post.workMode}</span>
        <span>•</span>
        <span title={Array.isArray(post.location) ? post.location.join(', ') : post.location} className="max-w-[200px] truncate">
          {truncateText(Array.isArray(post.location) ? post.location.join(', ') : post.location, 15)}
        </span>
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
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {post.views || 0} views
          </span>
          <span>{post.comments?.length || 0} comments</span>
          <span>{post.questions?.length || 0} questions</span>
        </div>

        {/* Show More Button */}
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