import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar_Primary from "../components/Sidebar_Primary";
import Header from "../components/Header";

const DashboardLayout = ({ children }) => {
  const [isPrimaryCollapsed, setIsPrimaryCollapsed] = useState(
    localStorage.getItem("sidebarCollapsed") === "true"
  );

  const location = useLocation();

  // Persist sidebar state
  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", isPrimaryCollapsed);
  }, [isPrimaryCollapsed]);

  // 🔹 Define page-specific background gradients - UPDATED TO ALL WHITE
  const pageGradients = {
    "/dashboard": "bg-white",
    "/account-info": "bg-white",
    "/settings": "bg-white",
    "/inventory": "bg-white",
    "/sales": "bg-white",
    "/purchase-orders": "bg-white",
    "/return-warranty": "bg-white",
    "/reports": "bg-white",
  };

  const defaultGradient = "bg-white";
  const gradientClass = pageGradients[location.pathname] || defaultGradient;

  return (
    <div className="flex bg-gray-50 min-h-screen transition-all duration-300">
      {/* Sidebar */}
      <Sidebar_Primary
        isCollapsed={isPrimaryCollapsed}
        toggleCollapse={() => setIsPrimaryCollapsed(!isPrimaryCollapsed)}
      />

      {/* Main Content Area */}
      <div
        className={`flex flex-grow transition-all duration-300 ${
          isPrimaryCollapsed ? "ml-16" : "ml-64"
        }`}
      >
        <div className="flex-1 flex flex-col transition-all duration-300">
          {/* Header */}
          <Header />

          {/* Page Content with dynamic background */}
          <main
            className={`flex-1 p-2 bg-gradient-to-r ${gradientClass} transition-all duration-300`}
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;