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

  // 🔹 Define page-specific background gradients
  const pageGradients = {
    "/dashboard": "from-purple-500 to-purple-200",
    "/account-info": "from-purple-500 to-purple-200",
    "/settings": "from-purple-500 to-purple-200",

    "/inventory": "from-teal-500 to-teal-200",
    "/sales": "from-red-500 to-red-200",
    "/purchase-orders": "from-yellow-500 to-yellow-200",
    "/return-warranty": "from-blue-500 to-blue-200",
    "/reports": "from-green-500 to-green-200",
  };

  const defaultGradient = "from-gray-100 to-white";
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
            className={`flex-1 p-2 bg-gradient-to-r ${gradientClass} overflow-auto transition-all duration-300`}
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
