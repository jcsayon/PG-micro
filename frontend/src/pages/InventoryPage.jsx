import React, { useState } from "react";

const InventoryPage = () => {
  // Sample inventory data
  const [inventory, setInventory] = useState([
    { id: 1, name: "Laptop", quantity: 10, price: "$800" },
    { id: 2, name: "Mouse", quantity: 50, price: "$20" },
    { id: 3, name: "Keyboard", quantity: 30, price: "$30" },
    { id: 4, name: "Monitor", quantity: 15, price: "$150" },
  ]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-purple-600 mb-4">Inventory</h1>

      {/* Search Bar */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search items..."
          className="w-1/3 p-2 border border-gray-300 rounded focus:ring-purple-500 focus:border-purple-500"
        />
        <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
          Add Item
        </button>
      </div>

      {/* Inventory Table */}
      <table className="min-w-full bg-white border border-gray-200 rounded">
        <thead>
          <tr className="bg-purple-100 text-left text-sm font-medium text-gray-700">
            <th className="p-3 border">ID</th>
            <th className="p-3 border">Name</th>
            <th className="p-3 border">Quantity</th>
            <th className="p-3 border">Price</th>
            <th className="p-3 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item) => (
            <tr key={item.id} className="text-sm text-gray-700 border-t">
              <td className="p-3 border">{item.id}</td>
              <td className="p-3 border">{item.name}</td>
              <td className="p-3 border">{item.quantity}</td>
              <td className="p-3 border">{item.price}</td>
              <td className="p-3 border">
                <button className="text-blue-500 hover:underline mr-2">
                  Edit
                </button>
                <button className="text-red-500 hover:underline">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryPage;
