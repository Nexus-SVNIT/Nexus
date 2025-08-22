import React from "react";
import ModernProfile from "../ProfileCard/ModernProfile";

const TeamCard = ({ data, isFaculty = false }) => {
  return (
    <div className="my-10 flex w-full flex-col items-center justify-center">
      <div className="flex w-full flex-wrap items-center justify-center gap-8 md:gap-10 lg:gap-12">
        {data.map((member, idx) => {
          const socialLinks = {
            linkedin: member.linkedInProfile,
            github: member.githubProfile,
          };

          if (isFaculty) {
            socialLinks.googleScholar = member.socialLinks.googleScholar;
            socialLinks.googleSite = member.socialLinks.googleSite;
          }
          const profile = {
            name: member.fullName || member.name,
            image: member.image,
            socialLinks: socialLinks,
            email: member.personalEmail || member.email,
            role: member.role,
          };

          // Use admissionNumber if available, else fallback to index
          const key = member.admissionNumber || member.email || member.name || idx;
          return (
            <ModernProfile
              key={key}
              profile={profile}
              isFaculty={isFaculty}
            />
          );
        })}
      </div>
    </div>
  );
};

export default TeamCard;
