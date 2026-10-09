import React, { useState, useEffect } from 'react';
import increamentCounter from '../../libs/increamentCounter';
import MaintenancePage from '../Error/MaintenancePage';
import HeadTags from '../HeadTags/HeadTags';

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
        increamentCounter();
    }, []);

    if (isLoading) {
        return (
            <div className="bg-transparent min-h-screen py-6 px-4">
                <HeadTags 
                    title="Loading Projects... | Nexus - NIT Surat"
                />                    
                <div className="bg-zinc-900/60 backdrop-blur-md border border-zinc-800/80 text-white md:p-6 p-4 rounded-xl shadow-xl max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold mb-4 text-center">Ongoing Projects</h1>
                    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
                        {[...Array(4)].map((_, index) => (
                            <div key={index} className="bg-zinc-800/50 border border-zinc-700/60 p-2 md:p-8 rounded-xl shadow-lg animate-pulse">
                                <div className="h-8 bg-zinc-700 mb-6 rounded"></div>
                                <div className="h-4 bg-zinc-600 mb-3 rounded"></div>
                                <div className="h-4 bg-zinc-600 mb-3 rounded"></div>
                                <div className="h-4 bg-zinc-600 mb-3 rounded"></div>
                                <div className="h-4 bg-zinc-600 rounded"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (isError) {
        return <MaintenancePage />
    }

    return (
        <div className="bg-transparent min-h-screen py-6 px-4">
            <HeadTags
                title="Ongoing Projects | Nexus - NIT Surat"
                description="Check out the ongoing projects of Nexus built and mentored by Nexus Members."
                keywords={"Nexus NIT Surat, Ongoing Projects, Projects, Nexus Projects, NIT Surat Projects"}
            />
            <div className="bg-zinc-900/60 backdrop-blur-md border border-zinc-800/80 text-white p-4 md:p-8 rounded-xl shadow-xl max-w-5xl mx-auto">
                <h1 className="text-4xl font-bold mb-6 text-center">Ongoing Projects</h1>
                <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
                    {projects.map((project) => (
                        <div key={project._id} className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/60 hover:border-blue-500/50 p-8 rounded-xl shadow-lg transition-all transform hover:scale-[1.01]">
                            <h2 className="text-3xl font-semibold mb-4">{project.title}</h2>
                            <p className="text-gray-300 mb-6">{project.description}</p>
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
                            <h3 className="text-2xl font-semibold mb-2">Team Members:</h3>
                            <ul className="list-disc list-inside ml-5 mb-4">
                                {project.teamMembers.map((member, index) => (
                                    <li key={index} className="text-gray-300">
                                        {/* Provided by backend */}
                                        <span className="text-blue-400 ml-2">
                                            <a
                                                href={member.linkedin}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="hover:underline"
                                            >
                                                {member.name} <span className="italic"> ({member.admissionNumber})  </span><br />
                                            </a>
                                        </span>
                                    </li>
                                ))}
                            </ul>
                            <h3 className="text-2xl font-semibold mb-2">Mentors:</h3>
                            <ul className="list-disc list-inside ml-5">
                                {project.mentors.map((mentor, index) => (
                                    <li key={index} className="text-gray-300">
                                        <span className="text-blue-400 ml-2">
                                            <a
                                                href={mentor.linkedin}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="hover:underline"
                                            >
                                                {mentor.name} <span className="italic"> ({mentor.admissionNumber})  </span><br />
                                            </a>
                                        </span>
                                    </li>
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
