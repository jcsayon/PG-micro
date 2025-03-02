import React, { useState, useEffect } from "react";
import Sidebar_Primary from "../components/Sidebar_Primary";

const InventoryPage = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [inventory, setInventory] = useState([]);
  const [damagedProducts, setDamagedProducts] = useState([]);
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDamagedModalOpen, setIsDamagedModalOpen] = useState(false);

  useEffect(() => {
    generateDummyData();
    localStorage.setItem("sidebarCollapsed", isSidebarCollapsed);
  }, [isSidebarCollapsed]);

  const generateDummyData = () => {
    const dummyData = Array.from({ length: 60 }, (_, i) => {
      const isDamaged = i % 10 === 0;
      return {
        id: i + 1,
        serialNumber: `SN${10000 + i}`,
        category: ["Laptop", "Mouse", "Router", "Switch", "RAM"][i % 5],
        quantityReceived: Math.floor(Math.random() * 100) + 1,
        quantityAvailable: Math.floor(Math.random() * 50) + 1,
        stockStatus: isDamaged
          ? "Damaged"
          : ["In Stock", "Limited Stock", "Out of Stock"][i % 3],
        location: `Warehouse ${String.fromCharCode(65 + (i % 5))}`,
        Brand: `Brand ${i % 5}`,
        sellingPrice: `₱${(Math.random() * 1000).toFixed(2)}`,
      };
    });
    setInventory(dummyData);
    setDamagedProducts(
      dummyData.filter((item) => item.stockStatus === "Damaged")
    );
  };

  const openInventoryModal = (item) => {
    setSelectedItem(item);
    setIsInventoryModalOpen(true);
  };

  return (
    <div className="flex h-screen relative">
      <Sidebar_Primary
        isCollapsed={isSidebarCollapsed}
        toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <div
        className={`flex-1 p-6 overflow-auto transition-all duration-300 ${
          isSidebarCollapsed ? "ml-16" : "ml-64"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-purple-600">
            Inventory Management
          </h1>
          <button
            onClick={() => setIsDamagedModalOpen(true)}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Damaged Products
          </button>
        </div>

        <div className="overflow-y-auto max-h-[600px] bg-white shadow-md rounded-lg">
          <table className="min-w-full border border-gray-200 rounded">
            <thead className="sticky top-0 bg-purple-100 text-left text-sm font-medium text-gray-700">
              <tr>
                <th className="p-3 border">Item ID</th>
                <th className="p-3 border">Serial Number</th>
                <th className="p-3 border">Category</th>
                <th className="p-3 border">Quantity</th>
                <th className="p-3 border">Available</th>
                <th className="p-3 border">Stock Status</th>
                <th className="p-3 border">Location</th>
                <th className="p-3 border">Selling Price</th>
                <th className="p-3 border text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventory.slice(0, 60).map((item) => (
                <tr key={item.id} className="text-sm text-gray-700 border-t">
                  <td className="p-3 border">{item.id}</td>
                  <td className="p-3 border">{item.serialNumber}</td>
                  <td className="p-3 border">{item.category}</td>
                  <td className="p-3 border">{item.quantityReceived}</td>
                  <td className="p-3 border">{item.quantityAvailable}</td>
                  <td className="p-3 border">{item.stockStatus}</td>
                  <td className="p-3 border">{item.location}</td>
                  <td className="p-3 border">{item.sellingPrice}</td>
                  <td className="p-3 border text-center">
                    <button
                      onClick={() => openInventoryModal(item)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-700"
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

      {isDamagedModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-2/3">
            <h2 className="text-xl font-bold mb-4">Damaged Products</h2>
            <table className="min-w-full border border-gray-200 rounded">
              <thead className="bg-red-100 text-left">
                <tr>
                  <th className="p-3 border">Item ID</th>
                  <th className="p-3 border">Serial Number</th>
                  <th className="p-3 border">Category</th>
                  <th className="p-3 border">Location</th>
                </tr>
              </thead>
              <tbody>
                {damagedProducts.map((item) => (
                  <tr key={item.id} className="border-t">
                    <td className="p-3 border">{item.id}</td>
                    <td className="p-3 border">{item.serialNumber}</td>
                    <td className="p-3 border">{item.category}</td>
                    <td className="p-3 border">{item.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              onClick={() => setIsDamagedModalOpen(false)}
              className="mt-4 w-full bg-gray-500 text-white p-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryPage;
