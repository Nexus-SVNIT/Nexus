import React from 'react';
import PostDetailWrapper from './PostDetailWrapper';

const InterviewPostSkeleton = () => {
  return (
    <PostDetailWrapper>
      <div className="p-4 sm:p-8 max-w-7xl mx-auto animate-pulse">
        {/* Header */}
        <div className="mb-10 space-y-6 border-b border-zinc-800/60 pb-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="h-10 md:h-12 w-full max-w-4xl rounded-lg bg-zinc-700/50"></div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-32 rounded-xl bg-zinc-700/50"></div>
              <span className="text-gray-500 uppercase tracking-widest text-[10px] font-bold px-2">|</span>
              <div className="h-5 w-32 rounded bg-zinc-700/50"></div>
            </div>

            <div className="flex items-center gap-6">
              <div className="h-8 w-24 rounded-lg bg-zinc-700/50"></div>
              <div className="flex items-center gap-3 bg-zinc-900/40 border border-zinc-800/60 pl-3 pr-4 py-1.5 rounded-full backdrop-blur-sm">
                <div className="h-5 w-16 rounded bg-zinc-700/50"></div>
                <div className="h-5 w-32 rounded bg-zinc-700/50"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          {/* Left Column - Main Content */}
          <div className="order-2 space-y-10 lg:order-1 lg:col-span-3">
            <div className="bg-zinc-900/20 p-6 md:p-8 rounded-2xl border border-zinc-800/40 shadow-lg space-y-4">
              <div className="h-4 w-full rounded bg-zinc-700/50"></div>
              <div className="h-4 w-11/12 rounded bg-zinc-700/50"></div>
              <div className="h-4 w-full rounded bg-zinc-700/50"></div>
              <div className="h-4 w-5/6 rounded bg-zinc-700/50"></div>
              <div className="h-4 w-full rounded bg-zinc-700/50"></div>
              <div className="h-4 w-4/5 rounded bg-zinc-700/50 pt-4"></div>
              <div className="h-4 w-full rounded bg-zinc-700/50"></div>
              <div className="h-4 w-11/12 rounded bg-zinc-700/50"></div>
              <div className="h-4 w-5/6 rounded bg-zinc-700/50"></div>
              <div className="h-4 w-full rounded bg-zinc-700/50"></div>
              <div className="h-4 w-3/4 rounded bg-zinc-700/50 pt-4"></div>
              <div className="h-4 w-full rounded bg-zinc-700/50"></div>
              <div className="h-4 w-11/12 rounded bg-zinc-700/50"></div>
              <div className="h-4 w-5/6 rounded bg-zinc-700/50"></div>
            </div>

            {/* Comments and Questions Section */}
            <div className="space-y-10 border-t border-zinc-800/60 pt-10">
              <div className="bg-zinc-900/40 border border-zinc-800/50 p-6 rounded-2xl backdrop-blur-sm shadow-xl">
                <div className="h-6 w-48 rounded bg-zinc-700/50 mb-6"></div>
                <div className="space-y-8">
                  <div>
                    <div className="h-4 w-32 rounded bg-zinc-700/50 mb-2"></div>
                    <div className="w-full rounded-xl bg-zinc-700/30 h-24"></div>
                    <div className="flex justify-end mt-3">
                      <div className="h-9 w-32 rounded-lg bg-zinc-700/50"></div>
                    </div>
                  </div>
                  <div className="border-t border-zinc-800/50 pt-8">
                    <div className="h-4 w-48 rounded bg-zinc-700/50 mb-2"></div>
                    <div className="w-full rounded-xl bg-zinc-700/30 h-24"></div>
                    <div className="flex justify-end mt-3">
                      <div className="h-9 w-32 rounded-lg bg-zinc-700/50"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Interview Details */}
          <div className="order-1 lg:order-2 lg:col-span-2 space-y-6">
            
            {/* Quick Overview Card */}
            <div className="rounded-2xl bg-zinc-900/40 border border-zinc-800/60 p-6 shadow-xl backdrop-blur-sm">
              <div className="h-6 w-32 rounded bg-zinc-700/50 mb-5"></div>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div key={item} className="flex justify-between items-start border-b border-zinc-800 pb-3">
                    <div className="h-4 w-24 rounded bg-zinc-700/50"></div>
                    <div className="h-4 w-32 rounded bg-zinc-700/50"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Compensation & Process Card */}
            <div className="rounded-2xl bg-zinc-900/40 border border-zinc-800/60 p-6 shadow-xl backdrop-blur-sm">
              <div className="h-6 w-40 rounded bg-zinc-700/50 mb-5"></div>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div key={item} className="flex justify-between items-start border-b border-zinc-800 pb-3">
                    <div className="h-4 w-28 rounded bg-zinc-700/50"></div>
                    <div className="h-4 w-32 rounded bg-zinc-700/50"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Placement Statistics Card */}
            <div className="rounded-2xl bg-zinc-900/40 border border-zinc-800/60 p-6 shadow-xl backdrop-blur-sm">
              <div className="h-6 w-40 rounded bg-zinc-700/50 mb-5"></div>
              <div className="space-y-4">
                <div className="flex flex-col gap-2 border-b border-zinc-800 pb-3">
                  <div className="h-3 w-32 rounded bg-zinc-700/50"></div>
                  <div className="h-4 w-48 rounded bg-zinc-700/50"></div>
                </div>
                <div className="flex flex-col gap-2 border-b border-zinc-800 pb-3">
                  <div className="h-3 w-32 rounded bg-zinc-700/50"></div>
                  <div className="h-4 w-48 rounded bg-zinc-700/50"></div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-1">
                  <div className="bg-zinc-800/50 rounded-xl p-3 border border-zinc-700/50 space-y-2">
                    <div className="h-3 w-20 rounded bg-zinc-700/50"></div>
                    <div className="h-5 w-24 rounded bg-zinc-700/50"></div>
                  </div>
                  <div className="bg-zinc-800/50 rounded-xl p-3 border border-zinc-700/50 space-y-2">
                    <div className="h-3 w-20 rounded bg-zinc-700/50"></div>
                    <div className="h-5 w-24 rounded bg-zinc-700/50"></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Tags Box */}
            <div className="pt-2">
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3].map(item => (
                  <div key={item} className="h-7 w-20 rounded-lg bg-zinc-700/50"></div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </PostDetailWrapper>
  );
};

export default InterviewPostSkeleton;
