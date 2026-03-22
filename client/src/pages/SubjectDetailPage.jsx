import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getSubjectDetails } from '../services/studyMaterialService';
import Loader from '../components/Loader/Loader';
import MaintenancePage from '../components/Error/MaintenancePage';
import HeadTags from '../components/HeadTags/HeadTags';
import { LuLink, LuFileText, LuYoutube, LuBook, LuArrowLeft, LuFilter, LuX, LuSearch, LuLightbulb, LuExternalLink } from 'react-icons/lu';


/* ─── Resource Type Badge ─── */
const ResourceBadge = ({ type }) => {
    const config = {
        PDF: { bg: "bg-red-500/15", text: "text-red-400", border: "border-red-500/20" },
        Link: { bg: "bg-blue-500/15", text: "text-blue-400", border: "border-blue-500/20" },
        YouTube: { bg: "bg-rose-500/15", text: "text-rose-400", border: "border-rose-500/20" },
    };
    const style = config[type] || config.Link;
    return (
        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${style.bg} ${style.text} ${style.border}`}>
            {type}
        </span>
    );
};


/* ─── Resource Link Card ─── */
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
            className="group flex items-center justify-between gap-4 rounded-xl border border-zinc-700/50 bg-zinc-900/60 p-4 transition-all duration-300 hover:border-blue-500/30 hover:bg-zinc-800/60 hover:shadow-lg hover:shadow-blue-500/5"
        >
            <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-zinc-700/50 bg-zinc-800 text-blue-400 transition-colors group-hover:border-blue-500/30 group-hover:bg-blue-500/10">
                    {icon}
                </div>
                <div className="min-w-0 flex-1">
                    <span className="block truncate font-medium text-gray-200 group-hover:text-white transition-colors">{resource.title}</span>
                </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
                <ResourceBadge type={resource.resourceType} />
                <LuExternalLink className="h-4 w-4 text-gray-600 transition-all duration-300 group-hover:text-blue-400" />
            </div>
        </a>
    );
};


/* ─── Filter Pill ─── */
const FilterPill = ({ label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all duration-200 ${
            active
                ? "border-blue-500/50 bg-blue-500/15 text-blue-400"
                : "border-zinc-700/50 bg-zinc-800/50 text-gray-400 hover:border-zinc-600 hover:text-gray-300"
        }`}
    >
        {label}
    </button>
);


/* ─── Category Section Header ─── */
const CategoryHeader = ({ name, count }) => (
    <div className="flex items-center gap-3 mb-4">
        <h2 className="text-xl font-semibold text-white">{name}</h2>
        <span className="rounded-full bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 text-xs font-medium text-blue-400">
            {count} resource{count !== 1 ? "s" : ""}
        </span>
    </div>
);


