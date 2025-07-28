import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast"; // Import react-hot-toast
import AlumnusBadge from "./AlumniBadge";

const ProfilePage = ({ profile, setProfile, setErr }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false); // New state for button loading
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [profileResponse, postsResponse] = await Promise.all([
          axios.get(
            `${process.env.REACT_APP_BACKEND_BASE_URL}/api/user/profile`,
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
        setErr(true);
        toast.error("Error fetching profile data.");
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile({ ...profile, [name]: type === "checkbox" ? checked : value });
  };

  const validateForm = () => {
    const {
      fullName,
      admissionNumber,
      mobileNumber,
      personalEmail,
      instituteEmail,
      branch,
      password,
      leetcodeProfile,
      codeforcesProfile,
      codechefProfile,
    } = profile;

    const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const instituteEmailPattern =
      /^(((u|i)\d{2}(cs|ai))|(p\d{2}(cs|is|ds)))\d{3}@(coed|aid)\.svnit\.ac\.in$/;

    if (!admissionNumber.match(/[UIP]\d{2}(?:CS|AI|CO|DS|IS)\d{3}/)) {
      toast.error("Invalid Admission Number");
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
    if (!instituteEmail.match(instituteEmailPattern)) {
      toast.error("Invalid Institute Email");
      return false;
    }
    if (leetcodeProfile.includes("leetcode.com/")) {
      toast.error("Invlaid LeetCode ID. Enter Only ID NOT URL!");
      return false;
    }
    if (codeforcesProfile.includes("codeforces.com/")) {
      toast.error("Invlaid Codeforces ID. Enter Only ID NOT URL!");
      return false;
    }
    if (codechefProfile.includes("codechef.com/")) {
      toast.error("Invlaid Codechef ID. Enter Only ID NOT URL!");
      return false;
    }

    if(instituteEmail.split("@")[0] !== admissionNumber.toLowerCase()) {
      return false;
    }

    // Add URL validation for coding profiles
    const urlPattern = /^https?:\/\/|www\.|\.com|\/|@/i;
    
    if (urlPattern.test(leetcodeProfile)) {
      toast.error("Please enter only your LeetCode username, not the full URL");
      return false;
    }
    if (urlPattern.test(codeforcesProfile)) {
      toast.error("Please enter only your Codeforces username, not the full URL");
      return false;
    }
    if (urlPattern.test(codechefProfile)) {
      toast.error("Please enter only your CodeChef username, not the full URL");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonLoading(true); // Show loading state in the button
    try {
      if (validateForm()) {
        const response = await axios.put(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/api/user/profile`,
          profile,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          },
        );
        setIsEditing(false);
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      console.log(error)
      console.error(
        "Error updating profile:",
        error.response?.data?.message || error.message,
      );
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setButtonLoading(false); // Hide loading state in the button
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password"); // Redirect to Forgot Password page
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
          <Toaster />{" "}
          {/* Toast notification container */}
          <div>
            <label className="text-gray-700 block">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={profile.fullName}
              onChange={handleChange}
              disabled={!isEditing}
              required
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
              required
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
              required
              className="border-gray-300 mt-1 block w-full rounded-md border bg-zinc-800 p-2 text-white"
            />
          </div>
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
          <div>
            <label className="text-gray-700 block">Branch</label>
            {/* <input
              type="text"
              name="branch"
              value={profile.branch}
              onChange={handleChange}
              disabled={!isEditing}
              required
              className="border-gray-300 mt-1 block w-full rounded-md border bg-zinc-800 p-2 text-white"
            /> */}
            <select name="branch"
              value={profile.branch}
              onChange={handleChange}
              disabled={!isEditing}
              required
              className="border-gray-300 mt-1 block w-full rounded-md border bg-zinc-800 p-2 text-white">
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
              required
              className="border-gray-300 mt-1 block w-full rounded-md border bg-zinc-800 p-2 text-white"
            />
          </div>
          <div>
            <label className="text-gray-700 block">GitHub Profile (Link)</label>
            <input
              type="url"
              name="githubProfile"
              value={profile.githubProfile}
              onChange={handleChange}
              disabled={!isEditing}
              required
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
              required
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
              required
              className="border-gray-300 mt-1 block w-full rounded-md border bg-zinc-800 p-2 text-white"
            />
          </div>
          <div>
            <label className="text-gray-700 block">CodeChef Profile (Only ID not Link)</label>{" "}
            {/* Added CodeChef Profile field */}
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
                name="subscribed" // Corrected to subscribed field
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
                name="shareCodingProfile" // New checkbox for shareCodingProfile
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
                  disabled={buttonLoading} // Disable button while loading
                >
                  {buttonLoading ? "Saving..." : "Save"} {/* Show loading text */}
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

export default ProfilePage;
