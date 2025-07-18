import { AlumniCard } from "../../components/Alumni/AlumniCard.jsx";
import { useState, useEffect, useCallback } from "react";
import { HiUsers } from "react-icons/hi2";
import { useQuery } from "@tanstack/react-query";
import { AlumniHero } from "../../components/Alumni/AlumniHero.jsx";
import MaintenancePage from "../../components/Error/MaintenancePage.jsx";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { Badge } from "../../components/Alumni/Badge.jsx";

const Alumni = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageLimit, setPageLimit] = useState(3);
    const [AlumniDetails, setAlumniDetails] = useState([]);
    const [totalAlumni, setTotalAlumni] = useState(0);
    
    const [batchFrom, setBatchFrom] = useState("");
    const [batchTo, setBatchTo] = useState("");
    const [company, setCompany] = useState("");
    const [expertise, setExpertise] = useState("");

    const [searchParams, setSearchParams] = useSearchParams();

    // Initialize currentPage and pageLimit from URL params if available
    useEffect(() => {
        const pageFromUrl = searchParams.get('page');
        const limitFromUrl = searchParams.get('limit');
        
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
        // Include currentPage and pageLimit in query key to trigger refetch
        queryKey: ["alumniDetails", currentPage, pageLimit],
        queryFn: async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_BACKEND_BASE_URL}/alumni/`,
                    {
                        params: {
                            page: currentPage,
                            limit: pageLimit
                        }
                    }
                );
                if (response.status !== 200) {
                    throw new Error("Failed to fetch Alumni Details");
                }

                return response.data;
            } catch (error) {
                throw new Error("Failed to fetch Alumni Details");
            }
        },
        // Keep previous data while loading new page
        keepPreviousData: true,
        // Prevent refetch on window focus during pagination
        refetchOnWindowFocus: false,
    });

    // Update state when data changes
    useEffect(() => {
        if (data) {
            setAlumniDetails(data.data);
            setTotalPages(data.pagination.totalPages);
            setCurrentPage(data.pagination.page);
            setPageLimit(data.pagination.limit);
            setTotalAlumni(data.pagination.total);
        }
    }, [data]);

    const [companies, setCompanies] = useState([]);

    function handlePageChange(newPage) {
        if (newPage < 1 || newPage > totalPages) return;
        
        // Update URL with new page
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set('page', newPage.toString());
        setSearchParams(newSearchParams);
        
        setCurrentPage(newPage);
        
        // Scroll to top when page changes
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (isLoading && !data) {
        return <div className="h-screen text-white">Loading...</div>;
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
            <div className="max-w-7xl px-4 py-12 sm:px-6 lg:px-8 mx-auto md:ml-20 lg:ml-auto">
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-bold text-foreground">Alumni Directory</h2>
                        <Badge variant="secondary" className="bg-primary/10 text-blue-400">
                            {totalAlumni} Alumni
                        </Badge>
                        </div>
                    </div>
                    {AlumniDetails?.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {AlumniDetails.map((alumni, index) => (
                                <div
                                    key={alumni._id}
                                    className="animate-fade-in"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <AlumniCard alumni={alumni} />
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
                </div>
            </div>

            {/* Pagination Controls */}
            <div className="mt-10 flex justify-center gap-2 mb-24">
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