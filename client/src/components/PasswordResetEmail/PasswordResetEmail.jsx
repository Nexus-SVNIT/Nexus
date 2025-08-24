import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';

const ResetPasswordForm = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { token } = useParams(); // Extract the token from the URL params
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      return toast.error('Passwords do not match');
    }

    try {
      const toastId = toast.loading('Resetting password...');
      await axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/auth/reset-password/${token}`, {
        newPassword,
      });
      localStorage.removeItem('token'); // Remove token from local storage
      toast.success('Password reset successfully!', { id: toastId });
      navigate('/login'); // Redirect user to login page after successful reset
    } catch (error) {
      toast.remove();
      console.error('Error during password reset:', error.response?.data || error.message);
      toast.error('Failed to reset password. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black-2 text-white">
      <Toaster />
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-md shadow-card-2 shadow-white">
        <h2 className="text-3xl font-bold text-center">Reset Password</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col">
            <label htmlFor="newPassword" className="text-sm font-medium">New Password</label>
            <input
              type="password"
              id="newPassword"
              className="text-black-2 mt-1 px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-900"
              placeholder="Enter your new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              className="text-black-2 mt-1 px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-900"
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 rounded-md hover:bg-blue-500 transition-all focus:ring-2 focus:ring-blue-700 focus:outline-none"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
