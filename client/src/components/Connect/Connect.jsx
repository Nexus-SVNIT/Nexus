import React, { useEffect } from "react";
import { FaInfoCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import HeadTags from "../HeadTags/HeadTags";
import Title from "../Title/Title";
import Profile from "./Profile";
import Loader from "../Loader/Loader";
import Error from "../Error/Error";
import { useQuery } from "@tanstack/react-query";
import increamentCounter from "../../libs/increamentCounter";
import MaintenancePage from '../Error/MaintenancePage';

const Connect = () => {
  const {
    isLoading,
    isError,
    data: AlumniDetails,
  } = useQuery({
    queryKey: ["alumniDetails"],
    queryFn: async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/alumni/`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch Alumni Details");
        }
        return response.json();
      } catch (error) {
        throw new Error("Failed to fetch Alumni Details");
      }
    },
  });

  useEffect(()=>{
    increamentCounter();
  },[])

  if (isLoading) {
    return (
      <div className="flex h-[70vh] w-full items-center justify-center">
        <HeadTags title={"Loading Alumni Details - Nexus NIT Surat"} />
        <Loader />
      </div>
    );
  }

  if (isError) {
    return <MaintenancePage />;
  }
  return (
    <div className="mx-auto mb-20 flex max-w-7xl flex-col items-center justify-center">
      <HeadTags title={"Alumni Network - Nexus NIT Surat"} />
      <div className="mx-4 mt-10 flex w-fit items-center  gap-3 rounded-md bg-yellow-400/25 p-2 px-4">
        <FaInfoCircle size={42} className="h-auto text-yellow-500" />
        <p className="w-fit text-xs text-white/80 md:w-full md:text-base">
          Enhance your CSE & AI alumni journey! Join our vibrant community.
          <Link
            to="/connect/alumni"
            className="mx-1 font-bold text-blue-500  underline underline-offset-4"
          >
            {" "}
            Click here
          </Link>{" "}
          to join our vibrant community and leave your mark in the legacy! .
        </p>
      </div>
      <Title>Alumni Network</Title>{" "}
      {AlumniDetails?.length ? (
        <div className="my-10 flex flex-wrap items-center justify-center gap-10">
          {AlumniDetails?.map((item) => (
            <Profile key={item._id} profile={item}
            />
          ))}
        </div>
      ) : (
        <p className="flex min-h-[50vh] w-full items-center justify-center">
          No Alumni Details Available Currently.
        </p>
      )}
    </div>
  );
};

export default Connect;
