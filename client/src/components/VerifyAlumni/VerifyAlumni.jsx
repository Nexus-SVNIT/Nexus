import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import HeadTags from '../HeadTags/HeadTags';

function VerifyAlumni() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [verificationStatus, setVerificationStatus] = useState('verifying');

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const response = await fetch(
                    `${process.env.REACT_APP_BACKEND_BASE_URL}/auth/alumni/verify/${token}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );

                const data = await response.json();

                if (response.ok) {
                    setVerificationStatus('success');
                    toast.success('Email verified successfully!');
                    setTimeout(() => {
                        navigate('/login');
                    }, 3000);
                } else {
                    setVerificationStatus('error');
                    toast.error(data.message || 'Verification failed');
                }
            } catch (error) {
                setVerificationStatus('error');
                toast.error('Error verifying email');
            }
        };

        verifyEmail();
    }, [token, navigate]);

    return (
        <div className="bg-black-2 min-h-screen flex flex-col items-center justify-center p-4">
            <HeadTags
                title="Email Verification - NEXUS"
                description="Verify your email address for NEXUS alumni account"
            />
            <Toaster position="top-center" reverseOrder={false} />
            
            <div className="text-center">
                <img
                    src="/assets/NEXUStext.png"
                    alt="NEXUS"
                    className="w-64 mb-8 mx-auto"
                />
                
                <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
                    {verificationStatus === 'verifying' && (
                        <div className="text-white">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                            <p>Verifying your email...</p>
                        </div>
                    )}
                    
                    {verificationStatus === 'success' && (
                        <div className="text-green-400">
                            <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            <p>Email verified successfully!</p>
                            <p className="text-sm text-gray-300 mt-2">Redirecting to login page...</p>
                        </div>
                    )}
                    
                    {verificationStatus === 'error' && (
                        <div className="text-red-400">
                            <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <p>Verification failed</p>
                            <button 
                                onClick={() => navigate('/login')}
                                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                            >
                                Go to Login
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default VerifyAlumni;
