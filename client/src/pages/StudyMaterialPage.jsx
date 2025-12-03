// src/pages/StudyMaterialPage.jsx
import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Fuse from "fuse.js";

import { getSubjects, getAllSubjects } from "../services/studyMaterialService";

import Loader from "../components/Loader/Loader";
import { SubjectCard } from "../components/StudyMaterial/SubjectCard";
import {
  LuBookMarked,
  LuClipboardCheck,
  LuBuilding,
  LuArrowLeft,
  LuBrain,
  LuArrowRight,
} from "react-icons/lu";

// Constants
const CATEGORIES = {
  PLACEMENTS: "Placements/Internships",
  SEMESTER: "Semester Exams",
};

const DEPARTMENTS = ["CSE", "AI"];

// Hero Section
const StudyMaterialHero = () => (
  <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
    <div className="space-y-6 text-center">
      <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-blue-400">
        <LuBookMarked className="h-4 w-4" />
        Study Resources
      </div>
      <h1 className="text-foreground text-4xl font-bold md:text-6xl">
        Ace Your Academic &
        <span className="block bg-gradient-to-r from-blue-400 to-blue-400/80 bg-clip-text text-transparent">
          Placement Prep
        </span>
      </h1>
      <p className="mx-auto max-w-3xl text-xl leading-relaxed text-gray-300">
        Find all the resources you need, from semester exams to placement preparation.
      </p>
    </div>
  </div>
);

// Category/Department Selection Card
const SelectionCard = ({ title, icon, onClick }) => (
  <button
    onClick={onClick}
    className="group w-full max-w-lg rounded-2xl border border-white/10 bg-[#0f0f0f] p-8 text-left transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/50 hover:shadow-elegant focus:outline-none focus:ring-2 focus:ring-blue-400/50"
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-white/10 text-blue-400 group-hover:bg-blue-400 group-hover:text-white transition-all">
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-white">{title}</h3>
      </div>
      <LuArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-400 transition-transform group-hover:translate-x-1" />
    </div>
  </button>
);

const StudyMaterialPage = () => {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState(null);
  const [department, setDepartment] = useState(null);
  const navigate = useNavigate();

  // Auth check
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  // Fetch subjects
  const {
    data: subjects,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["subjects", category, department],
    enabled: step === 3 && !!category && !!department,
    staleTime: 1000 * 60 * 15, // 15 minutes
    ...COMMON_QUERY_OPTIONS,

    queryFn: async () => {
      const response = await getSubjects({ category, department });
      if (!response.success)
        throw new Error(response.message || "Failed to fetch subjects");
      return response.data.data || response.data; // backend compatibility
    },
    enabled: step === 3 && !!category && !!department,
    staleTime: 1000 * 60 * 15,
    cacheTime: 1000 * 60 * 60,
    onError: (err) => {
      const msg = err.message.toLowerCase();
      if (
        msg.includes("token") ||
        msg.includes("unauthorized") ||
        msg.includes("not valid")
      ) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    },
  });

  // Step navigation logic
  const handleCategorySelect = (selectedCategory) => {
    setCategory(selectedCategory);

    if (selectedCategory === CATEGORIES.PLACEMENTS) {
      setDepartment("Common");
      setStep(3);
    } else {
      setStep(2);
    }
  };

  const handleDepartmentSelect = (dept) => {
    setDepartment(dept);
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

  // Step 1: Category selection
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

  // Step 2: Department selection
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

  // Step 3: Subjects
  const renderStep3_Subjects = () => {
    if (isLoading)
      return (
        <div className="flex h-64 w-full items-center justify-center">
          <Loader />
        </div>
      );

    if (isError) return <MaintenancePage />;

    if (!subjects || subjects.length === 0)
      return <p className="text-center text-gray-400">No subjects found.</p>;

    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {subjects.map((subject) => (
          <SubjectCard key={subject._id} subject={subject} />
        ))}
      </div>
    );
  };

  // Render
  return (
    <div>
      <StudyMaterialHero />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {step > 1 && (
          <button
            onClick={handleBack}
            className="mb-6 flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 font-medium text-white hover:bg-white/20"
          >
            <LuArrowLeft className="h-4 w-4" />
            Back
          </button>
        )}

        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </div>
    </div>
  );
};

export default StudyMaterialPage;
