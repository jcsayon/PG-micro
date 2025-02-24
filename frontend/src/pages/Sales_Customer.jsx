// frontend/src/pages/Sales_Customer.jsx
import React, { useState } from "react";
import Sidebar_Secondary from "../components/Sidebar_Secondary";
import { useNavigate } from "react-router-dom";

const Sales_Customer = () => {
  const navigate = useNavigate(); // Define navigate function
  const [customer, setCustomer] = useState({
    name: "John Doe",
    address: "text@email.com",
    type: "Walk-in",
    phone: "",
    email: "",
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomer({ ...customer, [name]: value });
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar_Secondary />

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-6">
        {/* Customer Form Header */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Customer Form</h1>

          {/* Customer Form Fields */}
          <div className="grid grid-cols-3 gap-4">
            {/* Customer Name */}
            <div>
              <label className="block text-gray-700">Customer Name</label>
              <input
                type="text"
                name="name"
                value={customer.name}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded mt-1"
              />
            </div>

            {/* Customer Address */}
            <div>
              <label className="block text-gray-700">Customer Address</label>
              <input
                type="text"
                name="address"
                value={customer.address}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded mt-1"
              />
            </div>

            {/* Customer Type */}
            <div>
              <label className="block text-gray-700">Customer Type</label>
              <select
                name="type"
                value={customer.type}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded mt-1 bg-gray-100"
                disabled
              >
                <option>Walk-in</option>
              </select>
            </div>

            {/* Customer Phone */}
            <div>
              <label className="block text-gray-700">Customer Phone</label>
              <div className="flex">
                <span className="p-2 border border-gray-300 bg-gray-200 rounded-l">+63</span>
                <input
                  type="text"
                  name="phone"
                  value={customer.phone}
                  onChange={handleInputChange}
                  placeholder="eg"
                  className="w-full p-2 border border-gray-300 rounded-r"
                />
              </div>
            </div>

            {/* Customer Email */}
            <div>
              <label className="block text-gray-700">Customer Email</label>
              <input
                type="email"
                name="email"
                value={customer.email}
                onChange={handleInputChange}
                placeholder="example"
                className="w-full p-2 border border-gray-300 rounded mt-1"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Sales_Customer;
