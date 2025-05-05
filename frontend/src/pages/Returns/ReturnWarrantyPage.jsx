import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Search, X, Trash2, ChevronLeft, ChevronRight, Plus } from "lucide-react";

// HEADER STATUS DROPDOWN COLOR 
function getBackgroundColor(value) {
  switch (value) {
    case "All": return "bg-blue-100 text-blue-800";
    case "Walk-In": return "bg-green-100 text-green-800";
    case "Contract": return "bg-yellow-200 text-yellow-800";
    case "Completed": return "bg-green-100 text-green-800";
    case "Pending": return "bg-yellow-200 text-yellow-800";
    case "Processing": return "bg-blue-100 text-blue-800";
    default: return "bg-white";
  }
}

const allCategories = [
  'Processor', 'Motherboards', 'Video Cards', 'Monitors', 'Laptops', 'Printers', 'Toners', 'Inks', 'Networking', 'DSLR Camera',
  'CCTV Camera', 'Keyboard & Mouse', 'Webcam', 'Power Supply', 'Thin Client'
];

// This would typically come from your API
const dummyInventory = {
  Laptops: [
    { id: 1, name: 'ACER Aspire 5', price: 32000, serial: 'SN-ACER-001', image: 'https://via.placeholder.com/100' },
    { id: 2, name: 'HP Pavilion 14', price: 28000, serial: 'SN-HP-002', image: 'https://via.placeholder.com/100' },
    { id: 3, name: 'LENOVO IdeaPad 3', price: 30000, serial: 'SN-LENOVO-003', image: 'https://via.placeholder.com/100' },
    { id: 4, name: 'ASUS VivoBook', price: 31000, serial: 'SN-ASUS-004', image: 'https://via.placeholder.com/100' },
    { id: 5, name: 'DELL Inspiron', price: 29000, serial: 'SN-DELL-005', image: 'https://via.placeholder.com/100' },
    { id: 6, name: 'DELL Inspiron 2', price: 29000, serial: 'SN-DELL-006', image: 'https://via.placeholder.com/100' },
  ]
};

