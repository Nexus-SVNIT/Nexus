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
      <div className="mx-4 mt-12 flex w-fit items-center gap-4 rounded-xl border border-blue-500/20 bg-blue-900/20 backdrop-blur-md p-4 px-6 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
        <FaInfoCircle size={36} className="h-auto text-blue-400 flex-shrink-0" />
        <p className="w-fit text-sm text-blue-100/80 md:w-full md:text-base leading-relaxed tracking-wide">
          Enhance your CSE & AI alumni journey! Join our vibrant community.
          <Link
            to="/alumni-network/alumni"
            className="mx-1 font-bold text-blue-400 transition-colors hover:text-blue-300 underline decoration-blue-500/50 underline-offset-4"
          >
            {" "}
            Click here
          </Link>{" "}
          to connect and leave your mark in the legacy!
        </p>
      </div>
      <Title>Alumni Network</Title>{" "}
      {AlumniDetails?.length ? (
        <div className="my-10 flex flex-wrap items-center justify-center gap-10">
          {AlumniDetails?.map((item) => (
            <Profile key={item._id} profile={item} />
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

export default AlumniNetwork;
