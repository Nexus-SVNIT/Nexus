import React from "react";
import Title from "../Title/Title";
import Profile from "./Profile";
import Modal from "./Modal";
const Connect = () => {
  return (
    <div className="mx-auto mb-20 flex max-w-7xl flex-col items-center justify-center ">
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
