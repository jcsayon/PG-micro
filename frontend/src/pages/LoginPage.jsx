import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Temporary User Data for Testing
const tempUsers = [
  { email: "admin@pgmicro.com", password: "admin123", role: "Admin" },
  { email: "employee@pgmicro.com", password: "employee123", role: "Employee" },
];

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    const user = tempUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      // Set session data
      sessionStorage.setItem("isAuthenticated", "true");
      sessionStorage.setItem("userRole", user.role);
      sessionStorage.setItem("userEmail", user.email);

      // Redirect based on role
      if (user.role === "Admin") {
        alert("Welcome Admin! Redirecting to Dashboard...");
        navigate("/dashboard");
      } else if (user.role === "Employee") {
        alert("Welcome Employee! Redirecting to Home...");
        navigate("/inventory"); // or change to a route Employee is allowed to access
      }
    } else {
      setError("Invalid email or password!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-purple-800">
            PG MICRO WORLD COMPUTERS
          </h2>
        </div>

        <div className="mt-6 flex justify-center border-b border-gray-300 pb-2">
          <span className="text-purple-800 font-semibold border-b-2 border-purple-600">
            Login
          </span>
        </div>

        {error && <p className="text-red-500 text-center mt-4">{error}</p>}

        <p className="text-sm text-center text-gray-500 mt-2">
          Only Admins can create accounts for employees.
        </p>

        <form className="space-y-6 mt-6" onSubmit={handleLogin}>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-purple-500">
              📧
            </span>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="username or email"
            />
          </div>

          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-purple-500">
              🔑
            </span>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="password"
            />
          </div>

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
            <a href="#" className="text-sm text-purple-500 hover:text-purple-400">
              Forgot your password?
            </a>
          </div>

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
