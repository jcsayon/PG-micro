import React, { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";

const InventoryPage = () => {
  const [inventory, setInventory] = useState([]);
  const [damagedProducts, setDamagedProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("available");
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState([]);
  const [categoryStats, setCategoryStats] = useState({});

  useEffect(() => {
    generateDummyData();
  }, []);

  const generateDummyData = () => {
    const inventoryData = Array.from({ length: 60 }, (_, i) => ({
      id: i + 1,
      serialNumber: `SN${10000 + i}`,
      category: ["Laptop", "Mouse", "Router", "Switch", "RAM"][i % 5],
      model: `Model ${String.fromCharCode(65 + (i % 5))}-${i % 10}`,
      quantityReceived: Math.floor(Math.random() * 100) + 1,
      quantityAvailable: Math.floor(Math.random() * 50) + 1,
      stockStatus: ["In Stock", "Limited Stock", "Out of Stock"][i % 3],
      location: `Warehouse ${String.fromCharCode(65 + (i % 5))}`,
      brand: `Brand ${i % 5}`,
      sellingPrice: `₱${(Math.random() * 1000).toFixed(2)}`,
      salesStatus: i % 4 === 0, // 25% of items are sold
      // New fields
      productDescription: `High quality ${["Laptop", "Mouse", "Router", "Switch", "RAM"][i % 5]} with excellent performance and durability.`,
      dateReceived: new Date(2024, i % 12, (i % 28) + 1).toLocaleDateString(),
      warrantyDuration: `${(i % 3) + 1} ${(i % 3) + 1 === 1 ? 'year' : 'years'}`,
      purchasePrice: `₱${(Math.random() * 800).toFixed(2)}`,
    }));

    const damagedData = Array.from({ length: 40 }, (_, i) => ({
      id: i + 100,
      serialNumber: `SN-DMG${20000 + i}`,
      category: ["Laptop", "Mouse", "Router", "Switch", "RAM"][i % 5],
      model: `Model ${String.fromCharCode(65 + (i % 5))}-${i % 10}`,
      location: `Warehouse ${String.fromCharCode(65 + (i % 5))}`,
      brand: `Brand ${i % 5}`,
      salesStatus: false,
      stockStatus: "Damaged",
      sellingPrice: "N/A",
    }));

    // Extract unique categories
    const allCategories = [...new Set(inventoryData.map(item => item.category))];
    setCategories(["All", ...allCategories]);

    // Calculate category statistics
    const stats = {};
    allCategories.forEach(category => {
      const categoryItems = inventoryData.filter(item => item.category === category);
      stats[category] = {
        total: categoryItems.reduce((sum, item) => sum + item.quantityReceived, 0),
        available: categoryItems.reduce((sum, item) => sum + item.quantityAvailable, 0)
      };
    });
    setCategoryStats(stats);

    setInventory(inventoryData);
    setDamagedProducts(damagedData);
  };

  const openInventoryModal = (item) => {
    setSelectedItem(item);
    setIsInventoryModalOpen(true);
  };

  const closeInventoryModal = () => {
    setSelectedItem(null);
    setIsInventoryModalOpen(false);
  };

  const filteredInventory = selectedCategory === "All" 
    ? inventory 
    : inventory.filter(item => item.category === selectedCategory);

  const filteredDamagedProducts = selectedCategory === "All"
    ? damagedProducts
    : damagedProducts.filter(item => item.category === selectedCategory);

  return (
    <DashboardLayout>
      <div className="p-2 from-purple-500 to-purple-200 min-h-screen">
        <h1 className="text-3xl font-bold text-purple-700 mb-6">Inventory Management</h1>

        {/* Category Filter and Stats */}
        <div className="mb-4 flex flex-wrap gap-4 items-center">
          <div>
            <label htmlFor="categoryFilter" className="mr-2 font-medium">Category Filter:</label>
            <select
              id="categoryFilter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="p-2 border rounded bg-white"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          {selectedCategory !== "All" && categoryStats[selectedCategory] && (
            <div className="flex gap-4">
              <div className="bg-blue-100 p-2 rounded">
                <span className="font-medium">Total Quantity:</span> {categoryStats[selectedCategory].total}
              </div>
              <div className="bg-green-100 p-2 rounded">
                <span className="font-medium">Available Stock:</span> {categoryStats[selectedCategory].available}
              </div>
            </div>
          )}
        </div>

        {/* Tab Buttons */}
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

        {/* Tab Content - Available Products */}
        {activeTab === "available" && (
          <div className="bg-blue-400 shadow-lg rounded-r rounded-b p-4 flex flex-col h-[80vh]">
            <div className="overflow-auto flex-grow">
              <table className="min-w-full border border-gray-200 rounded">
                <thead className="sticky top-0 bg-blue-300 text-left text-sm font-medium text-gray-800">
                  <tr>
                    <th className="p-3 border">Item ID</th>
                    <th className="p-3 border">Model</th>
                    <th className="p-3 border">Brand</th>
                    <th className="p-3 border">Serial Number</th>
                    <th className="p-3 border">Stock Status</th>
                    <th className="p-3 border">Location</th>
                    <th className="p-3 border text-center">Sales Status</th>
                    <th className="p-3 border">Selling Price</th>
                    <th className="p-3 border text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInventory.map((item) => (
                    <tr key={item.id} className="text-sm text-gray-700 border-t">
                      <td className="p-3 border">{item.id}</td>
                      <td className="p-3 border">{item.model}</td>
                      <td className="p-3 border">{item.brand}</td>
                      <td className="p-3 border">{item.serialNumber}</td>
                      <td className="p-3 border">{item.stockStatus}</td>
                      <td className="p-3 border">{item.location}</td>
                      <td className="p-3 border text-center">
                        {item.salesStatus ? '✅' : '❌'}
                      </td>
                      <td className="p-3 border">{item.sellingPrice}</td>
                      <td className="p-3 border text-center">
                        <button
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-700"
                          onClick={() => openInventoryModal(item)}
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
        )}

        {/* Tab Content - Damaged Products */}
        {activeTab === "damaged" && (
          <div className="bg-red-400 shadow-lg rounded-r rounded-b p-4 flex flex-col h-[80vh]">
            <div className="overflow-auto flex-grow">
              <table className="min-w-full border border-gray-200 rounded">
                <thead className="sticky top-0 bg-red-300 text-left text-sm font-medium text-gray-800">
                  <tr>
                    <th className="p-3 border">Item ID</th>
                    <th className="p-3 border">Model</th>
                    <th className="p-3 border">Brand</th>
                    <th className="p-3 border">Serial Number</th>
                    <th className="p-3 border">Location</th>
                    <th className="p-3 border text-center">Sales Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDamagedProducts.map((item) => (
                    <tr key={item.id} className="border-t text-sm text-gray-700">
                      <td className="p-3 border">{item.id}</td>
                      <td className="p-3 border">{item.model}</td>
                      <td className="p-3 border">{item.brand}</td>
                      <td className="p-3 border">{item.serialNumber}</td>
                      <td className="p-3 border">{item.location}</td>
                      <td className="p-3 border text-center">
                        {item.salesStatus ? '✅' : '❌'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal for Inventory Details */}
        {isInventoryModalOpen && selectedItem && (
          <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-[90%] max-w-xl shadow-lg">
              <h2 className="text-xl font-semibold text-purple-700 mb-4">
                Inventory Details
              </h2>
              <ul className="space-y-2 text-gray-700">
                <li><strong>ID:</strong> {selectedItem.id}</li>
                <li><strong>Serial Number:</strong> {selectedItem.serialNumber}</li>
                <li><strong>Category:</strong> {selectedItem.category}</li>
                <li><strong>Model:</strong> {selectedItem.model}</li>
                <li><strong>Brand:</strong> {selectedItem.brand}</li>
                <li><strong>Quantity Received:</strong> {selectedItem.quantityReceived}</li>
                <li><strong>Quantity Available:</strong> {selectedItem.quantityAvailable}</li>
                <li><strong>Stock Status:</strong> {selectedItem.stockStatus}</li>
                <li><strong>Location:</strong> {selectedItem.location}</li>
                <li><strong>Selling Price:</strong> {selectedItem.sellingPrice}</li>
                <li><strong>Sales Status:</strong> {selectedItem.salesStatus ? 'Sold' : 'Not Sold'}</li>
                
                {/* New fields */}
                <li><strong>Product Description:</strong> {selectedItem.productDescription}</li>
                <li><strong>Date Received:</strong> {selectedItem.dateReceived}</li>
                <li><strong>Warranty Duration:</strong> {selectedItem.warrantyDuration}</li>
                <li><strong>Purchase Price:</strong> {selectedItem.purchasePrice}</li>
              </ul>
              <div className="mt-6 text-right">
                <button
                  onClick={closeInventoryModal}
                  className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default InventoryPage;