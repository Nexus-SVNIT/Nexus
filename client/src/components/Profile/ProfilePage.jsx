// ProfilePage.js
import React, { useState, useEffect } from "react";
import Profile from "./Profile";
import CodingProfile from "./CodingProfile";
import { Toaster } from "react-hot-toast";
import increamentCounter from "../../libs/increamentCounter";
import MaintenancePage from "../Error/MaintenancePage";
import HeadTags from "../HeadTags/HeadTags";
import PostProfile from "./PostProfile"; // Assuming you have a PostProfile component
import { Navigate } from "react-router-dom"; // Importing for routing, if needed
import { useUser } from "../../context/userContext";

const ProfilePage = () => {
  const { user } = useUser();
  
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
    codechefProfile: "", // Added CodeChef profile
    subscribed: false, // Corrected to subscribed field
  });
  const [err, setErr] = useState(null);

  useEffect(() => {
    increamentCounter();
  }, []);

  if (err) {
    return <MaintenancePage />;
  }

  if(!user) {
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

        <Profile profile={profile} setProfile={setProfile} setErr={setErr} />
      </div>
      <div className="mx-auto mb-18 mt-10 max-w-2xl rounded-lg bg-zinc-900 p-4 shadow-lg">
        <PostProfile /> {/* Assuming you have a PostProfile component */}
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

  // return (
  //   <div className="App text-gray-200 min-h-screen p-8">
  //     <div className="flex h-screen w-full items-center justify-center">
  //       This Page currently is Under Maintanance.
  //     </div>
  //   </div>
  // )
};

export default ProfilePage;
