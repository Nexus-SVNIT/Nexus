import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast"; 
import AlumnusBadge from "./AlumniBadge";

const Profile = ({ profile, setProfile, setErr }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false); 
  const navigate = useNavigate();

  const [expertiseInput, setExpertiseInput] = useState("");

  useEffect(() => {
    if (profile.expertise && Array.isArray(profile.expertise)) {
      setExpertiseInput(profile.expertise.join(", "));
    }
  }, [profile.isAlumni, profile.expertise]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [profileResponse] = await Promise.all([
          axios.get(
            `${process.env.REACT_APP_BACKEND_BASE_URL}/user/profile`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          )
        ]);
        
        setProfile(profileResponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
        
        // --- THE FIX IS HERE ---
        // OLD: setErr(true); 
        // NEW: Pass the actual error object so the parent can check the status code
        setErr(error); 
        // -----------------------
        
        toast.error("Error fetching profile data.");
      }
    };

    fetchUserData();
  }, [setProfile, setErr]); // Added dependencies for safety

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
    } = profile;

    const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    if (!fullName) {
      toast.error("Full Name is required");
      return false;
    }
    if (!mobileNumber.match(/^[0-9]{10}$/)) {
      toast.error("Invalid Mobile Number");
      return false;
    }
    if (!personalEmail.match(emailPattern)) {
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

        if (profile.isAlumni) {
          const expertiseArray = expertiseInput
            .split(',')
            .map((exp) => exp.trim())
            .filter((exp) => exp);
          updatedProfile.expertise = expertiseArray;
        }

        await axios.put(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/user/profile`,
          updatedProfile,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );

        setProfile(updatedProfile);
        setIsEditing(false);
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      console.error(
        "Error updating profile:",
        error.response?.data?.message || error.message
      );
      toast.error("Failed to update profile. Please try again.");
      
      // OPTIONAL: If updating fails due to Auth, you might want to trigger the redirect here too
      if (error.response?.status === 401) {
          setErr(error);
      }
      
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
            className="bg-gray-300 h-10 animate-pulse rounded-md"
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

  return (
    <div className="space-y-8">
      {/* Profile Form Box */}
      <div className="rounded-lg bg-zinc-800/50 border border-zinc-700/50 p-6 backdrop-blur-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-200">Personal Information</h3>
          {profile['isAlumni'] && <AlumnusBadge/>}
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Toaster />
          <div>
            <label className="text-gray-700 block">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={profile.fullName}
              onChange={handleChange}
              disabled={!isEditing}
              className="border-gray-300 mt-1 block w-full rounded-md border bg-zinc-800 p-2 text-white"
            />
          </div>
          <div>
            <label className="text-gray-700 block">Admission Number</label>
            <input
              type="text"
              name="admissionNumber"
              value={profile.admissionNumber}
              disabled
              className="bg-gray-200 mt-1 block w-full cursor-not-allowed rounded-md bg-zinc-800 p-2 text-white"
            />
          </div>
          <div>
            <label className="text-gray-700 block">Mobile Number</label>
            <input
              type="text"
              name="mobileNumber"
              value={profile.mobileNumber}
              onChange={handleChange}
              disabled={!isEditing}
              className="border-gray-300 mt-1 block w-full rounded-md border bg-zinc-800 p-2 text-white"
            />
          </div>
          <div>
            <label className="text-gray-700 block">Personal Email</label>
            <input
              type="email"
              name="personalEmail"
              value={profile.personalEmail}
              onChange={handleChange}
              disabled={!isEditing}              
              className="border-gray-300 mt-1 block w-full rounded-md border bg-zinc-800 p-2 text-white"
            />
          </div>
          {!profile['isAlumni'] && (
            <div>
              <label className="text-gray-700 block">Institute Email</label>
              <input
                type="email"
                name="instituteEmail"
                value={profile.instituteEmail}
                disabled
                className="bg-gray-200 mt-1 block w-full cursor-not-allowed rounded-md bg-zinc-800 p-2 text-white"
              />
            </div>
          )}
          <div>
            <label className="text-gray-700 block">Branch</label>
            <select name="branch"
              value={profile.branch}
              onChange={handleChange}
              disabled            
              className="bg-gray-200 mt-1 block w-full cursor-not-allowed rounded-md bg-zinc-800 p-2 text-white">
                <option value="CSE">CSE/COE</option>
                <option value="AI">AI</option>
              </select>
          </div>
          <div>
            <label className="text-gray-700 block">LinkedIn Profile (Link)</label>
            <input
              type="url"
              name="linkedInProfile"
              value={profile.linkedInProfile}
              onChange={handleChange}
              disabled={!isEditing}              
              className="border-gray-300 mt-1 block w-full rounded-md border bg-zinc-800 p-2 text-white"
            />
          </div>
          {profile['isAlumni'] && (
            <>
              <div>
                <label className="text-gray-700 block">Current Company</label>
                <input
                  type="text"
                  name="currentCompany"
                  value={profile.currentCompany}
                  onChange={handleChange}
                  disabled={!isEditing}                
                  className="border-gray-300 mt-1 block w-full rounded-md border bg-zinc-800 p-2 text-white"
                />
              </div>
              <div>
                <label className="text-gray-700 block">Designation</label>
                <input
                  type="text"
                  name="currentDesignation"
                  value={profile.currentDesignation}
                  onChange={handleChange}
                  disabled={!isEditing}                
                  className="border-gray-300 mt-1 block w-full rounded-md border bg-zinc-800 p-2 text-white"
                />
              </div>
              <div>
                <label className="text-gray-700 block">Expertise</label>
                <input
                  type="text"
                  name="expertise"
                  value={expertiseInput}
                  onChange={handleChange}
                  disabled={!isEditing}                
                  className="border-gray-300 mt-1 block w-full rounded-md border bg-zinc-800 p-2 text-white"
                />
              </div>
            </>
          )}
          <div>
            <label className="text-gray-700 block">GitHub Profile (Link)</label>
            <input
              type="url"
              name="githubProfile"
              value={profile.githubProfile}
              onChange={handleChange}
              disabled={!isEditing}              
              className="border-gray-300 mt-1 block w-full rounded-md border bg-zinc-800 p-2 text-white"
            />
          </div>
          <div>
            <label className="text-gray-700 block">LeetCode Profile (Only ID not Link)</label>
            <input
              name="leetcodeProfile"
              value={profile.leetcodeProfile}
              onChange={handleChange}
              disabled={!isEditing}              
              className="border-gray-300 mt-1 block w-full rounded-md border bg-zinc-800 p-2 text-white"
            />
          </div>
          <div>
            <label className="text-gray-700 block">Codeforces Profile (Only ID not Link)</label>
            <input
              name="codeforcesProfile"
              value={profile.codeforcesProfile}
              onChange={handleChange}
              disabled={!isEditing}              
              className="border-gray-300 mt-1 block w-full rounded-md border bg-zinc-800 p-2 text-white"
            />
          </div>
          <div>
            <label className="text-gray-700 block">CodeChef Profile (Only ID not Link)</label>{" "}
            <input
              name="codechefProfile"
              value={profile.codechefProfile}
              onChange={handleChange}
              disabled={!isEditing}
              className="border-gray-300 mt-1 block w-full rounded-md border bg-zinc-800 p-2 text-white"
            />
          </div>
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="subscribed" 
                checked={profile.subscribed}
                onChange={handleChange}
                disabled={!isEditing}
                className="mr-2"
              />
              Subscribe to newsletters
            </label>
          </div>
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="shareCodingProfile" 
                checked={profile.shareCodingProfile}
                onChange={handleChange}
                disabled={!isEditing}
                className="mr-2"
              />
              Share Coding Profile
            </label>
          </div>
          <div className="flex items-center justify-between">
            {isEditing ? (
              <>
                <button
                  type="submit"
                  className="rounded-md bg-blue-500 px-4 py-2 text-white"
                  disabled={buttonLoading} 
                >
                  {buttonLoading ? "Saving..." : "Save"} 
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-500 rounded-md px-4 py-2 text-white"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="rounded-md bg-blue-500 px-4 py-2 text-white"
              >
                Edit Profile
              </button>
            )}
            <button
              type="button"
              onClick={handleForgotPassword}
              className="rounded-md bg-red-500 px-4 py-2 text-white"
            >
              Forgot Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;