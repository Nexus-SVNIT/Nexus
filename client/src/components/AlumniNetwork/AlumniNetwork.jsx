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
import MaintenancePage from "../Error/MaintenancePage";
import { getAllAlumni } from "../../services/alumniService";

const AlumniNetwork = () => {
  const {
    isLoading,
    isError,
    data: AlumniDetails,
  } = useQuery({
    queryKey: ["alumniDetails"],
    queryFn: async () => {
      try {
        const response = await getAllAlumni();
        if (!response.success) {
          throw new Error(`Failed to fetch Alumni Details ${response.message}`);
        }
        return response.data;
      } catch (error) {
        throw new Error("Failed to fetch Alumni Details");
      }
    },
  });

  useEffect(() => {
    increamentCounter();
  }, []);

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
      <HeadTags
        title={"Alumni Network | Nexus - NIT Surat"}
        description={
          "Enhance your CSE & AI alumni journey! Join our vibrant community. Click here to join our vibrant community and leave your mark in the legacy!"
        }
        keywords={
          "Nexus NIT Surat, Alumni, Alumni Network, CSE, AI, Community, vibrant, legacy, join, mark, journey"
        }
      />
      
      {/* Modern Hero Header */}
      <div className="mt-16 sm:mt-24 mb-12 flex flex-col items-center text-center w-full max-w-4xl px-4">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-sans font-bold tracking-tight text-white mb-6">
          <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">Global</span> Alumni Network
        </h1>
        <p className="text-zinc-400 text-base sm:text-lg lg:text-xl leading-relaxed mb-10 max-w-3xl">
          Discover and connect with our talented alumni working at top companies worldwide. Build meaningful professional relationships and grow your network.
        </p>
        
        {/* Sleek Info Banner */}
        <div className="flex w-full sm:w-fit items-center flex-col sm:flex-row gap-4 sm:gap-6 rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-cyan-950/30 to-blue-900/20 backdrop-blur-md p-5 shadow-[0_4px_20px_rgba(34,211,238,0.05)] mx-auto">
          <div className="rounded-full bg-cyan-500/10 p-3">
            <FaInfoCircle size={28} className="text-cyan-400" />
          </div>
          <p className="text-sm sm:text-base text-zinc-300 text-center sm:text-left leading-relaxed">
            Enhance your journey! {" "}
            <Link
              to="/alumni-network/alumni"
              className="font-bold text-cyan-400 transition-colors hover:text-cyan-300 underline decoration-cyan-500/30 underline-offset-4"
            >
              Click here to join
            </Link>{" "}
            and leave your mark in the legacy.
          </p>
        </div>
      </div>

      {AlumniDetails?.length ? (
        <div className="w-full px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 xl:gap-8 mb-10">
          {/* Strict Grid Layout */}
          {AlumniDetails?.map((item) => (
            <Profile key={item._id} profile={item} />
          ))}
        </div>
      ) : (
        <p className="flex min-h-[50vh] w-full items-center justify-center text-zinc-400 font-medium">
          No Alumni Details Available Currently.
        </p>
      )}
    </div>
  );
};

export default AlumniNetwork;
