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
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditorChange = (value) => {
    setFormData({ ...formData, content: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const tagsArray = formData.tags.split(",").map((tag) => tag.trim());
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/posts`,
        { ...formData, tags: tagsArray },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Post created successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create the post.");
    }
  };

  return (
    <div className="min-h-screen p-6 mx-auto max-w-4xl">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Create Post</h2>
      <form className=" shadow-lg rounded-lg p-6" onSubmit={handleSubmit}>
        {/* Title */}
        <div className="mb-4">
          <label className="block text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            
            value={formData.title}
            onChange={handleChange}
            className="w-full mt-2 p-2 border rounded-lg text-black"
            required
          />
        </div>

        {/* Content with React Quill */}
        <div className="mb-4">
          <label className="block text-gray-700">Content</label>
          <ReactQuill
            value={formData.content}
            onChange={handleEditorChange}
            theme="snow"
            placeholder="Write your interview experience here..."
            className="mt-2 bg-white border rounded-lg custom-quill text-black-2"
          />
        </div>

        {/* Company */}
        <div className="mb-4">
          <label className="block text-gray-700">Company</label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="w-full mt-2 p-2 border rounded-lg text-black-2"
            required
          />
        </div>

        {/* Tags */}
        <div className="mb-4">
          <label className="block text-gray-700">Tags (comma-separated)</label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="w-full mt-2 p-2 border rounded-lg text-black-2"
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
    </div>
  );
};

export default CreatePost;
