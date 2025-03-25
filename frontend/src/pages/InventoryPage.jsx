import React, { useState, useEffect } from "react";
import Sidebar_Primary from "../components/Sidebar_Primary";
import { supabase } from "../config/supabaseClient";

const InventoryPage = () => {
  // Sidebar state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // Data states
  const [inventory, setInventory] = useState([]);
  const [categoryBrandMap, setCategoryBrandMap] = useState({}); // e.g., { "Processor": ["INTEL", "AMD"], ... }
  const [damagedProducts, setDamagedProducts] = useState([]);
  
  // Search/filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  // Damaged products search/filter
  const [damagedSearchQuery, setDamagedSearchQuery] = useState("");
  const [selectedDamagedCategory, setSelectedDamagedCategory] = useState("All");
  
  // Modal state for editing, viewing, etc.
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isViewEditable, setIsViewEditable] = useState(false);
  const [isDamagedModalOpen, setIsDamagedModalOpen] = useState(false);

  // Compute dropdown options for categories from the fetched mapping
  const allCategories = ["All", ...Object.keys(categoryBrandMap)];

  // Fetch category-brand mapping from Supabase
  const fetchCategoryBrandMap = async () => {
    try {
      // Assumes you have a foreign key relationship between categories and brands
      const { data, error } = await supabase
        .from("categories")
        .select("name, brands(name)");
      if (error) {
        throw error;
      }
      // Convert the data into a mapping object: { categoryName: [brand1, brand2, ...] }
      const mapping = {};
      data.forEach((cat) => {
        // Ensure cat.brands exists and is an array
        mapping[cat.name] = cat.brands ? cat.brands.map((brand) => brand.name) : [];
      });
      setCategoryBrandMap(mapping);
      console.log("Fetched category-brand mapping:", mapping);
    } catch (error) {
      console.error("Error fetching category-brand mapping:", error);
    }
  };

  // Fetch inventory data from Supabase
  const fetchInventoryData = async () => {
    try {
      const { data, error } = await supabase.from("inventory").select("*");
      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
      console.log("Fetched Inventory Data:", data);
      setInventory(data);
    } catch (error) {
      console.error("Error fetching inventory data:", error);
    }
  };

  // Fetch damaged products data from Supabase
  const fetchDamagedProductsData = async () => {
    try {
      const { data, error } = await supabase
        .from("damaged_products")
        .select("*");
      if (error) {
        throw error;
      }
      setDamagedProducts(data);
      console.log("Fetched Damaged Products Data:", data);
    } catch (error) {
      console.error("Error fetching damaged products data:", error);
    }
  };

  // useEffect to fetch category mapping once on mount
  useEffect(() => {
    fetchCategoryBrandMap();
  }, []);

  // useEffect to fetch inventory and damaged products when the component mounts or sidebar state changes
  useEffect(() => {
    fetchInventoryData();
    fetchDamagedProductsData();
    localStorage.setItem("sidebarCollapsed", isSidebarCollapsed);
  }, [isSidebarCollapsed]);

  // Debug: Log inventory when updated
  useEffect(() => {
    if (inventory.length > 0) {
      console.log("Inventory data table shown:", inventory);
    }
  }, [inventory]);

  // Modal and action functions
  const openEditModal = (item) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  const openDetailsModal = (item) => {
    setSelectedItem(item);
    setIsDetailsModalOpen(true);
    setIsViewEditable(false);
  };

  const closeModal = () => {
    setIsEditModalOpen(false);
    setIsDetailsModalOpen(false);
    setIsViewEditable(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedItem({ ...selectedItem, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setSelectedItem({ ...selectedItem, [name]: checked ? "New Item" : "Old Item" });
  };

  const saveChanges = () => {
    const updatedInventory = inventory.map((item) =>
      item.id === selectedItem.id ? selectedItem : item
    );
    setInventory(updatedInventory);
    closeModal();
  };

  const deleteItem = (id) => {
    const updatedInventory = inventory.filter((item) => item.id !== id);
    setInventory(updatedInventory);
  };

  // Filtering logic for inventory
  const filteredInventory = inventory.filter((item) => {
    // If there's a selected category and the item doesn't have it, return false.
    // (If your table doesn't have a category column, you might remove this check.)
    if (selectedCategory !== "All" && item.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim() === "") return true;
    const lowerQuery = searchQuery.toLowerCase();
    return (
      String(item.id).toLowerCase().includes(lowerQuery) ||
      // Adjusted key names:
      item.brand.toLowerCase().includes(lowerQuery) ||
      item.model.toLowerCase().includes(lowerQuery) ||
      item.serial_number.toLowerCase().includes(lowerQuery) ||
      String(item.quantity_recieved).toLowerCase().includes(lowerQuery) ||
      String(item.quantity_available).toLowerCase().includes(lowerQuery) ||
      item.stock_status.toLowerCase().includes(lowerQuery) ||
      String(item.selling_price).toLowerCase().includes(lowerQuery)
    );
  });

  // Filtering logic for damaged products
  const filteredDamagedProducts = damagedProducts.filter((dp) => {
    if (selectedDamagedCategory !== "All" && dp.category !== selectedDamagedCategory) {
      return false;
    }
    if (damagedSearchQuery.trim() === "") return true;
    const lowerQuery = damagedSearchQuery.toLowerCase();
    return (
      String(dp.damageId).toLowerCase().includes(lowerQuery) ||
      dp.category.toLowerCase().includes(lowerQuery) ||
      dp.brand.toLowerCase().includes(lowerQuery) ||
      dp.serialNumber.toLowerCase().includes(lowerQuery) ||
      dp.model.toLowerCase().includes(lowerQuery)
    );
  });

  // Damaged Products modal functions
  const openDamagedModal = () => {
    setIsDamagedModalOpen(true);
  };

  const closeDamagedModal = () => {
    setIsDamagedModalOpen(false);
  };

  return (
    <div className="flex h-screen overflow-auto">
      <Sidebar_Primary
        isCollapsed={isSidebarCollapsed}
        toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <div className={`flex-1 p-6 transition-all duration-300 ${isSidebarCollapsed ? "ml-16" : "ml-64"}`}>
        <h1 className="text-3xl font-bold text-purple-700 mb-6">Inventory Management</h1>

        {/* Inventory Card */}
        <div className="bg-white shadow-lg rounded-lg p-4 border border-gray-300">
          <h2 className="text-xl font-semibold text-blue-700 mb-4">Available Inventory</h2>

          {/* Search Bar, Category Dropdown & Damaged Products Button */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex space-x-2 items-center">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {allCategories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Search Inventory..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="p-2 border border-gray-300 rounded-md w-64"
              />
            </div>
            <button
              onClick={openDamagedModal}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Damaged Products
            </button>
          </div>

          {/* Inventory Table */}
          <div className="overflow-y-auto max-h-[60vh]">
            <table className="min-w-full border-collapse">
              <thead
                className="sticky top-0 z-50 text-sm font-medium text-white shadow-md"
                style={{ background: "linear-gradient(to right, #3b82f6, #93c5fd)" }}
              >
                <tr>
                  <th className="p-3 border border-gray-300">Item ID</th>
                  <th className="p-3 border border-gray-300">Brand</th>
                  <th className="p-3 border border-gray-300">Model</th>
                  <th className="p-3 border border-gray-300">Serial Number</th>
                  <th className="p-3 border border-gray-300">Location</th>
                  <th className="p-3 border border-gray-300">Selling Price</th>
                  <th className="p-3 border border-gray-300 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map((item) => (
                  <tr
                    key={item.id}
                    className="bg-white hover:bg-gray-100 border-b text-sm text-gray-700"
                  >
                    <td className="p-3 border border-gray-200">{item.id}</td>
                    <td className="p-3 border border-gray-200">{item.brand}</td>
                    <td className="p-3 border border-gray-200">{item.model}</td>
                    <td className="p-3 border border-gray-200">{item.serial_number}</td>
                    <td className="p-3 border border-gray-200">{item.location}</td>
                    <td className="p-3 border border-gray-200">{item.selling_price}</td>
                    <td className="p-3 border border-gray-200 flex space-x-2 justify-center">
                      <button
                        onClick={() => {
                          setSelectedItem(item);
                          setIsDetailsModalOpen(true);
                          setIsViewEditable(false);
                        }}
                        className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        View
                      </button>
                      <button
                        onClick={() => {
                          setSelectedItem(item);
                          setIsEditModalOpen(true);
                        }}
                        className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-700 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit Modal */}
        {isEditModalOpen && selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent">
            <div className="relative bg-white/70 backdrop-blur-md p-6 rounded-xl shadow-2xl w-1/3 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Inventory Item</h2>
              <form className="space-y-4">
                {/* Add your edit form fields here */}
                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-red-300 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={saveChanges}
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-300 transition-colors"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Details Modal */}
        {isDetailsModalOpen && selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent">
            <div className="relative bg-white/70 backdrop-blur-md p-6 rounded-xl shadow-2xl w-1/3 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Details</h2>
              <form className="space-y-4">
                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-red-300 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsViewEditable(!isViewEditable)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-colors"
                  >
                    {isViewEditable ? "Disable Edit" : "Enable Edit"}
                  </button>
                  <button
                    type="button"
                    onClick={saveChanges}
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-300 transition-colors"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Damaged Products Modal */}
        {isDamagedModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent">
            <div className="relative bg-white shadow-lg rounded-xl border border-gray-300 p-6 w-2/3 h-[70vh] flex flex-col">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Damaged Products</h2>
              <div className="flex space-x-2 mb-4">
                <select
                  value={selectedDamagedCategory}
                  onChange={(e) => setSelectedDamagedCategory(e.target.value)}
                  className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {allCategories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <div className="relative w-64">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-400">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 3a7.5 7.5 0 006.15 11.65z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    placeholder="Search Damaged Products..."
                    value={damagedSearchQuery}
                    onChange={(e) => setDamagedSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                  />
                </div>
              </div>
              <div className="overflow-y-auto flex-1">
                <table className="min-w-full border-collapse">
                  <thead className="sticky top-0 z-50 bg-blue-200 text-left text-sm font-medium text-gray-800 shadow-md">
                    <tr>
                      <th className="p-3 border border-gray-300">Damage Product ID</th>
                      <th className="p-3 border border-gray-300">Category</th>
                      <th className="p-3 border border-gray-300">Brand</th>
                      <th className="p-3 border border-gray-300">Serial Number</th>
                      <th className="p-3 border border-gray-300">Model</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDamagedProducts.map((dp) => (
                      <tr key={dp.damageId} className="bg-white hover:bg-gray-100 border-b text-sm text-gray-700">
                        <td className="p-3 border border-gray-200">{dp.damageId}</td>
                        <td className="p-3 border border-gray-200">{dp.category}</td>
                        <td className="p-3 border border-gray-200">{dp.brand}</td>
                        <td className="p-3 border border-gray-200">{dp.serial_number}</td>
                        <td className="p-3 border border-gray-200">{dp.model}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={closeDamagedModal}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryPage;
