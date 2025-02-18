import axios from "axios";
import React, { useState, useEffect } from "react";
import { faculty_advisors } from "../../data";
import Error from "../Error/Error";
import HeadTags from "../HeadTags/HeadTags";
import Loader from "../Loader/Loader";
import { Title } from "../index";
import TeamCard from "./TeamCard";
import increamentCounter from "../../libs/increamentCounter";
import MaintenancePage from "../Error/MaintenancePage";

const Teams = () => {
  // const [selectedYear, setSelectedYear] = useState(""); // Default year set after fetching unique years
  // const [years, setYears] = useState([]); // State for unique years
  // const [data, setData] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  // const handleYearChange = (event) => {
  //   setSelectedYear(event.target.value);
  // };

  // useEffect(() => {
  //   // Fetch unique years from backend
  //   const fetchYears = async () => {
  //     try {
  //       const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/team/unique-years`);
  //       setYears(response.data.years); // Assuming 'years' is returned in the API response
  //       setSelectedYear(response.data.years[0]); // Default to the first available year
  //     } catch (err) {
  //       setError(err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchYears();
  //   increamentCounter();
  // }, []);

  // useEffect(() => {
  //   if (!selectedYear) return;

  //   const fetchData = async () => {
  //     setLoading(true);
  //     setError(null);

  //     try {
  //       const response = await axios.get(
  //         `${process.env.REACT_APP_BACKEND_BASE_URL}/team/${selectedYear}`
  //       );
  //       setData(response.data.data); // Access the 'data' key from response
  //     } catch (err) {
  //       setError(err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, [selectedYear]); // Refetch data when selectedYear changes

  // if (error) return <MaintenancePage />;
  // if (loading)
  //   return (
  //     <div className="flex h-[70vh] w-full items-center justify-center">
  //       <Loader />
  //     </div>
  //   );

  //   const certainRolesList = ["Chair Person", "Vice Chair Person", "Event Manager"];
  //   const team_core = data.filter((member) => certainRolesList.includes(member.role));
  //   const team_devs = data.filter((member) => member.role === "Developer");
  //   const team_treasurer = data.filter((member) => member.role === "Treasurer");
  //   const team_social_med = data.filter((member) => member.role === "Media Head");
  //   const team_designer = data.filter((member) => member.role === "Design Head");
  //   const team_AI = data.filter((member) => member.role === "AI/ML Head");
  //   const team_Alma = data.filter((member) => member.role === "Alma Relation Head");
  //   const team_Think_Tank = data.filter((member) => member.role === "Think Tank Head");
  //   const team_Documentation = data.filter((member) => member.role === "Documentation Head");
  //   const team_Coordinator = data.filter((member) => member.role === "Coordinator");
    

  // return (
  //   <div className="mx-auto mb-20 flex h-full max-w-7xl flex-col items-center justify-center md:my-10">
  //     <HeadTags title={"Team - Nexus NIT Surat"} />
  //     <Title>Faculty Advisors</Title>
  //     <TeamCard data={faculty_advisors} isFaculty={true} />
  //     <Title>Our Team
  //       &nbsp;&nbsp;
  //       <select
  //         value={selectedYear}
  //         onChange={handleYearChange}
  //         className="px-2 py-1 text-sm text-white bg-transparent border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
  //       >
  //         {years.map((year) => (
  //           <option key={year} value={year} className="bg-black text-white">
  //             {year}
  //           </option>
  //         ))}
  //       </select>
  //     </Title>
  //     <TeamCard data={team_core} />
  //     <TeamCard data={team_devs} />
  //     <TeamCard data={team_treasurer} />
  //     <TeamCard data={team_social_med} />
  //     <TeamCard data={team_designer} />

  //     <TeamCard data={team_AI} />
  //     <TeamCard data={team_Alma} />
  //     <TeamCard data={team_Think_Tank} />
  //     <TeamCard data={team_Documentation} />
  //     <TeamCard data={team_Coordinator} />

  //   </div>
  // );
  return <MaintenancePage/>;
};

export default Teams;
