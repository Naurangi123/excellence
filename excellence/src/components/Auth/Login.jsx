import React, { useState } from "react";
import { login } from "../../services/apiServices";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const [form, setForm] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("username", form.username);
            formData.append("password", form.password);

            const data = await login(formData); 
            console.log("2",data.data)
            const { access, refresh, role } = data.data;

            sessionStorage.setItem("accessToken", access);
            sessionStorage.setItem("refreshToken", refresh);
            sessionStorage.setItem("role", role);
            alert("Login successful!");
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.non_field_errors?.[0] || err.message);
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-900 text-white">
            <div className="bg-gray-800 p-8 rounded-xl shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                {error && <p className="text-red-400 mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="username"
                        name="username"
                        placeholder="Username"
                        value={form.username}
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
                    <button className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded">Login</button>
                </form>
                <p className="mt-4 text-center">
                    No account?{" "}
                    <button onClick={() => navigate("/register")} className="text-blue-400 hover:underline">
                        Register here
                    </button>
                </p>
            </div>
        </div>
    );
}
