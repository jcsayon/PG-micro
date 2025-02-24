// frontend/src/components/PurchaseOrder_Supplier.jsx
import React, { useState } from "react";
import Sidebar_Secondary from "../components/Sidebar_Secondary";
import { useNavigate } from "react-router-dom";

const PurchaseOrder_Supplier = () => {
  const navigate = useNavigate(); // Define navigate function
  const [filters, setFilters] = useState({
    supplierName: "",
    address: "",
    contactNumber: "",
    email: "",
  });

  // Sample supplier data
  const suppliers = [
    { id: "TradeCode 99", name: "Hardware World", contact: "09123879981923", email: "hardwareworld.email.com" },
    { id: "TradeCode 98", name: "CD-R King", contact: "0912312312", email: "hardwareworld.email.com" },
    { id: "TradeCode 97", name: "MGM Marketing Inc.", contact: "09131231", email: "66" },
    { id: "TradeCode 96", name: "Sara Davis", contact: "09123132", email: "87" },
    { id: "TradeCode 95", name: "Mike Tyson Inc.", contact: "09123123", email: "77" },
    { id: "TradeCode 94", name: "Golden Computers", contact: "09123124", email: "65" },
    { id: "TradeCode 93", name: "OG Parts and Hardware", contact: "09123123", email: "554" },
    { id: "TradeCode 92", name: "Clark Inc.", contact: "09131231", email: "109" },
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar_Secondary />

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-6">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Supplier Form</h1>
          <button className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-700">
            + Add Supplier
          </button>
        </div>

        {/* Filter Inputs */}
        <div className="grid grid-cols-4 gap-4 mb-4">
          <input
            type="text"
            placeholder="Supplier Name"
            value={filters.supplierName}
            onChange={(e) => setFilters({ ...filters, supplierName: e.target.value })}
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="Address"
            value={filters.address}
            onChange={(e) => setFilters({ ...filters, address: e.target.value })}
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="Contact number"
            value={filters.contactNumber}
            onChange={(e) => setFilters({ ...filters, contactNumber: e.target.value })}
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="Email"
            value={filters.email}
            onChange={(e) => setFilters({ ...filters, email: e.target.value })}
            className="p-2 border border-gray-300 rounded"
          />
        </div>

        {/* Suppliers Table */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b bg-gray-200">
                <th className="p-3 text-left">
                  <input type="checkbox" />
                </th>
                <th className="p-3 text-left">Supplier ID</th>
                <th className="p-3 text-left">Supplier Name</th>
                <th className="p-3 text-left">Contact</th>
                <th className="p-3 text-left">Email</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((supplier, index) => (
                <tr key={index} className="border-t hover:bg-gray-100">
                  <td className="p-3">
                    <input type="checkbox" />
                  </td>
                  <td className="p-3 text-purple-500 hover:underline cursor-pointer">{supplier.id}</td>
                  <td className="p-3">{supplier.name}</td>
                  <td className="p-3">{supplier.contact}</td>
                  <td className="p-3">{supplier.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <p className="text-gray-600">1-8 of 50 items</p>
          <div className="flex space-x-2">
            <button className="border border-gray-300 px-3 py-1 rounded hover:bg-gray-200">&lt;</button>
            <button className="border border-gray-300 px-3 py-1 rounded bg-purple-500 text-white">1</button>
            <button className="border border-gray-300 px-3 py-1 rounded hover:bg-gray-200">2</button>
            <button className="border border-gray-300 px-3 py-1 rounded hover:bg-gray-200">3</button>
            <button className="border border-gray-300 px-3 py-1 rounded hover:bg-gray-200">4</button>
            <button className="border border-gray-300 px-3 py-1 rounded hover:bg-gray-200">5</button>
            <button className="border border-gray-300 px-3 py-1 rounded hover:bg-gray-200">&gt;</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PurchaseOrder_Supplier;
