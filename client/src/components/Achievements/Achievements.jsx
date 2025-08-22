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
    queryFn: () =>
      fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/achievements/`).then(
        (res) => res.json(),
      ),
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
      <div className="mx-2 mt-10 flex w-fit items-center justify-center gap-3 rounded-md bg-yellow-400/25 p-2 px-4 md:mx-auto ">
        <FaInfoCircle size={42} className="h-auto text-yellow-500" />
        <p className="w-[90%] text-xs text-white/80 md:w-full md:text-base">
          Shine a Spotlight on Your Success !!
          <Link
            to="/achievements/add-new"
            className="mx-1 font-bold text-blue-500  underline underline-offset-4"
          >
            Share With Us
          </Link>
          Your Departmental Achievements and Inspire Others to Reach New
          Heights!
        </p>
      </div>
      <Title>Departmental Achievements</Title>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-10 transition-all delay-300">
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
