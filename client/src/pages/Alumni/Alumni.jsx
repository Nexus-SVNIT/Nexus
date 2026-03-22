import { AlumniCard } from "../../components/Alumni/AlumniCard.jsx";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { AlumniHero } from "../../components/Alumni/AlumniHero.jsx";
import MaintenancePage from "../../components/Error/MaintenancePage.jsx";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { Badge } from "../../components/Alumni/Badge.jsx";
import { FaFilter } from "react-icons/fa";
import SearchBar from "../../components/Alumni/SearchBar.jsx";
import Filters from "../../components/Alumni/AlumniFilters.jsx";
import Loader from "../../components/Loader/Loader.jsx";
import { getAllCompaniesAndExpertise, getAlumniDetails } from "../../services/alumniService.js";

const Alumni = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageLimit, setPageLimit] = useState(12);
  const [AlumniDetails, setAlumniDetails] = useState([]);
  const [totalAlumni, setTotalAlumni] = useState(0);

  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [batchFrom, setBatchFrom] = useState("");
  const [batchTo, setBatchTo] = useState("");
  const [company, setCompany] = useState("");
  const [companies, setCompanies] = useState([]);
  const [expertise, setExpertise] = useState("");
  const [expertises, setExpertises] = useState([]);

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [hasInitialData, setHasInitialData] = useState(false);

  const clearFilters = () => {
    setBatchFrom("");
    setBatchTo("");
    setExpertise("");
    setSearchTerm("");
    setCompany("");
    setSearchParams({
      batchFrom: "",
      batchTo: "",
      expertise: "",
      company: "",
      page: "1",
      limit: pageLimit.toString(),
    });
  };

  // Initialize currentPage and pageLimit from URL params if available
  useEffect(() => {
    const pageFromUrl = searchParams.get("page");
    const limitFromUrl = searchParams.get("limit");

    if (pageFromUrl) {
      setCurrentPage(parseInt(pageFromUrl));
    }
    if (limitFromUrl) {
      setPageLimit(parseInt(limitFromUrl));
    }
  }, [searchParams]);

  const {
    isLoading,
    isError,
    data: data,
  } = useQuery({
    queryKey: [
      "alumniDetails",
      currentPage,
      pageLimit,
      debouncedSearchTerm,
      batchFrom,
      batchTo,
      expertise,
      company,
    ],
    queryFn: async () => {
      const response = await getAlumniDetails({
          page: currentPage,
          limit: pageLimit,
          q: debouncedSearchTerm,
          batchFrom: batchFrom || undefined,
          batchTo: batchTo || undefined,
          expertise: expertise || undefined,
          company: company || undefined,
        },
      )
      if (!response.success) {
        throw new Error(`Failed to fetch Alumni Details: ${response.message}`);
      }

      return response.data;
    },
    staleTime: 1000 * 60 * 15,
    cacheTime: 1000 * 60 * 60,
  });

  // Update state when data changes
  useEffect(() => {
    if (data) {
      setAlumniDetails(data.data);
      setTotalPages(data.pagination.totalPages);
      setCurrentPage(data.pagination.page);
      setPageLimit(data.pagination.limit);
      setTotalAlumni(data.pagination.total);
      setHasInitialData(true);
    }
  }, [data]);

  useEffect(() => {
    clearFilters();
    const fetchCompanies = async () => {
      const response = await getAllCompaniesAndExpertise();
      if (response.success) {
        setCompanies(response.data.companies);
        setExpertises(response.data.expertise);
      } else {
        console.error("Failed to fetch companies", response.message);
      }
    };

    fetchCompanies();
  }, []);

  // Debounce logic
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms debounce

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  function handlePageChange(newPage) {
    if (newPage < 1 || newPage > totalPages) return;

    // Update URL with new page
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("page", newPage.toString());
    newSearchParams.set("limit", pageLimit.toString());
    setSearchParams(newSearchParams);

    // setCurrentPage(newPage);
    setTimeout(() => {
      const targetElement = document.getElementById("alumni-directory");
      if (targetElement) {
        window.scrollTo({ top: targetElement.offsetTop, behavior: "smooth" });
      }
    }, 100);
  }

  function setFilters(newFilters) {
    if(newFilters.batchForm) setBatchFrom(newFilters.batchFrom);
    if(newFilters.batchTo) setBatchTo(newFilters.batchTo);
    if(newFilters.expertise) setExpertise(newFilters.expertise);
    if(newFilters.company) setCompany(newFilters.company);

    // Update URL with new filters
    const newSearchParams = new URLSearchParams(searchParams);
    // newSearchParams.set("batchFrom", newFilters.batchFrom || "");
    // newSearchParams.set("batchTo", newFilters.batchTo || "");
    // newSearchParams.set("company", newFilters.company || "");
    // newSearchParams.set("expertise", newFilters.expertise || "");
    Object.entries(newFilters).forEach(([key, value]) => {
      newSearchParams.set(key, value);
    });
    newSearchParams.set("page", "1");
    setSearchParams(newSearchParams);

    setCurrentPage(1);
  }

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("q", value);
    newSearchParams.set("page", "1");
    newSearchParams.set("limit", pageLimit.toString());
    setSearchParams(newSearchParams);
    setCurrentPage(1);
  };

  if (!hasInitialData && isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (isError) {
    console.error("Error fetching alumni details:", isError);
    return <MaintenancePage />;
  }

  return (
    <div className="bg-[#000000] mb-36 min-h-screen p-4 sm:p-6 md:mx-auto md:max-w-7xl">
      {/* Hero Section */}
      <AlumniHero />

      {/* Main Content */}
      <div
        id="alumni-directory"
        className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
      >
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-white text-2xl font-bold">
              Alumni Directory
            </h2>
            <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {totalAlumni} Alumni
            </Badge>
          </div>

          {/* Controls & Filters Row */}
          <div className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4 bg-zinc-900/40 p-3 rounded-2xl border border-zinc-800/50 backdrop-blur-sm">
            <div className="w-full sm:w-1/2 lg:w-1/3">
              <SearchBar
                placeholder="Search by name, company, skills..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 font-medium transition-all duration-300 ${
                showFilters
                  ? "bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]"
                  : "bg-zinc-800/50 text-gray-300 border border-zinc-700/50 hover:bg-zinc-800 hover:text-white"
              }`}
            >
              <FaFilter className={showFilters ? "text-blue-400" : "text-gray-400"} />
              <span>Filters</span>
            </button>
          </div>

          {/* Filters Component */}
          <Filters
            showFilters={showFilters}
            batchFrom={batchFrom}
            batchTo={batchTo}
            company={company}
            companies={companies}
            expertise={expertise}
            clearFilters={clearFilters}
            onApplyFilters={setFilters}
            expertiseOptions={expertises}
          />

          {isLoading ? (
            <div className="py-16 text-center">
              <h3 className="mb-2 text-xl font-semibold">Loading...</h3>
            </div>
          ) : (
            <>
              {AlumniDetails?.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {AlumniDetails.map((alumni, index) => (
                    <div
                      key={alumni._id}
                      className="animate-fade-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <AlumniCard alumni={alumni} setFilters={setFilters} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center">
                  <h3 className="mb-2 text-xl font-semibold">
                    No alumni found
                  </h3>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="mt-16 mb-24 flex items-center justify-center gap-3">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="flex items-center justify-center rounded-xl bg-zinc-800/80 border border-zinc-700/50 px-4 py-2.5 text-sm font-medium text-gray-300 transition-all hover:bg-zinc-700 hover:text-white disabled:pointer-events-none disabled:opacity-50"
        >
          Previous
        </button>
        <div className="flex items-center justify-center rounded-xl bg-zinc-900/60 border border-zinc-800 px-5 py-2.5 text-sm font-medium text-gray-400">
          Page <span className="text-white mx-1">{currentPage}</span> of <span className="text-white mx-1">{totalPages}</span>
        </div>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="flex items-center justify-center rounded-xl bg-zinc-800/80 border border-zinc-700/50 px-4 py-2.5 text-sm font-medium text-gray-300 transition-all hover:bg-zinc-700 hover:text-white disabled:pointer-events-none disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Alumni;
