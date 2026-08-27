import React from 'react';

const InterviewPostCardSkeleton = () => {
  return (
    <div className="flex flex-col rounded-xl border border-zinc-700/50 bg-zinc-900/60 p-5 w-full h-full relative overflow-hidden animate-pulse">
      {/* Title and Date */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-3 relative z-10">
        <div className="h-6 w-3/4 rounded bg-zinc-700/50"></div>
        <div className="hidden sm:block h-5 w-24 rounded bg-zinc-700/50"></div>
      </div>

      {/* Company and Date (mobile) / Author Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-3 gap-3 relative z-10 w-full">
        {/* Company and Date - same line on mobile */}
        <div className="flex items-center justify-between w-full sm:w-auto gap-2">
          <div className="h-8 w-28 rounded-lg bg-zinc-700/50"></div>
          <div className="sm:hidden h-6 w-20 rounded-md bg-zinc-700/50"></div>
        </div>
        
        {/* Author Info */}
        <div className="flex items-center gap-3">
          <div className="h-5 w-16 rounded bg-zinc-700/50"></div>
          <div className="h-5 w-32 rounded bg-zinc-700/50"></div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-4 mb-3 relative z-10 w-full">
        <div className="flex flex-wrap items-center gap-2">
          <div className="h-6 w-24 rounded-md bg-zinc-700/50"></div>
          <div className="h-6 w-20 rounded-md bg-zinc-700/50"></div>
          <div className="h-6 w-28 rounded-md bg-zinc-700/50"></div>
          <div className="h-6 w-24 rounded-md bg-zinc-700/50"></div>
          <div className="h-6 w-20 rounded-md bg-zinc-700/50"></div>
        </div>
      </div>

      {/* Tags */}
      <div className="mb-4 relative z-10">
        <div className="flex flex-wrap gap-2 border-t border-zinc-800/50 pt-3 mt-1">
          <div className="h-6 w-16 rounded-md bg-zinc-700/50"></div>
          <div className="h-6 w-24 rounded-md bg-zinc-700/50"></div>
          <div className="h-6 w-20 rounded-md bg-zinc-700/50"></div>
        </div>
      </div>

      {/* Interaction Stats and Show More */}
      <div className="flex justify-between items-center gap-2 mt-auto relative z-10 pt-2 border-t border-zinc-800/50">
        <div className="flex items-center gap-5">
          <div className="h-4 w-12 rounded bg-zinc-700/50"></div>
          <div className="h-4 w-12 rounded bg-zinc-700/50"></div>
          <div className="hidden sm:block h-4 w-12 rounded bg-zinc-700/50"></div>
        </div>
        <div className="h-8 w-32 rounded-lg bg-zinc-700/50"></div>
      </div>
    </div>
  );
};

export default InterviewPostCardSkeleton;
