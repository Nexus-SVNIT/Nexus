// src/pages/StudyMaterialPage.jsx
import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Fuse from "fuse.js";

import { getSubjects, getAllSubjects } from "../services/studyMaterialService";

import Loader from "../components/Loader/Loader";
import { SubjectCard } from "../components/StudyMaterial/SubjectCard";
import SearchBar from "../components/Alumni/SearchBar.jsx";

import {
  LuBookMarked,
  LuClipboardCheck,
  LuBuilding,
  LuArrowLeft,
  LuBrain,
  LuArrowRight,
} from "react-icons/lu";

/* ---------------------------
   Constants
--------------------------- */
const CATEGORIES = {
  PLACEMENTS: "Placements/Internships",
  SEMESTER: "Semester Exams",
};

const DEPARTMENTS = ["CSE", "AI"];

const COMMON_QUERY_OPTIONS = {
  cacheTime: 1000 * 60 * 60, // 1 hour
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  retry: 1,
};

/* ---------------------------
   Hero Header
--------------------------- */
const StudyMaterialHero = () => (
  <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
    <div className="space-y-6 text-center">
      <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-blue-400">
        <LuBookMarked className="h-4 w-4" />
        Study Resources
      </div>
      <h1 className="text-foreground text-4xl font-bold md:text-6xl text-white">
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

/* ---------------------------
   Selection Card
--------------------------- */
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

/* ---------------------------
   MAIN COMPONENT
--------------------------- */
const StudyMaterialPage = () => {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState(null);
  const [department, setDepartment] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const navigate = useNavigate();

  /* ---------------------------
     LOGIN CHECK
--------------------------- */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  /* ---------------------------
     Debounce search input
--------------------------- */
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
    }, 300);

    return () => clearTimeout(t);
  }, [searchTerm]);

  /* ---------------------------
     FETCH filtered subjects
--------------------------- */
  const {
    data: subjects = [],
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
      return response.data.data;
    },

    onError: (err) => {
      const msg = err.message.toLowerCase();
      if (msg.includes("token") || msg.includes("unauthorized")) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    },
  });

  /* ---------------------------
     FETCH ALL subjects for Fuse.js
--------------------------- */
  const { data: allSubjects = [] } = useQuery({
    queryKey: ["all-subjects"],
    staleTime: 1000 * 60 * 60, // 1 hour
    ...COMMON_QUERY_OPTIONS,

    queryFn: async () => {
      const response = await getAllSubjects();
      return response.data.data;
    },
  });

  /* ---------------------------
     FUSE instance
--------------------------- */
  const fuse = useMemo(() => {
    if (!allSubjects.length) return null;

    return new Fuse(allSubjects, {
      keys: ["subjectName"],
      threshold: 0.35,
      distance: 90,
    });
  }, [allSubjects]);

  /* ---------------------------
     Combine backend filter + fuzzy search
--------------------------- */
  const finalSubjects = useMemo(() => {
    if (!subjects.length) return [];

    if (!debouncedSearch) {
      return subjects;
    }

    if (!fuse) {
      const lower = debouncedSearch.toLowerCase();
      return subjects.filter((s) =>
        s.subjectName.toLowerCase().includes(lower)
      );
    }

    const idsAllowed = new Set(subjects.map((s) => s._id));

    return fuse
      .search(debouncedSearch)
      .map((r) => r.item)
      .filter((sub) => idsAllowed.has(sub._id));
  }, [subjects, debouncedSearch, fuse]);

  /* ---------------------------
     Step handlers
--------------------------- */
  const handleCategorySelect = (selectedCategory) => {
    setCategory(selectedCategory);

    if (selectedCategory === CATEGORIES.PLACEMENTS) {
      setDepartment("Common");
      setStep(3);
    } else {
      setStep(2);
    }

    setSearchTerm("");
    setDebouncedSearch("");
  };

  const handleDepartmentSelect = (dept) => {
    setDepartment(dept);
    setStep(3);
    setSearchTerm("");
    setDebouncedSearch("");
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

    setSearchTerm("");
    setDebouncedSearch("");
  };

  /* ---------------------------
     STEP RENDERERS
--------------------------- */
  const renderStep1 = () => (
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

  const renderStep2 = () => (
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

  const renderStep3 = () => {
    if (isLoading) {
      return (
        <div className="flex h-64 w-full items-center justify-center">
          <Loader />
        </div>
      );
    }

    if (isError) {
      return (
        <p className="text-center text-red-400">
          {error?.message || "Something went wrong"}
        </p>
      );
    }

    if (!subjects.length) {
      return <p className="text-center text-gray-400">No subjects found.</p>;
    }

    return (
      <>
        <SearchBar
          placeholder="Search subjects..."
          value={searchTerm}
          onChange={setSearchTerm}
        />

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {finalSubjects.length ? (
            finalSubjects.map((subject) => (
              <SubjectCard key={subject._id} subject={subject} />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-400">
              No matching subjects found.
            </p>
          )}
        </div>
      </>
    );
  };

  /* ---------------------------
     MAIN RENDER
--------------------------- */
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
