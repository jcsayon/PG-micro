// Sidebar_Primary.jsx
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

const Sidebar_Primary = ({ isCollapsed: propCollapsed, toggleCollapse: propToggleCollapse }) => {
  // Use prop if provided, else fallback to internal state
  const [internalCollapsed, setInternalCollapsed] = useState(
    localStorage.getItem("sidebarCollapsed") === "true"
  );
  const isCollapsed = propCollapsed !== undefined ? propCollapsed : internalCollapsed;

  const toggleSidebar = () => {
    if (propToggleCollapse) {
      propToggleCollapse();
    } else {
      setInternalCollapsed(!internalCollapsed);
    }
  };

  // Only update localStorage when using internal state
  useEffect(() => {
    if (propCollapsed === undefined) {
      localStorage.setItem("sidebarCollapsed", internalCollapsed);
    }
  }, [internalCollapsed, propCollapsed]);

  const menuItems = [
    { name: "Home", path: "/dashboard", icon: "🏠" },
    { name: "Account Info", path: "/account-info", icon: "👤" },
    { name: "Settings", path: "/settings", icon: "⚙️" },
    { name: "Inventory", path: "/inventory", icon: "📦" },
  ];

  return (
    <div
      className={`h-screen ${isCollapsed ? "w-16" : "w-64"} bg-purple-700 text-white fixed top-0 left-0 flex flex-col shadow-lg transition-all duration-300`}
    >
      {/* Logo Section */}
      <div className="p-4 text-center font-bold text-2xl bg-purple-800">
        {!isCollapsed && "PG Micro World PRIMARY"}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 mt-6">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-5 py-3 text-lg hover:bg-purple-600 transition ${
                isActive ? "bg-purple-500 font-semibold" : ""
              }`
            }
          >
            <span>{item.icon}</span>
            {!isCollapsed && item.name}
          </NavLink>
        ))}
      </nav>

      {/* Toggle Button */}
      <button
        className="absolute top-1/2 -right-4 transform -translate-y-1/2 bg-purple-800 border-2 border-purple-800 text-white px-4 py-2 mr-2 hover:bg-purple-700 rounded text-xl"
        onClick={toggleSidebar}
      >
        {isCollapsed ? "›" : "‹"}
      </button>

      {/* Footer Section */}
      <div className="p-4 text-center text-sm bg-purple-800">
        {!isCollapsed && "© 2025 PG Micro World"}
      </div>
    </div>
  );
};

export default Sidebar_Primary;
