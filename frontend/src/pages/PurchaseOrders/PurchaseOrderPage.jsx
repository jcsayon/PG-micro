import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar_Secondary from "../../components/Sidebar_Secondary";

// Convert a warranty duration string to seconds (simplified).
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

// For the Create PO status dropdown
const statusOptions = [
  { value: "Order Placed", color: "bg-purple-400" },
  { value: "Shipped", color: "bg-gray-500" },
  { value: "Delivered", color: "bg-green-500" },
  { value: "In Progress", color: "bg-yellow-400" },
];

const PurchaseOrderPage = () => {
  // --------------------------------
  // SIDEBAR COLLAPSE (unchanged)
  // --------------------------------
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebarCollapsed");
    return saved === "true";
  });
  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", isSidebarCollapsed);
  }, [isSidebarCollapsed]);

  const navigate = useNavigate();

  // --------------------------------
  // PURCHASE ORDERS TABLE (unchanged)
  // --------------------------------
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    setPurchaseOrders([
      {
        id: 1,
        poNumber: "#1234",
        supplier: "Hardware World",
        date: "2023-01-01",
        total: "₱199,100.00",
        status: "Order Placed",
      },
      {
        id: 2,
        poNumber: "#5678",
        supplier: "CD-R King",
        date: "2023-01-02",
        total: "₱50,050.00",
        status: "Shipped",
      },
      {
        id: 3,
        poNumber: "#9101",
        supplier: "MGM Marketing Inc.",
        date: "2023-01-03",
        total: "₱12,075.00",
        status: "Delivered",
      },
      {
        id: 4,
        poNumber: "#2345",
        supplier: "Sara Davis",
        date: "2023-01-04",
        total: "₱100,125.00",
        status: "Delivered",
      },
      {
        id: 5,
        poNumber: "#6789",
        supplier: "Mike Tyson Inc.",
        date: "2023-01-05",
        total: "₱55,625.00",
        status: "In Progress",
      },
    ]);
  }, []);

  const filteredOrders = purchaseOrders.filter((order) => {
    const matchesSearch =
      order.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // --------------------------------
  // PRODUCT MODAL & CRUD (unchanged)
  // --------------------------------
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
      audit: false,
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
      audit: false,
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
    audit: false,
    damage: false,
  });

  const handleAddProduct = () => {
    setProducts([
      ...products,
      { id: products.length + 1, ...newProduct, isEditing: false },
    ]);
    setNewProduct({
      description: "",
      purchasePrice: 0,
      reorderPoint: 0,
      warrantyDuration: "",
      model: "",
      brand: "",
      audit: false,
      damage: false,
    });
  };
  const handleEditProduct = (index) => {
    const updatedProducts = [...products];
    updatedProducts[index].isEditing = !updatedProducts[index].isEditing;
    setProducts(updatedProducts);
  };
  const handleAuditChange = (e, index) => {
    handleChangeProduct(index, "audit", e.target.value === "true");
  };
  const handleDamageChange = (e, index) => {
    handleChangeProduct(index, "damage", e.target.value === "true");
  };
  const handleChangeProduct = (index, field, value) => {
    const updatedProducts = [...products];
    updatedProducts[index][field] = value;
    setProducts(updatedProducts);
  };
  const handleDeleteProduct = (id) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  // --------------------------------
  // SUPPLIER MODAL & CRUD (unchanged)
  // --------------------------------
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
    setSuppliers([
      ...suppliers,
      { id: suppliers.length + 1, ...newSupplier, isEditing: false },
    ]);
    setNewSupplier({ name: "", address: "", email: "", contact: "" });
  };
  const handleEditSupplier = (index) => {
    const updatedSuppliers = [...suppliers];
    updatedSuppliers[index].isEditing = !updatedSuppliers[index].isEditing;
    setSuppliers(updatedSuppliers);
  };
  const handleChangeSupplier = (index, field, value) => {
    const updatedSuppliers = [...suppliers];
    updatedSuppliers[index][field] = value;
    setSuppliers(updatedSuppliers);
  };
  const handleDeleteSupplier = (id) => {
    setSuppliers(suppliers.filter((supplier) => supplier.id !== id));
  };

  // --------------------------------
  // NEW CREATE PO MODAL (with per-serial logic)
  // --------------------------------
  const [showCreatePOModal, setShowCreatePOModal] = useState(false);

  // Live-updating clock
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  const currentDate = currentTime.toLocaleDateString();

  // Example new PO ID
  const newPOId = 6;
  // PO status
  const [poStatus, setPoStatus] = useState("Order Placed");

  // Supplier selection
  const [supplierSearch, setSupplierSearch] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const handleSupplierSearchChange = (e) => {
    setSupplierSearch(e.target.value);
    const found = suppliers.find(
      (s) => s.name.toLowerCase() === e.target.value.toLowerCase()
    );
    setSelectedSupplier(found || null);
  };

  // Product selection for new PO items
  const [productSearch, setProductSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const handleProductSearchChange = (e) => {
    setProductSearch(e.target.value);
    const found = products.find(
      (p) => p.model.toLowerCase() === e.target.value.toLowerCase()
    );
    setSelectedProduct(found || null);
  };

  // Order items (each with `serials` array)
  const [orderItems, setOrderItems] = useState([]);

  // ADD a product => initialize serials with quantity=1
  const handleAddOrderItem = () => {
    if (selectedProduct) {
      const newItem = {
        ...selectedProduct,
        quantity: 1,
        // Each item now has its own array of serials
        serials: [
          {
            id: 1,
            audit: false,
            damage: false,
            isEditing: false,
          },
        ],
      };
      setOrderItems([...orderItems, newItem]);
      setProductSearch("");
      setSelectedProduct(null);
    }
  };

  // REMOVE an item
  const removeOrderItem = (index) => {
    const updated = [...orderItems];
    updated.splice(index, 1);
    setOrderItems(updated);
  };

  // QUANTITY CHANGE => sync `serials` length with the new quantity
  const handleOrderItemQuantityChange = (index, newQty) => {
    const updated = [...orderItems];
    const item = updated[index];
    const qty = parseInt(newQty) || 1;
    item.quantity = qty;

    // Ensure `item.serials` has exactly `qty` rows
    while (item.serials.length < qty) {
      item.serials.push({
        id: item.serials.length + 1,
        audit: false,
        damage: false,
        isEditing: false,
      });
    }
    while (item.serials.length > qty) {
      item.serials.pop();
    }

    setOrderItems(updated);
  };

  // Calculate total
  const orderTotal = orderItems.reduce(
    (sum, item) => sum + item.purchasePrice * item.quantity,
    0
  );

  // Finalize & Send
  const handleAddPO = () => {
    if (!selectedSupplier) {
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
      supplier: selectedSupplier.name,
      date: currentDate,
      time: currentTime.toLocaleTimeString(),
      status: poStatus,
      items: orderItems,
      total: orderTotal.toFixed(2),
    };
    // Add to the existing POs
    setPurchaseOrders([...purchaseOrders, newPO]);

    // Reset modal
    setShowCreatePOModal(false);
    setSupplierSearch("");
    setSelectedSupplier(null);
    setProductSearch("");
    setSelectedProduct(null);
    setOrderItems([]);
    setPoStatus("Order Placed");
    alert("Purchase Order Created!");
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar_Secondary
        isCollapsed={isSidebarCollapsed}
        toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Content */}
      <div className="flex-grow ml-64 p-6 bg-gray-50 min-h-screen">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-purple-600">
            Issued Purchase Orders
          </h1>
          <div className="flex gap-4">
            <button
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
              onClick={() => setShowProductModal(true)}
            >
              View Products
            </button>
            <button
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
              onClick={() => setShowSupplierModal(true)}
            >
              View Suppliers
            </button>
            <button
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              onClick={() => setShowCreatePOModal(true)}
            >
              + Create PO
            </button>
          </div>
        </div>

        {/* ---------------------------
            CREATE PO MODAL
        --------------------------- */}
        {showCreatePOModal && (
          <div className="fixed inset-0 bg-black/70 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-lg h-[700px] w-[1100px] flex flex-col">
              <h2 className="text-2xl font-bold mb-4">Create Purchase Order</h2>

              {/* Single-row table for PO ID, Status, Date, Time */}
              <table className="w-full border mb-4">
                <tbody>
                  <tr>
                    <td className="border p-2">
                      Purchase Order ID: {newPOId}
                    </td>
                    <td className="border p-2">
                      Status:{" "}
                      <select
                        value={poStatus}
                        onChange={(e) => setPoStatus(e.target.value)}
                        className="bg-white border rounded ml-1"
                      >
                        {statusOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.value}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="border p-2">Date: {currentDate}</td>
                    <td className="border p-2">
                      Time: {currentTime.toLocaleTimeString()}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Single-row table for Supplier Info */}
              <p className="font-semibold mb-1">Select Supplier</p>
              <input
                list="supplierList"
                value={supplierSearch}
                onChange={handleSupplierSearchChange}
                placeholder="Search Supplier"
                className="border p-2 rounded w-full mb-2"
              />
              <datalist id="supplierList">
                {suppliers.map((s) => (
                  <option key={s.id} value={s.name} />
                ))}
              </datalist>

              <table className="w-full border mb-4">
                <tbody>
                  {selectedSupplier ? (
                    <tr>
                      <td className="border p-2">
                        <strong>Name:</strong> {selectedSupplier.name}
                      </td>
                      <td className="border p-2">
                        <strong>Address:</strong> {selectedSupplier.address}
                      </td>
                      <td className="border p-2">
                        <strong>Email:</strong> {selectedSupplier.email}
                      </td>
                      <td className="border p-2">
                        <strong>Contact:</strong> {selectedSupplier.contact}
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

              {/* Add Item/s */}
              <p className="font-semibold mb-1">Add Item/s</p>
              <div className="flex gap-2 mb-2">
                <input
                  list="productList"
                  value={productSearch}
                  onChange={handleProductSearchChange}
                  placeholder="Search Product"
                  className="border p-2 rounded w-full"
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

              {/* Scrollable container for items */}
              <div className="flex-grow overflow-y-auto border rounded p-2 mb-2">
                {orderItems.map((item, index) => {
                  // For the warranty countdown (if status=Delivered)
                  return (
                    <div key={index} className="mb-4">
                      {/* Table 2: Product details */}
                      <table className="w-full mb-1">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border p-1 text-center">
                              Product ID
                            </th>
                            <th className="border p-1 text-center">Brand</th>
                            <th className="border p-1 text-center">Model</th>
                            <th className="border p-1 text-center">
                              Purchase Price
                            </th>
                            <th className="border p-1 text-center">Quantity</th>
                            <th className="border p-1 text-center">
                              Item Total
                            </th>
                            <th className="border p-1 text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border p-1 text-center">
                              {item.id}
                            </td>
                            <td className="border p-1 text-center">
                              {item.brand}
                            </td>
                            <td className="border p-1 text-center">
                              {item.model}
                            </td>
                            <td className="border p-1 text-center">
                              ₱{item.purchasePrice}
                            </td>
                            <td className="border p-1 text-center">
                              <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) =>
                                  handleOrderItemQuantityChange(
                                    index,
                                    e.target.value
                                  )
                                }
                                className="border p-1 rounded w-16 text-center"
                              />
                            </td>
                            <td className="border p-1 text-center">
                              ₱
                              {(
                                item.purchasePrice * item.quantity
                              ).toFixed(2)}
                            </td>
                            <td className="border p-1 text-center">
                              <button
                                className="bg-red-600 text-white px-2 py-1 rounded"
                                onClick={() => removeOrderItem(index)}
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      {/* Table 3: Serial info, warranty, etc. */}
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border p-1 text-center">
                              Serial Number
                            </th>
                            <th className="border p-1 text-center">
                              Warranty Duration
                            </th>
                            <th className="border p-1 text-center">
                              Warranty Time
                            </th>
                            <th className="border p-1 text-center">Audit</th>
                            <th className="border p-1 text-center">Damage</th>
                            <th className="border p-1 text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {item.serials.map((serial, sIndex) => {
                            // Simplistic countdown if status=Delivered
                            let remainingSeconds = convertWarrantyDurationToSeconds(
                              item.warrantyDuration
                            );
                            if (poStatus === "Delivered") {
                              remainingSeconds = Math.max(remainingSeconds - 0, 0);
                            }

                            return (
                              <tr
                                key={sIndex}
                                className={`border-t ${
                                  serial.isEditing ? "bg-yellow-100" : ""
                                }`}
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
                                    value={serial.audit ? "true" : "false"}
                                    onChange={(e) => {
                                      const updated = [...orderItems];
                                      updated[index].serials[sIndex].audit =
                                        e.target.value === "true";
                                      setOrderItems(updated);
                                    }}
                                  >
                                    <option value="true">✅</option>
                                    <option value="false">❌</option>
                                  </select>
                                </td>
                                <td className="border p-1 text-center">
                                  <select
                                    disabled={!serial.isEditing}
                                    value={serial.damage ? "true" : "false"}
                                    onChange={(e) => {
                                      const updated = [...orderItems];
                                      updated[index].serials[sIndex].damage =
                                        e.target.value === "true";
                                      setOrderItems(updated);
                                    }}
                                  >
                                    <option value="true">✅</option>
                                    <option value="false">❌</option>
                                  </select>
                                </td>
                                <td className="border p-1 text-center">
                                  <button
                                    className={`px-2 py-1 rounded text-white ${
                                      serial.isEditing
                                        ? "bg-green-600"
                                        : "bg-blue-600"
                                    }`}
                                    onClick={() => {
                                      const updated = [...orderItems];
                                      // Toggle isEditing
                                      updated[index].serials[sIndex].isEditing =
                                        !serial.isEditing;
                                      setOrderItems(updated);
                                    }}
                                  >
                                    {serial.isEditing ? "Save" : "Edit"}
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  );
                })}
              </div>

              {/* Order Total */}
              <p className="text-lg font-bold mb-4">
                Order Total: ₱{orderTotal.toFixed(2)}
              </p>

              {/* Finalize / Close */}
              <div className="flex gap-4">
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

        {/* PRODUCT MODAL (unchanged) */}
        {showProductModal && (
          <div className="fixed inset-0 bg-black/70 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-lg h-[600px] w-[1450px] flex flex-col">
              <div
                className={`overflow-x-auto flex-grow ${
                  products.length >= 4 ? "max-h-96 overflow-y-auto" : ""
                }`}
              >
                <h3 className="text-lg font-bold">Product List</h3>
                <table className="min-w-full bg-white border border-gray-300 rounded">
                  <thead className="sticky top-0 bg-gray-100">
                    <tr>
                      <th className="p-3 text-left w-[110px]">Product ID</th>
                      <th className="p-3 text-left">Brand</th>
                      <th className="p-3 text-left">Model</th>
                      <th className="p-3 text-left">Description</th>
                      <th className="p-3 text-left">Purchase Price</th>
                      <th className="p-3 text-left">Reorder Point</th>
                      <th className="p-3 text-left">Warranty Duration</th>
                      <th className="p-3 text-left">Audit</th>
                      <th className="p-3 text-left">Damage</th>
                      <th className="p-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product, index) => (
                      <tr
                        key={product.id}
                        className={`border-t ${
                          product.isEditing ? "bg-yellow-100" : ""
                        }`}
                      >
                        <td className="p-1">{product.id}</td>
                        <td className="p-1">
                          <input
                            type="text"
                            className="p-1 w-full"
                            value={product.brand}
                            disabled={!product.isEditing}
                            onChange={(e) =>
                              handleChangeProduct(index, "brand", e.target.value)
                            }
                          />
                        </td>
                        <td className="p-1">
                          <input
                            type="text"
                            className="p-1 w-full"
                            value={product.model}
                            disabled={!product.isEditing}
                            onChange={(e) =>
                              handleChangeProduct(index, "model", e.target.value)
                            }
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
                              handleChangeProduct(
                                index,
                                "warrantyDuration",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="p-1">
                          <select
                            value={product.audit ? true : false}
                            disabled={!product.isEditing}
                            onChange={(e) => handleAuditChange(e, index)}
                          >
                            <option value={true}>✅</option>
                            <option value={false}>❌</option>
                          </select>
                        </td>
                        <td className="p-1">
                          <select
                            value={product.damage ? true : false}
                            disabled={!product.isEditing}
                            onChange={(e) => handleDamageChange(e, index)}
                          >
                            <option value={true}>✅</option>
                            <option value={false}>❌</option>
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

              {/* Add Product (unchanged) */}
              <div className="mt-4 grid grid-cols-3 gap-1">
                <h3 className="text-lg font-bold">New Product</h3>
                <div></div>
                <div></div>
                <input
                  type="text"
                  placeholder="Brand"
                  value={newProduct.brand}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, brand: e.target.value })
                  }
                  className="border p-2 rounded w-full mb-2"
                />
                <input
                  type="text"
                  placeholder="Model"
                  value={newProduct.model}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, model: e.target.value })
                  }
                  className="border p-2 rounded w-full mb-2"
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={newProduct.description}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, description: e.target.value })
                  }
                  className="border p-2 rounded w-full mb-2"
                />
                <input
                  type="text"
                  placeholder="Purchase Price"
                  value={newProduct.purchasePrice}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, purchasePrice: e.target.value })
                  }
                  className="border p-2 rounded w-full mb-2"
                />
                <input
                  type="text"
                  placeholder="Reorder Point"
                  value={newProduct.reorderPoint}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, reorderPoint: e.target.value })
                  }
                  className="border p-2 rounded w-full mb-2"
                />
                <input
                  type="text"
                  placeholder="Warranty Duration"
                  value={newProduct.warrantyDuration}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      warrantyDuration: e.target.value,
                    })
                  }
                  className="border p-2 rounded w-full mb-2"
                />
                <input
                  type="text"
                  placeholder="Audit"
                  value={newProduct.audit}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, audit: e.target.value })
                  }
                  className="border p-2 rounded w-full mb-2"
                />
                <input
                  type="text"
                  placeholder="Damage"
                  value={newProduct.damage}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, damage: e.target.value })
                  }
                  className="border p-2 rounded w-full mb-2"
                />
                <div></div>
                <div></div>
                <button
                  className="mt-4 bg-green-500 text-white px-4 py-2 rounded w-full"
                  onClick={handleAddProduct}
                >
                  Add Product
                </button>
                <button
                  className="mt-4 bg-gray-500 text-white px-4 py-2 rounded w-full"
                  onClick={() => setShowProductModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------
            SUPPLIER MODAL (unchanged)
        --------------------------- */}
        {showSupplierModal && (
          <div className="fixed inset-0 bg-black/70 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-lg h-[600px] w-[1200px] flex flex-col">
              <div
                className={`overflow-x-auto flex-grow ${
                  suppliers.length >= 4 ? "max-h-96 overflow-y-auto" : ""
                }`}
              >
                <h3 className="text-lg font-bold">Supplier List</h3>
                <table className="min-w-full bg-white border border-gray-300 rounded">
                  <thead className="sticky top-0 bg-gray-100">
                    <tr className="bg-gray-100">
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
                        className={`border-t ${
                          supplier.isEditing ? "bg-yellow-100" : ""
                        }`}
                      >
                        <td className="p-1">{supplier.id}</td>
                        <td className="p-1">
                          <input
                            type="text"
                            className="p-1 w-full "
                            value={supplier.name}
                            onChange={(e) =>
                              handleChangeSupplier(index, "name", e.target.value)
                            }
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
                            onChange={(e) =>
                              handleChangeSupplier(index, "email", e.target.value)
                            }
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
                  onChange={(e) =>
                    setNewSupplier({ ...newSupplier, name: e.target.value })
                  }
                  className="border p-2 rounded w-full mb-2"
                />
                <input
                  type="text"
                  placeholder="Supplier Address"
                  value={newSupplier.address}
                  onChange={(e) =>
                    setNewSupplier({ ...newSupplier, address: e.target.value })
                  }
                  className="border p-2 rounded w-full mb-2"
                />
                <input
                  type="email"
                  placeholder="Supplier Email"
                  value={newSupplier.email}
                  onChange={(e) =>
                    setNewSupplier({ ...newSupplier, email: e.target.value })
                  }
                  className="border p-2 rounded w-full mb-2"
                />
                <input
                  type="text"
                  placeholder="Contact Number"
                  value={newSupplier.contact}
                  onChange={(e) =>
                    setNewSupplier({ ...newSupplier, contact: e.target.value })
                  }
                  className="border p-2 rounded w-full mb-2"
                />
                <button
                  className="mt-4 bg-green-500 text-white px-4 py-2 rounded w-full"
                  onClick={handleAddSupplier}
                >
                  Add Supplier
                </button>
                <button
                  className="mt-4 bg-gray-500 text-white px-4 py-2 rounded w-full"
                  onClick={() => setShowSupplierModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --------------------------------
            FILTERS & PURCHASE ORDERS TABLE
        --------------------------------*/}
        <div className="flex justify-start items-center mb-4">
          <div className="flex gap-4">
            <button className="bg-gray-200 px-3 py-2 rounded">Status</button>
            <select
              className="p-2 border border-gray-300 rounded"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Order Placed">Order Placed</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="In Progress">In Progress</option>
            </select>
            {/* Search bar */}
            <input
              type="text"
              placeholder="Search by PO number, Supplier, or Date"
              className="p-2 border border-gray-300 rounded w-[600px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Purchase Orders Table */}
        <table className="min-w-full bg-white border border-gray-300 rounded">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">Purchase Order ID</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Supplier</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-right">Total</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id} className="border-t">
                <td className="p-3">{order.poNumber}</td>
                <td className="p-3">{order.date}</td>
                <td className="p-3">{order.supplier}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-white ${
                      order.status === "Delivered"
                        ? "bg-green-500"
                        : order.status === "Shipped"
                        ? "bg-gray-500"
                        : order.status === "Order Placed"
                        ? "bg-purple-400"
                        : order.status === "In Progress"
                        ? "bg-yellow-400"
                        : ""
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="p-3 text-right">{order.total}</td>
                <td className="p-3">
                  <button
                    onClick={() =>
                      navigate("/purchase-orders/view", { state: { order } })
                    }
                    className="text-blue-500 hover:underline"
                  >
                    View details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PurchaseOrderPage;
