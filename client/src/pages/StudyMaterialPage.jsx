import { useState, useEffect } from "react"; 
import { useNavigate } from "react-router-dom"; 
import { useQuery } from "@tanstack/react-query";
import { getSubjects } from "../services/studyMaterialService";
import Loader from "../components/Loader/Loader";
import MaintenancePage from "../components/Error/MaintenancePage";
import { SubjectCard } from "../components/StudyMaterial/SubjectCard";

import { LuBookMarked, LuClipboardCheck, LuBuilding, LuArrowLeft, LuBrain, LuArrowRight } from "react-icons/lu";

// --- Constants ---
const CATEGORIES = {
    PLACEMENTS: "Placements/Internships",
    SEMESTER: "Semester Exams",
};
const DEPARTMENTS = ["CSE", "AI"]; 
// -----------------

// Simple hero component for the page
const StudyMaterialHero = () => (
    <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-blue-400">
                <LuBookMarked className="h-4 w-4" />
                Study Resources
            </div>
            <h1 className="text-foreground text-4xl font-bold md:text-6xl">
                Your Academic &
                <span className="block bg-gradient-to-r from-blue-400 to-blue-400/80 bg-clip-text text-transparent">
                    Career Prep Hub
                </span>
            </h1>
            <p className="mx-auto max-w-3xl text-xl leading-relaxed text-gray-300">
                Find all the resources you need, from semester exams to placement preparation.
            </p>
        </div>
    </div>
);

// Reusable card for category/department selection
const SelectionCard = ({ title, icon, onClick }) => (
    <button
        onClick={onClick}
        className="group w-full max-w-lg rounded-2xl border border-white/10 bg-[#0f0f0f] p-8 text-left transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/50 hover:shadow-elegant focus:outline-none focus:ring-2 focus:ring-blue-400/50"
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
    // State to manage which part of the flow we're in
    const [step, setStep] = useState(1); // 1: Category, 2: Department, 3: Subjects
    const [category, setCategory] = useState(null);
    const [department, setDepartment] = useState(null);
    const navigate = useNavigate(); 

    // Simple auth check on page load
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            // No token? Send 'em to login.
            navigate('/login');
        }
    }, [navigate]); 
    
    // Fetch subjects with React Query
    const {
        data: subjects, // 'subjects' will be the array we need
        isLoading,
        isError,
        error,
    } = useQuery({
       
        queryKey: ["subjects", category, department], // Re-fetches when these change
        queryFn: async () => {
            const response = await getSubjects({ category, department });
            if (!response.success) {
                throw new Error(response.message || "Failed to fetch subjects");
            }
            // --- FIX for the "white screen" bug ---
            // We need the 'data' array *inside* the response, not the whole { message, data } object
            return response.data.data; 
        },
        
        // Only run this query when we're on the final step
        enabled: step === 3 && !!category && !!department,
        staleTime: 1000 * 60 * 15, // Cache for 15 mins
        cacheTime: 1000 * 60 * 60,  // Keep in cache for 1 hour
    });


    // --- Step Navigation Handlers ---

    const handleCategorySelect = (selectedCategory) => {
        setCategory(selectedCategory);
        if (selectedCategory === CATEGORIES.PLACEMENTS) {
            // Placements are "Common", skip straight to subjects
            setDepartment("Common");
            setStep(3);
        } else {
            // Sem exams need a department
            setStep(2);
        }
    };

    const handleDepartmentSelect = (selectedDepartment) => {
        setDepartment(selectedDepartment);
        setStep(3); // Go to subjects list
    };


    const handleBack = () => {
        if (step === 3) {
            // If we came from placements, go to step 1
            // If we came from semester, go to step 2
            if (category === CATEGORIES.SEMESTER) {
                setStep(2);
                setDepartment(null); // Clear selection
            } else {
                setStep(1);
                setCategory(null);
                setDepartment(null);
            }
        } else if (step === 2) {
            // From department choice, go back to category choice
            setStep(1);
            setCategory(null);
        }
    };


    // --- Render Functions for Each Step ---

    // Step 1: Show the two main categories
    const renderStep1_Category = () => (
        <div className="flex flex-wrap justify-center gap-6">
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

    // Step 2: Show department choices (only for Semester Exams)
    const renderStep2_Department = () => (
        <div className="flex flex-wrap justify-center gap-6">
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

    // Step 3: Show the final list of subjects
    const renderStep3_Subjects = () => {
        // Handle loading state
        if (isLoading) {
            return (
                <div className="flex h-64 w-full items-center justify-center">
                    <Loader />
                </div>
            );
        }
        // Handle error state
        if (isError) {
            return <p className="text-center text-red-400">{error.message}</p>;
        }
        // Handle no data (or empty array)
        if (!subjects || subjects.length === 0) {
            return <p className="text-center text-gray-400">No subjects found.</p>;
        }

        // Success: Render the grid of cards
        return (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {subjects.map((subject) => (
                    <SubjectCard key={subject._id} subject={subject} />
                ))}
            </div>
        );
    };

    // Main component render
    return (
        <div>
            <StudyMaterialHero />

            {/* Main content area, centered */}
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                
                {/* Show back button on any step after the first */}
                {step > 1 && (
                    <button
                        onClick={handleBack}
                        className="mb-6 flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 font-medium text-white transition-colors hover:bg-white/20"
                    >
                        <LuArrowLeft className="h-4 w-4" />
                        Back
                    </button>
                )}
                
                {/* Conditionally render the correct step */}
                {step === 1 && renderStep1_Category()}
                {step === 2 && renderStep2_Department()}
                {step === 3 && renderStep3_Subjects()}
            </div>
        </div>
    );
};

export default StudyMaterialPage;

