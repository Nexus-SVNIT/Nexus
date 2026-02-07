import axios from "axios";
import { toast } from "react-hot-toast";

// Safety: Ensure we don't crash if the env var is missing (e.g. during local dev setup)
const BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;

const API = axios.create({
    baseURL: BASE_URL,
});

/* ---------------- REQUEST INTERCEPTOR ---------------- */
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ---------------- RESPONSE INTERCEPTOR ---------------- */
let isRedirecting = false; // Flag to prevent spamming toasts

API.interceptors.response.use(
    (response) => {
        return {
            success: true,
            data: response.data,
        }
    },
    (error) => {
        // 1. CHECK FOR 401 (Unauthorized)
        if (error.response && error.response.status === 401) {
            
            const token = localStorage.getItem('token');
            
            // Only redirect if we have a token (to avoid loops on public pages)
            // AND if we aren't already in the middle of redirecting
            if (token && !isRedirecting) {
                isRedirecting = true; // Lock it so we don't spawn 10 toasts
                
                console.warn("Session expired (401). Logging out...");

                // 2. SHOW TOAST
                toast.error("Session expired! Redirecting to login...", {
                    duration: 2000, // Make sure it stays visible
                });
                
                // 3. REMOVE TOKEN
                localStorage.removeItem('token');
                
                // 4. DELAY REDIRECT (So user can read the toast)
                setTimeout(() => {
                    window.location.href = `/login?redirect_to=${encodeURIComponent(window.location.pathname)}`;
                    isRedirecting = false; // Reset flag (though page reload usually handles this)
                }, 1500); // Wait 1.5 seconds
            }
        }

        const message = error.response?.data?.message || 'Something went Wrong.';

        return {
            success: false,
            message,
        };
    }

    return Promise.reject(error);
  }
);
export default API;
