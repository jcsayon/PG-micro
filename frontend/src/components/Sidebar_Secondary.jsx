import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {Home, ClipboardList, Package, DollarSign, RotateCcw, LogOut} from "lucide-react";

const Sidebar_Secondary = () => {
  const navigate = useNavigate();
  
  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: Home },
    { name: "Purchase Orders", path: "/purchase-orders", icon: ClipboardList },
    { name: "Inventory", path: "/inventory", icon: Package },
    { name: "Sales", path: "/sales", icon: DollarSign },
    { name: "Returns", path: "/return-warranty", icon: RotateCcw },
  ];
  
  // Function to handle logout
  const handleLogout = () => {
    // Clear any auth tokens or session data
    localStorage.removeItem("authToken"); // Adjust based on your auth implementation
    
    // Redirect to login page
    navigate("/login");
  };

  return (
    <div className="h-screen w-64 bg-purple-700 text-white fixed top-0 left-0 flex flex-col shadow-lg">
      {/* Logo Section */}
      <div className="p-4 text-center font-bold text-2xl bg-purple-800">
        PG Micro World SECONDARY
      </div>

      {/* Menu Items */}
      <nav className="flex-1 mt-6">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          
          return (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-5 py-3 text-lg hover:bg-purple-600 transition ${
                  isActive ? "bg-purple-500 font-semibold" : ""
                }`
              }
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </NavLink>
          );
        })}
      </nav>
      
      {/* Logout Button - Added before footer */}
      <div className="mt-auto">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-5 py-3 text-lg w-full text-left hover:bg-purple-600 transition"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>

      {/* Footer Section */}
      <div className="p-4 text-center text-sm bg-purple-800">
        © 2025 PG Micro World
      </div>
    </div>
  );
};

export default Sidebar_Secondary;