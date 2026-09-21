import axios from "axios";

const productionApiUrl = "https://quick-dine-server-five-phi.vercel.app/api";
const apiBaseUrl = import.meta.env.PROD
    ? productionApiUrl
    : import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const api = axios.create({
    baseURL: apiBaseUrl,
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
