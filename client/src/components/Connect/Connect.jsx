import React from "react";
import { FaInfoCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import HeadTags from "../HeadTags/HeadTags";
import Title from "../Title/Title";
import Profile from "./Profile";

const Connect = () => {
  const AlumniDetails = [..."..."];
  return (
    <div className="mx-auto mb-20 flex max-w-7xl flex-col items-center justify-center">
      <HeadTags title={"Alumni Network - Nexus NIT Surat"} />
      <div className="mx-4 mt-10 flex w-fit items-center  gap-3 rounded-md bg-yellow-400/25 p-2 px-4">
        <FaInfoCircle size={42} className="h-auto text-yellow-500" />
        <p className="w-fit text-xs text-white/80 md:w-full md:text-base">
          Enhance your CSE alumni journey! Join our vibrant community.
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
      {AlumniDetails.length ? (
        <div className="my-10 flex flex-wrap items-center justify-center gap-10">
          {AlumniDetails.map((item, idx) => (
            <Profile key={idx} />
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
