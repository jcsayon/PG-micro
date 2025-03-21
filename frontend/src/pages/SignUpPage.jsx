import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { createClient } from "@supabase/supabase-js"; // Uncomment this when enabling Supabase

// const supabaseUrl = "https://your-supabase-url.supabase.co"; // Replace with your Supabase URL
// const supabaseAnonKey = "your-anon-key"; // Replace with your Supabase API Key
// const supabase = createClient(supabaseUrl, supabaseAnonKey);

const SignUpPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "Employee", // Default role
  });

  // Temporary user storage
  const [tempUsers, setTempUsers] = useState([]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // TEMPORARY: Add user to local state for testing
    setTempUsers([...tempUsers, user]);
    console.log("Temporary Users:", tempUsers);

    // Uncomment below for Supabase integration
    /*
    const { data, error } = await supabase.auth.signUp({
      email: user.email,
      password: user.password,
    });

    if (error) {
      alert("Error signing up: " + error.message);
    } else {
      // Store user role in database
      await supabase.from("Users").insert([{ email: user.email, role: user.role }]);
      alert("Sign-up successful!");
      navigate("/dashboard");
    }
    */

    alert("Temporary Sign-Up Successful! (Database connection is commented out)");
    navigate("/dashboard");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-purple-600 mb-6">Create Account</h2>
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