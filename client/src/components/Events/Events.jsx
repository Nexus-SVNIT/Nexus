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
      console.log("Fetching data from:", url);

      try {
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
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
                        <div className="date">
                          <p>{item.eventDate}</p>
                          <span
                            className={`btn text-xs ${
                              item.eventStatus === "Upcoming"
                                ? "upcoming"
                                : "active"
                            }`}
                          >
                            {item.eventStatus}
                          </span>
                        </div>
                        <h1>{item.eventName}</h1>
                        <p>{item.eventDescription}</p>
                        <img
                          src={
                            item?.eventPoster
                              ? `https://lh3.googleusercontent.com/d/${item.eventPoster}`
                              : "https://images.pexels.com/photos/1097930/pexels-photo-1097930.jpeg?auto=compress&cs=tinysrgb&w=800"
                          }
                          alt="Banner"
                          className="mt-4 min-h-[12rem] w-full rounded-md"
                        />
                        {item.eventImages.length > 0 && (
                          <button
                            onClick={() => openModal(item.eventImages, 0)}
                            className="mt-4 text-blue-500"
                          >
                            Show More
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
