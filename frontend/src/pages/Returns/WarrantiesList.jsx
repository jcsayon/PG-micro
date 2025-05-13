import React, { useState, useEffect } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Search, X } from "lucide-react";

// HEADER STATUS DROPDOWN COLOR 
function getBackgroundColor(value) {
  switch (value) {
    case "All": return "bg-blue-100 text-blue-800";
    case "Customer Warranty": return "bg-blue-100 text-blue-800";
    case "Supplier Warranty": return "bg-purple-100 text-purple-800";
    case "Active": return "bg-green-100 text-green-800";
    case "Expired": return "bg-red-100 text-red-800";
    default: return "bg-white";
  }
}

// Define the warranty storage key (same as in sales module)
const WARRANTY_STORAGE_KEY = 'warrantyData';

const WarrantyList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [warranties, setWarranties] = useState([]);
  const [warrantyTypeFilter, setWarrantyTypeFilter] = useState("All");
  const [editingWarranty, setEditingWarranty] = useState(null);
  const [editedWarranty, setEditedWarranty] = useState(null);
  const [selectedWarranty, setSelectedWarranty] = useState(null);
  const [showWarrantyDetailsModal, setShowWarrantyDetailsModal] = useState(false);

  // WARRANTY MANAGEMENT FUNCTIONS
  const handleEditWarranty = (warranty) => {
    setEditingWarranty(warranty.id);
    setEditedWarranty({...warranty});
  };

  const handleSaveWarranty = async () => {
    try {
      /*
      // When API is ready, uncomment this section
      const response = await fetch(`${API_BASE_URL}/warranties/${editedWarranty.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedWarranty),
      });
      
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      
      // Refresh the warranties list after update
      loadWarranties();
      */
      
      // For now, continue using localStorage
      const updatedWarranties = warranties.map(w => 
        w.id === editedWarranty.id ? editedWarranty : w
      );
      setWarranties(updatedWarranties);
      saveWarrantiesToLocalStorage(updatedWarranties);
      
      setEditingWarranty(null);
      setEditedWarranty(null);
    } catch (error) {
      console.error("Error saving warranty:", error);
      alert("Failed to save warranty changes");
    }
  };

  const handleCancelEdit = () => {
    setEditingWarranty(null);
    setEditedWarranty(null);
  };

  const handleWarrantyChange = (field, value) => {
    setEditedWarranty({
      ...editedWarranty,
      [field]: value
    });
  };

  // Function to view warranty details
  const handleViewWarrantyDetails = (warranty) => {
    setSelectedWarranty(warranty);
    setShowWarrantyDetailsModal(true);
  };

  // Function to save warranties to localStorage
  const saveWarrantiesToLocalStorage = (warrantyData) => {
    localStorage.setItem(WARRANTY_STORAGE_KEY, JSON.stringify(warrantyData));
  };
  
  // Function to load warranties from localStorage
  const loadWarranties = async () => {
    try {
      /*
      // When API is ready, uncomment this section
      const response = await fetch(`${API_BASE_URL}/warranties/`);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      
      const warrantyData = await response.json();
      setWarranties(warrantyData);
      */
      
      // For now, continue using localStorage
      const savedWarranties = localStorage.getItem(WARRANTY_STORAGE_KEY);
      
      if (savedWarranties) {
        const parsedWarranties = JSON.parse(savedWarranties);
        setWarranties(parsedWarranties);
      } else {
        setWarranties([]);
      }
    } catch (error) {
      console.error("Error loading warranty data:", error);
      setWarranties([]);
    }
  };

  // Load warranties when component mounts
  useEffect(() => {
    loadWarranties();
  }, []);

  const filteredWarranties = warranties.filter((warranty) => {
    const matchesSearch = 
      (warranty.product && warranty.product.toLowerCase().includes(searchQuery.toLowerCase())) || 
      (warranty.customer && warranty.customer.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (warranty.supplier && warranty.supplier.toLowerCase().includes(searchQuery.toLowerCase()));
    return (warrantyTypeFilter === "All" || warranty.type === warrantyTypeFilter) && 
           (searchQuery === "" || matchesSearch);
  });

  return (
    <DashboardLayout>
      <div className="p-4 bg-white min-h-screen">
        <div className="sticky top-0 z-20 bg-white pb-4 border-b mb-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Warranty Management</h1>

          <div className="flex gap-4 justify-between items-center">
            <div className="flex gap-3">
              <select
                className={`px-4 py-2 border border-gray-300 rounded-md shadow-sm ${getBackgroundColor(warrantyTypeFilter)}`}
                value={warrantyTypeFilter}
                onChange={(e) => setWarrantyTypeFilter(e.target.value)}
              >
                <option value="All">All Warranties</option>
                <option value="Customer Warranty">Customer Warranties</option>
                <option value="Supplier Warranty">Supplier Warranties</option>
              </select>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by Product, Customer, or Supplier"
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm w-[400px] focus:ring-indigo-500 focus:border-indigo-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Warranties Table */}
        <div className="overflow-hidden shadow-md rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Type</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Product</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Customer/Supplier</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Issue Date</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Expiry Date</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900" style={{ width: "150px" }}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredWarranties.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-3 py-4 text-sm text-gray-500 text-center">
                    No warranties found. Create sales orders to generate warranties automatically.
                  </td>
                </tr>
              ) : (
                filteredWarranties.map((warranty) => (
                  <tr key={warranty.id} className="hover:bg-gray-50 w-full">
                    <td className="px-3 py-4 text-sm text-gray-900">
                      {editingWarranty === warranty.id ? (
                        <select
                          className="w-full border border-gray-300 p-2 rounded-md shadow-sm"
                          value={editedWarranty.type}
                          onChange={(e) => handleWarrantyChange("type", e.target.value)}
                        >
                          <option value="Customer Warranty">Customer Warranty</option>
                          <option value="Supplier Warranty">Supplier Warranty</option>
                        </select>
                      ) : (
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          warranty.type === "Customer Warranty" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
                        }`}>
                          {warranty.type}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-900">
                      {editingWarranty === warranty.id ? (
                        <input
                        type="text"
                        className="w-full border border-gray-300 p-2 rounded-md shadow-sm"
                        style={{ minWidth: "120px", maxWidth: "100%" }}
                        value={editedWarranty.product}
                        onChange={(e) => handleWarrantyChange("product", e.target.value)}
                      />
                      ) : (
                        warranty.product
                      )}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-900">
                      {editingWarranty === warranty.id ? (
                        <input
                          type="text"
                          className="w-full border border-gray-300 p-2 rounded-md shadow-sm"
                          value={editedWarranty.customer || editedWarranty.supplier || ""}
                          onChange={(e) => {
                            if (editedWarranty.type === "Customer Warranty") {
                              handleWarrantyChange("customer", e.target.value);
                            } else {
                              handleWarrantyChange("supplier", e.target.value);
                            }
                          }}
                        />
                      ) : (
                        warranty.customer || warranty.supplier
                      )}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500">
                      {editingWarranty === warranty.id ? (
                        <input
                          type="date"
                          className="w-full border border-gray-300 p-2 rounded-md shadow-sm"
                          value={editedWarranty.issueDate}
                          onChange={(e) => handleWarrantyChange("issueDate", e.target.value)}
                        />
                      ) : (
                        warranty.issueDate
                      )}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500">
                      {editingWarranty === warranty.id ? (
                        <input
                          type="date"
                          className="w-full border border-gray-300 p-2 rounded-md shadow-sm"
                          value={editedWarranty.expiryDate}
                          onChange={(e) => handleWarrantyChange("expiryDate", e.target.value)}
                        />
                      ) : (
                        warranty.expiryDate
                      )}
                    </td>
                    <td className="px-3 py-4 text-sm">
                      {editingWarranty === warranty.id ? (
                        <select
                          className={`w-full border border-gray-300 p-2 rounded-md shadow-sm ${
                            editedWarranty.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                          value={editedWarranty.status}
                          onChange={(e) => handleWarrantyChange("status", e.target.value)}
                        >
                          <option value="Active">Active</option>
                          <option value="Expired">Expired</option>
                        </select>
                      ) : (
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          warranty.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}>
                          {warranty.status}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-4 text-sm">
                      {editingWarranty === warranty.id ? (
                        <div className="flex space-x-2">
                          <button
                            className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded-md text-xs"
                            onClick={handleSaveWarranty}
                          >
                            Save
                          </button>
                          <button
                            className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded-md text-xs"
                            onClick={handleCancelEdit}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex space-x-2">
                          <button
                            className="bg-indigo-500 hover:bg-indigo-600 text-white px-2 py-1 rounded-md text-xs"
                            onClick={() => handleEditWarranty(warranty)}
                          >
                            Edit
                          </button>
                          <button
                            className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-md text-xs"
                            onClick={() => handleViewWarrantyDetails(warranty)}
                          >
                            View Details
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* WARRANTY DETAILS MODAL */}
        {showWarrantyDetailsModal && selectedWarranty && (
          <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-[600px] shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Warranty Details</h2>
                <button
                  onClick={() => setShowWarrantyDetailsModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="mb-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Warranty ID:</p>
                    <p className="text-base">#{selectedWarranty.id.toString().padStart(3, '0')}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Type:</p>
                    <p className="inline-block px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                      {selectedWarranty.type}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Product:</p>
                    <p className="text-base">{selectedWarranty.product}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Serial Number:</p>
                    <p className="text-base">{selectedWarranty.serialNumber || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Item ID:</p>
                    <p className="text-base">{selectedWarranty.itemId || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Customer/Supplier:</p>
                    <p className="text-base">{selectedWarranty.customer || selectedWarranty.supplier}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Status:</p>
                    <p className={`inline-block px-2 py-1 rounded-full text-xs ${
                      selectedWarranty.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}>
                      {selectedWarranty.status}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Issue Date:</p>
                    <p className="text-base">{selectedWarranty.issueDate}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Expiry Date:</p>
                    <p className="text-base">{selectedWarranty.expiryDate}</p>
                  </div>
                  {selectedWarranty.salesOrderId && (
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Sales Order ID:</p>
                      <p className="text-base">{selectedWarranty.salesOrderId}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Warranty Use:</p>
                    <p className="text-base">{selectedWarranty.warrantyUse || 0} times</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 font-medium"
                  onClick={() => setShowWarrantyDetailsModal(false)}
                >
                  Close
                </button>
                <button
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 font-medium"
                  onClick={() => {
                    setEditingWarranty(selectedWarranty.id);
                    setEditedWarranty({...selectedWarranty});
                    setShowWarrantyDetailsModal(false);
                  }}
                >
                  Edit Warranty
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default WarrantyList;