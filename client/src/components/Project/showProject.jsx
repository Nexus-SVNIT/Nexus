import React, { useState, useEffect } from 'react';
import increamentCounter from '../../libs/increamentCounter';
import MaintenancePage from '../Error/MaintenancePage';
import HeadTags from '../HeadTags/HeadTags';
import { FaGithub, FaLinkedin, FaSearch, FaUsers, FaUserTie, FaCode, FaExternalLinkAlt } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';
import { SiGithub } from 'react-icons/si';

/* ─── Avatar initials helper ─────────────────────────────────────── */
const getInitials = (name = '') =>
  name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || '')
    .join('');

const AVATAR_COLORS = [
  'from-blue-500 to-indigo-600',
  'from-violet-500 to-purple-600',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-pink-600',
  'from-cyan-500 to-sky-600',
];
const getAvatarColor = (name = '') => {
  let sum = 0;
  for (const c of name) sum += c.charCodeAt(0);
  return AVATAR_COLORS[sum % AVATAR_COLORS.length];
};

/* ─── Normalize LinkedIn URL ─────────────────────────────────────── */
const normalizeLinkedIn = (raw) => {
  if (!raw || !raw.trim()) return null;
  const s = raw.trim();
  if (s.startsWith('http://') || s.startsWith('https://')) return s;
  // bare username like "johndoe" or "in/johndoe"
  const clean = s.replace(/^\/?(in\/)?/, '');
  return `https://linkedin.com/in/${clean}`;
};

