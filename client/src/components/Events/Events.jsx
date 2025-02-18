import React, { useEffect, useState } from "react";
import Error from "../Error/Error";
import Title from "../Title/Title";
import "./events.css";
import HeadTags from "../HeadTags/HeadTags";
import increamentCounter from "../../libs/increamentCounter";
import MaintenancePage from '../Error/MaintenancePage';

const Events = () => {
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);
  // const [data, setData] = useState([]);
  // const [showMore, setShowMore] = useState({});

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const url = `${process.env.REACT_APP_BACKEND_BASE_URL}/event`;
  //     console.log("Fetching data from:", url); // Debug statement

  //     try {
  //       const response = await fetch(url);
        
  //       if (!response.ok) {
  //         throw new Error(`HTTP error! status: ${response.status}`);
  //       }
        
  //       const result = await response.json();
  //       setData(result);
  //     } catch (err) {
  //       console.error("Fetch error:", err); // Log the error details
  //       setError(err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  //   increamentCounter();
  // }, []); // Empty dependency array to run once on mount

  // const handleShowMore = (id) => {
  //   setShowMore((prev) => ({ ...prev, [id]: !prev[id] }));
  // };

  // if (error) {
  //   return <MaintenancePage />;
  // }

  // return (
  //   <div className="mx-auto overflow-hidden bg-[#111] pb-20 md:pb-48">
  //     <HeadTags title={"Events - Nexus NIT Surat"} />
  //     <Title>Events</Title>
  //     <div className="container">
  //       <div className="timeline">
  //         <ul className="py-10 transition-all ">
  //           {loading ? (
  //             <LoadingPlaceholders />
  //           ) : (
  //             data
  //               .sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate))
  //               .map((item) => {
  //                 if (!item?.eventStatus?.trim()) return null;
  //                 return (
  //                   <li key={item._id}>
  //                     <div className="timeline-content">
  //                       <div className="date">
  //                         <p>{item.eventDate}</p>
  //                         <span
  //                           className={`btn text-xs ${
  //                             item.eventStatus === "Upcoming" ? "upcoming" : "active"
  //                           }`}
  //                         >
  //                           {item.eventStatus}
  //                         </span>
  //                       </div>
  //                       <h1>{item.eventName}</h1>
  //                       <p>{item.eventDescription}</p>
  //                       <img
  //                         src={
  //                           item?.eventPoster ?? item?.eventImages[0] ?? 
  //                           "https://images.pexels.com/photos/1097930/pexels-photo-1097930.jpeg?auto=compress&cs=tinysrgb&w=800"
  //                         }
  //                         alt="Banner"
  //                         className="mt-4 min-h-[12rem] w-full rounded-md"
  //                       />
  //                       {item.eventImages.length > 1 && (
  //                         <button
  //                           onClick={() => handleShowMore(item._id)}
  //                           className="mt-4 text-blue-500"
  //                         >
  //                           {showMore[item._id] ? "Show Less" : "Show More"}
  //                         </button>
  //                       )}
  //                       {showMore[item._id] && (
  //                         <div className="slideshow mt-4">
  //                           {item.eventImages.map((image, index) => (
  //                             <img
  //                               key={index}
  //                               src={image}
  //                               alt={`Slide ${index}`}
  //                               className="mt-2 min-h-[12rem] w-full rounded-md"
  //                             />
  //                           ))}
  //                         </div>
  //                       )}
  //                     </div>
  //                   </li>
  //                 );
  //               })
  //           )}
  //         </ul>
  //       </div>
  //     </div>
  //   </div>
  // );
  return <MaintenancePage />;
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