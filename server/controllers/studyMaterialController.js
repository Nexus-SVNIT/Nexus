import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BookOpen, Briefcase, GraduationCap, ChevronLeft, Loader2 } from 'lucide-react';

// --- CORRECTED IMPORT PATH ---
import MaintenancePage from "../../components/Error/MaintenancePage.jsx";

const StudyMaterialPage = () => {
  const navigate = useNavigate();

  // State Management
  const [step, setStep] = useState(1); // 1: Category, 2: Dept, 3: Subjects
  const [category, setCategory] = useState('');
  const [department, setDepartment] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- Logic to Fetch Subjects ---
  const fetchSubjects = async (selectedCategory, selectedDept) => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.append('category', selectedCategory);
      if (selectedDept) params.append('department', selectedDept);

      // Ensure this URL matches your backend port
      const response = await axios.get(`http://localhost:5000/api/v1/subjects?${params.toString()}`, {
        withCredentials: true 
      });

      setSubjects(response.data.data || []);
    } catch (err) {
      console.error("Failed to fetch subjects:", err);
      setError(err.response?.data?.message || "Failed to load subjects");
    } finally {
      setIsLoading(false);
    }
  };

  // --- Step 1: Select Category ---
  const renderStep1 = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">What are you looking for?</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        
        {/* Card 1: Semester Exams */}
        <button
          onClick={() => {
            setCategory('Semester Exams');
            setStep(2); 
          }}
          className="group relative overflow-hidden bg-white p-8 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 transition-all text-left"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <GraduationCap size={100} />
          </div>
          <div className="relative z-10">
            <div className="p-3 bg-blue-50 w-fit rounded-xl mb-4 group-hover:scale-110 transition-transform">
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Semester Exams</h3>
            <p className="text-gray-500 text-sm">Notes, PYQs, and important topics for your college exams.</p>
          </div>
        </button>

        {/* Card 2: Placements */}
        <button
          onClick={() => {
            const cat = 'Placements/Internships';
            const dept = 'Common'; 
            setCategory(cat);
            setDepartment(dept);
            setStep(3); 
            fetchSubjects(cat, dept);
          }}
          className="group relative overflow-hidden bg-white p-8 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 transition-all text-left"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Briefcase size={100} />
          </div>
          <div className="relative z-10">
            <div className="p-3 bg-purple-50 w-fit rounded-xl mb-4 group-hover:scale-110 transition-transform">
              <Briefcase className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Placements & Internships</h3>
            <p className="text-gray-500 text-sm">Prepare for interviews with resources for all branches.</p>
          </div>
        </button>
      </div>
    </div>
  );

  // --- Step 2: Select Department ---
  const renderStep2 = () => (
    <div className="animate-in fade-in slide-in-from-right-8 duration-500 max-w-4xl mx-auto">
      <button 
        onClick={() => { setStep(1); setCategory(''); }}
        className="flex items-center text-gray-500 hover:text-blue-600 mb-6 transition-colors"
      >
        <ChevronLeft size={20} /> Back to Categories
      </button>

      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Select Your Department</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {['CSE', 'AI', 'Common'].map((dept) => (
          <button
            key={dept}
            onClick={() => {
              setDepartment(dept);
              setStep(3);
              fetchSubjects(category, dept);
            }}
            className="p-6 bg-white border border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all font-semibold text-gray-700 hover:text-blue-700 shadow-sm"
          >
            {dept}
          </button>
        ))}
      </div>
    </div>
  );

  // --- Step 3: Display Subjects ---
  const renderStep3 = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
          <p className="text-gray-500">Fetching subjects...</p>
        </div>
      );
    }

    if (error) {
      // Uses the correct imported path
      return <MaintenancePage />;
    }

    return (
      <div className="animate-in fade-in slide-in-from-right-8 duration-500 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => {
              if (category === 'Placements/Internships') {
                setStep(1);
                setCategory('');
              } else {
                setStep(2);
                setDepartment('');
              }
              setSubjects([]);
            }}
            className="flex items-center text-gray-500 hover:text-blue-600 transition-colors"
          >
            <ChevronLeft size={20} /> Back
          </button>
          
          <div className="text-right">
            <h2 className="text-xl font-bold text-gray-800">{category}</h2>
            <p className="text-sm text-gray-500">{department} Department</p>
          </div>
        </div>

        {subjects.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
            <p className="text-gray-500 text-lg">No subjects found for this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {subjects.map((subject) => (
              <div 
                key={subject._id}
                onClick={() => navigate(`/subjects/${subject._id}`)}
                className="group bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 cursor-pointer transition-all"
              >
                <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 line-clamp-2 mb-2">
                  {subject.subjectName}
                </h3>
                <div className="h-1 w-12 bg-gray-100 group-hover:bg-blue-500 transition-all rounded-full"></div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // --- Main Render ---
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
          Study Materials
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Access curated notes, previous year questions, and resources for your academic success.
        </p>
      </div>

      <div className="w-full">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </div>
    </div>
  );
};

export default StudyMaterialPage;