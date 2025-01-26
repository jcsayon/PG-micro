import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SupabaseProvider } from "../context/SupabaseContext";

const LoginPage = () => {
  const supabase = useSupabase();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
    } else {
      // Redirect to dashboard or handle successful login
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-purple-100" style={{ width: '1920px', height: '1080px' }}>
      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-md sm:w-11/12">
        <h1 className="text-2xl font-bold text-purple-600 text-center mb-6">
          PG Micro World Computers
        </h1>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              className="block w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 text-gray-900"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              className="block w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 text-gray-900"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Remember Me and Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <span className="ml-2 text-sm text-gray-700">Remember me</span>
            </label>
            <a href="#" className="text-sm text-purple-600 hover:underline">
              Forgot password?
            </a>
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
