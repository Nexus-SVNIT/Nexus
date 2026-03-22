import React, { useState, useEffect } from "react";
// REMOVED: import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast"; 
import AlumnusBadge from "./AlumniBadge";
// ADDED: Import the centralized API service
import API from "../../services/apiService"; 

const ProfilePage = ({ profile, setProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [buttonLoading, setButtonLoading] = useState(false); 
  const navigate = useNavigate();

  const [expertiseInput, setExpertiseInput] = useState("");

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
          console.error("Error fetching data:", response.message);
          setError(response.message || "Error fetching profile data.");
          toast.error(response.message || "Error fetching profile data.");
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load profile data. Please try again.");
      toast.error("Error fetching profile data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {

    fetchUserData();
  }, []); // Removed dependency array warning by keeping it empty as intended for mount

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "expertise"){
      setExpertiseInput(value);
      return;
    }
    setProfile({ ...profile, [name]: type === "checkbox" ? checked : value });
  };

  const validateForm = () => {
    const {
      fullName,
      mobileNumber,
      personalEmail,
      currentCompany,
      currentDesignation,
      githubProfile,
      linkedInProfile,
      leetcodeProfile,
      codeforcesProfile,
      codechefProfile,
      isAlumni,
    } = profile || {};

    const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    if (!fullName) {
      toast.error("Full Name is required");
      return false;
    }
    if (mobileNumber && !mobileNumber.match(/^[0-9]{10}$/)) {
      toast.error("Invalid Mobile Number");
      return false;
    }
    if (personalEmail && !personalEmail.match(emailPattern)) {
      toast.error("Invalid Personal Email");
      return false;
    }
    if (!linkedInProfile || !linkedInProfile.includes("linkedin.com")) {
      toast.error("LinkedIn Profile URL is required");
      return false;
    }
    if (isAlumni && !currentCompany) {
      toast.error("Current Company is required");
      return false;
    }
    if (isAlumni && !currentDesignation) {
      toast.error("Current Designation is required");
      return false;
    }
    if (isAlumni && expertiseInput.length === 0){
      toast.error("Enter your expertise");
      return false;
    }
    if (githubProfile && !githubProfile.match(/^(https?:\/\/)?(www\.)?github\.com\/[A-Za-z0-9-]+\/?$/)) {
      toast.error("Invalid GitHub Profile URL");
      return false;
    }
    if (!isAlumni && !githubProfile){
      toast.error("Github profile is compulsory");
    }
    if (leetcodeProfile && leetcodeProfile.includes("leetcode.com/")) {
      toast.error("Invalid LeetCode ID. Enter Only ID NOT URL!");
      return false;
    }
    if(!isAlumni && !leetcodeProfile){
      toast.error("Leetcode profile is compulsory");
      return false;
    }
    if (codeforcesProfile && codeforcesProfile.includes("codeforces.com/")) {
      toast.error("Invalid Codeforces ID. Enter Only ID NOT URL!");
      return false;
    }
    if (!isAlumni && !codeforcesProfile){
      toast.error("Codeforces profile is compulsory");
      return false;
    }
    if (codechefProfile && codechefProfile.includes("codechef.com/")) {
      toast.error("Invalid Codechef ID. Enter Only ID NOT URL!");
      return false;
    }

    // Add URL validation for coding profiles
    const urlPattern = /^https?:\/\/|www\.|\.com|\/|@/i;
    
    if (leetcodeProfile && urlPattern.test(leetcodeProfile)) {
      toast.error("Please enter only your LeetCode username, not the full URL");
      return false;
    }
    if (codeforcesProfile && urlPattern.test(codeforcesProfile)) {
      toast.error("Please enter only your Codeforces username, not the full URL");
      return false;
    }
    if (codechefProfile && urlPattern.test(codechefProfile)) {
      toast.error("Please enter only your CodeChef username, not the full URL");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonLoading(true); 

    try {
      if (validateForm()) {
        let updatedProfile = { ...profile };

        if (profile?.isAlumni) {
          const expertiseArray = expertiseInput
            .split(',')
            .map((exp) => exp.trim())
            .filter((exp) => exp);
          updatedProfile.expertise = expertiseArray;
        }

        // CHANGED: Use API.put instead of axios.put
        const response = await API.put("/user/profile", updatedProfile);

        // CHECK SUCCESS FLAG
        if (response.success) {
            setProfile(updatedProfile);
            setIsEditing(false);
            toast.success("Profile updated successfully!");
        } else {
            toast.error(response.message || "Failed to update profile.");
        }
      }
    } catch (error) {
      console.error(
        "Error updating profile:",
        error
      );
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setButtonLoading(false); 
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password"); 
  };

  const SkeletonLoader = () => (
    <div className="space-y-4">
      {Array(10)
        .fill()
        .map((_, index) => (
          <div
            key={index}
            className="bg-zinc-700 h-10 animate-pulse rounded-md"
          ></div>
        ))}
    </div>
  );

  if (loading) {
    return (
      <div className="mx-auto mb-36 mt-10 max-w-2xl rounded-lg bg-zinc-900 p-4 shadow-lg">
        <SkeletonLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="rounded-lg bg-zinc-800/50 border border-red-500/30 p-6 backdrop-blur-sm">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <svg className="h-12 w-12 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <p className="text-red-400 text-lg font-medium mb-2">Failed to load profile data</p>
            <p className="text-gray-500 text-sm mb-4">{error}</p>
            <button
              onClick={fetchUserData}
              className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Profile Form Box */}
      <div className="rounded-lg bg-zinc-800/50 border border-zinc-700/50 p-6 backdrop-blur-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-200">Personal Information</h3>
          {profile?.isAlumni && <AlumnusBadge/>}
        </div>
        <Toaster />
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="text-zinc-400 block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={profile?.fullName || ""}
              onChange={handleChange}
              disabled={!isEditing}
              className="border-gray-300 mt-1 block w-full rounded-md border bg-zinc-800 p-2 text-white"
            />
          </div>
          <div>
            <label className="text-zinc-400 block">Admission Number</label>
            <input
              type="text"
              name="admissionNumber"
              value={profile?.admissionNumber || ""}
              disabled
              className="mt-1 block w-full cursor-not-allowed rounded-md bg-zinc-800/50 border border-zinc-700 p-2 text-zinc-400"
            />
          </div>
          <div>
            <label className="text-zinc-400 block">Mobile Number</label>
            <input
              type="text"
              name="mobileNumber"
              value={profile?.mobileNumber || ""}
              onChange={handleChange}
              disabled={!isEditing}
              className="mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-900/50 p-2.5 text-white transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
            />
          </div>
          <div>
            <label className="text-zinc-400 block">Personal Email</label>
            <input
              type="email"
              name="personalEmail"
              value={profile?.personalEmail || ""}
              onChange={handleChange}
              disabled={!isEditing}              
              className="mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-900/50 p-2.5 text-white transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
            />
          </div>
          {!profile?.isAlumni && (
            <div>
              <label className="text-zinc-400 block">Institute Email</label>
              <input
                type="email"
                name="instituteEmail"
                value={profile?.instituteEmail || ""}
                disabled
                className="mt-1 block w-full cursor-not-allowed rounded-lg border border-zinc-800 bg-zinc-900/30 p-2.5 text-zinc-500"
              />
            </div>
          )}
          <div>
            <label className="text-zinc-400 block">Branch</label>
            <select name="branch"
              value={profile?.branch || ""}
              onChange={handleChange}
              disabled           
              className="mt-1 block w-full cursor-not-allowed rounded-lg border border-zinc-800 bg-zinc-900/30 p-2.5 text-zinc-500">
                <option value="CSE">CSE/COE</option>
                <option value="AI">AI</option>
              </select>
          </div>
          <div>
            <label className="text-zinc-400 block">LinkedIn Profile (Link)</label>
            <input
              type="url"
              name="linkedInProfile"
              value={profile?.linkedInProfile || ""}
              onChange={handleChange}
              disabled={!isEditing}              
              className="mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-900/50 p-2.5 text-white transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
            />
          </div>
          {profile?.isAlumni && (
            <>
              <div>
                <label className="text-zinc-400 block">Current Company</label>
                <input
                  type="text"
                  name="currentCompany"
                  value={profile?.currentCompany || ""}
                  onChange={handleChange}
                  disabled={!isEditing}                
                  className="mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-900/50 p-2.5 text-white transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                />
              </div>
              <div>
                <label className="text-zinc-400 block">Designation</label>
                <input
                  type="text"
                  name="currentDesignation"
                  value={profile?.currentDesignation || ""}
                  onChange={handleChange}
                  disabled={!isEditing}                
                  className="mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-900/50 p-2.5 text-white transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                />
              </div>
              <div>
                <label className="text-zinc-400 block">Expertise</label>
                <input
                  type="text"
                  name="expertise"
                  value={expertiseInput}
                  onChange={handleChange}
                  disabled={!isEditing}                
                  className="mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-900/50 p-2.5 text-white transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                />
              </div>
            </>
          )}
          <div>
            <label className="text-zinc-400 block">GitHub Profile (Link)</label>
            <input
              type="url"
              name="githubProfile"
              value={profile?.githubProfile || ""}
              onChange={handleChange}
              disabled={!isEditing}              
              className="mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-900/50 p-2.5 text-white transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
            />
          </div>
          <div>
            <label className="text-zinc-400 block">LeetCode Profile (Only ID not Link)</label>
            <input
              name="leetcodeProfile"
              value={profile?.leetcodeProfile || ""}
              onChange={handleChange}
              disabled={!isEditing}              
              className="mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-900/50 p-2.5 text-white transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
            />
          </div>
          <div>
            <label className="text-zinc-400 block">Codeforces Profile (Only ID not Link)</label>
            <input
              name="codeforcesProfile"
              value={profile?.codeforcesProfile || ""}
              onChange={handleChange}
              disabled={!isEditing}              
              className="mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-900/50 p-2.5 text-white transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
            />
          </div>
          <div>
            <label className="text-zinc-400 block">CodeChef Profile (Only ID not Link)</label>
            <input
              name="codechefProfile"
              value={profile?.codechefProfile || ""}
              onChange={handleChange}
              disabled={!isEditing}
              className="mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-900/50 p-2.5 text-white transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
            />
          </div>
          <div>
            <label className="flex items-center text-sm font-medium text-zinc-300 transition-colors hover:text-white cursor-pointer select-none">
              <input
                type="checkbox"
                name="subscribed" 
                checked={!!profile?.subscribed}
                onChange={handleChange}
                disabled={!isEditing}
                className="mr-3 h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-blue-500 focus:ring-blue-500 focus:ring-offset-zinc-900 transition-colors"
              />
              Subscribe to newsletters
            </label>
          </div>
          <div>
            <label className="flex items-center text-sm font-medium text-zinc-300 transition-colors hover:text-white cursor-pointer select-none">
              <input
                type="checkbox"
                name="shareCodingProfile" 
                checked={!!profile?.shareCodingProfile}
                onChange={handleChange}
                disabled={!isEditing}
                className="mr-3 h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-blue-500 focus:ring-blue-500 focus:ring-offset-zinc-900 transition-colors"
              />
              Share Coding Profile
            </label>
          </div>
          </div>
          <div className="mt-8 flex items-center justify-between border-t border-zinc-700/50 pt-6">
            <div className="flex items-center gap-3">
              {isEditing ? (
                <>
                  <button
                    type="submit"
                    className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-70 disabled:cursor-not-allowed"
                    disabled={buttonLoading} 
                  >
                    {buttonLoading ? "Verifying & Saving..." : "Save Changes"} 
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="rounded-lg border border-zinc-600 bg-zinc-700/50 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-600"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  Edit Profile
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={handleForgotPassword}
              className="rounded-lg border border-red-500/20 bg-red-500/10 px-5 py-2.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20 hover:text-red-300"
            >
              Reset Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;