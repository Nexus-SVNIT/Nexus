import React from "react";
import ModernProfile from "../ProfileCard/ModernProfile";

const TeamCard = ({ data, isFaculty = false }) => {
  return (
    <div className="my-10 flex w-full flex-col items-center justify-center">
      <div className="flex w-full flex-wrap items-center justify-center gap-8 md:gap-10 lg:gap-12">
        {data.map((member) => (
          <ModernProfile
            key={member.admissionNumber}
            profile={{
              name: member.fullName || member.name,
              image: member.image,
              socialLinks: {
                'linkedin': member.linkedInProfile,
                'github': member.githubProfile,
              },
              email: member.personalEmail,
              role: member.role
            }} // Pass member object directly
            isFaculty={isFaculty}
          />
        ))}
      </div>
    </div>
  );
};

export default TeamCard;
