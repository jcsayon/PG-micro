// frontend/src/pages/Sales_Summary.jsx
import React, { useState } from "react";
import Sidebar_Secondary from "../components/Sidebar_Secondary";
import { useNavigate, useParams } from "react-router-dom";

const Sales_Summary = () => {
  const navigate = useNavigate(); // Define navigate function
  const { saleId } = useParams(); // Get sale ID from URL

  const [customer, setCustomer] = useState({
    name: "John Doe",
    address: "example",
    type: "Walk-in",
    email: "example",
    phone: "example",
  });

  const [products, setProducts] = useState([
    { id: "TradeCode 98", description: "Quam aliquam odio ullan", brand: "Samsung", stock: 12, price: 100000, quantity: 2 },
    { id: "TradeCode 95", description: "Sed at ornare scelerisque", brand: "Apple", stock: 24, price: 456456, quantity: 15 },
    { id: "TradeCode 94", description: "Molestie est pharetra eu", brand: "Epson", stock: 123, price: 647770, quantity: 3 },
  ]);

  const [payment, setPayment] = useState({ cash: 4000, card: 0 });

  // Calculate totals
  const totalQuantity = products.reduce((sum, item) => sum + item.quantity, 0);
  const netTotal = products.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = 4.75;
  const grandTotal = netTotal - discount;

  // Handle quantity change
  const handleQuantityChange = (id, delta) => {
    setProducts(products.map((item) =>
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  // Handle removing items
  const handleRemoveItem = (id) => {
    setProducts(products.filter((item) => item.id !== id));
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar_Secondary />

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-6">
        {/* Customer Form */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Customer Form</h1>
          <div className="grid grid-cols-5 gap-4">
            <div>
              <label className="block text-gray-700">Customer Name</label>
              <input type="text" value={customer.name} className="w-full p-2 border border-gray-300 rounded mt-1" readOnly />
            </div>
            <div>
              <label className="block text-gray-700">Customer Address</label>
              <input type="text" value={customer.address} className="w-full p-2 border border-gray-300 rounded mt-1" readOnly />
            </div>
            <div>
              <label className="block text-gray-700">Customer Type</label>
              <input type="text" value={customer.type} className="w-full p-2 border border-gray-300 rounded mt-1 bg-gray-100" readOnly />
            </div>
            <div>
              <label className="block text-gray-700">Customer Email</label>
              <input type="text" value={customer.email} className="w-full p-2 border border-gray-300 rounded mt-1" readOnly />
            </div>
            <div>
              <label className="block text-gray-700">Customer Phone</label>
              <input type="text" value={customer.phone} className="w-full p-2 border border-gray-300 rounded mt-1" readOnly />
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="flex space-x-4">
          <div className="w-2/3 bg-white shadow-md rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold text-gray-800">Product</h2>
              <button className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-700" onClick={() => handleRemoveItem(products[0]?.id)}>
                Remove
              </button>
              <input type="text" placeholder="Search products..." className="p-2 border border-gray-300 rounded" />
            </div>

            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b bg-gray-200">
                  <th className="p-3 text-left"><input type="checkbox" /></th>
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
                  <tr key={index} className="border-t hover:bg-gray-100 bg-purple-100">
                    <td className="p-3"><input type="checkbox" checked /></td>
                    <td className="p-3 text-purple-500 hover:underline cursor-pointer">{product.id}</td>
                    <td className="p-3">{product.description}</td>
                    <td className="p-3">{product.brand}</td>
                    <td className="p-3">{product.stock}</td>
                    <td className="p-3">{product.price.toLocaleString()}</td>
                    <td className="p-3 flex items-center">
                      <button onClick={() => handleQuantityChange(product.id, -1)} className="px-2 border rounded">-</button>
                      <span className="px-2">{product.quantity}</span>
                      <button onClick={() => handleQuantityChange(product.id, 1)} className="px-2 border rounded">+</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Section */}
          <div className="w-1/3 bg-white shadow-md rounded-lg p-4">
            <h2 className="text-lg font-semibold text-gray-800">Total Quantity</h2>
            <p className="text-xl">{totalQuantity}</p>
            <hr className="my-2" />
            <h2 className="text-lg font-semibold text-gray-800">Net Total</h2>
            <p className="text-xl">₱{netTotal.toLocaleString()}</p>
            <hr className="my-2" />
            <h2 className="text-lg font-semibold text-gray-800">Discount</h2>
            <p className="text-xl">₱{discount}</p>
            <hr className="my-2" />
            <h2 className="text-lg font-semibold text-red-500">Grand Total</h2>
            <p className="text-2xl font-bold text-red-600">₱{grandTotal.toLocaleString()}</p>

            {/* Payment Section */}
            <h2 className="text-lg font-semibold text-gray-800 mt-4">Add Payment</h2>
            <button className="w-full bg-purple-500 text-white py-2 my-2 rounded">CASH</button>
            <button className="w-full bg-gray-700 text-white py-2 rounded">CARD</button>

            {/* Action Buttons */}
            <div className="flex justify-between mt-4">
              <button className="bg-purple-500 text-white px-6 py-2 rounded">Place Order</button>
              <button className="bg-red-500 text-white px-6 py-2 rounded">Cancel</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Sales_Summary;
