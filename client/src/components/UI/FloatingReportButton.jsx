"use client"

import { useState } from "react"

const categories = [
  "Website or Tech issue/bug",
  "Nexus's operation related issue",
  "Event related issue",
  "Finance related issue",
  "Nexus's Social Media related issue",
  "Other",
  "Feedback"
]

export default function FloatingReportButton() {
  const [open, setOpen] = useState(false)
  const [category, setCategory] = useState(categories[0])
  const [description, setDescription] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      setImagePreview(URL.createObjectURL(file))
    } else {
      setImage(null)
      setImagePreview(null)
    }
  }

  const handleRemoveImage = () => {
    setImage(null)
    setImagePreview(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")
    setSuccess(false)
    try {
      const formData = new FormData();
      formData.append('category', category);
      formData.append('description', description);
      if (image) {
        formData.append('image', image);
      }
      const response = await fetch('/api/report', {
        method: 'POST',
        body: formData
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to submit report.');
      }
      setSuccess(true)
      setDescription("")
      setCategory(categories[0])
      setImage(null)
      setImagePreview(null)
    } catch (err) {
      setError(err.message || "Failed to submit report.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-8 z-[10000] bg-blue-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg text-2xl border-none cursor-pointer hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        style={{ right: "2rem", left: "auto" }}
        aria-label="Report Issue"
      >
        {/* Inline SVG for Flag icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-6 h-6"
        >
          <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
          <line x1="4" x2="4" y1="22" y2="15" />
        </svg>
      </button>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-[10000] flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative bg-white rounded-xl min-w-[320px] max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="report-issue-title"
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute bg-transparent border-none text-gray-500 hover:text-gray-700 text-2xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-full p-1"
              style={{ top: 0, right: 0, left: 'auto', margin: '1rem' }}
              aria-label="Close"
            >
              {/* Inline SVG for X icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
            <div className="p-8">
              <h2 id="report-issue-title" className="mb-6 text-2xl font-semibold text-gray-800">
                Report an Issue
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="category" className="block mb-1 text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                    required
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-6">
                  <label htmlFor="description" className="block mb-1 text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full min-h-[120px] p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 focus:outline-none resize-y"
                    required
                    maxLength={500}
                    placeholder="Describe the issue or feedback..."
                    aria-describedby="description-help"
                  />
                  <p id="description-help" className="text-xs text-gray-500 mt-1">
                    Max 500 characters.
                  </p>
                </div>
                {/* Image Upload Field */}
                <div className="mb-6">
                  <label htmlFor="image" className="block mb-1 text-sm font-medium text-gray-700">
                    Upload Image (optional)
                  </label>
                  <input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {imagePreview && (
                    <div className="mt-2 flex flex-col items-start gap-2">
                      <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="max-h-32 rounded border" />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="text-xs text-red-600 hover:underline focus:outline-none"
                      >
                        Remove Image
                      </button>
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-blue-600 text-white py-2 px-6 border-none rounded-md cursor-pointer font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {submitting ? "Submitting..." : "Submit Report"}
                </button>
                {success && (
                  <div className="mt-4 text-center text-green-600 text-sm" role="status">
                    Report submitted. Thank you!
                  </div>
                )}
                {error && (
                  <div className="mt-4 text-center text-red-600 text-sm" role="alert">
                    {error}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}