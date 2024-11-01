import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast'; // Import react-hot-toast

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    fullName: '',
    admissionNumber: '',
    mobileNumber: '',
    personalEmail: '',
    instituteEmail: '',
    branch: '',
    linkedInProfile: '',
    githubProfile: '',
    leetcodeProfile: '',
    codeforcesProfile: '',
    codechefProfile: '', // Added CodeChef profile
    subscribed: false // Corrected to subscribed field
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false); // New state for button loading
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/user/profile`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setProfile(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile:', error.response?.data?.message || error.message);
        toast.error('Error fetching profile.');
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile({ ...profile, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonLoading(true); // Show loading state in the button
    try {
      const response = await axios.put(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/user/profile`, profile, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error.response?.data?.message || error.message);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setButtonLoading(false); // Hide loading state in the button
    }
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password'); // Redirect to Forgot Password page
  };

  const SkeletonLoader = () => (
    <div className="space-y-4">
      {Array(10).fill().map((_, index) => (
        <div key={index} className="h-10 bg-gray-300 animate-pulse rounded-md"></div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-4 bg-zinc-900 shadow-lg rounded-lg mb-36">
        <SkeletonLoader />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4 bg-zinc-900 shadow-lg rounded-lg mb-36">
      <Toaster position="top-right" reverseOrder={false} /> {/* Toast notification container */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={profile.fullName}
            onChange={handleChange}
            disabled={!isEditing}
            className="text-white bg-zinc-800 mt-1 block w-full border border-gray-300 p-2 rounded-md"
          />
        </div>

        <div>
          <label className="block text-gray-700">Admission Number</label>
          <input
            type="text"
            name="admissionNumber"
            value={profile.admissionNumber}
            disabled
            className="text-white bg-zinc-800 mt-1 block w-full bg-gray-200 p-2 rounded-md cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-gray-700">Mobile Number</label>
          <input
            type="text"
            name="mobileNumber"
            value={profile.mobileNumber}
            onChange={handleChange}
            disabled={!isEditing}
            className="text-white bg-zinc-800 mt-1 block w-full border border-gray-300 p-2 rounded-md"
          />
        </div>

        <div>
          <label className="block text-gray-700">Personal Email</label>
          <input
            type="email"
            name="personalEmail"
            value={profile.personalEmail}
            onChange={handleChange}
            disabled={!isEditing}
            className="text-white bg-zinc-800 mt-1 block w-full border border-gray-300 p-2 rounded-md"
          />
        </div>

        <div>
          <label className="block text-gray-700">Institute Email</label>
          <input
            type="email"
            name="instituteEmail"
            value={profile.instituteEmail}
            disabled
            className="text-white bg-zinc-800 mt-1 block w-full bg-gray-200 p-2 rounded-md cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-gray-700">Branch</label>
          <input
            type="text"
            name="branch"
            value={profile.branch}
            onChange={handleChange}
            disabled={!isEditing}
            className="text-white bg-zinc-800 mt-1 block w-full border border-gray-300 p-2 rounded-md"
          />
        </div>

        <div>
          <label className="block text-gray-700">LinkedIn Profile</label>
          <input
            type="url"
            name="linkedInProfile"
            value={profile.linkedInProfile}
            onChange={handleChange}
            disabled={!isEditing}
            className="text-white bg-zinc-800 mt-1 block w-full border border-gray-300 p-2 rounded-md"
          />
        </div>

        <div>
          <label className="block text-gray-700">GitHub Profile</label>
          <input
            type="url"
            name="githubProfile"
            value={profile.githubProfile}
            onChange={handleChange}
            disabled={!isEditing}
            className="text-white bg-zinc-800 mt-1 block w-full border border-gray-300 p-2 rounded-md"
          />
        </div>

        <div>
          <label className="block text-gray-700">LeetCode Profile</label>
          <input
            name="leetcodeProfile"
            value={profile.leetcodeProfile}
            onChange={handleChange}
            disabled={!isEditing}
            className="text-white bg-zinc-800 mt-1 block w-full border border-gray-300 p-2 rounded-md"
          />
        </div>

        <div>
          <label className="block text-gray-700">Codeforces Profile</label>
          <input
            name="codeforcesProfile"
            value={profile.codeforcesProfile}
            onChange={handleChange}
            disabled={!isEditing}
            className="text-white bg-zinc-800 mt-1 block w-full border border-gray-300 p-2 rounded-md"
          />
        </div>

        <div>
          <label className="block text-gray-700">CodeChef Profile</label> {/* Added CodeChef Profile field */}
          <input
            name="codechefProfile"
            value={profile.codechefProfile}
            onChange={handleChange}
            disabled={!isEditing}
            className="text-white bg-zinc-800 mt-1 block w-full border border-gray-300 p-2 rounded-md"
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

        <div className="flex justify-between items-center">
          {isEditing ? (
            <>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                disabled={buttonLoading} // Disable button while loading
              >
                {buttonLoading ? 'Saving...' : 'Save'} {/* Show loading text */}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Edit Profile
            </button>
          )}
          <button
            type="button"
            onClick={handleForgotPassword}
            className="bg-red-500 text-white px-4 py-2 rounded-md"
          >
            Forgot Password
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
