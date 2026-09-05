import { useEffect } from 'react';

const QrRedirect = () => {
  useEffect(() => {
    const backendBaseUrl = process.env.REACT_APP_BACKEND_BASE_URL?.replace(/\/$/, '');

    if (backendBaseUrl) {
      window.location.replace(`${backendBaseUrl}/qr`);
    }
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white">
      <p>Redirecting...</p>
    </div>
  );
};

export default QrRedirect;
