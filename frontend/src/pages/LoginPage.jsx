import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../config/supabaseClient";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  // Update email & password in formData
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Sign in with Supabase and redirect to dashboard, with error handling for navigation.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (loginError) {
        setError(loginError.message);
        return;
      }

      if (data?.session) {
        const token = data.session.access_token;
        sessionStorage.setItem("token", token);
        console.log("Login successful, token stored.");

        try {
          navigate("/dashboard");
        } catch (navigationError) {
          console.error("Navigation error:", navigationError);
          setError("Login succeeded but failed to redirect to dashboard. Please try again.");
        }
      } else {
        setError("Login succeeded but no session was returned. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred during login. Please try again.");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-10">
        {/* Title */}
        <h2 className="text-2xl font-bold text-purple-800 text-center mb-4">
          PG MICRO WORLD COMPUTERS
        </h2>

        {/* Error Message */}
        {error && <p className="text-red-500 text-center mb-3">{error}</p>}

        {/* Login Form */}
        <form className="space-y-6 mt-4" onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-purple-500">
              📧
            </span>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-purple-500">
              🔑
            </span>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-purple-600 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 text-sm text-gray-600">
                Remember me
              </label>
            </div>
            <a href="#" className="text-sm text-purple-500 hover:text-purple-400">
              Forgot password?
            </a>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg"
          >
            Sign In
          </button>
        </form>

        {/* Sign Up Link */}
        <p className="text-sm text-gray-600 mt-6 text-center">
          Don't have an account?{" "}
          <a href="/signup" className="text-purple-500 font-medium hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
