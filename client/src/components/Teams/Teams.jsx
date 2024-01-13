import React from "react";
import { faculty_advisors } from "../../data";
import { Title } from "../index";
import TeamCard from "./TeamCard";
import Error from "../Error/Error";
import { useQuery } from "@tanstack/react-query";

const Teams = () => {
  const {
    isPending: loading,
    error,
    data,
  } = useQuery({
    queryKey: ["eventData"],
    queryFn: () =>
      fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/member`).then((res) =>
        res.json(),
      ),
  });

  if (error) return <Error />;
  if (loading)
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        Loading...
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
  const team_coordinators = data.filter(
    (member) => member.role === "Coordinator",
  );

  return (
    <div className="mx-auto mb-20 flex h-full max-w-7xl flex-col items-center justify-center md:my-10  ">
      <Title>Faculty Advisors</Title>
      <TeamCard data={faculty_advisors} isFaculty={true} />
      <Title>Our Team</Title>
      <TeamCard data={team_core} />
      <TeamCard data={team_devs} />
      <TeamCard data={team_treasurer} />
      <TeamCard data={team_social_med} />
      <TeamCard data={team_designer} />
      <TeamCard data={team_coordinators} />
    </div>
  );
};

export default Teams;
