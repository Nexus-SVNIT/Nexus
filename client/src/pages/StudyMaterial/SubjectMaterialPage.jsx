import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import apiService from '../../services/apiService';
import Loader from '../../components/Loader/Loader';
import { Title } from '../../components';

// API function to fetch subjects
const fetchSubjects = async (category, department) => {
  const { data } = await apiService.get('/study-material/subjects', {
    params: { category, department },
  });
  return data.data; 
};

const SubjectMaterialPage = () => {
  const [category, setCategory] = useState('Semester Exams');
  const [department, setDepartment] = useState('CSE');

  const departmentToFetch = category === 'Placements/Internships' ? 'Common' : department;

  const {
    data: subjects,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['subjects', category, departmentToFetch],
    queryFn: () => fetchSubjects(category, departmentToFetch),
  });

  return (
    <div className="container mx-auto p-4 py-10 text-white min-h-screen">
      <Title>Study Material</Title>
      <p className="mb-8 text-center text-lg text-gray-300">
        Browse resources, notes, and tips for your courses and placements.
      </p>

      {/* --- Filters Section --- */}
      <div className="mb-8 max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 rounded-md bg-gray-800 p-6 shadow-lg">
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-300 mb-2">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Semester Exams">Semester Exams</option>
            <option value="Placements/Internships">Placements/Internships</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-300 mb-2">Department</label>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            disabled={category === 'Placements/Internships'}
            className="rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <option value="CSE">CSE</option>
            <option value="AI">AI</option>
            <option value="Common">Common</option>
          </select>
        </div>
      </div>

      {/* --- Results Section --- */}
      <div>
        {isLoading && <Loader />}
        {isError && <p className="text-red-500 text-center">Error fetching subjects.</p>}
        
        {!isLoading && !isError && subjects && (
          <>
            {subjects.length === 0 ? (
              <p className="text-gray-400 text-center">No subjects found for this selection.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {subjects.map((subject) => (
                  <Link
                    key={subject._id}
                    to={`/study-material/${subject._id}`}
                    className="block rounded-lg bg-gray-800 p-6 shadow-lg transition-transform hover:scale-105 hover:bg-gray-700"
                  >
                    <h3 className="text-xl font-semibold text-white">
                      {subject.subjectName}
                    </h3>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SubjectMaterialPage;