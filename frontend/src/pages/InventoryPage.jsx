import React, { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";

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

  const categories = ["All", "Processor", "Motherboards", "Video Cards", "Monitors", "Laptops", "Printers", "Toners", "Inks", "Networking", "DSLR Camera", "CCTV Camera", "Keyboard & Mouse", "Webcam", "Power Supply", "Thin Client"];

  useEffect(() => {
    loadInventoryData();
  }, []);
  
  // Function to load inventory data (will be switched to API when ready)
  const loadInventoryData = () => {
    setIsLoading(true);
    
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
    
    // For now, generate mock data
    generateProductData();
    setIsLoading(false);
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
        
        productData.push({
          id: idCounter,
          serialNumber,
          category,
          brand,
          model: `${model} ${Math.floor(Math.random() * 100)}`,
          location: `Warehouse ${String.fromCharCode(65 + (idCounter % 5))}`,
          sellingPrice: `₱${(Math.random() * 10000 + 500).toFixed(2)}`,
          saleStatus: sold ? "Sold" : "Not Sold",
        });
        
        idCounter++;
      }
    });

    // Calculate category statistics
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

  const calculateCategoryStats = (productData) => {
    const stats = {};
    
    // Calculate stats for each individual category
    categories.forEach(cat => {
      if (cat !== "All") {
        const categoryProducts = productData.filter(p => p.category === cat);
        const totalCount = categoryProducts.length;
        const availableCount = categoryProducts.filter(p => p.saleStatus === "Not Sold").length;
        
        stats[cat] = {
          quantity: totalCount,
          available: availableCount
        };
      }
    });
    
    // Calculate total stats
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

  const openInventoryModal = (item) => {
    setSelectedItem(item);
    setIsInventoryModalOpen(true);
  };  
  
  const closeInventoryModal = () => {
    setSelectedItem(null);
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

  const filteredProducts = products.filter(product => 
    categoryFilter === "All" || product.category === categoryFilter
  );

  // Add refresh button functionality
  const handleRefreshInventory = () => {
    loadInventoryData();
  };

  return (
    <DashboardLayout>
      <div className="p-2 from-purple-500 to-purple-200 min-h-screen">
        <div className="sticky top-0 z-20 space-y-2 px-2 pb-2 bg-purple-300 rounded mb-2">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-purple-700 mb-4">Inventory Management</h1>
            
            {/* Add refresh button */}
            <button 
              onClick={handleRefreshInventory} 
              className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 flex items-center"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Refresh Inventory"}
            </button>
          </div>
        
          {/* Tab Buttons */}
          <div className="flex gap-1 mb-4">
            <button onClick={() => setActiveTab("available")} className={`px-4 py-2 rounded font-semibold text-lg 
            ${activeTab === "available" ? "bg-blue-500 text-white" : "bg-blue-100 text-blue-600"}`}>
              Available Products
            </button>
            <button onClick={() => setActiveTab("damaged")} className={`px-4 py-2 rounded font-semibold text-lg 
            ${activeTab === "damaged" ? "bg-red-500 text-white" : "bg-red-100 text-red-600"}`}>
              Damaged Products
            </button>
          </div>

          {/* Category Filter and Quantity Display */}
          {activeTab === "available" && (
            <div>
              <div className="flex items-center gap-4 mb-2">
                <div className="flex items-center">
                  <label htmlFor="category-filter" className="mr-2 bg-gray-300 px-3 py-2 rounded">Category:</label>
                  <select
                    id="category-filter"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="p-2 border rounded bg-white"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                
                {categoryFilter === "All" ? (
                  <div className="bg-gray-300 px-2 py-2 rounded">
                    Total Quantity: <span className="font-semibold mr-2">{categoryStats.All?.quantity || 0}</span>  
                    Total Available: <span className="font-semibold">{categoryStats.All?.available || 0}</span>
                  </div>
                ) : (
                  <div className="bg-gray-300 px-3 py-2 rounded">
                    Quantity: <span className="font-semibold mr-2">{categoryStats[categoryFilter]?.quantity || 0}</span>  
                    Available: <span className="font-semibold">{categoryStats[categoryFilter]?.available || 0}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-center items-center h-40">
            <div className="text-xl text-purple-600">Loading inventory data...</div>
          </div>
        )}

        {/* Tab Content - Table Available Products */}
        {!isLoading && activeTab === "available" && (
          <div className="bg-blue-400 shadow-lg flex flex-col h-[calc(100vh-170px)] overflow-hidden">
            <div className="flex-grow overflow-auto">
              <table className="min-w-full border border-black">
                <thead className="sticky top-0 z-20 border-black bg-blue-300 text-left text-sm font-medium text-gray-800">
                  <tr>
                    <th className="p-2 border">Item ID</th>
                    <th className="p-2 border">Serial Number</th>
                    <th className="p-2 border">Brand</th>
                    <th className="p-2 border">Model</th>
                    <th className="p-2 border">Location</th>
                    <th className="p-2 border">Selling Price</th>
                    <th className="p-2 border">Sale Status</th>
                    <th className="p-2 border text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((item) => (
                    <tr 
                      key={item.id} 
                      className={`text-sm ${item.saleStatus === "Sold" ? "bg-red-200" : "bg-green-100"} border-t`}
                    >
                      <td className="p-2 border">{item.id}</td>
                      <td className="p-2 border">{item.serialNumber}</td>
                      <td className="p-2 border">{item.brand}</td>
                      <td className="p-2 border">{item.model}</td>
                      <td className="p-2 border">{item.location}</td>
                      <td className="p-2 border">{item.sellingPrice}</td>
                      <td className="p-2 border">
                        <span className={`px-2 py-1 rounded ${item.saleStatus === "Sold" ? "bg-red-500 text-white" : "bg-green-500 text-white"}`}>
                          {item.saleStatus}
                        </span>
                      </td>
                      <td className="p-2 border text-center">
                        <button
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700"
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

        {/* Tab Content - Table Damaged Products */}
        {!isLoading && activeTab === "damaged" && (
          <div className="bg-red-400 shadow-lg flex flex-col h-[calc(100vh-170px)] overflow-hidden">
            <div className="flex-grow overflow-auto">
              <table className="min-w-full border border-black rounded">
                <thead className="sticky top-0 bg-red-300 text-left text-sm font-medium text-gray-800">
                  <tr>
                    <th className="p-2 border">Item ID</th>
                    <th className="p-2 border">Serial Number</th>
                    <th className="p-2 border">Category</th>
                    <th className="p-2 border">Brand</th>
                    <th className="p-2 border">Model</th>
                    <th className="p-2 border">Location</th>
                  </tr>
                </thead>
                <tbody>
                  {damagedProducts.map((item) => (
                    <tr key={item.id} className="border bg-red-100">
                      <td className="p-2 border">{item.id}</td>
                      <td className="p-2 border">{item.serialNumber}</td>
                      <td className="p-2 border">{item.category}</td>
                      <td className="p-2 border">{item.brand}</td>
                      <td className="p-2 border">{item.model}</td>
                      <td className="p-2 border">{item.location}</td>
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
                Product Details
              </h2>
              <ul className="space-y-2 text-gray-700">
                <li><strong>ID:</strong> {selectedItem.id}</li>
                <li><strong>Serial Number:</strong> {selectedItem.serialNumber}</li>
                <li><strong>Category:</strong> {selectedItem.category}</li>
                <li><strong>Brand:</strong> {selectedItem.brand}</li>
                <li><strong>Model:</strong> {selectedItem.model}</li>
                <li><strong>Location:</strong> {selectedItem.location}</li>
                <li><strong>Selling Price:</strong> {selectedItem.sellingPrice}</li>
                <li><strong>Sale Status:</strong> {selectedItem.saleStatus}</li>
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

// Export the component along with utility functions for accessing from other components
export { InventoryPage };
export default InventoryPage;