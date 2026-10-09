import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { FaInfoCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import HeadTags from "../HeadTags/HeadTags";
import Loader from "../Loader/Loader";
import Title from "../Title/Title";
import AchievementCard from "./AchievementCard";
import increamentCounter from "../../libs/increamentCounter";
import MaintenancePage from '../Error/MaintenancePage';
import { getAchivements } from "../../services/achievementService";

const Achievements = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    increamentCounter();
  }
  , []);
  const {
    isPending: loading,
    error,
    data: achievements,
  } = useQuery({
    queryKey: ["achievementsData"],
    queryFn: async () => {
      const response = await getAchivements();
      if (!response.success) {
        throw new Error(`Failed to fetch achievements: ${response.message}`);
      }
      return response.data;
    },
  });
  if (error) {
    return <MaintenancePage />;
  }
  if (loading)
    return (
      <div className="flex h-[70vh] w-full items-center justify-center">
        <Loader />
      </div>
    );

  return (
    <div className="mx-auto mb-48 max-w-7xl">
      <HeadTags 
        title={"Departmental Achievements - Nexus NIT Surat"}
        description="Departmental Achievements of the students of CSE and AI department of NIT Surat."
        keywords="Achievements, Departmental Achievements, NIT Surat, CSE, AI, NIT Surat Achievements, Hackathon, Winner, Runner-Up, Coding, Competitive Programming, Competition"
      />
      <div className="mx-4 mt-10 flex w-fit items-center justify-center gap-3 rounded-2xl border border-amber-500/25 bg-amber-500/10 p-3 px-5 shadow-lg backdrop-blur-md md:mx-auto">
        <FaInfoCircle size={32} className="h-auto text-amber-400 flex-shrink-0" />
        <p className="w-[90%] text-xs text-zinc-200 md:w-full md:text-sm">
          Shine a Spotlight on Your Success!{" "}
          <Link
            to="/achievements/add-new"
            className="font-semibold text-blue-400 underline underline-offset-4 hover:text-blue-300"
          >
            Share With Us
          </Link>{" "}
          your departmental achievements and inspire others to reach new heights!
        </p>
      </div>
      <Title>Departmental Achievements</Title>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-6 px-4 transition-all delay-300 sm:gap-10 sm:px-0">
        {achievements.map((el) => (
          <AchievementCard
            key={el._id || el.email}
            el={el}
            open={open}
            setOpen={setOpen}
          />
        ))}
      </div>
    </div>
  );
};

export default Achievements;
