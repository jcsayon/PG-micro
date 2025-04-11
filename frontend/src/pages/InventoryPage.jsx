import React, { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";

const InventoryPage = () => {
  const [products, setProducts] = useState([]);
  const [damagedProducts, setDamagedProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("available");
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [categoryStats, setCategoryStats] = useState({});

  const categories = ["All", "Laptop", "Keyboard", "Mouse", "Router", "Switch", "RAM"];

  useEffect(() => {
    generateProductData();
  }, []);

  const generateProductData = () => {
    const productCategories = ["Laptop", "Keyboard", "Mouse", "Router", "Switch", "RAM"];
    const brands = ["Dell", "Lenovo", "HP", "Asus", "Acer", "Logitech", "Microsoft", "Cisco", "TP-Link", "Kingston", "Crucial"];
    const models = {
      Laptop: ["XPS 15", "ThinkPad X1", "EliteBook", "ROG Strix", "Predator"],
      Keyboard: ["K380", "MX Keys", "G915", "Huntsman", "K70"],
      Mouse: ["MX Master", "G502", "DeathAdder", "M590", "M720"],
      Router: ["RT-AX86U", "Nighthawk", "Archer C7", "WRT3200ACM", "AC1900"],
      Switch: ["SG300", "JL385A", "DGS-1100", "TL-SG108", "GS308"],
      RAM: ["Fury", "Vengeance", "Ripjaws", "Ballistix", "Trident Z"],
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

  const openInventoryModal = (item) => {setSelectedItem(item);setIsInventoryModalOpen(true);};  
  const closeInventoryModal = () => {setSelectedItem(null);setIsInventoryModalOpen(false);};

  const filteredProducts = products.filter(product => 
    categoryFilter === "All" || product.category === categoryFilter
  );

  return (
    <DashboardLayout>
      <div className="p-2 from-purple-500 to-purple-200 min-h-screen">
        <div className="sticky top-0 z-20 space-y-2 px-2 pb-2 bg-purple-300 rounded mb-2">
          <h1 className="text-2xl font-bold text-purple-700 mb-4">Inventory Management</h1>
        
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
              
              {/* Display all category counts when "All" is selected */}
              {categoryFilter === "All" && (
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {categories.filter(cat => cat !== "All").map(cat => (
                    <div key={cat} className="bg-gray-300 px-3 py-2 rounded">
                      <span className="font-semibold mr-2">{cat}:</span>
                      Quantity: <span className="font-semibold mr-2">{categoryStats[cat]?.quantity || 0}</span> 
                      Available: <span className="font-semibold">{categoryStats[cat]?.available || 0}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Tab Content - Table Available Products */}
        {activeTab === "available" && (
          <div className="bg-blue-400 shadow-lg flex flex-col">
            <div className="flex-grow">
              <table className="min-w-full border border-black">
                <thead className={`sticky ${categoryFilter === "All" ? "top-[265px]" : "top-[170px]"} z-20 border-black bg-blue-300 text-left text-sm font-medium text-gray-800`}>
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
        {activeTab === "damaged" && (
          <div className="bg-red-400 shadow-lg flex flex-col">
            <div className="flex-grow">
              <table className="min-w-full border border-black rounded">
                <thead className="sticky top-[100px] bg-red-300 text-left text-sm font-medium text-gray-800">
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

export default InventoryPage;