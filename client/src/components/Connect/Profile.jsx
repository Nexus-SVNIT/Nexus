import React, { useState } from "react";
import Modal from "./Modal";
import { GrFormView } from "react-icons/gr";

const Profile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = () => {
    setIsOpen((state) => !state);
  };
  return (
    <Modal isOpen={isOpen} toggleOpen={toggleOpen}>
      <div className=" group relative flex w-72 cursor-pointer flex-col items-center justify-center rounded-lg bg-blue-50/10 p-6 py-8 transition-all duration-300 hover:scale-105">
        <span
          className="absolute left-0 top-0 w-fit rounded-b-2xl rounded-r-2xl bg-blue-600 opacity-0 transition-all duration-300 group-hover:opacity-100"
          title="View Profile"
          onClick={(e) => setIsOpen(true)}
        >
          <GrFormView size={48} />
        </span>
        <img
          src={"https://xsgames.co/randomusers/avatar.php?g=male"}
          alt="profile"
          className="h-52 w-52 rounded-full object-cover object-center"
        />
        <div className="mt-4 flex h-full w-full flex-col items-center justify-center gap-2">
          <p className="text-lg text-blue-400"> Sneh Chaudary</p>
          <p className="line-clamp-1 text-blue-200">
            Software Engineer @Google
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default Profile;
