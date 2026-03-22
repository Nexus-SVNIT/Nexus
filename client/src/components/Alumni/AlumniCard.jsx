import { LuBuilding, LuMapPin, LuExternalLink } from "react-icons/lu";
import { Badge } from "./Badge";
import { FaLinkedin, FaLinkedinIn } from "react-icons/fa6";

export function AlumniCard({ alumni, setFilters }) {
  const getInitials = (name) =>
    name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const handleLinkedInClick = () => {
    window.open(alumni.linkedInProfile, "_blank");
  };

  const handleExpertiseClick = (skill) => {
    setFilters({
      expertise: skill,
    })
  };

  return (
    <div className="group text-gray-100 rounded-2xl border border-zinc-800/60 bg-[#09090b]/80 p-6 shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/30 hover:bg-zinc-900/90 hover:shadow-[0_8px_30px_rgba(34,211,238,0.12)]">
      {/* Header Section */}

      <div className="mb-4 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-cyan-500/30 bg-gradient-to-br from-cyan-900/80 to-blue-900/80 object-cover ring-2 ring-zinc-800/50 transition-all duration-300 group-hover:ring-cyan-500/50 text-xl font-bold text-cyan-100 shadow-[0_0_15px_rgba(34,211,238,0.15)]">
          {getInitials(alumni.fullName)}
        </div>

        {/* Name */}
        <div className="min-w-0 flex-1 flex flex-col justify-center">
          <h3 className="text-lg font-bold tracking-tight text-white transition-colors group-hover:text-cyan-300">
            {alumni.fullName}
          </h3>
        </div>

        {/* LinkedIn Button */}
        {alumni.linkedInProfile && (
          <button
            onClick={handleLinkedInClick}
            className="group flex h-10 w-10 items-center justify-center rounded-2xl border border-white/[0.12] bg-white/[0.08] backdrop-blur-xl transition-all duration-300 hover:border-white/[0.2] hover:bg-white/[0.15] hover:shadow-lg hover:shadow-white/[0.05] active:scale-95"
          >
            <FaLinkedinIn className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Content Section */}
      <div className="space-y-4">
        <div className="space-y-2">
          {/* Position and Company */}
          <div className="flex items-center gap-2 text-sm text-zinc-300">
            <LuBuilding className="h-4 w-4 text-cyan-400" />
            <span className="font-medium tracking-wide">
              {alumni.currentDesignation || "N/A"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <LuMapPin className="h-4 w-4 flex-shrink-0 text-cyan-500/70" />
            <span className="text-sm tracking-wide text-zinc-400">
              {alumni.currentCompany || "N/A"}{" "}
              {alumni.location && " • " && (
                <span className="text-sm text-zinc-500">
                  {alumni.location}
                </span>
              )}
            </span>
            {/* <span className="text-[#6c757d] truncate">Bangalore, India</span> */}
          </div>
        </div>

        {/* Expertise Badges */}
        {alumni.expertise && alumni.expertise.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-foreground text-sm font-medium">Expertise</h4>
            <div className="flex flex-wrap gap-2">
              {alumni.expertise.map((skill, index) => (
                <Badge
                  key={index}
                  className="border-blue-400/20 bg-blue-400/10 text-blue-400 hover:bg-blue-400/20 hover:cursor-pointer"
                  onClick={() => handleExpertiseClick(skill)}
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
