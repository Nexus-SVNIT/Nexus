import React, { useState } from 'react';
const token = localStorage.getItem("core-token");
const EventForm = () => {
  const [formData, setFormData] = useState({
    eventName: '',
    eventType: '',
    
    eventDate: '',
    eventDescription: '',
    eventPoster: '',
    eventStatus: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/event/create`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert('Event created successfully!');
      } else {
        alert('Failed to create event.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error creating event.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg p-8 bg-white shadow-lg rounded-lg"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Create Event
        </h2>

        <div className="mb-4">
          <label
            htmlFor="eventName"
            className="block text-gray-700 font-medium mb-2"
          >
            Event Name
          </label>
          <input
            type="text"
            name="eventName"
            id="eventName"
            value={formData.eventName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="eventType"
            className="block text-gray-700 font-medium mb-2"
          >
            Event Type
          </label>
          <input
            type="text"
            name="eventType"
            id="eventType"
            value={formData.eventType}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        

        <div className="mb-4">
          <label
            htmlFor="eventDate"
            className="block text-gray-700 font-medium mb-2"
          >
            Event Date
          </label>
          <input
            type="date"
            name="eventDate"
            id="eventDate"
            value={formData.eventDate}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="eventDescription"
            className="block text-gray-700 font-medium mb-2"
          >
            Event Description
          </label>
          <textarea
            name="eventDescription"
            id="eventDescription"
            value={formData.eventDescription}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="eventPoster"
            className="block text-gray-700 font-medium mb-2"
          >
            Event Poster URL
          </label>
          <input
            type="text"
            name="eventPoster"
            id="eventPoster"
            value={formData.eventPoster}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="eventStatus"
            className="block text-gray-700 font-medium mb-2"
          >
            Event Status
          </label>
          <input
            type="text"
            name="eventStatus"
            id="eventStatus"
            value={formData.eventStatus}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
        >
          Create Event
        </button>
      </form>
    </div>
  );
};

export default EventForm;
