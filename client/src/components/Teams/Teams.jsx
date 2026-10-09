import axios from "axios";
import React, { useState, useEffect, useMemo } from "react";
import { faculty_advisors } from "../../data";
import Error from "../Error/Error";
import HeadTags from "../HeadTags/HeadTags";
import Loader from "../Loader/Loader";
import { Title } from "../index";
import TeamCard from "./TeamCard";
import increamentCounter from "../../libs/increamentCounter";
import MaintenancePage from "../Error/MaintenancePage";
import { useSearchParams, useLocation } from "react-router-dom";
import useIntersectionObserver from "../../hooks/useIntersectionObserver";

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

  const [activeDomain, setActiveDomain] = useState("all");

  // Reset filter when year changes
  useEffect(() => {
    setActiveDomain("all");
  }, [selectedYear]);

  // Group keyword mapping to clean domain categories
  const categorizeRole = (role = "") => {
    const r = role.toLowerCase();
    if (r.includes("chair") || r.includes("lead") || r.includes("secretary") || r.includes("president") || r.includes("treasurer")) {
      return { id: "leads", label: "Core Leads" };
    }
    if (r.includes("dev") || r.includes("web") || r.includes("tech") || r.includes("software") || r.includes("cp") || r.includes("coding") || r.includes("think tank")) {
      return { id: "tech", label: "Tech & Dev" };
    }
    if (r.includes("ai") || r.includes("ml") || r.includes("data") || r.includes("research")) {
      return { id: "aiml", label: "AI / ML" };
    }
    if (r.includes("event") || r.includes("manager") || r.includes("media") || r.includes("design") || r.includes("pr") || r.includes("relation") || r.includes("alma") || r.includes("doc")) {
      return { id: "management", label: "Operations & Media" };
    }
    return { id: "other", label: "Other" };
  };

  // Dynamically compute ONLY domains that exist in the selected year's data!
  const availableDomains = useMemo(() => {
    const set = new Map();
    set.set("all", { id: "all", label: "All Members", count: data.length });

    data.forEach(m => {
      const cat = categorizeRole(m.role);
      if (!set.has(cat.id)) {
        set.set(cat.id, { id: cat.id, label: cat.label, count: 0 });
      }
      set.get(cat.id).count += 1;
    });

    return Array.from(set.values());
  }, [data]);

  // Memoize filtered priority grouping
  const { priorityGroups, sortedPriorities, totalFilteredCount } = useMemo(() => {
    const filtered = data.filter(member => {
      if (activeDomain === "all") return true;
      return categorizeRole(member.role).id === activeDomain;
    });

    const groups = {};
    filtered.forEach(member => {
      const p = typeof member.priority === 'number' ? member.priority : Infinity;
      if (!groups[p]) groups[p] = [];
      groups[p].push(member);
    });
    const sorted = Object.keys(groups)
      .map(Number)
      .sort((a, b) => a - b);
    return { priorityGroups: groups, sortedPriorities: sorted, totalFilteredCount: filtered.length };
  }, [data, activeDomain]);

  if (error) return <MaintenancePage />;
  if (loading)
    return (
      <div className="flex h-[70vh] w-full items-center justify-center">
        <Loader />
      </div>
    );

  return (
    <div className="bg-transparent min-h-screen w-full font-sans antialiased pb-20">
      <div className="mx-auto flex flex-col items-center justify-center max-w-7xl px-4 py-16 sm:px-6 lg:px-8 space-y-16">
        <HeadTags
          title={`Core Team ${selectedYear} | Nexus - NIT Surat`}
          description="Meet the core team of Nexus"
          keywords="Nexus, NIT Surat, Core Team, Developer, Event Manager, Media Head, Design Head, AI/ML Head, Documentation Head, Coordinator, Faculty Advisors, Think Tank Head, Alma Relation Head, Treasurer, Chair Person, Vice Chair Person, Professor, Mentor"
        />
        
        {/* Core Header Section */}
        <div className="space-y-4 flex flex-col items-center text-center pb-8 border-b border-zinc-800/80 w-full md:max-w-4xl pt-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-400">
            People of Nexus
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
            Meet the Team
          </h1>
          <p className="max-w-2xl text-base text-zinc-400 mt-2 leading-relaxed">
            The visionary faculty and student minds driving the developer, AI, and competitive community at NIT Surat.
          </p>

          {/* Year Segmented Pill Selector */}
          {years.length > 0 && (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-zinc-800/90 bg-zinc-950/70 p-1.5 backdrop-blur-md">
              {years.map((year) => {
                const isSelected = year === selectedYear;
                return (
                  <button
                    key={year}
                    onClick={() => setSelectedYear(year)}
                    className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                      isSelected
                        ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/25 scale-[1.02]"
                        : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                    }`}
                  >
                    {year}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="w-full space-y-20 flex flex-col items-center justify-center">
          {/* Faculty Advisors */}
          <section className="w-full flex justify-center items-center flex-col gap-8">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-zinc-700" />
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white uppercase tracking-wider">
                Faculty Advisors
              </h2>
              <span className="h-px w-8 bg-zinc-700" />
            </div>
            <TeamCard data={faculty_advisors} isFaculty={true} />
          </section>
          
          {/* Core Committee with Domain Filter */}
          <section className="w-full flex justify-center items-center flex-col gap-10">
            <div className="flex flex-col items-center gap-6 w-full">
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-zinc-700" />
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white uppercase tracking-wider">
                  Core Committee ({selectedYear})
                </h2>
                <span className="h-px w-8 bg-zinc-700" />
              </div>

              {/* Domain Filter Chips (only render when there are multiple wings in this year) */}
              {availableDomains.length > 2 && (
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {availableDomains.map((dom) => {
                    const isActive = activeDomain === dom.id;
                    return (
                      <button
                        key={dom.id}
                        onClick={() => setActiveDomain(dom.id)}
                        className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                          isActive
                            ? "border border-cyan-500/50 bg-cyan-500/15 text-cyan-300 shadow-sm"
                            : "border border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                        }`}
                      >
                        <span>{dom.label}</span>
                        <span className="text-[10px] opacity-60">({dom.count})</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            
            {/* Team Cards Grid or Empty State */}
            {totalFilteredCount > 0 ? (
              <div className="flex flex-col w-full gap-16 lg:px-12 items-center justify-center">
                {sortedPriorities.map((priority) => (
                  <TeamCard key={priority} data={priorityGroups[priority]} />
                ))}
              </div>
            ) : (
              <div className="my-12 flex flex-col items-center justify-center rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-10 text-center">
                <p className="text-zinc-400 text-sm">No members found in this wing for {selectedYear}.</p>
                <button
                  onClick={() => setActiveDomain("all")}
                  className="mt-3 text-xs text-cyan-400 hover:underline"
                >
                  Show all members
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Teams;
