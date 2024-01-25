import React, { useState } from "react";
import Title from "../Title/Title";
import HeadTags from "../HeadTags/HeadTags";
import { Link } from "react-router-dom";
import { FaInfoCircle } from "react-icons/fa";

import AchievementCard from "./AchievementCard";
const achievements = [
  {
    timestamp: "1/19/2024 17:05:58",
    email: "u22cs059@coed.svnit.ac.in",
    name: "Neem Sheth",
    achievement:
      "Featured in Times Of India and represented SVNIT at Public Speaking Contest organised by Times of India. Achieved during my summer break after the first year - the 1st prize in the ACM Summer Challenge 2023 organized by ACM, NIT Surat!",
    imageLink: "1evM6A6uH3cTbyxrBS8bBCEcSs_pJ1LrH",
    additionalLink:
      "Explore the achievement: [View Details](https://drive.google.com/open?id=1x7DvnH7h-SfF8ln4wlOvSogQhrSaRrlP)",
  },
  {
    timestamp: "1/20/2024 18:33:17",
    email: "u22cs116@coed.svnit.ac.in",
    name: "Harsh Trada, Vatsal Koisa, Jay Kikani",
    achievement: "Web wonders 2nd prize",
    imageLink: "19WdRUokrhh12NLW141X5c-fSo_PfZviP",
    additionalLink:
      "Explore the achievement: [View Details](https://drive.google.com/open?id=1nZ0LxliS52iKQ6_8udS-_Clc4cj7t3az)",
  },
  {
    timestamp: "1/13/2024 11:46:46",
    email: "u22cs018@coed.svnit.ac.in",
    name: "Suchi Desai, Preesha Sheth, Shambhavi Shinde",
    achievement:
      "Demonstrated exceptional prowess in Table Tennis by securing the first position in the Sports Mania Inter-Year tournament. The team's outstanding performance showcased not only skill but also great sportsmanship.",
    imageLink: "1MxfOFpwu4w-w43hLRWT3MfkcC-30OZMB",
    additionalLink:
      "Explore the achievement: [View Details](https://drive.google.com/open?id=1r6O93TXMCE-yVQiJiPrBNl44L3YMSbQ1)",
  },
  {
    timestamp: "1/11/2024 19:23:11",
    email: "u22cs109@coed.svnit.ac.in",
    name: "Aasutosh Baraiya",
    achievement:
      "Earned the top spot in the Art and Reel Making Competition - ARTFLIX by presenting a creative masterpiece. The winning submission depicted a dog enjoying music on a uniquely designed t-shirt, showcasing artistic flair and innovation.",
    imageLink: "1o8Wr4QDKThfmo25ZnceA_2fPuNhlGJwP",
    additionalLink:
      "Explore the achievement: [View Details](https://drive.google.com/open?id=1XyInsFEpnCZVq09nZERPS60bH7QADOtO)",
  },
  {
    timestamp: "1/18/2024 22:14:26",
    email: "u22cs015@coed.svnit.ac.in",
    name: "Nasir Mansuri",
    achievement:
      "Contributed significantly to the Mindbend Design Committee, showcasing dedication and expertise in design. Nasir's valuable contributions have played a pivotal role in the committee's success. Looking forward to achieving more milestones with NEXUS.",
    imageLink: "1f23by41XicpzlxlAQPsHZ4c6BiQE-lAw",
    additionalLink: "",
  },
];

const Achievements = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="mx-auto mb-48 max-w-7xl">
      <HeadTags title={"Achievements - Nexus NIT Surat"} />
      <div className="mx-auto mt-10 flex w-fit items-center justify-center gap-3 rounded-md bg-yellow-400/25 p-2 px-4">
        <FaInfoCircle size={42} className="h-auto text-yellow-500" />
        <p className="w-[90%] text-xs text-white/80 md:w-full md:text-base">
          Shine a Spotlight on Your Success !!
          <Link
            to="/achievements/add-new"
            className="mx-1 font-bold text-blue-500  underline underline-offset-4"
          >
            Share Us
          </Link>
          Your Departmental Achievements and Inspire Others to Reach New
          Heights!
        </p>
      </div>
      <Title>Departmental Achievements</Title>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-10 transition-all delay-300">
        {achievements.map((el) => (
          <AchievementCard
            key={el.email}
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
