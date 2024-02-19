import React, { useState } from "react";
import { GrFormView } from "react-icons/gr";

import Button from "@mui/joy/Button";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import Typography from "@mui/joy/Typography";
import Sheet from "@mui/joy/Sheet";
import ProfileDetail from "./ProfileDetail";

const Profile = ({ profile }) => {
  const [open, setOpen] = useState(false);
  const toggleOpen = () => {
    setOpen((state) => !state);
  };
  return (
    <>

      <Modal
        aria-describedby="modal-desc"
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ProfileDetail profile={profile} />
      </Modal>

      <div className="group relative flex w-72 cursor-pointer flex-col items-center justify-center rounded-lg bg-blue-50/10 p-6 py-8 transition-all duration-300 hover:scale-105">
        <span
          className="absolute left-0 top-0 w-fit rounded-b-2xl rounded-r-2xl bg-blue-600 opacity-0 transition-all duration-300 group-hover:opacity-100"
          title="View Profile"
          onClick={(e) => setOpen(true)}
        >
          <GrFormView size={48} />
        </span>
        <img
          src={
            profile.ImageLink

          }
          alt="profile"
          className="h-48 w-48 rounded-full object-cover object-center"
        />
        <div className="mt-4 flex h-full w-full flex-col items-center justify-center gap-2">
          <p className="text-lg text-blue-400"> {profile['Name']}</p>
          <p className="line-clamp-1 text-blue-200">
            {profile['Current Role']}
          </p>
        </div>
      </div>
    </>
  );
};

export default Profile;
