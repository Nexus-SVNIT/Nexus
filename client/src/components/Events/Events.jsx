import React from "react";
import useFetch from "../../hooks/useFetch";
import Error from "../Error/Error";
import Title from "../Title/Title";
import "./events.css";
import { useQuery } from "@tanstack/react-query";
import HeadTags from "../HeadTags/HeadTags";

const Events = () => {
  const {
    isPending: loading,
    error,
    data,
  } = useQuery({
    queryKey: ["eventData"],
    queryFn: () => {
      const url = `${process.env.REACT_APP_BACKEND_BASE_URL}/event`;
      console.log("Fetching data from:", url); // Debug statement
      return fetch(url)
        .then((res) => {
          console.log("Response status:", res.status); // Log response status
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        });
    },
  });

  // Debug statements for error and loading state
  console.log("Loading:", loading);
  console.log("Error:", error);
  console.log("Data:", data);

  if (error) {
    console.error("Fetch error:", error); // Log the error details
    return <Error />;
  }

  return (
    <div className="mx-auto overflow-hidden bg-[#111] pb-20 md:pb-48">
      <HeadTags title={"Events - Nexus NIT Surat"} />
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
                              item.eventStatus === "Upcoming" ? "upcoming" : "active"
                            }`}
                          >
                            {item.eventStatus}
                          </span>
                        </div>
                        <h1>{item.eventName}</h1>
                        <p>{item.eventDescription}</p>
                        <img
                          src={
                            item?.eventPoster ??
                            "https://images.pexels.com/photos/1097930/pexels-photo-1097930.jpeg?auto=compress&cs=tinysrgb&w=800"
                          }
                          alt="Banner"
                          className="mt-4 min-h-[12rem] w-full rounded-md"
                        />
                      </div>
                    </li>
                  );
                })
            )}
          </ul>
        </div>
      </div>
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
