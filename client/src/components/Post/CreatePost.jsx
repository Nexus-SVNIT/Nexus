// src/pages/CreatePost.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; 
import "./CreatePost.css"; 

const CreatePost = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    company: "",
    tags: "",
    campusType: "",
    jobType: "",
    selectionProcess: {
      onlineAssessment: {
        aptitude: false,
        coreSubject: false,
        codingRound: false,
        english: false,
        communication: false
      },
      groupDiscussion: false,
      onlineInterview: false,
      offlineInterview: false,
      others: []
    },
    rounds: {
      technical: 0,
      hr: 0,
      hybrid: 0
    },
    compensation: {
      stipend: "",
      ctc: "",
      baseSalary: ""
    },
    difficultyLevel: 1,
    hiringPeriod: {
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear()
    },
    cgpaCriteria: {
      boys: "",
      girls: ""
    },
    shortlistCriteria: {
      boys: "",
      girls: ""
    },
    shortlistedCount: {
      boys: "",
      girls: ""
    },
    selectedCount: {
      boys: "",
      girls: ""
    },
    workMode: "",
    location: ""
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('onlineAssessment.')) {
      const assessment = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        selectionProcess: {
          ...prev.selectionProcess,
          onlineAssessment: {
            ...prev.selectionProcess.onlineAssessment,
            [assessment]: checked
          }
        }
      }));
    } else if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'number' ? Number(value) : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      })); 
    }
  };

  const handleEditorChange = (value) => {
    setFormData({ ...formData, content: value });
  };

  const handleSelectionProcessChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      selectionProcess: {
        ...prev.selectionProcess,
        [name]: checked
      }
    }));
  };

  const handleAssessmentChange = (assessment) => {
    setFormData(prev => ({
      ...prev,
      selectionProcess: {
        ...prev.selectionProcess,
        onlineAssessment: {
          ...prev.selectionProcess.onlineAssessment,
          [assessment]: !prev.selectionProcess.onlineAssessment[assessment]
        }
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const tagsArray = formData.tags.split(",").map((tag) => tag.trim());
      
      // Convert compensation values to numbers
      const processedData = {
        ...formData,
        tags: tagsArray,
        compensation: {
          stipend: Number(formData.compensation.stipend) || null,
          ctc: Number(formData.compensation.ctc) || null,
          baseSalary: Number(formData.compensation.baseSalary) || null
        }
      };

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/posts`,
        processedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      alert("Post created successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create the post.");
    }
  };

  const inputClassName = "w-full p-2 bg-zinc-800 text-white border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500";
  const selectClassName = "w-full p-2 bg-zinc-800 text-white border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500";
  const labelClassName = "block text-sm font-medium mb-2 text-gray-200";

  return (
    <div className="min-h-screen p-6 mx-auto max-w-4xl bg-gray-900">
      <h2 className="text-3xl font-bold mb-6 text-white">Create Post</h2>
      <form className="shadow-lg rounded-lg p-6 bg-zinc-900" onSubmit={handleSubmit}>
        {/* Title */}
        <div className="mb-4">
          <label className={labelClassName}>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={inputClassName}
            required
          />
        </div>

        {/* Content with React Quill */}
        <div className="mb-4">
          <label className={labelClassName}>Content</label>
          <div className="text-white">
            <ReactQuill
              value={formData.content}
              onChange={handleEditorChange}
              theme="snow"
              placeholder="Write your interview experience here..."
              className="mt-2 bg-zinc-800 border-zinc-700 rounded-lg custom-quill"
            />
          </div>
        </div>

        {/* Company */}
        <div className="mb-4">
          <label className={labelClassName}>Company</label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className={inputClassName}
            required
          />
        </div>

        {/* Interview Details Section */}
        <div className="space-y-4 mb-4">
          <h3 className="text-lg font-semibold text-gray-200">Interview Details</h3>
          
          {/* Campus and Job Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClassName}>Campus Type</label>
              <select
                name="campusType"
                value={formData.campusType}
                onChange={handleChange}
                className={selectClassName}
                required
              >
                <option value="">Select Type</option>
                <option value="In Campus">In Campus</option>
                <option value="Off Campus">Off Campus</option>
                <option value="Pool Campus">Pool Campus</option>
              </select>
            </div>

            <div>
              <label className={labelClassName}>Job Type</label>
              <select
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
                className={selectClassName}
                required
              >
                <option value="">Select Type</option>
                <option value="2 Month Internship">2 Month Internship</option>
                <option value="6 Month Internship">6 Month Internship</option>
                <option value="Full Time">Full Time</option>
                <option value="6 Month Internship + Full Time">Internship + Full Time</option>
              </select>
            </div>
          </div>

          {/* Selection Process */}
          <div className="p-4 border border-zinc-700 rounded-lg bg-zinc-800/50">
            <h4 className="font-medium text-gray-200 mb-4">Selection Process</h4>
            
            {/* Online Assessment Section */}
            <div className="space-y-2 mb-4">
              <h5 className="text-sm font-medium text-gray-300">Online Assessment</h5>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(formData.selectionProcess.onlineAssessment).map(([key, value]) => (
                  <div key={key} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`oa-${key}`}
                      checked={value}
                      onChange={() => handleAssessmentChange(key)}
                      className="mr-2 h-4 w-4 rounded bg-zinc-700 border-zinc-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <label 
                      htmlFor={`oa-${key}`} 
                      className="text-gray-200 cursor-pointer select-none"
                    >
                      {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Other Selection Processes */}
            <div className="space-y-2 border-t border-zinc-700 pt-4">
              <h5 className="text-sm font-medium text-gray-300 mb-2">Other Processes</h5>
              <div className="grid grid-cols-2 gap-4"></div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="groupDiscussion"
                    checked={formData.selectionProcess.groupDiscussion}
                    onChange={handleSelectionProcessChange}
                    className="mr-2 rounded bg-zinc-700 border-zinc-600"
                  />
                  <label className="text-gray-200">Group Discussion</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="onlineInterview"
                    checked={formData.selectionProcess.onlineInterview}
                    onChange={handleSelectionProcessChange}
                    className="mr-2 rounded bg-zinc-700 border-zinc-600"
                  />
                  <label className="text-gray-200">Online Interview</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="offlineInterview"
                    checked={formData.selectionProcess.offlineInterview}
                    onChange={handleSelectionProcessChange}
                    className="mr-2 rounded bg-zinc-700 border-zinc-600"
                  />
                  <label className="text-gray-200">Offline Interview</label>
                </div>
              </div>
            </div>
          </div>

          {/* Interview Rounds */}
          <div className="grid grid-cols-3 gap-4">
            {Object.keys(formData.rounds).map(roundType => (
              <div key={roundType}>
                <label className={labelClassName}>
                  {roundType.charAt(0).toUpperCase() + roundType.slice(1)} Rounds
                </label>
                <input
                  type="number"
                  name={`rounds.${roundType}`}
                  value={formData.rounds[roundType]}
                  onChange={handleChange}
                  min="0"
                  className={inputClassName}
                />
              </div>
            ))}
          </div>

          {/* Compensation */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelClassName}>Stipend (₹/month)</label>
              <input
                type="number"
                name="compensation.stipend"
                value={formData.compensation.stipend}
                onChange={handleChange}
                className={inputClassName}
              />
            </div>
            <div>
              <label className={labelClassName}>CTC (LPA)</label>
              <input
                type="number"
                name="compensation.ctc"
                value={formData.compensation.ctc}
                onChange={handleChange}
                className={inputClassName}
              />
            </div>
            <div>
              <label className={labelClassName}>Base Salary (LPA)</label>
              <input
                type="number"
                name="compensation.baseSalary"
                value={formData.compensation.baseSalary}
                onChange={handleChange}
                className={inputClassName}
              />
            </div>
          </div>

          {/* Add Hiring Period before Difficulty Level */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClassName}>Hiring Month</label>
              <select
                name="hiringPeriod.month"
                value={formData.hiringPeriod.month}
                onChange={handleChange}
                className={selectClassName}
                required
              >
                <option value="">Select Month</option>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(2000, i, 1).toLocaleString('default', { month: 'long' })}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClassName}>Hiring Year</label>
              <select
                name="hiringPeriod.year"
                value={formData.hiringPeriod.year}
                onChange={handleChange}
                className={selectClassName}
                required
              >
                <option value="">Select Year</option>
                {Array.from({ length: 5 }, (_, i) => {
                  const year = new Date().getFullYear() - 2 + i;
                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* Difficulty Level */}
          <div>
            <label className={labelClassName}>Difficulty Level (1-10)</label>
            <input
              type="range"
              name="difficultyLevel"
              min="1"
              max="10"
              value={formData.difficultyLevel}
              onChange={handleChange}
              className="w-full accent-blue-500"
            />
            <div className="text-center text-gray-200">{formData.difficultyLevel}</div>
          </div>

        {/* Placement Statistics */}
        <div className="space-y-4 mb-4">
          <h3 className="text-lg font-semibold text-gray-200">Placement Statistics</h3>
          
          {/* CGPA Criteria */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClassName}>CGPA Criteria (Boys)</label>
              <input
                type="number"
                step="0.01"
                name="cgpaCriteria.boys"
                value={formData.cgpaCriteria.boys}
                onChange={handleChange}
                className={inputClassName}
                min="0"
                max="10"
              />
            </div>
            <div>
              <label className={labelClassName}>CGPA Criteria (Girls)</label>
              <input
                type="number"
                step="0.01"
                name="cgpaCriteria.girls"
                value={formData.cgpaCriteria.girls}
                onChange={handleChange}
                className={inputClassName}
                min="0"
                max="10"
              />
            </div>
          </div>

          {/* Shortlisting Statistics */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClassName}>Shortlisted Boys</label>
              <input
                type="number"
                name="shortlistedCount.boys"
                value={formData.shortlistedCount.boys}
                onChange={handleChange}
                className={inputClassName}
                min="0"
              />
            </div>
            <div>
              <label className={labelClassName}>Shortlisted Girls</label>
              <input
                type="number"
                name="shortlistedCount.girls"
                value={formData.shortlistedCount.girls}
                onChange={handleChange}
                className={inputClassName}
                min="0"
              />
            </div>
          </div>

          {/* Selected Candidates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClassName}>Selected Boys</label>
              <input
                type="number"
                name="selectedCount.boys"
                value={formData.selectedCount.boys}
                onChange={handleChange}
                className={inputClassName}
                min="0"
              />
            </div>
            <div>
              <label className={labelClassName}>Selected Girls</label>
              <input
                type="number"
                name="selectedCount.girls"
                value={formData.selectedCount.girls}
                onChange={handleChange}
                className={inputClassName}
                min="0"
              />
            </div>
          </div>

          {/* Work Mode and Location */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClassName}>Work Mode</label>
              <select
                name="workMode"
                value={formData.workMode}
                onChange={handleChange}
                className={selectClassName}
                required
              >
                <option value="">Select Work Mode</option>
                <option value="Remote">Remote</option>
                <option value="On-site">On-site</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
            <div>
              <label className={labelClassName}>Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={inputClassName}
                required
                placeholder="City, State"
              />
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="mb-4">
          <label className={labelClassName}>Tags (comma-separated)</label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className={inputClassName}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
      <style jsx>{`
        .custom-quill .ql-toolbar {
          background-color: rgb(39 39 42);
          border-color: rgb(63 63 70);
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
        }
        .custom-quill .ql-container {
          background-color: rgb(39 39 42);
          border-color: rgb(63 63 70);
          border-bottom-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
          color: white;
        }
        .custom-quill .ql-picker {
          color: white;
        }
        .custom-quill .ql-stroke {
          stroke: white;
        }
        .custom-quill .ql-fill {
          fill: white;
        }
      `}</style>
    </div>
  );
};

export default CreatePost;
