import React, { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { RefreshCw, Package, AlertTriangle, Eye, Edit, X, FileText, ShoppingBag, AlertOctagon, Loader } from "lucide-react";

// API endpoints and utility functions (commented out until backend is ready)
/*
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
const ENDPOINTS = {
  INVENTORY: `${API_BASE_URL}/inventory/`,
  DAMAGED_INVENTORY: `${API_BASE_URL}/damaged-inventory/`,
};

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

const updateProductStatusAPI = async (productId, updates) => {
  try {
    const response = await fetch(`${ENDPOINTS.INVENTORY}${productId}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`Error updating product ${productId}:`, error);
    return null;
  }
};
*/

const InventoryPage = ({ onInventoryUpdate }) => {
  const [products, setProducts] = useState([]);
  const [damagedProducts, setDamagedProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("available");
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [categoryStats, setCategoryStats] = useState({});
  // Add loading state for API calls
  const [isLoading, setIsLoading] = useState(false);
  
  // New states for enhanced functionality
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedItem, setEditedItem] = useState(null);

  // Function to save products to localStorage
  const saveProductsToLocalStorage = (products) => {
    localStorage.setItem('inventoryData', JSON.stringify(products));
  };

  // Function to load products from localStorage (with fallback)
  const loadProductsFromLocalStorage = () => {
    try {
      const savedProducts = localStorage.getItem('inventoryData');
      if (savedProducts) {
        return JSON.parse(savedProducts);
      }
    } catch (error) {
      console.error("Error loading inventory data:", error);
    }
    return null; // Return null if data couldn't be loaded
  };

  const categories = ["All", "Processor", "Motherboards", "Video Cards", "Monitors", "Laptops", "Printers", "Toners", "Inks", "Networking", "DSLR Camera", "CCTV Camera", "Keyboard & Mouse", "Webcam", "Power Supply", "Thin Client"];
  useEffect(() => {
    loadInventoryData();
  }, []);
  
  // Function to load inventory data (will be switched to API when ready)
  const loadInventoryData = () => {
    setIsLoading(true);
    
    // First try to load from localStorage
    const savedData = loadProductsFromLocalStorage();
    
    if (savedData && savedData.length > 0) {
      setProducts(savedData);
      
      // Calculate category statistics
      const stats = calculateCategoryStats(savedData);
      setCategoryStats(stats);
      
      // Notify parent component if needed
      if (onInventoryUpdate) {
        onInventoryUpdate(savedData);
      }
      
      setIsLoading(false);
    } else {
      /* 
      // When API is ready, uncomment this section
      Promise.all([fetchInventory(), fetchDamagedInventory()])
        .then(([inventoryData, damagedData]) => {
          if (inventoryData) {
            setProducts(inventoryData);
            // Update localStorage for other components to use
            localStorage.setItem('inventoryData', JSON.stringify(inventoryData));
            
            // Calculate category statistics
            const stats = calculateCategoryStats(inventoryData);
            setCategoryStats(stats);
            
            // Notify parent component if needed
            if (onInventoryUpdate) {
              onInventoryUpdate(inventoryData);
            }
          }
          
          if (damagedData) {
            setDamagedProducts(damagedData);
          }
          
          setIsLoading(false);
        })
        .catch(error => {
          console.error("Error loading inventory data:", error);
          // Fall back to generating mock data
          generateProductData();
          setIsLoading(false);
        });
      */
      
      // For now, generate mock data only if nothing in localStorage
      generateProductData();
      setIsLoading(false);
    }
  };

  const generateProductData = () => {
    const productCategories = ["Processor", "Motherboards", "Video Cards", "Monitors", "Laptops", "Printers", "Toners", "Inks", "Networking", "DSLR Camera", "CCTV Camera", "Keyboard & Mouse", "Webcam", "Power Supply", "Thin Client"];
    const brands = ["Dell", "Lenovo", "HP", "Asus", "Acer", "Logitech", "Microsoft", "Cisco", "TP-Link", "Kingston", "Crucial", "Intel", "AMD", "MSI", "Gigabyte", "EVGA", "Samsung", "LG", "Canon", "Epson", "Brother", "Hikvision", "Dahua", "Nikon", "Sony", "Corsair"];
    const models = {
      "Processor": ["Core i9", "Core i7", "Core i5", "Ryzen 9", "Ryzen 7", "Ryzen 5"],
      "Motherboards": ["Z690", "B550", "X570", "H610", "B660", "TUF Gaming"],
      "Video Cards": ["RTX 4090", "RTX 4080", "RTX 3080", "RX 6900 XT", "RX 6800", "GTX 1660"],
      "Monitors": ["Odyssey G7", "UltraGear", "ProArt", "UltraSharp", "Predator"],
      "Laptops": ["XPS 15", "ThinkPad X1", "EliteBook", "ROG Strix", "Predator"],
      "Printers": ["LaserJet Pro", "PIXMA", "EcoTank", "WorkForce", "OfficeJet Pro"],
      "Toners": ["TN-760", "CF410X", "CE505X", "TK-5240", "MLT-D101S"],
      "Inks": ["HP 67XL", "Canon PG-245", "Epson 702", "Brother LC3033", "HP 910"],
      "Networking": ["Nighthawk", "Archer", "UniFi", "EdgeRouter", "Catalyst"],
      "DSLR Camera": ["EOS 90D", "D7500", "Alpha a7 III", "EOS R6", "Z6 II"],
      "CCTV Camera": ["Dome 4MP", "Bullet 8MP", "PTZ 2MP", "Turret 5MP", "Fisheye 12MP"],
      "Keyboard & Mouse": ["MX Keys", "G502", "DeathAdder", "M590", "MX Master"],
      "Webcam": ["BRIO 4K", "StreamCam", "Facecam", "Kiyo Pro", "C920"],
      "Power Supply": ["RM850x", "SuperNOVA 750", "TUF 650W", "Focus GX-750", "MWE 650"],
      "Thin Client": ["T640", "t640", "mt45", "t430", "t558"]
    };

    // Create products with unique IDs by category
    const productData = [];
    let idCounter = 1;

    productCategories.forEach(category => {
      // Create 10 products for each category
      for (let i = 0; i < 30; i++) {
        const brand = brands[Math.floor(Math.random() * brands.length)];
        const model = models[category][Math.floor(Math.random() * models[category].length)];
        const serialNumber = `SN${category.substring(0, 2).toUpperCase()}${10000 + idCounter}`;
        const sold = Math.random() > 0.7; // 30% chance of being sold
        
        // Create product with additional fields
        productData.push({
          id: idCounter,
          serialNumber,
          category,
          brand,
          model: `${model} ${Math.floor(Math.random() * 100)}`,
          location: `Warehouse ${String.fromCharCode(65 + (idCounter % 5))}`,
          sellingPrice: `₱${(Math.random() * 10000 + 500).toFixed(2)}`,
          saleStatus: sold ? "Sold" : "Not Sold",
          // Additional fields
          description: `${brand} ${model} for ${category} applications. High performance model.`,
          purchasePrice: `₱${(Math.random() * 8000 + 300).toFixed(2)}`,
          dateReceived: `2023-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
          warrantyDuration: `${Math.floor(Math.random() * 24) + 6}`,
          isOldItem: Math.random() > 0.8 // 20% chance of being old item
        });
        
        idCounter++;
      }
    });

    // Calculate category statistics with updated function
    const stats = calculateCategoryStats(productData);
    
    setProducts(productData);
    setCategoryStats(stats);

    // Generate damaged products
    const damagedData = Array.from({ length: 20 }, (_, i) => {
      const category = productCategories[i % productCategories.length];
      return {
        id: 1000 + i,
        serialNumber: `SN-DMG${20000 + i}`,
        category,
        brand: brands[Math.floor(Math.random() * brands.length)],
        model: models[category][Math.floor(Math.random() * models[category].length)],
        location: `Warehouse ${String.fromCharCode(65 + (i % 5))}`,
        // Additional fields
        description: `Damaged ${category} item. Not functional.`,
        purchasePrice: `₱${(Math.random() * 8000 + 300).toFixed(2)}`,
        dateReceived: `2023-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
        warrantyDuration: "0",
        isOldItem: true
      };
    });

    setDamagedProducts(damagedData);
    
    // Save inventory data to localStorage for SalesOrderPage to access
    localStorage.setItem('inventoryData', JSON.stringify(productData));
    
    // If there's a parent component callback, inform it about the initial inventory
    if (onInventoryUpdate) {
      onInventoryUpdate(productData);
    }
  };

  // Updated category stats calculation to include sold count explicitly
  const calculateCategoryStats = (productData) => {
    const stats = {};
    
    // Calculate stats for each individual category
    categories.forEach(cat => {
      if (cat !== "All") {
        const categoryProducts = productData.filter(p => p.category === cat);
        const totalCount = categoryProducts.length;
        const availableCount = categoryProducts.filter(p => p.saleStatus === "Not Sold").length;
        const soldCount = categoryProducts.filter(p => p.saleStatus === "Sold").length;
        
        stats[cat] = {
          total: totalCount,
          available: availableCount,
          sold: soldCount
        };
      }
    });
    
    // Calculate total stats
    const totalCount = productData.length;
    const totalAvailable = productData.filter(p => p.saleStatus === "Not Sold").length;
    const totalSold = productData.filter(p => p.saleStatus === "Sold").length;
    
    stats["All"] = {
      total: totalCount,
      available: totalAvailable,
      sold: totalSold,
      details: Object.keys(stats).map(cat => ({
        category: cat,
        total: stats[cat].total,
        available: stats[cat].available,
        sold: stats[cat].sold
      }))
    };
    
    return stats;
  };
  const openInventoryModal = (item) => {
    setSelectedItem(item);
    setEditedItem({...item});
    setIsEditMode(false);
    setIsInventoryModalOpen(true);
  };  
  
  const closeInventoryModal = () => {
    setSelectedItem(null);
    setEditedItem(null);
    setIsEditMode(false);
    setIsInventoryModalOpen(false);
  };

  // Function to update product status - this will be used by SalesOrderPage
  const updateProductStatus = (productId, newStatus) => {
    /* 
    // When API is ready, uncomment this section
    return updateProductStatusAPI(productId, { saleStatus: newStatus })
      .then(updatedProduct => {
        if (updatedProduct) {
          // Update local state with the updated product
          const updatedProducts = products.map(product => 
            product.id === productId ? updatedProduct : product
          );
          
          setProducts(updatedProducts);
          
          // Update category statistics
          const stats = calculateCategoryStats(updatedProducts);
          setCategoryStats(stats);
          
          // Update localStorage for other components
          localStorage.setItem('inventoryData', JSON.stringify(updatedProducts));
          
          // If there's a parent component callback, inform it
          if (onInventoryUpdate) {
            onInventoryUpdate(updatedProducts);
          }
          
          return true;
        }
        return false;
      })
      .catch(error => {
        console.error(`Error updating product ${productId} status:`, error);
        return false;
      });
    */
    
    // For now, continue using local state updates
    const updatedProducts = products.map(product => 
      product.id === productId 
        ? { ...product, saleStatus: newStatus } 
        : product
    );
    
    setProducts(updatedProducts);
    
    // Update category statistics after updating product status
    const stats = calculateCategoryStats(updatedProducts);
    setCategoryStats(stats);
    
    // Update localStorage with the updated products
    localStorage.setItem('inventoryData', JSON.stringify(updatedProducts));
    
    // If there's a parent component callback for inventory updates, call it
    if (onInventoryUpdate) {
      onInventoryUpdate(updatedProducts);
    }
    
    return updatedProducts;
  };

  // Expose getProducts function to allow SalesOrderPage to access inventory
  const getProducts = () => {
    return products;
  };

  // Functions for enhanced functionality
  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const handleEditChange = (field, value) => {
    setEditedItem({
      ...editedItem,
      [field]: value
    });
  };

  const saveEditedItem = () => {
    // In a real app, this would call an API
    const updatedProducts = products.map(product => 
      product.id === editedItem.id ? editedItem : product
    );
    
    setProducts(updatedProducts);
    setSelectedItem(editedItem);
    setIsEditMode(false);
    
    // Update localStorage
    localStorage.setItem('inventoryData', JSON.stringify(updatedProducts));
    
    // If there's a parent component callback for inventory updates, call it
    if (onInventoryUpdate) {
      onInventoryUpdate(updatedProducts);
    }
  };

  // Add refresh button functionality
  const handleRefreshInventory = () => {
    loadInventoryData();
  };

  const filteredProducts = products.filter(product => 
    categoryFilter === "All" || product.category === categoryFilter
  );
  return (
    <DashboardLayout>
      <div className="p-2 bg-white min-h-screen">
        {/* Header Section with Gradient Accent */}
        <div className="sticky top-0 z-20 space-y-2 px-6 py-4 bg-white border-b border-gray-200 mb-6 shadow-sm rounded-lg">
        
          {/* Tab Buttons */}
          <div className="flex gap-1 mb-4">
            <button 
              onClick={() => setActiveTab("available")} 
              className={`px-6 py-2.5 rounded-md font-medium text-sm transition-all duration-200 flex items-center 
              ${activeTab === "available" 
                ? "bg-indigo-600 text-white shadow-md" 
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              <ShoppingBag className="h-5 w-5 mr-2" />
              Available Products
            </button>
            <button 
              onClick={() => setActiveTab("damaged")} 
              className={`px-6 py-2.5 rounded-md font-medium text-sm transition-all duration-200 flex items-center
              ${activeTab === "damaged" 
                ? "bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-md" 
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              <AlertTriangle className="h-5 w-5 mr-2" />
              Damaged Products
            </button>
          </div>

          {/* Updated Category Filter and Summary Section */}
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
              
              {/* Updated Summary Section with three categories */}
              <div className="flex items-center bg-blue-50 rounded-lg p-3 border border-blue-100 shadow-sm">
                <div className="flex flex-wrap items-center gap-6">
                  <div>
                    <span className="text-gray-500 text-sm">Total Products</span>
                    <div className="font-semibold text-lg text-blue-700">
                      {categoryFilter === "All" ? categoryStats.All?.total || 0 : categoryStats[categoryFilter]?.total || 0}
                    </div>
                  </div>
                  
                  <div className="hidden sm:block h-10 w-px bg-blue-200"></div>
                  
                  <div>
                    <span className="text-gray-500 text-sm">Available</span>
                    <div className="font-semibold text-lg text-green-600">
                      {categoryFilter === "All" ? categoryStats.All?.available || 0 : categoryStats[categoryFilter]?.available || 0}
                    </div>
                  </div>
                  
                  <div className="hidden sm:block h-10 w-px bg-blue-200"></div>
                  
                  <div>
                    <span className="text-gray-500 text-sm">Sold</span>
                    <div className="font-semibold text-lg text-red-600">
                      {categoryFilter === "All" ? categoryStats.All?.sold || 0 : categoryStats[categoryFilter]?.sold || 0}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-center items-center h-40">
            <div className="flex items-center bg-blue-50 px-6 py-4 rounded-lg border border-blue-100">
              <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" />
              <span className="text-lg text-blue-700 font-medium">Loading inventory data...</span>
            </div>
          </div>
        )}

        {/* Tab Content - Table Available Products - Status column removed */}
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
                      <td className="px-4 py-3 whitespace-nowrap text-center">
                        <button
                          className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all duration-200"
                          onClick={() => openInventoryModal(item)}
                        >
                          <Eye className="h-4 w-4 mr-1.5" />
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan="7" className="px-4 py-8 text-center text-gray-500 bg-gray-50">
                        <Package className="mx-auto h-12 w-12 text-gray-400" />
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
                          <Eye className="h-4 w-4 mr-1.5" />
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                  {damagedProducts.length === 0 && (
                    <tr>
                      <td colSpan="7" className="px-4 py-8 text-center text-gray-500 bg-gray-50">
                        <AlertOctagon className="mx-auto h-12 w-12 text-gray-400" />
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
          <div className="bg-indigo-600 p-4 text-white flex justify-between items-center">
            <h2 className="text-xl font-semibold flex items-center">
              <FileText className="h-6 w-6 mr-2" />
              Product Details
            </h2>
            <button
              onClick={closeInventoryModal}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="p-6">
            {/* View Details - Simplified with only the requested fields */}
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-4">
                {/* Product Description */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm">
                  <div className="text-xs font-medium uppercase text-gray-500 mb-1">Product Description</div>
                  <div className="font-semibold text-gray-800">{selectedItem.description || "No description available"}</div>
                </div>
                
                {/* Purchase Price */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm">
                  <div className="text-xs font-medium uppercase text-gray-500 mb-1">Purchase Price</div>
                  <div className="font-semibold text-gray-800">{selectedItem.purchasePrice || "N/A"}</div>
                </div>
                
                {/* Date Received */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm">
                  <div className="text-xs font-medium uppercase text-gray-500 mb-1">Date Received</div>
                  <div className="font-semibold text-gray-800">{selectedItem.dateReceived || "N/A"}</div>
                </div>
                
                {/* Warranty Start */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm">
                  <div className="text-xs font-medium uppercase text-gray-500 mb-1">Warranty Start</div>
                  <div className="font-semibold text-gray-800">{selectedItem.dateReceived || "N/A"}</div>
                </div>
                
                {/* Warranty End */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm">
                  <div className="text-xs font-medium uppercase text-gray-500 mb-1">Warranty End</div>
                  <div className="font-semibold text-gray-800">
                    {selectedItem.dateReceived && selectedItem.warrantyDuration 
                      ? (() => {
                          const startDate = new Date(selectedItem.dateReceived);
                          const endDate = new Date(startDate);
                          endDate.setMonth(startDate.getMonth() + parseInt(selectedItem.warrantyDuration));
                          return endDate.toISOString().split('T')[0];
                        })() 
                      : "N/A"}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-8 pt-4 border-t border-gray-200">
                <button
                  onClick={closeInventoryModal}
                  className="px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
                >
                  Close
                </button>
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
export { InventoryPage };
export default InventoryPage;