import React, { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
const ENDPOINTS = {
  INVENTORY: `${API_BASE_URL}/inventory/`,
  DAMAGED_INVENTORY: `${API_BASE_URL}/damaged-inventory/`,
};

const categories = [
  "All", "Processor", "Motherboards", "Video Cards", "Monitors", "Laptops", 
  "Printers", "Toners", "Inks", "Networking", "DSLR Camera", "CCTV Camera", 
  "Keyboard & Mouse", "Webcam", "Power Supply", "Thin Client"
];


// API utility functions
const fetchInventory = async () => {
  try {
    const response = await fetch(ENDPOINTS.INVENTORY);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching inventory:", error);
    return null;
  }
};

const fetchDamagedInventory = async () => {
  try {
    const response = await fetch(ENDPOINTS.DAMAGED_INVENTORY);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching damaged inventory:", error);
    return null;
  }
};

const InventoryPage = ({ onInventoryUpdate }) => {
  const [products, setProducts] = useState([]);
  const [damagedProducts, setDamagedProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("available");
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [categoryStats, setCategoryStats] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadInventoryData();
  }, []);

  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);

  const openAddItemModal = () => {
    setIsAddItemModalOpen(true);
  };
  
  const closeAddItemModal = () => {
    setIsAddItemModalOpen(false);
  };
  

  const loadInventoryData = () => {
    setIsLoading(true);

    Promise.all([fetchInventory(), fetchDamagedInventory()])
      .then(([inventoryData, damagedData]) => {
        if (inventoryData) {
          setProducts(inventoryData);
          const stats = calculateCategoryStats(inventoryData);
          setCategoryStats(stats);
          if (onInventoryUpdate) onInventoryUpdate(inventoryData);
        }

        if (damagedData) {
          setDamagedProducts(damagedData);
        }

        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error loading inventory data:", error);
        setIsLoading(false);
      });
  };

  const handleRefreshInventory = () => {
    loadInventoryData();
  };
  

  const calculateCategoryStats = (productData) => {
    const stats = {};
    const categories = ["Processor", "Motherboards", "Video Cards", "Monitors", "Laptops", "Printers", "Toners", "Inks", "Networking", "DSLR Camera", "CCTV Camera", "Keyboard & Mouse", "Webcam", "Power Supply", "Thin Client"];

    categories.forEach(cat => {
      const categoryProducts = productData.filter(p => p.category === cat);
      const totalCount = categoryProducts.length;
      const availableCount = categoryProducts.filter(p => p.saleStatus === "Not Sold").length;
      stats[cat] = {
        quantity: totalCount,
        available: availableCount
      };
    });

    const totalCount = productData.length;
    const totalAvailable = productData.filter(p => p.saleStatus === "Not Sold").length;

    stats["All"] = {
      quantity: totalCount,
      available: totalAvailable,
      details: Object.keys(stats).map(cat => ({
        category: cat,
        quantity: stats[cat].quantity,
        available: stats[cat].available
      }))
    };

    return stats;
  };

  const filteredProducts = products.filter(product =>
    categoryFilter === "All" || product.category === categoryFilter
  );
  

  return (
    <DashboardLayout>
      <div className="p-2 bg-white min-h-screen">
        {/* Header Section with Gradient Accent */}
        <div className="sticky top-0 z-20 space-y-2 px-6 py-4 bg-white border-b border-gray-200 mb-6 shadow-sm rounded-lg">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full mr-3"></div>
              <h1 className="text-2xl font-bold text-gray-800">Inventory Management</h1>
            </div>
            
            <div className="flex gap-3">
              {/* Add New Item button */}
              <button 
                onClick={openAddItemModal} 
                className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-md hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 flex items-center shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add New Item
              </button>
              
              {/* Refresh button */}
              <button 
                onClick={handleRefreshInventory} 
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-md hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 flex items-center shadow-md"
                disabled={isLoading}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                {isLoading ? "Loading..." : "Refresh Inventory"}
              </button>
            </div>
          </div>
        
          {/* Tab Buttons */}
          <div className="flex gap-1 mb-4">
            <button 
              onClick={() => setActiveTab("available")} 
              className={`px-6 py-2.5 rounded-md font-medium text-sm transition-all duration-200 flex items-center 
              ${activeTab === "available" 
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md" 
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
              </svg>
              Available Products
            </button>
            <button 
              onClick={() => setActiveTab("damaged")} 
              className={`px-6 py-2.5 rounded-md font-medium text-sm transition-all duration-200 flex items-center
              ${activeTab === "damaged" 
                ? "bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-md" 
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Damaged Products
            </button>
          </div>

          {/* Category Filter and Quantity Display */}
          {activeTab === "available" && (
            <div className="flex flex-wrap items-center gap-4 mb-2">
              <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-200 shadow-sm">
                <label htmlFor="category-filter" className="ml-2 mr-2 text-gray-600 font-medium">Category:</label>
                <select
                  id="category-filter"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="p-2 border-0 rounded-md bg-white focus:ring-2 focus:ring-blue-300 focus:outline-none transition-all duration-200"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              {categoryFilter === "All" ? (
                <div className="flex items-center bg-blue-50 rounded-lg p-3 border border-blue-100 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div>
                      <span className="text-gray-500 text-sm">Total Quantity</span>
                      <div className="font-semibold text-lg text-blue-700">{categoryStats.All?.quantity || 0}</div>
                    </div>
                    <div className="hidden sm:block h-10 w-px bg-blue-200"></div>
                    <div>
                      <span className="text-gray-500 text-sm">Available</span>
                      <div className="font-semibold text-lg text-green-600">{categoryStats.All?.available || 0}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center bg-blue-50 rounded-lg p-3 border border-blue-100 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div>
                      <span className="text-gray-500 text-sm">Quantity</span>
                      <div className="font-semibold text-lg text-blue-700">{categoryStats[categoryFilter]?.quantity || 0}</div>
                    </div>
                    <div className="hidden sm:block h-10 w-px bg-blue-200"></div>
                    <div>
                      <span className="text-gray-500 text-sm">Available</span>
                      <div className="font-semibold text-lg text-green-600">{categoryStats[categoryFilter]?.available || 0}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-center items-center h-40">
            <div className="flex items-center bg-blue-50 px-6 py-4 rounded-lg border border-blue-100">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-lg text-blue-700 font-medium">Loading inventory data...</span>
            </div>
          </div>
        )}

        {/* Tab Content - Table Available Products */}
        {!isLoading && activeTab === "available" && (
          <div className="bg-white shadow-lg rounded-lg flex flex-col h-[calc(100vh-220px)] overflow-hidden border border-gray-200">
            <div className="flex-grow overflow-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="sticky top-0 z-20 bg-gradient-to-r from-gray-50 to-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider shadow-sm">
                  <tr>
                    <th className="px-4 py-3 border-b">Item ID</th>
                    <th className="px-4 py-3 border-b">Serial Number</th>
                    <th className="px-4 py-3 border-b">Brand</th>
                    <th className="px-4 py-3 border-b">Model</th>
                    <th className="px-4 py-3 border-b">Location</th>
                    <th className="px-4 py-3 border-b">Selling Price</th>
                    <th className="px-4 py-3 border-b">Sale Status</th>
                    <th className="px-4 py-3 border-b text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.map((item) => (
                    <tr 
                      key={item.id} 
                      className={`text-sm ${item.saleStatus === "Sold" ? "bg-red-50" : ""} hover:bg-blue-50 transition-colors duration-150`}
                    >
                      <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">{item.id}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-700">{item.serialNumber}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-700">{item.brand}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-700">{item.model}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-700">{item.location}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-700 font-medium">{item.sellingPrice}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.saleStatus === "Sold" 
                          ? "bg-red-100 text-red-800 ring-1 ring-red-600/20" 
                          : "bg-green-100 text-green-800 ring-1 ring-green-600/20"
                        }`}>
                          {item.saleStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-center">
                        <button
                          className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-sm transition-all duration-200"
                          onClick={() => openInventoryModal(item)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                          </svg>
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan="8" className="px-4 py-8 text-center text-gray-500 bg-gray-50">
                        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <p className="mt-2 text-sm font-medium">No products found in this category</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab Content - Table Damaged Products */}
        {!isLoading && activeTab === "damaged" && (
          <div className="bg-white shadow-lg rounded-lg flex flex-col h-[calc(100vh-220px)] overflow-hidden border border-gray-200">
            <div className="flex-grow overflow-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="sticky top-0 z-20 bg-gradient-to-r from-gray-50 to-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider shadow-sm">
                  <tr>
                    <th className="px-4 py-3 border-b">Item ID</th>
                    <th className="px-4 py-3 border-b">Serial Number</th>
                    <th className="px-4 py-3 border-b">Category</th>
                    <th className="px-4 py-3 border-b">Brand</th>
                    <th className="px-4 py-3 border-b">Model</th>
                    <th className="px-4 py-3 border-b">Location</th>
                    <th className="px-4 py-3 border-b text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {damagedProducts.map((item) => (
                    <tr key={item.id} className="text-sm hover:bg-red-50 transition-colors duration-150">
                      <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">{item.id}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-700">{item.serialNumber}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-700">{item.category}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-700">{item.brand}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-700">{item.model}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-700">{item.location}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-center">
                        <button
                          className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-white bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 shadow-sm transition-all duration-200"
                          onClick={() => openInventoryModal(item)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                          </svg>
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                  {damagedProducts.length === 0 && (
                    <tr>
                      <td colSpan="7" className="px-4 py-8 text-center text-gray-500 bg-gray-50">
                        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <p className="mt-2 text-sm font-medium">No damaged products found</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal for Inventory Details */}
        {isInventoryModalOpen && selectedItem && (
          <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-xl w-[95%] max-w-2xl shadow-2xl overflow-hidden animate-fadeIn">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 text-white flex justify-between items-center">
                <h2 className="text-xl font-semibold flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Product Details
                </h2>
                <button
                  onClick={closeInventoryModal}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="p-6">
                {isEditMode ? (
                  // Edit Form
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-gray-700">ID</label>
                        <input 
                          type="text" 
                          className="w-full p-2.5 border border-gray-300 rounded-lg bg-gray-100 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          value={editedItem.id}
                          disabled
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-gray-700">Serial Number</label>
                        <input 
                          type="text" 
                          className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          value={editedItem.serialNumber}
                          onChange={(e) => handleEditChange("serialNumber", e.target.value)}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <select
                          className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          value={editedItem.category}
                          onChange={(e) => handleEditChange("category", e.target.value)}
                        >
                          {categories.filter(c => c !== "All").map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-gray-700">Brand</label>
                        <input 
                          type="text" 
                          className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          value={editedItem.brand}
                          onChange={(e) => handleEditChange("brand", e.target.value)}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-gray-700">Model</label>
                        <input 
                          type="text" 
                          className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          value={editedItem.model}
                          onChange={(e) => handleEditChange("model", e.target.value)}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-gray-700">Location</label>
                        <select
                          className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          value={editedItem.location}
                          onChange={(e) => handleEditChange("location", e.target.value)}
                        >
                          {["Warehouse A", "Warehouse B", "Warehouse C", "Warehouse D", "Warehouse E"].map(loc => (
                            <option key={loc} value={loc}>{loc}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-gray-700">Selling Price</label>
                        <input 
                          type="text" 
                          className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          value={editedItem.sellingPrice}
                          onChange={(e) => handleEditChange("sellingPrice", e.target.value)}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-gray-700">Sale Status</label>
                        <select
                          className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          value={editedItem.saleStatus}
                          onChange={(e) => handleEditChange("saleStatus", e.target.value)}
                        >
                          <option value="Sold">Sold</option>
                          <option value="Not Sold">Not Sold</option>
                        </select>
                      </div>
                      
                      {/* New fields */}
                      <div className="space-y-1.5 md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Product Description</label>
                        <textarea 
                          className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          rows="3"
                          value={editedItem.description || ""}
                          onChange={(e) => handleEditChange("description", e.target.value)}
                        ></textarea>
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-gray-700">Purchase Price</label>
                        <input 
                          type="text" 
                          className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          value={editedItem.purchasePrice || ""}
                          onChange={(e) => handleEditChange("purchasePrice", e.target.value)}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-gray-700">Date Received</label>
                        <input 
                          type="date" 
                          className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          value={editedItem.dateReceived || ""}
                          onChange={(e) => handleEditChange("dateReceived", e.target.value)}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-gray-700">Warranty Duration (months)</label>
                        <input 
                          type="number" 
                          className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          value={editedItem.warrantyDuration || "0"}
                          onChange={(e) => handleEditChange("warrantyDuration", e.target.value)}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-gray-700">Old Item</label>
                        <div className="p-2.5 flex items-center">
                          <input 
                            type="checkbox" 
                            className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            checked={editedItem.isOldItem || false}
                            onChange={(e) => handleEditChange("isOldItem", e.target.checked)}
                          />
                          <span className="ml-2 text-sm text-gray-700">Yes</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-3 mt-8 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => setIsEditMode(false)}
                        className="px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={saveEditedItem}
                        className="px-4 py-2 text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm transition-all duration-200"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Details
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm">
                        <div className="text-xs font-medium uppercase text-gray-500 mb-1">ID</div>
                        <div className="font-semibold text-gray-800">{selectedItem.id}</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm">
                        <div className="text-xs font-medium uppercase text-gray-500 mb-1">Serial Number</div>
                        <div className="font-semibold text-gray-800">{selectedItem.serialNumber}</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm">
                        <div className="text-xs font-medium uppercase text-gray-500 mb-1">Category</div>
                        <div className="font-semibold text-gray-800">{selectedItem.category}</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm">
                        <div className="text-xs font-medium uppercase text-gray-500 mb-1">Brand</div>
                        <div className="font-semibold text-gray-800">{selectedItem.brand}</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm">
                        <div className="text-xs font-medium uppercase text-gray-500 mb-1">Model</div>
                        <div className="font-semibold text-gray-800">{selectedItem.model}</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm">
                        <div className="text-xs font-medium uppercase text-gray-500 mb-1">Location</div>
                        <div className="font-semibold text-gray-800">{selectedItem.location}</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm">
                        <div className="text-xs font-medium uppercase text-gray-500 mb-1">Selling Price</div>
                        <div className="font-semibold text-gray-800">{selectedItem.sellingPrice}</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm">
                        <div className="text-xs font-medium uppercase text-gray-500 mb-1">Sale Status</div>
                        <div className="font-semibold">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            selectedItem.saleStatus === "Sold" 
                              ? "bg-red-100 text-red-800 ring-1 ring-red-600/20" 
                              : "bg-green-100 text-green-800 ring-1 ring-green-600/20"
                          }`}>
                            {selectedItem.saleStatus}
                          </span>
                        </div>
                      </div>
                      
                      {/* New fields */}
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm md:col-span-2">
                        <div className="text-xs font-medium uppercase text-gray-500 mb-1">Product Description</div>
                        <div className="font-semibold text-gray-800">{selectedItem.description || "No description available"}</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm">
                        <div className="text-xs font-medium uppercase text-gray-500 mb-1">Purchase Price</div>
                        <div className="font-semibold text-gray-800">{selectedItem.purchasePrice || "N/A"}</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm">
                        <div className="text-xs font-medium uppercase text-gray-500 mb-1">Date Received</div>
                        <div className="font-semibold text-gray-800">{selectedItem.dateReceived || "N/A"}</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm">
                        <div className="text-xs font-medium uppercase text-gray-500 mb-1">Warranty Duration</div>
                        <div className="font-semibold text-gray-800">{selectedItem.warrantyDuration ? `${selectedItem.warrantyDuration} months` : "N/A"}</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm">
                        <div className="text-xs font-medium uppercase text-gray-500 mb-1">Old Item</div>
                        <div className="font-semibold text-gray-800">{selectedItem.isOldItem ? "Yes" : "No"}</div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-3 mt-8 pt-4 border-t border-gray-200">
                      <button
                        onClick={closeInventoryModal}
                        className="px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
                      >
                        Close
                      </button>
                      <button
                        onClick={toggleEditMode}
                        className="px-4 py-2 text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm transition-all duration-200 flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                        Edit Item
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Add New Item Modal */}
        {isAddItemModalOpen && (
          <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-xl w-[95%] max-w-2xl shadow-2xl overflow-hidden animate-fadeIn">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-4 text-white flex justify-between items-center">
                <h2 className="text-xl font-semibold flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add New Inventory Item
                </h2>
                <button
                  onClick={closeAddItemModal}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="p-6">
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-700">Serial Number*</label>
                      <input 
                        type="text" 
                        className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        value={newItem.serialNumber}
                        onChange={(e) => handleNewItemChange("serialNumber", e.target.value)}
                        required
                        placeholder="Enter serial number"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-700">Category*</label>
                      <select
                        className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        value={newItem.category}
                        onChange={(e) => handleNewItemChange("category", e.target.value)}
                      >
                        {categories.filter(c => c !== "All").map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-700">Brand*</label>
                      <input 
                        type="text" 
                        className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        value={newItem.brand}
                        onChange={(e) => handleNewItemChange("brand", e.target.value)}
                        required
                        placeholder="Enter brand name"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-700">Model*</label>
                      <input 
                        type="text" 
                        className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        value={newItem.model}
                        onChange={(e) => handleNewItemChange("model", e.target.value)}
                        required
                        placeholder="Enter model number"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-700">Location</label>
                      <select
                        className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        value={newItem.location}
                        onChange={(e) => handleNewItemChange("location", e.target.value)}
                      >
                        {["Warehouse A", "Warehouse B", "Warehouse C", "Warehouse D", "Warehouse E"].map(loc => (
                          <option key={loc} value={loc}>{loc}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-700">Selling Price*</label>
                      <input 
                        type="text" 
                        className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        value={newItem.sellingPrice}
                        onChange={(e) => handleNewItemChange("sellingPrice", e.target.value)}
                        required
                        placeholder="e.g. ₱1000.00"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-700">Sale Status</label>
                      <select
                        className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        value={newItem.saleStatus}
                        onChange={(e) => handleNewItemChange("saleStatus", e.target.value)}
                      >
                        <option value="Not Sold">Not Sold</option>
                        <option value="Sold">Sold</option>
                      </select>
                    </div>
                    
                    {/* New fields */}
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Product Description</label>
                      <textarea 
                        className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        rows="3"
                        value={newItem.description}
                        onChange={(e) => handleNewItemChange("description", e.target.value)}
                        placeholder="Enter product description"
                      ></textarea>
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-700">Purchase Price</label>
                      <input 
                        type="text" 
                        className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        value={newItem.purchasePrice}
                        onChange={(e) => handleNewItemChange("purchasePrice", e.target.value)}
                        placeholder="e.g. ₱800.00"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-700">Date Received</label>
                      <input 
                        type="date" 
                        className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        value={newItem.dateReceived}
                        onChange={(e) => handleNewItemChange("dateReceived", e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-700">Warranty Duration (months)</label>
                      <input 
                        type="number" 
                        className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        value={newItem.warrantyDuration}
                        onChange={(e) => handleNewItemChange("warrantyDuration", e.target.value)}
                        min="0"
                        placeholder="e.g. 12"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-700">Old Item</label>
                      <div className="p-2.5 flex items-center">
                        <input 
                          type="checkbox" 
                          className="h-5 w-5 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                          checked={newItem.isOldItem}
                          onChange={(e) => handleNewItemChange("isOldItem", e.target.checked)}
                        />
                        <span className="ml-2 text-sm text-gray-700">Yes</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between space-x-3 mt-8 pt-4 border-t border-gray-200">
                    <div className="text-xs text-gray-500">* Required fields</div>
                    <div className="flex space-x-3">
                      <button
                        onClick={closeAddItemModal}
                        className="px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={addNewItem}
                        className="px-4 py-2 text-sm font-medium rounded-md text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 shadow-sm transition-all duration-200 flex items-center"
                        disabled={!newItem.serialNumber || !newItem.brand || !newItem.model}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Add Item
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

// Export the component along with utility functions for accessing from other components
export { InventoryPage };
export default InventoryPage;