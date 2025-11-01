import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchSubjectDetails } from "../services/studyMaterialService";
import Dropdown from "../components/StudyMaterial/Dropdown";
import SubjectCard from "../components/StudyMaterial/SubjectCard";
import Loader from "../components/StudyMaterial/Loader";


const StudyMaterialPage = () => {
  const [category, setCategory] = useState("Semester Exams");
  const [department, setDepartment] = useState("CSE");
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const categories = ["Semester Exams", "Placements/Internships"];
  const departments = ["CSE", "AI", "ECE", "EEE", "Mechanical", "Civil"];

  useEffect(() => {
    const loadSubjects = async () => {
      try {
        setLoading(true);
        const data = await fetchSubjects(category, department);
        setSubjects(data);
      } catch (err) {
        console.error("Error fetching subjects:", err);
      } finally {
        setLoading(false);
      }
    };
    loadSubjects();
  }, [category, department]);

  const handleCardClick = (id) => navigate(`/study-material/${id}`);

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">
        📚 Study Material
      </h1>

      <div className="flex flex-wrap gap-4 mb-8">
        <Dropdown
          label="Category"
          options={categories}
          value={category}
          onChange={setCategory}
        />
        <Dropdown
          label="Department"
          options={departments}
          value={department}
          onChange={setDepartment}
          disabled={category === "Placements/Internships"}
        />
      </div>

      {loading ? (
        <Loader />
      ) : subjects.length === 0 ? (
        <p className="text-gray-500 text-center mt-12">
          No subjects found for this selection.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subj) => (
            <SubjectCard
              key={subj._id}
              name={subj.subjectName}
              onClick={() => handleCardClick(subj._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default StudyMaterialPage;
