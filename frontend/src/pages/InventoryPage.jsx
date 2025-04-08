import React, { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";

// Define the component as a named const function
const InventoryPage = () => {
  const [inventory, setInventory] = useState([]);
  const [damagedProducts, setDamagedProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("available");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categoryStats, setCategoryStats] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
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
    generateDummyDamagedProducts();
  }, []);

  // Calculate category statistics whenever inventory changes
  useEffect(() => {
    const stats = {};
    
    // Initialize with all categories
    Object.keys(categoryBrandMap).forEach(category => {
      stats[category] = { total: 0, available: 0 };
    });
    
    // Calculate stats
    inventory.forEach(item => {
      if (!stats[item.category]) {
        stats[item.category] = { total: 0, available: 0 };
      }
      stats[item.category].total += item.quantityReceived;
      stats[item.category].available += item.quantityAvailable;
    });
    
    setCategoryStats(stats);
  }, [inventory]);

  const generateDummyData = () => {
    const categoryList = Object.keys(categoryBrandMap);
    const inventoryData = Array.from({ length: 60 }, (_, i) => {
      const randomCategory =
        categoryList[Math.floor(Math.random() * categoryList.length)];
      const brandArray = categoryBrandMap[randomCategory];
      const randomBrand =
        brandArray[Math.floor(Math.random() * brandArray.length)];

      // For demonstration, quantityReceived might be different from quantityAvailable
      const qtyReceived = Math.floor(Math.random() * 100) + 1;
      const qtyAvailable = Math.floor(Math.random() * qtyReceived) + 1;

      // Generate a random date/time in 2024 as a timestamp string
      const randomDate = new Date(
        2024,
        Math.floor(Math.random() * 12),
        Math.floor(Math.random() * 28) + 1,
        Math.floor(Math.random() * 24),
        Math.floor(Math.random() * 60),
        Math.floor(Math.random() * 60)
      ).toLocaleString();
      
      const stockStatus = qtyAvailable === 0 ? "Out of Stock" : 
                         qtyAvailable < 10 ? "Limited Stock" : "In Stock";
      
      const salesStatus = ["Available", "Reserved", "Sold"][Math.floor(Math.random() * 3)];

      return {
        id: i + 1,
        category: randomCategory,
        brand: randomBrand,
        serialNumber: `SN${10000 + i}`,
        quantityReceived: qtyReceived,
        quantityAvailable: qtyAvailable,
        stockStatus: stockStatus,
        sellingPrice: `₱${(Math.random() * 10000 + 500).toFixed(2)}`,
        location: `Warehouse ${String.fromCharCode(65 + (i % 5))}`,
        productDescription: `High-quality ${randomBrand} ${randomCategory} with advanced features and reliable performance.`,
        purchasePrice: `₱${(Math.random() * 8000 + 300).toFixed(2)}`,
        warrantyDuration: `${Math.floor(Math.random() * 3) + 1} Years`,
        model: `${randomBrand}-M${100 + Math.floor(Math.random() * 900)}`,
        dateReceived: randomDate,
        isNew: Math.random() > 0.5 ? "New Item" : "Old Item",
        salesStatus: salesStatus
      };
    });
    setInventory(inventoryData);
  };

  const generateDummyDamagedProducts = () => {
    const categoryList = Object.keys(categoryBrandMap);
    const damagedData = Array.from({ length: 30 }, (_, i) => {
      const randomCategory =
        categoryList[Math.floor(Math.random() * categoryList.length)];
      const brandArray = categoryBrandMap[randomCategory];
      const randomBrand =
        brandArray[Math.floor(Math.random() * brandArray.length)];

      return {
        id: i + 101,
        category: randomCategory,
        brand: randomBrand,
        serialNumber: `DMG${9000 + i}`,
        model: `${randomBrand}-M${100 + Math.floor(Math.random() * 900)}`,
        location: `Warehouse ${String.fromCharCode(65 + (i % 5))}`
      };
    });
    setDamagedProducts(damagedData);
  };

  const handleViewDetails = (item) => {
    setSelectedItem(item);
    setShowDetailsModal(true);
  };

  // Apply filtering based on category and search term
