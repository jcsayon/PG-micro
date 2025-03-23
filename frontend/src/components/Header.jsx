import React from "react";
import { useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();

  return (
    <header className="bg-white shadow h-16 flex items-center justify-between px-8">
      {/* ✅ Show heading only on /dashboard */}
      {location.pathname === "/dashboard" ? (
        <h1 className="text-xl font-bold text-purple-600">PG Micro Dashboard</h1>
      ) : (
        <div />
      )}

      <div className="flex items-center gap-4">
        <span className="text-black bg-purple-400 w-[150px] rounded flex items-center justify-center">Joshua Sayon III</span>
        {/* ✅ Replaced img with SVG */}
        <div className="w-10 h-10 rounded border bg-gray-300 flex items-center justify-center">
          <svg
            className="w-6 h-6 text-white"
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
