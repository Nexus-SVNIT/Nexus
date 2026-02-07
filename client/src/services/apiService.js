import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_BASE_URL,
});

console.log("API instance loaded");

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
let isRedirecting = false;

API.interceptors.response.use(
  (response) => response.data,

  (error) => {
    const status = error.response?.status;

    console.log("Interceptor hit:", status);

    
    if (status === 401 && !isRedirecting) {
      isRedirecting = true;

      localStorage.removeItem("token");

      
      window.location.pathname = "/login";
    }

    return Promise.reject(error);
  }
);

export default API;
