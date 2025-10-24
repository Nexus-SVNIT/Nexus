import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import increamentCounter from "../../libs/increamentCounter";
import HeadTags from "../HeadTags/HeadTags";
import { FaInfoCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

function AlumniSignUpForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    admissionNumber: "",
    mobileNumber: "",
    personalEmail: "",
    branch: "",
    linkedInProfile: "",
    currentCompany: "",
    currentDesignation: "",
    expertise: [],
    // Optional fields
    githubProfile: "",
    leetcodeProfile: "",
    codeforcesProfile: "",
    codechefProfile: "",
    password: "",
    shareCodingProfile: false,
  });
  
  const [showProfiles, setShowProfiles] = useState(false);

  // Same useEffect hooks as SignUpForm
  useEffect(() => {
    const savedFormData = localStorage.getItem("alumniSignupFormData");
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("alumniSignupFormData", JSON.stringify(formData));
  }, [formData]);

  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/companies`,
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        setCompanies(data.map((company) => company.name));
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };

    fetchCompanies();
  }, []);

  const handleChange = (e) => {
    let value;

    const nameToValue = () => {
      if(e.target.value.length === 0) return "";
      if(e.target.value.length === 1) return e.target.value.toUpperCase().trim();
      if(e.target.value.charAt(e.target.value.length - 1) === ' ') return e.target.value.trim() + ' ';
      if(e.target.value.charAt(e.target.value.length - 2) === ' ') return e.target.value.slice(0,e.target.value.length - 2).trim() + ' ' + e.target.value.charAt(e.target.value.length - 1).toUpperCase();
      return e.target.value.trim();
    };

    switch (e.target.name) {
      case "expertise":
      // case "fullName":
      case "currentCompany":
      case "currentDesignation":
      case "password":
      case "currentCompany":
      case "currentDesignation":
        value = e.target.value;
        break;
      case "fullName":
        value = nameToValue(e);
        break;
      case "admissionNumber":
        value = e.target.value.toUpperCase().trim();
        break;
      default:
        value =
          e.target.type === "checkbox" ? e.target.checked : e.target.value.trim();
        break;
    }

    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };


  const validateForm = () => {
    const {
      fullName,
      admissionNumber,
      mobileNumber,
      personalEmail,
      branch,
      passingYear,
      currentCompany,
      currentDesignation,
      expertise,
      linkedInProfile,
      githubProfile,
      password,
    } = formData;

    const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    if (!fullName) {
      toast.error("Full Name is required");
      return false;
    }
    if (!fullName.match(/^[a-zA-Z ]*$/)){
      toast.error("Full Name must have letters and spaces only");
      return false;
    }
    if (!admissionNumber.match(/[UIPD]\d{2}(?:CS|AI|CO|DS|IS)\d{3}/)) {
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
    // if (!branch) {
    //   toast.error("Branch is required");
    //   return false;
    // }
    if (!passingYear.match(/^(19|20)\d{2}$/)) {
      toast.error("Invalid Passing Year");
      return false;
    }
    if (!linkedInProfile || !linkedInProfile.includes("linkedin.com")) {
      toast.error("LinkedIn Profile URL is required");
      return false;
    }
    if (!currentCompany) {
      toast.error("Current Company is required");
      return false;
    }
    if (!currentDesignation) {
      toast.error("Current Designation is required");
      return false;
    }
    if (expertise.length === 0){
      toast.error("Enter your expertise");
      return false;
    }
    if (githubProfile && !githubProfile.match(/^(https?:\/\/)?(www\.)?github\.com\/[A-Za-z0-9-]+\/?$/)) {
      toast.error("Invalid GitHub Profile URL");
      return false;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return false;
    }

    // Add alumni validation
    const currentDate = new Date();
    const academicYear =
      currentDate.getMonth() >= 6
        ? currentDate.getFullYear()
        : currentDate.getFullYear() - 1;

    const admissionYear =
      2000 + parseInt(formData.admissionNumber.substring(1, 3));
    const programType = formData.admissionNumber.charAt(0);
    const yearsSinceAdmission = academicYear - admissionYear;
    const passingYearInt = parseInt(formData.passingYear);

    if (
      ((programType === "U" && yearsSinceAdmission < 4) ||
        (programType === "I" && yearsSinceAdmission < 5) ||
        (programType === "P" && yearsSinceAdmission < 2)) &&
      passingYearInt <= academicYear
    ) {
      toast.error("You are not eligible for alumni registration yet");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataTosend = {
      ...formData,
      fullName: formData.fullName.trim(),
      expertise: formData.expertise.split(",").map((exp) => exp.trim()),
      branch: formData.admissionNumber.slice(1,3) === "AI" ? "AI" : "CSE"
    }

    if (!validateForm()) return;

    try {
      const toastId = toast.loading("Signing up...");
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/auth/alumni/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(dataTosend),
        },
      );

     
      const result = await res.json();
      if (res.ok) {
        toast.success(
          "Sign up successful! Please check your personal email to verify your account.",
          { id: toastId },
        );
        localStorage.removeItem("alumniSignupFormData");
        setTimeout(() => {
          window.location.href = `/login?redirect_to=${encodeURIComponent(window.location.pathname)}`;
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
    <div className="bg-black-2 p-6 pt-10 md:p-16">
      <HeadTags
        title={"Alumni Sign Up - Student Portal| Nexus - NIT Surat"}
        description={
          "Sign up to the Nexus Alumni Portal to get access to all the features."
        }
      />
      <div className="mb-5 flex justify-center">
        <img
          src="/assets/NEXUStext.png"
          alt="NEXUS"
          className="flex w-[20rem] items-center object-cover"
        />
      </div>
      <div className="mx-2 mt-10 flex w-fit items-center justify-center gap-3 rounded-md bg-yellow-400/25 p-2 px-4 md:mx-auto ">
        <FaInfoCircle size={42} className="h-auto text-yellow-500" />
        <p className="w-[90%] text-xs text-white/80 md:w-full md:text-base">
          Welcome to the Alumni Sign Up Page! Shine a Spotlight on Your Success
          !!
          <br />
          Please provide all profile links/usernames to help us in building a
          better{" "}
          <Link
            to="/coding"
            target="_blank"
            className="text-blue-400 hover:underline"
          >
            coding profile leaderboard.
          </Link>{" "}
        </p>
      </div>
      <div className="flex min-h-screen items-center justify-center bg-black-2">
        <Toaster position="top-center" reverseOrder={false} />
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 w-full max-w-lg rounded-lg p-2 shadow-lg md:p-8"
        >
          <h2 className="mb-6 text-center text-2xl font-semibold text-white">
            Alumni Sign Up
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
              pattern="[UIP]\d{2}(?:CS|AI|CO|DS|IS)\d{3}"
              value={formData.admissionNumber}
              onChange={handleChange}
              placeholder="[UYYCSXXX, UYYAIXXX, UYYCOXXX, IYYAIXXX,  PYYCSXXX, PYYDSXXX, PYYISXXX]"
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

          {/* <div className="mb-4">
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
              <option value="CSE">CSE/COE</option>
              <option value="AI">AI</option>
            </select>
          </div> */}

          <div className="mb-4">
            <label
              className="mb-2 block text-sm text-white"
              htmlFor="passingYear"
            >
              Passing Year <span className="text-red-500">*</span>
            </label>
            <input
              className="bg-gray-200 w-full rounded p-2 text-black"
              type="text"
              id="passingYear"
              name="passingYear"
              // pattern="^(19|20)[0-9]{2}$"
              value={formData.passingYear}
              onChange={handleChange}
              placeholder="YYYY"
              required
            />
          </div>

          {/* Profile input fields */}
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
              htmlFor="currentCompany"
            >
              Company Name <span className="text-red-500">*</span>
            </label>
            <input
              className="bg-gray-200 w-full rounded p-2 text-black"
              type="text"
              list="companies"
              id="currentCompany"
              name="currentCompany"
              value={formData.currentCompany}
              onChange={handleChange}
              placeholder="Your Company Name"
              required
            />
            <datalist id="companies">
              {companies.map((company) => (
                <option key={company} value={company}>
                  {company}
                </option>
              ))}
            </datalist>
          </div>
          <div className="mb-4">
            <label
              className="mb-2 block text-sm text-white"
              htmlFor="currentDesignation"
            >
              Designation <span className="text-red-500">*</span>
            </label>
            <input
              className="bg-gray-200 w-full rounded p-2 text-black"
              type="text"
              id="currentDesignation"
              name="currentDesignation"
              value={formData.currentDesignation}
              onChange={handleChange}
              placeholder="Your Designation"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="mb-2 block text-sm text-white"
              htmlFor="expertise"
            >
              Expertise <span className="text-red-500">*</span>
            </label>
            <input
              className="bg-gray-200 w-full rounded p-2 text-black"
              type="text"
              id="expertise"
              name="expertise"
              value={formData.expertise}
              onChange={handleChange}
              placeholder="Your Expertise"
              required
            />
          </div>
          
          <div className="mb-4">
            <label
              className="mb-2 block text-sm text-white"
              htmlFor="showProfile"
            >
              <input
                type="checkbox"
                id="showProfile"
                name="showProfile"
                checked={showProfiles}
                onChange={() => {setShowProfiles(showProfiles => !showProfiles)}}
              />{" "}
              Would you like to add your Github and Coding Profiles?
            </label>
          </div>

          {showProfiles && (
            <>
              <div className="mb-4">
                <label
                  className="mb-2 block text-sm text-white"
                  htmlFor="githubProfile"
                >
                  GitHub Profile
                </label>
                <input
                  className="bg-gray-200 w-full rounded p-2 text-black"
                  type="url"
                  id="githubProfile"
                  name="githubProfile"
                  pattern="^(https?:\/\/)?(www\.)?github\.com\/[A-Za-z0-9-]+\/?$"
                  value={formData.githubProfile}
                  onChange={handleChange}
                  placeholder="GitHub Profile URL"
                />
              </div>

              <div className="mb-4">
                <label
                  className="mb-2 block text-sm text-white"
                  htmlFor="leetcodeProfile"
                >
                  LeetCode Profile
                </label>
                <input
                  className="bg-gray-200 w-full rounded p-2 text-black"
                  id="leetcodeProfile"
                  name="leetcodeProfile"
                  value={formData.leetcodeProfile}
                  onChange={handleChange}
                  placeholder="LeetCode ID (e.g. neal_wu)"
                />
              </div>

              <div className="mb-4">
                <label
                  className="mb-2 block text-sm text-white"
                  htmlFor="codeforcesProfile"
                >
                  Codeforces Profile
                </label>
                <input
                  className="w-full rounded bg-gray-2 p-2 text-black"
                  id="codeforcesProfile"
                  name="codeforcesProfile"
                  value={formData.codeforcesProfile}
                  onChange={handleChange}
                  placeholder="Codeforces ID (e.g. tourist)"
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
            </>
          )}

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

          {showProfiles && (
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
          )}

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

export default AlumniSignUpForm;
