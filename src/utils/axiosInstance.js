// utils/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://project-10-bank-api-78ns.onrender.com/api/v1/",
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;