const filteredInventory = selectedCategory === "All" 
  ? inventory.filter(item => {
      if (searchTerm === "") return true;
      return (
        (item.model && item.model.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.brand && item.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.serialNumber && item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    })
  : inventory.filter(item => {
      if (item.category !== selectedCategory) return false;
      if (searchTerm === "") return true;
      return (
        (item.model && item.model.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.brand && item.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.serialNumber && item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    });
       inventory.filter(item => {
        if (item.category !== selectedCategory) return false;
        if (searchTerm === "") return true;
        return (
          (item.model && item.model.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (item.brand && item.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (item.serialNumber && item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()))
        );

      });

  return (
    <DashboardLayout>
      <div className="p-5 bg-gray-50 min-h-screen">
        {/* Main Content Container */}
        <div className="max-w-full mx-auto">
          {/* Header Section */}
          <div className="bg-white rounded-xl shadow-sm p-5 mb-5">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-5 gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-1">
                  Inventory Management
                </h1>
                <p className="text-sm text-gray-500">
                  Manage your products, track stock levels and view inventory status
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add New Item
                </button>
                <button className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors flex items-center shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Export Inventory
                </button>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Filter View
                </button>
              </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
              <div className="bg-gray-50 rounded-lg p-4 flex items-center">
                <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 mr-4 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Items</p>
                  <p className="text-xl font-semibold text-gray-900">{inventory.length}</p>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">In Stock</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {inventory.filter(item => item.stockStatus === "In Stock").length}
                  </p>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 flex items-center">
                <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Limited Stock</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {inventory.filter(item => item.stockStatus === "Limited Stock").length}
                  </p>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 flex items-center">
                <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Damaged Items</p>
                  <p className="text-xl font-semibold text-gray-900">{damagedProducts.length}</p>
                </div>
              </div>
            </div>

            {/* Tab Buttons */}
            <div className="flex gap-1 border-b border-gray-200">
              <button
                onClick={() => setActiveTab("available")}
                className={`px-5 py-3 font-medium text-sm transition-colors ${
                  activeTab === "available"
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-gray-600 hover:text-indigo-500"
                }`}
              >
                Available Products
              </button>
              <button
                onClick={() => setActiveTab("damaged")}
                className={`px-5 py-3 font-medium text-sm transition-colors ${
                  activeTab === "damaged"
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-gray-600 hover:text-indigo-500"
                }`}
              >
                Damaged Products
              </button>
            </div>
          </div>

          {/* Tab Content - Available Products */}
          {activeTab === "available" && (
            <div className="bg-white shadow-sm rounded-xl overflow-hidden">
              {/* Filtering and Category Stats */}
              <div className="mb-1 flex flex-wrap items-center justify-between px-5 py-4 border-b border-gray-100">
                <div className="flex flex-wrap gap-4 mb-2 md:mb-0">
                  <div className="relative">
                    <select
                      id="categoryFilter"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="appearance-none pl-3 pr-10 py-2 border border-gray-300 rounded-md text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="All">All Categories</option>
                      {Object.keys(categoryBrandMap).map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-3 py-2 border border-gray-300 rounded-md text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
                
                {selectedCategory !== "All" && categoryStats[selectedCategory] && (
                  <div className="flex items-center px-4 py-2 bg-indigo-50 rounded-lg text-indigo-800 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                    </svg>
                    <span className="font-medium">{selectedCategory}:</span>&nbsp;Total: <span className="font-semibold mx-1">{categoryStats[selectedCategory]?.total || 0}</span> | 
                    Available: <span className="font-semibold mx-1">{categoryStats[selectedCategory]?.available || 0}</span>
                  </div>
                )}
              </div>

              <div className="overflow-auto" style={{ maxHeight: "calc(100vh - 370px)" }}>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="sticky top-0 bg-gray-50 shadow-sm z-10">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serial Number</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Selling Price</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredInventory.length === 0 ? (
                      <tr>
                        <td colSpan="9" className="px-6 py-10 text-center text-sm text-gray-500">
                          <div className="flex flex-col items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <p className="font-medium">No items found matching your criteria</p>
                            <p className="text-gray-400 mt-1">Try adjusting your search or filter parameters</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredInventory.map((item, index) => (
                        <tr key={item.id} className={`text-sm text-gray-700 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{item.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{item.model}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{item.brand}</td>
                          <td className="px-6 py-4 whitespace-nowrap font-mono text-xs">{item.serialNumber}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              item.stockStatus === "In Stock" ? "bg-green-100 text-green-800" :
                              item.stockStatus === "Limited Stock" ? "bg-yellow-100 text-yellow-800" :
                              "bg-red-100 text-red-800"
                            }`}>
                              <span className={`mr-1 h-2 w-2 rounded-full ${
                                item.stockStatus === "In Stock" ? "bg-green-600" :
                                item.stockStatus === "Limited Stock" ? "bg-yellow-600" :
                                "bg-red-600"
                              }`}></span>
                              {item.stockStatus}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">{item.location}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              item.salesStatus === "Available" ? "bg-blue-100 text-blue-800" :
                              item.salesStatus === "Reserved" ? "bg-purple-100 text-purple-800" :
                              "bg-gray-100 text-gray-800"
                            }`}>
                              {item.salesStatus}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-medium">{item.sellingPrice}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="flex items-center justify-center space-x-2">
                              <button 
                                className="inline-flex items-center p-1.5 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                                onClick={() => handleViewDetails(item)}
                                title="View Details"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </button>
                              <button 
                                className="inline-flex items-center p-1.5 border border-transparent rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
                                title="Edit Item"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className="px-5 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing <span className="font-medium">{filteredInventory.length}</span> items
                </div>
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                    Previous
                  </button>
                  <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content - Damaged Products */}
          {activeTab === "damaged" && (
            <div className="bg-white shadow-sm rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Damaged Inventory Items</h3>
                <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Damaged Item
                </button>
              </div>
              
              <div className="overflow-auto" style={{ maxHeight: "calc(100vh - 370px)" }}>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="sticky top-0 bg-gray-50 shadow-sm z-10">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serial Number</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {damagedProducts.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="px-6 py-10 text-center text-sm text-gray-500">
                          <div className="flex flex-col items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="font-medium">No damaged items found</p>
                            <p className="text-gray-400 mt-1">Damaged inventory items will appear here</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      damagedProducts.map((item, index) => (
                        <tr key={item.id} className={`text-sm text-gray-700 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{item.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{item.model}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{item.brand}</td>
                          <td className="px-6 py-4 whitespace-nowrap font-mono text-xs">{item.serialNumber}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              {item.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">{item.location}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="flex justify-center space-x-2">
                              <button className="inline-flex items-center p-1.5 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors" title="View Details">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </button>
                              <button className="inline-flex items-center p-1.5 border border-transparent rounded-md shadow-sm text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors" title="Edit Item">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button className="inline-flex items-center p-1.5 border border-transparent rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors" title="Delete Item">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              
              <div className="px-5 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing <span className="font-medium">{damagedProducts.length}</span> damaged items
                </div>
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                    Previous
                  </button>
                  <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Product Details Modal */}
          {showDetailsModal && selectedItem && (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden">
                <div className="bg-indigo-600 text-white py-4 px-6 flex justify-between items-center">
                  <h3 className="text-lg font-medium">Product Details</h3>
                  <button 
                    onClick={() => setShowDetailsModal(false)}
                    className="text-white hover:text-gray-200 focus:outline-none"
                  >
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="p-6">
                  {/* Product Header */}
                  <div className="bg-indigo-50 rounded-lg p-4 mb-5 border-l-4 border-indigo-600">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-xl text-gray-900 mb-1">{selectedItem.brand} {selectedItem.model}</h4>
                        <p className="text-gray-700 text-sm">{selectedItem.category} | Serial: <span className="font-mono">{selectedItem.serialNumber}</span></p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Selling Price</div>
                        <div className="text-xl font-bold text-indigo-700">{selectedItem.sellingPrice}</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Product Description */}
                  <div className="mb-5">
                    <h5 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Description</h5>
                    <p className="text-gray-800">{selectedItem.productDescription}</p>
                  </div>
                  
                  {/* Product Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 p-3 rounded-md">
                      <h5 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Inventory Details</h5>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Stock Status:</span>
                          <span className={`text-sm font-medium ${
                            selectedItem.stockStatus === "In Stock" ? "text-green-600" :
                            selectedItem.stockStatus === "Limited Stock" ? "text-yellow-600" :
                            "text-red-600"
                          }`}>
                            {selectedItem.stockStatus}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Location:</span>
                          <span className="text-sm font-medium text-gray-900">{selectedItem.location}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Quantity Received:</span>
                          <span className="text-sm font-medium text-gray-900">{selectedItem.quantityReceived}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Quantity Available:</span>
                          <span className="text-sm font-medium text-gray-900">{selectedItem.quantityAvailable}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Sales Status:</span>
                          <span className={`text-sm font-medium ${
                            selectedItem.salesStatus === "Available" ? "text-blue-600" :
                            selectedItem.salesStatus === "Reserved" ? "text-purple-600" :
                            "text-gray-600"
                          }`}>
                            {selectedItem.salesStatus}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-md">
                      <h5 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Financial & Warranty</h5>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Purchase Price:</span>
                          <span className="text-sm font-medium text-gray-900">{selectedItem.purchasePrice}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Selling Price:</span>
                          <span className="text-sm font-medium text-gray-900">{selectedItem.sellingPrice}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Warranty Duration:</span>
                          <span className="text-sm font-medium text-gray-900">{selectedItem.warrantyDuration}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Date Received:</span>
                          <span className="text-sm font-medium text-gray-900">{selectedItem.dateReceived}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Item Status:</span>
                          <span className="text-sm font-medium text-gray-900">{selectedItem.isNew}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <button 
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                      onClick={() => setShowDetailsModal(false)}
                    >
                      Close
                    </button>
                    <button 
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit Item
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )};
  export default InventoryPage;