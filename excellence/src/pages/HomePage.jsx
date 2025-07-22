import React from "react";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const role = sessionStorage.getItem("role");

  const navigate = useNavigate();

  const handleLogout = () => {
  sessionStorage.clear();
  alert("You have been logged out.");
  navigate("/");
};

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-4">Welcome to the Dashboard</h1>
      <p>Your role: <span className="text-blue-400">{role}</span></p>
      <p className="mt-4">See Todos</p>
        <button
          onClick={() => navigate("/todos")}
          className="mt-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          View Todos
        </button>
      
      <button
        onClick={handleLogout}
        className="mt-6 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded">
        Logout
      </button>
    </div>
  );
}
