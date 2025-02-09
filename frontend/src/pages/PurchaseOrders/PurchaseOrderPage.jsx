import React, { useState, useEffect } from "react";

const PurchaseOrderList = ({ onCreate, onView }) => {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    // Fetch purchase orders (replace with your backend API call)
    setPurchaseOrders([
      { id: 1, poNumber: "PO-1234", supplier: "Hardware World", date: "2023-01-01", total: "₱199,100.00", status: "Order Placed" },
      { id: 2, poNumber: "PO-5678", supplier: "CD-R King", date: "2023-01-02", total: "₱50,050.00", status: "Shipped" },
    ]);
  }, []);

  const filteredOrders = purchaseOrders.filter((order) => {
    const matchesSearch = order.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) || order.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-purple-600 mb-4">Issued Purchase Orders</h1>
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search by PO number, Supplier, or Date"
          className="p-2 border border-gray-300 rounded w-64"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={onCreate} className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
          + Create PO
        </button>
      </div>
      <table className="min-w-full bg-white border border-gray-300 rounded">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 text-left">PO Number</th>
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
              <td className="p-3">{order.status}</td>
              <td className="p-3 text-right">{order.total}</td>
              <td className="p-3">
                <button onClick={() => onView(order)} className="text-blue-500 hover:underline">View Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PurchaseOrderList;
