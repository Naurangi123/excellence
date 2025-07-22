/* eslint-disable no-unused-vars */
// apiClient.js
import axios from "axios";
import {jwtDecode} from "jwt-decode";

const API_BASE_URL = "http://localhost:8000/api"; // 🔁 Change to your backend

// Create instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔍 Check if token is expired
function isTokenExpired(token) {
  if (!token) return true;
  try {
    const { exp } = jwtDecode(token);
    return Date.now() / 1000 > exp;
  } catch (e) {
    return true;
  }
}

// 🔐 Request Interceptor: Refresh token before request if expired
apiClient.interceptors.request.use(
  async (config) => {
    const accessToken = sessionStorage.getItem("accessToken");
    const refreshToken = sessionStorage.getItem("refreshToken");

    if (accessToken && isTokenExpired(accessToken) && refreshToken) {
      try {
        const res = await axios.post(`${API_BASE_URL}/token/refresh/`, {
          refresh: refreshToken,
        });

        const newAccessToken = res.data.access;
        sessionStorage.setItem("accessToken", newAccessToken);
        config.headers["Authorization"] = `Bearer ${newAccessToken}`;
      } catch (err) {
        console.error("Refresh token failed", err);
        sessionStorage.clear();
        window.location.href = "/";
        throw err;
      }
    } else if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 🔁 Response Interceptor: Handle unexpected 401s
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const refreshToken = sessionStorage.getItem("refreshToken");

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      refreshToken
    ) {
      originalRequest._retry = true;
      try {
        const res = await axios.post(`${API_BASE_URL}/token/refresh/`, {
          refresh: refreshToken,
        });

        const newAccessToken = res.data.access;
        sessionStorage.setItem("accessToken", newAccessToken);
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (err) {
        console.error("Token refresh failed after 401", err);
        sessionStorage.clear();
        window.location.href = "/";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

// API FUNCTIONS

export const getTodos = async () => {
  try {
    const response = await apiClient.get("/todos/");
    return response;
  } catch (error) {
    console.error("Error fetching todos:", error);
    throw error;
  }
};

export const createTodo = async (todoData) => {
  try {
    const response = await apiClient.post("/todos/", todoData);
    return response.data;
  } catch (error) {
    console.error("Error creating todo:", error);
    throw error;
  }
};

export const updateTodo = async (id, todoData) => {
  try {
    const response = await apiClient.patch(`/todos/${id}/`, todoData);
    return response.data;
  } catch (error) {
    console.error("Error updating todo:", error);
    throw error;
  }
};

export const deleteTodo = async (id) => {
  try {
    const response = await apiClient.delete(`/todos/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Error deleting todo:", error);
    throw error;
  }
};

export const login = async (credentials) => {
  try {
    const response = await apiClient.post("/login/", credentials);
    print(response)
    // const { accessToken, refreshToken, role } = response;
    // sessionStorage.setItem("access", accessToken);
    // sessionStorage.setItem("refresh", refreshToken);
    // sessionStorage.setItem("role", role);
    return response;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

export const register = async (userData) => {
  try {
    const response = await apiClient.post("/register/", userData);
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

export const getUserProfile = async () => {
  try {
    const response = await apiClient.get("/profile/");
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};
