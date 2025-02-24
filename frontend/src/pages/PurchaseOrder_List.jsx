// frontend/src/pages/PurchaseOrder_List.jsx
import React, { useState } from "react";
import Sidebar_Secondary from "../components/Sidebar_Secondary";
import { useNavigate } from "react-router-dom";

const PurchaseOrder_List = () => {
  const navigate = useNavigate(); // Define navigate function
  const [searchQuery, setSearchQuery] = useState("");

  // Sample purchase order data
  const purchaseOrders = [
    { id: "#1234", date: "2023-01-01", supplier: "Hardware World", status: "Order Placed", total: "₱199,100.00", statusColor: "bg-purple-300" },
    { id: "#5678", date: "2023-01-02", supplier: "CD-R King", status: "Shipped", total: "₱50,050.00", statusColor: "bg-gray-400" },
    { id: "#9101", date: "2023-01-03", supplier: "MGM Marketing Inc.", status: "Delivered", total: "₱12,075.00", statusColor: "bg-green-400" },
    { id: "#2345", date: "2023-01-04", supplier: "Sara Davis", status: "Delivered", total: "₱100,125.00", statusColor: "bg-green-400" },
    { id: "#6789", date: "2023-01-05", supplier: "Mike Tyson Inc.", status: "In Progress", total: "₱55,625.00", statusColor: "bg-purple-300" },
    { id: "#1011", date: "2023-01-06", supplier: "Golden Computers", status: "Preparing Order", total: "₱90,150.00", statusColor: "bg-gray-500" },
    { id: "#3456", date: "2023-01-07", supplier: "OG Parts and Hardware", status: "Shipped", total: "₱45,200.00", statusColor: "bg-gray-400" },
    { id: "#7890", date: "2023-01-08", supplier: "Clark Inc.", status: "Shipped", total: "₱30,175.00", statusColor: "bg-gray-400" },
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar_Secondary />

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-6">
        

        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Issued Purchase Order</h1>
          <div className="space-x-2">
            <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">+ Add Supplier</button>
            <button className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-700">+ Create PO</button>
          </div>
        </div>

        <p className="text-gray-600 mb-4">
          Form pages are used to collect or verify information to users, and basic forms are common in scenarios where there are fewer data items.
        </p>

        {/* Filters & Search */}
        <div className="flex space-x-2 mb-4">
          <select className="border border-gray-300 p-2 rounded">
            <option>All</option>
          </select>
          <select className="border border-gray-300 p-2 rounded">
            <option>Status: All</option>
          </select>
          <input
            type="text"
            placeholder="Search by PO number, Supplier, or Date"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded bg-purple-100 placeholder-gray-700"
          />
        </div>

        {/* Purchase Orders Table */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b bg-gray-200">
                <th className="p-3 text-left">Purchase Order ID</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Supplier</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Total</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {purchaseOrders.map((order, index) => (
                <tr key={index} className="border-t hover:bg-gray-100">
                  <td className="p-3">{order.id}</td>
                  <td className="p-3 text-purple-500 cursor-pointer">{order.date}</td>
                  <td className="p-3">{order.supplier}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-white ${order.statusColor}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-3">{order.total}</td>
                  <td className="p-3 text-blue-500 cursor-pointer">
                    <button onClick={() => navigate(`/purchase-order-details/${order.id}`)}>View details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <p className="text-gray-600">1-10 of 100 items</p>
          <div className="flex space-x-2">
            <button className="border border-gray-300 px-3 py-1 rounded hover:bg-gray-200">&lt;</button>
            <button className="border border-gray-300 px-3 py-1 rounded bg-purple-500 text-white">6</button>
            <button className="border border-gray-300 px-3 py-1 rounded hover:bg-gray-200">7</button>
            <button className="border border-gray-300 px-3 py-1 rounded hover:bg-gray-200">&gt;</button>
            <select className="border border-gray-300 p-2 rounded">
              <option>10/page</option>
            </select>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PurchaseOrder_List;
