import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";

// -----------------------
// Helper Functions
// -----------------------

// Convert a warranty duration string to seconds (simplified).
// ✅ Format date to YYYY-MM-DD
function formatDateToYMD(dateObj) {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function convertWarrantyDurationToSeconds(durationStr) {
  const lower = durationStr.toLowerCase().trim();
  if (lower.includes("year")) return 365 * 24 * 3600;
  if (lower.includes("month")) return 30 * 24 * 3600;
  if (lower.includes("day")) {
    const num = parseInt(lower) || 1;
    return num * 24 * 3600;
  }
  return 0;
}

// Format seconds as D:H:M:S
function formatTime(totalSeconds) {
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${days}d:${hours}h:${minutes}m:${seconds}s`;
}

/**
 * Returns a Tailwind background color class for the given value.
 * This is used for dynamically coloring <select> backgrounds.
 */
function getBackgroundColor(value) {
  switch (value) {
    case "All":
      return "bg-blue-300 rounded";
    case "Order Placed":
      return "bg-purple-300 rounded";
    case "Shipped":
      return "bg-gray-300 rounded";
    case "Delivered":
      return "bg-green-300 rounded";
    case "In Progress":
      return "bg-amber-300 rounded";
    case "true": // for audit/damage = true
      return "bg-green-300 rounded";
    case "false": // for audit/damage = false
      return "bg-red-300 rounded";
    default:
      return "bg-white";
  }
}

// The possible statuses for orders
const statusOptions = [
  { label: "Order Placed", value: "Order Placed", colorClass: "bg-purple-200" },
  { label: "Shipped", value: "Shipped", colorClass: "bg-gray-200" },
  { label: "Delivered", value: "Delivered", colorClass: "bg-green-200" },
  { label: "In Progress", value: "In Progress", colorClass: "bg-amber-200" },
];

// -----------------------
// ViewPurchaseOrderModal Component
// -----------------------
function ViewPurchaseOrderModal({ order, onClose, onSendToInventory }) {
  const [poStatus, setPoStatus] = useState(order.status);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // For each order item, track assignment: "" | "approved" | "damaged"
  const [assignments, setAssignments] = useState({});
  useEffect(() => {
    const init = {};
    order.items.forEach((_, i) => (init[i] = ""));
    setAssignments(init);
  }, [order.items]);

  const approvedItems = order.items.filter((_, i) => assignments[i] === "approved");
  const damagedItems = order.items.filter((_, i) => assignments[i] === "damaged");
  const allAssigned =
    order.items.length > 0 && order.items.every((_, i) => assignments[i] !== "");

  const handleAssignmentChange = (index, value) => {
    setAssignments((prev) => ({ ...prev, [index]: value }));
  };

  const handleSendToInventory = () => {
    alert(
      `Sending ${approvedItems.length} approved items to Available Inventory and ${damagedItems.length} damaged items to Damaged Products.`
    );
    onSendToInventory?.(approvedItems, damagedItems);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
      <div className="bg-purple-100 text-purple-700 p-4 rounded shadow-lg h-[700px] w-[1200px] flex flex-col overflow-auto">
        <h2 className="text-l font-bold mb-2">Purchase Order Details</h2>

        {/* PO Info */}
        <table className="w-full border mb-1">
          <tbody className="bg-purple-200">
            <tr>
              <td className="border p-2">PO Number: {order.poNumber}</td>
              <td className="border p-2">
                Status:{" "}
                <select
                  value={poStatus}
                  onChange={(e) => setPoStatus(e.target.value)}
                  className={`border rounded px-2 py-1 ml-1 ${getBackgroundColor(poStatus)}`}
                >
                  {statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value} className={opt.colorClass}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </td>
              <td className="border p-2">Date: {order.date}</td>
              <td className="border p-2">Time: {currentTime.toLocaleTimeString()}</td>
            </tr>
          </tbody>
        </table>

        {/* Supplier Info */}
        <table className="w-full border mb-2 bg-purple-200">
          <tbody>
            <tr>
              <td className="border p-2">
                <strong>Supplier:</strong> {order.supplier}
              </td>
              <td className="border p-2" colSpan={3}>
                {/* Additional supplier details can go here */}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Order Items Details Section */}
        <div>
          <h3 className="text-l font-bold mb-2">Order Items Details</h3>
          {order.items && order.items.length > 0 ? (
            order.items.map((item, index) => (
              <div key={index} className="mb-4 border rounded p-2">
                <table className="w-full border mb-2">
                  <thead>
                    <tr className="bg-purple-300">
                      <th className="border p-1 text-center">Product ID</th>
                      <th className="border p-1 text-center">Brand</th>
                      <th className="border p-1 text-center">Model</th>
                      <th className="border p-1 text-center">Purchase Price</th>
                      <th className="border p-1 text-center">Quantity</th>
                      <th className="border p-1 text-center">Item Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border p-1 text-center">{item.id}</td>
                      <td className="border p-1 text-center">{item.brand}</td>
                      <td className="border p-1 text-center">{item.model}</td>
                      <td className="border p-1 text-center">₱{item.purchasePrice}</td>
                      <td className="border p-1 text-center">{item.quantity}</td>
                      <td className="border p-1 text-center">
                        ₱{(item.purchasePrice * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
                {item.serials && item.serials.length > 0 && (
                  <table className="w-full border">
                    <thead>
                      <tr className="bg-purple-300">
                        <th className="border p-1 text-center">Serial Number</th>
                        <th className="border p-1 text-center">Warranty Duration</th>
                        <th className="border p-1 text-center">Warranty Time</th>                        
                        <th className="border p-1 text-center">Damage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {item.serials.map((serial, sIndex) => {
                        let remainingSeconds = convertWarrantyDurationToSeconds(
                          item.warrantyDuration
                        );
                        if (poStatus === "Delivered") {
                          remainingSeconds = Math.max(remainingSeconds - 0, 0);
                        }
                        return (
                          <tr key={sIndex} className="border-t">
                            <td className="border p-1 text-center">
                              {item.id}-{serial.id}
                            </td>
                            <td className="border p-1 text-center">
                              {item.warrantyDuration}
                            </td>
                            <td className="border p-1 text-center">
                              {poStatus === "Delivered"
                                ? formatTime(remainingSeconds)
                                : "Not started"}
                            </td>                            
                            <td className="border p-1 text-center">
                              {serial.damage ? "✅" : "❌"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            ))
          ) : (
            <p>No order items found.</p>
          )}
        </div>

        {/* Existing Auditing Section if Delivered */}
        {poStatus === "Delivered" && (
          <div className="flex flex-col flex-grow mt-4">
            <h3 className="text-xl font-bold mb-2">Audit Items</h3>
            <div className="overflow-y-auto flex-grow border rounded p-2 mb-4">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2 border-b last:border-b-0 flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold">
                      {item.brand} {item.model} (Qty: {item.quantity})
                    </p>
                    <p className="text-sm text-gray-600">
                      Item Total: ₱{(item.purchasePrice * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name={`assignment-${idx}`}
                        value="approved"
                        checked={assignments[idx] === "approved"}
                        onChange={(e) => handleAssignmentChange(idx, e.target.value)}
                      />
                      Approved
                    </label>
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name={`assignment-${idx}`}
                        value="damaged"
                        checked={assignments[idx] === "damaged"}
                        onChange={(e) => handleAssignmentChange(idx, e.target.value)}
                      />
                      Damaged
                    </label>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="border rounded p-2">
                <h4 className="font-bold text-green-600 mb-2">
                  Approved Items (Audit true, Damage false)
                </h4>
                <table className="w-full">
                  <thead>
                    <tr className="bg-green-100">
                      <th className="border p-1 text-center">Product</th>
                      <th className="border p-1 text-center">Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items
                      .filter((_, i) => assignments[i] === "approved")
                      .map((itm, i) => (
                        <tr key={i} className="border-t">
                          <td className="border p-1 text-center">
                            {itm.brand} {itm.model}
                          </td>
                          <td className="border p-1 text-center">{itm.quantity}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              <div className="border rounded p-2">
                <h4 className="font-bold text-red-600 mb-2">
                  Damaged Items (Audit true, Damage true)
                </h4>
                <table className="w-full">
                  <thead>
                    <tr className="bg-red-100">
                      <th className="border p-1 text-center">Product</th>
                      <th className="border p-1 text-center">Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items
                      .filter((_, i) => assignments[i] === "damaged")
                      .map((itm, i) => (
                        <tr key={i} className="border-t">
                          <td className="border p-1 text-center">
                            {itm.brand} {itm.model}
                          </td>
                          <td className="border p-1 text-center">{itm.quantity}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {allAssigned && (
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={handleSendToInventory}
              >
                Send to Inventory
              </button>
            )}
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 self-end"
        >
          Close
        </button>
      </div>
    </div>
  );
}

// -----------------------
// Main PurchaseOrderPage Component
// -----------------------
const PurchaseOrderPage = () => {
  const navigate = useNavigate();

  // PURCHASE ORDERS STATE
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Simulate fetching purchase orders (replace with API call as needed)
  // DUMMY DATA FOR PURCHASE ORDER TABLE
  useEffect(() => {
    const suppliers = [
      { name: "Hardware World" },{ name: "CD-R King" },{ name: "MGM Marketing Inc." },{ name: "Sara Davis" },{ name: "Mike Tyson Inc." },
    ];
    
    setPurchaseOrders([...Array(5)].map((_, i) => ({
      id: i + 1,
      poNumber: `#PO${(i + 1).toString().padStart(2, '0')}`,
      supplier: suppliers[i % suppliers.length].name,
      date: `2023-01-${(i + 1).toString().padStart(2, '0')}`,
      total: `₱${(10000 + i * 1000).toLocaleString()}.00`,
      status: i % 4 === 0 ? "Order Placed" : i % 4 === 1 ? "Shipped" : i % 4 === 2 ? "Delivered" : "In Progress",
      employee: "admin@pgmicro.com",
    })));
  }, []);

  const filteredOrders = purchaseOrders.filter((order) => {
    const matchesSearch =
      order.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Handler to change order status
  const handleStatusChange = (orderId, newStatus) => {
    setPurchaseOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  // PRODUCT MODAL & CRUD
  const [showProductModal, setShowProductModal] = useState(false);
  const [products, setProducts] = useState([
    {
      id: 1,
      brand: "Acer",
      model: "Predator",
      description: "Gaming Laptop",
      purchasePrice: 55000,
      reorderPoint: 10,
      warrantyDuration: "1 Year",      
      damage: false,
      isEditing: false,
    },
    {
      id: 2,
      brand: "Corsair",
      model: "K68",
      description: "Mechanical Keyboard",
      purchasePrice: 3500,
      reorderPoint: 20,
      warrantyDuration: "6 Months",
      damage: false,
      isEditing: false,
    },
  ]);

  const [newProduct, setNewProduct] = useState({
    description: "",
    purchasePrice: 0,
    reorderPoint: 0,
    warrantyDuration: "",
    model: "",
    brand: "",
    damage: false,
  });

  const handleAddProduct = () => {
    setProducts([...products, { id: products.length + 1, ...newProduct, isEditing: false }]);
    setNewProduct({
      description: "",
      purchasePrice: 0,
      reorderPoint: 0,
      warrantyDuration: "",
      model: "",
      brand: "",
      damage: false,
    });
  };
  const handleEditProduct = (index) => {
    const updated = [...products];
    updated[index].isEditing = !updated[index].isEditing;
    setProducts(updated);
  };  
  const handleDamageChange = (e, index) => {
    handleChangeProduct(index, "damage", e.target.value === "true");
  };
  const handleChangeProduct = (index, field, value) => {
    const updated = [...products];
    updated[index][field] = value;
    setProducts(updated);
  };
  const handleDeleteProduct = (id) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  // SUPPLIER MODAL & CRUD
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [suppliers, setSuppliers] = useState([
    {
      id: 1,
      name: "Hardware World",
      address: "123 Main St, Davao City",
      email: "info@hardwareworld.com",
      contact: "0912-345-6789",
      isEditing: false,
    },
    {
      id: 2,
      name: "CD-R King",
      address: "456 IT Park, Cebu City",
      email: "support@cdrking.com",
      contact: "0901-234-5678",
      isEditing: false,
    },
    {
      id: 3,
      name: "MGM Marketing Inc.",
      address: "789 Market St, Manila",
      email: "contact@mgm.com",
      contact: "0934-567-8910",
      isEditing: false,
    },
  ]);
  const [newSupplier, setNewSupplier] = useState({
    name: "",
    address: "",
    email: "",
    contact: "",
  });

  const handleAddSupplier = () => {
    setSuppliers([...suppliers, { id: suppliers.length + 1, ...newSupplier, isEditing: false }]);
    setNewSupplier({ name: "", address: "", email: "", contact: "" });
  };
  const handleEditSupplier = (index) => {
    const updated = [...suppliers];
    updated[index].isEditing = !updated[index].isEditing;
    setSuppliers(updated);
  };
  const handleChangeSupplier = (index, field, value) => {
    const updated = [...suppliers];
    updated[index][field] = value;
    setSuppliers(updated);
  };
  const handleDeleteSupplier = (id) => {
    setSuppliers(suppliers.filter((s) => s.id !== id));
  };

  // CREATE PO MODAL
  const [showCreatePOModal, setShowCreatePOModal] = useState(false);
  const [poCurrentTime, setPoCurrentTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setPoCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);
  const poCurrentDate = formatDateToYMD(poCurrentTime);
  const newPOId = 6;
  const [poStatus, setPoStatus] = useState("Order Placed");

  // Order Items and Serial Collapse State
  const [orderItems, setOrderItems] = useState([]);
  const [serialsCollapsed, setSerialsCollapsed] = useState({});
  useEffect(() => {
    setSerialsCollapsed((prev) => {
      const newState = {};
      for (const item of orderItems) {
        newState[item.id] = prev[item.id] !== undefined ? prev[item.id] : false;
      }
      return newState;
    });
  }, [orderItems]);

  const toggleSerialsVisibility = (itemId) => {
    setSerialsCollapsed((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const [poSupplierSearch, setPoSupplierSearch] = useState("");
  const [poSelectedSupplier, setPoSelectedSupplier] = useState(null);
  const handlePoSupplierSearchChange = (e) => {
    setPoSupplierSearch(e.target.value);
    const found = suppliers.find(
      (s) => s.name.toLowerCase() === e.target.value.toLowerCase()
    );
    setPoSelectedSupplier(found || null);
  };
  const handleRemoveSupplier = () => {
    setPoSupplierSearch("");
    setPoSelectedSupplier(null);
  };

  const [poProductSearch, setPoProductSearch] = useState("");
  const [poSelectedProduct, setPoSelectedProduct] = useState(null);
  const handlePoProductSearchChange = (e) => {
    setPoProductSearch(e.target.value);
    const found = products.find(
      (p) => p.model.toLowerCase() === e.target.value.toLowerCase()
    );
    setPoSelectedProduct(found || null);
  };

  const handleAddOrderItem = () => {
    if (poSelectedProduct) {
      const newItem = {
        ...poSelectedProduct,
        quantity: 1,
        serials: [
          {
            id: 1,            
            damage: false,
            isEditing: false,
          },
        ],
      };
      setOrderItems([...orderItems, newItem]);
      setPoProductSearch("");
      setPoSelectedProduct(null);
    }
  };

  const removeOrderItem = (index) => {
    const updated = [...orderItems];
    updated.splice(index, 1);
    setOrderItems(updated);
  };

  const handleOrderItemQuantityChange = (index, newQty) => {
    const updated = [...orderItems];
    const item = updated[index];
    const qty = parseInt(newQty) || 1;
    item.quantity = qty;
    while (item.serials.length < qty) {
      item.serials.push({
        id: item.serials.length + 1,
        damage: false,
        isEditing: false,
      });
    }
    while (item.serials.length > qty) {
      item.serials.pop();
    }
    updated[index] = item;
    setOrderItems(updated);
  };

  const orderTotal = orderItems.reduce(
    (sum, item) => sum + item.purchasePrice * item.quantity,
    0
  );

  const handleAddPO = () => {
    if (!poSelectedSupplier) {
      alert("Please select a supplier first.");
      return;
    }
    if (orderItems.length === 0) {
      alert("Please add at least one product.");
      return;
    }
    const newPO = {
      id: newPOId,
      poNumber: `#${newPOId}`,
      supplier: poSelectedSupplier.name,
      date: formatDateToYMD(poCurrentTime),
      time: poCurrentTime.toLocaleTimeString(),
      status: poStatus,
      items: orderItems,
      total: orderTotal.toFixed(2),
      employee: sessionStorage.getItem("userEmail") || "Unknown",
    };
    setPurchaseOrders([...purchaseOrders, newPO]);
    setShowCreatePOModal(false);
    setPoSupplierSearch("");
    setPoSelectedSupplier(null);
    setPoProductSearch("");
    setPoSelectedProduct(null);
    setOrderItems([]);
    setPoStatus("Order Placed");
    alert("Purchase Order Created!");
  };

  // VIEW DETAILS MODAL
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  return (
    <DashboardLayout>
      <div className="p-2 rounded bg-yellow-400 min-h-screen">

        {/* Sticky Header + Filters Container */}
        <div className="bg-purple-300 rounded sticky top-0 z-20 px-2 space-y-2">
          {/* Page Header */}
          <h1 className="text-2xl font-bold text-purple-700">Issued Purchase Orders</h1>

          {/* Filters and modals */}
          <div className="flex gap-4 mb-4 justify-between items-center py-2">
            <div className="flex gap-4">
              <button className="bg-gray-300 px-3 py-2 rounded">Status</button>
              <select
                className={`p-2 border border-purple-700 rounded ${getBackgroundColor(statusFilter)}`}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option className="bg-blue-300" value="All">
                  All
                </option>
                <option className="bg-purple-300" value="Order Placed">
                  Order Placed
                </option>
                <option className="bg-gray-300" value="Shipped">
                  Shipped
                </option>
                <option className="bg-green-300" value="Delivered">
                  Delivered
                </option>
                <option className="bg-yellow-300" value="In Progress">
                  In Progress
                </option>
              </select>
              <input
                type="text"
                placeholder="Search by PO id, Supplier, or Date"
                className="p-2 border border-purple-700 rounded w-[400px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-4">
              <button
                className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-800"
                onClick={() => setShowProductModal(true)}
              >
                View Products
              </button>
              <button
                className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-800"
                onClick={() => setShowSupplierModal(true)}
              >
                View Suppliers
              </button>
              <button
                className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-800"
                onClick={() => setShowCreatePOModal(true)}
              >
                + Create PO
              </button>
            </div>
          </div>
        </div>

        {/* Purchase Orders Table */}
        <table className="min-w-full bg-white border border-gray-300 rounded">
          <thead className="sticky top-[100px] z-20">
            <tr className="bg-purple-300 text-purple-800">
              <th className="p-2 text-left">Purchase Order ID</th>
              <th className="p-2 text-left">Employee</th>
              <th className="p-2 text-left">Date Issued</th>
              <th className="p-2 text-left">Supplier</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-right">Total</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id} className="border-t bg-purple-200 text-purple-700">
                <td className="p-1">{order.poNumber}</td>
                <td className="p-1">{order.employee}</td>
                <td className="p-1">{order.date}</td>
                <td className="p-1">{order.supplier}</td>
                <td className="p-1">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className={`border border-gray-300 rounded px-2 py-1 ${getBackgroundColor(order.status)}`}
                  >
                    {statusOptions.map((opt) => (
                      <option key={opt.value} value={opt.value} className={opt.colorClass}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-1 text-right">{order.total}</td>
                <td className="p-1">
                  <button onClick={() => {setSelectedOrder(order); setShowViewModal(true);}}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-800"
                  >
                    View details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* CREATE PO MODAL */}
        {showCreatePOModal && (
          <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-20">
            <div className="bg-purple-100 text-purple-800 p-6 rounded shadow-lg h-[700px] w-[1100px] flex flex-col">
              <h2 className="font-semibold">Create Purchase Order</h2>

              {/* PO Info Table */}
              <table className="w-full border">
                <tbody>
                  <tr className="bg-purple-200">
                    <td className="border p-2">Purchase Order ID: {newPOId}</td>
                    <td className="border p-2">Employee: {sessionStorage.getItem("userEmail") || "Unknown"}</td> {/* New Field */}
                    <td className="border p-2">
                      Status:
                      <select
                        value={poStatus}
                        disabled
                        onChange={(e) => setPoStatus(e.target.value)}
                        className={`border rounded ml-1 px-2 py-1 ${getBackgroundColor(poStatus)}`}
                      >
                        {statusOptions.map((opt) => (
                          <option key={opt.value} value={opt.value} className={opt.colorClass}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="border p-2">Date: {poCurrentDate}</td>
                    <td className="border p-2">Time: {poCurrentTime.toLocaleTimeString()}</td>
                  </tr>
                </tbody>
              </table>

              {/* Supplier Selection */}
              <p className="font-semibold">Select Supplier</p>
              <div className="flex gap-2 mb-1 items-center">
                <input
                  list="supplierList"
                  value={poSupplierSearch}
                  onChange={handlePoSupplierSearchChange}
                  placeholder="Search Supplier"
                  className="border p-2 rounded-t w-full bg-purple-200"
                />
                <button
                  className="bg-red-600 text-white px-4 py-2 rounded w-[140px]"
                  onClick={handleRemoveSupplier}
                >
                  Remove
                </button>
              </div>
              <datalist id="supplierList">
                {suppliers.map((s) => (
                  <option key={s.id} value={s.name} />
                ))}
              </datalist>
              <table className="w-full border mb-1 bg-purple-200">
                <tbody className="rounded-b">
                  {poSelectedSupplier ? (
                    <tr>
                      <td className="border p-2 rounded-b">
                        Name: {poSelectedSupplier.name}
                      </td>
                      <td className="border p-2">
                        Address: {poSelectedSupplier.address}
                      </td>
                      <td className="border p-2">
                        Email: {poSelectedSupplier.email}
                      </td>
                      <td className="border p-2">
                        Contact: {poSelectedSupplier.contact}
                      </td>
                    </tr>
                  ) : (
                    <tr>
                      <td className="border p-2" colSpan={4}>
                        No supplier selected
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Add Items Section */}
              <p className="font-semibold mb-1">Add Item/s</p>
              <div className="flex gap-2 mb-2 text-purple-800">
                <input
                  list="productList"
                  value={poProductSearch}
                  onChange={handlePoProductSearchChange}
                  placeholder="Search Product"
                  className="border p-2 rounded w-full bg-purple-200"
                />
                <datalist id="productList">
                  {products.map((p) => (
                    <option key={p.id} value={p.model} />
                  ))}
                </datalist>
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded w-[140px]"
                  onClick={handleAddOrderItem}
                >
                  Add Product
                </button>
              </div>

              {/* Order Items List */}
              <div className="flex-grow overflow-y-auto border rounded p-2 mb-2 bg-purple-200">
                {orderItems.map((item) => {
                  const collapsed = serialsCollapsed[item.id] || false;
                  return (
                    <div
                      key={item.id}
                      className={`mb-4 rounded p-2 border ${
                        item.id % 2 === 0 ? "bg-amber-200" : "bg-blue-200"
                      }`}
                    >
                      {/* Product Details Table */}
                      <table className="w-full mb-1">
                        <thead>
                          <tr className="bg-purple-300">
                            <th className="border p-1 text-center">Product ID</th>
                            <th className="border p-1 text-center">Brand</th>
                            <th className="border p-1 text-center">Model</th>
                            <th className="border p-1 text-center">Purchase Price</th>
                            <th className="border p-1 text-center">Quantity</th>
                            <th className="border p-1 text-center">Item Total</th>
                            <th className="border p-1 text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border p-1 text-center">{item.id}</td>
                            <td className="border p-1 text-center">{item.brand}</td>
                            <td className="border p-1 text-center">{item.model}</td>
                            <td className="border p-1 text-center">₱{item.purchasePrice}</td>
                            <td className="border p-1 text-center">
                              <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) =>
                                  handleOrderItemQuantityChange(
                                    orderItems.findIndex((x) => x.id === item.id),
                                    e.target.value
                                  )
                                }
                                className="border p-1 rounded w-16 text-center"
                              />
                            </td>
                            <td className="border p-1 text-center">
                              ₱{(item.purchasePrice * item.quantity).toFixed(2)}
                            </td>
                            <td className="border p-1 text-center">
                              <button
                                className="bg-red-600 text-white px-2 py-1 rounded"
                                onClick={() => {
                                  const idx = orderItems.findIndex((x) => x.id === item.id);
                                  removeOrderItem(idx);
                                }}
                              >
                                Remove
                              </button>
                              <button
                                className="bg-blue-600 text-white px-2 py-1 rounded ml-1 w-[80px]"
                                onClick={() => toggleSerialsVisibility(item.id)}
                              >
                                {collapsed ? "Expand" : "Collapse"}
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      {/* Serial Info Table */}
                      {!collapsed && (
                        <table className="w-full">
                          <thead>
                            <tr className="bg-purple-300">
                              <th className="border p-1 text-center">Serial Number</th>
                              <th className="border p-1 text-center">Warranty Duration</th>
                              <th className="border p-1 text-center">Warranty Time</th>
                              <th className="border p-1 text-center">Damage</th>
                            </tr>
                          </thead>
                          <tbody>
                            {item.serials.map((serial, sIndex) => {
                              let remainingSeconds = convertWarrantyDurationToSeconds(
                                item.warrantyDuration
                              );
                              if (poStatus === "Delivered") {
                                remainingSeconds = Math.max(remainingSeconds - 0, 0);
                              }
                              return (
                                <tr
                                  key={sIndex}
                                  className={`border-t ${serial.isEditing ? "bg-yellow-100" : ""}`}
                                >
                                  <td className="border p-1 text-center">
                                    {item.id}-{serial.id}
                                  </td>
                                  <td className="border p-1 text-center">
                                    {item.warrantyDuration}
                                  </td>
                                  <td className="border p-1 text-center">
                                    {poStatus === "Delivered"
                                      ? formatTime(remainingSeconds)
                                      : "Not started"}
                                  </td>                                  
                                  <td className="border p-1 text-center">
                                    <select
                                      disabled={!serial.isEditing}
                                      value={serial.damage ? "true" : "false"}
                                      onChange={(e) => {
                                        const idx = orderItems.findIndex((x) => x.id === item.id);
                                        const updated = [...orderItems];
                                        updated[idx].serials[sIndex].damage =
                                          e.target.value === "true";
                                        setOrderItems(updated);
                                      }}
                                      className={`px-2 py-1 ${getBackgroundColor(
                                        serial.damage ? "true" : "false"
                                      )}`}
                                    >
                                      <option className="bg-green-200" value="true">
                                        ✅
                                      </option>
                                      <option className="bg-red-200" value="false">
                                        ❌
                                      </option>
                                    </select>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Order Total */}
              <p className="text-m font-semibold mb-1 bg-amber-400 rounded pl-1">
                Order Total: ₱{orderTotal.toFixed(2)}
              </p>

              <div className="flex gap-2">
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded w-full"
                  onClick={handleAddPO}
                >
                  Finalize and Send
                </button>
                <button
                  className="bg-red-600 text-white px-4 py-2 rounded w-full"
                  onClick={() => setShowCreatePOModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PRODUCT MODAL */}
        {showProductModal && (
          <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-20">
            <div className="bg-purple-100 text-purple-700 p-6 rounded shadow-lg h-[600px] w-[1450px] flex flex-col">
              <div
                className={`overflow-x-auto flex-grow ${
                  products.length >= 4 ? "max-h-96 overflow-y-auto" : ""
                }`}
              >
                <h3 className="text-lg font-bold">Product List</h3>
                <table className="min-w-full bg-white border border-gray-300 rounded">
                  <thead className="sticky top-0 bg-purple-300">
                    <tr>
                      <th className="p-3 text-left w-[110px]">Product ID</th>
                      <th className="p-3 text-left">Brand</th>
                      <th className="p-3 text-left">Model</th>
                      <th className="p-3 text-left">Description</th>
                      <th className="p-3 text-left">Purchase Price</th>
                      <th className="p-3 text-left">Reorder Point</th>
                      <th className="p-3 text-left">Warranty Duration</th>
                      <th className="p-3 text-left">Damage</th>
                      <th className="p-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product, index) => (
                      <tr
                        key={product.id}
                        className={`border-t bg-purple-200 ${product.isEditing ? "bg-yellow-100" : ""}`}
                      >
                        <td className="p-1">{product.id}</td>
                        <td className="p-1">
                          <input
                            type="text"
                            className="p-1 w-full"
                            value={product.brand}
                            disabled={!product.isEditing}
                            onChange={(e) => handleChangeProduct(index, "brand", e.target.value)}
                          />
                        </td>
                        <td className="p-1">
                          <input
                            type="text"
                            className="p-1 w-full"
                            value={product.model}
                            disabled={!product.isEditing}
                            onChange={(e) => handleChangeProduct(index, "model", e.target.value)}
                          />
                        </td>
                        <td className="p-1">
                          <input
                            type="text"
                            className="p-1 w-full"
                            value={product.description}
                            disabled={!product.isEditing}
                            onChange={(e) =>
                              handleChangeProduct(index, "description", e.target.value)
                            }
                          />
                        </td>
                        <td className="p-1 flex">
                          <span>₱</span>
                          <input
                            type="text"
                            className="p-1 w-full"
                            value={product.purchasePrice}
                            disabled={!product.isEditing}
                            onChange={(e) =>
                              handleChangeProduct(index, "purchasePrice", e.target.value)
                            }
                          />
                        </td>
                        <td className="p-1">
                          <input
                            type="text"
                            className="p-1 w-full"
                            value={product.reorderPoint}
                            disabled={!product.isEditing}
                            onChange={(e) =>
                              handleChangeProduct(index, "reorderPoint", e.target.value)
                            }
                          />
                        </td>
                        <td className="p-1">
                          <input
                            type="text"
                            className="p-1 w-full"
                            value={product.warrantyDuration}
                            disabled={!product.isEditing}
                            onChange={(e) =>
                              handleChangeProduct(index, "warrantyDuration", e.target.value)
                            }
                          />
                        </td>                        
                        <td className="p-1">
                          <select
                            value={product.damage ? "true" : "false"}
                            disabled={!product.isEditing}
                            onChange={(e) => handleDamageChange(e, index)}
                            className={getBackgroundColor(product.damage ? "true" : "false")}
                          >
                            <option className="bg-green-200" value="true">
                              ✅
                            </option>
                            <option className="bg-red-200" value="false">
                              ❌
                            </option>
                          </select>
                        </td>
                        <td className="p-1 flex gap-2">
                          <button
                            className={`px-2 py-1 rounded w-[50px] text-white ${
                              product.isEditing ? "bg-green-600" : "bg-blue-600"
                            }`}
                            onClick={() => handleEditProduct(index)}
                          >
                            {product.isEditing ? "Save" : "Edit"}
                          </button>
                          <button
                            className="bg-red-600 px-2 py-1 rounded text-white"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Add New Product */}
              <div className="mt-4 grid grid-cols-3 gap-1">
                <h3 className="text-lg font-bold">New Product</h3>
                <div></div><div></div>
                <input
                  type="text"
                  placeholder="Brand"
                  value={newProduct.brand}
                  onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                  className="border p-2 rounded w-full mb-2"
                />
                <input
                  type="text"
                  placeholder="Model"
                  value={newProduct.model}
                  onChange={(e) => setNewProduct({ ...newProduct, model: e.target.value })}
                  className="border p-2 rounded w-full mb-2"
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="border p-2 rounded w-full mb-2"
                />
                <input
                  type="text"
                  placeholder="Purchase Price"
                  value={newProduct.purchasePrice}
                  onChange={(e) => setNewProduct({ ...newProduct, purchasePrice: e.target.value })}
                  className="border p-2 rounded w-full mb-2"
                />
                <input
                  type="text"
                  placeholder="Reorder Point"
                  value={newProduct.reorderPoint}
                  onChange={(e) => setNewProduct({ ...newProduct, reorderPoint: e.target.value })}
                  className="border p-2 rounded w-full mb-2"
                />
                <input
                  type="text"
                  placeholder="Warranty Duration"
                  value={newProduct.warrantyDuration}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, warrantyDuration: e.target.value })
                  }
                  className="border p-2 rounded w-full mb-2"
                />                
                <input
                  type="text"
                  placeholder="Damage"
                  value={newProduct.damage}
                  onChange={(e) => setNewProduct({ ...newProduct, damage: e.target.value })}
                  className="border p-2 rounded w-full"
                />                
                <button
                  className="bg-green-600 text-white rounded w-full"
                  onClick={handleAddProduct}
                >
                  Add Product
                </button>
                <button
                  className="bg-red-600 text-white rounded w-full"
                  onClick={() => setShowProductModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SUPPLIER MODAL */}
        {showSupplierModal && (
          <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-20">
            <div className="bg-purple-100 p-6 rounded shadow-lg h-[600px] w-[1200px] flex flex-col text-purple-700">
              <div
                className={`overflow-x-auto flex-grow ${
                  suppliers.length >= 4 ? "max-h-96 overflow-y-auto" : ""
                }`}
              >
                <h3 className="text-lg font-bold">Supplier List</h3>
                <table className="min-w-full bg-purple-200 border border-gray-300 rounded">
                  <thead className="sticky top-0">
                    <tr className="bg-purple-300 text-purple-700">
                      <th className="p-3 text-left w-[110px]">Supplier ID</th>
                      <th className="p-3 text-left">Name</th>
                      <th className="p-3 text-left">Address</th>
                      <th className="p-3 text-left">Email</th>
                      <th className="p-3 text-left">Contact Number</th>
                      <th className="p-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {suppliers.map((supplier, index) => (
                      <tr
                        key={supplier.id}
                        className={`border-t ${supplier.isEditing ? "bg-yellow-100" : ""}`}
                      >
                        <td className="p-1">{supplier.id}</td>
                        <td className="p-1">
                          <input
                            type="text"
                            className="p-1 w-full"
                            value={supplier.name}
                            onChange={(e) => handleChangeSupplier(index, "name", e.target.value)}
                            disabled={!supplier.isEditing}
                          />
                        </td>
                        <td className="p-1">
                          <input
                            type="text"
                            className="p-1 w-full"
                            value={supplier.address}
                            onChange={(e) =>
                              handleChangeSupplier(index, "address", e.target.value)
                            }
                            disabled={!supplier.isEditing}
                          />
                        </td>
                        <td className="p-1">
                          <input
                            type="email"
                            className="p-1 w-full"
                            value={supplier.email}
                            onChange={(e) => handleChangeSupplier(index, "email", e.target.value)}
                            disabled={!supplier.isEditing}
                          />
                        </td>
                        <td className="p-1">
                          <input
                            type="text"
                            className="p-1 w-full"
                            value={supplier.contact}
                            onChange={(e) =>
                              handleChangeSupplier(index, "contact", e.target.value)
                            }
                            disabled={!supplier.isEditing}
                          />
                        </td>
                        <td className="p-1 flex gap-2">
                          <button
                            className={`px-2 py-1 rounded w-[50px] text-white ${
                              supplier.isEditing ? "bg-green-600" : "bg-blue-600"
                            }`}
                            onClick={() => handleEditSupplier(index)}
                          >
                            {supplier.isEditing ? "Save" : "Edit"}
                          </button>
                          <button
                            className="bg-red-600 px-2 py-1 rounded text-white"
                            onClick={() => handleDeleteSupplier(supplier.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Add Supplier */}
              <div className="mt-4 grid grid-cols-2 gap-1">
                <h3 className="text-lg font-bold">New Supplier</h3>
                <div></div>
                <input
                  type="text"
                  placeholder="Supplier Name"
                  value={newSupplier.name}
                  onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                  className="border p-2 rounded w-full mb-2"
                />
                <input
                  type="text"
                  placeholder="Supplier Address"
                  value={newSupplier.address}
                  onChange={(e) => setNewSupplier({ ...newSupplier, address: e.target.value })}
                  className="border p-2 rounded w-full mb-2"
                />
                <input
                  type="email"
                  placeholder="Supplier Email"
                  value={newSupplier.email}
                  onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
                  className="border p-2 rounded w-full mb-2"
                />
                <input
                  type="text"
                  placeholder="Contact Number"
                  value={newSupplier.contact}
                  onChange={(e) => setNewSupplier({ ...newSupplier, contact: e.target.value })}
                  className="border p-2 rounded w-full mb-2"
                />
                <button
                  className="mt-4 bg-green-500 text-white px-4 py-2 rounded w-full"
                  onClick={handleAddSupplier}
                >
                  Add Supplier
                </button>
                <button
                  className="mt-4 bg-red-500 text-white px-4 py-2 rounded w-full"
                  onClick={() => setShowSupplierModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW DETAILS MODAL */}
        {showViewModal && selectedOrder && (
          <ViewPurchaseOrderModal
            order={selectedOrder}
            onClose={() => setShowViewModal(false)}
            onSendToInventory={(approvedItems, damagedItems) => {
              console.log("Approved Items:", approvedItems);
              console.log("Damaged Items:", damagedItems);
            }}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default PurchaseOrderPage;
