import React, { useState, useEffect } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast"; // Import the toast functionality
import increamentCounter from "../../libs/increamentCounter";
import { useNavigate, useSearchParams } from "react-router-dom";
import HeadTags from "../HeadTags/HeadTags";

const LoginForm = () => {
  const [admissionNumber, setAdmissionNumber] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Show a loading toast
      const toastId = toast.loading("Logging in...");

      // Send the login details to the backend for authentication
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/user/login`,
        { admissionNumber, password },
      );

      // Update the loading toast to a success message
      toast.success("Login successful! Redirecting...", { id: toastId });

      // Handle success (e.g., store JWT token, redirect, etc.)
      localStorage.setItem("token", response.data.token);

      // Redirect user after a short delay
      setTimeout(() => {
        if (searchParams.get("redirect_to")) {
          navigate(searchParams.get("redirect_to"));
        } else {
          navigate("/");
        }
      }, 2000); // 2-second delay for redirect
    } catch (error) {
      toast.remove();
      console.error(
        "Error during login:",
        error.response?.data || error.message,
      );
      // Show appropriate error toast based on the response from the server
      if (error.response && error.response.data) {
        if (error.response.data.message === "User not found") {
          toast.error("User not found. Please check your admission number.");
        } else if (error.response.data.message === "Invalid credentials") {
          toast.error("Invalid credentials. Please try again.");
        } else if (
          error.response.data.message ===
          "Your alumni account is pending verification. Please wait for admin approval."
        ) {
          toast.error("Alumni Verification Pending. Please wait for approval.");
        } else if (
          error.response.data.message ===
          "Please verify your email before logging in."
        ) {
          toast.error("Please verify your email before logging in.");
        } else {
          toast.error("An unexpected error occurred. Please try again later.");
        }
      } else {
        toast.error("Server is unreachable. Please try again later.");
      }
    }
  };
  useEffect(() => {
    increamentCounter();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-black-2 p-6 text-white">
      <HeadTags
        title="Login - Student Portal | Nexus NIT Surat"
        description="Login to your NEXUS account to access your dashboard."
      />
      <Toaster /> {/* Render the toast notifications */}
      <div className="bg-gray-800 w-full max-w-md space-y-6 rounded-md p-8 shadow-card-2 shadow-white">
        <div className="flex justify-center">
          <img
            src="/assets/NEXUStext.png"
            alt="NEXUS"
            className="flex w-[20rem] items-center object-cover"
          />
        </div>
        <h2 className="text-center text-3xl font-bold">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col">
            <label htmlFor="admissionNumber" className="text-sm font-medium">
              Admission Number
            </label>
            <input
              type="text"
              id="admissionNumber"
              className="border-gray-700 bg-gray-900 mt-1 rounded-md border px-3 py-2 text-black-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your admission number"
              value={admissionNumber}
              onChange={(e) => setAdmissionNumber(e.target.value.toUpperCase())}
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="border-gray-700 bg-gray-900 mt-1 rounded-md border px-3 py-2 text-black-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 py-2 transition-all hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-700"
          >
            Login
          </button>
          <div className="space-y-2">
            <p className="text-center text-sm">
              Don't have an account?{" "}
              <a href="/signup" className="text-blue-500 hover:underline">
                Sign up
              </a>
            </p>
            <p className="text-center text-sm">
              Don't remember the password?{" "}
              <a
                href="/forgot-password"
                className="text-blue-500 hover:underline"
              >
                Reset Password
              </a>
            </p>
            <p className="text-center text-sm">
              Are you alumni?{" "}
              <a
                href="/alumni/signup"
                className="text-blue-500 hover:underline"
              >
                Alumni Sign up
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
