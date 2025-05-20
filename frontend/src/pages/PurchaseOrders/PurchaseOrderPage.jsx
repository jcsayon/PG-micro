import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { X } from "lucide-react";

// -----------------------
// Helper Functions - Consolidated
// -----------------------
const helpers = {
  formatDateToYMD: (dateObj) => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  convertWarrantyToSeconds: (durationStr) => {
    const lower = durationStr?.toLowerCase().trim() || "";
    if (lower.includes("year")) return 365 * 24 * 3600;
    if (lower.includes("month")) return 30 * 24 * 3600;
    if (lower.includes("day")) return (parseInt(lower) || 1) * 24 * 3600;
    return 0;
  },

  formatTime: (totalSeconds) => {
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${days}d:${hours}h:${minutes}m:${seconds}s`;
  },

  statusBadge: (status) => {
    const badges = {
      "All": "bg-gray-100 text-gray-800",
      "Order Placed": "bg-indigo-100 text-indigo-800",
      "Shipped": "bg-blue-100 text-blue-800",
      "Delivered": "bg-emerald-100 text-emerald-800",
      "In Progress": "bg-amber-100 text-amber-800",
      "true": "bg-emerald-100 text-emerald-800", // For boolean damage status in modals - Assuming green for 'true' (no damage) based on your view modal
      "false": "bg-red-100 text-red-800" // For boolean damage status in modals - Assuming red for 'false' (damage)
    };
     // Adjusting for damage status mapping as per your ViewPurchaseOrderModal's usage
     if (typeof status === 'boolean') {
         return status ? "bg-red-100 text-red-800" : "bg-emerald-100 text-emerald-800";
     }
    return badges[status] || "bg-gray-100 text-gray-800";
  }
};

// Status options for dropdowns
const statusOptions = [
  { label: "Order Placed", value: "Order Placed" },
  { label: "Shipped", value: "Shipped" },
  { label: "Delivered", value: "Delivered" },
  { label: "In Progress", value: "In Progress" },
];

// -----------------------
// Reusable Components (excluding the new ones)
// -----------------------
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/80 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-4/5 max-w-6xl max-h-[90vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <button onClick={onClose} className="text-white hover:text-black">
            <X className="h-6 w-6 bg-red-500 rounded" />
          </button>
        </div>
        <div className="p-4 overflow-auto flex-1">{children}</div>

      </div>
    </div>
  );
};

const StatusBadge = ({ status, onChange }) => (
  <select
    value={status}
    onChange={onChange}
    className={`text-sm rounded-full px-3 py-1 font-medium ${helpers.statusBadge(status)}`}
  >
    {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
  </select>
);

const InputField = ({ label, value, onChange, type = "text", prefix, disabled = false }) => (
  <div>
    {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
    <div className="relative rounded-md">
      {prefix && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-gray-500 sm:text-sm">{prefix}</span>
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`${prefix ? 'pl-7' : 'pl-3'} pr-3 py-2 w-full ${
          disabled ? 'bg-transparent border-0' : 'border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
        } rounded-md shadow-sm sm:text-sm`}
      />
    </div>
  </div>
);

// -----------------------
// New Components
// -----------------------

// Email Sent Confirmation Modal
function EmailSentModal({ to, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 space-y-4 w-80 text-center">
        <h2 className="text-lg font-semibold">📧 Email Sent</h2>
        <p>Notification has been sent to <strong>{to}</strong>.</p>
        <button
          onClick={onClose}
          className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Okay
        </button>
      </div>
    </div>
  );
}

// Email Thread Component
function EmailThread({ thread }) {
  if (!thread || thread.length === 0) {
    return <p className="text-sm text-gray-500">No email exchange found for this PO.</p>;
  }
  return (
    <div className="space-y-4">
      {thread.map(msg => (
        <div key={msg.id} className={`p-3 rounded ${msg.fromSupplier ? 'bg-white border border-gray-200' : 'bg-indigo-100 border border-indigo-200'}`}>
          <div className="text-xs text-gray-600 mb-1">
            <strong>{msg.fromSupplier ? 'Supplier' : 'You'}</strong> — {msg.timestamp}
          </div>
          <div className="text-sm text-gray-800">{msg.body}</div>
        </div>
      ))}
    </div>
  );
}

// Placeholder for fetching email thread (Replace with your actual API call)
const fetchEmailThread = async (poNumber) => {
  console.log("Fetching email thread for PO:", poNumber);
  // Simulate an API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  // Return sample data
  return [
    { id: 1, fromSupplier: false, timestamp: "2023-01-01 10:00 AM", body: `PO ${poNumber} has been placed.` },
    { id: 2, fromSupplier: true, timestamp: "2023-01-01 02:30 PM", body: "Received the purchase order. Will process shortly." },
    { id: 3, fromSupplier: false, timestamp: "2023-01-03 09:00 AM", body: "Any updates on the shipment?" },
    { id: 4, fromSupplier: true, timestamp: "2023-01-03 11:15 AM", body: "Your order is being prepared for shipping. Will send tracking details soon." },
  ];
};

// Placeholder for sending email (Replace with your actual API call)
const sendEmailToSupplier = async (poData, supplierEmail) => {
  console.log("Sending email for PO data:", poData, "to:", supplierEmail);
  // Simulate an API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log("Email sent successfully (simulated).");
  // In a real app, handle success/error response
  return { success: true }; // Simulate success
};


// -----------------------
// ViewPurchaseOrderModal Component (Modified for split view)
// -----------------------
function ViewPurchaseOrderModal({ order, onClose, onSendToInventory, emailThread }) {
  const [poStatus, setPoStatus] = useState(order.status);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [assignments, setAssignments] = useState({});

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const init = {};
    order.items?.forEach((_, i) => (init[i] = ""));
    setAssignments(init);
  }, [order.items]);

  const approvedItems = order.items?.filter((item, i) => assignments[i] === "approved") || [];
  const damagedItems = order.items?.filter((item, i) => assignments[i] === "damaged") || [];
  const allAssigned = order.items?.length > 0 && order.items.every((_, i) => assignments[i] !== "");

  return (
    <div className="fixed inset-0 bg-gray-900/80 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[90vh] flex overflow-hidden">
        {/* LEFT: PO DETAILS */}
        <div className="w-1/2 overflow-y-auto p-6"> {/* Use overflow-y-auto here */}
           <div className="pb-4 border-b flex justify-between items-center sticky top-0 bg-white z-10"> {/* Sticky header */}
            <h2 className="text-xl font-semibold text-gray-800">Purchase Order Details</h2>
            {/* Keep the Close button in the main modal wrapper if desired, or move here */}
           </div>
           <div className="pt-4"> {/* Add padding top after sticky header */}
              {/* PO Info Card */}
              <div className="bg-gray-50 rounded-lg p-4 shadow-sm mb-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm font-medium text-gray-500">PO Number</div>
                    <div className="mt-1 text-base font-semibold">{order.poNumber}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">Status</div>
                    <div className="mt-1">
                      <StatusBadge status={poStatus} onChange={(e) => setPoStatus(e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">Date</div>
                    <div className="mt-1 text-base">{order.date}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">Time</div>
                    <div className="mt-1 text-base">{currentTime.toLocaleTimeString()}</div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="text-sm font-medium text-gray-500">Supplier</div>
                  <div className="mt-1 text-base font-medium">{order.supplier}</div>
                </div>
              </div>

              {/* Order Items Section */}
              {order.items && order.items.length > 0 ? (
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-4 text-gray-800">Order Items</h3>
                  {order.items.map((item, index) => (
                    <div key={index} className="mb-4 bg-white border rounded-lg shadow-sm overflow-hidden">
                      <div className="bg-gray-50 p-3 border-b flex justify-between">
                        <div className="font-medium">{item.brand} {item.model}</div>
                        <div className="text-gray-600">
                          Qty: <span className="font-medium">{item.quantity}</span> |
                          Total: <span className="font-medium">₱{(item.purchasePrice * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Item Details */}
                      <div className="px-3 py-2">
                        <div className="grid grid-cols-4 gap-4 mb-2">
                          {[
                            { label: "Product ID", value: item.id },
                            { label: "Brand", value: item.brand },
                            { label: "Model", value: item.model },
                            { label: "Purchase Price", value: `₱${item.purchasePrice}` },
                          ].map((field, i) => (
                            <div key={i}>
                              <div className="text-xs text-gray-500">{field.label}</div>
                              <div className="font-medium">{field.value}</div>
                            </div>
                          ))}
                        </div>

                        {/* Serial Numbers */}
                        {item.serials && item.serials.length > 0 && (
                          <div className="mt-3 border-t pt-2">
                            <div className="text-sm font-medium mb-2">Serial Numbers</div>
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead>
                                <tr className="text-xs text-gray-500 bg-gray-50">
                                  {["Serial Number", "Warranty Duration", "Warranty Time", "Damage"].map((header, i) => (
                                    <th key={i} className="px-3 py-2 text-left">{header}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200">
                                {item.serials.map((serial, sIndex) => {
                                  const remainingSeconds = helpers.convertWarrantyToSeconds(item.warrantyDuration);
                                  return (
                                    <tr key={sIndex}>
                                      <td className="px-3 py-2 text-sm">{item.id}-{serial.id}</td>
                                      <td className="px-3 py-2 text-sm">{item.warrantyDuration}</td>
                                      <td className="px-3 py-2 text-sm">
                                        {poStatus === "Delivered" ? helpers.formatTime(remainingSeconds) : "Not started"}
                                      </td>
                                      <td className="px-3 py-2 text-sm">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${serial.damage ? "bg-red-100 text-red-800" : "bg-emerald-100 text-emerald-800"}`}>
                                          {serial.damage ? "Damaged" : "No Damage"}
                                        </span>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 bg-gray-50 rounded-lg p-4">No order items found.</div>
              )}

              {/* Audit Section */}
              {poStatus === "Delivered" && (
                <div className="bg-white border rounded-lg shadow-sm p-4 mb-6">
                  <h3 className="text-lg font-medium mb-4 text-gray-800">Audit Items</h3>

                  <div className="space-y-4 mb-6">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="p-4 border rounded-lg bg-gray-50">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">{item.brand} {item.model}</div>
                            <div className="text-sm text-gray-500">Qty: {item.quantity} | Total: ₱{(item.purchasePrice * item.quantity).toFixed(2)}</div>
                          </div>
                          <div className="flex gap-4">
                            {["approved", "damaged"].map((type) => (
                              <label key={type} className="inline-flex items-center cursor-pointer">
                                <input
                                  type="radio"
                                  name={`assignment-${idx}`}
                                  value={type}
                                  checked={assignments[idx] === type}
                                  onChange={() => setAssignments(prev => ({ ...prev, [idx]: type }))}
                                  className={`h-4 w-4 ${type === "approved" ? "text-emerald-600" : "text-red-600"}`}
                                />
                                <span className="ml-2 text-sm">{type === "approved" ? "Approved" : "Damaged"}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Results grid */}
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    {[
                      { title: "Approved Items", items: approvedItems, color: "emerald" },
                      { title: "Damaged Items", items: damagedItems, color: "red" }
                    ].map((section, i) => (
                      <div key={i} className="border rounded-lg overflow-hidden">
                        <div className={`bg-${section.color}-50 px-4 py-2 border-b`}>
                          <h4 className={`font-medium text-${section.color}-800`}>{section.title}</h4>
                        </div>
                        <div className="divide-y divide-gray-200">
                          {section.items.length > 0 ? (
                            section.items.map((item, itemIdx) => ( // Changed i to itemIdx to avoid conflict
                              <div key={itemIdx} className="px-4 py-3 flex justify-between">
                                <div>{item.brand} {item.model}</div>
                                <div className="font-medium">Qty: {item.quantity}</div>
                              </div>
                            ))
                          ) : (
                            <div className="px-4 py-3 text-gray-500 text-sm">No {section.title.toLowerCase()} yet</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {allAssigned && (
                    <button
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      onClick={() => {
                        onSendToInventory?.(approvedItems, damagedItems);
                        // onClose(); // Consider if you want to close modal after sending to inventory
                      }}
                    >
                      Send to Inventory
                    </button>
                  )}
                </div>
              )}
           </div>
        </div>

        {/* RIGHT: Email exchange thread */}
        <div className="w-1/2 border-l overflow-y-auto p-6 bg-gray-50"> {/* Use overflow-y-auto here */}
          <h3 className="text-xl font-semibold mb-4 text-gray-800 sticky top-0 bg-gray-50 z-10 pb-2 border-b border-gray-200">Email Exchange</h3> {/* Sticky header */}
          <div className="pt-2"> {/* Add padding top after sticky header */}
            {emailThread ? (
              <EmailThread thread={emailThread} />
            ) : (
              <p className="text-sm text-gray-500">Loading messages…</p>
            )}
          </div>
        </div>
         {/* Close button for the entire modal */}
         <div className="absolute top-4 right-4 z-20">
            <button onClick={onClose} className="text-white hover:text-black">
              <X className="h-6 w-6 bg-red-500 rounded" />
            </button>
         </div>
      </div>
    </div>
  );
}


// -----------------------
// Main PurchaseOrderPage Component
// -----------------------
const PurchaseOrderPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentTime, setCurrentTime] = useState(new Date());

  // Modal states
  const [showCreatePOModal, setShowCreatePOModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  // New state for email sent confirmation
  const [showEmailSentModal, setShowEmailSentModal] = useState(false);
  const [emailSentTo, setEmailSentTo] = useState(""); // Store recipient email for modal

  // Data states
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [poStatus, setPoStatus] = useState("Order Placed");
  const [orderItems, setOrderItems] = useState([]);
  const [serialsCollapsed, setSerialsCollapsed] = useState({});
  const [poSupplierSearch, setPoSupplierSearch] = useState("");
  const [poSelectedSupplier, setPoSelectedSupplier] = useState(null);
  const [poProductSearch, setPoProductSearch] = useState("");
  const [poSelectedProduct, setPoSelectedProduct] = useState(null);
   // New state for email thread
  const [emailThreadForPO, setEmailThreadForPO] = useState(null);


  // Product and supplier data for "Create PO Modal" dropdowns
  // These should ideally be fetched or managed globally (e.g., via Context or Redux)
  // For now, we'll use the data similar to how it's defined in their respective components
   const [products] = useState(() => { // This will be filtered
    const initialProducts = [];
    const brands = ["Acer", "Corsair", "Logitech", "Asus", "MSI", "Razer", "HyperX", "Samsung", "LG", "Dell"];
    const models = ["Predator", "K68", "G502", "ROG Strix", "Stealth", "BlackWidow", "Cloud II", "Odyssey", "UltraGear", "Alienware"];
    const descriptions = ["Gaming Laptop", "Mechanical Keyboard", "Gaming Mouse", "Motherboard", "Gaming PC", "Headset", "Monitor", "SSD", "RAM", "CPU Cooler"];
    const warrantyDurations = ["1 Year", "6 Months", "2 Years", "3 Years"];

    for (let i = 1; i <= 100; i++) {
      initialProducts.push({
        id: i,
        brand: brands[i % brands.length],
        model: models[i % models.length] + `-${i}`,
        description: descriptions[i % descriptions.length],
        purchasePrice: Math.floor(Math.random() * 100000) + 1000,
        reorderPoint: Math.floor(Math.random() * 50) + 5,
        warrantyDuration: warrantyDurations[i % warrantyDurations.length],
        // damage: Math.random() < 0.1, // Damage property is per serial, not product
      });
    }
    return initialProducts;
  });

  const [suppliers] = useState([
    // Simplified product data for catalogs here for easier management in this component
    // In a real app, this catalog data would be richer, referencing full product objects
    { id: 1, name: "Hardware World", address: "123 Main St, Davao City", email: "info@hardwareworld.com", contact: "0912-345-6789", catalog: products.slice(0,10).map(p => ({id: p.id, model: p.model, brand: p.brand, purchasePrice: p.purchasePrice, warrantyDuration: p.warrantyDuration})) },
    { id: 2, name: "CD-R King", address: "456 IT Park, Cebu City", email: "support@cdrking.com", contact: "0901-234-5678", catalog: products.slice(10,25).map(p => ({id: p.id, model: p.model, brand: p.brand, purchasePrice: p.purchasePrice, warrantyDuration: p.warrantyDuration})) },
    { id: 3, name: "MGM Marketing Inc.", address: "789 Market St, Manila", email: "contact@mgm.com", contact: "0934-567-8910", catalog: products.slice(25,35).map(p => ({id: p.id, model: p.model, brand: p.brand, purchasePrice: p.purchasePrice, warrantyDuration: p.warrantyDuration})) },
  ]);

  // Initialize sample PO data
  useEffect(() => {
    const initialSuppliersData = [
      { name: "Hardware World", email: "info@hardwareworld.com" },
      { name: "CD-R King", email: "support@cdrking.com" },
      { name: "MGM Marketing Inc.", email: "contact@mgm.com" },
      { name: "Sara Davis", email: "sara.davis@example.com" }, // Example additional suppliers
      { name: "Mike Tyson Inc.", email: "mike.tyson@example.com" },
    ];

    setPurchaseOrders([...Array(5)].map((_, i) => ({
      id: i + 1,
      poNumber: `#PO${(i + 1).toString().padStart(2, '0')}`,
      supplier: initialSuppliersData[i % initialSuppliersData.length].name,
      supplierEmail: initialSuppliersData[i % initialSuppliersData.length].email, // Add supplier email to existing PO data
      date: `2023-01-${(i + 1).toString().padStart(2, '0')}`,
      total: `₱${(10000 + i * 1000).toLocaleString()}.00`,
      status: i % 4 === 0 ? "Order Placed" : i % 4 === 1 ? "Shipped" : i % 4 === 2 ? "Delivered" : "In Progress",
      employee: "admin@pgmicro.com",
       items: [ // Sample items for existing POs
        { ...(products[i % products.length]), quantity: Math.floor(Math.random() * 5) + 1, serials: [{id:1, damage:false}, {id:2, damage:true}] }, // Sample items with serials
      ]
    })));
  }, [products]); // Depend on products if using it for sample PO items

  // Timer effect
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Order serials collapse state
  useEffect(() => {
    setSerialsCollapsed((prev) => {
      const newState = {};
      for (const item of orderItems) {
        // Maintain previous state if exists, otherwise default to false
        newState[item.id] = prev[item.id] !== undefined ? prev[item.id] : false;
      }
      return newState;
    });
  }, [orderItems]);


  // Filtered orders
  const filteredOrders = purchaseOrders.filter((order) => {
    const matchesSearch =
      order.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate order total
  const orderTotal = orderItems.reduce(
    (sum, item) => sum + item.purchasePrice * item.quantity, 0
  );

  // Event handlers
  const handleStatusChange = (orderId, newStatus) => {
    setPurchaseOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const handlePoSupplierSearchChange = (e) => {
    setPoSupplierSearch(e.target.value);
    const found = suppliers.find(s => s.name.toLowerCase() === e.target.value.toLowerCase());
    setPoSelectedSupplier(found || null);
    setPoProductSearch(""); // Reset product search when supplier changes
    setPoSelectedProduct(null);
  };

  const handlePoProductSearchChange = (e) => {
    setPoProductSearch(e.target.value);
    const productPool = poSelectedSupplier?.catalog || []; // Use catalog if supplier selected
    const found = productPool.find(p => p.model.toLowerCase() === e.target.value.toLowerCase());
    setPoSelectedProduct(found || null);
  };

  const handleAddOrderItem = () => {
    if (poSelectedProduct) {
      // Find the full product details from the main products list if needed,
      // or ensure poSelectedProduct (from catalog) has all necessary fields.
      // For simplicity, we assume the catalog item (poSelectedProduct) is sufficient.
      const fullProductDetails = products.find(p => p.id === poSelectedProduct.id) || poSelectedProduct;

      const newItem = {
        ...fullProductDetails, // Use full details
        quantity: 1,
        serials: [{ id: 1, damage: false }], // Initialize with one serial, quantity will update this later
      };
      setOrderItems(prev => [...prev, newItem]);
      setPoProductSearch("");
      setPoSelectedProduct(null);
    }
  };

  const handleOrderItemQuantityChange = (index, newQty) => {
    setOrderItems(prev => {
      const updated = [...prev];
      const item = updated[index];
      const qty = parseInt(newQty) || 1;
      if (qty < 1) return prev; // Prevent quantity less than 1

      item.quantity = qty;

      // Re-generate serials based on new quantity
      item.serials = Array.from({ length: qty }, (_, i) => ({
        id: i + 1,
        damage: false, // Default to no damage on new serials
      }));

      return updated;
    });
  };

   // Renamed handleAddPO to handleFinalizePO
   const handleFinalizePO = async () => {
    if (!poSelectedSupplier) {
      alert("Please select a supplier first.");
      return;
    }
    if (orderItems.length === 0) {
      alert("Please add at least one product.");
      return;
    }

    // 1) Your existing "save PO" logic here
    const newPO = {
      id: purchaseOrders.length + 1,
      poNumber: `#PO${(purchaseOrders.length + 1).toString().padStart(2, '0')}`,
      supplier: poSelectedSupplier.name,
      supplierEmail: poSelectedSupplier.email, // Include email
      date: helpers.formatDateToYMD(currentTime),
      time: currentTime.toLocaleTimeString(),
      status: poStatus,
      items: orderItems.map(item => ({
        ...item,
        serials: item.serials.map((serial, index) => ({ ...serial, id: index + 1}))
      })),
      total: `₱${orderTotal.toFixed(2)}`,
      employee: sessionStorage.getItem("userEmail") || "Unknown",
    };

    // Add the new PO to the list
    setPurchaseOrders(prev => [...prev, newPO]);

    // Prepare data for email (you might adjust this based on your sendEmailToSupplier function needs)
    const poData = {
        poNumber: newPO.poNumber,
        supplierName: newPO.supplier,
        supplierEmail: newPO.supplierEmail,
        date: newPO.date,
        items: newPO.items.map(item => ({
            brand: item.brand,
            model: item.model,
            quantity: item.quantity,
            purchasePrice: item.purchasePrice,
            // Include other relevant item details for the email
        })),
        total: newPO.total,
    };

    // 2) Then send email:
    // Ensure supplier email is available
    if (poSelectedSupplier.email) {
       await sendEmailToSupplier(poData, poSelectedSupplier.email);

       // show the “Email sent” confirmation
       setEmailSentTo(poSelectedSupplier.email); // Set the recipient email for the modal
       setShowEmailSentModal(true);
    } else {
       alert("Supplier email not available. PO finalized but email not sent.");
    }

    // optionally auto-close the create modal
    setShowCreatePOModal(false);

    // Reset Create PO form state
    setPoSupplierSearch("");
    setPoSelectedSupplier(null);
    setPoProductSearch("");
    setPoSelectedProduct(null);
    setOrderItems([]);
    setPoStatus("Order Placed");
  };

   // Handler to view details and fetch email thread
   const handleViewDetails = async (order) => {
    setSelectedOrder(order);
    setShowViewModal(true); // Show modal immediately while fetching
    setEmailThreadForPO(null); // Clear previous thread
    // fetch your email thread from wherever you store it
    // Ensure order.poNumber is available for fetching the thread
    if (order.poNumber) {
        const thread = await fetchEmailThread(order.poNumber);
        setEmailThreadForPO(thread);
    } else {
        setEmailThreadForPO([]); // Set empty thread if no PO number
        console.warn("PO Number not available for fetching email thread.");
    }
  };


  const availableProductsForSelectedSupplier = poSelectedSupplier?.catalog || [];


  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <div className="bg-white shadow-sm sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h1 className="text-2xl font-bold text-gray-900">Purchase Orders</h1>

              <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => setShowCreatePOModal(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Create PO
                  </button>
              </div>
            </div>

            {/* Filters */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search by PO ID, Supplier, or Date"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <select
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">All Statuses</option>
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Purchase Orders Table */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {["PO ID", "Employee", "Date Issued", "Supplier", "Status", "Total", "Actions"].map((header, i) => (
                      <th key={i} scope="col" className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${i === 5 ? "text-right" : ""} ${i === 6 ? "text-right" : ""}`}>
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.poNumber}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {order.employee}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {order.date}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {order.supplier}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <StatusBadge
                          status={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                        {order.total}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleViewDetails(order)} // Use the new handler
                          className="text-indigo-600 hover:text-indigo-900 font-medium"
                        >
                          View details
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredOrders.length === 0 && (
                    <tr>
                      <td colSpan="7" className="px-4 py-4 text-center text-sm text-gray-500">
                        No purchase orders found matching your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Create PO Modal */}
      {/* Using the original Modal component for Create PO */}
       <Modal
        isOpen={showCreatePOModal}
        onClose={() => setShowCreatePOModal(false)}
        title="Create Purchase Order"
      >
        {/* PO Info */}
        <div className="bg-gray-50 rounded-lg p-4 shadow-sm mb-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 ">
            <div>
              <div className="text-sm font-medium text-gray-500">PO Number</div>
              <div className="mt-1 font-semibold">#{purchaseOrders.length + 1}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Status</div>
              <div className="mt-1">
                <StatusBadge
                  status={poStatus}
                  onChange={(e) => setPoStatus(e.target.value)}
                />
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Date</div>
              <div className="mt-1">{helpers.formatDateToYMD(currentTime)}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Time</div>
              <div className="mt-1">{currentTime.toLocaleTimeString()}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Employee</div>
              <div className="mt-1">{sessionStorage.getItem("userEmail") || "Unknown"}</div>
            </div>
          </div>
        </div>

        {/* Supplier Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4 text-gray-800">Select Supplier</h3>
          <div className="flex gap-2 mb-2">
            <div className="relative w-full">
              <input
                list="supplierList"
                value={poSupplierSearch}
                onChange={handlePoSupplierSearchChange}
                placeholder="Search for supplier..."
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              <datalist id="supplierList">
                {suppliers.map((s) => (
                  <option key={s.id} value={s.name} />
                ))}
              </datalist>
            </div>
            <button
              className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
              onClick={() => { setPoSupplierSearch(""); setPoSelectedSupplier(null); }}
            >
              Clear
            </button>
          </div>

          {poSelectedSupplier ? (
            <div className="bg-white p-2 border rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex">
                  <div className="font-medium text-gray-500 mr-1">Name:</div>
                  <div className="font-medium">{poSelectedSupplier.name}</div>
                </div>
                <div className="flex">
                  <div className="font-medium text-gray-500 mr-1">Address:</div>
                  <div className="font-medium">{poSelectedSupplier.address}</div>
                </div>
                <div className="flex">
                  <div className="font-medium text-gray-500 mr-1">Email:</div>
                  <div className="font-medium">{poSelectedSupplier.email}</div>
                </div>
                <div className="flex">
                  <div className="font-medium text-gray-500 mr-1">Contact:</div>
                  <div className="font-medium">{poSelectedSupplier.contact}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-yellow-50 text-yellow-700 rounded-lg border border-yellow-200">
              No supplier selected. Please search and select a supplier.
            </div>
          )}
        </div>

        {/* Add Items */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-800">Add Items</h3>
            <div className="text-lg font-medium">
              Order Total: <span className="text-indigo-600">₱{orderTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex gap-2 mb-4">
            <div className="relative w-full">
              <input
                list="productListForSupplier"
                value={poProductSearch}
                onChange={handlePoProductSearchChange}
                placeholder={poSelectedSupplier ? "Search supplier's catalog..." : "Select a supplier first"}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                disabled={!poSelectedSupplier}
              />
              <datalist id="productListForSupplier">
                {availableProductsForSelectedSupplier.map((p) => (
                  <option key={p.id} value={p.model}>
                    {p.brand} - {p.model}
                  </option>
                ))}
              </datalist>
            </div>
            <button
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              onClick={handleAddOrderItem}
              disabled={!poSelectedProduct || !poSelectedSupplier}
            >
              Add
            </button>
          </div>

          {/* Order Items List */}
          <div className="space-y-4">
            {orderItems.length > 0 ? (
              orderItems.map((item, index) => {
                const collapsed = serialsCollapsed[item.id] || false; // Use item.id for collapsing state
                return (
                  // Using item.id and index in key for uniqueness, especially if multiple instances of the same product are added
                  <div key={`${item.id}-${index}`} className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 p-3 flex justify-between items-center">
                      <div className="font-medium">{item.brand} {item.model}</div>
                      <div className="flex gap-2">
                         <div className="flex items-center">
                            <label htmlFor={`quantity-${item.id}-${index}`} className="sr-only">Quantity</label>
                             <input
                              id={`quantity-${item.id}-${index}`}
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => handleOrderItemQuantityChange(index, e.target.value)}
                              className="w-16 border border-gray-300 rounded px-2 py-1 text-center text-sm"
                            />
                          </div>
                        <button
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm"
                           // Use item.id for collapsing state
                          onClick={() => {
                            setSerialsCollapsed(prev => ({
                              ...prev,
                              [item.id]: !prev[item.id]
                            }));
                          }}
                        >
                          {collapsed ? "Show" : "Hide"} Serials ({item.serials?.length || 0})
                        </button>
                        <button
                          className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm"
                          onClick={() => {
                            setOrderItems(prev => {
                              const updated = [...prev];
                              updated.splice(index, 1);
                              return updated;
                            });
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    {!collapsed && item.serials && item.serials.length > 0 && (
                      <div className="p-3 border-t">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead>
                            <tr className="text-xs text-gray-500">
                              {["Serial Number", "Warranty Duration", "Warranty Status", "Damage"].map((header, i) => (
                                <th key={i} className="px-3 py-2 text-left font-medium">{header}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {item.serials.map((serial, sIndex) => (
                              <tr key={sIndex}>
                                <td className="px-3 py-2 text-sm">{item.id}-{serial.id}</td>
                                <td className="px-3 py-2 text-sm">{item.warrantyDuration}</td>
                                <td className="px-3 py-2 text-sm">Not started</td> {/* Warranty status is not started until PO is delivered */}
                                <td className="px-3 py-2 text-sm">
                                  {/* Allow setting damage status during creation? Or only during receiving/audit?
                                      Assuming you might want to mark items as damaged upon receipt if the PO is 'Delivered'
                                      For creation modal, perhaps this should be disabled or removed?
                                      Based on your View modal, damage seems relevant during "Delivered" status.
                                      Let's disable it in the creation modal for now.
                                  */}
                                   <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${helpers.statusBadge(serial.damage)}`}>
                                     {serial.damage ? "Damaged" : "No Damage"}
                                   </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="p-4 bg-gray-50 text-gray-500 rounded-lg text-center border">
                No items added to order yet. {poSelectedSupplier && availableProductsForSelectedSupplier.length === 0 && "(Selected supplier has an empty catalog)"}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            onClick={handleFinalizePO} // Use the new handler
            disabled={!poSelectedSupplier || orderItems.length === 0 || poStatus !== "Order Placed"} // Typically finalize is only from 'Order Placed'
          >
            Finalize Purchase Order
          </button>
        </div>
      </Modal>

      {/* View Modal */}
      {showViewModal && selectedOrder && (
        <ViewPurchaseOrderModal
          order={selectedOrder}
          onClose={() => {
            setShowViewModal(false);
            setEmailThreadForPO(null); // Clear thread when modal closes
          }}
          onSendToInventory={(approvedItems, damagedItems) => {
            console.log("Approved Items:", approvedItems);
            console.log("Damaged Items:", damagedItems);
            // Here you would typically update your main inventory state
            alert(`${approvedItems.reduce((sum, item) => sum + item.quantity, 0)} approved items and ${damagedItems.reduce((sum,item) => sum + item.quantity, 0)} damaged items were processed.`);
          }}
          emailThread={emailThreadForPO} // Pass the fetched email thread
        />
      )}

      {/* Email Sent Confirmation Modal */}
      {showEmailSentModal && (
        <EmailSentModal
          to={emailSentTo} // Use the stored email recipient
          onClose={() => setShowEmailSentModal(false)}
        />
      )}

    </DashboardLayout>
  );
};

export default PurchaseOrderPage;