import React, { useState } from "react";
import Sidebar_Primary from "../components/Sidebar_Primary";

const InventoryPage = () => {
  // Sample inventory data
  const [inventory, setInventory] = useState([
    { id: 1, name: "Laptop", category: "Electronics", quantityReceived: 20, quantityRemaining: 15, status: "In Stock", purchasePrice: "₱700.00", sellingPrice: "₱800.00", dateReceived: "2024-02-20", location: "Warehouse A" },
    { id: 2, name: "Mouse", category: "Accessories", quantityReceived: 50, quantityRemaining: 30, status: "In Stock", purchasePrice: "₱15.00", sellingPrice: "₱25.00", dateReceived: "2024-02-18", location: "Warehouse B" }
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newProduct, setNewProduct] = useState({
    id: "",
    name: "",
    category: "",
    quantityReceived: "",
    quantityRemaining: "",
    status: "In Stock",
    purchasePrice: "",
    sellingPrice: "",
    dateReceived: "",
    location: ""
  });

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleAddProduct = () => {
    setInventory([...inventory, { ...newProduct, id: inventory.length + 1 }]);
    setNewProduct({
      id: "",
      name: "",
      category: "",
      quantityReceived: "",
      quantityRemaining: "",
      status: "In Stock",
      purchasePrice: "",
      sellingPrice: "",
      dateReceived: "",
      location: ""
    });
  };

  const handleEditProduct = (id) => {
    const product = inventory.find((item) => item.id === id);
    setNewProduct(product);
  };

  const handleDeleteProduct = (id) => {
    setInventory(inventory.filter((item) => item.id !== id));
  };

  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar_Primary />

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto ml-64">
        <h1 className="text-2xl font-bold text-purple-600 mb-4">Inventory Management</h1>

        {/* Search Bar and Button */}
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Search items..."
            className="w-1/3 p-2 border border-gray-300 rounded focus:ring-purple-500 focus:border-purple-500"
            value={searchQuery}
            onChange={handleSearch}
          />
          <button
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            onClick={handleAddProduct}
          >
            + Add Product
          </button>
        </div>

        {/* Inventory Table */}
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full border border-gray-200 rounded">
            <thead>
              <tr className="bg-purple-100 text-left text-sm font-medium text-gray-700">
                <th className="p-3 border">Description</th>
                <th className="p-3 border">Category</th>
                <th className="p-3 border">Quantity Received</th>
                <th className="p-3 border">Quantity Remaining</th>
                <th className="p-3 border">Stock Status</th>
                <th className="p-3 border">Purchase Price</th>
                <th className="p-3 border">Selling Price</th>
                <th className="p-3 border">Date Received</th>
                <th className="p-3 border">Location</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map((item) => (
                <tr key={item.id} className="text-sm text-gray-700 border-t">
                  <td className="p-3 border">{item.name}</td>
                  <td className="p-3 border">{item.category}</td>
                  <td className="p-3 border">{item.quantityReceived}</td>
                  <td className="p-3 border">{item.quantityRemaining}</td>
                  <td className="p-3 border">
                    <span className={`px-2 py-1 rounded text-white ${item.status === "In Stock" ? "bg-green-500" : "bg-red-500"}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-3 border">{item.purchasePrice}</td>
                  <td className="p-3 border">{item.sellingPrice}</td>
                  <td className="p-3 border">{item.dateReceived}</td>
                  <td className="p-3 border">{item.location}</td>
                  <td className="p-3 border">
                    <button
                      className="text-blue-500 hover:underline mr-2"
                      onClick={() => handleEditProduct(item.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-500 hover:underline"
                      onClick={() => handleDeleteProduct(item.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add/Edit Product Form */}
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">{newProduct.id ? "Edit Product" : "Add Product"}</h2>
          <form>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Name"
                className="p-2 border border-gray-300 rounded"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              />
              <input
                type="text"
                placeholder="Category"
                className="p-2 border border-gray-300 rounded"
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
              />
              <input
                type="number"
                placeholder="Quantity Received"
                className="p-2 border border-gray-300 rounded"
                value={newProduct.quantityReceived}
                onChange={(e) => setNewProduct({ ...newProduct, quantityReceived: e.target.value })}
              />
              <input
                type="number"
                placeholder="Quantity Remaining"
                className="p-2 border border-gray-300 rounded"
                value={newProduct.quantityRemaining}
                onChange={(e) => setNewProduct({ ...newProduct, quantityRemaining: e.target.value })}
              />
              <select
                className="p-2 border border-gray-300 rounded"
                value={newProduct.status}
                onChange={(e) => setNewProduct({ ...newProduct, status: e.target.value })}
              >
                <option value="In Stock">In Stock</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
              <input
                type="text"
                placeholder="Purchase Price"
                className="p-2 border border-gray-300 rounded"
                value={newProduct.purchasePrice}
                onChange={(e) => setNewProduct({ ...newProduct, purchasePrice: e.target.value })}
              />
              <input
                type="text"
                placeholder="Selling Price"
                className="p-2 border border-gray-300 rounded"
                value={newProduct.sellingPrice}
                onChange={(e) => setNewProduct({ ...newProduct, sellingPrice: e.target.value })}
              />
              <input
                type="date"
                placeholder="Date Received"
                className="p-2 border border-gray-300 rounded"
                value={newProduct.dateReceived}
                onChange={(e) => setNewProduct({ ...newProduct, dateReceived: e.target.value })}
              />
              <input
                type="text"
                placeholder="Location"
                className="p-2 border border-gray-300 rounded"
                value={newProduct.location}
                onChange={(e) => setNewProduct({ ...newProduct, location: e.target.value })}
              />
            </div>
            <button
              type="button"
              className="mt-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              onClick={handleAddProduct}
            >
              {newProduct.id ? "Update Product" : "Add Product"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;
