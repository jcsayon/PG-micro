import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PurchaseOrderPage = () => {
  const navigate = useNavigate();
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    // Fetch purchase orders (replace with your backend API call)
    setPurchaseOrders([
      { id: 1, poNumber: "#1234", supplier: "Hardware World", date: "2023-01-01", total: "₱199,100.00", status: "Order Placed" },
      { id: 2, poNumber: "#5678", supplier: "CD-R King", date: "2023-01-02", total: "₱50,050.00", status: "Shipped" },
      { id: 3, poNumber: "#9101", supplier: "MGM Marketing Inc.", date: "2023-01-03", total: "₱12,075.00", status: "Delivered" },
      { id: 4, poNumber: "#2345", supplier: "Sara Davis", date: "2023-01-04", total: "₱100,125.00", status: "Delivered" },
      { id: 5, poNumber: "#6789", supplier: "Mike Tyson Inc.", date: "2023-01-05", total: "₱55,625.00", status: "In Progress" },
    ]);
  }, []);

  const filteredOrders = purchaseOrders.filter((order) => {
    const matchesSearch =
      order.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-purple-600">Issued Purchase Order</h1>
        <div className="flex gap-4">
          <button
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
            onClick={() => alert("Add Supplier clicked!")}
          >
            Add Supplier
          </button>
          <button
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            onClick={() => navigate("/purchase-orders/create")}
          >
            + Create PO
          </button>
        </div>
      </div>

      <p className="text-gray-500 mb-6">
        Form pages are used to collect or verify information to users, and basic forms are common in scenarios where there are fewer data items.
      </p>

      {/* Filters */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-4">
          <button className="bg-gray-200 px-3 py-2 rounded">All</button>
          <select
            className="p-2 border border-gray-300 rounded"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">Status: All</option>
            <option value="Order Placed">Order Placed</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="In Progress">In Progress</option>
          </select>
        </div>
        <input
          type="text"
          placeholder="Search by PO number, Supplier, or Date"
          className="p-2 border border-gray-300 rounded w-64"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Table */}
      <table className="min-w-full bg-white border border-gray-300 rounded">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 text-left">Purchase Order ID</th>
            <th className="p-3 text-left">Date</th>
            <th className="p-3 text-left">Supplier</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-right">Total</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order) => (
            <tr key={order.id} className="border-t">
              <td className="p-3">{order.poNumber}</td>
              <td className="p-3">{order.date}</td>
              <td className="p-3">{order.supplier}</td>
              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded text-white ${
                    order.status === "Delivered"
                      ? "bg-green-500"
                      : order.status === "Shipped"
                      ? "bg-gray-500"
                      : order.status === "Order Placed"
                      ? "bg-purple-400"
                      : "bg-yellow-400"
                  }`}
                >
                  {order.status}
                </span>
              </td>
              <td className="p-3 text-right">{order.total}</td>
              <td className="p-3">
                <button
                  onClick={() => navigate("/purchase-orders/view", { state: { order } })}
                  className="text-blue-500 hover:underline"
                >
                  View details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <p className="text-gray-500">1-10 of 100 items</p>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 border rounded">{"<"}</button>
          <button className="px-3 py-1 border rounded">1</button>
          <button className="px-3 py-1 border rounded">2</button>
          <button className="px-3 py-1 border rounded">...</button>
          <button className="px-3 py-1 border rounded">10</button>
          <button className="px-3 py-1 border rounded">{">"}</button>
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrderPage;
