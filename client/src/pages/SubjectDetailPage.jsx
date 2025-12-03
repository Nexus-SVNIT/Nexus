// src/pages/SubjectDetailPage.jsx

import { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { getSubjectDetails } from "../services/studyMaterialService";

import Loader from "../components/Loader/Loader";
import MaintenancePage from "../components/Error/MaintenancePage";
import SearchBar from "../components/Alumni/SearchBar.jsx";

import {
    LuLink,
    LuFileText,
    LuYoutube,
    LuBook,
    LuArrowLeft,
    LuFilter
} from "react-icons/lu";


// ------------------------------------------------------
// ResourceLink Component
// ------------------------------------------------------
const ResourceLink = ({ resource }) => {
    let icon;

    switch (resource.subCategory) {
        case "Youtube Resources":
            icon = <LuYoutube className="h-5 w-5" />;
            break;
        case "Notes":
        case "PYQs":
            icon = <LuFileText className="h-5 w-5" />;
            break;
        case "Important topics":
            icon = <LuBook className="h-5 w-5" />;
            break;
        default:
            icon =
                resource.resourceType === "PDF" ? (
                    <LuFileText className="h-5 w-5" />
                ) : (
                    <LuLink className="h-5 w-5" />
                );
    }

    return (
        <a
            href={resource.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-[#0f0f0f] p-4 transition-all duration-300 hover:border-blue-400/50 hover:bg-white/5"
        >
            <div className="flex items-center gap-3">
                <span className="text-blue-400">{icon}</span>
                <span className="font-medium text-gray-100">{resource.title}</span>
            </div>
            <LuLink className="h-4 w-4 text-gray-500 transition-all duration-300 group-hover:text-blue-400" />
        </a>
    );
};


// ------------------------------------------------------
// Main Component
// ------------------------------------------------------
const SubjectDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState("");
    const [subCategoryFilter, setSubCategoryFilter] = useState("All");
    const [typeFilter, setTypeFilter] = useState("All");

    // Redirect if token missing
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) navigate("/login");
    }, [navigate]);

    // Fetch subject details
    const {
        data: subject,
        isLoading,
        isError,
        error
    } = useQuery({
        queryKey: ["subjectDetails", id],
        queryFn: async () => {
            const response = await getSubjectDetails(id);
            if (!response.success) throw new Error(response.message);
            return response.data.data;
        },
        staleTime: 1000 * 60 * 15,
        onError: (err) => {
            const msg = err.message.toLowerCase();
            if (msg.includes("token") || msg.includes("unauthorized")) {
                localStorage.removeItem("token");
                navigate("/login");
            }
        }
    });

    // Filtering logic
    const filteredResources = useMemo(() => {
        if (!subject) return {};

        const result = {};
        const query = searchTerm.toLowerCase();

        Object.keys(subject.resources).forEach((category) => {
            let list = subject.resources[category];

            if (subCategoryFilter !== "All" && subCategoryFilter !== category) {
                list = [];
            }

            if (typeFilter !== "All") {
                list = list.filter((res) => res.resourceType === typeFilter);
            }

            if (query) {
                list = list.filter((res) =>
                    res.title.toLowerCase().includes(query)
                );
            }

            result[category] = list;
        });

        return result;
    }, [subject, searchTerm, subCategoryFilter, typeFilter]);

    const allSubCategories =
        subject ? Object.keys(subject.resources) : [];

    const allTypes =
        subject
            ? [...new Set(Object.values(subject.resources).flat().map((r) => r.resourceType))]
            : [];

    const noResults =
        Object.values(filteredResources).flat().length === 0;


    // --------------------------------------------------
    // Rendering states
    // --------------------------------------------------
    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader />
            </div>
        );
    }

    if (isError) {
        const msg = error.message.toLowerCase();
        if (msg.includes("token")) return null;
        return <MaintenancePage />;
    }

    if (!subject) return null;

    // --------------------------------------------------
    // Final Render
    // --------------------------------------------------
    return (
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 text-white">
            
            <Link
                to="/study-material"
                className="mb-6 inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 font-medium hover:bg-white/20"
            >
                <LuArrowLeft className="h-4 w-4" />
                Back to Subjects
            </Link>

            <h1 className="mb-8 text-4xl font-bold">
                {subject.subjectName}
            </h1>

            <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                
                {/* Left Column - Resources */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* Filter bar */}
                    <div className="p-4 rounded-lg border border-white/10 bg-[#0f0f0f] space-y-4">
                        <SearchBar
                            placeholder="Search resources..."
                            value={searchTerm}
                            onChange={setSearchTerm}
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            
                            {/* Subcategory */}
                            <div>
                                <label className="block text-sm mb-1 text-gray-300">Sub-Category</label>
                                <select
                                    value={subCategoryFilter}
                                    onChange={(e) => setSubCategoryFilter(e.target.value)}
                                    className="w-full bg-white/10 border border-white/20 rounded-lg py-2.5 px-3 text-white focus:ring-blue-500"
                                >
                                    <option value="All">All</option>
                                    {allSubCategories.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Type */}
                            <div>
                                <label className="block text-sm mb-1 text-gray-300">Type</label>
                                <select
                                    value={typeFilter}
                                    onChange={(e) => setTypeFilter(e.target.value)}
                                    className="w-full bg-white/10 border border-white/20 rounded-lg py-2.5 px-3 text-white focus:ring-blue-500"
                                >
                                    <option value="All">All</option>
                                    {allTypes.map((t) => (
                                        <option key={t} value={t}>
                                            {t}
                                        </option>
                                    ))}
                                </select>
                            </div>

                        </div>
                    </div>

                    {/* Resource list */}
                    {Object.keys(filteredResources).map((cat) =>
                        filteredResources[cat].length > 0 && (
                            <section key={cat}>
                                <h2 className="text-2xl font-semibold text-blue-400 mb-4">
                                    {cat}
                                </h2>

                                <div className="space-y-3">
                                    {filteredResources[cat].map((res) => (
                                        <ResourceLink key={res._id} resource={res} />
                                    ))}
                                </div>
                            </section>
                        )
                    )}

                    {/* Empty */}
                    {noResults && (
                        <div className="text-center py-10 border border-dashed border-white/10 rounded-lg">
                            <LuFilter className="h-12 w-12 mx-auto text-gray-500" />
                            <h3 className="text-xl font-semibold mt-3">
                                No resources found
                            </h3>
                            <p className="text-gray-400 mt-1">
                                Try changing search or filters.
                            </p>
                        </div>
                    )}
                </div>

                {/* Right Column — Tips */}
                <div>
                    <div className="sticky top-24 p-6 bg-[#0f0f0f] border border-white/10 rounded-2xl">
                        
                        <h2 className="text-2xl font-semibold text-blue-400 mb-4">
                            Tips & Advice
                        </h2>

                        {subject.tips.length > 0 ? (
                            <ul className="space-y-4">
                                {subject.tips.map((tip, i) => (
                                    <li key={i} className="flex gap-3">
                                        <span className="h-1.5 w-1.5 bg-blue-400 rounded-full mt-2"></span>
                                        <span className="text-gray-300">{tip}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-400">No tips yet.</p>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SubjectDetailPage;
