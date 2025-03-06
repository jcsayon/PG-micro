import React, { useState, useEffect } from "react";
import Sidebar_Primary from "../components/Sidebar_Primary";
import Sidebar_Secondary from "../components/Sidebar_Secondary";
import Header from "../components/Header";
import { useLocation } from "react-router-dom";

const DashboardLayout = ({ children }) => {
  const location = useLocation();

  // ✅ Load the sidebar collapsed state from localStorage (persists across pages)
  const [isPrimaryCollapsed, setIsPrimaryCollapsed] = useState(
    localStorage.getItem("sidebarCollapsed") === "true"
  );
  const [isSecondaryVisible, setIsSecondaryVisible] = useState(true);

  // ✅ Update localStorage whenever primary sidebar state changes
  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", isPrimaryCollapsed);
  }, [isPrimaryCollapsed]);

  // ✅ Define pages where the Secondary Sidebar should be shown
  const showSidebarSecondary = [
    "/sales-list",
    "/sales-customer",
    "/purchase-order-list",
    "/purchase-order-supplier",
    "/return-warranty-list",
    "/return-warranty-form",
  ].includes(location.pathname);

  return (
    <div className="flex bg-gray-50 min-h-screen transition-all duration-300">
      {/* ✅ Primary Sidebar (Collapsible & Persistent) */}
      <Sidebar_Primary
        isCollapsed={isPrimaryCollapsed}
        toggleCollapse={() => setIsPrimaryCollapsed(!isPrimaryCollapsed)}
      />

      {/* ✅ Main Content Wrapper - Adjust margin dynamically */}
      <div
        className={`flex flex-grow transition-all duration-300 ${
          isPrimaryCollapsed ? "ml-16" : "ml-64"
        } ${showSidebarSecondary ? "mr-64" : ""}`}
      >
        {/* ✅ Secondary Sidebar - Only visible on specific pages */}
        {showSidebarSecondary && (
          <Sidebar_Secondary setIsSecondaryVisible={setIsSecondaryVisible} />
        )}

        {/* ✅ Main Content Area */}
        <div className="flex-1 flex flex-col transition-all duration-300">
          {/* Header */}
          <Header />

          {/* Page Content */}
          <main className="flex-1 p-8 bg-gray-100 overflow-auto transition-all duration-300">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
