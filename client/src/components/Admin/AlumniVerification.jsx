import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

function AlumniVerification() {
    const [alumni, setAlumni] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAlumni();
    }, []);

    const fetchAlumni = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/user/alumni/pending`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('core-token')}`
                }
            });
            const data = await response.json();
            setAlumni(data);
            setLoading(false);
        } catch (error) {
            toast.error('Error fetching alumni');
            setLoading(false);
        }
    };

    const handleVerify = async (id) => {
        const toastId = toast.loading('Verifying alumni...');
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/user/alumni/verify/${id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('core-token')}`
                }
            });

            if (response.ok) {
                toast.success('Alumni verified successfully', { id: toastId });
                fetchAlumni(); // Refresh the list
            } else {
                toast.error('Error verifying alumni', { id: toastId });
            }
        } catch (error) {
            toast.error('Error verifying alumni', { id: toastId });
        }
    };

    const handleReject = async (id) => {
        const toastId = toast.loading('Rejecting alumni...');
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/user/alumni/reject/${id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('core-token')}`
                }
            });

            if (response.ok) {
                toast.success('Alumni rejected', { id: toastId });
                fetchAlumni(); // Refresh the list
            } else {
                toast.error('Error rejecting alumni', { id: toastId });
            }
        } catch (error) {
            toast.error('Error rejecting alumni', { id: toastId });
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Alumni Verification</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-800 text-white">
                    <thead>
                        <tr>
                            <th className="px-4 py-2">Name</th>
                            <th className="px-4 py-2">Admission Number</th>
                            <th className="px-4 py-2">Branch</th>
                            <th className="px-4 py-2">Email</th>
                            <th className="px-4 py-2">LinkedIn</th>
                            <th className="px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {alumni.map((user) => (
                            <tr key={user._id} className="border-t border-gray-700">
                                <td className="px-4 py-2">{user.fullName}</td>
                                <td className="px-4 py-2">{user.admissionNumber}</td>
                                <td className="px-4 py-2">{user.branch}</td>
                                <td className="px-4 py-2">{user.personalEmail}</td>
                                <td className="px-4 py-2">
                                    <a 
                                        href={user.linkedInProfile}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-400 hover:text-blue-300 underline"
                                    >
                                        View Profile
                                    </a>
                                </td>
                                <td className="px-4 py-2 space-x-2">
                                    <button
                                        onClick={() => handleVerify(user._id)}
                                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                                    >
                                        Verify
                                    </button>
                                    <button
                                        onClick={() => handleReject(user._id)}
                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                    >
                                        Reject
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AlumniVerification;
