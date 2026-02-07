import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getSubjectDetails } from '../services/studyMaterialService';
import Loader from '../components/Loader/Loader';
import MaintenancePage from '../components/Error/MaintenancePage';
import { LuLink, LuFileText, LuYoutube, LuBook, LuArrowLeft, LuFilter } from 'react-icons/lu';
import SearchBar from '../components/Alumni/SearchBar.jsx';

// --- Helpers ---

// Fixed: Dynamic grouping instead of hardcoded keys
const groupResources = (resourceList) => {
    if (!Array.isArray(resourceList)) {
        console.warn("Expected resourceList to be an array, got:", resourceList);
        return {};
    }

    const groups = {};

    resourceList.forEach((res) => {
        // Use the backend's subCategory directly, or 'Others' if missing/null
        // Trimming ensures "Notes " and "Notes" are treated as the same group
        const category = res.subCategory ? res.subCategory.trim() : 'Others';

        if (!groups[category]) {
            groups[category] = [];
        }
        groups[category].push(res);
    });

    return groups;
};

const ResourceLink = ({ resource }) => {
    if (!resource) return null;

    let icon;
    // Determine icon based on subCategory or fallback to resourceType
    // Convert to lowercase for safer checking
    const subCatLower = resource.subCategory ? resource.subCategory.toLowerCase() : '';
    
    if (subCatLower.includes('youtube')) {
        icon = <LuYoutube className="h-5 w-5" />;
    } else if (subCatLower.includes('notes') || subCatLower.includes('pyqs')) {
        icon = <LuFileText className="h-5 w-5" />;
    } else if (subCatLower.includes('important')) {
        icon = <LuBook className="h-5 w-5" />;
    } else {
        icon = resource.resourceType === 'PDF' 
            ? <LuFileText className="h-5 w-5" /> 
            : <LuLink className="h-5 w-5" />;
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
                <span className="font-medium text-gray-100">{resource.title || "Untitled Resource"}</span>
            </div>
            <LuLink className="h-4 w-4 text-gray-500 transition-all duration-300 group-hover:text-blue-400" />
        </a>
    );
};

// --- Main Component ---

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
        data: rawSubject,
        isLoading,
        isError,
        error
    } = useQuery({
        queryKey: ["subjectDetails", id],
        queryFn: async () => {
            const response = await getSubjectDetails(id);
            if (!response.success) {
                throw new Error(response.message || "Failed to fetch subject details");
            }
            return response.data.data;
        },
        staleTime: 7200000,
        gcTime: 7200000,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false
    });

    const subject = useMemo(() => {
        if (!rawSubject) return null;
        
        // Debugging: Check if resources exist in the API response
        console.log("Raw Subject Data:", rawSubject); 
        
        return {
            ...rawSubject,
            // Ensure we pass an array, defaulting to empty if undefined
            resources: groupResources(rawSubject.resources || []) 
        };
    }, [rawSubject]);

    const filteredResources = useMemo(() => {
        if (!subject || !subject.resources) return {};

        const allCategories = Object.keys(subject.resources);
        const filtered = {};
        const lowerSearch = searchTerm ? searchTerm.toLowerCase() : "";

        allCategories.forEach(category => {
            let resources = subject.resources[category] || [];

            // 1. Filter by SubCategory (Dropdown)
            if (subCategoryFilter !== "All" && category !== subCategoryFilter) {
                resources = [];
            }

            // 2. Filter by Type (Dropdown)
            if (typeFilter !== "All") {
                resources = resources.filter(res => res.resourceType === typeFilter);
            }

            // 3. Filter by Search Term
            if (lowerSearch) {
                resources = resources.filter(res =>
                    res.title && res.title.toLowerCase().includes(lowerSearch)
                );
            }

            filtered[category] = resources;
        });
        return filtered;
    }, [subject, searchTerm, subCategoryFilter, typeFilter]);

    if (isLoading) return <div className="flex h-screen w-full items-center justify-center"><Loader /></div>;
    
    if (isError) {
        if (error?.message?.toLowerCase().includes("token")) return null;
        return <MaintenancePage />;
    }

    if (!subject) return <div className="flex h-screen w-full items-center justify-center"><Loader /></div>;

    const resourceCategories = Object.keys(filteredResources);
    
    // Helpers for dropdowns
    const allSubCategories = subject.resources ? Object.keys(subject.resources) : [];
    
    // Safely extract resource types
    const allResourceTypes = rawSubject && Array.isArray(rawSubject.resources)
        ? [...new Set(rawSubject.resources.map(r => r.resourceType).filter(Boolean))]
        : [];

    const hasAnyResources = Object.values(filteredResources).flat().length > 0;

    return (
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 text-white">
            <Link to="/study-material" className="mb-6 inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 font-medium text-white transition-colors hover:bg-white/20">
                <LuArrowLeft className="h-4 w-4" /> Back to Subjects
            </Link>

            <h1 className="mb-8 text-4xl font-bold">{subject.subjectName}</h1>

            <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                <div className="space-y-8 lg:col-span-2">
                    {/* Filters */}
                    <div className="space-y-4 rounded-lg border border-white/10 bg-[#0f0f0f] p-4">
                        <SearchBar placeholder="Search resources..." value={searchTerm} onChange={setSearchTerm} />
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Sub-Category</label>
                                <select 
                                    value={subCategoryFilter}
                                    onChange={(e) => setSubCategoryFilter(e.target.value)}
                                    className="w-full rounded-lg bg-white/10 border border-white/20 py-2.5 px-3 text-white focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="All" className="bg-gray-800">All</option>
                                    {allSubCategories.map(cat => <option key={cat} value={cat} className="bg-gray-800">{cat}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Type</label>
                                <select 
                                    value={typeFilter}
                                    onChange={(e) => setTypeFilter(e.target.value)}
                                    className="w-full rounded-lg bg-white/10 border border-white/20 py-2.5 px-3 text-white focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="All" className="bg-gray-800">All</option>
                                    {allResourceTypes.map(type => <option key={type} value={type} className="bg-gray-800">{type}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Resources List */}
                    {resourceCategories.map(category => (
                        filteredResources[category] && filteredResources[category].length > 0 && (
                            <section key={category}>
                                <h2 className="mb-4 text-2xl font-semibold text-blue-400">{category}</h2>
                                <div className="space-y-3">
                                    {filteredResources[category].map(resource => (
                                        <ResourceLink key={resource._id} resource={resource} />
                                    ))}
                                </div>
                            </section>
                        )
                    ))}

                    {!hasAnyResources && (
                        <div className="text-center py-10 rounded-lg border border-dashed border-white/10">
                            <LuFilter className="mx-auto h-12 w-12 text-gray-500" />
                            <h3 className="mt-2 text-xl font-semibold text-white">No resources found</h3>
                            <p className="text-gray-400">Try adjusting your filters or search term.</p>
                        </div>
                    )}
                </div>

                {/* Sidebar Tips */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 rounded-2xl border border-white/10 bg-[#0f0f0f] p-6">
                        <h2 className="mb-4 text-2xl font-semibold text-blue-400">Tips & Advice</h2>
                        <ul className="space-y-4">
                            {subject.tips && subject.tips.length > 0 ? subject.tips.map((tip, index) => (
                                <li key={index} className="flex gap-3">
                                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-400 shrink-0"></span>
                                    <span className="text-gray-300">{tip}</span>
                                </li>
                            )) : <p className="text-gray-400">No tips added yet.</p>}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubjectDetailPage;