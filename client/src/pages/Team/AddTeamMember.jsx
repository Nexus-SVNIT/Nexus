import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const AddTeamMember = () => {
  const getCurrentFinancialYear = () => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    return currentMonth >= 3
      ? `${currentYear}-${currentYear + 1}`
      : `${currentYear - 1}-${currentYear}`;
  };

  const [formData, setFormData] = useState({
    admissionNumber: "",
    role: "",
    year: getCurrentFinancialYear(),
  });
  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      toast.error("Please upload an image.");
      return;
    }

    toast.loading("Adding team member...");
    try {
      const data = new FormData();
      data.append("admissionNumber", formData.admissionNumber);
      data.append("role", formData.role);
      data.append("year", formData.year);
      data.append("image", image);

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/team/add`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (response.status === 200 || response.status === 201) {
        toast.dismiss();
        toast.success("Team member added successfully");
        setFormData({
          admissionNumber: "",
          role: "",
          year: getCurrentFinancialYear(),
        });
        setImage(null);
      } else {
        toast.dismiss();
        toast.error("Error adding team member");
      }
    } catch (error) {
      toast.dismiss();
      toast.error(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="bg-gray-900 flex min-h-screen items-center justify-center text-white">
      <Toaster />
      <div className="bg-gray-800 w-full max-w-lg rounded-lg p-8 shadow-lg">
        <h2 className="mb-6 text-center text-2xl font-bold">Add Team Member</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="admissionNumber"
              className="mb-2 block text-sm font-medium"
            >
              Admission Number
            </label>
            <input
              type="text"
              id="admissionNumber"
              name="admissionNumber"
              value={formData.admissionNumber}
              onChange={handleChange}
              className="bg-gray-700 border-gray-600 w-full rounded border px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label htmlFor="role" className="mb-2 block text-sm font-medium">
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="bg-gray-700 border-gray-600 w-full rounded border px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="" disabled>
                Select role
              </option>
              <option value="Chair Person">Chair Person</option>
              <option value="Vice Chair Person">Vice Chair Person</option>
              <option value="Event Manager">Event Manager</option>
              <option value="Developer">Developer</option>
              <option value="Treasurer">Treasurer</option>
              <option value="Media Head">Media Head</option>
              <option value="Design Head">Design Head</option>
              <option value="Alma Relation Head">Alma Relation Head</option>
              <option value="AI/ML Head">AI/ML Head</option>
              <option value="Think Tank Head">Think Tank Head</option>
              <option value="Documentation Head">Documentation Head</option>
              <option value="Coordinator">Coordinator</option>
            </select>
          </div>
          <div>
            <label htmlFor="year" className="mb-2 block text-sm font-medium">
              Year
            </label>
            <input
              type="text"
              id="year"
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="bg-gray-700 border-gray-600 w-full rounded border px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label htmlFor="image" className="mb-2 block text-sm font-medium">
              Upload Image
            </label>
            <input
              type="file"
              id="image"
              onChange={handleImageChange}
              className="bg-gray-700 text-gray-400 w-full"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full rounded bg-indigo-600 px-4 py-2 font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Add Team Member
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTeamMember;
