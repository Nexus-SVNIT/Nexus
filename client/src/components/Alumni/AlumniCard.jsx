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
    <div className="text-gray-100 rounded-2xl border border-white/10 bg-[#0f0f0f] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-elegant">
      {/* Header Section */}

      <div className="mb-4 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-500/80 text-xl font-bold text-white">
          {getInitials(alumni.fullName)}
        </div>

        {/* Name and Graduation Year */}
        <div className="min-w-0 flex-1">
          <h3 className="text-xl font-semibold text-white">
            {alumni.fullName}
          </h3>
          {alumni.passingYear && (
            <p className="text-gray-400 text-sm">
              Class of {alumni.passingYear}
            </p>
          )}
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
          <div className="flex items-center gap-2 text-sm">
            <LuBuilding className="h-4 w-4 text-blue-400" />
            <span className="font-medium">
              {alumni.currentDesignation || "N/A"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <LuMapPin className="h-4 w-4 flex-shrink-0 text-[#6c757d]" />
            <span className="">
              {alumni.currentCompany || "N/A"}{" "}
              {alumni.location && " • " && (
                <span className="text-md text-[#6c757d]">
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
