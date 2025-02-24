// frontend/src/components/PurchaseOrder_Order.jsx
import React, { useState } from "react";
import Sidebar_Secondary from "../components/Sidebar_Secondary";
import { useNavigate } from "react-router-dom";

const PurchaseOrder_Order = () => {
  const navigate = useNavigate(); // Define navigate function

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Sample product data
  const products = [
    { id: "TradeCode 99", description: "", brand: "MSI", stock: 12, price: "55,000", quantity: 100 },
    { id: "TradeCode 98", description: "Quam aliquam odio ullamcorper ornare eleifend ipsum", brand: "Samsung", stock: 124, price: "100,000", quantity: 98 },
    { id: "TradeCode 97", description: "Mauris quam tristique et parturient sapien.", brand: "HyperX", stock: 66, price: "98,889", quantity: 128 },
    { id: "TradeCode 96", description: "Fermentum porttitor amet, vulputate ornare tortor nisi", brand: "Acer", stock: 87, price: "123,123", quantity: 17 },
    { id: "TradeCode 95", description: "Sed at ornare scelerisque in facilisis tincidunt", brand: "Apple", stock: 77, price: "456,456", quantity: 199 },
    { id: "TradeCode 94", description: "Molestie est pharetra eu congue velit felis ipsum velit.", brand: "Epson", stock: 65, price: "647,770", quantity: 27 },
    { id: "TradeCode 93", description: "Et adipiscing vitae amet mauris eget vel.", brand: "Canon", stock: 554, price: "88,760", quantity: 88 },
    { id: "TradeCode 92", description: "Leo maecenas quis sapien morbi nunc, porta nibh.", brand: "AOC", stock: 109, price: "40,089", quantity: 56 },
  ];

  // Handle product selection
  const toggleSelection = (id) => {
    if (selectedProducts.includes(id)) {
      setSelectedProducts(selectedProducts.filter((productId) => productId !== id));
    } else {
      setSelectedProducts([...selectedProducts, id]);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar_Secondary />

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-6">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">New Purchase Order</h1>
          <button
            onClick={() => navigate("/review-order")}
            className="bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-700 flex items-center"
          >
            Next: Review Order →
          </button>
        </div>

        {/* Supplier Name & Payment Terms */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <select className="p-2 border border-gray-300 rounded">
            <option>Supplier Name</option>
            <option>Supplier A</option>
            <option>Supplier B</option>
          </select>
          <input
            type="text"
            placeholder="Payment terms"
            className="p-2 border border-gray-300 rounded"
          />
        </div>

        {/* Products Table Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Product</h2>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="p-2 border border-gray-300 rounded"
            />
            <button className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-700">
              + Add Products
            </button>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b bg-gray-200">
                <th className="p-3 text-left">
                  <input type="checkbox" />
                </th>
                <th className="p-3 text-left">Product ID</th>
                <th className="p-3 text-left">Description</th>
                <th className="p-3 text-left">Brand</th>
                <th className="p-3 text-left">Stock</th>
                <th className="p-3 text-left">Price</th>
                <th className="p-3 text-left">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr
                  key={index}
                  className={`border-t hover:bg-gray-100 ${
                    selectedProducts.includes(product.id) ? "bg-purple-200" : ""
                  }`}
                >
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => toggleSelection(product.id)}
                    />
                  </td>
                  <td className="p-3 text-purple-500 hover:underline cursor-pointer">{product.id}</td>
                  <td className="p-3">{product.description}</td>
                  <td className="p-3">{product.brand}</td>
                  <td className="p-3">{product.stock}</td>
                  <td className="p-3">{product.price}</td>
                  <td className="p-3">{product.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <p className="text-gray-600">1-8 of 50 items</p>
          <div className="flex space-x-2">
            <button className="border border-gray-300 px-3 py-1 rounded hover:bg-gray-200">&lt;</button>
            <button className="border border-gray-300 px-3 py-1 rounded bg-purple-500 text-white">1</button>
            <button className="border border-gray-300 px-3 py-1 rounded hover:bg-gray-200">2</button>
            <button className="border border-gray-300 px-3 py-1 rounded hover:bg-gray-200">3</button>
            <button className="border border-gray-300 px-3 py-1 rounded hover:bg-gray-200">4</button>
            <button className="border border-gray-300 px-3 py-1 rounded hover:bg-gray-200">5</button>
            <button className="border border-gray-300 px-3 py-1 rounded hover:bg-gray-200">&gt;</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PurchaseOrder_Order;
