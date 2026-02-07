import axios from "axios";
import React, { useState, useEffect } from "react";
import { faculty_advisors } from "../../data";
// Removed unused Error import
import HeadTags from "../HeadTags/HeadTags";
import Loader from "../Loader/Loader";
import { Title } from "../index";
import TeamCard from "./TeamCard";
import increamentCounter from "../../libs/increamentCounter";
import MaintenancePage from "../Error/MaintenancePage";
import { useSearchParams } from "react-router-dom"; // Removed unused useLocation

const Teams = () => {
  const [selectedYear, setSelectedYear] = useState("");
  const [years, setYears] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  // Removed unused location variable

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  useEffect(() => {
    // Fetch unique years from backend
    const fetchYears = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/team/unique-years`,
        );
        setYears(response.data.years);
        
        if (searchParams.has("year")) {
          setSelectedYear(searchParams.get("year"));
        } else {
          // Default to the most recent year
          const latestYear = response.data.years[response.data.years.length - 1];
          setSelectedYear(latestYear);
          setSearchParams((prev) => {
            prev.set("year", latestYear);
            return prev;
          });
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchYears();
    increamentCounter();
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Intentionally empty to run only once on mount

  useEffect(() => {
    if (!selectedYear) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/team/${selectedYear}`,
        );
        setData(response.data.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    setSearchParams((prev) => {
      prev.set("year", selectedYear);
      return prev;
    });

    fetchData();
  }, [selectedYear, setSearchParams]); // Added setSearchParams to dependencies

  if (error) return <MaintenancePage />;
  if (loading)
    return (
      <div className="flex h-[70vh] w-full items-center justify-center">
        <Loader />
      </div>
    );

  // Group team members by priority level
  const priorityGroups = {};
  data.forEach(member => {
    const p = typeof member.priority === 'number' ? member.priority : Infinity;
    if (!priorityGroups[p]) priorityGroups[p] = [];
    priorityGroups[p].push(member);
  });
  
  // Get sorted priority levels (0, 1, 2, ...)
  const sortedPriorities = Object.keys(priorityGroups)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="mx-auto mb-20 flex h-full max-w-7xl flex-col items-center justify-center md:my-10">
      <HeadTags
        title={`Core Team ${selectedYear} | Nexus - NIT Surat`}
        description="Meet the core team of Nexus, the technical society of NIT Surat."
        keywords="Nexus, NIT Surat, Core Team, Developer, Event Manager, Media Head, Design Head, AI/ML Head, Documentation Head, Coordinator, Faculty Advisors, Think Tank Head, Alma Relation Head, Treasurer, Chair Person, Vice Chair Person, Professor, Mentor"
      />
      <Title>Faculty Advisors</Title>
      <TeamCard data={faculty_advisors} isFaculty={true} />
      <Title>
        Our Team &nbsp;&nbsp;
        <select
          value={selectedYear}
          onChange={handleYearChange}
          className="border-gray-300 rounded-md border bg-transparent px-2 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {years.map((year) => (
            <option key={year} value={year} className="bg-black text-white">
              {year}
            </option>
          ))}
        </select>
      </Title>
      {sortedPriorities.map(priority => (
        <TeamCard key={priority} data={priorityGroups[priority]} />
      ))}
    </div>
  );
};

export default Teams;