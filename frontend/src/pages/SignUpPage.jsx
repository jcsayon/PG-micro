import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../config/supabaseClient";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",      // full name input
    email: "",
    password: "",
    role: "Admin", // default role; user can choose
  });
  const [error, setError] = useState("");

  // Update form fields
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle sign-up form submission with profile insertion
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Debug: log the form data
    console.log("Sending sign-up data:", formData);

    try {
      // First, sign up the user with email and password and pass extra data as metadata.
      const { data, error: signupError } = await supabase.auth.signUp(
        {
          email: formData.email,
          password: formData.password,
        },
        {
          data: {
            role: formData.role,
            name: formData.name,
          },
        }
      );

      if (signupError) {
        setError(signupError.message);
        return;
      }

      // Debug: Log the returned data from signup
      console.log("Signup data returned:", data);

      // After successful sign-up, insert the custom profile data into your profiles table.
      // Make sure your profiles table has columns "id", "role", and "name".
      // The user's ID is available from data.user (or data.user.id) depending on your Supabase version.
      const userId = data.user.id;
      const { error: profileError } = await supabase
        .from("profiles")
        .insert([{ id: userId, role: formData.role, name: formData.name }]);

      if (profileError) {
        setError("Profile creation error: " + profileError.message);
        return;
      }

      alert("Sign-up successful!");
      navigate("/"); // Redirect to login or dashboard
    } catch (err) {
      console.error("Sign-up error:", err);
      setError("An unexpected error occurred during sign-up.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-purple-600 mb-6">
          Create Account
        </h2>
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
              value={formData.role}
            >
              <option value="Employee">Employee</option>
              <option value="Inventory">Inventory</option>
              <option value="Sales">Sales</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
          >
            Sign Up
          </button>
        </form>
        <p className="text-sm text-gray-600 mt-4 text-center">
          Already have an account?{" "}
          <a href="/" className="text-purple-500 hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
