import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getSubjectDetails } from '../services/studyMaterialService';
import Loader from '../components/Loader/Loader';
import MaintenancePage from '../components/Error/MaintenancePage';
import { LuLink, LuFileText, LuYoutube, LuBook, LuArrowLeft, LuFilter } from 'react-icons/lu';
import SearchBar from '../components/Alumni/SearchBar.jsx';

const ResourceLink = ({ resource }) => {
    let icon;

    switch (resource.subCategory) {
        case 'Youtube Resources':
            icon = <LuYoutube className="h-5 w-5" />;
            break;
        case 'Notes':
        case 'PYQs':
            icon = <LuFileText className="h-5 w-5" />;
            break;
        case 'Important topics':
            icon = <LuBook className="h-5 w-5" />;
            break;
        default:
            icon = resource.resourceType === 'PDF' ? <LuFileText className="h-5 w-5" /> : <LuLink className="h-5 w-5" />;
            break;
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

const SubjectDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState("");
    const [subCategoryFilter, setSubCategoryFilter] = useState("All");
    const [typeFilter, setTypeFilter] = useState("All");

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    const {
        data: subject,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["subjectDetails", id],
        queryFn: async () => {
            const response = await getSubjectDetails(id);
            if (!response.success) {
                throw new Error(response.message || "Failed to fetch subject details");
            }
            return response.data.data;
        },
        onError: (err) => {
            const errorMsg = err.message.toLowerCase();
            if (errorMsg.includes("token") || errorMsg.includes("unauthorized") || errorMsg.includes("not valid")) {
                localStorage.removeItem('token');
                navigate('/login');
            }
        },
        staleTime: 1000 * 60 * 15,
    });

    const filteredResources = useMemo(() => {
        if (!subject) return {};

        const allCategories = Object.keys(subject.resources);
        const filtered = {};
        const lowerSearch = searchTerm.toLowerCase();

        allCategories.forEach(category => {
            let resources = subject.resources[category];

            if (subCategoryFilter !== "All" && category !== subCategoryFilter) {
                resources = [];
            }

            if (typeFilter !== "All") {
                resources = resources.filter(res => res.resourceType === typeFilter);
            }

            if (lowerSearch) {
                resources = resources.filter(res =>
                    res.title.toLowerCase().includes(lowerSearch)
                );
            }

            filtered[category] = resources;
        });

        return filtered;

    }, [subject, searchTerm, subCategoryFilter, typeFilter]);

    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader />
            </div>
        );
    }

    if (isError) {
        const errorMsg = error.message.toLowerCase();
        if (errorMsg.includes("token") || errorMsg.includes("unauthorized") || errorMsg.includes("not valid")) {
            return null;
        }
        console.error("Error fetching subject details:", error);
        return <MaintenancePage />;
    }

    if (!subject) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader />
            </div>
        );
    }

    const resourceCategories = Object.keys(filteredResources);

    const allSubCategories = subject ? Object.keys(subject.resources) : [];
    const allResourceTypes = subject ?
        [...new Set(Object.values(subject.resources).flat().map(r => r.resourceType))]
        : [];

    return (
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 text-white">

            <Link
                to="/study-material"
                className="mb-6 inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 font-medium text-white transition-colors hover:bg-white/20"
            >
                <LuArrowLeft className="h-4 w-4" />
                Back to Subjects
            </Link>

            <h1 className="mb-8 text-4xl font-bold">{subject.subjectName}</h1>

            <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">

                {/* --- Left Column: Resources --- */}
                <div className="space-y-8 lg:col-span-2">

                    {/* --- FILTER BAR --- */}
                    <div className="space-y-4 rounded-lg border border-white/10 bg-[#0f0f0f] p-4">
                        <SearchBar
                            placeholder="Search resources by title..."
                            value={searchTerm}
                            onChange={setSearchTerm}
                        />
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {/* SubCategory Filter */}
                            <div>
                                <label htmlFor="subCategory" className="block text-sm font-medium text-gray-300 mb-1">Sub-Category</label>
                                <select
                                    id="subCategory"
                                    value={subCategoryFilter}
                                    onChange={(e) => setSubCategoryFilter(e.target.value)}
                                    className="w-full rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 py-2.5 px-3 text-white outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="All" className="bg-gray-800">All Sub-Categories</option>
                                    {allSubCategories.map(cat => (
                                        <option key={cat} value={cat} className="bg-gray-800">{cat}</option>
                                    ))}
                                </select>
                            </div>
                            {/* Type Filter */}
                            <div>
                                <label htmlFor="type" className="block text-sm font-medium text-gray-300 mb-1">Type</label>
                                <select
                                    id="type"
                                    value={typeFilter}
                                    onChange={(e) => setTypeFilter(e.target.value)}
                                    className="w-full rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 py-2.5 px-3 text-white outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="All" className="bg-gray-800">All Types</option>
                                    {allResourceTypes.map(type => (
                                        <option key={type} value={type} className="bg-gray-800">{type}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    {/* END FILTER BAR  */}

                    {/* RESOURCES LIST */}
                    {resourceCategories.map(category => (
                        filteredResources[category].length > 0 && (
                            <section key={category}>
                                <h2 className="mb-4 text-2xl font-semibold text-blue-400">
                                    {category}
                                </h2>
                                <div className="space-y-3">
                                    {filteredResources[category].map(resource => (
                                        <ResourceLink key={resource._id} resource={resource} />
                                    ))}
                                </div>
                            </section>
                        )
                    ))}

                    {/* NO RESOURCES FOUND */}
                    {Object.values(filteredResources).flat().length === 0 && (
                        <div className="text-center py-10 rounded-lg border border-dashed border-white/10">
                            <LuFilter className="mx-auto h-12 w-12 text-gray-500" />
                            <h3 className="mt-2 text-xl font-semibold text-white">No resources found</h3>
                            <p className="mt-1 text-gray-400">Try adjusting your search or filters.</p>
                        </div>
                    )}

                </div>

                {/* --- Right Column: Tips --- */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 rounded-2xl border border-white/10 bg-[#0f0f0f] p-6">
                        <h2 className="mb-4 text-2xl font-semibold text-blue-400">
                            Tips & Advice
                        </h2>
                        {subject.tips.length > 0 ? (
                            <ul className="space-y-4">
                                {subject.tips.map((tip, index) => (
                                    <li key={index} className="flex gap-3">
                                        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-400"></span>
                                        <span className="text-gray-300">{tip}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-400">No tips added yet. Be the first to contribute!</p>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SubjectDetailPage;