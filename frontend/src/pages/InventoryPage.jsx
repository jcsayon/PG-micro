import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar_Primary from "../components/Sidebar_Primary";

const InventoryPage = () => {
  const navigate = useNavigate();
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    generateDummyData();
  }, []);

  const generateDummyData = () => {
    const dummyData = Array.from({ length: 60 }, (_, i) => ({
      id: i + 1,
      serialNumber: `SN${10000 + i}`,
      category: ["Laptop", "Mouse", "Router", "Switch", "RAM"][i % 5],
      quantityReceived: Math.floor(Math.random() * 100) + 1,
      quantityAvailable: Math.floor(Math.random() * 50) + 1,
      stockStatus: ["In Stock", "Limited Stock", "Out of Stock"][i % 3],
      location: `Warehouse ${String.fromCharCode(65 + (i % 5))}`,
      Brand: `Brand ${i % 5}`,
      sellingPrice: `₱${(Math.random() * 1000).toFixed(2)}`,
    }));
    setInventory(dummyData);
  };

  return (
    <div className="flex h-screen">
      <Sidebar_Primary />
      <div className="flex-1 p-6 overflow-auto ml-64">
        <h1 className="text-2xl font-bold text-purple-600 mb-4">
          Inventory Management
        </h1>
        <div className="overflow-y-auto max-h-[600px] bg-white shadow-md rounded-lg">
          <table className="min-w-full border border-gray-200 rounded">
            <thead className="sticky top-0 bg-purple-100 text-left text-sm font-medium text-gray-700">
              <tr>
                <th className="p-3 border">Item ID</th>
                <th className="p-3 border">Serial Number</th>
                <th className="p-3 border">Category</th>
                <th className="p-3 border">Quantity</th>
                <th className="p-3 border">Available</th>
                <th className="p-3 border">Stock Status</th>
                <th className="p-3 border">Location</th>
                <th className="p-3 border">Selling Price</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => (
                <tr key={item.id} className="text-sm text-gray-700 border-t">
                  <td className="p-3 border">{item.id}</td>
                  <td className="p-3 border">{item.serialNumber}</td>
                  <td className="p-3 border">{item.category}</td>
                  <td className="p-3 border">{item.quantityReceived}</td>
                  <td className="p-3 border">{item.quantityAvailable}</td>
                  <td className="p-3 border">{item.stockStatus}</td>
                  <td className="p-3 border">{item.location}</td>
                  <td className="p-3 border">{item.sellingPrice}</td>
                  <td className="p-3 border">
                    <button
                      onClick={() => navigate(`/inventory/${item.id}`)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-700"
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
    </div>
  );
};

export default InventoryPage;
