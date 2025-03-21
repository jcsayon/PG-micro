import React, { useState } from 'react';
import ModuleLayout from '../../layouts/ModuleLayout';

const SalesOrderPage = () => {
  const [order, setOrder] = useState({
    customer: { name: '', phone: '' },
    items: [],
    paymentMethod: 'Cash',
  });

  const inventory = [
    { id: 1, name: 'Product A', price: 100, stock: 10 },
    { id: 2, name: 'Product B', price: 150, stock: 5 },
    { id: 3, name: 'Product C', price: 200, stock: 8 },
  ];

  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setOrder((prev) => ({ ...prev, customer: { ...prev.customer, [name]: value } }));
  };

  const handleAddItem = (product) => {
    setOrder((prev) => ({
      ...prev,
      items: [...prev.items, { ...product, quantity: 1 }],
    }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = order.items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setOrder((prev) => ({ ...prev, items: newItems }));
  };

  const handleSubmit = () => {
    console.log('Submitting order:', order);
  };

  return (
    <ModuleLayout>
      <div className="p-6 bg-gray-900 text-white min-h-screen flex flex-col w-full">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Section - Product List */}
          <div className="w-full md:w-2/3 bg-gray-800 p-6 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold mb-6">Point of Sale</h1>
            <h2 className="text-xl font-semibold mb-3">Select Products</h2>
            <div className="grid grid-cols-3 gap-4">
              {inventory.map((product) => (
                <div key={product.id} className="bg-gray-700 p-4 rounded-lg text-center">
                  <p className="text-lg font-semibold">{product.name}</p>
                  <p className="text-md">₱{product.price}</p>
                  <p className="text-sm text-gray-300">Stock: {product.stock}</p>
                  <button
                    onClick={() => handleAddItem(product)}
                    className="mt-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
                  >
                    Add to Order
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right Section - Order Summary */}
          <div className="w-full md:w-1/3 bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-3">Order Summary</h2>
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between mb-2">
                <p>{item.name} (x{item.quantity})</p>
                <p>₱{item.price * item.quantity}</p>
              </div>
            ))}
            <div className="border-t border-gray-600 mt-4 pt-4">
              <p className="text-lg">Total: ₱{order.items.reduce((sum, item) => sum + item.quantity * item.price, 0).toFixed(2)}</p>
            </div>

            {/* Payment Options */}
            <h2 className="text-xl font-semibold mt-4">Payment Method</h2>
            <select className="p-3 border border-gray-600 rounded-md w-full bg-gray-700 text-white" value={order.paymentMethod} onChange={(e) => setOrder({ ...order, paymentMethod: e.target.value })}>
              <option value="Cash">Cash</option>
              <option value="Debit">Debit</option>
              <option value="E-Wallet">E-Wallet</option>
            </select>

            <button onClick={handleSubmit} className="w-full bg-green-500 text-white py-3 rounded-md hover:bg-green-600 transition text-lg font-semibold mt-4">Complete Sale</button>
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
};

export default SalesOrderPage;
