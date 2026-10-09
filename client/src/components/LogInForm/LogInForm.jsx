import React, { useState, useEffect } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import increamentCounter from "../../libs/increamentCounter";
import { useNavigate, useSearchParams } from "react-router-dom";
import HeadTags from "../HeadTags/HeadTags";
import Logo from "../../data/images/nexus.png";

const LoginForm = () => {
  const [admissionNumber, setAdmissionNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const toastId = toast.loading("Logging in...");
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/auth/login`,
        { admissionNumber, password },
      );
      toast.success("Login successful! Redirecting...", { id: toastId });
      localStorage.setItem("token", response.data.token);
      setTimeout(() => {
        if (searchParams.get("redirect_to")) {
          navigate(searchParams.get("redirect_to"));
        } else {
          navigate("/");
        }
      }, 2000);
    } catch (error) {
      toast.remove();
      if (error.response?.data?.message === "User not found") {
        toast.error("User not found. Please check your admission number.");
      } else if (error.response?.data?.message === "Invalid credentials") {
        toast.error("Invalid credentials. Please try again.");
      } else if (
        error.response?.data?.message ===
        "Your alumni account is pending verification. Please wait for admin approval."
      ) {
        toast.error("Alumni Verification Pending. Please wait for approval.");
      } else if (
        error.response?.data?.message ===
        "Please verify your email before logging in."
      ) {
        toast.error("Please verify your email before logging in.");
      } else {
        toast.error("An unexpected error occurred. Please try again later.");
      }
    }
  };

  useEffect(() => {
    increamentCounter();
  }, []);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#060818] px-4 py-12">
      <HeadTags
        title="Login - Student Portal | Nexus NIT Surat"
        description="Login to your NEXUS account to access your dashboard."
      />
      <Toaster />

      {/* Background glow blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-cyan-500/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-blue-500/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Animated top border */}
        <div className="h-px w-full rounded-t-2xl bg-gradient-to-r from-transparent via-blue-500/60 to-transparent" />

        {/* Card */}
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-8 shadow-2xl backdrop-blur-xl">

          {/* Logo + wordmark */}
          <div className="mb-8 flex flex-col items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-md" />
              <img src={Logo} alt="Nexus" className="relative h-14 w-14 object-contain drop-shadow-lg" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-black tracking-widest bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                NEXUS
              </h1>
              <p className="text-xs text-zinc-500 tracking-widest uppercase mt-0.5">
                Student Portal · NIT Surat
              </p>
            </div>
          </div>

          <h2 className="mb-6 text-center text-xl font-bold text-white">
            Sign in to your account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Admission Number */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="admissionNumber" className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Admission Number
              </label>
              <input
                type="text"
                id="admissionNumber"
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.05] px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-all focus:border-blue-500/50 focus:bg-white/[0.08] focus:ring-1 focus:ring-blue-500/30"
                placeholder="e.g. U22CS001"
                value={admissionNumber}
                onChange={(e) => setAdmissionNumber(e.target.value.toUpperCase().trim())}
                required
                autoComplete="username"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.05] px-4 py-3 pr-11 text-sm text-white placeholder-zinc-600 outline-none transition-all focus:border-blue-500/50 focus:bg-white/[0.08] focus:ring-1 focus:ring-blue-500/30"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              <div className="flex justify-end">
                <a href="/forgot-password" className="text-xs text-zinc-500 hover:text-blue-400 transition-colors">
                  Forgot password?
                </a>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:from-blue-500 hover:to-cyan-400 hover:shadow-blue-500/30 active:scale-[0.98]"
            >
              Sign In
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/[0.06]" />
            <span className="text-xs text-zinc-600">or</span>
            <div className="h-px flex-1 bg-white/[0.06]" />
          </div>

          {/* Footer links */}
          <div className="space-y-2.5 text-center">
            <p className="text-xs text-zinc-500">
              Don't have an account?{" "}
              <a href="/signup" className="font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                Sign up
              </a>
            </p>
            <p className="text-xs text-zinc-500">
              Are you alumni?{" "}
              <a href="/alumni/signup" className="font-semibold text-cyan-400 hover:text-cyan-300 transition-colors">
                Alumni Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
