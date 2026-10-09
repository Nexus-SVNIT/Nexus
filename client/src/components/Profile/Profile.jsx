import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import AlumnusBadge from "./AlumniBadge";
import API from "../../services/apiService";
import {
  FaUser, FaEnvelope, FaPhone, FaLinkedin, FaGithub,
  FaLock, FaEdit, FaSave, FaTimes, FaBell, FaChartBar,
  FaBuilding, FaBriefcase, FaLightbulb,
} from "react-icons/fa";
import { SiLeetcode, SiCodeforces, SiCodechef } from "react-icons/si";

/* ─── Reusable Field Components ─────────────────────────────────── */
const FieldLabel = ({ children, required }) => (
  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
    {children}
    {required && <span className="text-red-400 ml-1">*</span>}
  </label>
);

const inputBase =
  "w-full rounded-xl border px-3.5 py-2.5 text-sm transition-all duration-200 focus:outline-none focus:ring-1";

const inputActive =
  `${inputBase} border-white/[0.10] bg-white/[0.05] text-white placeholder-zinc-600 focus:border-blue-500/50 focus:ring-blue-500/20`;

const inputDisabled =
  `${inputBase} border-white/[0.05] bg-white/[0.02] text-zinc-500 cursor-not-allowed`;

const SectionHeading = ({ icon: Icon, children }) => (
  <div className="flex items-center gap-2 pb-3 mb-4 border-b border-white/[0.06]">
    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/20">
      <Icon size={13} className="text-blue-400" />
    </div>
    <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-widest">{children}</h3>
  </div>
);

