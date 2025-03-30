import React, { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";

const InventoryPage = () => {
  const [inventory, setInventory] = useState([]);
  const [damagedProducts, setDamagedProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("available");
  const categoryBrandMap = {
    Processor: ["INTEL", "AMD"],
    Motherboards: ["INTEL", "ASUS", "MSI", "ECS", "BIOSTAR", "EMAXX", "GIGABYTE"],
    "Video Cards": ["INNO 3D", "PALIT", "ATI RADEON", "EMAXX", "MSI"],
    Monitors: ["SAMSUNG", "LG", "AOC", "ACER", "NVISION", "PHILIPS"],
    Laptops: ["HP", "ACER", "LENOVO", "ASUS", "DELL", "HUAWEI"],
    Printers: ["EPSON", "HP", "BROTHER", "CANON", "SAMSUNG"],
    Toners: ["HP", "BROTHER", "CANON", "SAMSUNG", "EPSON"],
    Inks: ["HP", "BROTHER", "CANON", "EPSON"],
    Networking: ["CISCO", "LINKSYS", "DLINK", "TENDA", "TP-LINK", "HP & DELL"],
    "DSLR Camera": ["CANON", "SONY"],
    "CCTV Camera": ["HIKVISION", "DAHUA"],
    "Keyboard & Mouse": ["GENIUS", "A4TECH", "LOGITECH", "DELUX", "ACER", "HP"],
    Webcam: ["A4TECH", "GENIUS", "ACER"],
    "Power Supply": ["TORNADO", "POWER LOGIC", "X-POWER", "ORION", "COOLER MASTER"],
    "Thin Client": ["NComputing"],
  };

  useEffect(() => {
    generateDummyData();
  }, []);

  const generateDummyData = () => {
    const categoryList = Object.keys(categoryBrandMap);
    const inventoryData = Array.from({ length: 60 }, (_, i) => {
      const randomCategory =
        categoryList[Math.floor(Math.random() * categoryList.length)];
      const brandArray = categoryBrandMap[randomCategory];
      const randomBrand =
        brandArray[Math.floor(Math.random() * brandArray.length)];

      // For demonstration, quantityReceived == quantityAvailable
      const qty = Math.floor(Math.random() * 100) + 1;

      // Generate a random date/time in 2024 as a timestamp string
      const randomDate = new Date(
        2024,
        Math.floor(Math.random() * 12),
        Math.floor(Math.random() * 28) + 1,
        Math.floor(Math.random() * 24),
        Math.floor(Math.random() * 60),
        Math.floor(Math.random() * 60)
      ).toLocaleString();

      return {
        id: i + 1,
        category: randomCategory,
        brand: randomBrand,
        serialNumber: `SN${10000 + i}`,
        quantityReceived: qty,
        quantityAvailable: qty,
        stockStatus: ["In Stock", "Limited Stock", "Out of Stock"][i % 3],
        sellingPrice: `₱${(Math.random() * 1000).toFixed(2)}`,
        location: `Warehouse ${String.fromCharCode(65 + (i % 5))}`,
        productDescription: `Description of ${randomCategory}`,
        purchasePrice: `₱${(Math.random() * 800).toFixed(2)}`,
        warrantyDuration: `${Math.floor(Math.random() * 3) + 1} Years`,
        model: `Model ${i + 1}`,
        dateReceived: randomDate,
        isNew: Math.random() > 0.5 ? "New Item" : "Old Item",
      };
    });
    setInventory(inventoryData);
  };

  // Generate dummy data for Damaged Products
  const generateDummyDamagedProducts = () => {
    const damagedData = Array.from({ length: 30 }, (_, i) => ({
      damageId: i + 101,
      category: ["Laptop", "Mouse", "Router", "Switch", "RAM"][i % 5],
      brand: `Brand Dmg ${i % 5}`,
      serialNumber: `DMG${9000 + i}`,
      model: `Damaged Model ${i + 1}`,
    }));
    setDamagedProducts(damagedData);
  };

  return (
    <DashboardLayout>
      <div className="p-2 bg-gradient-to-r from-teal-500 to-teal-200 min-h-screen">
        <h1 className="text-3xl font-bold text-purple-700 mb-6">
          Inventory Management
        </h1>

        {/* 🔹 Tab Buttons */}
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab("available")}
            className={`px-4 py-2 rounded-t font-semibold text-lg ${
              activeTab === "available"
                ? "bg-blue-500 text-white"
                : "bg-blue-100 text-blue-600"
            }`}
          >
            Available Products
          </button>
          <button
            onClick={() => setActiveTab("damaged")}
            className={`px-4 py-2 rounded-t font-semibold text-lg ${
              activeTab === "damaged"
                ? "bg-red-500 text-white"
                : "bg-red-100 text-red-600"
            }`}
          >
            Damaged Products
          </button>
        </div>

        {/* 🔹 Tab Content - Available Products */}
        {activeTab === "available" && (
          <div className="bg-gradient-to-b from-blue-500 to-blue-200 shadow-lg rounded-r rounded-b p-4 flex flex-col h-[80vh]">
            <div className="overflow-auto flex-grow">
              <table className="min-w-full border border-gray-200 rounded">
                <thead className="sticky top-0 bg-blue-300 text-left text-sm font-medium text-gray-800">
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
                        <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-700">
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 🔹 Tab Content - Damaged Products */}
        {activeTab === "damaged" && (
          <div className="bg-gradient-to-b from-red-500 to-red-200 shadow-lg rounded-r rounded-b p-4 flex flex-col h-[80vh]">
            <div className="overflow-auto flex-grow">
              <table className="min-w-full border border-gray-200 rounded">
                <thead className="sticky top-0 bg-red-300 text-left text-sm font-medium text-gray-800">
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
        )}
      </div>
    </DashboardLayout>
  );
};

export default InventoryPage;
