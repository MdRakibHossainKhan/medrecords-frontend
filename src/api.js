import axios from "axios";

// Create a custom Axios instance pointing to your Node.js server
const api = axios.create({
    baseURL: "http://localhost:8080",
});

// This intercepts every request before it leaves the frontend
// We will use this later to automatically attach the Doctor's login token!
api.interceptors.request.use(
    (config) => {
        // For testing your backend right now, we will hardcode the doctor role
        // Once Cognito is set up, we will swap this for real tokens
        config.headers["x-role"] = "doctor";
        config.headers["x-sub"] = "demo-doctor-sub";

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;