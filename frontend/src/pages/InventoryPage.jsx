import React, { useState } from "react";
import Sidebar_Primary from "../components/Sidebar_Primary";

const InventoryPage = () => {
  // Sample inventory data
  const [inventory, setInventory] = useState([
    {
      id: 1,
      name: "Laptop",
      serialNumber: "SN12345",
      category: "Electronics",
      quantityReceived: 20,
      quantityAvailable: 15,
      status: "In Stock",
    },
    {
      id: 2,
      name: "Mouse",
      serialNumber: "SN67890",
      category: "Accessories",
      quantityReceived: 50,
      quantityAvailable: 30,
      status: "Low Stock",
    },
    {
      id: 3,
      name: "Keyboard",
      serialNumber: "SN78901",
      category: "Accessories",
      quantityReceived: 35,
      quantityAvailable: 20,
      status: "In Stock",
    },
    {
      id: 4,
      name: "Monitor",
      serialNumber: "SN67891",
      category: "Electronics",
      quantityReceived: 25,
      quantityAvailable: 10,
      status: "Low Stock",
    },
    {
      id: 5,
      name: "Printer",
      serialNumber: "SN56789",
      category: "Printers",
      quantityReceived: 18,
      quantityAvailable: 8,
      status: "Low Stock",
    },
    {
      id: 6,
      name: "Scanner",
      serialNumber: "SN34567",
      category: "Office Equipment",
      quantityReceived: 12,
      quantityAvailable: 5,
      status: "Low Stock",
    },
    {
      id: 7,
      name: "Router",
      serialNumber: "SN65432",
      category: "Networking",
      quantityReceived: 20,
      quantityAvailable: 12,
      status: "In Stock",
    },
    {
      id: 8,
      name: "External Hard Drive",
      serialNumber: "SN45678",
      category: "Storage",
      quantityReceived: 15,
      quantityAvailable: 8,
      status: "Low Stock",
    },
    {
      id: 9,
      name: "Graphics Card",
      serialNumber: "SN34568",
      category: "Computer Parts",
      quantityReceived: 10,
      quantityAvailable: 5,
      status: "Low Stock",
    },
    {
      id: 10,
      name: "CCTV Camera",
      serialNumber: "SN78945",
      category: "Security",
      quantityReceived: 8,
      quantityAvailable: 6,
      status: "In Stock",
    },
    {
      id: 11,
      name: "Projector",
      serialNumber: "SN89012",
      category: "Presentation",
      quantityReceived: 5,
      quantityAvailable: 3,
      status: "Low Stock",
    },
    {
      id: 12,
      name: "Gaming Chair",
      serialNumber: "SN91234",
      category: "Accessories",
      quantityReceived: 10,
      quantityAvailable: 6,
      status: "In Stock",
    },
  ]);

  return (
    <div className="flex h-screen">
      <Sidebar_Primary />
      <div className="flex-1 p-6 overflow-auto ml-64">
        <h1 className="text-2xl font-bold text-purple-600 mb-4">
          Inventory Management
        </h1>

        {/* Scrollable Inventory Table when data exceeds 10 rows */}
        <div className="bg-white shadow-md rounded-lg border border-gray-300">
          <div
            className={`overflow-y-auto ${
              inventory.length > 10 ? "max-h-96" : ""
            }`}
          >
            <table className="min-w-full border border-gray-300 rounded">
              <thead className="sticky top-0 bg-purple-100 border-b border-gray-300">
                <tr className="text-left text-sm font-medium text-gray-700">
                  <th className="p-3 border">Description</th>
                  <th className="p-3 border">Serial Number</th>
                  <th className="p-3 border">Category</th>
                  <th className="p-3 border">Quantity Received</th>
                  <th className="p-3 border">Quantity Available</th>
                  <th className="p-3 border">Stock Status</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item) => (
                  <tr key={item.id} className="text-sm text-gray-700 border-t">
                    <td className="p-3 border">{item.name}</td>
                    <td className="p-3 border">{item.serialNumber}</td>
                    <td className="p-3 border">{item.category}</td>
                    <td className="p-3 border">{item.quantityReceived}</td>
                    <td className="p-3 border">{item.quantityAvailable}</td>
                    <td className="p-3 border">
                      <span
                        className={`px-2 py-1 rounded text-white ${
                          item.status === "In Stock"
                            ? "bg-green-500"
                            : item.status === "Low Stock"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Product Form remains fixed below the table */}
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md border border-gray-300">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Add Product</h2>
          <form>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Name"
                className="p-2 border border-gray-300 rounded"
              />
              <input
                type="text"
                placeholder="Serial Number"
                className="p-2 border border-gray-300 rounded"
              />
              <input
                type="text"
                placeholder="Category"
                className="p-2 border border-gray-300 rounded"
              />
              <input
                type="number"
                placeholder="Quantity Received"
                className="p-2 border border-gray-300 rounded"
              />
              <input
                type="number"
                placeholder="Quantity Available"
                className="p-2 border border-gray-300 rounded"
              />
              <select className="p-2 border border-gray-300 rounded">
                <option value="In Stock">In Stock</option>
                <option value="Low Stock">Low Stock</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
              <input
                type="text"
                placeholder="Purchase Price"
                className="p-2 border border-gray-300 rounded"
              />
              <input
                type="text"
                placeholder="Selling Price"
                className="p-2 border border-gray-300 rounded"
              />
              <input
                type="date"
                placeholder="Date Received"
                className="p-2 border border-gray-300 rounded"
              />
              <input
                type="text"
                placeholder="Location"
                className="p-2 border border-gray-300 rounded"
              />
            </div>
            <button className="mt-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
              Add Product
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;
