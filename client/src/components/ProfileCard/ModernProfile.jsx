import { FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { MdOutgoingMail } from "react-icons/md";
import { SiGooglescholar } from "react-icons/si";
import { ImProfile } from "react-icons/im";

import { Link } from "react-router-dom";
import { SocialIcon } from "react-social-icons";

const ModernProfile = ({ profile, isFaculty }) => {
  const imageUrl = isFaculty
    ? profile.image
    : `https://lh3.googleusercontent.com/d/${profile.image}`;

  return (
    <div className="relative h-[23rem] w-[18rem] flex-wrap overflow-hidden rounded-lg bg-white text-black shadow-lg transition-all hover:shadow-xl md:w-[16rem]">
      <figure className="absolute -left-[5%] top-0 h-[16rem] w-[20rem] overflow-hidden rounded-b-[50%] border-b-8 border-red-400 bg-red-500/20 md:h-[16rem] md:w-[18rem]">
        <img
          src={imageUrl}
          alt={profile?.name || "Person"}
          className="-z-10 flex h-full w-full cursor-pointer object-cover object-top transition-all duration-300 hover:scale-110"
        />
      </figure>
      <div className="mt-[15.5rem] px-5 py-4">
        <div className="mb-2 flex gap-2">
          {isFaculty ? (
            <>
              {profile.socialLinks?.googleScholar && (
                <a href={profile.socialLinks.googleScholar} target="_blank" rel="noopener noreferrer">
                  <SiGooglescholar
                    className="duration-400 rounded-sm border bg-[#3865c5] p-1 text-white transition-all hover:border-[#3865c5] hover:bg-transparent hover:text-[#3865c5]"
                    size={24}
                  />
                </a>
              )}
              {profile.socialLinks?.googleSite && (
                <a href={profile.socialLinks.googleSite} target="_blank" rel="noopener noreferrer">
                  <ImProfile
                    className="duration-400 rounded-sm border bg-[#22272c] p-1 text-white transition-all hover:border-[#75787B] hover:bg-transparent hover:text-[#22272c]"
                    size={24}
                  />
                </a>
              )}
            </>
          ) : (
            profile.socialLinks &&
            Object.keys(profile.socialLinks).map((key) => (
              profile.socialLinks[key] ? (
                <SocialIcon
                  key={key}
                  url={profile.socialLinks[key]}
                  style={{ height: "1.8rem", width: "1.8rem" }}
                />
              ) : null
            ))
          )}
        </div>
        <h3 className="mb-0.5 text-xl font-bold">{profile?.name}</h3>
        <div className="flex items-center justify-between">
          <h4 className="text-red-600">{profile?.role}</h4>
          {profile?.email && (
            <a href={`mailto:${profile.email}`}>
              <MdOutgoingMail
                className="h-8 w-8 cursor-pointer rounded-full p-1 text-red-600 hover:bg-red-200"
                title="Write an Email"
              />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModernProfile;