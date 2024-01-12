import React from "react";
import useFetch from "../../hooks/useFetch";
import Error from "../Error/Error";
import Title from "../Title/Title";
import "./events.css";
import { useQuery } from "@tanstack/react-query";

const Events = () => {
  const {
    isPending: loading,
    error,
    data,
  } = useQuery({
    queryKey: ["eventData"],
    queryFn: () =>
      fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/event`).then((res) =>
        res.json(),
      ),
  });

  if (error) return <Error />;
  return (
    <div className="mx-auto overflow-hidden bg-[#111] pb-20 md:pb-48">
      <Title>Events</Title>
      <div className="container">
        <div class="timeline">
          <ul className="py-10 transition-all ">
            {loading ? (
              <>
                <li>
                  <div className="timeline-content  ">
                    <div className="date">
                      <p className="h-6 w-44 animate-pulse rounded-sm bg-slate-500" />
                      <span
                        className={`btn h-6 w-20 animate-pulse bg-slate-500 text-xs`}
                      />
                    </div>

                    <span className="h-6 w-44 animate-pulse rounded-md bg-slate-500" />
                    <p className="h-40 w-full animate-pulse rounded-md bg-slate-500" />
                    <div
                      alt="Banner"
                      className="mt-4 min-h-[20rem] w-full animate-pulse  rounded-md bg-slate-500 "
                    />
                  </div>
                </li>
                <li>
                  <div className="timeline-content  ">
                    <div className="date">
                      <p className="h-6 w-44 animate-pulse rounded-sm bg-slate-500" />
                      <span
                        className={`btn h-6 w-20 animate-pulse bg-slate-500 text-xs`}
                      />
                    </div>

                    <span className="h-6 w-44 animate-pulse rounded-md bg-slate-500" />
                    <p className="h-40 w-full animate-pulse rounded-md bg-slate-500" />
                    <div
                      alt="Banner"
                      className="mt-4 min-h-[20rem] w-full animate-pulse  rounded-md bg-slate-500 "
                    />
                  </div>
                </li>
                <li>
                  <div className="timeline-content  ">
                    <div className="date">
                      <p className="h-6 w-44 animate-pulse rounded-sm bg-slate-500" />
                      <span
                        className={`btn h-6 w-20 animate-pulse bg-slate-500 text-xs`}
                      />
                    </div>

                    <span className="h-6 w-44 animate-pulse rounded-md bg-slate-500" />
                    <p className="h-40 w-full animate-pulse rounded-md bg-slate-500" />
                    <div
                      alt="Banner"
                      className="mt-4 min-h-[20rem] w-full animate-pulse  rounded-md bg-slate-500 "
                    />
                  </div>
                </li>
                <li>
                  <div className="timeline-content  ">
                    <div className="date">
                      <p className="h-6 w-44 animate-pulse rounded-sm bg-slate-500" />
                      <span
                        className={`btn h-6 w-20 animate-pulse bg-slate-500 text-xs`}
                      />
                    </div>

                    <span className="h-6 w-44 animate-pulse rounded-md bg-slate-500" />
                    <p className="h-40 w-full animate-pulse rounded-md bg-slate-500" />
                    <div
                      alt="Banner"
                      className="mt-4 min-h-[20rem] w-full animate-pulse  rounded-md bg-slate-500 "
                    />
                  </div>
                </li>
              </>
            ) : (
              data.map((item) => {
                if (!item?.status?.trim()) return null;
                return (
                  <li key={item._id}>
                    <div className="timeline-content  ">
                      <div className="date">
                        <p>{item.date}</p>
                        <span
                          className={`btn text-xs ${
                            item.status === "Upcoming" ? "upcoming" : "active"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                      <h1>{item.name}</h1>
                      <p>{item.description}</p>
                      <img
                        src={
                          item?.imageLink ??
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

export default Events;
