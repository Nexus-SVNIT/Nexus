import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

function VerifyEmail() {
    const { token } = useParams(); // Token from URL
    const navigate = useNavigate();
    const [verificationStatus, setVerificationStatus] = useState('Verifying...');
    const [isFailed, setIsFailed] = useState(false);

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/auth/verify/${token}`, {
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
                    setVerificationStatus(result.message || 'Verification link is invalid or has expired.');
                    setIsFailed(true);
                }
            } catch (error) {
                toast.error('Error verifying email');
                setVerificationStatus('Error occurred while verifying. Please try again.');
                setIsFailed(true);
            }
        };
        setTimeout(() => {
            verifyEmail();
        }, 1500);
    }, [token, navigate]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black-2 px-4">
            <Toaster position="top-center" reverseOrder={false} />
            <div className="shadow-boxdark-2 p-8 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl text-center max-w-md w-full">
                <div className='flex justify-center mb-5'>
                    <img
                        src="/assets/NEXUStext.png"
                        alt="NEXUS"
                        className="flex w-[16rem] items-center object-cover"
                    />
                </div>
                <h2 className="text-lg font-semibold mb-3 text-white">{verificationStatus}</h2>
                {isFailed && (
                    <button
                        onClick={() => navigate('/login?resend=true')}
                        className="mt-3 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 hover:from-blue-500 hover:to-cyan-400 transition-all cursor-pointer"
                    >
                        Go to Login & Resend Link
                    </button>
                )}
            </div>
        </div>
    );
}

export default VerifyEmail;
