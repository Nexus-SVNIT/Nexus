import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // For navigation

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
    codeforcesProfile: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate(); // To handle navigation

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
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${process.env.REACT_APP_BACKEND_BASE_URL}/profile`, profile, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('Profile updated successfully:', response.data);
    } catch (error) {
      console.error('Error updating profile:', error.response?.data?.message || error.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleForgotPassword = () => {
    navigate('/forgot-password'); // Redirect to Forgot Password page
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4 bg-zinc-900 shadow-lg rounded-lg mb-36">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Profile</h2>
      {message && <p className="text-green-500">{message}</p>}

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
            type="url"
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
            type="url"
            name="codeforcesProfile"
            value={profile.codeforcesProfile}
            onChange={handleChange}
            disabled={!isEditing}
            className="text-white bg-zinc-800 mt-1 block w-full border border-gray-300 p-2 rounded-md"
          />
        </div>

        <div className="flex justify-between items-center">
          {isEditing ? (
            <>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Save
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
              disabled={true}
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-not-allowed"
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
