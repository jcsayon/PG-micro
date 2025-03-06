// frontend/src/components/Sidebar_Secondary.jsx
import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const Sidebar_Secondary = () => {
  const [isCollapsed, setIsCollapsed] = useState(false); // State for sidebar visibility

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: "🏠" },
    { name: "Purchase Orders", path: "/purchase-orders", icon: "📋" },
    { name: "Inventory", path: "/inventory", icon: "📦" },
    { name: "Sales", path: "/sales", icon: "💵" },
    { name: "Returns", path: "/return-warranty", icon: "🔄" },
  ];

  return (
    <div className={`h-screen ${isCollapsed ? "w-16" : "w-64"} bg-purple-700 text-white fixed top-0 left-0 flex flex-col shadow-lg transition-all duration-300`}>
      {/* Logo Section */}
      <div className="p-4 text-center font-bold text-2xl bg-purple-800">
        {!isCollapsed && "PG Micro World SECONDARY"}
      </div>

      {/* Menu Items */}
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
        className="absolute top-1/2 -right-4 transform -translate-y-1/2 bg-purple-800 border-2 border-purple-800 text-white px-4 py-2 mb-4 block p-2 mr-2 hover:bg-purple-700 hover:border-2 hover:border-purple-800 rounded text-xl"
        onClick={() => setIsCollapsed(!isCollapsed)}
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

export default Sidebar_Secondary;
