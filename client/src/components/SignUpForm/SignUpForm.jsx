import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import increamentCounter from "../../libs/increamentCounter";

function SignUpForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    admissionNumber: "",
    mobileNumber: "",
    personalEmail: "",
    instituteEmail: "",
    branch: "",
    linkedInProfile: "",
    githubProfile: "",
    leetcodeProfile: "",
    codeforcesProfile: "",
    codechefProfile: "",
    password: "",
    shareCodingProfile: false,
  });

  // Load form data from localStorage when the component mounts
  useEffect(() => {
    const savedFormData = localStorage.getItem("signupFormData");
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData));
    }
  }, []);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("signupFormData", JSON.stringify(formData));
  }, [formData]);

  const handleChange = (e) => {
    if (e.target.name === "admissionNumber") {
      e.target.value = e.target.value.toUpperCase();
    }

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.type === "checkbox" ? e.target.checked : e.target.value,
    });
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
    } = formData;

    const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const instituteEmailPattern =
      /^(((u|i)\d{2}(cs|ai))|(p\d{2}(cs|is|ds)))\d{3}@(coed|aid)\.svnit\.ac\.in$/;

    if (
      !admissionNumber.match(/(((I|U)\d{2}(CS|AI))|(P\d{2}(CS|DS|IS)))\d{3}/)
    ) {
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
    if (leetcodeProfile.includes("leetcode.com") || leetcodeProfile.includes("http") || leetcodeProfile.includes("/")) {
      toast.error("Invlaid LeetCode ID. Enter Only ID NOT URL!");
      return false;
    }
    if (codeforcesProfile.includes("codeforces.com") || codeforcesProfile.includes("http") || codeforcesProfile.includes("/")) {
      toast.error("Invlaid Codeforces ID. Enter Only ID NOT URL!");
      return false;
    }
    if (codechefProfile.includes("codechef.com") || codechefProfile.includes("http") || codechefProfile.includes("/")) {
      toast.error("Invlaid Codechef ID. Enter Only ID NOT URL!");
      return false;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const toastId = toast.loading("Signing up...");
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      const result = await res.json();
      if (res.ok) {
        toast.success(
          "Sign up successful! Please check your email to verify your account.",
          { id: toastId },
        );
        localStorage.removeItem("signupFormData"); // Clear saved form data on successful signup
        setTimeout(() => {
          window.location.href = "/login"; // Change this to your desired route
        }, 2000);
      } else {
        toast.error(result.message || "Sign up failed", { id: toastId });
      }
    } catch (error) {
      toast.remove();
      toast.error("Error signing up");
    }
  };

  useEffect(() => {
    increamentCounter();
  }, []);

  return (
    <div className="bg-black-2 md:p-16 p-6 pt-10">
      <div className="mb-5 flex justify-center">
        <img
          src="/assets/NEXUStext.png"
          alt="NEXUS"
          className="flex w-[20rem] items-center object-cover"
        />
      </div>

      <div className="flex min-h-screen items-center justify-center bg-black-2">
        <Toaster position="top-center" reverseOrder={false} />
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 w-full max-w-lg rounded-lg md:p-8 p-2 shadow-lg"
        >
          <h2 className="mb-6 text-center text-2xl font-semibold text-white">
            Sign Up
          </h2>

          <div className="mb-4">
            <label className="mb-2 block text-sm text-white" htmlFor="fullName">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              className="bg-gray-200 w-full rounded p-2 text-black"
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Your Full Name"
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="mb-2 block text-sm text-white"
              htmlFor="admissionNumber"
            >
              Admission Number <span className="text-red-500">*</span>
            </label>
            <input
              className="bg-gray-200 w-full rounded p-2 text-black"
              type="text"
              id="admissionNumber"
              name="admissionNumber"
              pattern="(((I|U)\d{2}(CS|AI))|(P\d{2}(CS|DS|IS)))\d{3}"
              value={formData.admissionNumber}
              onChange={handleChange}
              placeholder="IXXCSXXX or UXXAIXXX"
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="mb-2 block text-sm text-white"
              htmlFor="mobileNumber"
            >
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <input
              className="bg-gray-200 w-full rounded p-2 text-black"
              type="text"
              id="mobileNumber"
              name="mobileNumber"
              pattern="^[0-9]{10}$"
              value={formData.mobileNumber}
              onChange={handleChange}
              placeholder="10-digit Mobile Number"
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="mb-2 block text-sm text-white"
              htmlFor="personalEmail"
            >
              Personal Email <span className="text-red-500">*</span>
            </label>
            <input
              className="bg-gray-200 w-full rounded p-2 text-black"
              type="email"
              id="personalEmail"
              name="personalEmail"
              pattern="^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$"
              value={formData.personalEmail}
              onChange={handleChange}
              placeholder="Your Personal Email"
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="mb-2 block text-sm text-white"
              htmlFor="instituteEmail"
            >
              Institute Email <span className="text-red-500">*</span>
            </label>
            <input
              className="bg-gray-200 w-full rounded p-2 text-black"
              type="email"
              id="instituteEmail"
              name="instituteEmail"
              pattern="^(((u|i)\d{2}(cs|ai))|(p\d{2}(cs|is|ds)))\d{3}@(coed|aid)\.svnit\.ac\.in$"
              value={formData.instituteEmail}
              onChange={handleChange}
              placeholder="(u|i)XX(cs|ai)XXX@(coed|aid).svnit.ac.in"
              required
            />
          </div>

          <div className="mb-4">
            <label className="mb-2 block text-sm text-white" htmlFor="branch">
              Branch <span className="text-red-500">*</span>
            </label>
            <select
              className="bg-gray-200 w-full rounded p-2 text-black"
              id="branch"
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              required
            >
              <option value="">Select Branch</option>
              <option value="CSE">CSE</option>
              <option value="AI">AI</option>
            </select>
          </div>

          {/* Optional Fields */}
          <div className="mb-4">
            <label
              className="mb-2 block text-sm text-white"
              htmlFor="linkedInProfile"
            >
              LinkedIn Profile <span className="text-red-500">*</span>
            </label>
            <input
              className="bg-gray-200 w-full rounded p-2 text-black"
              type="url"
              id="linkedInProfile"
              name="linkedInProfile"
              pattern="^(https?:\/\/)?([\w]+\.)?linkedin\.com\/.*$"
              value={formData.linkedInProfile}
              onChange={handleChange}
              placeholder="LinkedIn Profile URL"
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="mb-2 block text-sm text-white"
              htmlFor="githubProfile"
            >
              GitHub Profile <span className="text-red-500">*</span>
            </label>
            <input
              className="bg-gray-200 w-full rounded p-2 text-black"
              type="url"
              id="githubProfile"
              name="githubProfile"
              pattern="^(https?:\/\/)?(www\.)?github\.com\/[A-z0-9_-]+\/?$"
              value={formData.githubProfile}
              onChange={handleChange}
              placeholder="GitHub Profile URL"
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="mb-2 block text-sm text-white"
              htmlFor="leetcodeProfile"
            >
              LeetCode Profile <span className="text-red-500">*</span>
            </label>
            <input
              className="bg-gray-200 w-full rounded p-2 text-black"
              id="leetcodeProfile"
              name="leetcodeProfile"
              value={formData.leetcodeProfile}
              onChange={handleChange}
              placeholder="LeetCode ID (e.g. neal_wu)"
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="mb-2 block text-sm text-white"
              htmlFor="codeforcesProfile"
            >
              Codeforces Profile <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full rounded bg-gray-2 p-2 text-black"
              id="codeforcesProfile"
              name="codeforcesProfile"
              value={formData.codeforcesProfile}
              onChange={handleChange}
              placeholder="Codeforces ID (e.g. tourist)"
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="mb-2 block text-sm text-white"
              htmlFor="codechefProfile"
            >
              CodeChef Profile
            </label>
            <input
              className="bg-gray-200 w-full rounded p-2 text-black"
              id="codechefProfile"
              name="codechefProfile"
              value={formData.codechefProfile}
              onChange={handleChange}
              placeholder="CodeChef ID (e.g. admin)"
            />
          </div>

          <div className="mb-4">
            <label className="mb-2 block text-sm text-white" htmlFor="password">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              className="bg-gray-200 w-full rounded p-2 text-black"
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password (min 8 characters)"
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="mb-2 block text-sm text-white"
              htmlFor="shareCodingProfile"
            >
              <input
                type="checkbox"
                id="shareCodingProfile"
                name="shareCodingProfile"
                checked={formData.shareCodingProfile}
                onChange={handleChange}
              />{" "}
              I agree to share my coding profiles on NEXUS's coding profile
              leaderboard for the analytics purpose.
            </label>
          </div>

          <button
            className="w-full rounded bg-blue-500 p-2 text-white hover:bg-blue-600"
            type="submit"
          >
            Sign Up
          </button>
          <div className="mt-3 text-white">
            Already registered?{" "}
            <a href="/login" className="text-blue-500 hover:underline">
              <i>Login here</i>
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUpForm;