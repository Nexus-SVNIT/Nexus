import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getSubjects } from "../services/studyMaterialService";
import Loader from "../components/Loader/Loader";
import { SubjectCard } from "../components/StudyMaterial/SubjectCard";
import HeadTags from "../components/HeadTags/HeadTags";

import { 
  LuBookMarked, LuClipboardCheck, LuBuilding, LuArrowLeft, 
  LuBrain, LuArrowRight, LuChevronRight, LuGraduationCap,
  LuBookOpen, LuSearch
} from "react-icons/lu";


const CATEGORIES = {
    PLACEMENTS: "Placements/Internships",
    SEMESTER: "Semester Exams",
};
const DEPARTMENTS = ["CSE", "AI"];


/* ─── Breadcrumb Navigation ─── */
const Breadcrumb = ({ step, category, department, onNavigate }) => {
    const crumbs = [
        { label: "Study Material", step: 0 },
    ];
    if (step >= 1) crumbs.push({ label: "Category", step: 1 });
    if (step >= 2 && category === CATEGORIES.SEMESTER) crumbs.push({ label: "Department", step: 2 });
    if (step >= 3) crumbs.push({ label: category === CATEGORIES.PLACEMENTS ? "Placement Resources" : `${department} Subjects`, step: 3 });

    return (
        <nav className="mb-8 flex items-center gap-2 text-sm">
            {crumbs.map((crumb, i) => (
                <div key={crumb.step} className="flex items-center gap-2">
                    {i > 0 && <LuChevronRight className="h-3.5 w-3.5 text-gray-600" />}
                    <button
                        onClick={() => crumb.step < step ? onNavigate(crumb.step) : null}
                        className={`rounded-md px-2.5 py-1 transition-all duration-200 ${
                            crumb.step === step 
                                ? "bg-blue-500/15 font-medium text-blue-400" 
                                : crumb.step < step
                                    ? "text-gray-400 hover:text-blue-400 hover:bg-white/5 cursor-pointer"
                                    : "text-gray-500"
                        }`}
                    >
                        {crumb.label}
                    </button>
                </div>
            ))}
        </nav>
    );
};


/* ─── Hero Section ─── */
const StudyMaterialHero = () => (
    <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="space-y-5 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-400">
                <LuBookMarked className="h-4 w-4" />
                Study Resources
            </div>
            <h1 className="text-4xl font-bold text-white md:text-5xl lg:text-6xl">
                Ace Your Academic &
                <span className="block bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                    Placement Prep
                </span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-400">
                Curated resources for semester exams and placement/internship preparation — made by students, for students.
            </p>
        </div>
    </div>
);


/* ─── Category Selection Card ─── */
const SelectionCard = ({ title, description, icon, onClick, accentColor = "blue" }) => (
    <button
        onClick={onClick}
        className="group relative w-full max-w-md overflow-hidden rounded-2xl border border-zinc-700/50 bg-zinc-900/80 p-8 text-left transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-xl hover:shadow-blue-500/5 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
    >
        {/* Subtle gradient glow on hover */}
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-500/5 transition-all duration-500 group-hover:bg-blue-500/10 group-hover:scale-150" />
        
        <div className="relative flex items-start gap-5">
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl border border-zinc-700/50 bg-zinc-800 text-blue-400 transition-all duration-300 group-hover:border-blue-500/40 group-hover:bg-blue-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-blue-500/20">
                {icon}
            </div>
            <div className="flex-1">
                <h3 className="text-xl font-semibold text-white">{title}</h3>
                {description && (
                    <p className="mt-1.5 text-sm leading-relaxed text-gray-500">{description}</p>
                )}
            </div>
            <LuArrowRight className="mt-1 h-5 w-5 flex-shrink-0 text-gray-600 transition-all duration-300 group-hover:translate-x-1 group-hover:text-blue-400" />
        </div>
    </button>
);


/* ─── Step Header ─── */
const StepHeader = ({ title, subtitle }) => (
    <div className="mb-8 text-center">
        <h2 className="text-2xl font-semibold text-white">{title}</h2>
        {subtitle && <p className="mt-2 text-gray-500">{subtitle}</p>}
    </div>
);


/* ─── Main Page ─── */
const StudyMaterialPage = () => {
    const [step, setStep] = useState(1);
    const [category, setCategory] = useState(null);
    const [department, setDepartment] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    const {
        data: subjects,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["subjects", category, department],
        queryFn: async () => {
            const response = await getSubjects({ category, department });
            if (!response.success) {
                throw new Error(response.message || "Failed to fetch subjects");
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
        enabled: step === 3 && !!category && !!department,
        staleTime: 1000 * 60 * 15,
        cacheTime: 1000 * 60 * 60,
    });


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

    const handleBreadcrumbNavigate = (targetStep) => {
        if (targetStep === 0 || targetStep === 1) {
            setStep(1);
            setCategory(null);
            setDepartment(null);
        } else if (targetStep === 2) {
            setStep(2);
            setDepartment(null);
        }
    };


    const renderStep1_Category = () => (
        <div className="animate-fadeIn">
            <StepHeader 
                title="What are you preparing for?" 
                subtitle="Choose your study category to get started"
            />
            <div className="flex flex-wrap justify-center gap-6">
                <SelectionCard
                    title="Placements & Internships"
                    description="DSA, system design, aptitude, and interview preparation resources"
                    icon={<LuClipboardCheck className="h-6 w-6" />}
                    onClick={() => handleCategorySelect(CATEGORIES.PLACEMENTS)}
                />
                <SelectionCard
                    title="Semester Exams"
                    description="Subject-wise notes, PYQs, and important topics for your exams"
                    icon={<LuGraduationCap className="h-6 w-6" />}
                    onClick={() => handleCategorySelect(CATEGORIES.SEMESTER)}
                />
            </div>
        </div>
    );

    const renderStep2_Department = () => (
        <div className="animate-fadeIn">
            <StepHeader 
                title="Select your department" 
                subtitle="Resources are organized by department curriculum"
            />
            <div className="flex flex-wrap justify-center gap-6">
                {DEPARTMENTS.map((dept) => (
                    <SelectionCard
                        key={dept}
                        title={dept === "CSE" ? "Computer Science & Engineering" : "Artificial Intelligence"}
                        description={`Semester-wise study material for ${dept} students`}
                        icon={<LuBrain className="h-6 w-6" />}
                        onClick={() => handleDepartmentSelect(dept)}
                    />
                ))}
            </div>
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
            const errorMsg = error.message.toLowerCase();
            if (errorMsg.includes("token") || errorMsg.includes("unauthorized") || errorMsg.includes("not valid")) {
                return null; 
            }
            return (
                <div className="animate-fadeIn rounded-xl border border-red-500/20 bg-red-500/5 p-8 text-center">
                    <p className="text-red-400">{error.message}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="mt-4 rounded-lg bg-red-500/20 px-4 py-2 text-sm text-red-400 hover:bg-red-500/30 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            );
        }

        if (!subjects || subjects.length === 0) {
            return (
                <div className="animate-fadeIn rounded-xl border border-dashed border-zinc-700/50 p-12 text-center">
                    <LuBookOpen className="mx-auto h-12 w-12 text-gray-600" />
                    <h3 className="mt-4 text-lg font-medium text-gray-300">No subjects found</h3>
                    <p className="mt-1 text-sm text-gray-500">Study materials for this section haven't been added yet.</p>
                </div>
            );
        }

        return (
            <div className="animate-fadeIn">
                <div className="mb-6 flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                        {subjects.length} subject{subjects.length !== 1 ? "s" : ""} available
                    </p>
                </div>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {subjects.map((subject) => (
                        <SubjectCard key={subject._id} subject={subject} />
                    ))}
                </div>
            </div>
        );
    };


    return (
        <div>
            <HeadTags
                title="Study Material | Nexus - NIT Surat"
                description="Access curated study material for semester exams and placement preparation."
            />
            <StudyMaterialHero />
            <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
                <Breadcrumb 
                    step={step} 
                    category={category} 
                    department={department} 
                    onNavigate={handleBreadcrumbNavigate}
                />
                
                {step > 1 && (
                    <button
                        onClick={handleBack}
                        className="mb-8 flex items-center gap-2 rounded-lg border border-zinc-700/50 bg-zinc-800/50 px-4 py-2 text-sm font-medium text-gray-300 transition-all duration-200 hover:border-zinc-600 hover:bg-zinc-800 hover:text-white"
                    >
                        <LuArrowLeft className="h-4 w-4" />
                        Back
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
