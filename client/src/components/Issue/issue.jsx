import React, { useState } from "react";
import axios from "axios";

const IssueModal = ({ isOpen, onClose }) => {
  const [issueType, setIssueType] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const token = localStorage.getItem("token"); // Retrieve token from local storage

    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/issue/create`,
        { issueType, description },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Attach token in headers
          },
        }
      );
      onClose(); // Close the modal on successful submission
    } catch (err) {
      setError("Failed to submit the issue. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative z-60">
        <h2 className="text-2xl font-bold mb-4 text-black">Create New Issue</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-black font-semibold mb-2" htmlFor="issueType">
              Issue Type
            </label>
            <select
              id="issueType"
              value={issueType}
              onChange={(e) => setIssueType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              required
            >
              <option value="">Select Issue Type</option>
              <option value="Website Issue">Website Issue</option>
              <option value="AI/ML Issue">AI/ML Issue</option>
              <option value="Finance Issue">Finance Issue</option>
              <option value="Design Issue">Design Issue</option>
              <option value="Media Issue">Media Issue</option>
              <option value="Alumni Issue">Alumni Issue</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-black font-semibold mb-2" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              rows="4"
              required
            ></textarea>
          </div>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-black rounded-lg mr-2 hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IssueModal;
