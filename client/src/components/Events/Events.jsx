import React, { useEffect, useState } from "react";
import Error from "../Error/Error";
import Title from "../Title/Title";
import "./events.css";
import HeadTags from "../HeadTags/HeadTags";
import increamentCounter from "../../libs/increamentCounter";
import MaintenancePage from "../Error/MaintenancePage";

const Events = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [showMore, setShowMore] = useState({});
  const [imageSlider, setImageSlider] = useState({ isOpen: false, images: [], currentIndex: 0, eventName: '' });

  useEffect(() => {
    const fetchData = async () => {
      const url = `${process.env.REACT_APP_BACKEND_BASE_URL}/event`;
      console.log("Fetching data from:", url); // Debug statement

      try {
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error("Fetch error:", err); // Log the error details
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    increamentCounter();
  }, []); // Empty dependency array to run once on mount

  const handleShowMore = (id) => {
    setShowMore((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const openImageSlider = (images, eventName) => {
    setImageSlider({
      isOpen: true,
      images: images,
      currentIndex: 0,
      eventName: eventName
    });
    document.body.style.overflow = 'hidden';
  };

  const closeImageSlider = () => {
    setImageSlider({ isOpen: false, images: [], currentIndex: 0, eventName: '' });
    document.body.style.overflow = 'unset';
  };

  const nextImage = () => {
    setImageSlider(prev => ({
      ...prev,
      currentIndex: (prev.currentIndex + 1) % prev.images.length
    }));
  };

  const prevImage = () => {
    setImageSlider(prev => ({
      ...prev,
      currentIndex: prev.currentIndex === 0 ? prev.images.length - 1 : prev.currentIndex - 1
    }));
  };

  const goToSlide = (index) => {
    setImageSlider(prev => ({
      ...prev,
      currentIndex: index
    }));
  };

  // Close slider on Escape key
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Escape' && imageSlider.isOpen) {
        closeImageSlider();
      } else if (imageSlider.isOpen) {
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [imageSlider.isOpen]);

  if (error) {
    return <MaintenancePage />;
  }

  return (
    <>
      <div className="mx-auto overflow-hidden bg-[#111] pb-20 md:pb-48">
        <HeadTags
          title="Events | Nexus - NIT Surat"
          description="Nexus Events page. Stay updated with the latest events happening at Nexus, NIT Surat."
          keywords="Nexus, NIT Surat, Events, Nexus Events, NIT Surat Events, SVNIT, CSE, AI, Web Wonder, Mentorship Program, Riddle Fuse, Sports Event, Fiesta, Teacher's Day Celebration, CodeSprint, Catpture The Flag"
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
                              `https://lh3.googleusercontent.com/d/${item?.eventPoster}` ??
                              "https://images.pexels.com/photos/1097930/pexels-photo-1097930.jpeg?auto=compress&cs=tinysrgb&w=800"
                            }
                            alt="Banner"
                            className="mt-4 min-h-[12rem] w-full rounded-md"
                          />
                          {item.eventImages && item.eventImages.length > 0 && (
                            <button
                              onClick={() => openImageSlider(item.eventImages, item.eventName)}
                              className="mt-4 text-blue-500 hover:text-blue-400 transition-colors duration-200"
                            >
                              Show More ({item.eventImages.length} photos)
                            </button>
                          )}
                          {showMore[item._id] && (
                            <div className="slideshow mt-4">
                              {item.eventImages.map((image, index) => (
                                <img
                                  key={index}
                                  src={image}
                                  alt={`Slide ${index}`}
                                  className="mt-2 min-h-[12rem] w-full rounded-md"
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </li>
                    );
                  })
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Fullscreen Image Slider Modal */}
      {imageSlider.isOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeImageSlider}
        >
          <div className="relative w-full h-full flex items-center justify-center p-4">
            {/* Close Button */}
            <button
              onClick={closeImageSlider}
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors duration-200 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Previous Button */}
            {imageSlider.images.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                className="absolute left-4 z-10 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors duration-200 focus:outline-none"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            {/* Next Button */}
            {imageSlider.images.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                className="absolute right-4 z-10 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors duration-200 focus:outline-none"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}

            {/* Current Image */}
            <img
              src={`https://lh3.googleusercontent.com/d/${imageSlider.images[imageSlider.currentIndex]}`}
              alt={`${imageSlider.eventName} - Image ${imageSlider.currentIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Image Counter & Event Name */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-6 py-3 rounded-lg text-center">
              <p className="text-sm font-medium mb-1">{imageSlider.eventName}</p>
              <p className="text-xs text-gray-300">
                {imageSlider.currentIndex + 1} of {imageSlider.images.length}
              </p>
            </div>

            {/* Thumbnail Navigation */}
            {imageSlider.images.length > 1 && (
              <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-2 max-w-full overflow-x-auto px-4">
                {imageSlider.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={(e) => { e.stopPropagation(); goToSlide(index); }}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      index === imageSlider.currentIndex 
                        ? 'border-blue-500 opacity-100' 
                        : 'border-gray-500 opacity-60 hover:opacity-80'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Instructions */}
            <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-2 rounded-lg text-sm">
              Use arrow keys or click buttons to navigate • Press ESC to close
            </div>
          </div>
        </div>
      )}
    </>
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
          <div
            alt="Banner"
            className="mt-4 min-h-[20rem] w-full animate-pulse rounded-md bg-slate-500"
          />
        </div>
      </li>
    ))}
  </>
);

export default Events;