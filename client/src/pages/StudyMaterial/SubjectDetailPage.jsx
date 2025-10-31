import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { apiService } from '../../services/apiService';
import Loader from '../../components/Loader/Loader';
import { Title } from '../../components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';

// API function to fetch a single subject's details
const fetchSubjectDetails = async (subjectId) => {
  const { data } = await apiService.get(`/study-material/subjects/${subjectId}`);
  return data.data; 
};

const SubjectDetailPage = () => {
  const { subjectId } = useParams();

  const {
    data: subject,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['subject', subjectId],
    queryFn: () => fetchSubjectDetails(subjectId),
    enabled: !!subjectId, 
  });

  const resourceCategories = subject ? Object.keys(subject.resources) : [];
  const [activeTab, setActiveTab] = useState(resourceCategories[0] || 'Notes');

  React.useEffect(() => {
    if (subject && resourceCategories.length > 0) {
      setActiveTab(resourceCategories[0]);
    }
  }, [subject, resourceCategories]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (isError || !subject) {
    return (
      <div className="text-red-500 text-center p-10 min-h-screen">
        <Title>Error</Title>
        <p>Could not load subject details. Please try again later.</p>
        <Link to="/study-material" className="text-blue-400 hover:underline mt-4 block">
          &larr; Back to all subjects
        </Link>
      </div>
    );
  }

  const activeResources = subject.resources[activeTab] || [];

  return (
    <div className="container mx-auto p-4 py-10 text-white min-h-screen">
      <Link to="/study-material" className="text-blue-400 hover:underline mb-6 block">
        &larr; Back to all subjects
      </Link>
      
      <Title>{subject.subjectName}</Title>

      {/* --- Tips Section --- */}
      <div className="mb-10 rounded-lg bg-gray-800 p-6 shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-white">Tips & Advice</h2>
        {subject.tips.length === 0 ? (
          <p className="text-gray-400">No tips available for this subject yet.</p>
        ) : (
          <ul className="list-disc list-inside space-y-3 pl-4">
            {subject.tips.map((tip, index) => (
              <li key={index} className="text-gray-200 text-lg">
                {tip}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* --- Resources Section (with Tabs) --- */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-white">Resources</h2>
        
        {/* Tab Buttons */}
        <div className="flex flex-wrap border-b border-gray-700 mb-4">
          {resourceCategories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveTab(category)}
              className={`py-2 px-5 font-medium -mb-px rounded-t-md ${
                activeTab === category
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="rounded-md bg-gray-800 p-6 min-h-[200px] shadow-lg">
          {activeResources.length === 0 ? (
            <p className="text-gray-400">No resources found in this category.</p>
          ) : (
            <ul className="space-y-4">
              {activeResources.map((resource) => (
                <li key={resource._id} className="flex items-center space-x-3">
                  <span
                    className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                      resource.resourceType === 'PDF'
                        ? 'bg-red-600 text-white'
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    {resource.resourceType}
                  </span>
                  <a
                    href={resource.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline text-lg flex-1 truncate"
                  >
                    {resource.title}
                  </a>
                  <FontAwesomeIcon icon={faExternalLinkAlt} className="text-gray-500 w-3 h-3" />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubjectDetailPage;