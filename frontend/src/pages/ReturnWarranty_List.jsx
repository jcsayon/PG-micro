// frontend/src/components/ReturnWarrantyPage.jsx
import React from 'react';
import Sidebar_Secondary from '../components/Sidebar_Secondary';
import { useNavigate } from "react-router-dom";

const ReturnWarranty_List = () => {
  const navigate = useNavigate(); // Define navigate
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar_Secondary />

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-purple-700">Return List</h1>
          <p className="text-gray-600">Form pages are used to collect or verify information to users.</p>
          
          {/* Filter Buttons */}
          <div className="flex space-x-2 mt-4">
            {['All', 'Awaiting Return', 'Return Started', 'Return Received', 'Return Complete', 'Return Rejected'].map((status) => (
              <button key={status} className="bg-purple-300 text-purple-700 px-4 py-2 rounded-full text-sm">{status}</button>
            ))}
          </div>
          
          {/* Search Bar */}
          <div className="mt-4">
            <input type="text" placeholder="Search by order ID, customer name, or email" className="w-full p-2 border border-gray-300 rounded" />
          </div>
          
          {/* Table */}
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse bg-white shadow-md rounded-lg">
              <thead>
                <tr className="bg-purple-200 text-left">
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Company</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 8 }).map((_, index) => (
                  <tr key={index} className="border-t">
                    <td className="p-3">#{1234 + index}</td>
                    <td className="p-3">2023-01-0{index + 1}</td>
                    <td className="p-3">John Doe</td>
                    <td className="p-3">PG Micro</td>
                    <td className="p-3"><span className="bg-purple-300 px-2 py-1 rounded">Return Received</span></td>
                    <td className="p-3">${(index + 1) * 25}.00</td>
                    <td className="p-3 text-blue-500 cursor-pointer">
                      <button onClick={() => navigate(`/return-warranty-details`)}>View Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReturnWarranty_List;
