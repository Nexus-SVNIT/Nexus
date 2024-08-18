import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { faculty_advisors } from "../../data";
import Error from "../Error/Error";
import HeadTags from "../HeadTags/HeadTags";
import Loader from "../Loader/Loader";
import { Title } from "../index";
import TeamCard from "./TeamCard";

const Teams = () => {

  const [selectedYear, setSelectedYear] = useState('2024'); // Default to 2024

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const {
    isLoading: loading, // Adjusted naming for loading state
    error,
    data,
  } = useQuery({
    queryKey: ["eventData", selectedYear], // Include selectedYear in the query key
    queryFn: () =>
      fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/member/all/${selectedYear}`).then((res) =>
        res.json(),
      ),
    keepPreviousData: true, // Keeps previous data while fetching new data
  });

  if (error) return <Error />;
  if (loading)
    return (
      <div className="flex h-[70vh] w-full items-center justify-center">
        <Loader />
      </div>
    );

  const certainRolesList = ["Chairperson", "Vice Chairperson", "Event Manager"];
  const team_core = data.filter((member) =>
    certainRolesList.includes(member.role),
  );
  const team_devs = data.filter((member) => member.role === "Developer");
  const team_treasurer = data.filter((member) => member.role === "Treasurer");
  const team_social_med = data.filter(
    (member) => member.role === "Social Media Manager",
  );
  const team_designer = data.filter((member) => member.role === "Designer");
  const team_AI = data.filter(
    (member) => member.role === "AI/ML Head",
  );
  const team_Alma = data.filter(
    (member) => member.role === "Alma Relation Head ",
  );
  const team_Think_Tank = data.filter(
    (member) => member.role === "Think Tank Head",
  );
  const team_Documentation = data.filter(
    (member) => member.role === "Documentation Head",
  );
  const team_Coordinator = data.filter(
    (member) => member.role === "Coordinator",
  );

  return (
    <div className="mx-auto mb-20 flex h-full max-w-7xl flex-col items-center justify-center md:my-10  ">
      <HeadTags title={"Team - Nexus NIT Surat"} />
      <Title>Faculty Advisors</Title>
      <TeamCard data={faculty_advisors} isFaculty={true} />
      <Title>Our Team
        &nbsp;  &nbsp; &nbsp;&nbsp;
        <select
          value={selectedYear}
          onChange={handleYearChange}
          className="px-2 py-1 text-sm text-white bg-transparent border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="2023" className="bg-black text-white">2023</option>
          <option value="2024" className="bg-black text-white">2024</option>
        </select>
      </Title>
      <TeamCard data={team_core} />
      <TeamCard data={team_devs} />
      <TeamCard data={team_treasurer} />
      <TeamCard data={team_social_med} />
      <TeamCard data={team_designer} />

      {selectedYear === "2023" ? (
        <TeamCard data={team_Coordinator} />
      ) : (
        <>
          <TeamCard data={team_AI} />
          <TeamCard data={team_Alma} />
          <TeamCard data={team_Think_Tank} />
          <TeamCard data={team_Documentation} />
        </>
      )}

    </div>
  );
};

export default Teams;
