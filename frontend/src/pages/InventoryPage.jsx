import React, { useState, useEffect } from "react";
import Sidebar_Primary from "../components/Sidebar_Primary";

// Category–Brand mapping (updated "database")
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

// Create an array for dropdown options (with "All" as default)
const allCategories = ["All", ...Object.keys(categoryBrandMap)];

/* 
// Beginner-friendly Supabase fetch snippet (for future use)
// import { createClient } from '@supabase/supabase-js';
// const supabaseUrl = 'YOUR_SUPABASE_URL';
// const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';
// const supabase = createClient(supabaseUrl, supabaseAnonKey);
// useEffect(() => {
//   async function fetchInventoryData() {
//     const { data, error } = await supabase.from('Inventory').select('*');
//     if (error) console.error('Error fetching inventory:', error);
//     else setInventory(data);
//   }
//   fetchInventoryData();
// }, []);
*/

const InventoryPage = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [inventory, setInventory] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Search and category filter for inventory
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // For enabling edit mode in the View modal
  const [isViewEditable, setIsViewEditable] = useState(false);

  // Damaged products data & search
  const [damagedProducts, setDamagedProducts] = useState([]);
  const [damagedSearchQuery, setDamagedSearchQuery] = useState("");
  const [selectedDamagedCategory, setSelectedDamagedCategory] = useState("All");
  const [isDamagedModalOpen, setIsDamagedModalOpen] = useState(false);

  useEffect(() => {
    generateDummyData();
    generateDummyDamagedProducts();
    localStorage.setItem("sidebarCollapsed", isSidebarCollapsed);
  }, [isSidebarCollapsed]);

  // Generate dummy inventory data
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

  // Open/close modals
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

  // Handle input/checkbox changes in modals
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedItem({ ...selectedItem, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setSelectedItem({
      ...selectedItem,
      [name]: checked ? "New Item" : "Old Item",
    });
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

  // Filter logic for inventory
  const filteredInventory = inventory.filter((item) => {
    if (selectedCategory !== "All" && item.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim() === "") return true;
    const lowerQuery = searchQuery.toLowerCase();
    return (
      String(item.id).toLowerCase().includes(lowerQuery) ||
      item.category.toLowerCase().includes(lowerQuery) ||
      item.brand.toLowerCase().includes(lowerQuery) ||
      item.serialNumber.toLowerCase().includes(lowerQuery) ||
      String(item.quantityReceived).toLowerCase().includes(lowerQuery) ||
      String(item.quantityAvailable).toLowerCase().includes(lowerQuery) ||
      item.stockStatus.toLowerCase().includes(lowerQuery) ||
      item.sellingPrice.toLowerCase().includes(lowerQuery)
    );
  });

  // Filter logic for damaged products
  const filteredDamagedProducts = damagedProducts.filter((dp) => {
    if (
      selectedDamagedCategory !== "All" &&
      dp.category !== selectedDamagedCategory
    ) {
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

  // Damaged Products modal
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
      <div
        className={`flex-1 p-6 transition-all duration-300 ${
          isSidebarCollapsed ? "ml-16" : "ml-64"
        }`}
      >
        <h1 className="text-3xl font-bold text-purple-700 mb-6">
          Inventory Management
        </h1>

        {/* Inventory Card */}
        <div className="bg-white shadow-lg rounded-lg p-4 border border-gray-300">
          <h2 className="text-xl font-semibold text-blue-700 mb-4">
            Available Inventory
          </h2>

          {/* Search Bar, Category Dropdown & Damaged Products Button */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex space-x-2 items-center">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {allCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
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
                style={{
                  background: "linear-gradient(to right, #3b82f6, #93c5fd)",
                }}
              >
                <tr>
                  <th className="p-3 border border-gray-300">Item ID</th>
                  <th className="p-3 border border-gray-300">Brand</th>
                  <th className="p-3 border border-gray-300">Model</th>
                  <th className="p-3 border border-gray-300">Serial Number</th>
                  <th className="p-3 border border-gray-300">Location</th>
                  <th className="p-3 border border-gray-300">Selling Price</th>
                  <th className="p-3 border border-gray-300 text-center">
                    Actions
                  </th>
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
                    <td className="p-3 border border-gray-200">
                      {item.serialNumber}
                    </td>
                    <td className="p-3 border border-gray-200">
                      {item.location}
                    </td>
                    <td className="p-3 border border-gray-200">
                      {item.sellingPrice}
                    </td>
                    <td className="p-3 border border-gray-200 flex space-x-2 justify-center">
                      <button
                        onClick={() => openDetailsModal(item)}
                        className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        View
                      </button>
                      <button
                        onClick={() => openEditModal(item)}
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

        {/* ------------------------ Edit Modal ------------------------ */}
        {isEditModalOpen && selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent">
            <div className="relative bg-white/70 backdrop-blur-md p-6 rounded-xl shadow-2xl w-1/3 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Edit Inventory Item
              </h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Item ID
                  </label>
                  <input
                    type="text"
                    name="id"
                    value={selectedItem.id}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={selectedItem.category}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Brand
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={selectedItem.brand}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Serial Number
                  </label>
                  <input
                    type="text"
                    name="serialNumber"
                    value={selectedItem.serialNumber}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Quantity Received
                  </label>
                  <input
                    type="number"
                    name="quantityReceived"
                    value={selectedItem.quantityReceived}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Quantity Available
                  </label>
                  <input
                    type="number"
                    name="quantityAvailable"
                    value={selectedItem.quantityAvailable}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Stock Status
                  </label>
                  <select
                    name="stockStatus"
                    value={selectedItem.stockStatus}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Limited Stock">Limited Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Selling Price
                  </label>
                  <input
                    type="text"
                    name="sellingPrice"
                    value={selectedItem.sellingPrice}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
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

        {/* --------------------- View (Details) Modal --------------------- */}
        {isDetailsModalOpen && selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent">
            <div className="relative bg-white/70 backdrop-blur-md p-6 rounded-xl shadow-2xl w-1/3 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Product Details
              </h2>
              <form className="space-y-4">
                {/* Remove Location; replace Model with Date Received */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Product Description
                  </label>
                  <textarea
                    name="productDescription"
                    value={selectedItem.productDescription}
                    onChange={handleInputChange}
                    readOnly={!isViewEditable}
                    className={`mt-1 block w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      !isViewEditable ? "bg-gray-100" : ""
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Purchase Price
                  </label>
                  <input
                    type="text"
                    name="purchasePrice"
                    value={selectedItem.purchasePrice}
                    onChange={handleInputChange}
                    readOnly={!isViewEditable}
                    className={`mt-1 block w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      !isViewEditable ? "bg-gray-100" : ""
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Warranty Duration
                  </label>
                  <input
                    type="text"
                    name="warrantyDuration"
                    value={selectedItem.warrantyDuration}
                    onChange={handleInputChange}
                    readOnly={!isViewEditable}
                    className={`mt-1 block w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      !isViewEditable ? "bg-gray-100" : ""
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Date Received
                  </label>
                  <input
                    type="text"
                    name="dateReceived"
                    value={selectedItem.dateReceived}
                    readOnly
                    className="mt-1 block w-full p-2 rounded-md border border-gray-300 bg-gray-100 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    New Item
                  </label>
                  <input
                    type="checkbox"
                    name="isNew"
                    checked={selectedItem.isNew === "New Item"}
                    onChange={handleCheckboxChange}
                    disabled={!isViewEditable}
                    className="mt-1 ml-2"
                  />
                </div>
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

        {/* ------------------ Damaged Products Modal ------------------ */}
        {isDamagedModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent">
            <div className="relative bg-white shadow-lg rounded-xl border border-gray-300 p-6 w-2/3 h-[70vh] flex flex-col">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Damaged Products
              </h2>
              {/* Damaged Products Dropdown & Search Bar */}
              <div className="flex space-x-2 mb-4">
                <select
                  value={selectedDamagedCategory}
                  onChange={(e) => setSelectedDamagedCategory(e.target.value)}
                  className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {allCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <div className="relative w-64">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-400">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 3a7.5 7.5 0 006.15 11.65z"
                      />
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
              {/* Damaged Products Table */}
              <div className="overflow-y-auto flex-1">
                <table className="min-w-full border-collapse">
                  <thead className="sticky top-0 z-50 bg-blue-200 text-left text-sm font-medium text-gray-800 shadow-md">
                    <tr>
                      <th className="p-3 border border-gray-300">
                        Damage Product ID
                      </th>
                      <th className="p-3 border border-gray-300">Category</th>
                      <th className="p-3 border border-gray-300">Brand</th>
                      <th className="p-3 border border-gray-300">
                        Serial Number
                      </th>
                      <th className="p-3 border border-gray-300">Model</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDamagedProducts.map((dp) => (
                      <tr
                        key={dp.damageId}
                        className="bg-white hover:bg-gray-100 border-b text-sm text-gray-700"
                      >
                        <td className="p-3 border border-gray-200">
                          {dp.damageId}
                        </td>
                        <td className="p-3 border border-gray-200">
                          {dp.category}
                        </td>
                        <td className="p-3 border border-gray-200">
                          {dp.brand}
                        </td>
                        <td className="p-3 border border-gray-200">
                          {dp.serialNumber}
                        </td>
                        <td className="p-3 border border-gray-200">
                          {dp.model}
                        </td>
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
