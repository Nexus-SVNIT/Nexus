import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaGithub } from 'react-icons/fa';

const Contributors = () => {
    const [contributors, setContributors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContributors = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_BACKEND_BASE_URL}/api/contributors/get`
                );
                setContributors(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching contributors:', error);
                setLoading(false);
            }
        };

        fetchContributors();
    }, []);

    if (loading) {
        return (
            <div className="my-10 text-center">
                <h2 className="mb-8 text-4xl font-semibold text-white">Our Contributors</h2>
                <p className="text-white/60">Loading contributors...</p>
            </div>
        );
    }

    return (
        <div className="my-10 px-4">
            <h2 className="mb-8 text-4xl font-semibold text-white text-center">Our Contributors</h2>
            <div className="max-w-3xl mx-auto">
                <div className="space-y-4">
                    {contributors.map((contributor) => (
                        <div key={contributor.id} 
                             className="flex items-center justify-between p-4 
                                      bg-gray-800/50 rounded-lg hover:bg-gray-700/50 
                                      transition-colors">
                            <div className="flex items-center gap-3">
                                <img src={contributor.avatar_url} 
                                     alt={contributor.login}
                                     className="w-10 h-10 rounded-full" />
                                <a href={contributor.html_url}
                                   target="_blank"
                                   rel="noopener noreferrer"
                                   className="flex items-center gap-2 text-white 
                                            hover:text-blue-400 transition-colors">
                                    <FaGithub className="text-lg" />
                                    <span className="font-medium">{contributor.login}</span>
                                </a>
                            </div>
                            <span className="text-sm text-white/70 bg-gray-700/50 
                                           px-3 py-1 rounded-full">
                                {contributor.contributions} {contributor.contributions === 1 ? 'contribution' : 'contributions'}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Contributors;
