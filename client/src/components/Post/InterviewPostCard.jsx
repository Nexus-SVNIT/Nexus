import React from 'react';
import { Link } from 'react-router-dom';
import { FaEye, FaCommentAlt, FaQuestionCircle, FaLinkedin, FaMapMarkerAlt, FaArrowRight } from 'react-icons/fa';
import { HiOfficeBuilding } from 'react-icons/hi';

const truncateText = (text, limit) => {
  if (!text) return '';
  return text.length > limit ? text.substring(0, limit) + '…' : text;
};

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });

const campusColor = {
  'On Campus':   'bg-emerald-500/10 text-emerald-300 border-emerald-500/25',
  'Off Campus':  'bg-violet-500/10 text-violet-300 border-violet-500/25',
  'Pool Campus': 'bg-amber-500/10 text-amber-300 border-amber-500/25',
};

const jobTypeColor = {
  'Full Time':                      'bg-blue-500/10 text-blue-300 border-blue-500/25',
  '6 Month Internship':             'bg-cyan-500/10 text-cyan-300 border-cyan-500/25',
  '2 Month Internship':             'bg-sky-500/10 text-sky-300 border-sky-500/25',
  '6 Month Internship + Full Time': 'bg-indigo-500/10 text-indigo-300 border-indigo-500/25',
};

const InterviewPostCard = ({ post, handleCompanyClick, handleTagClick }) => {
  const campusCls = campusColor[post.campusType] || 'bg-zinc-800/60 text-zinc-400 border-zinc-700/50';
  const jobCls    = jobTypeColor[post.jobType]   || 'bg-zinc-800/60 text-zinc-400 border-zinc-700/50';

  return (
    <div className="group relative flex flex-col rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl shadow-xl overflow-hidden transition-all duration-300 hover:border-blue-500/30 hover:bg-white/[0.07] hover:shadow-blue-500/10">

      {/* Top accent line — animates on hover */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="flex flex-col gap-3.5 p-5 flex-1">

        {/* ── Row 1: Title + Date ── */}
        <div className="flex items-start justify-between gap-3">
          <Link
            to={`/interview-experiences/post/${post._id}`}
            className="text-[17px] font-bold text-white hover:text-blue-300 transition-colors leading-snug line-clamp-2 flex-1"
          >
            {post.title}
          </Link>
          <span className="flex-shrink-0 text-[11px] text-zinc-500 font-mono whitespace-nowrap mt-0.5">
            {formatDate(post.createdAt)}
          </span>
        </div>

        {/* ── Row 2: Company + Author ── */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <button
            onClick={(e) => { e.preventDefault(); handleCompanyClick(post.company); }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-blue-500/25 bg-blue-500/10 text-blue-300 text-xs font-semibold hover:bg-blue-500/20 hover:border-blue-400/40 transition-all"
          >
            <HiOfficeBuilding size={13} />
            {post.company}
          </button>

          {post.author && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-zinc-600 bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 rounded">
                #{post.author.admissionNumber}
              </span>
              {post.author.linkedInProfile ? (
                <a
                  href={post.author.linkedInProfile}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors group/auth"
                >
                  <span className="font-medium">{post.author.fullName}</span>
                  <FaLinkedin size={12} className="text-[#0A66C2] opacity-70 group-hover/auth:opacity-100 transition-opacity" />
                </a>
              ) : (
                <span className="text-xs text-zinc-400 font-medium">{post.author.fullName}</span>
              )}
            </div>
          )}
        </div>

        {/* ── Row 3: Meta badges ── */}
        <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-medium">
          {post.role && (
            <span className="px-2.5 py-1 rounded-lg border border-rose-500/25 bg-rose-500/10 text-rose-300 truncate max-w-[180px]" title={post.role}>
              {post.role}
            </span>
          )}
          {post.jobType && (
            <span className={`px-2.5 py-1 rounded-lg border ${jobCls}`}>{post.jobType}</span>
          )}
          {post.campusType && (
            <span className={`px-2.5 py-1 rounded-lg border ${campusCls}`}>{post.campusType}</span>
          )}
          {post.workMode && (
            <span className="px-2.5 py-1 rounded-lg border border-white/[0.08] bg-white/[0.04] text-zinc-400">
              {post.workMode}
            </span>
          )}
          {post.location && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-white/[0.08] bg-white/[0.04] text-zinc-400 max-w-[130px] truncate" title={Array.isArray(post.location) ? post.location.join(', ') : post.location}>
              <FaMapMarkerAlt size={9} className="flex-shrink-0 text-zinc-500" />
              {Array.isArray(post.location) ? post.location.join(', ') : post.location}
            </span>
          )}
          {post.stipend > 0 && (
            <span className="px-2.5 py-1 rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-300 font-mono">
              ₹{post.stipend?.toLocaleString('en-IN')}/mo
            </span>
          )}
        </div>

        {/* ── Row 4: Tags ── */}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 border-t border-white/[0.05] pt-3">
            {post.tags.slice(0, 5).map((tag, i) => (
              <button
                key={i}
                onClick={(e) => { e.preventDefault(); handleTagClick(tag); }}
                className="text-[10px] font-medium px-2 py-0.5 rounded-md border border-white/[0.07] bg-white/[0.04] text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.08] hover:border-white/[0.12] transition-all"
              >
                #{truncateText(tag, 18)}
              </button>
            ))}
            {post.tags.length > 5 && (
              <span className="text-[10px] text-zinc-600 bg-white/[0.03] px-2 py-0.5 rounded-md">
                +{post.tags.length - 5}
              </span>
            )}
          </div>
        )}

        {/* ── Row 5: Stats + CTA ── */}
        <div className="flex items-center justify-between gap-2 mt-auto pt-3 border-t border-white/[0.05]">
          <div className="flex items-center gap-4 text-[11px] text-zinc-600 font-medium">
            <span className="flex items-center gap-1.5 group-hover:text-zinc-400 transition-colors">
              <FaEye size={12} />
              {post.views || 0}
            </span>
            {post.comments?.length > 0 && (
              <span className="flex items-center gap-1.5">
                <FaCommentAlt size={11} />
                {post.comments.length}
              </span>
            )}
            {post.questions?.length > 0 && (
              <span className="hidden sm:flex items-center gap-1.5">
                <FaQuestionCircle size={11} />
                {post.questions.length}
              </span>
            )}
          </div>

          <Link
            to={`/interview-experiences/post/${post._id}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold border border-white/[0.08] bg-white/[0.04] text-zinc-400 hover:text-white hover:bg-blue-600/20 hover:border-blue-500/40 transition-all duration-200 group-hover:border-blue-500/25"
          >
            Read Experience
            <FaArrowRight size={10} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InterviewPostCard;