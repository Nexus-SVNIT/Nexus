import React, { useState, useEffect } from "react";
import Profile from "./Profile";
import CodingProfile from "./CodingProfile";
import { Toaster } from "react-hot-toast";
import increamentCounter from "../../libs/increamentCounter";
import MaintenancePage from "../Error/MaintenancePage";
import HeadTags from "../HeadTags/HeadTags";
import PostProfile from "./PostProfile"; 
import { Navigate, useNavigate } from "react-router-dom"; 

const UserProfile = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate(); 
  
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

  // --- HELPER: ROBUST ERROR CHECKING ---
  const checkIsAuthError = (error) => {
    if (!error) return false;

    // 1. Check strict Status Code (Standard Axios Object)
    const status = error.response?.status;
    if (status === 401 || status === 403) return true;

    // 2. Normalize the message (Handle if error is a string OR an object)
    const msg = (typeof error === 'string' ? error : error.message || "").toLowerCase();

    // 3. Check for keywords AND status numbers in the text
    return (
      msg.includes("token") || 
      msg.includes("unauthorized") || 
      msg.includes("not valid") || 
      msg.includes("jwt") ||      // Common in JWT libs
      msg.includes("expired") || 
      msg.includes("401") ||      // Matches "Request failed with status code 401"
      msg.includes("403")
    );
  };

  // --- REDIRECT SIDE EFFECT ---
  useEffect(() => {
    if (err) {
      if (checkIsAuthError(err)) {
        console.log("Auth error confirmed. Redirecting...");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        console.log("Non-Auth error detected:", err);
      }
    }
  }, [err, navigate]);


  // --- RENDERING ---

  if (!token) {
    return <Navigate to={`/login?redirect_to=${encodeURIComponent(window.location.pathname)}`} replace />;
  }

  // Handle Error State
  if (err) {
    // If it is an auth error, render NULL.
    // This allows the useEffect above to redirect you without flashing the Maintenance Page.
    if (checkIsAuthError(err)) {
        return null; 
    }

    // Only show Maintenance Page if it is a REAL server error (500, Network Error, etc.)
    return <MaintenancePage />;
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