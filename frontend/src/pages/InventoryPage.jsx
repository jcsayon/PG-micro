// frontend/pages/InventoryPage.jsx
import React, { useState, useEffect } from "react";
import Sidebar_Primary from "../components/Sidebar_Primary";

const InventoryPage = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [inventory, setInventory] = useState([]);
  const [damagedProducts, setDamagedProducts] = useState([]);
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
  const [isDamagedModalOpen, setIsDamagedModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    generateDummyData();
    localStorage.setItem("sidebarCollapsed", isSidebarCollapsed);
  }, [isSidebarCollapsed]);

  /** 🔹 Dummy Data for Placeholder */
  const generateDummyData = () => {
    const inventoryData = Array.from({ length: 60 }, (_, i) => ({
      id: i + 1,
      category: ["Laptop", "Mouse", "Router", "Switch", "RAM"][i % 5],
      brand: `Brand ${i % 5}`,
      serialNumber: `SN${10000 + i}`,
      quantityReceived: Math.floor(Math.random() * 100) + 1,
      quantityAvailable: Math.floor(Math.random() * 50) + 1,
      stockStatus: ["In Stock", "Limited Stock", "Out of Stock"][i % 3],
      sellingPrice: `₱${(Math.random() * 1000).toFixed(2)}`,
      location: `Warehouse ${String.fromCharCode(65 + (i % 5))}`,
      productDescription: `Description of ${
        ["Laptop", "Mouse", "Router", "Switch", "RAM"][i % 5]
      }`,
      purchasePrice: `₱${(Math.random() * 800).toFixed(2)}`,
      warrantyDuration: `${Math.floor(Math.random() * 3) + 1} Years`,
      model: `Model ${i + 1}`,
      isNew: Math.random() > 0.5 ? "New Item" : "Old Item",
    }));

    const damagedData = Array.from({ length: 20 }, (_, i) => ({
      id: i + 100,
      category: ["Laptop", "Mouse", "Router", "Switch", "RAM"][i % 5],
      serialNumber: `SN-DMG${20000 + i}`,
      reason: ["Defective", "Damaged in transit", "Expired warranty"][i % 3],
      location: `Warehouse ${String.fromCharCode(65 + (i % 5))}`,
      reportedDate: new Date(2024, i % 12, (i % 28) + 1).toLocaleDateString(),
    }));

    setInventory(inventoryData);
    setDamagedProducts(damagedData);
  };

  /** 🔹 Open Inventory Details Modal */
  const openInventoryModal = (item) => {
    setSelectedItem(item);
    setIsInventoryModalOpen(true);
  };

  /** 🔹 Open Damaged Products Modal */
  const toggleDamagedModal = () => {
    setIsDamagedModalOpen(!isDamagedModalOpen);
  };

  /** 🔎 Filtered Data Based on Search Query */
  const filteredInventory = inventory.filter((item) =>
    Object.values(item).some(
      (val) =>
        typeof val === "string" &&
        val.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar_Primary
        isCollapsed={isSidebarCollapsed}
        toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Content */}
      <div
        className={`flex-1 p-6 transition-all duration-300 ${
          isSidebarCollapsed ? "ml-16" : "ml-64"
        }`}
      >
        <h1 className="text-3xl font-bold text-purple-700 mb-6">
          Inventory Management
        </h1>

        {/* 🔍 Search Bar & Damaged Products Button */}
        <div className="flex items-center justify-between mb-4">
          <input
            type="text"
            placeholder="Search inventory..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 w-80 focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={toggleDamagedModal}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            View Damaged Products
          </button>
        </div>

        {/* ✅ Inventory Table */}
        <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col h-full border border-gray-300">
          <h2 className="text-xl font-semibold text-blue-700 mb-4">
            Available Inventory
          </h2>
          <div className="overflow-y-auto flex-grow max-h-[70vh]">
            <table className="min-w-full border border-gray-200 rounded">
              <thead className="sticky top-0 bg-blue-200 text-left text-sm font-medium text-gray-800">
                <tr>
                  <th className="p-3 border">Item ID</th>
                  <th className="p-3 border">Category</th>
                  <th className="p-3 border">Brand</th>
                  <th className="p-3 border">Serial Number</th>
                  <th className="p-3 border">Quantity</th>
                  <th className="p-3 border">Available</th>
                  <th className="p-3 border">Stock Status</th>
                  <th className="p-3 border">Selling Price</th>
                  <th className="p-3 border text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map((item) => (
                  <tr key={item.id} className="text-sm text-gray-700 border-t">
                    <td className="p-3 border">{item.id}</td>
                    <td className="p-3 border">{item.category}</td>
                    <td className="p-3 border">{item.brand}</td>
                    <td className="p-3 border">{item.serialNumber}</td>
                    <td className="p-3 border">{item.quantityReceived}</td>
                    <td className="p-3 border">{item.quantityAvailable}</td>
                    <td className="p-3 border">{item.stockStatus}</td>
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

        {/* ✅ View Details Modal */}
        {isInventoryModalOpen && selectedItem && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
              <h2 className="text-xl font-bold mb-4">Product Details</h2>
              <p>
                <strong>Product Description:</strong>{" "}
                {selectedItem.productDescription}
              </p>
              <p>
                <strong>Purchase Price:</strong> {selectedItem.purchasePrice}
              </p>
              <p>
                <strong>Warranty Duration:</strong>{" "}
                {selectedItem.warrantyDuration}
              </p>
              <p>
                <strong>Model:</strong> {selectedItem.model}
              </p>
              <p>
                <strong>Brand:</strong> {selectedItem.brand}
              </p>
              <p>
                <strong>Location:</strong> {selectedItem.location}
              </p>
              <p>
                <strong>Condition:</strong> {selectedItem.isNew}
              </p>
              <button
                onClick={() => setIsInventoryModalOpen(false)}
                className="mt-4 w-full bg-gray-500 text-white p-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryPage;
