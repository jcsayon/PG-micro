import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Search, X, Trash2, ChevronLeft, ChevronRight, Plus, RefreshCw } from "lucide-react";

/**
 * Helper function to get the background color for status badges
 * This function returns the appropriate Tailwind CSS classes based on the status value
 */
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

// List of all product categories available in the system
const allCategories = [
  'Processor', 'Motherboards', 'Video Cards', 'Monitors', 'Laptops', 
  'Printers', 'Toners', 'Inks', 'Networking', 'DSLR Camera',
  'CCTV Camera', 'Keyboard & Mouse', 'Webcam', 'Power Supply', 'Thin Client'
];

/**
 * Main component for the Return Warranty page
 */
const ReturnWarrantyPage = () => {
  // Navigation hook to programmatically navigate between pages
  const navigate = useNavigate();
  
  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  
  // Return orders list state
  const [returnOrders, setReturnOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(false);
  
  // Customer management state
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [customers, setCustomers] = useState([]);

  // Sales Orders list modal state
  const [showSalesOrdersModal, setShowSalesOrdersModal] = useState(false);
  const [salesOrders, setSalesOrders] = useState([]);
  const [salesOrdersSearchTerm, setSalesOrdersSearchTerm] = useState("");
  const [salesOrdersFilterType, setSalesOrdersFilterType] = useState("All");
  const [selectedSalesOrder, setSelectedSalesOrder] = useState(null);

  // Add these with your other state declarations
  const [salesOrderSearchTerm, setSalesOrderSearchTerm] = useState("");
  const [filteredSalesOrderOptions, setFilteredSalesOrderOptions] = useState([]);
  const [showSalesOrderSearchResults, setShowSalesOrderSearchResults] = useState(false);

  // View details modal state
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

  // Create Return Order modal state
  const [showCreateROModal, setShowCreateROModal] = useState(false);
  const [newReturnOrder, setNewReturnOrder] = useState({
    customer: "",
    date: new Date().toISOString().split('T')[0],
    status: "Walk-In",
    reason: "",
    products: [],
    salesOrderId: "", // Added field to store the related sales order ID
    processType: "replacement"
  });
  const [newProduct, setNewProduct] = useState({
    model: "",
    category: "Laptops",
    serial: "",
    brand: "",
    reason: ""
  });

  // ==========================================
  // STATUS OPTIONS (For dropdown menus)
  // ==========================================
  
  // Options for customer type
  const statusOptions = [
    { label: "Walk-In", value: "Walk-In", colorClass: "bg-green-100 text-green-800" },
    { label: "Contract", value: "Contract", colorClass: "bg-yellow-200 text-yellow-800" },
  ];

  // Options for replacement status
  const replacementStatusOptions = [
    { label: "Completed", value: "Completed", colorClass: "bg-green-100 text-green-800" },
    { label: "Pending", value: "Pending", colorClass: "bg-amber-100 text-amber-800" },
    { label: "Processing", value: "Processing", colorClass: "bg-blue-100 text-blue-800" }
  ];

  // ==========================================
  // DATA LOADING FUNCTIONS (useEffect hooks)
  // ==========================================
  
  // Load customers from localStorage when component mounts
  useEffect(() => {
    loadCustomers();
  }, []);

  // Load sales orders from localStorage when component mounts
  useEffect(() => {
    loadSalesOrders();
  }, []);

  // Load dummy return orders if none exist
  useEffect(() => {
    // Wait for customers to be loaded before creating dummy return orders
    if (returnOrders.length === 0 && customers.length > 0) {
      loadDummyReturnOrders();
    }
  }, [customers]);

  useEffect(() => {
    if (salesOrderSearchTerm.trim() === "") {
      setFilteredSalesOrderOptions([]);
      return;
    }
    
    const lowercaseSearch = salesOrderSearchTerm.toLowerCase();
    const filtered = salesOrders.filter(order => 
      order.id.toLowerCase().includes(lowercaseSearch) || 
      order.customer.toLowerCase().includes(lowercaseSearch) ||
      (order.dateSold && order.dateSold.includes(lowercaseSearch))
    );
    
    setFilteredSalesOrderOptions(filtered);
  }, [salesOrderSearchTerm, salesOrders]);
  
  // Add this useEffect to handle clicking outside of search results
  useEffect(() => {
    function handleClickOutside(event) {
      if (showSalesOrderSearchResults && !event.target.closest('.sales-order-search-container')) {
        setShowSalesOrderSearchResults(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSalesOrderSearchResults]);

  // ==========================================
  // DATA LOADING HELPER FUNCTIONS
  // ==========================================

  const loadCustomers = () => {
    const savedCustomers = localStorage.getItem('customersData');
    if (savedCustomers) {
      try {
        const parsedCustomers = JSON.parse(savedCustomers);
        setCustomers(parsedCustomers);
      } catch (error) {
        console.error("Error parsing customers from localStorage:", error);
        // Set default customers if parsing fails
        setCustomers([
          {id: 1, name: "Juan Dela Cruz", address: "123 Main St, Davao City", email: "juan@example.com", contact: "0912-345-6789", type: "Walk-In", isEditing: false},
          {id: 2, name: "Maria Santos", address: "456 IT Park, Cebu City", email: "maria@example.com", contact: "0901-234-5678", type: "Contract", isEditing: false},
        ]);
      }
    } else {
      // If no customers in localStorage, set default customers
      setCustomers([
        {id: 1, name: "Juan Dela Cruz", address: "123 Main St, Davao City", email: "juan@example.com", contact: "0912-345-6789", type: "Walk-In", isEditing: false},
        {id: 2, name: "Maria Santos", address: "456 IT Park, Cebu City", email: "maria@example.com", contact: "0901-234-5678", type: "Contract", isEditing: false},
      ]);
    }
  };

  /**
   * Load sales orders from localStorage
   */
  const loadSalesOrders = () => {
    setIsLoading(true);
    
    // Try to load from localStorage
    const savedOrders = localStorage.getItem('salesOrdersData');
    
    if (savedOrders) {
      try {
        const parsedOrders = JSON.parse(savedOrders);
        setSalesOrders(parsedOrders);
      } catch (error) {
        console.error("Error parsing sales orders:", error);
        // Set some mock data if parsing fails
        setSalesOrders([
          { id: "#SO1001", employee: "sales@pgmicro.com", dateSold: "2023-01-01", customer: "Juan Dela Cruz", type: "Walk-In", total: 10000.00 },
          { id: "#SO1002", employee: "sales@pgmicro.com", dateSold: "2023-01-02", customer: "Maria Santos", type: "Contract", total: 11000.00 }
        ]);
      }
    } else {
      // If no sales orders in localStorage, set some mock data
      setSalesOrders([
        { id: "#SO1001", employee: "sales@pgmicro.com", dateSold: "2023-01-01", customer: "Juan Dela Cruz", type: "Walk-In", total: 10000.00 },
        { id: "#SO1002", employee: "sales@pgmicro.com", dateSold: "2023-01-02", customer: "Maria Santos", type: "Contract", total: 11000.00 }
      ]);
    }
    
    setIsLoading(false);
  };

  /**
   * Load dummy return orders for demonstration
   */
  const loadDummyReturnOrders = () => {
    setReturnOrders([...Array(6)].map((_, i) => ({
      id: i + 1,
      roNumber: `#RO${(i + 1).toString().padStart(3, '0')}`,
      customer: customers.length > 0 ? customers[i % customers.length]?.name || "Unknown Customer" : "Unknown Customer",
      date: `2023-01-${(i + 1).toString().padStart(2, '0')}`,
      total: `₱${(10000 + i * 1000).toLocaleString()}.00`,
      status: i % 2 === 0 ? "Walk-In" : "Contract",
      employee: "admin@pgmicro.com",
      reason: i % 3 === 0 ? "Power failure, won't boot" : i % 3 === 1 ? "Display flickering" : "Keyboard not responding",
      salesOrderId: `#SO${1001 + i}`, // Link to sales order
      
      // Replacement information
      replacementId: `#RP${(i + 1000).toString().padStart(3, '0')}`,
      replacementDate: `2023-01-${(i + 15).toString().padStart(2, '0')}`,
      replacementStatus: i % 3 === 0 ? "Completed" : i % 3 === 1 ? "Pending" : "Processing",
      isNewItem: i % 2 === 0,
      
      // Refund information
      refundId: `#RF${(i + 1000).toString().padStart(3, '0')}`,
      refundDate: `2023-01-${(i + 10).toString().padStart(2, '0')}`,
      refundAmount: 5000 + (i * 500),
      refundMethod: i % 2 === 0 ? "Cash" : "Credit Card"
    })));
  };

  // ==========================================
  // EVENT HANDLERS
  // ==========================================

  const handleStatusChange = (orderId, newStatus) => {
    setReturnOrders((prev) => prev.map((order) => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

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

  const handleReturnOrderChange = (field, value) => {
    setNewReturnOrder({
      ...newReturnOrder,
      [field]: value
    });
  };

  const handleAddProduct = () => {
    // Only add if model and serial are provided
    if (newProduct.model && newProduct.serial) {
      setNewReturnOrder({
        ...newReturnOrder,
        products: [...newReturnOrder.products, { ...newProduct, id: Date.now() }]
      });
      // Reset product form
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
  
  const formatPrice = (price) => {
    if (!price) return "0.00";
    
    // Remove any existing formatting (currency symbols and commas)
    const numericPrice = String(price).replace(/[₱±,]/g, '');
    
    return parseFloat(numericPrice).toLocaleString('en-PH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

    const handleSelectSalesOrderFromSearch = (salesOrder) => {
      handleSelectSalesOrder(salesOrder);
      setSalesOrderSearchTerm(salesOrder.id); // Set the search input to the selected order ID
      setShowSalesOrderSearchResults(false); // Hide the search results
    };
    
    const handleSelectSalesOrder = (salesOrder) => {
      setSelectedSalesOrder(salesOrder);
    // Find the customer details
    const customer = customers.find(c => c.name === salesOrder.customer);
    
    // Update the return order with information from the sales order
    setNewReturnOrder({
      ...newReturnOrder,
      customer: customer ? customer.id.toString() : "",
      status: salesOrder.type,
      salesOrderId: salesOrder.id,
      // If the sales order has items, populate the products
      products: salesOrder.items ? salesOrder.items.map(item => ({
        id: Date.now() + Math.random(),
        model: item.model || "",
        category: item.category || "Laptops",
        serial: item.serialNumber || "",
        brand: item.brand || "",
        reason: ""
      })) : []
    });
    
    setShowSalesOrdersModal(false);
  };

  const handleCreateReturnOrder = () => {
    // Generate a new return order ID
    const newROId = `#RO${(returnOrders.length + 1).toString().padStart(3, '0')}`;
    
    // Find customer name from ID
    const customer = customers.find(c => c.id.toString() === newReturnOrder.customer);
    
    // Create new return order
    const newRO = {
      id: returnOrders.length + 1,
      roNumber: newROId,
      customer: customer ? customer.name : "Unknown Customer",
      date: newReturnOrder.date,
      status: newReturnOrder.status,
      employee: "admin@pgmicro.com",
      reason: newReturnOrder.reason,
      salesOrderId: newReturnOrder.salesOrderId,
      
      // Set replacement or refund details based on processType
      ...(newReturnOrder.processType === "replacement" ? {
        replacementId: `#RP${(returnOrders.length + 1000).toString().padStart(3, '0')}`,
        replacementDate: new Date().toISOString().split('T')[0],
        replacementStatus: newReturnOrder.replacementStatus || "Pending",
        isNewItem: newReturnOrder.isNewItem || false
      } : {
        refundId: `#RF${(returnOrders.length + 1000).toString().padStart(3, '0')}`,
        refundDate: new Date().toISOString().split('T')[0],
        refundAmount: newReturnOrder.refundAmount || 0,
        refundMethod: newReturnOrder.refundMethod || "Cash"
      }),
      
      // Store products for reference
      products: newReturnOrder.products
    };
    
    // Add the new return order to the list
    setReturnOrders([...returnOrders, newRO]);
    
    // Reset form and close modal
    setShowCreateROModal(false);
    setNewReturnOrder({
      customer: "",
      date: new Date().toISOString().split('T')[0],
      status: "Walk-In",
      reason: "",
      products: [],
      salesOrderId: "",
      processType: "replacement"
    });
    setSelectedSalesOrder(null);
  };

  /**
   * Handle refreshing the data
   */
  const handleRefreshData = () => {
    setIsLoading(true);
    loadSalesOrders();
    loadCustomers();
    setTimeout(() => setIsLoading(false), 500); // Add a small delay for UX
  };

  // ==========================================
  // DATA FILTERING
  // ==========================================
  
  // Filter return orders based on search and status
  const filteredOrders = returnOrders.filter((order) => {
    const matchesSearch = order.roNumber.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          order.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filter sales orders for the modal
  const filteredSalesOrders = salesOrders.filter(order => {
    const matchesType = salesOrdersFilterType === "All" || order.type === salesOrdersFilterType;
    const matchesSearch = salesOrdersSearchTerm === "" || 
                         order.id.toLowerCase().includes(salesOrdersSearchTerm.toLowerCase()) ||
                         order.customer.toLowerCase().includes(salesOrdersSearchTerm.toLowerCase()) ||
                         order.dateSold.includes(salesOrdersSearchTerm);
    return matchesType && matchesSearch;
  });

  return (
    <DashboardLayout>
      <div className="p-4 bg-white min-h-screen">
        {/* Header section with filters and actions */}
        <div className="sticky top-0 z-20 bg-white pb-4 border-b mb-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Return Management</h1>

          <div className="flex gap-4 justify-between items-center">
            <div className="flex gap-3">
              {/* Status filter dropdown */}
              <select
                className={`px-4 py-2 border border-gray-300 rounded-md shadow-sm ${getBackgroundColor(statusFilter)}`}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Types</option>
                <option value="Walk-In">Walk-In</option>
                <option value="Contract">Contract</option>
              </select>
              
              {/* Search bar */}
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
            
            {/* Action buttons */}
            <div className="flex gap-3">
              {/* Refresh data button */}
              <button
                className="bg-purple-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-purple-700 flex items-center"
                onClick={handleRefreshData}
                disabled={isLoading}
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                {isLoading ? "Loading..." : "Refresh Data"}
              </button>
              
              {/* Create return order button */}
              <button
                className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-indigo-700 transition duration-150 ease-in-out flex items-center"
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
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Sales Order</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Return Date</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Reason</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 pr-8">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-3 py-4 text-sm text-gray-500 text-center">
                    No return orders found
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">{order.roNumber}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-indigo-600">{order.salesOrderId || "N/A"}</td>
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
                ))
              )}
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
                    <p className="text-sm font-semibold text-gray-700">Sales Order:</p>
                    <p className="text-base text-indigo-600">{selectedOrder.salesOrderId || "N/A"}</p>
                  </div>
                  <div className="col-span-2">
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

        {/* SALES ORDERS SELECTION MODAL */}
        {showSalesOrdersModal && (
          <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-[900px] max-h-[90vh] overflow-y-auto shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Select Sales Order</h2>
                <button
                  onClick={() => setShowSalesOrdersModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Filter controls */}
              <div className="flex gap-3 mb-4">
                <select
                  className={`px-4 py-2 border border-gray-300 rounded-md shadow-sm ${getBackgroundColor(salesOrdersFilterType)}`}
                  value={salesOrdersFilterType}
                  onChange={(e) => setSalesOrdersFilterType(e.target.value)}
                >
                  <option value="All">All Types</option>
                  <option value="Walk-In">Walk-In</option>
                  <option value="Contract">Contract</option>
                </select>
                <div className="relative flex-grow">
                  <input
                    type="text"
                    placeholder="Search by SO ID, Customer, or Date"
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm w-full"
                    value={salesOrdersSearchTerm}
                    onChange={(e) => setSalesOrdersSearchTerm(e.target.value)}
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              {/* Sales orders table */}
              <div className="border rounded-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Order ID</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Customer</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Type</th>
                      <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Total</th>
                      <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredSalesOrders.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-3 py-4 text-sm text-gray-500 text-center">
                          No sales orders found
                        </td>
                      </tr>
                    ) : (
                      filteredSalesOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-indigo-600">{order.id}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{order.dateSold}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{order.customer}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm">
                            <span className={`text-xs font-medium rounded-full px-3 py-1 inline-block ${getBackgroundColor(order.type)}`}>
                              {order.type}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 text-right">₱{formatPrice(order.total)}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-center">
                            <button
                              onClick={() => handleSelectSalesOrder(order)}
                              className="bg-indigo-600 text-white px-3 py-1 rounded-md hover:bg-indigo-700"
                            >
                              Select
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end mt-4">
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 font-medium"
                  onClick={() => setShowSalesOrdersModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* CREATE RO MODAL */}
        {showCreateROModal && (
          <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-[900px] max-h-[90vh] shadow-xl flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Create Return Order</h2>
                <button
                  onClick={() => setShowCreateROModal(false)}
                  className="text-white hover:text-black"
                >
                  <X className="h-6 w-6 bg-red-500 rounded" />
                </button>
              </div>
              <div className="overflow-auto flex-1">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200">Return Information</h3>
                  
                {/* Sales Order Reference - Search Bar */}
                  <div className="mb-4 sales-order-search-container">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sales Order Reference</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        className="w-full border border-gray-300 p-2 pl-10 rounded-md shadow-sm"
                        placeholder="Search by Sales Order ID or Customer"
                        value={salesOrderSearchTerm}
                        onChange={(e) => {
                          setSalesOrderSearchTerm(e.target.value);
                          setShowSalesOrderSearchResults(true);
                        }}
                        onFocus={() => setShowSalesOrderSearchResults(true)}
                      />
                      {/* Search icon */}
                      <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      
                      {/* Search results dropdown */}
                      {showSalesOrderSearchResults && filteredSalesOrderOptions.length > 0 && (
                        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm border border-gray-200">
                          {filteredSalesOrderOptions.map(order => (
                            <div
                              key={order.id}
                              className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100"
                              onClick={() => handleSelectSalesOrderFromSearch(order)}
                            >
                              <div className="flex items-center">
                                <span className="text-indigo-600 font-medium block truncate mr-2">
                                  {order.id}
                                </span>
                                <span className="text-gray-600 block truncate">
                                  {order.customer} - ₱{formatPrice(order.total)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {newReturnOrder.salesOrderId && (
                      <p className="text-sm text-indigo-600 mt-1">
                        Selected: {newReturnOrder.salesOrderId}
                      </p>
                    )}
                    <p className="text-sm text-gray-500 mt-1">
                      Search for a sales order to auto-fill product and customer information
                    </p>
                  </div>

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
                      <select 
                        className="w-full border border-gray-300 p-2 rounded-md shadow-sm"
                        value={newReturnOrder.customer}
                        onChange={(e) => handleReturnOrderChange("customer", e.target.value)}
                      >
                        <option value="">Select a customer</option>
                        {customers.map(customer => (
                          <option key={customer.id} value={customer.id}>{customer.name}</option>
                        ))}
                      </select>
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
                  
                  {/* Product form */}
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
                        disabled={!newProduct.model || !newProduct.serial}
                      >
                        Add Product
                      </button>
                    </div>
                  </div>
    
                  {/* Products table */}
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
                
                {/* Action buttons */}
                <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
                  <button 
                    className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 font-medium"
                    onClick={handleCreateReturnOrder}
                    disabled={!newReturnOrder.customer || newReturnOrder.products.length === 0}>
                    Process Return
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ReturnWarrantyPage;