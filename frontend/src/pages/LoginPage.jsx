import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROLES } from "../utils/roleConfig";

const defaultUsers = [
  {
    id: 1,
    username: "admin@pgmicro.com",
    password: "admin123",
    role: ROLES.ADMIN,
    status: "Active",
    accessiblePages: ["dashboard", "user-management", "inventory", "sales"],
  },
  {
    id: 2,
    username: "sales@pgmicro.com",
    password: "sales123",
    role: ROLES.SALES,
    status: "Active",
    accessiblePages: ["dashboard", "sales"],
  },
  {
    id: 3,
    username: "inventory@pgmicro.com",
    password: "inventory123",
    role: ROLES.INVENTORY,
    status: "Active",
    accessiblePages: ["dashboard", "inventory"],
  },
  {
    id: 4,
    username: "returns@pgmicro.com",
    password: "returns123",
    role: ROLES.RETURNS,
    status: "Active",
    accessiblePages: ["dashboard", "return-warranty"],
  },
  {
    id: 5,
    username: "employee@pgmicro.com",
    password: "employee123",
    role: ROLES.EMPLOYEE,
    status: "Active",
    accessiblePages: ["dashboard"],
  },
];

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Improved initialization of users in local storage
  useEffect(() => {
    try {
      const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");

      const isInvalid = existingUsers.some((u) => !u.username && u.email);
      if (existingUsers.length === 0 || isInvalid) {
        localStorage.setItem("users", JSON.stringify(defaultUsers));
        console.log("Reinitialized default users in local storage");
      }
    } catch (error) {
      localStorage.setItem("users", JSON.stringify(defaultUsers));
      console.error("Error initializing users:", error);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    // Comprehensive logging
    console.group("Login Attempt");
    console.log("Raw Email Input:", email);
    console.log("Raw Password Input:", password);

    // Trim and validate inputs
    const trimmedEmail = (email || "").trim().toLowerCase();
    const trimmedPassword = (password || "").trim();

    console.log("Trimmed Email:", trimmedEmail);
    console.log("Trimmed Password:", trimmedPassword);

    try {
      // Retrieve users from local storage
      const storedUsersString = localStorage.getItem("users");
      console.log("Stored Users JSON:", storedUsersString);

      if (!storedUsersString) {
        localStorage.setItem("users", JSON.stringify(defaultUsers));
        setError("User data reset. Please try again.");
        return;
      }

      let users;
      try {
        users = JSON.parse(storedUsersString);
        console.log("Parsed Users:", users);
      } catch (parseError) {
        console.error("Parsing Error:", parseError);
        localStorage.setItem("users", JSON.stringify(defaultUsers));
        setError("User data could not be read. Resetting...");
        return;
      }

      // Detailed user matching logging
      console.log("User Matching Attempt:", {
        trimmedEmail,
        trimmedPassword,
        usersCount: users.length,
      });

      // Defensive user matching with detailed logging
      const matchedUsers = users.filter(
        (u) =>
          (u?.username || "").toLowerCase().trim() === trimmedEmail &&
          (u?.password || "") === trimmedPassword
      );

      console.log("Matched Users:", matchedUsers);
      console.groupEnd();

      const user = matchedUsers[0];

      if (user) {
        // Authentication successful
        sessionStorage.setItem("isAuthenticated", "true");
        sessionStorage.setItem("userRole", user.role);
        sessionStorage.setItem("userEmail", user.username);

        // Navigate based on role
        switch (user.role) {
          case ROLES.ADMIN:
            navigate("/dashboard");
            break;
          case ROLES.SALES:
            navigate("/sales");
            break;
          case ROLES.INVENTORY:
            navigate("/inventory");
            break;
          case ROLES.RETURNS:
            navigate("/return-warranty");
            break;
          default:
            navigate("/unauthorized");
        }
      } else {
        console.error("No matching user found", {
          inputEmail: trimmedEmail,
          inputPassword: trimmedPassword,
          availableUsers: users,
        });
        setError("Invalid email or password!");
      }
    } catch (error) {
      console.error("Unexpected Login Error:", error);
      setError("An unexpected error occurred. Please try again.");
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

        <form className="space-y-6 mt-6" onSubmit={handleLogin} autoComplete="on">
          <div className="relative">
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-purple-500">
              📧
            </span>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="username or email"
            />
          </div>

          <div className="relative">
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-purple-500">
              🔑
            </span>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="password"
            />
            <button
              type="button"
              aria-label="Toggle password visibility"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-purple-500 hover:text-purple-700"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
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