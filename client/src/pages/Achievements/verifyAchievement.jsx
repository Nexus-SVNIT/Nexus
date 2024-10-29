import React, { useEffect, useState } from 'react';
import axios from 'axios';

const VerifyAchievements = () => {
    const [pendingAchievements, setPendingAchievements] = useState([]);
    const [verifiedAchievements, setVerifiedAchievements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem("core-token");

    useEffect(() => {
        const fetchAchievements = async () => {
            try {
                const pendingResponse = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/achievements/pending/`);
                const verifiedResponse = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/achievements/`);

                setPendingAchievements(pendingResponse.data);
                setVerifiedAchievements(verifiedResponse.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAchievements();
    }, []);

    const handleVerify = async (id) => {
        try {
            await axios.patch(`${process.env.REACT_APP_BACKEND_BASE_URL}/achievements/verify/${id}`, {}, {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`,
                },
            });
            setPendingAchievements((prev) => prev.filter((ach) => ach._id !== id));
            const verifiedAchievement = pendingAchievements.find((ach) => ach._id === id);
            setVerifiedAchievements((prev) => [...prev, { ...verifiedAchievement, isVerified: true }]);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleUnverify = async (id) => {
        try {
            await axios.patch(`${process.env.REACT_APP_BACKEND_BASE_URL}/achievements/unverify/${id}`, {}, {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`,
                },
            });
            setVerifiedAchievements((prev) => prev.filter((ach) => ach._id !== id));
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <div className="text-white">Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="min-h-screen bg-black p-8">
            <h1 className="text-3xl text-white mb-6">Pending Achievements</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pendingAchievements.map((achievement) => (
                    <div key={achievement._id} className="bg-gray-800 p-4 rounded-lg shadow-lg">
                        <h2 className="text-xl text-white">{achievement.admissionNumber}</h2>
                        <p className="text-gray-400">Description: {achievement.desc}</p>
                        <p className="text-gray-400">Team Members: {achievement.teamMembers.join(', ')}</p>
                        <p className="text-gray-400">Proof Link: <a href={achievement.proof} className="text-blue-400">{achievement.proof}</a></p>
                        {achievement.image && (
                            <p className="text-gray-400">
                                Image: <a href={`https://lh3.googleusercontent.com/d/${achievement.image}`} className="text-blue-400">View Image</a>
                            </p>
                        )}
                        <div className="flex justify-between mt-4">
                            <button
                                onClick={() => handleVerify(achievement._id)}
                                className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition duration-200"
                            >
                                Verify
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <h1 className="text-3xl text-white mb-6 mt-8">Verified Achievements</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {verifiedAchievements.map((achievement) => (
                    <div key={achievement._id} className="bg-gray-800 p-4 rounded-lg shadow-lg">
                        <h2 className="text-xl text-white">{achievement.admissionNumber}</h2>
                        <p className="text-gray-400">Description: {achievement.desc}</p>
                        <p className="text-gray-400">Team Members: {achievement.teamMembers.join(', ')}</p>
                        <p className="text-gray-400">Proof Link: <a href={achievement.proof} className="text-blue-400">{achievement.proof}</a></p>
                        {achievement.image && (
                            <p className="text-gray-400">
                                Image: <a href={`https://lh3.googleusercontent.com/d/${achievement.image}`} className="text-blue-400">View Image</a>
                            </p>
                        )}
                        <div className="flex justify-between mt-4">
                            <button
                                onClick={() => handleUnverify(achievement._id)}
                                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition duration-200"
                            >
                                Unverify
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VerifyAchievements;
