import React, { useState, useEffect } from "react";
import Profile from "./Profile";
import CodingProfile from "./CodingProfile";
import { Toaster } from "react-hot-toast";
import increamentCounter from "../../libs/increamentCounter";
import HeadTags from "../HeadTags/HeadTags";
import PostProfile from "./PostProfile"; 
import { Navigate } from "react-router-dom"; 
import ErrorBoundary from "../UI/ErrorBoundary";

const UserProfile = () => {
  const token = localStorage.getItem("token");
  
  const [profile, setProfile] = useState({
    fullName: "",
    admissionNumber: "",
    mobileNumber: "",
    personalEmail: "",
    instituteEmail: "",
    branch: "",
    linkedInProfile: "",
    githubProfile: "",
    leetcodeProfile: "",
    codeforcesProfile: "",
    codechefProfile: "", 
    subscribed: false, 
  });
  
  useEffect(() => {
    increamentCounter();
  }, []);

  if(!token) {
    return <Navigate to={`/login?redirect_to=${encodeURIComponent(window.location.pathname)}`} replace />;
  }

  return (
    <div className="px-6">
      <HeadTags
        title="Profile - CodeStrike | Nexus - NIT Surat"
        description="Update your profile and coding profiles on CodeStrike."
      />
      <Toaster position="top-right" reverseOrder={false} />

      {/* Personal Information Section */}
      <div className="mx-auto mb-18 mt-10 max-w-2xl rounded-xl border border-zinc-700/50 bg-zinc-900 p-6 shadow-lg">
        <h2 className="mb-6 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-2xl font-semibold text-transparent">
          Profile
        </h2>
        <ErrorBoundary title="Failed to load profile form">
          <Profile profile={profile} setProfile={setProfile} />
        </ErrorBoundary>
      </div>

      {/* Interview Experiences Section */}
      <div className="mx-auto mb-18 mt-10 max-w-2xl rounded-xl border border-zinc-700/50 bg-zinc-900 p-6 shadow-lg">
        <ErrorBoundary title="Failed to load interview experiences">
          <PostProfile />
        </ErrorBoundary>
      </div>

      {/* Coding Profiles Section */}
      <div className="mx-auto mb-36 mt-10 max-w-2xl rounded-xl border border-zinc-700/50 bg-zinc-900 p-6 shadow-lg">
        <h2 className="mb-6 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-2xl font-semibold text-transparent">
          Coding Profiles
        </h2>
        <ErrorBoundary title="Failed to load coding profiles">
          <CodingProfile
            leetcodeProfile={profile.leetcodeProfile || ""}
            codeforcesProfile={profile.codeforcesProfile || ""}
            codechefProfile={profile.codechefProfile || ""}
          />
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default UserProfile;