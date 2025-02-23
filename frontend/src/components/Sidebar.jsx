import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const links = [
    { name: "Home", path: "/dashboard", icon: "🏠" },
    { name: "Account Info", path: "/account-info", icon: "👤" },
    { name: "Settings", path: "/settings", icon: "⚙️" },
    { name: "Inventory", path: "/inventory", icon: "📦" },
  ];

  return (
    <aside className="h-screen w-64 bg-purple-800 text-white fixed top-0 left-0 flex flex-col shadow-lg z-50">
      {/* Logo */}
      <div className="p-6 text-center font-bold text-2xl bg-purple-900">
        PG Micro World
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 mt-4">
        <ul className="space-y-2">
          {links.map((link, index) => (
            <li key={index}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-5 py-3 text-lg transition-all duration-300 ${
                    isActive ? "bg-purple-600 font-bold" : "hover:bg-purple-700"
                  }`
                }
              >
                <span className="text-xl">{link.icon}</span>
                {link.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 text-center text-xs bg-purple-900">
        &copy; 2025 PG Micro World
      </div>
    </aside>
  );
};

export default Sidebar;
