import axios from "axios";

// The backend mounts every route under /api/v1 (see backend/server.js),
// so the base URL must include /v1.
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1",
  headers: {
    "Content-Type": "application/json"
  }
});

export function getToken() {
  return sessionStorage.getItem("token");
}

export function clearToken() {
  localStorage.removeItem("token");
  sessionStorage.removeItem("token");
}

// Attach the JWT to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// If the token is missing/expired, drop the session and go to the login page
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || "";
    const isAuthCall = url.includes("/auth/");

    if (error.response?.status === 401 && !isAuthCall && getToken()) {
      clearToken();
      sessionStorage.removeItem("loggedInStudent");
      sessionStorage.removeItem("loggedInAdmin");
      window.location.assign("/login");
    }

    return Promise.reject(error);
  }
);

export default apiClient;
