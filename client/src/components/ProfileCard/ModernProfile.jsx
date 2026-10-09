import { FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { MdOutgoingMail } from "react-icons/md";
import { SiGooglescholar } from "react-icons/si";
import { ImProfile } from "react-icons/im";

import { Link } from "react-router-dom";
import { SocialIcon } from "react-social-icons";

const getRoleBadgeStyle = (role = "") => {
  const r = role.toLowerCase();
  if (r.includes("chair") || r.includes("lead") || r.includes("advisor") || r.includes("professor")) {
    return "border-amber-500/40 bg-amber-500/10 text-amber-300 shadow-amber-950/20";
  }
  if (r.includes("web") || r.includes("dev") || r.includes("tech") || r.includes("software")) {
    return "border-cyan-500/40 bg-cyan-500/10 text-cyan-300 shadow-cyan-950/20";
  }
  if (r.includes("ai") || r.includes("ml") || r.includes("data") || r.includes("research")) {
    return "border-purple-500/40 bg-purple-500/10 text-purple-300 shadow-purple-950/20";
  }
  if (r.includes("cp") || r.includes("coding") || r.includes("algo")) {
    return "border-blue-500/40 bg-blue-500/10 text-blue-300 shadow-blue-950/20";
  }
  if (r.includes("design") || r.includes("media") || r.includes("pr") || r.includes("event")) {
    return "border-pink-500/40 bg-pink-500/10 text-pink-300 shadow-pink-950/20";
  }
  return "border-zinc-700/60 bg-zinc-800/90 text-zinc-300";
};

const ModernProfile = ({ profile, isFaculty }) => {
  const getImageUrl = (path) => {
    if (!path) return "/fallback.png";
    if (path.startsWith("http") || path.startsWith("data:")) return path;
    if (path.includes("/") || path.includes(".")) return `${process.env.REACT_APP_BACKEND_BASE_URL}/${path}`;
    return `https://drive.google.com/thumbnail?id=${path}&sz=w1000`;
  };

  const imageUrl = isFaculty
    ? profile.image
    : getImageUrl(profile.image);

  const badgeStyle = getRoleBadgeStyle(profile?.role);

  return (
    <div className="group relative flex w-full md:w-[20rem] flex-col overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-950/60 backdrop-blur-md text-zinc-300 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-2xl hover:shadow-blue-950/30">
      
      {/* Top Image Section - Fixed height with object-top to prioritize face */}
      <div className="relative h-64 w-full overflow-hidden bg-zinc-900/60">
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent z-10 opacity-80" />
        <img
          src={imageUrl}
          onError={(e) => { 
            e.target.onerror = null; 
            e.target.src = "/fallback.png"; 
          }}
          alt={profile?.name || "Person"}
          className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute bottom-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-zinc-700/50 to-transparent z-20" />
      </div>

      {/* Content Section */}
      <div className="relative z-20 -mt-6 flex flex-col items-center px-6 pb-6 pt-2 text-center">
        {/* Dynamic Wing / Role Badge */}
        <div className={`mb-4 inline-flex items-center justify-center rounded-full border px-3.5 py-1 shadow-md backdrop-blur-md transition-transform duration-300 group-hover:scale-105 ${badgeStyle}`}>
          <span className="text-xs font-semibold tracking-wider uppercase">
            {profile?.role || "Member"}
          </span>
        </div>

        <h3 className="mb-1 text-xl font-bold tracking-tight text-white transition-colors duration-300 group-hover:text-cyan-200">
          {profile?.name}
        </h3>
        
        {/* Social / Action Links Row */}
        <div className="mt-4 flex items-center justify-center gap-2.5">
          {profile?.email && (
            <a 
              href={`mailto:${profile.email}`}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900/80 text-zinc-400 transition-all hover:border-cyan-500/60 hover:bg-cyan-500/10 hover:text-cyan-300 hover:scale-110"
              title="Mail"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            </a>
          )}
          
          {isFaculty ? (
            <>
              {profile.socialLinks?.googleScholar && (
                <a href={profile.socialLinks.googleScholar} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900/80 text-zinc-400 transition-all hover:border-blue-500/60 hover:bg-blue-500/10 hover:text-blue-400 hover:scale-110" title="Google Scholar">
                  <SiGooglescholar size={16} />
                </a>
              )}
              {profile.socialLinks?.googleSite && (
                <a href={profile.socialLinks.googleSite} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900/80 text-zinc-400 transition-all hover:border-purple-500/60 hover:bg-purple-500/10 hover:text-purple-300 hover:scale-110" title="Personal Site">
                  <ImProfile size={16} />
                </a>
              )}
            </>
          ) : (
            profile.socialLinks &&
            Object.keys(profile.socialLinks).map((key) => {
              if (!profile.socialLinks[key]) return null;
              const isLinkedin = key.toLowerCase() === 'linkedin';
              const isGithub = key.toLowerCase() === 'github';
              const isTwitter = key.toLowerCase() === 'twitter' || key.toLowerCase() === 'x';

              return (
                <a 
                  key={key} 
                  href={profile.socialLinks[key]} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`flex h-9 w-9 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900/80 text-zinc-400 transition-all hover:scale-110 ${
                    isLinkedin 
                      ? "hover:border-blue-500/60 hover:bg-blue-500/10 hover:text-[#0A66C2]" 
                      : isGithub 
                      ? "hover:border-zinc-500 hover:bg-zinc-800 hover:text-white" 
                      : "hover:border-zinc-600 hover:bg-zinc-800 hover:text-zinc-200"
                  }`}
                  title={key}
                >
                  {isLinkedin ? (
                    <FaLinkedinIn size={14} />
                  ) : isGithub ? (
                    <svg className="w-[15px] h-[15px]" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.379.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>
                  ) : isTwitter ? (
                    <FaXTwitter size={14} />
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                  )}
                </a>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default ModernProfile;