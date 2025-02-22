import React from "react";
import Sidebar_Primary from "../components/Sidebar_Primary";
import Header from "../components/Header";

const SalesDashboardLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar_Primary />
      <div className="flex-1 flex flex-col ml-64"> {/* Added ml-64 to account for the sidebar */}
        <Header />
        <main className="p-6 flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default SalesDashboardLayout;
