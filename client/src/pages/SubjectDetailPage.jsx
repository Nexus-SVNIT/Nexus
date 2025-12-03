import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getSubjectDetails } from '../services/studyMaterialService';

import Loader from '../components/Loader/Loader';
import MaintenancePage from '../components/Error/MaintenancePage';
import SearchBar from '../components/Alumni/SearchBar.jsx'; 

import { 
    LuLink, 
    LuFileText, 
    LuYoutube, 
    LuBook, 
    LuArrowLeft, 
    LuFilter 
} from 'react-icons/lu';

// ----------------------------------------------
// RESOURCE LINK COMPONENT
// ----------------------------------------------
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
                <span className="font-medium text-gray-100">{resource.title}</span>
            </div>
            <LuLink className="h-4 w-4 text-gray-500 transition-all duration-300 group-hover:text-blue-400" />
        </a>
    );
};

// ----------------------------------------------
// MAIN COMPONENT
 // ---------------------------------------------
const SubjectDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState("");
    const [subCategoryFilter, setSubCategoryFilter] = useState("All");
    const [typeFilter, setTypeFilter] = useState("All");

    // ------------------------------------------
    // LOGIN CHECK
    // ------------------------------------------
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) navigate("/login");
    }, [navigate]);

    // ------------------------------------------
    // FETCH SUBJECT DETAILS
    // ------------------------------------------
    const { data: subject, isLoading, isError, error } = useQuery({
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
        },
    });

    // ------------------------------------------
    // FILTER RESOURCES (Client-side)
    // ------------------------------------------
    const filteredResources = useMemo(() => {
        if (!subject) return {};

        const result = {};
        const searchLower = searchTerm.toLowerCase();

        for (const category of Object.keys(subject.resources)) {
            let list = subject.resources[category];

            if (subCategoryFilter !== "All" && category !== subCategoryFilter) {
                list = [];
            }

            if (typeFilter !== "All") {
                list = list.filter(r => r.resourceType === typeFilter);
            }

            if (searchLower) {
                list = list.filter(r => 
                    r.title.toLowerCase().includes(searchLower)
                );
            }

            result[category] = list;
        }

        return result;
    }, [subject, searchTerm, subCategoryFilter, typeFilter]);

    // ------------------------------------------
    // LOADING + ERROR STATES
    // ------------------------------------------
    if (isLoading) {
        return <div className="flex h-screen items-center justify-center"><Loader /></div>;
    }

    if (isError) {
        const msg = error.message.toLowerCase();
        if (msg.includes("token")) return null;
        return <MaintenancePage />;
    }

    if (!subject) return null;

    const allSubCategories = Object.keys(subject.resources);
    const allTypes = [...new Set(Object.values(subject.resources).flat().map(r => r.resourceType))];

    const hasNoResults = Object.values(filteredResources).flat().length === 0;

    // ------------------------------------------
    // RENDER UI
    // ------------------------------------------
    return (
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 text-white">

            {/* BACK BUTTON */}
            <Link
                to="/study-material"
                className="mb-6 inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 font-medium hover:bg-white/20"
            >
                <LuArrowLeft className="h-4 w-4" />
                Back to Subjects
            </Link>

            <h1 className="mb-8 text-4xl font-bold">{subject.subjectName}</h1>

            <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">

                {/* LEFT COLUMN */}
                <div className="lg:col-span-2 space-y-8">

                    {/* FILTER BAR */}
                    <div className="rounded-lg border border-white/10 bg-[#0f0f0f] p-4 space-y-4">
                        <SearchBar 
                            placeholder="Search resources by title..."
                            value={searchTerm}
                            onChange={setSearchTerm}
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                            {/* SUBCATEGORY FILTER */}
                            <div>
                                <label className="block text-sm mb-1 text-gray-300">Sub-Category</label>
                                <select
                                    value={subCategoryFilter}
                                    onChange={(e) => setSubCategoryFilter(e.target.value)}
                                    className="w-full bg-white/10 border border-white/20 rounded-lg py-2.5 px-3 text-white focus:ring-blue-500"
                                >
                                    <option value="All" className="bg-gray-800">All Sub-Categories</option>
                                    {allSubCategories.map(cat => (
                                        <option key={cat} value={cat} className="bg-gray-800">{cat}</option>
                                    ))}
                                </select>
                            </div>

                            {/* TYPE FILTER */}
                            <div>
                                <label className="block text-sm mb-1 text-gray-300">Type</label>
                                <select
                                    value={typeFilter}
                                    onChange={(e) => setTypeFilter(e.target.value)}
                                    className="w-full bg-white/10 border border-white/20 rounded-lg py-2.5 px-3 text-white focus:ring-blue-500"
                                >
                                    <option value="All" className="bg-gray-800">All Types</option>
                                    {allTypes.map(type => (
                                        <option key={type} value={type} className="bg-gray-800">{type}</option>
                                    ))}
                                </select>
                            </div>

                        </div>
                    </div>

                    {/* RESOURCES LIST */}
                    {Object.keys(filteredResources).map(category =>
                        filteredResources[category].length > 0 && (
                            <section key={category}>
                                <h2 className="text-2xl text-blue-400 font-semibold mb-4">{category}</h2>
                                <div className="space-y-3">
                                    {filteredResources[category].map(res => (
                                        <ResourceLink key={res._id} resource={res} />
                                    ))}
                                </div>
                            </section>
                        )
                    )}

                    {/* EMPTY STATE */}
                    {hasNoResults && (
                        <div className="text-center py-10 border border-dashed border-white/10 rounded-lg">
                            <LuFilter className="mx-auto h-12 w-12 text-gray-500" />
                            <h3 className="text-xl font-semibold mt-2">No resources found</h3>
                            <p className="text-gray-400">Try adjusting your filters or search query.</p>
                        </div>
                    )}
                </div>

                {/* RIGHT COLUMN — TIPS */}
                <div>
                    <div className="sticky top-24 bg-[#0f0f0f] border border-white/10 rounded-2xl p-6">
                        <h2 className="text-2xl font-semibold text-blue-400 mb-4">Tips & Advice</h2>

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
                            <p className="text-gray-400">No tips added yet.</p>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SubjectDetailPage;
