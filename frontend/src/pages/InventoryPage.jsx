import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar_Primary from "../components/Sidebar_Primary";

const InventoryPage = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [inventory, setInventory] = useState([
    {
      id: 1,
      serialNumber: "SN12345",
      category: "Laptop",
      quantityReceived: 20,
      quantityAvailable: 15,
      stockStatus: "In Stock",
      location: "Warehouse A",
      Brand: "2024-02-24",
      sellingPrice: "₱800.00",
    },
    {
      id: 2,
      serialNumber: "SN67890",
      category: "Mouse",
      quantityReceived: 50,
      quantityAvailable: 30,
      stockStatus: "In Stock",
      location: "Warehouse B",
      Brand: "2024-02-20",
      sellingPrice: "₱25.00",
    },
  ]);

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", isSidebarCollapsed);
  }, [isSidebarCollapsed]);

  return (
    <div className="flex h-screen">
      <Sidebar_Primary
        isCollapsed={isSidebarCollapsed}
        toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <div
        className={`flex-1 p-6 overflow-auto transition-all duration-300 ${
          isSidebarCollapsed ? "ml-16" : "ml-64"
        }`}
      >
        <h1 className="text-2xl font-bold text-purple-600 mb-4">
          Inventory Management
        </h1>
        <div className="overflow-y-auto max-h-[600px] bg-white shadow-md rounded-lg">
          <table className="min-w-full border border-gray-200 rounded">
            <thead className="sticky top-0 bg-purple-100 text-left text-sm font-medium text-gray-700">
              <tr>
                <th className="p-3 border">Item ID</th>
                <th className="p-3 border">Model</th>
                <th className="p-3 border">Category</th>
                <th className="p-3 border">Quantity</th>
                <th className="p-3 border">Available</th>
                <th className="p-3 border">Stock Status</th>
                <th className="p-3 border">Location</th>
                <th className="p-3 border">Selling Price</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item, index) => (
                <tr key={item.id} className="text-sm text-gray-700 border-t">
                  <td className="p-3 border">{item.id}</td>
                  <td className="p-3 border">{item.serialNumber}</td>
                  <td className="p-3 border">{item.category}</td>
                  <td className="p-3 border">{item.quantityReceived}</td>
                  <td className="p-3 border">{item.quantityAvailable}</td>
                  <td className="p-3 border">{item.stockStatus}</td>
                  <td className="p-3 border">{item.location}</td>
                  <td className="p-3 border">{item.sellingPrice}</td>
                  <td className="p-3 border">
                    <button
                      onClick={() => navigate(`/inventory/${item.id}`)}
                      className="text-green-600 hover:text-green-800 px-2"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;
