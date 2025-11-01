import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getSubjectDetails } from '../services/studyMaterialService';
import Loader from '../components/Loader/Loader';
import MaintenancePage from '../components/Error/MaintenancePage';
import { LuLink, LuFileText, LuYoutube, LuBook, LuArrowLeft } from 'react-icons/lu';

// Reusable Resource Link 
const ResourceLink = ({ resource }) => {
    let icon;
    switch (resource.resourceType) {
        case 'Notes': icon = <LuFileText className="h-5 w-5" />; break;
        case 'Video': icon = <LuYoutube className="h-5 w-5" />; break;
        case 'Book': icon = <LuBook className="h-5 w-5" />; break;
        default: icon = <LuLink className="h-5 w-5" />;
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
            return response.data; // The formatted subject object
        },
        staleTime: 1000 * 60 * 15,
    });

    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader />
            </div>
        );
    }

    if (isError) {
        console.error("Error fetching subject details:", error);
        return <MaintenancePage />;
    }

    // Your backend already groups resources, so we just get the keys
    const resourceCategories = Object.keys(subject.resources);

    return (
        // Centered layout, matching the StudyMaterialPage
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 text-white">
            
            {/* Back Button */}
            <Link
                to="/study-material"
                className="mb-6 inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 font-medium text-white transition-colors hover:bg-white/20"
            >
                <LuArrowLeft className="h-4 w-4" />
                Back to Subjects
            </Link>

            {/* Header */}
            <h1 className="mb-8 text-4xl font-bold">{subject.subjectName}</h1>
            
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                
                {/* --- Left Column: Resources --- */}
                <div className="space-y-8 lg:col-span-2">
                    {resourceCategories.map(category => (
                        // Only render the section if it has resources
                        subject.resources[category].length > 0 && (
                            <section key={category}>
                                <h2 className="mb-4 text-2xl font-semibold text-blue-400">
                                    {category}
                                </h2>
                                <div className="space-y-3">
                                    {subject.resources[category].map(resource => (
                                        <ResourceLink key={resource._id} resource={resource} />
                                    ))}
                                </div>
                            </section>
                        )
                    ))}
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
