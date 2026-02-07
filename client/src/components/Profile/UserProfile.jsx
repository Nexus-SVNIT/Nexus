import React, { useState, useEffect } from "react";
import Profile from "./Profile";
import CodingProfile from "./CodingProfile";
import { Toaster } from "react-hot-toast";
import increamentCounter from "../../libs/increamentCounter";
import MaintenancePage from "../Error/MaintenancePage";
import HeadTags from "../HeadTags/HeadTags";
import PostProfile from "./PostProfile"; 
import { Navigate } from "react-router-dom"; 

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
  
  const [err, setErr] = useState(null);

  useEffect(() => {
    increamentCounter();
  }, []);

  // --- THE FIX IS HERE ---
  // If we have an error, check if it's just a 401 (Auth Error).
  // If it is 401, DO NOT show MaintenancePage. Let the apiService redirect the user.
  if (err) {
     // Check if the error object or string indicates an Auth failure
     const isAuthError = 
        (err.response && err.response.status === 401) || 
        (typeof err === 'string' && err.includes("401"));

     if (isAuthError) {
         return null; // Return nothing while redirect happens
     }
     
     // Only show Maintenance Page for REAL errors (500, Network Error, etc.)
     return <MaintenancePage />;
  }
  // -----------------------

  if(!token) {
    return <Navigate to={`/login?redirect_to=${encodeURIComponent(window.location.pathname)}`} replace />;
  }

  return (
    <div className="px-6">
      <HeadTags
        title="Profile - CodeStrike | Nexus - NIT Surat"
        description="Update your profile and coding profiles on CodeStrike."
      />
      <div className="mx-auto mb-18 mt-10 max-w-2xl rounded-lg bg-zinc-900 p-4 shadow-lg">
        <Toaster position="top-right" reverseOrder={false} />
        <h2 className="text-gray-800 mb-6 text-2xl font-semibold">Profile</h2>

        {/* Pass setErr down to child */}
        <Profile profile={profile} setProfile={setProfile} setErr={setErr} />
      </div>
      <div className="mx-auto mb-18 mt-10 max-w-2xl rounded-lg bg-zinc-900 p-4 shadow-lg">
        <PostProfile /> 
      </div>
      <div className="mx-auto mb-36 mt-10 max-w-2xl rounded-lg bg-zinc-900 p-4 shadow-lg">
        <h2 className="text-gray-800 mb-6 text-2xl font-semibold">
          Coding Profiles
        </h2>

        <CodingProfile
          leetcodeProfile={profile.leetcodeProfile || ""}
          codeforcesProfile={profile.codeforcesProfile || ""}
          codechefProfile={profile.codechefProfile || ""}
        />
      </div>
    </div>
  );
};

export default UserProfile;