import React, { useEffect, useState } from "react";
import Error from "../Error/Error";
import Title from "../Title/Title";
import "./events.css";
import HeadTags from "../HeadTags/HeadTags";
import increamentCounter from "../../libs/increamentCounter";
import MaintenancePage from "../Error/MaintenancePage";
import Modal from "./Modal";

const Events = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeImages, setActiveImages] = useState([]);
  const [initialImageIndex, setInitialImageIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const url = `${process.env.REACT_APP_BACKEND_BASE_URL}/event`;
     

      try {
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setData(result.data || []);
        
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    increamentCounter();
  }, []);

  const openModal = (images) => {
    setActiveImages(images);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setActiveImages([]);
  };

  if (error) {
    return <MaintenancePage />;
  }

  return (
    <div className="mx-auto overflow-hidden bg-[#111] pb-20 md:pb-48">
      <HeadTags
        title="Events | Nexus - NIT Surat"
        description="Nexus Events page. Stay updated with the latest events happening at Nexus, NIT Surat."
        keywords="Nexus, NIT Surat, Events, Nexus Events, NIT Surat Events, SVNIT, CSE, AI, Web Wonder, Mentorship Program, Riddle Fuse, Sports Event, Fiesta, Teacher's Day Celebration, CodeSprint, Capture The Flag"
      />
      <Title>Events</Title>
      <div className="container">
        <div className="timeline">
          <ul className="py-10 transition-all ">
            {loading ? (
              <LoadingPlaceholders />
            ) : (
              data
                .sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate))
                .map((item) => {
                  if (!item?.eventStatus?.trim()) return null;
                  return (
                    <li key={item._id}>
                      <div className="timeline-content">
                        <div className="date-status-container">
                          <div className="date">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>{item.eventDate}</span>
                          </div>
                          <div
                            className={`status-badge ${
                              item.eventStatus === "Upcoming"
                                ? "status-upcoming"
                                : "status-active"
                            }`}
                          >
                            {item.eventStatus}
                          </div>
                        </div>
                        <h1 className="text-2xl font-bold mt-4">{item.eventName}</h1>
                        
                        <div className="flex items-center gap-4 mt-2 mb-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full">
                              {item.eventType}
                            </span>
                          </div>
                          {item.participants && (
                            <div className="flex items-center gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                              <span className="text-sm text-gray-400">{item.participants} Participants</span>
                            </div>
                          )}
                        </div>
                        
                        <p>{item.eventDescription}</p>
                        <img
                          src={
                            item?.eventPoster
                              ? `https://lh3.googleusercontent.com/d/${item.eventPoster}`
                              : "https://images.pexels.com/photos/1097930/pexels-photo-1097930.jpeg?auto=compress&cs=tinysrgb&w=800"
                          }
                          alt="Banner"
                          className="mt-4 min-h-[12rem] w-full rounded-md object-cover"
                        />
                        {item.eventImages.length > 0 && (
                          <button
                            onClick={() => openModal(item.eventImages, 0)}
                            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center gap-2 transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            View Gallery ({item.eventImages.length} images)
                          </button>
                        )}
                      </div>
                    </li>
                  );
                })
            )}
          </ul>
        </div>
      </div>

      {modalOpen && (
        <Modal
          images={activeImages}
          initialIndex={initialImageIndex}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

// Loading placeholders component
const LoadingPlaceholders = () => (
  <>
    {Array.from({ length: 4 }).map((_, index) => (
      <li key={index}>
        <div className="timeline-content">
          <div className="date">
            <p className="h-6 w-44 animate-pulse rounded-sm bg-slate-500" />
            <span className="btn h-6 w-20 animate-pulse bg-slate-500 text-xs" />
          </div>
          <span className="h-6 w-44 animate-pulse rounded-md bg-slate-500" />
          <p className="h-40 w-full animate-pulse rounded-md bg-slate-500" />
          <div className="mt-4 min-h-[20rem] w-full animate-pulse rounded-md bg-slate-500" />
        </div>
      </li>
    ))}
  </>
);

export default Events;
