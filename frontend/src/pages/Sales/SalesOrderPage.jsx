import React, { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";

const SalesOrderPage = () => {
  const [order, setOrder] = useState({
    customer: { name: "", address: "", phone: "", email: "" },
    items: [],
    status: "Pending",
  });

  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setOrder((prev) => ({
      ...prev,
      customer: { ...prev.customer, [name]: value },
    }));
  };

  const handleAddItem = () => {
    setOrder((prev) => ({
      ...prev,
      items: [...prev.items, { product: "", quantity: 1, price: 0 }],
    }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = order.items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setOrder((prev) => ({ ...prev, items: newItems }));
  };

  const handleSubmit = () => {
    console.log("Submitting order:", order);
    // You can add your submission logic here
  };

  return (
    <DashboardLayout>
      <div className="w-full bg-gradient-to-r from-red-500 to-red-200 p-2 rounded-lg">
        <h1 className="text-2xl font-bold text-purple-700 mb-6">
          New Sales Order
        </h1>

        {/* Customer Information Section */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Customer Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="name"
              placeholder="Customer Name"
              className="p-3 border border-gray-300 rounded-md w-full"
              onChange={handleCustomerChange}
            />
            <input
              name="address"
              placeholder="Address"
              className="p-3 border border-gray-300 rounded-md w-full"
              onChange={handleCustomerChange}
            />
            <input
              name="phone"
              placeholder="Phone"
              className="p-3 border border-gray-300 rounded-md w-full"
              onChange={handleCustomerChange}
            />
            <input
              name="email"
              placeholder="Email"
              className="p-3 border border-gray-300 rounded-md w-full"
              onChange={handleCustomerChange}
            />
          </div>
        </section>

        {/* Order Items Section */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Order Items</h2>
          {order.items.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4"
            >
              <input
                placeholder="Product"
                className="p-3 border border-gray-300 rounded-md w-full"
                onChange={(e) =>
                  handleItemChange(index, "product", e.target.value)
                }
              />
              <input
                type="number"
                placeholder="Quantity"
                className="p-3 border border-gray-300 rounded-md w-full"
                onChange={(e) =>
                  handleItemChange(index, "quantity", e.target.value)
                }
              />
              <input
                type="number"
                placeholder="Price"
                className="p-3 border border-gray-300 rounded-md w-full"
                onChange={(e) =>
                  handleItemChange(index, "price", e.target.value)
                }
              />
            </div>
          ))}
          <button
            onClick={handleAddItem}
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition"
          >
            Add Item
          </button>
        </section>

        {/* Order Summary Section */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Order Summary</h2>
          <p className="text-lg">
            Total Amount: ₱
            {order.items
              .reduce((sum, item) => sum + item.quantity * item.price, 0)
              .toFixed(2)}
          </p>
        </section>

        <button
          onClick={handleSubmit}
          className="w-full bg-purple-600 text-white py-3 rounded-md hover:bg-purple-700 transition text-lg font-semibold"
        >
          Submit Order
        </button>
      </div>
    </DashboardLayout>
  );
};

export default SalesOrderPage;
