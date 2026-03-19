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
import { useSearchParams, useLocation } from "react-router-dom";

const Teams = () => {
  const [selectedYear, setSelectedYear] = useState(""); // Default year set after fetching unique years
  const [years, setYears] = useState([]); // State for unique years
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

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
        setYears(response.data.years); // Assuming 'years' is returned in the API response
        // setSelectedYear(response.data.years[response.data.years.length - 1]); // Default to the first available year
        if (searchParams.has("year")) {
          setSelectedYear(searchParams.get("year"));
        } else {
          setSelectedYear(response.data.years[response.data.years.length - 1]);
          setSearchParams((prev) => {
            prev.set("year", response.data.years[response.data.years.length - 1]);
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
  }, []);

  useEffect(() => {
    if (!selectedYear) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/team/${selectedYear}`,
        );
        setData(response.data.data); // Access the 'data' key from response
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
  }, [selectedYear]); // Refetch data when selectedYear changes

  if (error) return <MaintenancePage />;
  if (loading)
    return (
      <div className="flex h-[70vh] w-full items-center justify-center">
        <Loader />
      </div>
    );

  // Sort team members by priority (ascending: 0, 1, 2, ...)
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
    <div className="bg-[#000000] min-h-screen w-full font-sans antialiased">
      <div className="mx-auto flex flex-col items-center justify-center max-w-7xl px-4 py-16 sm:px-6 lg:px-8 space-y-16">
        <HeadTags
          title={`Core Team ${selectedYear} | Nexus - NIT Surat`}
          description="Meet the core team of Nexus, the technical society of NIT Surat."
          keywords="Nexus, NIT Surat, Core Team, Developer, Event Manager, Media Head, Design Head, AI/ML Head, Documentation Head, Coordinator, Faculty Advisors, Think Tank Head, Alma Relation Head, Treasurer, Chair Person, Vice Chair Person, Professor, Mentor"
        />
        
        {/* Core Header Section */}
        <div className="space-y-4 flex flex-col items-center text-center pb-8 border-b border-zinc-900 w-full md:max-w-4xl pt-4">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            Meet the Team
          </h1>
          <p className="max-w-2xl text-base text-zinc-400 mt-4 leading-relaxed">
            The visionary faculty and brilliant student minds orchestrating the architecture of the Nexus ecosystem at NIT Surat.
          </p>
        </div>

        <div className="w-full space-y-24 flex flex-col items-center justify-center">
          <section className="w-full flex justify-center items-center flex-col gap-10">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-100 uppercase">Faculty Advisors</h2>
            <TeamCard data={faculty_advisors} isFaculty={true} />
          </section>
          
          <section className="w-full flex justify-center items-center flex-col gap-10">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <h2 className="text-2xl font-bold tracking-tight text-white uppercase">Core Committee</h2>
              <div className="relative">
                <select
                  value={selectedYear}
                  onChange={handleYearChange}
                  className="appearance-none rounded-lg border border-zinc-800 bg-zinc-900/80 px-4 py-2 pr-8 text-sm font-semibold text-zinc-300 shadow-sm transition-colors hover:border-zinc-700 hover:bg-zinc-800 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-600 outline-none cursor-pointer"
                >
                  {years.map((year) => (
                    <option key={year} value={year} className="bg-zinc-900 text-zinc-300">
                      {year}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-zinc-400">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col w-full gap-16 lg:px-12 items-center justify-center">
              {sortedPriorities.map(priority => (
                <TeamCard key={priority} data={priorityGroups[priority]} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Teams;
