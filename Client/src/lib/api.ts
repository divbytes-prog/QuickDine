import axios from "axios";

const defaultApiUrl = import.meta.env.PROD
    ? "https://quick-dine-server-five-phi.vercel.app/api"
    : "http://localhost:5000/api";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || defaultApiUrl,
    headers: {
        "Content-Type": "application/json",
    }
})

// Request interceptor to attach JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config;
    },
    (error) => {
        return Promise.reject(error)
    }
)
