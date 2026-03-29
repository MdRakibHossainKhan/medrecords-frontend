import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080",
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("medrecords_token");

        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }

        config.headers["x-role"] = "doctor";
        config.headers["x-sub"] = "auth-user-1";

        return config;
    },
    (error) => Promise.reject(error)
);

export default api;