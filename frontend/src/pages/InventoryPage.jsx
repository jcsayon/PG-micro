// frontend/pages/InventoryPage.jsx
import React, { useState, useEffect } from "react";
import Sidebar_Primary from "../components/Sidebar_Primary";
// import { supabase } from "../supabaseClient"; // Uncomment when using Supabase

const InventoryPage = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [inventory, setInventory] = useState([]);
  const [damagedProducts, setDamagedProducts] = useState([]);
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    generateDummyData();
    localStorage.setItem("sidebarCollapsed", isSidebarCollapsed);

    // Uncomment this to fetch data from Supabase instead of using dummy data.
    // fetchDataFromSupabase();
  }, [isSidebarCollapsed]);

  /** 🔹 Dummy Data for Placeholder */
  const generateDummyData = () => {
    const inventoryData = Array.from({ length: 60 }, (_, i) => ({
      id: i + 1,
      serialNumber: `SN${10000 + i}`,
      category: ["Laptop", "Mouse", "Router", "Switch", "RAM"][i % 5],
      quantityReceived: Math.floor(Math.random() * 100) + 1,
      quantityAvailable: Math.floor(Math.random() * 50) + 1,
      stockStatus: ["In Stock", "Limited Stock", "Out of Stock"][i % 3],
      location: `Warehouse ${String.fromCharCode(65 + (i % 5))}`,
      brand: `Brand ${i % 5}`,
      sellingPrice: `₱${(Math.random() * 1000).toFixed(2)}`,
    }));

    const damagedData = Array.from({ length: 40 }, (_, i) => ({
      id: i + 100,
      serialNumber: `SN-DMG${20000 + i}`,
      category: ["Laptop", "Mouse", "Router", "Switch", "RAM"][i % 5],
      location: `Warehouse ${String.fromCharCode(65 + (i % 5))}`,
    }));

    setInventory(inventoryData);
    setDamagedProducts(damagedData);
  };

  /** 🔹 Fetch Data from Supabase */
  // const fetchDataFromSupabase = async () => {
  //   try {
  //     const { data: inventoryData, error: inventoryError } = await supabase
  //       .from("inventory")
  //       .select("*");

  //     if (inventoryError) throw inventoryError;

  //     const { data: damagedData, error: damagedError } = await supabase
  //       .from("damaged_products")
  //       .select("*");

  //     if (damagedError) throw damagedError;

  //     setInventory(inventoryData);
  //     setDamagedProducts(damagedData);
  //   } catch (error) {
  //     console.error("Error fetching data:", error.message);
  //   }
  // };

  /** 🔹 Open Inventory Details Modal */
  const openInventoryModal = (item) => {
    setSelectedItem(item);
    setIsInventoryModalOpen(true);
  };

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

        {/* Grid Layout for Tables */}
        <div className="grid grid-cols-2 gap-6 h-[80vh]">
          {/* ✅ Available Inventory Table */}
          <div className="bg-blue-50 shadow-lg rounded-lg p-4 flex flex-col h-full">
            <h2 className="text-xl font-semibold text-blue-700 mb-4">
              Available Inventory
            </h2>
            <div className="overflow-y-auto flex-grow max-h-[70vh]">
              <table className="min-w-full border border-gray-200 rounded">
                <thead className="sticky top-0 bg-blue-200 text-left text-sm font-medium text-gray-800">
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
                  {inventory.map((item) => (
                    <tr
                      key={item.id}
                      className="text-sm text-gray-700 border-t"
                    >
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

          {/* ✅ Damaged Products Table */}
          <div className="bg-red-50 shadow-lg rounded-lg p-4 flex flex-col h-full">
            <h2 className="text-xl font-semibold text-red-700 mb-4">
              Damaged Products
            </h2>
            <div className="overflow-y-auto flex-grow max-h-[70vh]">
              <table className="min-w-full border border-gray-200 rounded">
                <thead className="sticky top-0 bg-red-200 text-left text-sm font-medium text-gray-800">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;
