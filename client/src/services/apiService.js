import axios from "axios";

const API = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_BASE_URL,
});

/* ---------------- REQUEST ---------------- */
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


/* ---------------- RESPONSE ---------------- */
API.interceptors.response.use(
    (response) => response.data,   // simpler, don't wrap

    (error) => {
        const status = error.response?.status;

        /* ---- 401 → logout ---- */
        if (status === 401) {
            console.warn("Session expired. Logging out...");

            localStorage.removeItem("token");

            // safer than window.location.href
            window.location.replace("/login");
        }

        /* ---- forward proper error ---- */
        return Promise.reject({
            message: error.response?.data?.message || "Something went wrong",
            status,
            original: error,
        });
    }
);

export default API;
