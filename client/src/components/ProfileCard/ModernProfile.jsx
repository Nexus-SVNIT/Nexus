import { FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { MdOutgoingMail } from "react-icons/md";
import { SiGooglescholar } from "react-icons/si";
import { ImProfile } from "react-icons/im";

import { Link } from "react-router-dom";
import { SocialIcon } from "react-social-icons";

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

  return (
    <div className="group relative flex w-full md:w-[20rem] flex-col overflow-hidden rounded-2xl border border-zinc-800/60 bg-[#09090b] text-zinc-300 transition-all duration-300 hover:border-zinc-700/80">
      
      {/* Top Image Section - Fixed height with object-top to prioritize face */}
      <div className="relative h-64 w-full overflow-hidden bg-zinc-900/50">
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-transparent z-10 opacity-60"></div>
        <img
          src={imageUrl}
          onError={(e) => { e.target.onerror = null; e.target.src = "/fallback.png"; }}
          alt={profile?.name || "Person"}
          className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
          loading="lazy"
        />
        <div className="absolute bottom-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-zinc-700 to-transparent z-20"></div>
      </div>

      {/* Content Section */}
      <div className="relative z-20 -mt-6 flex flex-col items-center px-6 pb-6 pt-2 text-center">
        {/* Role Badge pinned spanning banner and content */}
        <div className="mb-4 inline-flex items-center justify-center rounded-full border border-zinc-800 bg-[#09090b] px-3 py-1 shadow-md shadow-black">
          <span className="text-xs font-medium tracking-wide text-zinc-400 uppercase">
            {profile?.role || "Member"}
          </span>
        </div>

        <h3 className="mb-1 text-xl font-bold tracking-tight text-white transition-colors duration-300 group-hover:text-blue-100">
          {profile?.name}
        </h3>
        
        {/* Social / Action Links Row */}
        <div className="mt-5 flex items-center justify-center gap-3">
          {profile?.email && (
            <a 
              href={`mailto:${profile.email}`}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-800/80 bg-zinc-900 text-zinc-400 transition-all hover:border-zinc-600 hover:bg-zinc-800 hover:text-white"
              title="Mail"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            </a>
          )}
          
          {isFaculty ? (
            <>
              {profile.socialLinks?.googleScholar && (
                <a href={profile.socialLinks.googleScholar} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-800/80 bg-zinc-900 text-zinc-400 transition-all hover:border-blue-500/50 hover:bg-blue-500/10 hover:text-blue-400" title="Google Scholar">
                  <SiGooglescholar size={16} />
                </a>
              )}
              {profile.socialLinks?.googleSite && (
                <a href={profile.socialLinks.googleSite} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-800/80 bg-zinc-900 text-zinc-400 transition-all hover:border-zinc-600 hover:bg-zinc-800 hover:text-white" title="Personal Site">
                  <ImProfile size={16} />
                </a>
              )}
            </>
          ) : (
            profile.socialLinks &&
            Object.keys(profile.socialLinks).map((key) => {
              if (!profile.socialLinks[key]) return null;
              return (
                <a 
                  key={key} 
                  href={profile.socialLinks[key]} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-800/80 bg-zinc-900 text-zinc-400 transition-all hover:border-zinc-600 hover:bg-zinc-800 hover:text-white"
                  title={key}
                >
                  {key.toLowerCase() === 'linkedin' ? (
                    <FaLinkedinIn size={14} />
                  ) : key.toLowerCase() === 'github' ? (
                    <svg className="w-[15px] h-[15px]" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.379.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>
                  ) : key.toLowerCase() === 'twitter' || key.toLowerCase() === 'x' ? (
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