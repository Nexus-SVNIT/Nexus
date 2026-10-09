import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import increamentCounter from "../../libs/increamentCounter";
import HeadTags from "../HeadTags/HeadTags";
import ErrorBoundary from "../UI/ErrorBoundary";
import Profile from "./Profile";
import CodingProfile from "./CodingProfile";
import PostProfile from "./PostProfile";
import { FaUser, FaCode, FaFileAlt } from "react-icons/fa";

const TABS = [
  { id: "profile",  label: "Profile",             icon: FaUser    },
  { id: "coding",   label: "Coding Profiles",     icon: FaCode    },
  { id: "posts",    label: "My Experiences",      icon: FaFileAlt },
];

const UserProfile = () => {
  const token = localStorage.getItem("token");
  const [activeTab, setActiveTab] = useState("profile");

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

  useEffect(() => { increamentCounter(); }, []);

  if (!token) {
    return <Navigate to={`/login?redirect_to=${encodeURIComponent(window.location.pathname)}`} replace />;
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6">
      <HeadTags
        title="My Profile | Nexus - NIT Surat"
        description="Update your profile and coding profiles on Nexus."
      />
      <Toaster position="top-right" reverseOrder={false} />

      <div className="mx-auto max-w-3xl">
        {/* ── Page Header ── */}
        <div className="mb-8">
          <p className="text-xs font-mono text-blue-400 uppercase tracking-widest mb-2">
            {"// profile"}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
            Your account.{" "}
            <span className="text-zinc-400">Your handles.</span>
          </h1>
          <p className="text-zinc-500 text-sm mt-2">
            Keep your profile and coding handles up to date so your leaderboard ranks stay accurate.
          </p>
        </div>

        {/* ── Tab Bar ── */}
        <div className="flex items-center gap-1 rounded-xl border border-white/[0.08] bg-white/[0.03] p-1 mb-6 backdrop-blur-xl overflow-x-auto no-scrollbar">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 flex-1 justify-center whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                activeTab === id
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                  : "text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.05]"
              }`}
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>

        {/* ── Tab Content ── */}
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl shadow-2xl overflow-hidden">
          {activeTab === "profile" && (
            <ErrorBoundary title="Failed to load profile form">
              <Profile profile={profile} setProfile={setProfile} />
            </ErrorBoundary>
          )}
          {activeTab === "coding" && (
            <div className="p-6">
              <ErrorBoundary title="Failed to load coding profiles">
                <CodingProfile
                  githubProfile={profile.githubProfile || ""}
                  leetcodeProfile={profile.leetcodeProfile || ""}
                  codeforcesProfile={profile.codeforcesProfile || ""}
                  codechefProfile={profile.codechefProfile || ""}
                />
              </ErrorBoundary>
            </div>
          )}
          {activeTab === "posts" && (
            <ErrorBoundary title="Failed to load interview experiences">
              <PostProfile />
            </ErrorBoundary>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;