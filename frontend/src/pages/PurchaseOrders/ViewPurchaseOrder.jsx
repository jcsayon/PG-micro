import React from "react";

const ViewPurchaseOrder = ({ order, onBack }) => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-purple-600 mb-4">Purchase Order Details</h1>
      <div>
        <p><strong>PO Number:</strong> {order.poNumber}</p>
        <p><strong>Supplier:</strong> {order.supplier}</p>
        <p><strong>Date:</strong> {order.date}</p>
        <p><strong>Total:</strong> {order.total}</p>
        <p><strong>Status:</strong> {order.status}</p>
      </div>
      <button onClick={onBack} className="mt-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
        Back
      </button>
    </div>
  );
};

export default ViewPurchaseOrder;