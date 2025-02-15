import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar_Primary = () => {
  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: "🏠" },
    { name: "Purchase Orders", path: "/purchase-orders", icon: "📋" },
    { name: "Inventory", path: "/inventory", icon: "📦" },
    { name: "Sales", path: "/sales", icon: "💵" },
    { name: "Returns", path: "/return-warranty", icon: "🔄" },
  ];

  return (
    <div className="h-screen w-64 bg-purple-700 text-white fixed top-0 left-0 flex flex-col shadow-lg">
      {/* Logo Section */}
      <div className="p-4 text-center font-bold text-2xl bg-purple-800">
        PG Micro World
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
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Footer Section */}
      <div className="p-4 text-center text-sm bg-purple-800">
        &copy; 2025 PG Micro World
      </div>
    </div>
  );
};

export default Sidebar_Primary;