const ReturnWarrantyPage = () => {
  const navigate = useNavigate();
  const [returnOrders, setReturnOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  
  // CUSTOMER MANAGEMENT
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [customers, setCustomers] = useState([
    {id: 1, name: "Juan Dela Cruz", address: "123 Main St, Davao City", email: "juan@example.com", contact: "0912-345-6789", type: "Walk-In", isEditing: false},
    {id: 2, name: "Maria Santos", address: "456 IT Park, Cebu City", email: "maria@example.com", contact: "0901-234-5678", type: "Contract", isEditing: false},
  ]);
  const [newCustomer, setNewCustomer] = useState({name: "", address: "", email: "", contact: "", type: "Walk-In"});
  
  const handleAddCustomer = () => {
    setCustomers([...customers, { id: customers.length + 1, ...newCustomer, isEditing: false }]);
    setNewCustomer({ name: "", address: "", email: "", contact: "", type: "Walk-In" });
  };
  
  const handleEditCustomer = (index) => {
    const updated = [...customers]; 
    updated[index].isEditing = !updated[index].isEditing; 
    setCustomers(updated);
  };
  
  const handleChangeCustomer = (index, field, value) => {
    const updated = [...customers]; 
    updated[index][field] = value; 
    setCustomers(updated);
  };
  
  const handleDeleteCustomer = (id) => {
    setCustomers(customers.filter((c) => c.id !== id));
  };

  // STATUS OPTIONS
  const statusOptions = [
    { label: "Walk-In", value: "Walk-In", colorClass: "bg-green-100 text-green-800" },
    { label: "Contract", value: "Contract", colorClass: "bg-yellow-200 text-yellow-800" },
  ];

  const replacementStatusOptions = [
    { label: "Completed", value: "Completed", colorClass: "bg-green-100 text-green-800" },
    { label: "Pending", value: "Pending", colorClass: "bg-amber-100 text-amber-800" },
    { label: "Processing", value: "Processing", colorClass: "bg-blue-100 text-blue-800" }
  ];

  const handleStatusChange = (orderId, newStatus) => {
    setReturnOrders((prev) => prev.map((order) => order.id === orderId ? { ...order, status: newStatus } : order));
  };

  // VIEW DETAILS MODAL
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [replacementDetails, setReplacementDetails] = useState({
    replacementId: "",
    replacementDate: "",
    replacementStatus: "Pending",
    isNewItem: false
  });
  const [refundDetails, setRefundDetails] = useState({
    refundId: "",
    refundDate: "",
    refundAmount: 0,
    refundMethod: "Cash"
  });
  const [selectedTab, setSelectedTab] = useState("replacement");

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    
    // Initialize replacement details
    setReplacementDetails({
      replacementId: order.replacementId || `#RP${(order.id + 1000).toString().padStart(3, '0')}`,
      replacementDate: order.replacementDate || new Date().toISOString().split('T')[0],
      replacementStatus: order.replacementStatus || "Pending",
      isNewItem: order.isNewItem || false
    });
    
    // Initialize refund details
    setRefundDetails({
      refundId: order.refundId || `#RF${(order.id + 1000).toString().padStart(3, '0')}`,
      refundDate: order.refundDate || new Date().toISOString().split('T')[0],
      refundAmount: order.refundAmount || 0,
      refundMethod: order.refundMethod || "Cash"
    });
    
    setShowDetailsModal(true);
  };

  const handleReplacementChange = (field, value) => {
    setReplacementDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRefundChange = (field, value) => {
    setRefundDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveDetails = () => {
    if (selectedOrder) {
      setReturnOrders(prev => prev.map(order => 
        order.id === selectedOrder.id 
          ? { 
              ...order, 
              ...replacementDetails,
              ...refundDetails
            } 
          : order
      ));
      setShowDetailsModal(false);
    }
  };

  // CREATE RETURN ORDER MODAL
  const [showCreateROModal, setShowCreateROModal] = useState(false);
  const [newReturnOrder, setNewReturnOrder] = useState({
    customer: "",
    date: new Date().toISOString().split('T')[0],
    status: "Walk-In",
    reason: "",
    products: []
  });
  const [newProduct, setNewProduct] = useState({
    model: "",
    category: "Laptops",
    serial: "",
    brand: "",
    reason: ""
  });

  const handleReturnOrderChange = (field, value) => {
    setNewReturnOrder({
      ...newReturnOrder,
      [field]: value
    });
  };

  const handleAddProduct = () => {
    if (newProduct.model && newProduct.serial) {
      setNewReturnOrder({
        ...newReturnOrder,
        products: [...newReturnOrder.products, { ...newProduct, id: Date.now() }]
      });
      setNewProduct({
        model: "",
        category: "Laptops",
        serial: "",
        brand: "",
        reason: ""
      });
    }
  };

  const handleRemoveProduct = (id) => {
    setNewReturnOrder({
      ...newReturnOrder,
      products: newReturnOrder.products.filter(product => product.id !== id)
    });
  };

  const handleCreateReturnOrder = () => {
    // In a real application, you would submit to your API here
    // The API would create entries in the Return table and potentially
    // in the Replacement or Refund tables based on the relationship
    
    // For now, we'll just close the modal and reset the form
    setShowCreateROModal(false);
    setNewReturnOrder({
      customer: "",
      date: new Date().toISOString().split('T')[0],
      status: "Walk-In",
      reason: "",
      products: []
    });
  };

  // LOAD DUMMY DATA
  useEffect(() => {
    // In a real application, you would fetch this data from your API
    // The API would join the Return table with Replacement and Refund tables
    
    setReturnOrders([...Array(6)].map((_, i) => ({
      id: i + 1,
      roNumber: `#RO${(i + 1).toString().padStart(3, '0')}`,
      customer: customers[i % customers.length].name,
      date: `2023-01-${(i + 1).toString().padStart(2, '0')}`,
      total: `₱${(10000 + i * 1000).toLocaleString()}.00`,
      status: i % 2 === 0 ? "Walk-In" : "Contract",
      employee: "admin@pgmicro.com",
      reason: i % 3 === 0 ? "Power failure, won't boot" : i % 3 === 1 ? "Display flickering" : "Keyboard not responding",
      
      // Replacement information (from Replacement table)
      replacementId: `#RP${(i + 1000).toString().padStart(3, '0')}`,
      replacementDate: `2023-01-${(i + 15).toString().padStart(2, '0')}`,
      replacementStatus: i % 3 === 0 ? "Completed" : i % 3 === 1 ? "Pending" : "Processing",
      isNewItem: i % 2 === 0,
      
      // Refund information (from Refund table)
      refundId: `#RF${(i + 1000).toString().padStart(3, '0')}`,
      refundDate: `2023-01-${(i + 10).toString().padStart(2, '0')}`,
      refundAmount: 5000 + (i * 500),
      refundMethod: i % 2 === 0 ? "Cash" : "Credit Card"
    })));
  }, []);

  const filteredOrders = returnOrders.filter((order) => {
    const matchesSearch = order.roNumber.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          order.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout>
      <div className="p-4 bg-white min-h-screen">
        <div className="sticky top-0 z-20 bg-white pb-4 border-b mb-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Return Management</h1>

          <div className="flex gap-4 justify-between items-center">
            <div className="flex gap-3">
              <select
                className={`px-4 py-2 border border-gray-300 rounded-md shadow-sm ${getBackgroundColor(statusFilter)}`}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Types</option>
                <option value="Walk-In">Walk-In</option>
                <option value="Contract">Contract</option>
              </select>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by RO ID, Customer, or Date"
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm w-[400px] focus:ring-indigo-500 focus:border-indigo-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-indigo-700 transition duration-150 ease-in-out"
                onClick={() => setShowCreateROModal(true)}
              >
                <Plus className="h-4 w-4 inline mr-1" /> Create RO
              </button>
            </div>
          </div>
        </div>

        {/* Return Orders Table */}
        <div className="overflow-hidden shadow-md rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Return ID</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Return Date</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Reason</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 pr-8">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">{order.roNumber}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{order.date}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <span className={`text-xs font-medium rounded-full px-3 py-1 inline-block ${getBackgroundColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {order.reason}
                  </td>
                  <td className="px-3 py-4 text-sm">
                    <button
                      onClick={() => handleViewDetails(order)}
                      className="text-indigo-600 hover:text-indigo-900 font-medium"
                    >
                      View details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* VIEW DETAILS MODAL */}
        {showDetailsModal && selectedOrder && (
          <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-[700px] max-h-[90vh] overflow-y-auto shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Return Details</h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="mb-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Return ID:</p>
                    <p className="text-base">{selectedOrder.roNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Return Date:</p>
                    <p className="text-base">{selectedOrder.date}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Status:</p>
                    <span className={`text-xs font-medium rounded-full px-3 py-1 inline-block ${getBackgroundColor(selectedOrder.status)}`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Reason:</p>
                    <p className="text-base">{selectedOrder.reason}</p>
                  </div>
                </div>
                
                {/* Tabs for Replacement and Refund */}
                <div className="border-b border-gray-200 mb-4">
                  <div className="flex">
                    <button
                      className={`py-2 px-4 font-medium text-sm border-b-2 ${
                        selectedTab === 'replacement' 
                          ? 'border-indigo-500 text-indigo-600' 
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                      onClick={() => setSelectedTab('replacement')}
                    >
                      Replacement
                    </button>
                    <button
                      className={`py-2 px-4 font-medium text-sm border-b-2 ${
                        selectedTab === 'refund' 
                          ? 'border-indigo-500 text-indigo-600' 
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                      onClick={() => setSelectedTab('refund')}
                    >
                      Refund
                    </button>
                  </div>
                </div>
                
                {/* Replacement Tab Content */}
                {selectedTab === 'replacement' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Replacement ID</label>
                      <input 
                        type="text" 
                        className="w-full border border-gray-300 p-2 rounded-md shadow-sm bg-gray-100"
                        value={replacementDetails.replacementId}
                        onChange={(e) => handleReplacementChange("replacementId", e.target.value)}
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Replacement Date</label>
                      <input 
                        type="date" 
                        className="w-full border border-gray-300 p-2 rounded-md shadow-sm"
                        value={replacementDetails.replacementDate}
                        onChange={(e) => handleReplacementChange("replacementDate", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select 
                        className={`w-full border border-gray-300 p-2 rounded-md shadow-sm ${
                          replacementDetails.replacementStatus === "Completed" ? "bg-green-100 text-green-800" : 
                          replacementDetails.replacementStatus === "Pending" ? "bg-amber-100 text-amber-800" : 
                          "bg-blue-100 text-blue-800"
                        }`}
                        value={replacementDetails.replacementStatus}
                        onChange={(e) => handleReplacementChange("replacementStatus", e.target.value)}
                      >
                        {replacementStatusOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">New Item</label>
                      <div className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          className="h-4 w-4 text-indigo-600 rounded border-gray-300"
                          checked={replacementDetails.isNewItem}
                          onChange={(e) => handleReplacementChange("isNewItem", e.target.checked)}
                        />
                        <span className="text-sm text-gray-700">Yes</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Refund Tab Content */}
                {selectedTab === 'refund' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Refund ID</label>
                      <input 
                        type="text" 
                        className="w-full border border-gray-300 p-2 rounded-md shadow-sm bg-gray-100"
                        value={refundDetails.refundId}
                        onChange={(e) => handleRefundChange("refundId", e.target.value)}
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Refund Date</label>
                      <input 
                        type="date" 
                        className="w-full border border-gray-300 p-2 rounded-md shadow-sm"
                        value={refundDetails.refundDate}
                        onChange={(e) => handleRefundChange("refundDate", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Refund Amount</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₱</span>
                        <input 
                          type="number" 
                          className="w-full border border-gray-300 p-2 pl-8 rounded-md shadow-sm"
                          value={refundDetails.refundAmount}
                          onChange={(e) => handleRefundChange("refundAmount", parseFloat(e.target.value))}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Refund Method</label>
                      <select 
                        className="w-full border border-gray-300 p-2 rounded-md shadow-sm"
                        value={refundDetails.refundMethod}
                        onChange={(e) => handleRefundChange("refundMethod", e.target.value)}
                      >
                        <option value="Cash">Cash</option>
                        <option value="Credit Card">Credit Card</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                        <option value="Check">Check</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 font-medium"
                  onClick={() => setShowDetailsModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 font-medium"
                  onClick={handleSaveDetails}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW CUSTOMER MODAL */}
        {showCustomerModal && (
          <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-20">
            <div className="bg-white p-6 rounded-lg shadow-lg h-[600px] w-[1200px] flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Customer List</h3>
                <button
                  onClick={() => setShowCustomerModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className={`overflow-x-auto flex-grow ${customers.length >= 4 ? "max-h-96 overflow-y-auto" : ""}`}>
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 w-[130px]">Customer ID</th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Name</th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Type</th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Address</th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Email</th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Contact Number</th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900" style={{ width: "150px" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {customers.map((customer, index) => (
                      <tr key={customer.id} className={`${customer.isEditing ? "bg-yellow-50" : ""}`}>
                        <td className="px-3 py-4 text-sm text-gray-900">{customer.id}</td>
                        <td className="px-3 py-4 text-sm">
                          <input
                            type="text"
                            className="p-1 w-full border border-gray-300 rounded-md"
                            value={customer.name}
                            onChange={(e) => handleChangeCustomer(index, "name", e.target.value)}
                            disabled={!customer.isEditing}
                          />
                        </td>
                        <td className="px-3 py-4 text-sm">
                          <select
                            value={customer.type}
                            onChange={(e) => handleChangeCustomer(index, "type", e.target.value)}
                            disabled={!customer.isEditing}
                            className={`border border-gray-300 rounded-md px-2 py-1 w-full ${getBackgroundColor(customer.type)}`}
                          >
                            {statusOptions.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-3 py-4 text-sm">
                          <input
                            type="text"
                            className="p-1 w-full border border-gray-300 rounded-md"
                            value={customer.address}
                            onChange={(e) => handleChangeCustomer(index, "address", e.target.value)}
                            disabled={!customer.isEditing}
                          />
                        </td>
                        <td className="px-3 py-4 text-sm">
                          <input
                            type="email"
                            className="p-1 w-full border border-gray-300 rounded-md"
                            value={customer.email}
                            onChange={(e) => handleChangeCustomer(index, "email", e.target.value)}
                            disabled={!customer.isEditing}
                          />
                        </td>
                        <td className="px-3 py-4 text-sm">
                          <input
                            type="text"
                            className="p-1 w-full border border-gray-300 rounded-md"
                            value={customer.contact}
                            onChange={(e) => handleChangeCustomer(index, "contact", e.target.value)}
                            disabled={!customer.isEditing}
                          />
                        </td>
                        <td className="px-3 py-4 text-sm flex gap-2 justify-center">
                          <button
                            className={`px-3 py-1 rounded-md text-white ${
                              customer.isEditing ? "bg-green-500 hover:bg-green-600" : "bg-indigo-500 hover:bg-indigo-600"
                            }`}
                            onClick={() => handleEditCustomer(index)}
                          >
                            {customer.isEditing ? "Save" : "Edit"}
                          </button>
                          <button
                            className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md text-white"
                            onClick={() => handleDeleteCustomer(customer.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Add Customer Form */}
              <div className="mt-4 border-t pt-4">
                <h3 className="text-lg font-bold text-gray-900 mb-3">New Customer</h3>
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="Customer Name" 
                    value={newCustomer.name} 
                    onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                    className="border p-2 rounded-md shadow-sm"
                  />
                  <select 
                    value={newCustomer.type} 
                    onChange={(e) => setNewCustomer({ ...newCustomer, type: e.target.value })}
                    className={`border p-2 rounded-md shadow-sm ${getBackgroundColor(newCustomer.type)}`}
                  >
                    {statusOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <input 
                    type="text" 
                    placeholder="Customer Address" 
                    value={newCustomer.address} 
                    onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                    className="border p-2 rounded-md shadow-sm"
                  />
                  <input 
                    type="email" 
                    placeholder="Customer Email" 
                    value={newCustomer.email} 
                    onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                    className="border p-2 rounded-md shadow-sm"
                  />
                  <input 
                    type="text" 
                    placeholder="Contact Number" 
                    value={newCustomer.contact} 
                    onChange={(e) => setNewCustomer({ ...newCustomer, contact: e.target.value })}
                    className="border p-2 rounded-md shadow-sm"
                  />
                  <div className="flex gap-3">
                    <button 
                      className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 flex-1"
                      onClick={handleAddCustomer}
                    >
                      Add Customer
                    </button>
                    <button 
                      className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 flex-1"
                      onClick={() => setShowCustomerModal(false)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* CREATE RO MODAL */}
        {showCreateROModal && (
          <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-[900px] max-h-[90vh] overflow-y-auto shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Create Return Order</h2>
                <button
                  onClick={() => setShowCreateROModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
  
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200">Return Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Return Order ID</label>
                    <input 
                      className="w-full border border-gray-300 p-2 rounded-md shadow-sm bg-gray-100" 
                      placeholder="Auto-generated" 
                      disabled 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                    <div className="flex">
                      <select 
                        className="w-full border border-gray-300 p-2 rounded-l-md shadow-sm"
                        value={newReturnOrder.customer}
                        onChange={(e) => handleReturnOrderChange("customer", e.target.value)}
                      >
                        <option value="">Select a customer</option>
                        {customers.map(customer => (
                          <option key={customer.id} value={customer.id}>{customer.name}</option>
                        ))}
                      </select>
                      <button
                        className="bg-gray-200 text-gray-700 px-3 py-2 rounded-r-md hover:bg-gray-300"
                        onClick={() => setShowCustomerModal(true)}
                      >
                        <Plus className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Return Date</label>
                    <input 
                      type="date" 
                      className="w-full border border-gray-300 p-2 rounded-md shadow-sm"
                      value={newReturnOrder.date}
                      onChange={(e) => handleReturnOrderChange("date", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select 
                      className={`w-full border border-gray-300 p-2 rounded-md shadow-sm ${getBackgroundColor(newReturnOrder.status)}`}
                      value={newReturnOrder.status}
                      onChange={(e) => handleReturnOrderChange("status", e.target.value)}
                    >
                      {statusOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Return</label>
                    <input 
                      type="text" 
                      className="w-full border border-gray-300 p-2 rounded-md shadow-sm"
                      placeholder="Enter general reason for return"
                      value={newReturnOrder.reason}
                      onChange={(e) => handleReturnOrderChange("reason", e.target.value)}
                    />
                  </div>
                </div>
              </div>
  
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200">Product Information</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                    <input 
                      type="text" 
                      className="w-full border border-gray-300 p-2 rounded-md shadow-sm"
                      placeholder="Enter model name"
                      value={newProduct.model}
                      onChange={(e) => setNewProduct({...newProduct, model: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select 
                      className="w-full border border-gray-300 p-2 rounded-md shadow-sm"
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    >
                      {allCategories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Serial Number</label>
                    <input 
                      type="text" 
                      className="w-full border border-gray-300 p-2 rounded-md shadow-sm"
                      placeholder="Enter serial number"
                      value={newProduct.serial}
                      onChange={(e) => setNewProduct({...newProduct, serial: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                    <input 
                      type="text" 
                      className="w-full border border-gray-300 p-2 rounded-md shadow-sm"
                      placeholder="Enter brand name"
                      value={newProduct.brand}
                      onChange={(e) => setNewProduct({...newProduct, brand: e.target.value})}
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Issue Description</label>
                    <textarea 
                      className="w-full border border-gray-300 p-2 rounded-md shadow-sm"
                      placeholder="Describe the specific issue with this product"
                      rows={3}
                      value={newProduct.reason}
                      onChange={(e) => setNewProduct({...newProduct, reason: e.target.value})}
                    ></textarea>
                  </div>
                  <div className="col-span-2">
                    <button 
                      className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                      onClick={handleAddProduct}
                    >
                      Add Product
                    </button>
                  </div>
                </div>
  
                <div className="border border-gray-200 rounded-md overflow-hidden mb-4">
                  <div className="max-h-[200px] overflow-y-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Model</th>
                          <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Brand</th>
                          <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Category</th>
                          <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Serial</th>
                          <th className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {newReturnOrder.products.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="px-3 py-4 text-sm text-gray-500 text-center">
                              No products added yet
                            </td>
                          </tr>
                        ) : (
                          newReturnOrder.products.map(product => (
                            <tr key={product.id}>
                              <td className="px-3 py-4 text-sm text-gray-900">{product.model}</td>
                              <td className="px-3 py-4 text-sm text-gray-500">{product.brand}</td>
                              <td className="px-3 py-4 text-sm text-gray-500">{product.category}</td>
                              <td className="px-3 py-4 text-sm text-gray-500">{product.serial}</td>
                              <td className="px-3 py-4 text-sm text-center">
                                <button 
                                  className="text-red-600 hover:text-red-900"
                                  onClick={() => handleRemoveProduct(product.id)}
                                >
                                  <Trash2 className="h-5 w-5 inline" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
  
              {/* Action Tabs for Replacement/Refund */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200">Return Process</h3>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="mb-4">
                    <div className="flex items-center mb-2">
                      <input 
                        type="radio" 
                        id="process-replacement" 
                        name="process-type" 
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                        checked={newReturnOrder.processType === "replacement"} 
                        onChange={() => handleReturnOrderChange("processType", "replacement")}
                      />
                      <label htmlFor="process-replacement" className="ml-2 text-sm font-medium text-gray-700">
                        Process as Replacement
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input 
                        type="radio" 
                        id="process-refund" 
                        name="process-type" 
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                        checked={newReturnOrder.processType === "refund"} 
                        onChange={() => handleReturnOrderChange("processType", "refund")}
                      />
                      <label htmlFor="process-refund" className="ml-2 text-sm font-medium text-gray-700">
                        Process as Refund
                      </label>
                    </div>
                  </div>

                  {/* Conditional fields based on process type */}
                  {newReturnOrder.processType === "replacement" && (
                    <div className="p-3 bg-gray-50 rounded-md">
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Replacement Status</label>
                        <select 
                          className={`w-full border border-gray-300 p-2 rounded-md shadow-sm ${
                            newReturnOrder.replacementStatus === "Completed" ? "bg-green-100 text-green-800" : 
                            newReturnOrder.replacementStatus === "Pending" ? "bg-amber-100 text-amber-800" : 
                            "bg-blue-100 text-blue-800"
                          }`}
                          value={newReturnOrder.replacementStatus || "Pending"}
                          onChange={(e) => handleReturnOrderChange("replacementStatus", e.target.value)}
                        >
                          {replacementStatusOptions.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Item</label>
                        <div className="flex items-center gap-2">
                          <input 
                            type="checkbox" 
                            className="h-4 w-4 text-indigo-600 rounded border-gray-300"
                            checked={newReturnOrder.isNewItem || false}
                            onChange={(e) => handleReturnOrderChange("isNewItem", e.target.checked)}
                          />
                          <span className="text-sm text-gray-700">Yes</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {newReturnOrder.processType === "refund" && (
                    <div className="p-3 bg-gray-50 rounded-md">
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Refund Amount</label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₱</span>
                          <input 
                            type="number" 
                            className="w-full border border-gray-300 p-2 pl-8 rounded-md shadow-sm"
                            value={newReturnOrder.refundAmount || ""}
                            onChange={(e) => handleReturnOrderChange("refundAmount", e.target.value)}
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Refund Method</label>
                        <select 
                          className="w-full border border-gray-300 p-2 rounded-md shadow-sm"
                          value={newReturnOrder.refundMethod || "Cash"}
                          onChange={(e) => handleReturnOrderChange("refundMethod", e.target.value)}
                        >
                          <option value="Cash">Cash</option>
                          <option value="Credit Card">Credit Card</option>
                          <option value="Bank Transfer">Bank Transfer</option>
                          <option value="Check">Check</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </div>
  
              <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
                <button 
                  className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 font-medium"
                  onClick={() => setShowCreateROModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 font-medium"
                  onClick={handleCreateReturnOrder}
                >
                  Process Return
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ReturnWarrantyPage;