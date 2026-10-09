import React, { useEffect, useState } from 'react';
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
                    return;
                }
                setContributorsByYear(response.data || {});
            } catch (error) {
                console.error('Error fetching contributors:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchContributors().catch((error) => {
            console.error('Error fetching contributors:', error);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <div className="my-16 px-6">
                <div className="mb-14 text-center space-y-3">
                    <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-400">
                        Open Source Community
                    </div>
                    <h2 className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-transparent">
                        Our Contributors
                    </h2>
                </div>
                <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
                    {[1, 2].map((i) => (
                        <div key={i} className="space-y-4">
                            <div className="h-6 w-24 bg-zinc-800 rounded-lg" />
                            <div className="grid gap-3 md:grid-cols-2">
                                {[1, 2, 3, 4].map((j) => (
                                    <div key={j} className="h-16 rounded-xl border border-zinc-800/60 bg-zinc-900/40" />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const yearEntries = Object.entries(contributorsByYear).sort(([yearA], [yearB]) => yearB - yearA);

    return (
        <div className="my-16 px-6">
            <div className="mb-16 text-center space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-400">
                    Open Source Community
                </div>
                <h2 className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-transparent">
                    Our Contributors
                </h2>
                <p className="mx-auto max-w-xl text-sm sm:text-base text-zinc-400">
                    The talented students and developers who build, maintain, and contribute to Nexus.
                </p>
            </div>

            <div className="max-w-4xl mx-auto relative">
                {yearEntries.length === 0 ? (
                    <div className="text-center text-zinc-400 py-12 rounded-2xl border border-zinc-800/60 bg-zinc-900/30 backdrop-blur-sm">
                        No contributor data available at the moment.
                    </div>
                ) : (
                    <>
                        {/* Vertical Timeline Line */}
                        <div className="absolute left-4 top-0 bottom-0 w-[2px] bg-gradient-to-b from-blue-500/60 via-purple-500/30 to-transparent"></div>

                        {yearEntries.map(([year, yearData]) => (
                            <div key={year} className="mb-16 relative group">
                                {/* Year Marker */}
                                <div className="absolute left-4 -translate-x-1/2 w-3.5 h-3.5 bg-blue-400 rounded-full 
                                              ring-4 ring-blue-500/20 shadow-[0_0_12px_rgba(59,130,246,0.5)] transition-all duration-300 group-hover:ring-8"></div>

                                <div className="ml-12">
                                    {/* Year Header */}
                                    <div className="flex items-center gap-3 mb-6">
                                        <h3 className="text-2xl font-bold text-white tracking-tight">{year}</h3>
                                        <div className="px-3 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20">
                                            <span className="text-xs font-semibold text-blue-400">
                                                {yearData.total} commits
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {/* Contributors Grid */}
                                    <div className="grid gap-3 md:grid-cols-2">
                                        {(yearData.contributors || [])
                                            .sort((a, b) => b.contributions - a.contributions)
                                            .map((contributor) => (
                                            <div key={contributor.githubId} 
                                                 className="group/card flex items-center justify-between p-3.5 sm:p-4 
                                                          bg-zinc-900/50 backdrop-blur-md border border-zinc-800/80 
                                                          rounded-xl hover:bg-zinc-800/60 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/5 
                                                          transition-all duration-300">
                                                <div className="flex items-center gap-3.5 min-w-0">
                                                    {contributor.avatar_url && (
                                                        <img src={contributor.avatar_url} 
                                                             alt={contributor.githubId}
                                                             className="w-9 h-9 rounded-full ring-2 ring-white/10 group-hover/card:ring-blue-400/40 transition-all object-cover" />
                                                    )}
                                                    <a href={contributor.html_url}
                                                       target="_blank"
                                                       rel="noopener noreferrer"
                                                       className="flex items-center gap-2 text-zinc-200 
                                                                hover:text-blue-400 transition-colors truncate font-medium text-sm">
                                                        <FaGithub className="flex-shrink-0 text-zinc-400 
                                                                           group-hover/card:text-blue-400 transition-colors" />
                                                        <span className="truncate">{contributor.githubId}</span>
                                                    </a>
                                                </div>
                                                <span className="text-xs font-semibold px-2.5 py-1 rounded-full 
                                                               bg-blue-500/10 text-blue-300 border border-blue-500/20 ml-2 flex-shrink-0">
                                                    {contributor.contributions} {contributor.contributions === 1 ? 'commit' : 'commits'}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
};

export default Contributors;