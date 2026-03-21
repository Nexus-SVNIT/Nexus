import React from 'react';
import { Link } from 'react-router-dom';

const InterviewPostCard = ({ post, handleCompanyClick, handleTagClick }) => {
  // Add truncate helper function
  const truncateText = (text, limit) => {
    if (!text) return '';
    return text.length > limit ? text.substring(0, limit) + '...' : text;
  };

  return (
    <div className="cursor-pointer group flex flex-col rounded-xl border border-zinc-700/50 bg-zinc-900/60 p-5 transition-all duration-300 hover:border-blue-500/30 hover:bg-zinc-800/60 w-full h-full relative overflow-hidden">
      {/* Title and Date */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-3 relative z-10">
        <Link 
          to={`/interview-experiences/post/${post._id}`}
          className="text-xl font-bold text-white hover:text-blue-400 transition-colors w-full truncate md:pr-5"
          title={post.title}
        >
          <div className="truncate">
            {post.title}
          </div>
        </Link>
        {/* Date - hidden on mobile, shown on desktop */}
        <span className="hidden sm:block text-sm text-gray-400 whitespace-nowrap">
          {new Date(post.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </span>
      </div>

      {/* Company and Date (mobile) / Author Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-3 gap-3 truncate relative z-10">
        {/* Company and Date - same line on mobile */}
        <div className="flex items-center justify-between w-full sm:w-auto gap-2">
          <button 
            className="px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-500/20 hover:border-blue-500/40 transition-all cursor-pointer inline-flex items-center"
            onClick={(e) => { e.preventDefault(); handleCompanyClick(post.company); }}
          >
            <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {post.company}
          </button>
          {/* Date - shown on mobile, hidden on desktop */}
          <span className="sm:hidden text-xs text-gray-400 whitespace-nowrap bg-zinc-800/80 px-2.5 py-1 rounded-md">
            {new Date(post.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </span>
        </div>
        
        {/* Author Info */}
        {post.author && (
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-zinc-500 bg-zinc-800/50 px-2 py-0.5 rounded">
              #{post.author.admissionNumber}
            </span>
            <a
              href={post.author.linkedInProfile}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="group/author text-sm text-gray-300 hover:text-white transition-colors flex items-center gap-2"
            >
              <span className="font-medium">{post.author.fullName}</span>
              <svg className="w-4 h-4 text-[#0A66C2] opacity-80 group-hover/author:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="mt-4 mb-3 truncate relative z-10 w-full overflow-hidden">
        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
          {post.role && (
            <span 
              title={post.role} 
              className="border border-blue-500/30 bg-blue-500/10 text-blue-400 font-medium px-2.5 py-1 rounded-md shrink-0 max-w-[150px] truncate"
            >
              {post.role}
            </span>
          )}
          {post.jobType && (
            <span className="bg-zinc-800/80 px-2.5 py-1 rounded-md text-gray-300 shrink-0">
              {post.jobType}
            </span>
          )}
          {post.campusType && (
            <span className="bg-zinc-800/80 px-2.5 py-1 rounded-md text-gray-300 shrink-0">
              {post.campusType}
            </span>
          )}
          {post.workMode && (
            <span className="bg-zinc-800/80 px-2.5 py-1 rounded-md text-gray-300 shrink-0">
              {post.workMode}
            </span>
          )}
          {post.location && (
            <span 
              title={Array.isArray(post.location) ? post.location.join(', ') : post.location} 
              className="bg-zinc-800/80 px-2.5 py-1 rounded-md text-gray-300 inline-block max-w-[100px] sm:max-w-[150px] truncate shrink-0"
            >
              {Array.isArray(post.location) ? post.location.join(', ') : post.location}
            </span>
          )}
        </div>
      </div>

      {/* Tags */}
      <div className="mb-4 overflow-hidden relative z-10">
        <div className="flex flex-wrap gap-1.5 md:gap-2 border-t border-zinc-800/50 pt-3 mt-1">
          {post.tags.slice(0, window.innerWidth >= 768 ? 5 : 3).map((tag, index) => (
            <button 
              key={index} 
              className="bg-zinc-800/40 border border-zinc-700/30 text-zinc-400 text-[11px] font-medium px-2.5 py-1 rounded-md hover:bg-zinc-700 hover:text-zinc-200 transition-colors cursor-pointer shrink-0"
              onClick={(e) => { e.preventDefault(); handleTagClick(tag); }}
            >
              #{truncateText(tag, window.innerWidth >= 768 ? 18 : 12)}
            </button>
          ))}
          {post.tags.length > (window.innerWidth >= 768 ? 5 : 3) && (
            <span className="text-[11px] font-medium text-gray-500 bg-zinc-800/20 px-2 py-1 rounded-md shrink-0">
              +{post.tags.length - (window.innerWidth >= 768 ? 5 : 3)} more
            </span>
          )}
        </div>
      </div>

      {/* Interaction Stats and Show More */}
      <div className="flex justify-between items-center gap-2 mt-auto relative z-10 pt-2 border-t border-zinc-800/50">
        <div className="flex items-center gap-5 text-[11px] sm:text-xs text-zinc-500 font-medium tracking-wide">
          <span className="flex items-center gap-1.5 group-hover:text-blue-400/80 transition-colors">
            <svg className="w-4 h-4 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {post.views || 0}
          </span>
          {
            post.comments?.length > 0 && (
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {post.comments.length}
              </span>
            )
          }
          {
            post.questions?.length > 0 && (
              <span className="flex items-center gap-1.5 hidden sm:flex">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {post.questions.length}
              </span>
            )
          }
        </div>

        {/* Show More Button */}
        <Link 
          to={`/interview-experiences/post/${post._id}`}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-zinc-800 text-gray-300 rounded-lg group-hover:bg-blue-600/10 group-hover:text-blue-400 group-hover:border-blue-500/20 border border-zinc-700 transition-all duration-300 text-sm font-medium shrink-0"
        >
          <span className="hidden sm:inline">Read Experience</span>
          <span className="sm:hidden">Read</span>
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default InterviewPostCard;