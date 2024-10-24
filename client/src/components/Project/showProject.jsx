import React, { useState, useEffect } from 'react';

const ShowProject = () => {
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const fetchProjects = async () => {
            setIsLoading(true);
            setIsError(false);
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/projects/ongoing`);
                if (!response.ok) {
                    throw new Error('Failed to fetch ongoing projects');
                }
                const data = await response.json();
                setProjects(data);
            } catch (error) {
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProjects();
    }, []); // Empty dependency array to run only on component mount

    // Skeleton for loading state
    if (isLoading) {
        return (
            <div className="bg-[#111111] min-h-screen py-6 px-4">
                <div className="bg-gray-900 text-white p-6 rounded-md shadow-md max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold mb-4 text-center">Ongoing Projects</h1>
                    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                        {[...Array(6)].map((_, index) => (
                            <div key={index} className="bg-gray-800 border border-blue-500 p-5 rounded-lg shadow-lg animate-pulse">
                                <div className="h-6 bg-gray-700 mb-4 rounded"></div>
                                <div className="h-4 bg-gray-600 mb-2 rounded"></div>
                                <div className="h-4 bg-gray-600 mb-2 rounded"></div>
                                <div className="h-4 bg-gray-600 mb-2 rounded"></div>
                                <div className="h-4 bg-gray-600 rounded"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (isError) {
        return <div className="text-red-500 text-lg">Error fetching ongoing projects</div>;
    }

    return (
        <div className="bg-[#111111] min-h-screen py-6 px-4">
            <div className="bg-gray-900 text-white p-6 rounded-md shadow-md max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-4 text-center">Ongoing Projects</h1>
                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                    {projects.map((project) => (
                        <div key={project._id} className="bg-gray-800 border border-blue-500 p-5 rounded-lg shadow-lg transition-transform transform hover:scale-105">
                            <h2 className="text-2xl font-semibold mb-2">{project.title}</h2>
                            <p className="text-gray-300 mb-4">{project.description}</p>
                            <p className="text-blue-400 mb-4">
                                <a 
                                    href={project.githubLink} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="hover:underline"
                                >
                                    GitHub Link
                                </a>
                            </p>
                            <h3 className="text-xl font-semibold mb-2">Team Members:</h3>
                            <ul className="list-disc list-inside ml-5">
                                {project.teamMembers.map((member, index) => (
                                    <li key={index} className="text-gray-300">{member.name} - {member.role}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ShowProject;
