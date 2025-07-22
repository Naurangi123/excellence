import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/Auth/Login";
import RegisterPage from "./components/Auth/Register";
import HomePage from "./pages/HomePage";
import "./index.css";
import ProtectedRoute from "./components/ProtectedRoute";
import TodoApp from "./components/Todo";
import Dashboard from "./pages/Dashboard";
import Navbar from "./layout/Navbar";


export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/todos"
          element={
            <ProtectedRoute>
              <TodoApp />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
