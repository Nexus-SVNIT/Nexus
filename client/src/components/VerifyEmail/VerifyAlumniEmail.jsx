import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

function VerifyAlumniEmail() {
    const { token } = useParams(); // Token from URL
    const navigate = useNavigate();
    const [verificationStatus, setVerificationStatus] = useState('Verifying...');

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/auth/alumni/verify/${token}`, {
                    method: 'GET'
                });

                const result = await res.json();
                if (res.ok) {
                    toast.success(result.message);
                    setVerificationStatus('Verification successful! Redirecting to login page...');
                    setTimeout(() => {
                        navigate('/login'); // Redirect to login page
                    }, 1500);
                } else {
                    toast.error(result.message || 'Verification failed');
                    setVerificationStatus('Verification failed. Please try again.');
                }
            } catch (error) {
                toast.error('Error verifying email');
                setVerificationStatus('Error occurred while verifying. Please try again.');
            }
        };
        setTimeout(() => {
            verifyEmail();
        }, 1500);
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black-2">
            <Toaster position="top-center" reverseOrder={false} />
            <div className="shadow-boxdark-2 p-8 rounded-lg shadow-lg">
                <div className='flex justify-center mb-5'>
                    <img
                        src="/assets/NEXUStext.png"
                        alt="NEXUS"
                        className="flex w-[20rem] items-center object-cover"
                    />
                </div>
                <h2 className="text-xl font-semibold mb-4 text-white">{verificationStatus}</h2>
            </div>
        </div>
    );
}

export default VerifyAlumniEmail;
