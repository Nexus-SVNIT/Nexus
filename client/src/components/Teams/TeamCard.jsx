import React from "react";
import ModernProfile from "../ProfileCard/ModernProfile";
import useIntersectionObserver from "../../hooks/useIntersectionObserver";

const TeamCard = React.memo(({ data, isFaculty = false }) => {
  const [sectionRef, isVisible] = useIntersectionObserver({ threshold: 0.05 });

  return (
    <div
      ref={sectionRef}
      className="my-10 w-full transition-all duration-700 ease-out"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(24px)",
      }}
    >
      <div className="flex w-full flex-wrap justify-center gap-8 md:gap-10 lg:gap-12">
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
});

TeamCard.displayName = "TeamCard";

export default TeamCard;
