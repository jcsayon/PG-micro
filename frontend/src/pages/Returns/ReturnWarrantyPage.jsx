import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Search, X, Trash2, Plus, RefreshCw, Eye, Tag } from "lucide-react"; // Added Tag for RO ID

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
  const [selectedSalesOrderForRO, setSelectedSalesOrderForRO] = useState(null);

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
  const initialNewReturnOrderState = {
    customer: "",
    date: new Date().toISOString().split('T')[0],
    status: "Walk-In",
    reason: "", // Overall reason for the RO
    salesOrderId: "",
    // processType: "replacement", // Removed: Now per item
  };
  const [newReturnOrder, setNewReturnOrder] = useState(initialNewReturnOrderState);


  // New state for item management in Create RO Modal
  const [salesOrderItems, setSalesOrderItems] = useState([]); // Items from selected SO
  const [returnOrderItems, setReturnOrderItems] = useState([]); // Items to be returned (now includes itemProcessType)

  // State for the reason/image modal
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [currentItemForReason, setCurrentItemForReason] = useState(null);
  const [reasonInput, setReasonInput] = useState("");
  const [uploadedImages, setUploadedImages] = useState([]); // Array of File objects
  const [isViewingReason, setIsViewingReason] = useState(false);

  const [nextROId, setNextROId] = useState("");


  // ==========================================
  // STATUS OPTIONS (For dropdown menus)
  // ==========================================

  const statusOptions = [
    { label: "Walk-In", value: "Walk-In", colorClass: "bg-green-100 text-green-800" },
    { label: "Contract", value: "Contract", colorClass: "bg-yellow-200 text-yellow-800" },
  ];

  const replacementStatusOptions = [
    { label: "Completed", value: "Completed", colorClass: "bg-green-100 text-green-800" },
    { label: "Pending", value: "Pending", colorClass: "bg-amber-100 text-amber-800" },
    { label: "Processing", value: "Processing", colorClass: "bg-blue-100 text-blue-800" }
  ];

  const itemProcessTypes = ["Replacement", "Refund"];


  // ==========================================
  // DATA LOADING FUNCTIONS (useEffect hooks)
  // ==========================================

  useEffect(() => { loadCustomers(); }, []);
  useEffect(() => { loadSalesOrders(); }, []);
  useEffect(() => {
    if (customers.length > 0) { // Ensure customers are loaded before dummy ROs
        loadDummyReturnOrders();
    }
  }, [customers]);

  useEffect(() => {
    if (salesOrderSearchTerm.trim() === "" && !newReturnOrder.salesOrderId) { // Clear options if search is empty AND no SO is selected
      setFilteredSalesOrderOptions([]);
      return;
    }
    if (newReturnOrder.salesOrderId) { // If an SO is selected, don't show search results
        setShowSalesOrderSearchResults(false);
        return;
    }
    const lowercaseSearch = salesOrderSearchTerm.toLowerCase();
    const filtered = salesOrders.filter(order =>
      order.id.toLowerCase().includes(lowercaseSearch) ||
      order.customer.toLowerCase().includes(lowercaseSearch) ||
      (order.dateSold && order.dateSold.includes(lowercaseSearch))
    );
    setFilteredSalesOrderOptions(filtered);
  }, [salesOrderSearchTerm, salesOrders, newReturnOrder.salesOrderId]);


  useEffect(() => {
    function handleClickOutside(event) {
      if (showSalesOrderSearchResults && !event.target.closest('.sales-order-search-container')) {
        setShowSalesOrderSearchResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSalesOrderSearchResults]);

  useEffect(() => {
    setNextROId(`#RO${(returnOrders.length + 1).toString().padStart(3, '0')}`);
  }, [returnOrders.length, showCreateROModal]); // Update when ROs change or modal opens


  // ==========================================
  // DATA LOADING HELPER FUNCTIONS
  // ==========================================

  const loadCustomers = () => {
    const savedCustomers = localStorage.getItem('customersData');
    const defaultCustomers = [
      {id: 1, name: "Juan Dela Cruz", address: "123 Main St, Davao City", email: "juan@example.com", contact: "0912-345-6789", type: "Walk-In", isEditing: false},
      {id: 2, name: "Maria Santos", address: "456 IT Park, Cebu City", email: "maria@example.com", contact: "0901-234-5678", type: "Contract", isEditing: false},
    ];
    if (savedCustomers) {
      try {
        const parsedCustomers = JSON.parse(savedCustomers);
        setCustomers(parsedCustomers.length > 0 ? parsedCustomers : defaultCustomers);
      } catch (error) {
        console.error("Error parsing customers from localStorage:", error);
        setCustomers(defaultCustomers);
      }
    } else {
      setCustomers(defaultCustomers);
    }
  };

  const loadSalesOrders = () => {
    setIsLoading(true);
    const savedOrders = localStorage.getItem('salesOrdersData');
    const mockSalesOrders = [
      { id: "#SO1001", employee: "sales@pgmicro.com", dateSold: "2023-01-01", customer: "Juan Dela Cruz", type: "Walk-In", total: 10000.00, items: [{id: "ITEM001", model: "Laptop X1", brand: "BrandA", category: "Laptops", serialNumber: "SN001", price: 8000}, {id: "ITEM002", model: "Mouse M1", brand: "BrandB", category: "Keyboard & Mouse", serialNumber: "SN002", price: 2000}] },
      { id: "#SO1002", employee: "sales@pgmicro.com", dateSold: "2023-01-02", customer: "Maria Santos", type: "Contract", total: 11000.00, items: [{id: "ITEM003", model: "Monitor Z1", brand: "BrandC", category: "Monitors", serialNumber: "SN003", price: 11000}] }
    ];
    if (savedOrders) {
      try {
        const parsedOrders = JSON.parse(savedOrders);
        setSalesOrders(parsedOrders.length > 0 ? parsedOrders : mockSalesOrders);
      } catch (error) {
        console.error("Error parsing sales orders:", error);
        setSalesOrders(mockSalesOrders);
      }
    } else {
      setSalesOrders(mockSalesOrders);
    }
    setIsLoading(false);
  };

  const loadDummyReturnOrders = () => {
    if (returnOrders.length > 0 && customers.length === 0) return; // Prevent re-init if already populated or no customers

    const dummyData = [...Array(6)].map((_, i) => {
        const customerName = customers[i % customers.length]?.name || "Unknown Customer";
        const salesOrderId = `#SO${1001 + i}`;
        // Find the SO to get items for this dummy RO
        const relatedSO = salesOrders.find(so => so.id === salesOrderId);
        let dummyReturnedItems = [];
        if (relatedSO && relatedSO.items && relatedSO.items.length > 0) {
            dummyReturnedItems = [relatedSO.items[0]].map(item => ({ // Take first item for simplicity
                model: item.model,
                brand: item.brand,
                category: item.category,
                serialNumber: item.serialNumber,
                reason: "Dummy item reason",
                images: [],
                itemProcessType: i % 2 === 0 ? "Replacement" : "Refund" // Alternate process type
            }));
        }


        return {
            id: i + 1,
            roNumber: `#RO${(i + 1).toString().padStart(3, '0')}`,
            customer: customerName,
            date: `2023-01-${(i + 1).toString().padStart(2, '0')}`,
            status: i % 2 === 0 ? "Walk-In" : "Contract",
            employee: "admin@pgmicro.com",
            reason: i % 3 === 0 ? "Power failure, won't boot" : i % 3 === 1 ? "Display flickering" : "Keyboard not responding",
            salesOrderId: salesOrderId,
            returnedItems: dummyReturnedItems,
            // These top-level replacement/refund details might be less relevant if processing is per-item
            // For now, keeping for consistency with existing view details modal, but consider removing/refactoring
            replacementId: dummyReturnedItems.some(item => item.itemProcessType === "Replacement") ? `#RP${(i + 1000).toString().padStart(3, '0')}` : null,
            replacementDate: dummyReturnedItems.some(item => item.itemProcessType === "Replacement") ? `2023-01-${(i + 15).toString().padStart(2, '0')}` : null,
            replacementStatus: dummyReturnedItems.some(item => item.itemProcessType === "Replacement") ? (i % 3 === 0 ? "Completed" : i % 3 === 1 ? "Pending" : "Processing") : null,
            isNewItem: dummyReturnedItems.some(item => item.itemProcessType === "Replacement") ? (i % 2 === 0) : false,
            refundId: dummyReturnedItems.some(item => item.itemProcessType === "Refund") ? `#RF${(i + 1000).toString().padStart(3, '0')}` : null,
            refundDate: dummyReturnedItems.some(item => item.itemProcessType === "Refund") ? `2023-01-${(i + 10).toString().padStart(2, '0')}` : null,
            refundAmount: dummyReturnedItems.filter(item => item.itemProcessType === "Refund").reduce((sum, item) => sum + (item.price || 5000 + (i * 500)), 0),
            refundMethod: dummyReturnedItems.some(item => item.itemProcessType === "Refund") ? (i % 2 === 0 ? "Cash" : "Credit Card") : null,
        };
    });
    setReturnOrders(dummyData);
  };


  // ==========================================
  // EVENT HANDLERS
  // ==========================================

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setReplacementDetails({ // Initialize with RO level details if they exist, or defaults
      replacementId: order.replacementId || '',
      replacementDate: order.replacementDate || new Date().toISOString().split('T')[0],
      replacementStatus: order.replacementStatus || "Pending",
      isNewItem: order.isNewItem || false
    });
    setRefundDetails({ // Initialize with RO level details if they exist, or defaults
      refundId: order.refundId || '',
      refundDate: order.refundDate || new Date().toISOString().split('T')[0],
      refundAmount: order.refundAmount || 0,
      refundMethod: order.refundMethod || "Cash"
    });
    setSelectedTab('replacement'); // Default tab
    setShowDetailsModal(true);
  };

  const handleReplacementChange = (field, value) => setReplacementDetails(prev => ({ ...prev, [field]: value }));
  const handleRefundChange = (field, value) => setRefundDetails(prev => ({ ...prev, [field]: value }));

  const handleSaveDetails = () => {
    if (selectedOrder) {
      setReturnOrders(prev => prev.map(order =>
        order.id === selectedOrder.id
          ? { ...order, ...replacementDetails, ...refundDetails } // Update RO level details
          : order
      ));
      setShowDetailsModal(false);
    }
  };

  const handleReturnOrderChange = (field, value) => {
    setNewReturnOrder(prev => ({ ...prev, [field]: value }));
  };

  const formatPrice = (price) => {
    if (!price && price !== 0) return "0.00";
    const numericPrice = String(price).replace(/[₱±,]/g, '');
    return parseFloat(numericPrice).toLocaleString('en-PH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const handleSelectSalesOrderFromSearch = (salesOrder) => {
    setSelectedSalesOrderForRO(salesOrder);
    setSalesOrderSearchTerm(salesOrder.id); // Keep search bar showing selected SO ID
    setShowSalesOrderSearchResults(false);

    const customer = customers.find(c => c.name === salesOrder.customer);
    setNewReturnOrder({
      ...newReturnOrder,
      customer: customer ? customer.id.toString() : "",
      status: salesOrder.type,
      salesOrderId: salesOrder.id,
    });

    const itemsWithUniqueId = salesOrder.items ? salesOrder.items.map(item => ({
        ...item,
        uniqueDisplayId: item.id || item.serialNumber || `gen-${Math.random().toString(36).substr(2, 9)}`
    })) : [];
    setSalesOrderItems(itemsWithUniqueId);
    setReturnOrderItems([]);
  };

  const handleRemoveSelectedSO = () => {
    setSelectedSalesOrderForRO(null);
    setSalesOrderSearchTerm("");
    setNewReturnOrder(prev => ({
        ...prev,
        customer: "", // Allow re-selecting customer
        status: "Walk-In", // Reset status
        salesOrderId: ""
    }));
    setSalesOrderItems([]);
    setReturnOrderItems([]);
    setShowSalesOrderSearchResults(false); // Ensure search results can appear again
  };


  const handleAddItemToReturnList = (item) => {
    setCurrentItemForReason(item);
    setIsViewingReason(false);
    setShowReasonModal(true);
  };

  const handleSubmitReasonAndAddItem = () => {
    if (!currentItemForReason) return;

    const itemWithReason = {
      ...currentItemForReason,
      returnReason: reasonInput,
      returnImages: uploadedImages,
      itemProcessType: "Replacement", // Default process type for newly added item
    };

    setReturnOrderItems(prev => [...prev, itemWithReason]);
    setSalesOrderItems(prev => prev.filter(i => i.uniqueDisplayId !== currentItemForReason.uniqueDisplayId));

    setShowReasonModal(false);
    setCurrentItemForReason(null);
    setReasonInput("");
    setUploadedImages([]);
    setIsViewingReason(false);
  };

  const handleRemoveItemFromReturnList = (itemToRemove) => {
    setReturnOrderItems(prev => prev.filter(item => item.uniqueDisplayId !== itemToRemove.uniqueDisplayId));
    const { returnReason, returnImages, itemProcessType, ...originalItem } = itemToRemove;
    setSalesOrderItems(prev => [...prev, originalItem]);
  };

  const handleViewItemReason = (item) => {
    setCurrentItemForReason(item);
    setReasonInput(item.returnReason || "");
    setUploadedImages(item.returnImages || []);
    setIsViewingReason(true);
    setShowReasonModal(true);
  };

  const handleItemProcessTypeChange = (itemId, newType) => {
    setReturnOrderItems(prevItems =>
      prevItems.map(item =>
        item.uniqueDisplayId === itemId ? { ...item, itemProcessType: newType } : item
      )
    );
  };

  const handleCreateReturnOrder = () => {
    const customerDetails = customers.find(c => c.id.toString() === newReturnOrder.customer);

    const newRO = {
      id: returnOrders.length + 1,
      roNumber: nextROId, // Use the pre-calculated nextROId
      customer: customerDetails ? customerDetails.name : "Unknown Customer",
      date: newReturnOrder.date,
      status: newReturnOrder.status,
      employee: "admin@pgmicro.com",
      reason: newReturnOrder.reason,
      salesOrderId: newReturnOrder.salesOrderId,
      returnedItems: returnOrderItems.map(item => ({
        model: item.model,
        brand: item.brand,
        category: item.category,
        serialNumber: item.serialNumber || item.uniqueDisplayId,
        reason: item.returnReason,
        images: item.returnImages.map(file => file.name), // Store image names
        itemProcessType: item.itemProcessType, // Include per-item process type
        price: item.price // Assuming item has a price property
      })),
      // The top-level replacement/refund details are now less direct.
      // They could be determined by looking at the returnedItems or removed.
      // For simplicity, I'll omit them here but you might need to derive them
      // if your view details modal still expects them at the RO level.
    };

    setReturnOrders(prev => [...prev, newRO]);
    closeCreateROModal(); // Use the reset function
  };


  const handleRefreshData = () => {
    setIsLoading(true);
    loadSalesOrders(); // Reload SOs
    loadCustomers();   // Reload customers
    // Dummy ROs will be reloaded by useEffect if customers/SOs change substantially
    // Or call loadDummyReturnOrders() here if you want an explicit refresh of dummy data
    setTimeout(() => {
        loadDummyReturnOrders(); // Explicitly reload to reflect potential changes
        setIsLoading(false)
    }, 500);
  };

  // ==========================================
  // DATA FILTERING
  // ==========================================

  const filteredOrders = returnOrders.filter((order) => {
    const searchTermLower = searchQuery.toLowerCase();
    const matchesSearch = order.roNumber.toLowerCase().includes(searchTermLower) ||
                          order.customer.toLowerCase().includes(searchTermLower) ||
                          (order.salesOrderId && order.salesOrderId.toLowerCase().includes(searchTermLower));
    const matchesStatus = statusFilter === "All" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredSalesOrders = salesOrders.filter(order => {
    const searchTermLower = salesOrdersSearchTerm.toLowerCase();
    const matchesType = salesOrdersFilterType === "All" || order.type === salesOrdersFilterType;
    const matchesSearch = salesOrdersSearchTerm === "" ||
                         order.id.toLowerCase().includes(searchTermLower) ||
                         order.customer.toLowerCase().includes(searchTermLower) ||
                         order.dateSold.includes(salesOrdersSearchTerm);
    return matchesType && matchesSearch;
  });

  const closeCreateROModal = () => {
    setShowCreateROModal(false);
    setNewReturnOrder(initialNewReturnOrderState);
    setSalesOrderItems([]);
    setReturnOrderItems([]);
    setSelectedSalesOrderForRO(null);
    setSalesOrderSearchTerm("");
    setShowSalesOrderSearchResults(false);
    setCurrentItemForReason(null);
    setReasonInput("");
    setUploadedImages([]);
    setIsViewingReason(false);
  };


  return (
    <DashboardLayout>
      <div className="p-4 bg-white min-h-screen">
        {/* Header section */}
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
                  placeholder="Search by RO ID, Customer, SO ID"
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm w-[400px] focus:ring-indigo-500 focus:border-indigo-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                className="bg-purple-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-purple-700 flex items-center"
                onClick={handleRefreshData}
                disabled={isLoading}
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                {isLoading ? "Loading..." : "Refresh Data"}
              </button>
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
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Reason (Overall)</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 pr-8">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredOrders.length === 0 ? (
                <tr><td colSpan="6" className="px-3 py-4 text-sm text-gray-500 text-center">No return orders found</td></tr>
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
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 max-w-xs truncate" title={order.reason}>
                      {order.reason}
                    </td>
                    <td className="px-3 py-4 text-sm">
                      <button onClick={() => handleViewDetails(order)} className="text-indigo-600 hover:text-indigo-900 font-medium">
                        View details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* VIEW DETAILS MODAL (existing) */}
        {showDetailsModal && selectedOrder && (
          <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-[700px] max-h-[90vh] overflow-y-auto shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Return Details: {selectedOrder.roNumber}</h2>
                <button onClick={() => setShowDetailsModal(false)} className="text-gray-500 hover:text-gray-700"><X className="h-6 w-6" /></button>
              </div>
                <div className="mb-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div><p className="text-sm font-semibold text-gray-700">Return ID:</p><p className="text-base">{selectedOrder.roNumber}</p></div>
                  <div><p className="text-sm font-semibold text-gray-700">Return Date:</p><p className="text-base">{selectedOrder.date}</p></div>
                  <div><p className="text-sm font-semibold text-gray-700">Status:</p><span className={`text-xs font-medium rounded-full px-3 py-1 inline-block ${getBackgroundColor(selectedOrder.status)}`}>{selectedOrder.status}</span></div>
                  <div><p className="text-sm font-semibold text-gray-700">Sales Order:</p><p className="text-base text-indigo-600">{selectedOrder.salesOrderId || "N/A"}</p></div>
                  <div className="col-span-2"><p className="text-sm font-semibold text-gray-700">Overall Reason:</p><p className="text-base">{selectedOrder.reason}</p></div>
                </div>

                {selectedOrder.returnedItems && selectedOrder.returnedItems.length > 0 && (
                    <div className="mb-4">
                        <h3 className="text-md font-semibold text-gray-800 mb-2 border-b pb-1">Returned Items:</h3>
                        <ul className="space-y-2 max-h-40 overflow-y-auto p-1">
                            {selectedOrder.returnedItems.map((item, index) => (
                                <li key={item.serialNumber || `item-${index}`} className="p-2 border rounded-md bg-gray-50 text-sm">
                                    <p><strong>Model:</strong> {item.model} (SN: {item.serialNumber})</p>
                                    <p><strong>Reason:</strong> {item.reason}</p>
                                    <p><strong>Process As:</strong> <span className="font-medium">{item.itemProcessType}</span></p>
                                    {item.images && item.images.length > 0 && <p><strong>Evidence:</strong> {item.images.join(', ')}</p>}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {/* Tabs for RO-level replacement/refund may need adjustment if these are now fully per-item */}
                <div className="border-b border-gray-200 mb-4">
                  <div className="flex">
                    <button className={`py-2 px-4 font-medium text-sm border-b-2 ${selectedTab === 'replacement' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`} onClick={() => setSelectedTab('replacement')}>Overall Replacement</button>
                    <button className={`py-2 px-4 font-medium text-sm border-b-2 ${selectedTab === 'refund' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`} onClick={() => setSelectedTab('refund')}>Overall Refund</button>
                  </div>
                </div>
                {selectedTab === 'replacement' && ( <div className="space-y-4"><div><label className="block text-sm font-medium text-gray-700 mb-1">Replacement ID</label><input type="text" className="w-full border border-gray-300 p-2 rounded-md shadow-sm bg-gray-100" value={replacementDetails.replacementId} onChange={(e) => handleReplacementChange("replacementId", e.target.value)} readOnly={!replacementDetails.replacementId && selectedOrder.returnedItems?.some(i => i.itemProcessType === 'Replacement') ? false: true}/></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Replacement Date</label><input type="date" className="w-full border border-gray-300 p-2 rounded-md shadow-sm" value={replacementDetails.replacementDate} onChange={(e) => handleReplacementChange("replacementDate", e.target.value)}/></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Status</label><select className={`w-full border border-gray-300 p-2 rounded-md shadow-sm ${getBackgroundColor(replacementDetails.replacementStatus)}`} value={replacementDetails.replacementStatus} onChange={(e) => handleReplacementChange("replacementStatus", e.target.value)}>{replacementStatusOptions.map(option => (<option key={option.value} value={option.value}>{option.label}</option>))}</select></div><div><label className="block text-sm font-medium text-gray-700 mb-1">New Item</label><div className="flex items-center gap-2"><input type="checkbox" className="h-4 w-4 text-indigo-600 rounded border-gray-300" checked={replacementDetails.isNewItem} onChange={(e) => handleReplacementChange("isNewItem", e.target.checked)}/><span className="text-sm text-gray-700">Yes</span></div></div></div>)}
                {selectedTab === 'refund' && ( <div className="space-y-4"><div><label className="block text-sm font-medium text-gray-700 mb-1">Refund ID</label><input type="text" className="w-full border border-gray-300 p-2 rounded-md shadow-sm bg-gray-100" value={refundDetails.refundId} onChange={(e) => handleRefundChange("refundId", e.target.value)} readOnly={!refundDetails.refundId && selectedOrder.returnedItems?.some(i => i.itemProcessType === 'Refund') ? false: true}/></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Refund Date</label><input type="date" className="w-full border border-gray-300 p-2 rounded-md shadow-sm" value={refundDetails.refundDate} onChange={(e) => handleRefundChange("refundDate", e.target.value)}/></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Refund Amount</label><div className="relative"><span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₱</span><input type="number" className="w-full border border-gray-300 p-2 pl-8 rounded-md shadow-sm" value={refundDetails.refundAmount} onChange={(e) => handleRefundChange("refundAmount", parseFloat(e.target.value))}/></div></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Refund Method</label><select className="w-full border border-gray-300 p-2 rounded-md shadow-sm" value={refundDetails.refundMethod} onChange={(e) => handleRefundChange("refundMethod", e.target.value)}><option value="Cash">Cash</option><option value="Credit Card">Credit Card</option><option value="Bank Transfer">Bank Transfer</option><option value="Check">Check</option></select></div></div>)}
              </div>
              <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
                <button className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 font-medium" onClick={() => setShowDetailsModal(false)}>Cancel</button>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 font-medium" onClick={handleSaveDetails}>Save Changes</button>
              </div>
            </div>
          </div>
        )}
        
        {/* CREATE RO MODAL */}
        {showCreateROModal && (
          <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-[85%] max-w-6xl max-h-[90vh] shadow-xl flex flex-col"> {/* Increased width slightly */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Create Return Order</h2>
                <button onClick={closeCreateROModal} className="text-gray-400 hover:text-gray-600">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="overflow-auto flex-1 pr-2">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200">Return Information</h3>
                  <div className="mb-4 sales-order-search-container">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sales Order Reference</label>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-grow">
                        <input type="text" className="w-full border border-gray-300 p-2 pl-10 rounded-md shadow-sm"
                          placeholder="Search by Sales Order ID or Customer"
                          value={salesOrderSearchTerm}
                          onChange={(e) => { setSalesOrderSearchTerm(e.target.value); setShowSalesOrderSearchResults(true); }}
                          onFocus={() => setShowSalesOrderSearchResults(true)}
                          disabled={!!newReturnOrder.salesOrderId} // Disable if SO is selected
                        />
                        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                         {showSalesOrderSearchResults && !newReturnOrder.salesOrderId && filteredSalesOrderOptions.length > 0 && (
                            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm border border-gray-200">
                            {filteredSalesOrderOptions.map(order => (
                                <div key={order.id} className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100"
                                onClick={() => handleSelectSalesOrderFromSearch(order)}>
                                <div className="flex items-center"><span className="text-indigo-600 font-medium block truncate mr-2">{order.id}</span><span className="text-gray-600 block truncate">{order.customer} - ₱{formatPrice(order.total)}</span></div>
                                </div>
                            ))}
                            </div>
                        )}
                      </div>
                      {newReturnOrder.salesOrderId && (
                        <div className="flex items-center gap-2 bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-md text-sm">
                          <Tag size={16} />
                          <span>{newReturnOrder.salesOrderId}</span>
                          <button onClick={handleRemoveSelectedSO} className="ml-1 p-0.5 rounded-full hover:bg-indigo-200">
                            <X size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Return Order ID</label>
                        <div className="w-full border border-gray-300 p-2 rounded-md shadow-sm bg-gray-100">
                            <span className="font-semibold text-gray-800">{nextROId}</span>
                            <span className="text-xs text-gray-500 ml-1">(Auto-generated)</span>
                        </div>
                    </div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                      <select className="w-full border border-gray-300 p-2 rounded-md shadow-sm" value={newReturnOrder.customer} onChange={(e) => handleReturnOrderChange("customer", e.target.value)} disabled={!!newReturnOrder.salesOrderId}>
                        <option value="">Select a customer</option>
                        {customers.map(customer => (<option key={customer.id} value={customer.id}>{customer.name}</option>))}
                      </select>
                    </div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Return Date</label><input type="date" className="w-full border border-gray-300 p-2 rounded-md shadow-sm" value={newReturnOrder.date} onChange={(e) => handleReturnOrderChange("date", e.target.value)} /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select className={`w-full border border-gray-300 p-2 rounded-md shadow-sm ${getBackgroundColor(newReturnOrder.status)}`} value={newReturnOrder.status} onChange={(e) => handleReturnOrderChange("status", e.target.value)} disabled={!!newReturnOrder.salesOrderId}>
                        {statusOptions.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
                      </select>
                    </div>
                  </div>
                   <div><label className="block text-sm font-medium text-gray-700 mb-1">Overall Reason for Return (Optional)</label><textarea className="w-full border border-gray-300 p-2 rounded-md shadow-sm" value={newReturnOrder.reason} onChange={(e) => handleReturnOrderChange("reason", e.target.value)} rows="2" placeholder="Enter general reason for this return order"></textarea></div>
                </div>

                {/* Sales Order Item List */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2 pb-2 border-b">Sales Order Item List</h3>
                  <div className="border border-gray-200 rounded-md overflow-hidden max-h-60 overflow-y-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serial</th>
                          <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {salesOrderItems.length === 0 ? (
                          <tr><td colSpan="5" className="px-3 py-3 text-sm text-gray-500 text-center">No items in selected Sales Order or SO not selected.</td></tr>
                        ) : (
                          salesOrderItems.map(item => (
                            <tr key={item.uniqueDisplayId}>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{item.model}</td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{item.brand}</td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{item.serialNumber}</td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-center">
                                <button onClick={() => handleAddItemToReturnList(item)} className="text-green-600 hover:text-green-800 p-1 rounded-full hover:bg-green-100">
                                  <Plus size={18} />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Return Order Item List */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2 pb-2 border-b">Return Order Item List</h3>
                  <div className="border border-gray-200 rounded-md overflow-hidden max-h-60 overflow-y-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serial</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason/s</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Process As</th>
                          <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {returnOrderItems.length === 0 ? (
                          <tr><td colSpan="6" className="px-3 py-3 text-sm text-gray-500 text-center">No items added for return yet.</td></tr>
                        ) : (
                          returnOrderItems.map(item => (
                            <tr key={item.uniqueDisplayId}>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{item.model}</td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{item.brand}</td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{item.serialNumber}</td>
                              <td className="px-3 py-2 text-sm text-gray-500">
                                <span className="truncate inline-block max-w-[150px]" title={item.returnReason}>{item.returnReason}</span>
                                <button onClick={() => handleViewItemReason(item)} className="ml-1 text-indigo-600 hover:text-indigo-800"><Eye size={16}/></button>
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                <select
                                  value={item.itemProcessType}
                                  onChange={(e) => handleItemProcessTypeChange(item.uniqueDisplayId, e.target.value)}
                                  className="w-full border border-gray-300 p-1 rounded-md text-xs shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                  {itemProcessTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                  ))}
                                </select>
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-center">
                                <button onClick={() => handleRemoveItemFromReturnList(item)} className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-100">
                                  <Trash2 size={18} />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex justify-end gap-3 border-t border-gray-200 pt-4 mt-auto">
                  <button onClick={handleCreateReturnOrder}
                    className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 font-medium"
                    disabled={!newReturnOrder.customer || returnOrderItems.length === 0}>
                    Process Return
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* REASON MODAL (for adding/viewing reason and images) */}
        {showReasonModal && currentItemForReason && (
          <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-[60]">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                    {isViewingReason ? "View Reason & Evidence" : "Add Reason for Return"}: <span className="font-normal">{currentItemForReason.model} (SN: {currentItemForReason.serialNumber})</span>
                </h3>
                <button onClick={() => { setShowReasonModal(false); setIsViewingReason(false); setCurrentItemForReason(null); setReasonInput(""); setUploadedImages([])}} className="text-gray-400 hover:text-gray-600">
                    <X size={24} />
                </button>
              </div>
              
              <div className="overflow-y-auto flex-grow pr-1">
                <div>
                    <label htmlFor="reasonInput" className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                    <textarea id="reasonInput" className="w-full border border-gray-300 p-2 rounded-md shadow-sm" rows="3"
                    placeholder={isViewingReason ? "" : "Enter reason(s) for return"}
                    value={reasonInput}
                    onChange={(e) => setReasonInput(e.target.value)}
                    readOnly={isViewingReason}
                    />
                </div>

                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isViewingReason ? "Uploaded Evidence" : "Upload Pictures (Evidence)"}
                    </label>
                    {!isViewingReason && (
                    <input type="file" multiple className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                        onChange={(e) => setUploadedImages(Array.from(e.target.files))}
                    />
                    )}
                    {uploadedImages.length > 0 && (
                    <div className="mt-2 text-sm space-y-1">
                        <p className="font-medium">Files:</p>
                        <ul className="list-disc list-inside pl-1">
                        {uploadedImages.map((file, index) => (
                            <li key={index} className="truncate" title={file.name}>
                                {file.name} ({ (file.size / 1024).toFixed(2) } KB)
                            </li>
                        ))}
                        </ul>
                    </div>
                    )}
                    {isViewingReason && uploadedImages.length === 0 && <p className="text-sm text-gray-500">No evidence uploaded for this item.</p>}
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t pt-4 mt-4">
                <button onClick={() => {
                    if (!isViewingReason && currentItemForReason) { // If cancelling add, move item back to SO list
                        const itemExistsInReturn = returnOrderItems.find(ri => ri.uniqueDisplayId === currentItemForReason.uniqueDisplayId);
                        if(!itemExistsInReturn) { // Only add back if not already processed to return list
                             setSalesOrderItems(prev => [...prev, currentItemForReason]);
                        }
                    }
                    setShowReasonModal(false);
                    setIsViewingReason(false);
                    setCurrentItemForReason(null);
                    setReasonInput("");
                    setUploadedImages([]);
                 }}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 font-medium">
                  {isViewingReason ? "Close" : "Cancel"}
                </button>
                {!isViewingReason && (
                  <button onClick={handleSubmitReasonAndAddItem}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 font-medium"
                    disabled={!reasonInput.trim()}
                  >
                    Add to Return List
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default ReturnWarrantyPage;