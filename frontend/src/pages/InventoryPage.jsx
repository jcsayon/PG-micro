import React, { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { ShoppingBag, AlertTriangle, Eye, FileText, X, Loader, Package, AlertOctagon } from "lucide-react";

// --- API ENDPOINTS
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
const ENDPOINTS = {
  INVENTORY: `${API_BASE_URL}/inventory/`,
  DAMAGED_PRODUCTS: `${API_BASE_URL}/damaged-products/`,
  PRODUCTS: `${API_BASE_URL}/products/`,
  CATEGORIES: `${API_BASE_URL}/product-categories/`
};

const InventoryPage = ({ onInventoryUpdate }) => {
  const [products, setProducts] = useState([]);
  const [damagedProducts, setDamagedProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("available");
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [categoryStats, setCategoryStats] = useState({});
  const [categories, setCategories] = useState(["All"]);
  const [productsList, setProductsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const openInventoryModal = (item) => {
    setSelectedItem(item);
    setIsInventoryModalOpen(true);
  };

  const closeInventoryModal = () => {
    setSelectedItem(null);
    setIsInventoryModalOpen(false);
  };

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
      const response = await fetch(ENDPOINTS.DAMAGE_PRODUCTS);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Error fetching damaged products:", error);
      return [];
    }
  };
  

  const fetchProducts = async () => {
    try {
      const response = await fetch(ENDPOINTS.PRODUCTS);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(ENDPOINTS.CATEGORIES);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  };

  const loadInventoryData = async () => {
    setIsLoading(true);

    try {
      const [inventoryData, damagedData, productsData, categoriesData] = await Promise.all([
        fetchInventory(),
        fetchDamagedInventory(),
        fetchProducts(),
        fetchCategories()
      ]);

      if (inventoryData) {
        setProducts(inventoryData);
        const stats = calculateCategoryStats(inventoryData);
        setCategoryStats(stats);
        if (onInventoryUpdate) onInventoryUpdate(inventoryData);
      }

      if (damagedData) {
        setDamagedProducts(damagedData);
      }

      if (productsData) {
        setProductsList(productsData);
      }

      if (categoriesData) {
        setCategories(["All", ...categoriesData.map(c => c.name)]);
      }
    } catch (error) {
      console.error("Error loading inventory data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInventoryData();
  }, []);

  const calculateCategoryStats = (productData) => {
    const stats = {};
    categories.forEach(cat => {
      if (cat !== "All") {
        const catProducts = productData.filter(p => p.product_category === cat);
        const totalCount = catProducts.length;
        const availableCount = catProducts.filter(p => p.sale_status === "Not Sold").length;
        stats[cat] = { quantity: totalCount, available: availableCount };
      }
    });

    const totalCount = productData.length;
    const availableCount = productData.filter(p => p.sale_status === "Not Sold").length;

    stats["All"] = { quantity: totalCount, available: availableCount };

    return stats;
  };

  const filteredProducts = products.filter(item =>
    categoryFilter === "All" || item.product_category === categoryFilter
  );

  const findProductDetails = (productId) => {
    return productsList.find(p => p.id === productId) || {};
  };

  

  return (
    <DashboardLayout>
      <div className="p-2 bg-white min-h-screen">
        {/* Header */}
        <div className="sticky top-0 z-20 space-y-2 px-6 py-4 bg-white border-b border-gray-200 mb-6 shadow-sm rounded-lg">
          {/* Tab Buttons */}
          <div className="flex gap-1 mb-4">
            <button
              onClick={() => setActiveTab("available")}
              className={`px-6 py-2.5 rounded-md font-medium text-sm flex items-center ${
                activeTab === "available"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <ShoppingBag className="h-5 w-5 mr-2" />
              Available Products
            </button>
            <button
              onClick={() => setActiveTab("damaged")}
              className={`px-6 py-2.5 rounded-md font-medium text-sm flex items-center ${
                activeTab === "damaged"
                  ? "bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <AlertTriangle className="h-5 w-5 mr-2" />
              Damaged Products
            </button>
          </div>

          {/* Filter + Summary */}
          {activeTab === "available" && (
            <div className="flex flex-wrap items-center gap-4 mb-2">
              <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-200 shadow-sm">
                <label htmlFor="category-filter" className="ml-2 mr-2 text-gray-600 font-medium">Category:</label>
                <select
                  id="category-filter"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="p-2 border-0 rounded-md bg-white focus:ring-2 focus:ring-blue-300 focus:outline-none"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Product Summary */}
              <div className="flex items-center bg-blue-50 rounded-lg p-3 border border-blue-100 shadow-sm">
                <div className="flex flex-wrap items-center gap-6">
                  <div>
                    <span className="text-gray-500 text-sm">Total Products</span>
                    <div className="font-semibold text-lg text-blue-700">{categoryStats[categoryFilter]?.quantity || 0}</div>
                  </div>
                  <div className="hidden sm:block h-10 w-px bg-blue-200"></div>
                  <div>
                    <span className="text-gray-500 text-sm">Available</span>
                    <div className="font-semibold text-lg text-green-600">{categoryStats[categoryFilter]?.available || 0}</div>
                  </div>
                  <div className="hidden sm:block h-10 w-px bg-blue-200"></div>
                  <div>
                    <span className="text-gray-500 text-sm">Sold</span>
                    <div className="font-semibold text-lg text-red-600">
                      {(categoryStats[categoryFilter]?.quantity || 0) - (categoryStats[categoryFilter]?.available || 0)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center items-center h-40">
            <div className="flex items-center bg-blue-50 px-6 py-4 rounded-lg border border-blue-100">
              <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" />
              <span className="text-lg text-blue-700 font-medium">Loading inventory data...</span>
            </div>
          </div>
        )}

        {/* Available Products */}
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
                {filteredProducts.map((item) => {
                      const productDetails = findProductDetails(item.product);
                            return (
                          <tr key={item.id} className="text-sm hover:bg-blue-50 transition-colors duration-150">
                            <td className="px-4 py-3 font-medium text-gray-900">{item.id}</td>
                            <td className="px-4 py-3 text-gray-700">{item.serial_number || "N/A"}</td>
                            <td className="px-4 py-3 text-gray-700">{productDetails.brand || "N/A"}</td>
                            <td className="px-4 py-3 text-gray-700">{productDetails.model || "N/A"}</td>
                            <td className="px-4 py-3 text-gray-700">{item.location || "N/A"}</td>
                            <td className="px-4 py-3 text-gray-700 font-medium">₱{item.selling_price || 0}</td>
                            <td className="px-4 py-3 text-center">
                              <button
                                onClick={() => openInventoryModal(item)}
                                className="px-3 py-1.5 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 text-sm"
                              >
                                <Eye className="h-4 w-4 mr-1.5" />
                                View Details
                              </button>
                            </td>
                          </tr>
                        );
                      })}
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
        
        {/* Damaged Products */}
      {!isLoading && activeTab === "damaged" && (
  <div className="bg-white shadow-lg rounded-lg flex flex-col h-[calc(100vh-220px)] overflow-hidden border border-gray-200">
    <div className="flex-grow overflow-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="sticky top-0 z-20 bg-gradient-to-r from-red-50 to-red-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider shadow-sm">
          <tr>
            <th className="px-4 py-3 border-b">Inventory ID</th>
            <th className="px-4 py-3 border-b">Damage Type</th>
            <th className="px-4 py-3 border-b">Quantity Damaged</th>
            <th className="px-4 py-3 border-b">Date Reported</th>
            <th className="px-4 py-3 border-b text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {damagedProducts.map((damage) => (
            <tr key={damage.id} className="text-sm hover:bg-red-50 transition-colors duration-150">
              <td className="px-4 py-3 text-gray-700">{damage.inventory_item}</td>
              <td className="px-4 py-3 text-gray-700">{damage.damage_type}</td>
              <td className="px-4 py-3 text-gray-700">{damage.quantity_damaged}</td>
              <td className="px-4 py-3 text-gray-700">
                {new Date(damage.date_reported).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 text-center">
                <button
                  onClick={() => openInventoryModal(damage)}
                  className="px-3 py-1.5 rounded-md bg-red-600 text-white hover:bg-red-700 text-sm"
                >
                  <Eye className="h-4 w-4 mr-1.5" />
                  View Details
                </button>
              </td>
            </tr>
          ))}
          {damagedProducts.length === 0 && (
            <tr>
              <td colSpan="5" className="px-4 py-8 text-center text-gray-500 bg-gray-50">
                <AlertOctagon className="mx-auto h-12 w-12 text-red-400" />
                <p className="mt-2 text-sm font-medium">No damaged products found.</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
)}


        {/* Modal */}
        {isInventoryModalOpen && selectedItem && (
          <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-xl w-[95%] max-w-2xl shadow-2xl overflow-hidden animate-fadeIn">
              <div className="bg-indigo-600 p-4 text-white flex justify-between items-center">
                <h2 className="text-xl font-semibold flex items-center">
                  <FileText className="h-6 w-6 mr-2" />
                  Product Details
                </h2>
                <button onClick={closeInventoryModal} className="text-white hover:text-gray-200">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="p-6">
                {/* Description, purchase price, etc. */}
                <div className="space-y-5">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm">
                      <div className="text-xs font-medium uppercase text-gray-500 mb-1">Product Description</div>
                      <div className="font-semibold text-gray-800">{selectedItem.description || "No description available"}</div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm">
                      <div className="text-xs font-medium uppercase text-gray-500 mb-1">Purchase Price</div>
                      <div className="font-semibold text-gray-800">{selectedItem.purchase_price || "N/A"}</div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm">
                      <div className="text-xs font-medium uppercase text-gray-500 mb-1">Date Received</div>
                      <div className="font-semibold text-gray-800">{selectedItem.date_received || "N/A"}</div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm">
                      <div className="text-xs font-medium uppercase text-gray-500 mb-1">Warranty Start</div>
                      <div className="font-semibold text-gray-800">{selectedItem.date_received || "N/A"}</div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm">
                      <div className="text-xs font-medium uppercase text-gray-500 mb-1">Warranty End</div>
                      <div className="font-semibold text-gray-800">
                        {selectedItem.date_received ? (() => {
                          const startDate = new Date(selectedItem.date_received);
                          const endDate = new Date(startDate);
                          endDate.setMonth(startDate.getMonth() + (parseInt(selectedItem.warranty_duration) || 12));
                          return endDate.toISOString().split('T')[0];
                        })() : "N/A"}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 mt-8 pt-4 border-t border-gray-200">
                    <button
                      onClick={closeInventoryModal}
                      className="px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200"
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
