import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaGithub } from 'react-icons/fa';
import { getContributors } from '../../services/contributorService';

const Contributors = () => {
    const [contributorsByYear, setContributorsByYear] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContributors = async () => {
            try {
                const response = await getContributors();

                if(!response.success) {
                    console.error('Error fetching contributors:', response.message);
                }
                setContributorsByYear(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching contributors:', error);
            }
        };

        fetchContributors().catch((error) => {
            console.error('Error fetching contributors:', error);
        });
    }, []);

    if (loading) {
        return (
            <div className="my-10 text-center">
                <h2 className="mb-8 text-4xl font-semibold text-white">Our Contributors</h2>
                <div className="flex justify-center space-x-3">
                    {[1,2,3].map(i => (
                        <div key={i} className={`w-2 h-2 rounded-full bg-blue-500 animate-bounce`} 
                             style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="my-16 px-6">
            <h2 className="mb-16 text-4xl font-semibold text-white text-center">
                Our Contributors
            </h2>
            <div className="max-w-4xl mx-auto relative">
                {/* Vertical Timeline Line */}
                <div className="absolute left-4 top-0 bottom-0 w-[2px] bg-gradient-to-b from-blue-500/50 via-purple-500/30 to-transparent"></div>

                {Object.entries(contributorsByYear)
                    .sort(([yearA], [yearB]) => yearB - yearA)
                    .map(([year, yearData], index) => (
                    <div key={year} className="mb-16 relative group">
                        {/* Year Marker */}
                        <div className="absolute left-4 -translate-x-1/2 w-3 h-3 bg-blue-500 rounded-full 
                                      ring-4 ring-blue-500/20 transition-all duration-300 group-hover:ring-8"></div>

                        <div className="ml-12">
                            {/* Year Header */}
                            <div className="flex items-baseline gap-4 mb-6">
                                <h3 className="text-2xl font-bold text-white/90">{year}</h3>
                                <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
                                    <span className="text-sm font-medium text-blue-400">
                                        {yearData.total} commits
                                    </span>
                                </div>
                            </div>
                            
                            {/* Contributors Grid */}
                            <div className="grid gap-3 md:grid-cols-2">
                                {yearData.contributors
                                    .sort((a, b) => b.contributions - a.contributions)
                                    .map((contributor) => (
                                    <div key={contributor.githubId} 
                                         className="group/card flex items-center justify-between p-4 
                                                  bg-white/[0.02] backdrop-blur-sm border border-white/5 
                                                  rounded-lg hover:bg-white/[0.04] hover:border-blue-500/20 
                                                  transition-all duration-300">
                                        <div className="flex items-center gap-3 min-w-0">
                                            {contributor.avatar_url && (
                                                <img src={contributor.avatar_url} 
                                                     alt={contributor.githubId}
                                                     className="w-8 h-8 rounded-full ring-2 ring-white/10" />
                                            )}
                                            <a href={contributor.html_url}
                                               target="_blank"
                                               rel="noopener noreferrer"
                                               className="flex items-center gap-2 text-white/80 
                                                        hover:text-blue-400 transition-colors truncate">
                                                <FaGithub className="flex-shrink-0 opacity-50 
                                                                   group-hover/card:opacity-100" />
                                                <span className="font-medium truncate">{contributor.githubId}</span>
                                            </a>
                                        </div>
                                        <span className="text-sm font-medium px-2.5 py-1 rounded-full 
                                                       bg-white/5 text-white/60 border border-white/5">
                                            {contributor.contributions}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Contributors;