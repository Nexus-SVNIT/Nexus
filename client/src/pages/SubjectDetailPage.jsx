// src/pages/SubjectDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchSubjectDetails } from "../services/studyMaterialService";
import Tabs from "../components/StudyMaterial/Tabs";
import Loader from "../components/StudyMaterial/Loader";

const SubjectDetailPage = () => {
  const { id } = useParams();
  const [subject, setSubject] = useState(null);
  const [activeTab, setActiveTab] = useState("notes");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDetails = async () => {
      try {
        setLoading(true);
        const data = await fetchSubjectDetails(id);
        setSubject(data);
      } catch (err) {
        console.error("Error fetching subject details:", err);
      } finally {
        setLoading(false);
      }
    };
    loadDetails();
  }, [id]);

  if (loading) return <Loader />;
  if (!subject)
    return <p className="text-center mt-12 text-gray-500">Subject not found.</p>;

  const resourceTabs = Object.keys(subject.resources);

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-semibold text-gray-800 mb-2">
        {subject.subjectName}
      </h1>
      <p className="text-gray-500 mb-6">Study resources and tips</p>

      {/* Tips Section */}
      {subject.tips && subject.tips.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-gray-700">Tips</h2>
          <ul className="list-disc ml-6 text-gray-700 space-y-1">
            {subject.tips.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Tabs */}
      <Tabs
        tabs={resourceTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Resource List */}
      <div className="mt-6 space-y-3">
        {subject.resources[activeTab]?.length === 0 ? (
          <p className="text-gray-500 italic">No resources available.</p>
        ) : (
          subject.resources[activeTab].map((res, i) => (
            <a
              key={i}
              href={res.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3 bg-white shadow rounded-xl hover:bg-gray-100 transition"
            >
              <span className="font-medium text-gray-800">{res.title}</span>
            </a>
          ))
        )}
      </div>
    </div>
  );
};

export default SubjectDetailPage;
