import React, { useState } from "react";
import Modal from "./Modal";

const Profile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = () => {
    setIsOpen((state) => !state);
  };
  return (
    <Modal isOpen={isOpen} toggleOpen={toggleOpen}>
      <div className="group relative flex h-80 w-72 cursor-text flex-col items-center justify-center overflow-hidden rounded-lg">
        <img
          src={"https://xsgames.co/randomusers/avatar.php?g=male"}
          alt="profile"
          className="h-full w-full object-cover object-center"
        />
        <p
          className="absolute -right-[50%] top-1/2 z-10  cursor-pointer  rounded-sm bg-blue-500 p-2.5 transition-all active:bg-blue-600 group-hover:right-[25%]"
          onClick={toggleOpen}
        >
          View Profile
        </p>

        <div className="absolute h-full w-full bg-gradient-to-b from-transparent via-black/25 to-black">
          <div className="absolute bottom-2 left-4">
            <p className="text-lg text-blue-300"> Sneh Chaudary</p>
            <p className="line-clamp-1 text-blue-300">
              Software Engineer @Google
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default Profile;
