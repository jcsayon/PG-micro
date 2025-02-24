// frontend/src/pages/Sales_List.jsx
import React, { useState } from "react";
import Sidebar_Secondary from "../components/Sidebar_Secondary";
import { useNavigate } from "react-router-dom";

const Sales_List = () => {
  const navigate = useNavigate(); // Define navigate function
  const [searchQuery, setSearchQuery] = useState("");

  // Sample sales data
  const salesData = [
    { id: "S1234", date: "2023-01-01", time: "10:15 AM", customer: "John Doe", customerId: "C001", products: "Laptop, Mouse", status: "Sold", total: "₱50,000.00", paymentMethod: "Credit Card", statusColor: "bg-green-400" },
    { id: "S5678", date: "2023-01-02", time: "02:30 PM", customer: "Jane Smith", customerId: "C002", products: "Smartphone, Earbuds", status: "On Hold", total: "₱30,000.00", paymentMethod: "Cash", statusColor: "bg-yellow-400" },
    { id: "S9101", date: "2023-01-03", time: "04:45 PM", customer: "Mike Tyson", customerId: "C003", products: "Monitor, Keyboard", status: "Returned", total: "₱20,500.00", paymentMethod: "Online Payment", statusColor: "bg-red-400" },
    { id: "S2345", date: "2023-01-04", time: "11:10 AM", customer: "Sara Davis", customerId: "C004", products: "Printer", status: "Sold", total: "₱15,000.00", paymentMethod: "Debit Card", statusColor: "bg-green-400" },
    { id: "S6789", date: "2023-01-05", time: "01:25 PM", customer: "Clark Kent", customerId: "C005", products: "Graphics Card", status: "On Hold", total: "₱25,750.00", paymentMethod: "Credit Card", statusColor: "bg-yellow-400" },
    { id: "S1011", date: "2023-01-06", time: "05:50 PM", customer: "Tony Stark", customerId: "C006", products: "Gaming PC", status: "Sold", total: "₱120,000.00", paymentMethod: "Bank Transfer", statusColor: "bg-green-400" },
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar_Secondary />

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-6">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Sales Transactions</h1>
        </div>

        <p className="text-gray-600 mb-4">
          View details of sales transactions, including customers, products sold, and payment details.
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
            placeholder="Search by Sale ID, Customer, or Date"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded bg-purple-100 placeholder-gray-700"
          />
        </div>

        {/* Sales Transactions Table */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b bg-gray-200">
                <th className="p-3 text-left">Sale ID</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Time</th>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Products Sold</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Total</th>
                <th className="p-3 text-left">Payment Method</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {salesData.map((sale, index) => (
                <tr key={index} className="border-t hover:bg-gray-100">
                  <td className="p-3">{sale.id}</td>
                  <td className="p-3 text-purple-500 cursor-pointer">{sale.date}</td>
                  <td className="p-3">{sale.time}</td>
                  <td className="p-3">{sale.customer} (ID: {sale.customerId})</td>
                  <td className="p-3">{sale.products}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-white ${sale.statusColor}`}>
                      {sale.status}
                    </span>
                  </td>
                  <td className="p-3">{sale.total}</td>
                  <td className="p-3">{sale.paymentMethod}</td>
                  <td className="p-3 text-blue-500 cursor-pointer">
                    <button onClick={() => navigate(`/sales-summary/${sale.id}`)}>View details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <p className="text-gray-600">1-6 of 50 items</p>
          <div className="flex space-x-2">
            <button className="border border-gray-300 px-3 py-1 rounded hover:bg-gray-200">&lt;</button>
            <button className="border border-gray-300 px-3 py-1 rounded bg-purple-500 text-white">1</button>
            <button className="border border-gray-300 px-3 py-1 rounded hover:bg-gray-200">2</button>
            <button className="border border-gray-300 px-3 py-1 rounded hover:bg-gray-200">3</button>
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

export default Sales_List;