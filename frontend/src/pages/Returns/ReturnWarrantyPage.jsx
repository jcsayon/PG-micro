import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";

const ReturnWarrantyPage = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      {/* Main Content Wrapper */}
      <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-200 min-h-screen">
        <div className="bg-gradient-to-r from-blue-500 to-blue-200 rounded-lg">
          <h1 className="text-2xl font-bold text-purple-700 mb-4">Return List</h1>
          <p className="text-gray-600 mb-4">
            Form pages are used to collect or verify information from users.
          </p>

          {/* Filter Buttons */}
          <div className="flex flex-wrap space-x-2 mt-4 mb-4">
            {[
              "All",
              "Awaiting Return",
              "Return Started",
              "Return Received",
              "Return Complete",
              "Return Rejected",
            ].map((status) => (
              <button
                key={status}
                className="bg-purple-300 text-purple-700 px-4 py-2 rounded-full text-sm hover:bg-purple-400 transition"
              >
                {status}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="mt-4 mb-4 relative">
            <label htmlFor="return-search" className="sr-only">Search</label>
            <input
              id="return-search"
              name="return-search"
              type="text"
              autoComplete="off"
              placeholder="Search by order ID, customer name, or email"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Table */}
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse bg-white shadow-md rounded-lg">
              <thead>
                <tr className="bg-purple-200 text-left text-purple-800">
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 8 }).map((_, index) => (
                  <tr key={index} className="border-t hover:bg-purple-50 transition">
                    <td className="p-3">#{1234 + index}</td>
                    <td className="p-3">2023-01-0{index + 1}</td>
                    <td className="p-3">John Doe</td>
                    <td className="p-3">
                      <span className="bg-purple-300 px-2 py-1 rounded-full text-purple-700">
                        Return Received
                      </span>
                    </td>
                    <td className="p-3">${(index + 1) * 25}.00</td>
                    <td className="p-3 text-blue-500 cursor-pointer hover:underline">
                      <button onClick={() => navigate(`/return-details`)}>View Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReturnWarrantyPage;