/* ─── Main Page ─── */
const SubjectDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate(); 
    const location = useLocation();
    
    const backSearch = location.state?.search || "";

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

    const totalFiltered = Object.values(filteredResources).flat().length;
    const hasActiveFilters = searchTerm || subCategoryFilter !== "All" || typeFilter !== "All";

    const clearAllFilters = () => {
        setSearchTerm("");
        setSubCategoryFilter("All");
        setTypeFilter("All");
    };

    return (
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 text-white">
            <HeadTags
                title={`${subject.subjectName} | Study Material - Nexus`}
                description={`Study resources for ${subject.subjectName}`}
            />

            {/* Back & Title */}
            <Link
                to={`/study-material${backSearch}`}
                className="mb-6 inline-flex items-center gap-2 rounded-lg border border-zinc-700/50 bg-zinc-800/50 px-4 py-2 text-sm font-medium text-gray-300 transition-all duration-200 hover:border-zinc-600 hover:bg-zinc-800 hover:text-white"
            >
                <LuArrowLeft className="h-4 w-4" />
                Back to Subjects
            </Link>

            <h1 className="mb-2 text-3xl font-bold md:text-4xl">{subject.subjectName}</h1>
            <p className="mb-8 text-gray-500">
                {Object.values(subject.resources).flat().length} resources across {allSubCategories.length} categories
            </p>
            
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
                
                {/* ─── Left Column: Resources ─── */}
                <div className="space-y-8 lg:col-span-2">
                    
                    {/* ─── Search & Filters ─── */}
                    <div className="space-y-4 rounded-xl border border-zinc-700/50 bg-zinc-900/60 p-5">
                        {/* Search Input */}
                        <div className="relative">
                            <LuSearch className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search resources by title..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full rounded-lg border border-zinc-700/50 bg-zinc-800/50 py-2.5 pl-10 pr-4 text-sm text-gray-200 outline-none placeholder-gray-600 transition-colors focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
                            />
                        </div>

                        {/* Filter Pills */}
                        <div className="space-y-3">
                            {/* Sub-Category pills */}
                            <div>
                                <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-gray-500">Category</span>
                                <div className="flex flex-wrap gap-2">
                                    <FilterPill label="All" active={subCategoryFilter === "All"} onClick={() => setSubCategoryFilter("All")} />
                                    {allSubCategories.map(cat => (
                                        <FilterPill key={cat} label={cat} active={subCategoryFilter === cat} onClick={() => setSubCategoryFilter(cat)} />
                                    ))}
                                </div>
                            </div>
                            {/* Type pills */}
                            {allResourceTypes.length > 1 && (
                                <div>
                                    <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-gray-500">Type</span>
                                    <div className="flex flex-wrap gap-2">
                                        <FilterPill label="All" active={typeFilter === "All"} onClick={() => setTypeFilter("All")} />
                                        {allResourceTypes.map(type => (
                                            <FilterPill key={type} label={type} active={typeFilter === type} onClick={() => setTypeFilter(type)} />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Active Filter Summary */}
                        {hasActiveFilters && (
                            <div className="flex items-center justify-between border-t border-zinc-700/30 pt-3">
                                <span className="text-sm text-gray-500">
                                    {totalFiltered} result{totalFiltered !== 1 ? "s" : ""} found
                                </span>
                                <button 
                                    onClick={clearAllFilters}
                                    className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
                                >
                                    <LuX className="h-3.5 w-3.5" />
                                    Clear filters
                                </button>
                            </div>
                        )}
                    </div>

                    {/* ─── Resources List ─── */}
                    {resourceCategories.map(category => (
                        filteredResources[category].length > 0 && (
                            <section key={category} className="animate-fadeIn">
                                <CategoryHeader name={category} count={filteredResources[category].length} />
                                <div className="space-y-3">
                                    {filteredResources[category].map(resource => (
                                        <ResourceLink key={resource._id} resource={resource} />
                                    ))}
                                </div>
                            </section>
                        )
                    ))}
                    
                    {/* Empty State */}
                    {totalFiltered === 0 && (
                        <div className="animate-fadeIn rounded-xl border border-dashed border-zinc-700/50 p-12 text-center">
                            <LuFilter className="mx-auto h-12 w-12 text-gray-600" />
                            <h3 className="mt-4 text-lg font-medium text-gray-300">No resources found</h3>
                            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filters.</p>
                            {hasActiveFilters && (
                                <button 
                                    onClick={clearAllFilters}
                                    className="mt-4 rounded-lg border border-zinc-700/50 bg-zinc-800/50 px-4 py-2 text-sm text-gray-400 hover:bg-zinc-800 hover:text-white transition-colors"
                                >
                                    Clear all filters
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* ─── Right Column: Tips ─── */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 rounded-xl border border-zinc-700/50 bg-zinc-900/60 p-6">
                        <div className="mb-5 flex items-center gap-2">
                            <LuLightbulb className="h-5 w-5 text-amber-400" />
                            <h2 className="text-lg font-semibold text-white">Tips & Advice</h2>
                        </div>
                        {subject.tips.length > 0 ? (
                            <ul className="space-y-4">
                                {subject.tips.map((tip, index) => (
                                    <li key={index} className="flex gap-3">
                                        <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-xs font-medium text-blue-400">
                                            {index + 1}
                                        </span>
                                        <span className="text-sm leading-relaxed text-gray-400">{tip}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-500">No tips added yet. Be the first to contribute!</p>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SubjectDetailPage;
