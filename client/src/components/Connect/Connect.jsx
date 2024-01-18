import React from "react";
import Title from "../Title/Title";
import Profile from "./Profile";
import Modal from "./Modal";
import { FaInfoCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
const Connect = () => {
  return (
    <div className="mx-auto mb-20 flex max-w-7xl flex-col items-center justify-center ">
      <div className="mt-10 flex flex-wrap items-center  gap-3 rounded-md bg-yellow-500/25 p-2 px-4">
        <FaInfoCircle size={42} />
        <p className="w-[95%] text-white/75">
          Enhance your CSE alumni journey! Join our vibrant community by adding
          your name to our directory. Click here to join our vibrant community
          and leave your mark in the legacy!{" "}
          <Link to="/" className="m-x-4 font-bold  text-white underline">
            {" "}
            Click here
          </Link>
          .
        </p>
      </div>
      <Title>Alumni Network</Title>{" "}
      <div className="my-10 grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {[..."........"].map((item, idx) => (
          <Profile key={idx} />
        ))}
      </div>
    </div>
  );
};

export default Connect;
