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
      try {
        // toast.loading("Loading details...");
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/alumni/`,
          {
            params: {
              page: currentPage,
              limit: pageLimit,
              q: debouncedSearchTerm,
              batchFrom: batchFrom || undefined,
              batchTo: batchTo || undefined,
              expertise: expertise || undefined,
              company: company || undefined,
            },
          },
        );
        if (response.status !== 200) {
          throw new Error("Failed to fetch Alumni Details");
        }

        return response.data;
      } catch (error) {
        throw new Error("Failed to fetch Alumni Details");
      }
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
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/alumni/get-companies-and-expertise`,
        );
        if (response.status === 200) {
          setCompanies(response.data.companies);
          setExpertises(response.data.expertise);
        } else {
          console.error("Failed to fetch companies");
        }
      } catch (error) {
        console.error("Error fetching companies:", error);
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
    <div>
      {/* Hero Section */}
      <AlumniHero />

      {/* Main Content */}
      <div
        id="alumni-directory"
        className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:ml-20 lg:ml-auto lg:px-8"
      >
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <h2 className="text-foreground text-2xl font-bold">
              Alumni Directory
            </h2>
            <Badge variant="secondary" className="bg-primary/10 text-blue-400">
              {totalAlumni} Alumni
            </Badge>
          </div>

          {/* Filters Toggle Button */}
          <div className="flex items-center justify-center gap-4">
            <SearchBar
              placeholder="Search by name, company, skills..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-colors ${
                showFilters
                  ? "bg-blue-600 hover:bg-blue-500"
                  : "bg-white/10 hover:bg-white/20"
              }`}
            >
              <FaFilter
                className={showFilters ? "text-white" : "text-gray-300"}
              />
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
      <div className="mb-24 mt-10 flex justify-center gap-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="disabled:bg-gray-600 rounded bg-blue-600 px-3 py-1 text-white"
        >
          Previous
        </button>
        <span className="text-white">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="disabled:bg-gray-600 rounded bg-blue-600 px-3 py-1 text-white"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Alumni;
