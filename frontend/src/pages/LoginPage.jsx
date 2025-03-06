import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../config/supabaseClient";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Supabase Auth API Call
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message || "Invalid email or password.");
      } else {
        sessionStorage.setItem("isAuthenticated", "true");
        sessionStorage.setItem("userRole", data.user.role || "Employee");
        navigate("/dashboard");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Login error:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-10">
        <h2 className="text-2xl font-bold text-purple-800 text-center mb-4">
          PG MICRO WORLD COMPUTERS
        </h2>

        {error && <p className="text-red-500 text-center mb-3">{error}</p>}

        <form className="space-y-6 mt-4" onSubmit={handleLogin}>
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-purple-500">📧</span>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-purple-500">🔑</span>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-purple-600 border-gray-300 rounded" />
              <label htmlFor="remember-me" className="ml-2 text-sm text-gray-600">Remember me</label>
            </div>
            <a href="#" className="text-sm text-purple-500 hover:text-purple-400">Forgot password?</a>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg"
          >
            Sign In
          </button>
        </form>

        <p className="text-sm text-gray-600 mt-6 text-center">
          Don't have an account? <a href="/signup" className="text-purple-500 font-medium hover:underline">Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
