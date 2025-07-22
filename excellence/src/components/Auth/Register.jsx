import React, { useState } from "react";
import { register } from "../../services/apiServices";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [form, setForm] = useState({ username: "", email: "", password: "", role: "user" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await register(form.name, form.email, form.password);
//       alert("Registration successful! Please login.");
//       navigate("/");
//     } catch (err) {
//       setError(err.message);
//     }
//   };

    const handleSubmit = async (e) => {
            e.preventDefault();
            try {
                const formData = new FormData();
                formData.append("email", form.email);
                formData.append("password", form.password);
                formData.append("username", form.username);
                formData.append("role", form.role);
    
                await register(formData); 
                alert("Register successful!");
                navigate("/login");
            } catch (err) {
                setError(err.response?.data?.non_field_errors?.[0] || err.message);
            }
        };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        {error && <p className="text-red-400 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
            <input
            type="role"
            name="role"
            placeholder="Role"
            value={form.role}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-gray-700 rounded focus:outline-none"
          />
          <input
            type="text"
            name="username"
            placeholder="username"
            value={form.username}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-gray-700 rounded focus:outline-none"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-gray-700 rounded focus:outline-none"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-gray-700 rounded focus:outline-none"
          />
          <button className="w-full bg-green-600 hover:bg-green-700 py-2 rounded">Register</button>
        </form>
        <p className="mt-4 text-center">
          Already have an account?{" "}
          <button onClick={() => navigate("/")} className="text-blue-400 hover:underline">
            Login
          </button>
        </p>
      </div>
    </div>
  );
}
