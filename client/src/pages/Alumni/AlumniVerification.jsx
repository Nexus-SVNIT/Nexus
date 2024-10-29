import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const AlumniVerification = () => {
    const [verifiedAlumni, setVerifiedAlumni] = useState([]);
    const [pendingAlumni, setPendingAlumni] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAlumni = async () => {
            try {
                const [verifiedResponse, pendingResponse] = await Promise.all([
                    axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/alumni`),
                    axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/alumni/pending`)
                ]);

                setVerifiedAlumni(verifiedResponse.data);
                setPendingAlumni(pendingResponse.data);
            } catch (err) {
                setError(err);
                toast.error("Failed to fetch alumni details");
            } finally {
                setLoading(false);
            }
        };

        fetchAlumni();
    }, []);

    const toggleVerification = async (alumniId, currentStatus, isPending) => {
        try {
            await axios.patch(`${process.env.REACT_APP_BACKEND_BASE_URL}/alumni/${alumniId}`, {
                isVerified: !currentStatus,
            });
            if (isPending) {
                setPendingAlumni((prev) => prev.filter((alumnus) => alumnus._id !== alumniId));
                setVerifiedAlumni((prev) => [...prev, pendingAlumni.find((alumnus) => alumnus._id === alumniId)]);
            } else {
                setVerifiedAlumni((prev) => prev.filter((alumnus) => alumnus._id !== alumniId));
                setPendingAlumni((prev) => [...prev, verifiedAlumni.find((alumnus) => alumnus._id === alumniId)]);
            }
            toast.success("Status updated successfully!");
        } catch (err) {
            toast.error("Failed to update status");
        }
    };

    if (loading) return "Loading";
    if (error) return <div className="text-red-500">Error loading alumni details</div>;

    return (
        <section className="mx-auto mb-10 mt-10 max-w-5xl p-6 bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-white mb-4">Alumni Verification</h2>

            <div className="mb-8">
                <h3 className="text-xl font-semibold text-green-500 mb-4">Verified Alumni</h3>
                <div className="flex flex-col gap-4">
                    {verifiedAlumni.map((alumnus) => (
                        <div
                            key={alumnus._id}
                            className="p-4 rounded-lg flex justify-between items-start bg-green-600"
                        >
                            <div className="flex flex-col space-y-1">
                                <img src={alumnus.ImageLink} alt={`${alumnus.Name}`} className="w-16 h-16 rounded-full mb-2" />
                                <p className="text-lg text-white font-semibold">{alumnus.Name}</p>
                                <p className="text-gray-200">Email: {alumnus['E-Mail']}</p>
                                <p className="text-gray-200">Admission No: {alumnus['Admission No']}</p>
                                <p className="text-gray-200">Expertise: {alumnus.Expertise}</p>
                                <p className="text-gray-200">Current Role: {alumnus['Current Role']}</p>
                                <p className="text-gray-200">Mobile: {alumnus['Mobile Number']}</p>
                                <p className="text-gray-200">Passing Year: {alumnus['Passing Year']}</p>
                                <a href={alumnus.LinkedIn} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                                    LinkedIn
                                </a>
                            </div>
                            <button
                                onClick={() => toggleVerification(alumnus._id, true, false)}
                                className="mt-2 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 transition duration-300 text-white"
                            >
                                Unverify
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="text-xl font-semibold text-red-500 mb-4">Pending Verification</h3>
                <div className="flex flex-col gap-4">
                    {pendingAlumni.map((alumnus) => (
                        <div
                            key={alumnus._id}
                            className="p-4 rounded-lg flex justify-between items-start bg-red-600"
                        >
                            <div className="flex flex-col space-y-1">
                                <img src={alumnus.ImageLink} alt={`${alumnus.Name}`} className="w-16 h-16 rounded-full mb-2" />
                                <p className="text-lg text-white font-semibold">{alumnus.Name}</p>
                                <p className="text-gray-200">Email: {alumnus['E-Mail']}</p>
                                <p className="text-gray-200">Admission No: {alumnus['Admission No']}</p>
                                <p className="text-gray-200">Expertise: {alumnus.Expertise}</p>
                                <p className="text-gray-200">Current Role: {alumnus['Current Role']}</p>
                                <p className="text-gray-200">Mobile: {alumnus['Mobile Number']}</p>
                                <p className="text-gray-200">Passing Year: {alumnus['Passing Year']}</p>
                                <a href={alumnus.LinkedIn} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                                    LinkedIn
                                </a>
                            </div>
                            <button
                                onClick={() => toggleVerification(alumnus._id, false, true)}
                                className="mt-2 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 transition duration-300 text-white"
                            >
                                Verify
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AlumniVerification;
