import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar_Primary from "../components/Sidebar_Primary";

const DamagedProductsPage = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [damagedProducts, setDamagedProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    generateDummyData();
    localStorage.setItem("sidebarCollapsed", isSidebarCollapsed);
  }, [isSidebarCollapsed]);

  /** 🔹 Dummy Data for Placeholder */
  const generateDummyData = () => {
    const damagedData = Array.from({ length: 20 }, (_, i) => ({
      id: i + 100,
      category: ["Laptop", "Mouse", "Router", "Switch", "RAM"][i % 5],
      serialNumber: `SN-DMG${20000 + i}`,
      reason: ["Defective", "Damaged in transit", "Expired warranty"][i % 3],
      location: `Warehouse ${String.fromCharCode(65 + (i % 5))}`,
      reportedDate: new Date(2024, i % 12, (i % 28) + 1).toLocaleDateString(),
    }));
    setDamagedProducts(damagedData);
  };

  return (
    <div className="flex h-screen">
      <Sidebar_Primary
        isCollapsed={isSidebarCollapsed}
        toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <div
        className={`flex-1 p-6 transition-all duration-300 ${
          isSidebarCollapsed ? "ml-16" : "ml-64"
        }`}
      >
        <h1 className="text-3xl font-bold text-red-700 mb-6">
          Damaged Products
        </h1>

        <button
          onClick={() => navigate(-1)}
          className="bg-gray-500 text-white px-4 py-2 rounded mb-4 hover:bg-gray-700"
        >
          Back to Inventory
        </button>

        <div className="bg-white shadow-lg rounded-lg p-4 border border-gray-300">
          <h2 className="text-xl font-semibold text-blue-700 mb-4">
            List of Damaged Products
          </h2>
          <div className="overflow-y-auto max-h-[70vh]">
            <table className="min-w-full border border-gray-200 rounded">
              <thead className="sticky top-0 bg-red-200 text-left text-sm font-medium text-gray-800">
                <tr>
                  <th className="p-3 border">ID</th>
                  <th className="p-3 border">Category</th>
                  <th className="p-3 border">Serial Number</th>
                  <th className="p-3 border">Reason</th>
                  <th className="p-3 border">Location</th>
                  <th className="p-3 border">Reported Date</th>
                </tr>
              </thead>
              <tbody>
                {damagedProducts.map((item) => (
                  <tr key={item.id} className="text-sm text-gray-700 border-t">
                    <td className="p-3 border">{item.id}</td>
                    <td className="p-3 border">{item.category}</td>
                    <td className="p-3 border">{item.serialNumber}</td>
                    <td className="p-3 border">{item.reason}</td>
                    <td className="p-3 border">{item.location}</td>
                    <td className="p-3 border">{item.reportedDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DamagedProductsPage;
