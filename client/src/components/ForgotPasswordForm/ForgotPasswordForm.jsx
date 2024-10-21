import React, { useState } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';

const ForgotPasswordForm = () => {
  const [admissionNumber, setAdmissionNumber] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const toastId = toast.loading('Sending reset instructions...');
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/user/forgot-password`, { admissionNumber });
      
      toast.success('Password reset email sent!', { id: toastId });
    } catch (error) {
      toast.remove();
      console.error('Error during forgot password:', error.response?.data || error.message);
      toast.error('Failed to send reset email. Please try again later.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black-2 text-white">
      <Toaster />
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-md shadow-card-2 shadow-white">
        <h2 className="text-3xl font-bold text-center">Forgot Password</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col">
            <label htmlFor="admissionNumber" className="text-sm font-medium">Admission Number</label>
            <input
              type="text"
              id="admissionNumber"
              className="text-black-2 mt-1 px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-900"
              placeholder="Enter your admission number"
              value={admissionNumber}
              onChange={(e) => setAdmissionNumber(e.target.value.toUpperCase())}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 rounded-md hover:bg-blue-500 transition-all focus:ring-2 focus:ring-blue-700 focus:outline-none"
          >
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
