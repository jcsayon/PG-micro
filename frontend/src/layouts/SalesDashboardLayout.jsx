import React from "react";
import SalesSidebar from "../components/SalesSidebar";
import Header from "../components/Header";

const SalesDashboardLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <SalesSidebar /> {/* Sidebar should be included ONLY here */}
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-6 flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default SalesDashboardLayout;
