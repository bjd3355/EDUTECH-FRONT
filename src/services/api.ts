// services/api.ts
import axios from "axios";

const API_URL = "http://localhost:3002/";

// Création de l'instance Axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwtToken");
  if (token) {
    config.headers.Authorization = Bearer ${token};
  }
  return config;
});


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log("Session expirée, veuillez vous reconnecter.");
      localStorage.removeItem("jwtToken");
      window.location.href = "/login";  
    }
    return Promise.reject(error);
  }
);

// Services Auth
export const AuthService = {
  login: (email: string, password: string) => api.post("auth/login", { email, password }),
  register: (username: string, password: string) => api.post("auth/register", { username, password }),
  getUserProfile: () => api.get("auth/profile"), 
};

export default api;