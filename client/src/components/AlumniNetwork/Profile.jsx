import React, { useState } from "react";
import Modal from "@mui/joy/Modal";
import ProfileDetail from "./ProfileDetail";

const Profile = ({ profile }) => {
  const [open, setOpen] = useState(false);

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

      <div 
        className="group w-full relative flex cursor-pointer flex-col items-center overflow-hidden rounded-2xl border border-zinc-800/60 bg-[#09090b]/80 p-6 shadow-xl backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-cyan-500/30 hover:bg-zinc-900 hover:shadow-[0_8px_30px_rgba(34,211,238,0.12)]"
        onClick={() => setOpen(true)}
      >
        {/* Top Accent Line */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        
        {/* Background glow on hover */}
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />

        <div className="relative mb-6 mt-4 pointer-events-none">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-40"></div>
          <img
            src={profile.ImageLink}
            alt="profile"
            className="relative h-32 w-32 rounded-full object-cover shadow-lg ring-1 ring-zinc-700/50 transition-all duration-500 group-hover:ring-cyan-500/50"
          />
        </div>
        
        <div className="flex flex-col items-center text-center space-y-1 z-10 w-full px-2 pointer-events-none">
          <h3 className="text-lg font-bold tracking-tight text-zinc-100 transition-colors duration-300 group-hover:text-cyan-300 truncate w-full">
            {profile['Name']}
          </h3>
          <p className="text-sm font-medium text-cyan-500/80 truncate w-full">
            {profile['Current Role']}
          </p>
        </div>

        {/* View Details Button overlay */}
        <div className="mt-6 w-full opacity-0 transform translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
          <button
            onClick={(e) => { e.stopPropagation(); setOpen(true); }}
            className="w-full rounded-xl bg-zinc-800/80 hover:bg-zinc-700 py-2.5 text-sm font-semibold text-white transition-colors border border-zinc-700 hover:border-zinc-600 shadow-sm"
          >
            View Profile
          </button>
        </div>
      </div>
    </>
  );
};

export default Profile;
