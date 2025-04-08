import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('isAuthenticated'); // Important: Remove the auth flag used in your ProtectedRoute
    sessionStorage.removeItem('userRole'); // Also remove the role used in your ProtectedRoute
    
    // Clear any cookies
    document.cookie.split(";").forEach((cookie) => {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    });
    
    // Redirect to login page (which is at root '/' in your case)
    navigate('/', { replace: true });
  };

  return (
    <header className="bg-purple-100 shadow h-16 flex items-center justify-between px-8">
      {/* Left side - Dashboard label */}
      <div className="flex items-center">
        <h1 className="text-xl font-bold text-purple-600">PG Micro Dashboard</h1>
      </div>

      {/* Right side - User profile */}
      <div className="flex items-center gap-3">
        <span className="text-white bg-purple-500 py-1 px-4 rounded-full text-sm font-medium shadow-sm">
          Admin
        </span>
        
        {/* Logout button */}
        <button 
          onClick={handleLogout}
          className="text-purple-600 hover:text-purple-800 hover:bg-purple-100 rounded-full p-1.5 transition-colors"
          aria-label="Logout"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth={2}
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
            />
          </svg>
        </button>
        
        {/* User avatar */}
        <div className="w-10 h-10 rounded-full border bg-white shadow-sm flex items-center justify-center">
          <svg
            className="w-6 h-6 text-gray-400"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              fillRule="evenodd"
              d="M12 2a5 5 0 00-5 5v1a5 5 0 0010 0V7a5 5 0 00-5-5zm-7 18a7 7 0 0114 0v1H5v-1z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </header>
  );
};

export default Header;