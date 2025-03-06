import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../config/supabaseClient";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "Employee", // Default role
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Create user in Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: user.email,
        password: user.password,
      });

      if (error) {
        setError(error.message);
      } else {
        // Insert user into `profiles` table
        await supabase.from("profiles").insert([
          { email: user.email, name: user.name, role: user.role }
        ]);

        alert("Sign-up successful! Redirecting to Login...");
        navigate("/");
      }
    } catch (err) {
      setError("An error occurred during sign-up.");
      console.error("Sign-up error:", err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-purple-600 mb-6">Create Account</h2>
        {error && <p className="text-red-500 text-center mb-3">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              className="w-full p-2 border border-gray-300 rounded"
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              placeholder="johndoe@example.com"
              className="w-full p-2 border border-gray-300 rounded"
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              className="w-full p-2 border border-gray-300 rounded"
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Role</label>
            <select
              name="role"
              className="w-full p-2 border border-gray-300 rounded"
              onChange={handleChange}
            >
              <option value="Employee">Employee</option>
              <option value="Inventory">Inventory</option>
              <option value="Sales">Sales</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700">
            Sign Up
          </button>
        </form>
        <p className="text-sm text-gray-600 mt-4 text-center">
          Already have an account? <a href="/" className="text-purple-500 hover:underline">Log in</a>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
