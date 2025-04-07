import React, { useState } from "react";
import { Link } from "react-router-dom";

const ReturnFormPage = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [reason, setReason] = useState("");

  const orderDetails = {
    orderId: "1234",
    name: "John Doe",
    email: "johndoe@gmail.com",
    contact: "+63 986 762 2773",
  };

  const productList = [
    {
      id: "TradeCode 98",
      description: "Original Samsung B105e Keypad cellphone",
      brand: "Samsung",
      stock: 12,
      price: "100,000",
      quantity: 1,
    },
    {
      id: "TradeCode 95",
      description: "iPhone 15 Pro Max",
      brand: "Apple",
      stock: 24,
      price: "456,456",
      quantity: 1,
    },
    {
      id: "TradeCode 94",
      description: "EcoTank L850 A4 Multi-Function 6-Colour Photo Ink Tar",
      brand: "Epson",
      stock: 123,
      price: "647,770",
      quantity: 1,
    },
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      {/* <Sidebar_Secondary /> */}

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-6">

        {/* Form Section */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-purple-700">Return Form</h1>
          <p className="text-gray-600 mb-4">
            Form pages are used to collect or verify information from users.
          </p>

          {/* Date Input */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Date:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
          </div>

          {/* Reason Input */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Reason:</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for return..."
              className="w-full p-2 border border-gray-300 rounded mt-1"
              rows="3"
            ></textarea>
          </div>

          {/* Pick Item Button */}
          <button className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-700">
            Pick Item
          </button>
        </div>

        {/* Order Details Section */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800">Order #{orderDetails.orderId}</h2>
          <div className="flex flex-wrap gap-6 mt-2">
            <p className="text-gray-700">
              <strong>Name:</strong> {orderDetails.name}
            </p>
            <p className="text-gray-700">
              <strong>Email:</strong> {orderDetails.email}
            </p>
            <p className="text-gray-700">
              <strong>Contact:</strong> {orderDetails.contact}
            </p>
          </div>

          {/* Order Items */}
          <div className="mt-4">
            <Link to="#" className="text-purple-500 hover:underline">
              Order Items
            </Link>
          </div>
        </div>

        {/* Product Table */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <table className="w-full border-collapse bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-purple-200 text-left">
                <th className="p-3">Product ID</th>
                <th className="p-3">Description</th>
                <th className="p-3">Brand</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Price</th>
                <th className="p-3">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {productList.map((product, index) => (
                <tr key={index} className="border-t">
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

        {/* Next Button */}
        <div className="mt-6 flex justify-end">
          <button className="bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-700">
            Next: Summary →
          </button>
        </div>
      </main>
    </div>
  );
};

export default ReturnFormPage;
