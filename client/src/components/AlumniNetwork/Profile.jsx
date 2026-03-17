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

      <div className="group relative flex w-72 cursor-pointer flex-col items-center justify-center rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-6 py-8 shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:border-blue-500/40 hover:bg-zinc-800/40 hover:shadow-2xl hover:shadow-blue-900/20">
        <span
          className="absolute left-0 top-0 flex items-center justify-center w-fit rounded-br-2xl rounded-tl-2xl bg-gradient-to-br from-blue-600 to-indigo-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100 shadow-lg text-white p-1"
          title="View Profile"
          onClick={(e) => setOpen(true)}
        >
          <GrFormView size={36} />
        </span>
        <div className="relative mb-4">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 opacity-20 blur group-hover:opacity-60 transition duration-300"></div>
          <img
            src={profile.ImageLink}
            alt="profile"
            className="relative h-44 w-44 rounded-full object-cover object-center ring-2 ring-zinc-800/50 group-hover:ring-blue-500/50 transition-all duration-300"
          />
        </div>
        <div className="mt-2 flex flex-col items-center justify-center gap-1.5 text-center">
          <p className="text-xl font-bold tracking-wide text-zinc-100 group-hover:text-white transition-colors">
            {profile['Name']}
          </p>
          <p className="line-clamp-2 text-sm font-medium text-blue-400/90 leading-snug">
            {profile['Current Role']}
          </p>
        </div>
      </div>
    </>
  );
};

export default Profile;
