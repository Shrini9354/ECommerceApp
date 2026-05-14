import axios from "axios";

const API_URL = "http://127.0.0.1:5107/api";

// Get token from localStorage
const getToken = () => localStorage.getItem("token");

// Axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to every request automatically
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth services
export const login = (data) => api.post("/auth/login", data);
export const register = (data) => api.post("/auth/register", data);

// Product services
export const getProducts = () => api.get("/products");
export const getProduct = (id) => api.get(`/products/${id}`);
export const createProduct = (data) => api.post("/products", data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

// Order services
export const placeOrder = (data) => api.post("/orders", data);
export const getMyOrders = () => api.get("/orders");