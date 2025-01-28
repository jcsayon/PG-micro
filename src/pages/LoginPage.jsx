import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        {/* Title Section */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-purple-800">
            PG MICRO WORLD COMPUTERS
          </h2>
        </div>

        {/* Tab Menu */}
        <div className="mt-6 flex justify-center space-x-6 border-b border-gray-300 pb-2">
          <a
            href="#"
            className="text-purple-800 font-semibold border-b-2 border-purple-600"
          >
            Login
          </a>
          <a
            href="#"
            className="text-gray-500 hover:text-purple-600 hover:border-purple-600 border-b-2"
          >
            Sign Up
          </a>
        </div>

        <form className="space-y-6 mt-6" onSubmit={handleLogin}>
          {/* Email Field */}
          <div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-purple-500">
                {/* Updated Email Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  />
                </svg>
              </span>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="username or email"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-purple-500">
                {/* Updated Password Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </span>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="password"
              />
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 text-sm text-gray-600">
                Remember me
              </label>
            </div>
            <a
              href="#"
              className="text-sm text-purple-500 hover:text-purple-400"
            >
              Forgot your password?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;