/* ─── Member chip ────────────────────────────────────────────────── */
const MemberChip = ({ member }) => {
  const color = getAvatarColor(member.name);
  const linkedInUrl = normalizeLinkedIn(member.linkedin);
  const chip = (
    <div className="flex items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.04] px-2.5 py-1.5 transition-all duration-200 hover:border-white/[0.14] hover:bg-white/[0.08] group">
      {/* Avatar */}
      <div
        className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${color} text-[10px] font-black text-white shadow`}
      >
        {getInitials(member.name)}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-zinc-200 truncate leading-tight">
          {member.name}
        </p>
        <p className="text-[10px] text-zinc-500 font-mono leading-tight">
          {member.admissionNumber}
        </p>
      </div>
      {linkedInUrl && (
        <FaLinkedin
          className="ml-auto flex-shrink-0 text-[#0A66C2] opacity-0 group-hover:opacity-100 transition-opacity"
          size={12}
        />
      )}
    </div>
  );

  return linkedInUrl ? (
    <a href={linkedInUrl} target="_blank" rel="noopener noreferrer">
      {chip}
    </a>
  ) : (
    chip
  );
};

/* ─── Project Card ───────────────────────────────────────────────── */
const ProjectCard = ({ project, index }) => {
  const [expanded, setExpanded] = useState(false);
  const accentColors = [
    { border: 'hover:border-blue-500/40', glow: 'from-blue-500/10', dot: 'bg-blue-400', tag: 'bg-blue-500/10 text-blue-300 border-blue-500/20' },
    { border: 'hover:border-violet-500/40', glow: 'from-violet-500/10', dot: 'bg-violet-400', tag: 'bg-violet-500/10 text-violet-300 border-violet-500/20' },
    { border: 'hover:border-emerald-500/40', glow: 'from-emerald-500/10', dot: 'bg-emerald-400', tag: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' },
    { border: 'hover:border-amber-500/40', glow: 'from-amber-500/10', dot: 'bg-amber-400', tag: 'bg-amber-500/10 text-amber-300 border-amber-500/20' },
    { border: 'hover:border-rose-500/40', glow: 'from-rose-500/10', dot: 'bg-rose-400', tag: 'bg-rose-500/10 text-rose-300 border-rose-500/20' },
    { border: 'hover:border-cyan-500/40', glow: 'from-cyan-500/10', dot: 'bg-cyan-400', tag: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20' },
  ];
  const accent = accentColors[index % accentColors.length];

  return (
    <div
      className={`relative flex flex-col rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl shadow-2xl overflow-hidden transition-all duration-300 ${accent.border}`}
    >
      {/* Top gradient shimmer */}
      <div className={`pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${accent.glow} to-transparent`} />

      {/* Card body */}
      <div className="p-5 md:p-6 flex flex-col gap-4 flex-1">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* Status badge */}
            <div className="flex items-center gap-2 mb-2">
              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border ${accent.tag}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${accent.dot} animate-pulse`} />
                Active
              </span>
              <span className="text-[10px] text-zinc-600 font-mono">#{String(index + 1).padStart(2, '0')}</span>
            </div>
            <h2 className="text-lg md:text-xl font-bold text-white leading-snug line-clamp-2">
              {project.title}
            </h2>
          </div>
          {/* GitHub link button */}
          {project.githubLink && (
            <a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.10] bg-white/[0.06] text-zinc-300 hover:text-white hover:bg-white/[0.12] hover:border-white/20 transition-all duration-200 shadow"
              title="View on GitHub"
            >
              <SiGithub size={16} />
            </a>
          )}
        </div>

        {/* Description */}
        <p className={`text-sm text-zinc-400 leading-relaxed ${!expanded && 'line-clamp-3'}`}>
          {project.description}
        </p>
        {project.description?.length > 140 && (
          <button
            onClick={() => setExpanded((p) => !p)}
            className="self-start text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
          >
            {expanded ? 'Show less ↑' : 'Read more ↓'}
          </button>
        )}

        {/* Stats row */}
        <div className="flex items-center gap-3 text-xs text-zinc-500 font-mono border-t border-white/[0.05] pt-3">
          <span className="flex items-center gap-1.5">
            <FaUsers size={11} className="text-zinc-400" />
            {project.teamMembers?.length || 0} members
          </span>
          <span className="text-zinc-700">·</span>
          <span className="flex items-center gap-1.5">
            <FaUserTie size={11} className="text-zinc-400" />
            {project.mentors?.length || 0} mentor{project.mentors?.length !== 1 ? 's' : ''}
          </span>
          {project.githubLink && (
            <>
              <span className="text-zinc-700">·</span>
              <a
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-zinc-400 hover:text-white transition-colors"
              >
                <FaExternalLinkAlt size={9} />
                GitHub
              </a>
            </>
          )}
        </div>

        {/* Team Members */}
        {project.teamMembers?.length > 0 && (
          <div>
            <p className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mb-2">
              <FaUsers size={10} />
              Team
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {project.teamMembers.map((m, i) => (
                <MemberChip key={i} member={m} role="member" />
              ))}
            </div>
          </div>
        )}

        {/* Mentors */}
        {project.mentors?.length > 0 && (
          <div>
            <p className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mb-2">
              <FaUserTie size={10} />
              Mentored by
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {project.mentors.map((m, i) => (
                <MemberChip key={i} member={m} role="mentor" />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── Skeleton Card ──────────────────────────────────────────────── */
const SkeletonCard = () => (
  <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 flex flex-col gap-4 animate-pulse">
    <div className="flex items-start justify-between">
      <div className="flex-1 space-y-2">
        <div className="h-3 w-16 rounded-full bg-white/[0.08]" />
        <div className="h-5 w-3/4 rounded-lg bg-white/[0.08]" />
      </div>
      <div className="h-9 w-9 rounded-xl bg-white/[0.06]" />
    </div>
    <div className="space-y-2">
      <div className="h-3 w-full rounded bg-white/[0.06]" />
      <div className="h-3 w-5/6 rounded bg-white/[0.06]" />
      <div className="h-3 w-4/6 rounded bg-white/[0.06]" />
    </div>
    <div className="h-px bg-white/[0.05]" />
    <div className="space-y-1.5">
      <div className="h-3 w-12 rounded bg-white/[0.06]" />
      <div className="grid grid-cols-2 gap-1.5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-10 rounded-lg bg-white/[0.05]" />
        ))}
      </div>
    </div>
  </div>
);

/* ─── Main Page ──────────────────────────────────────────────────── */
const ShowProject = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/projects/ongoing`
        );
        if (!response.ok) throw new Error('Failed to fetch ongoing projects');
        const data = await response.json();
        setProjects(data);
      } catch {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
    increamentCounter();
  }, []);

  if (isError) return <MaintenancePage />;

  const filtered = projects.filter(
    (p) =>
      !search ||
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase()) ||
      p.teamMembers?.some((m) =>
        m.name?.toLowerCase().includes(search.toLowerCase())
      ) ||
      p.mentors?.some((m) =>
        m.name?.toLowerCase().includes(search.toLowerCase())
      )
  );

  return (
    <div className="min-h-screen py-8 px-4">
      <HeadTags
        title="Ongoing Projects | Nexus - NIT Surat"
        description="Check out the ongoing projects of Nexus built and mentored by Nexus Members."
        keywords="Nexus NIT Surat, Ongoing Projects, Projects, Nexus Projects, NIT Surat Projects"
      />

      <div className="w-full max-w-6xl mx-auto">
        {/* ── Page Header ── */}
        <div className="mb-8">
          <p className="text-xs font-mono text-blue-400 uppercase tracking-widest mb-2">
            {"// projects"}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            What we're building.{' '}
            <span className="text-zinc-400">Right now.</span>
          </h1>
          <p className="text-zinc-500 text-sm mt-2">
            Ongoing projects by Nexus members — built in the open, mentored by seniors.
          </p>
        </div>

        {/* ── Search + Stats bar ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          {/* Search */}
          <div className="relative w-full sm:max-w-xs">
            <FaSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
              size={12}
            />
            <input
              type="text"
              placeholder="Search projects or members…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-white/[0.08] bg-white/[0.04] text-sm text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20 backdrop-blur transition-all"
            />
          </div>

          {/* Stats chips */}
          {!isLoading && (
            <div className="flex items-center gap-2 text-xs flex-wrap">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-white/[0.08] bg-white/[0.04] text-zinc-400">
                <HiSparkles className="text-blue-400" />
                {filtered.length} project{filtered.length !== 1 ? 's' : ''}
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-white/[0.08] bg-white/[0.04] text-zinc-400">
                <FaUsers className="text-emerald-400" size={10} />
                {projects.reduce((a, p) => a + (p.teamMembers?.length || 0), 0)} devs
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-white/[0.08] bg-white/[0.04] text-zinc-400">
                <FaUserTie className="text-amber-400" size={10} />
                {projects.reduce((a, p) => a + (p.mentors?.length || 0), 0)} mentors
              </span>
            </div>
          )}
        </div>

        {/* ── Grid ── */}
        {isLoading ? (
          <div className="grid gap-5 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02]">
            <FaCode className="text-zinc-600 text-4xl mb-3" />
            <p className="text-zinc-400 font-semibold text-sm">No projects found</p>
            <p className="text-zinc-600 text-xs mt-1">
              {search ? `No results for "${search}"` : 'No ongoing projects yet.'}
            </p>
            {search && (
              <button
                onClick={() => setSearch('')}
                className="mt-3 text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((project, index) => (
              <ProjectCard key={project._id} project={project} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowProject;
