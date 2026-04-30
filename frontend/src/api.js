import axios from "axios";

export const API = axios.create({
  //baseURL: "https://prodesk-capstone-taskmatrix-1-4ge3.onrender.com/api"
  baseURL: "http://localhost:5000/api"
});

// 🔐 Automatically attach token to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = token;
  }

  return req;
});