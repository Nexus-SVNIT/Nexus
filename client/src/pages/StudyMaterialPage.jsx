import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getSubjects } from "../services/studyMaterialService";
import Loader from "../components/Loader/Loader";
import MaintenancePage from "../components/Error/MaintenancePage";
// Make sure this path is correct based on your project structure
import { SubjectCard } from "../components/StudyMaterial/SubjectCard"; 

import { LuBookMarked, LuClipboardCheck, LuBuilding, LuArrowLeft, LuBrain, LuArrowRight } from "react-icons/lu";

const CATEGORIES = {
    PLACEMENTS: "Placements/Internships",
    SEMESTER: "Semester Exams",
};
const DEPARTMENTS = ["CSE", "AI"];

// --- HERO SECTION ---
const StudyMaterialHero = () => (
    <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-400">
                <LuBookMarked className="h-4 w-4" />
                Study Resources
            </div>
            <h1 className="text-white text-4xl font-bold md:text-6xl">
                Ace Your Academic &
                <span className="block bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                    Placement Prep
                </span>
            </h1>
            <p className="mx-auto max-w-3xl text-xl leading-relaxed text-gray-300">
                Find all the resources you need, from semester exams to placement preparation.
            </p>
        </div>
    </div>
);

// --- SELECTION CARD COMPONENT ---
const SelectionCard = ({ title, icon, onClick }) => (
    <button
        onClick={onClick}
        className="group w-full max-w-lg rounded-2xl border border-white/10 bg-[#0f0f0f] p-8 text-left transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/50 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400/50"
    >
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-white/10 text-blue-400 transition-all duration-300 group-hover:bg-blue-400 group-hover:text-white">
                    {icon}
                </div>
                <h3 className="text-xl font-semibold text-white">{title}</h3>
            </div>
            <LuArrowRight className="h-5 w-5 text-gray-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-blue-400" />
        </div>
    </button>
);

const StudyMaterialPage = () => {
    const [step, setStep] = useState(1);
    const [category, setCategory] = useState(null);
    const [department, setDepartment] = useState(null);
    const navigate = useNavigate();

    // 1. Initial Auth Check
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    // 2. Data Fetching
    const {
        data: subjects,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["subjects", category, department],
        queryFn: async () => {
            const response = await getSubjects({ category, department });
            // Ensure your service returns { success: true, data: { data: [...] } }
            if (!response.success) {
                throw new Error(response.message || "Failed to fetch subjects");
            }
            return response.data.data;
        },
        enabled: step === 3 && !!category && !!department,
        staleTime: 1000 * 60 * 15, // 15 minutes
        // cacheTime is renamed to gcTime in v5, keeping cacheTime for v4 compatibility
        cacheTime: 1000 * 60 * 60, 
    });

    // 3. Handle Auth Errors (Replaces onError for React Query v5 compatibility)
    useEffect(() => {
        if (isError && error) {
            const errorMsg = error.message.toLowerCase();
            if (errorMsg.includes("token") || errorMsg.includes("unauthorized") || errorMsg.includes("not valid")) {
                localStorage.removeItem('token');
                navigate('/login');
            }
        }
    }, [isError, error, navigate]);

    // --- Handlers ---
    const handleCategorySelect = (selectedCategory) => {
        setCategory(selectedCategory);
        if (selectedCategory === CATEGORIES.PLACEMENTS) {
            setDepartment("Common");
            setStep(3);
        } else {
            setStep(2);
        }
    };

    const handleDepartmentSelect = (selectedDepartment) => {
        setDepartment(selectedDepartment);
        setStep(3);
    };

    const handleBack = () => {
        if (step === 3) {
            if (category === CATEGORIES.SEMESTER) {
                setStep(2);
                setDepartment(null);
            } else {
                setStep(1);
                setCategory(null);
                setDepartment(null);
            }
        } else if (step === 2) {
            setStep(1);
            setCategory(null);
        }
    };

    // --- Render Steps ---
    const renderStep1_Category = () => (
        <div className="flex flex-wrap justify-center gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SelectionCard
                title="Placements/Internships"
                icon={<LuClipboardCheck className="h-6 w-6" />}
                onClick={() => handleCategorySelect(CATEGORIES.PLACEMENTS)}
            />
            <SelectionCard
                title="Semester Exams"
                icon={<LuBuilding className="h-6 w-6" />}
                onClick={() => handleCategorySelect(CATEGORIES.SEMESTER)}
            />
        </div>
    );

    const renderStep2_Department = () => (
        <div className="flex flex-wrap justify-center gap-6 animate-in fade-in slide-in-from-right-8 duration-500">
            {DEPARTMENTS.map((dept) => (
                <SelectionCard
                    key={dept}
                    title={dept}
                    icon={<LuBrain className="h-6 w-6" />}
                    onClick={() => handleDepartmentSelect(dept)}
                />
            ))}
        </div>
    );

    const renderStep3_Subjects = () => {
        if (isLoading) {
            return (
                <div className="flex h-64 w-full items-center justify-center">
                    <Loader />
                </div>
            );
        }

        if (isError) {
            // Return null if it's an auth error (useEffect handles navigation)
            const errorMsg = error?.message?.toLowerCase() || "";
            if (errorMsg.includes("token") || errorMsg.includes("unauthorized")) {
                return null;
            }
            // Use the imported MaintenancePage for other errors
            return <MaintenancePage />;
        }

        if (!subjects || subjects.length === 0) {
            return (
                <div className="text-center py-12 bg-[#0f0f0f] rounded-xl border border-white/10">
                    <LuBrain className="mx-auto h-12 w-12 text-gray-600 mb-3" />
                    <p className="text-gray-400 text-lg">No subjects found for this selection.</p>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {subjects.map((subject) => (
                    <SubjectCard key={subject._id} subject={subject} />
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <StudyMaterialHero />
            
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                {step > 1 && (
                    <button
                        onClick={handleBack}
                        className="mb-8 flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-white/20 hover:gap-3"
                    >
                        <LuArrowLeft className="h-4 w-4" />
                        Back to {step === 3 && category === CATEGORIES.SEMESTER ? "Departments" : "Categories"}
                    </button>
                )}
                
                {step === 1 && renderStep1_Category()}
                {step === 2 && renderStep2_Department()}
                {step === 3 && renderStep3_Subjects()}
            </div>
        </div>
    );
};

export default StudyMaterialPage;