/* ─── Main Profile Form ─────────────────────────────────────────── */
const ProfilePage = ({ profile, setProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [expertiseInput, setExpertiseInput] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (profile?.expertise && Array.isArray(profile.expertise)) {
      setExpertiseInput(profile.expertise.join(", "));
    }
  }, [profile?.isAlumni, profile?.expertise]);

  const fetchUserData = async () => {
    try {
      setError(null);
      setLoading(true);
      const response = await API.get("/user/profile");
      if (response.success) {
        setProfile(response.data);
      } else {
        setError(response.message || "Error fetching profile data.");
        toast.error(response.message || "Error fetching profile data.");
      }
    } catch (err) {
      setError("Failed to load profile data. Please try again.");
      toast.error("Error fetching profile data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUserData(); }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "expertise") { setExpertiseInput(value); return; }
    setProfile({ ...profile, [name]: type === "checkbox" ? checked : value });
  };

  const validateForm = () => {
    const { fullName, mobileNumber, personalEmail, currentCompany, currentDesignation,
      githubProfile, linkedInProfile, leetcodeProfile, codeforcesProfile, codechefProfile, isAlumni } = profile || {};
    const emailPattern = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!fullName) { toast.error("Full Name is required"); return false; }
    if (mobileNumber && !mobileNumber.match(/^[0-9]{10}$/)) { toast.error("Invalid Mobile Number"); return false; }
    if (personalEmail && !personalEmail.match(emailPattern)) { toast.error("Invalid Personal Email"); return false; }
    if (!linkedInProfile || !linkedInProfile.includes("linkedin.com")) { toast.error("LinkedIn Profile URL is required"); return false; }
    if (isAlumni && !currentCompany) { toast.error("Current Company is required"); return false; }
    if (isAlumni && !currentDesignation) { toast.error("Current Designation is required"); return false; }
    if (isAlumni && expertiseInput.length === 0) { toast.error("Enter your expertise"); return false; }
    if (githubProfile && !/^(https?:\/\/(www\.)?github\.com\/)?[A-Za-z0-9_-]+\/?$/.test(githubProfile.trim()) && !/^@[A-Za-z0-9_-]+$/.test(githubProfile.trim())) { toast.error("Invalid GitHub Profile (Enter username or profile URL)"); return false; }
    if (!isAlumni && !githubProfile) { toast.error("Github profile is compulsory"); return false; }
    if (leetcodeProfile && leetcodeProfile.includes("leetcode.com/")) { toast.error("Invalid LeetCode ID. Enter Only ID NOT URL!"); return false; }
    if (!isAlumni && !leetcodeProfile) { toast.error("Leetcode profile is compulsory"); return false; }
    if (codeforcesProfile && codeforcesProfile.includes("codeforces.com/")) { toast.error("Invalid Codeforces ID. Enter Only ID NOT URL!"); return false; }
    if (!isAlumni && !codeforcesProfile) { toast.error("Codeforces profile is compulsory"); return false; }
    if (codechefProfile && codechefProfile.includes("codechef.com/")) { toast.error("Invalid Codechef ID. Enter Only ID NOT URL!"); return false; }
    const urlPattern = /^https?:\/\/|www\.|\\.com|\/|@/i;
    if (leetcodeProfile && urlPattern.test(leetcodeProfile)) { toast.error("Please enter only your LeetCode username, not the full URL"); return false; }
    if (codeforcesProfile && urlPattern.test(codeforcesProfile)) { toast.error("Please enter only your Codeforces username, not the full URL"); return false; }
    if (codechefProfile && urlPattern.test(codechefProfile)) { toast.error("Please enter only your CodeChef username, not the full URL"); return false; }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonLoading(true);
    try {
      if (validateForm()) {
        let updatedProfile = { ...profile };
        if (profile?.isAlumni) {
          updatedProfile.expertise = expertiseInput.split(",").map((s) => s.trim()).filter(Boolean);
        }
        const response = await API.put("/user/profile", updatedProfile);
        if (response.success) {
          setProfile(updatedProfile);
          setIsEditing(false);
          toast.success("Profile updated successfully!");
        } else {
          toast.error(response.message || "Failed to update profile.");
        }
      }
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setButtonLoading(false);
    }
  };

  /* ── Loading skeleton ── */
  if (loading) {
    return (
      <div className="p-6 space-y-4 animate-pulse">
        {Array(8).fill(0).map((_, i) => (
          <div key={i} className="h-10 rounded-xl bg-white/[0.05]" />
        ))}
      </div>
    );
  }

  /* ── Error state ── */
  if (error) {
    return (
      <div className="p-8 flex flex-col items-center justify-center text-center">
        <div className="h-12 w-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
          <svg className="h-6 w-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <p className="text-red-400 font-semibold mb-1">Failed to load profile</p>
        <p className="text-zinc-500 text-sm mb-4">{error}</p>
        <button onClick={fetchUserData} className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors">
          Retry
        </button>
      </div>
    );
  }

  /* ── Profile form ── */
  return (
    <form onSubmit={handleSubmit}>
      {/* Header bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.07]">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-sm shadow-lg">
            {(profile?.fullName || "?")[0]?.toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-tight">{profile?.fullName || "Your Name"}</p>
            <p className="text-[11px] font-mono text-zinc-500">{profile?.admissionNumber}</p>
          </div>
          {profile?.isAlumni && <AlumnusBadge />}
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <button
                type="submit"
                disabled={buttonLoading}
                className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-500 disabled:opacity-60 transition-all"
              >
                <FaSave size={12} />
                {buttonLoading ? "Saving…" : "Save"}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-1.5 rounded-xl border border-white/[0.10] bg-white/[0.04] px-4 py-2 text-sm font-semibold text-zinc-400 hover:text-white transition-all"
              >
                <FaTimes size={12} />
                Cancel
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); setIsEditing(true); }}
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-500 transition-all"
            >
              <FaEdit size={12} />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* ── Section: Personal Info ── */}
        <div>
          <SectionHeading icon={FaUser}>Personal Information</SectionHeading>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel required>Full Name</FieldLabel>
              <input name="fullName" type="text" value={profile?.fullName || ""}
                onChange={handleChange} disabled={!isEditing}
                className={isEditing ? inputActive : inputDisabled} />
            </div>
            <div>
              <FieldLabel>Admission Number</FieldLabel>
              <input type="text" value={profile?.admissionNumber || ""} disabled
                className={inputDisabled} />
            </div>
            <div>
              <FieldLabel>Mobile Number</FieldLabel>
              <input name="mobileNumber" type="tel" value={profile?.mobileNumber || ""}
                onChange={handleChange} disabled={!isEditing}
                className={isEditing ? inputActive : inputDisabled} />
            </div>
            <div>
              <FieldLabel>Personal Email</FieldLabel>
              <input name="personalEmail" type="email" value={profile?.personalEmail || ""}
                onChange={handleChange} disabled={!isEditing}
                className={isEditing ? inputActive : inputDisabled} />
            </div>
            {!profile?.isAlumni && (
              <div>
                <FieldLabel>Institute Email</FieldLabel>
                <input type="email" value={profile?.instituteEmail || ""} disabled
                  className={inputDisabled} />
              </div>
            )}
            <div>
              <FieldLabel>Branch</FieldLabel>
              <select name="branch" value={profile?.branch || ""} disabled
                className={inputDisabled}>
                <option value="CSE">CSE / COE</option>
                <option value="AI">AI</option>
              </select>
            </div>
          </div>
        </div>

        {/* ── Section: Social ── */}
        <div>
          <SectionHeading icon={FaLinkedin}>Social & Professional</SectionHeading>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <FieldLabel required>LinkedIn Profile (URL)</FieldLabel>
              <div className="relative">
                <FaLinkedin className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0A66C2] opacity-60" size={14} />
                <input name="linkedInProfile" type="url" value={profile?.linkedInProfile || ""}
                  onChange={handleChange} disabled={!isEditing}
                  placeholder="https://linkedin.com/in/yourname"
                  className={`${isEditing ? inputActive : inputDisabled} pl-9`} />
              </div>
            </div>
            <div>
              <FieldLabel>GitHub Profile (Username or Link)</FieldLabel>
              <div className="relative">
                <FaGithub className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 opacity-60" size={14} />
                <input name="githubProfile" type="text" value={profile?.githubProfile || ""}
                  onChange={handleChange} disabled={!isEditing}
                  placeholder="octocat or https://github.com/octocat"
                  className={`${isEditing ? inputActive : inputDisabled} pl-9`} />
              </div>
            </div>
          </div>
        </div>

        {/* ── Section: Coding Handles ── */}
        <div>
          <SectionHeading icon={FaCode_}>Coding Handles <span className="text-zinc-600 normal-case font-normal text-xs">(IDs only, not URLs)</span></SectionHeading>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel>LeetCode ID</FieldLabel>
              <div className="relative">
                <SiLeetcode className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400 opacity-70" size={14} />
                <input name="leetcodeProfile" value={profile?.leetcodeProfile || ""}
                  onChange={handleChange} disabled={!isEditing}
                  placeholder="your_lc_username"
                  className={`${isEditing ? inputActive : inputDisabled} pl-9`} />
              </div>
            </div>
            <div>
              <FieldLabel>Codeforces ID</FieldLabel>
              <div className="relative">
                <SiCodeforces className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 opacity-70" size={14} />
                <input name="codeforcesProfile" value={profile?.codeforcesProfile || ""}
                  onChange={handleChange} disabled={!isEditing}
                  placeholder="your_cf_username"
                  className={`${isEditing ? inputActive : inputDisabled} pl-9`} />
              </div>
            </div>
            <div>
              <FieldLabel>CodeChef ID</FieldLabel>
              <div className="relative">
                <SiCodechef className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400 opacity-70" size={14} />
                <input name="codechefProfile" value={profile?.codechefProfile || ""}
                  onChange={handleChange} disabled={!isEditing}
                  placeholder="your_cc_username"
                  className={`${isEditing ? inputActive : inputDisabled} pl-9`} />
              </div>
            </div>
          </div>
        </div>

        {/* ── Section: Alumni Only ── */}
        {profile?.isAlumni && (
          <div>
            <SectionHeading icon={FaBuilding}>Alumni Details</SectionHeading>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel required>Current Company</FieldLabel>
                <div className="relative">
                  <FaBuilding className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 opacity-60" size={13} />
                  <input name="currentCompany" type="text" value={profile?.currentCompany || ""}
                    onChange={handleChange} disabled={!isEditing}
                    className={`${isEditing ? inputActive : inputDisabled} pl-9`} />
                </div>
              </div>
              <div>
                <FieldLabel required>Designation</FieldLabel>
                <div className="relative">
                  <FaBriefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 opacity-60" size={13} />
                  <input name="currentDesignation" type="text" value={profile?.currentDesignation || ""}
                    onChange={handleChange} disabled={!isEditing}
                    className={`${isEditing ? inputActive : inputDisabled} pl-9`} />
                </div>
              </div>
              <div className="sm:col-span-2">
                <FieldLabel required>Expertise <span className="normal-case font-normal text-zinc-600">(comma-separated)</span></FieldLabel>
                <div className="relative">
                  <FaLightbulb className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 opacity-60" size={13} />
                  <input name="expertise" type="text" value={expertiseInput}
                    onChange={handleChange} disabled={!isEditing}
                    placeholder="React, Node.js, System Design…"
                    className={`${isEditing ? inputActive : inputDisabled} pl-9`} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Section: Preferences ── */}
        <div>
          <SectionHeading icon={FaBell}>Preferences</SectionHeading>
          <div className="flex flex-col gap-3">
            <label className={`flex items-center gap-3 rounded-xl border p-3.5 cursor-pointer transition-all ${!isEditing ? "border-white/[0.05] bg-white/[0.02] opacity-60" : "border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08]"}`}>
              <input type="checkbox" name="subscribed" checked={!!profile?.subscribed}
                onChange={handleChange} disabled={!isEditing}
                className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-blue-500 focus:ring-blue-500 accent-blue-500" />
              <div>
                <p className="text-sm font-medium text-zinc-200">Email Newsletters</p>
                <p className="text-xs text-zinc-500 mt-0.5">Get updates about events, contests and announcements</p>
              </div>
            </label>
            <label className={`flex items-center gap-3 rounded-xl border p-3.5 cursor-pointer transition-all ${!isEditing ? "border-white/[0.05] bg-white/[0.02] opacity-60" : "border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08]"}`}>
              <input type="checkbox" name="shareCodingProfile" checked={!!profile?.shareCodingProfile}
                onChange={handleChange} disabled={!isEditing}
                className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-blue-500 focus:ring-blue-500 accent-blue-500" />
              <div>
                <p className="text-sm font-medium text-zinc-200">Share Coding Profile</p>
                <p className="text-xs text-zinc-500 mt-0.5">Allow your handles to appear on departmental leaderboards</p>
              </div>
            </label>
          </div>
        </div>

        {/* ── Footer: Reset Password ── */}
        <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
          <p className="text-xs text-zinc-600">
            Changes to coding handles may take up to 24h to reflect on leaderboards.
          </p>
          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            className="flex items-center gap-1.5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/20 transition-all"
          >
            <FaLock size={11} />
            Reset Password
          </button>
        </div>
      </div>
    </form>
  );
};

// Inline icon alias for the coding section heading
const FaCode_ = ({ size, className }) => (
  <svg className={className} width={size} height={size} fill="currentColor" viewBox="0 0 24 24">
    <path d="M8.75 7.5L4 12l4.75 4.5M15.25 7.5L20 12l-4.75 4.5M13 5l-2 14" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default ProfilePage;