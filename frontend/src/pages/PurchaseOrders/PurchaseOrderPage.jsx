import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar_Primary from "../../components/Sidebar_Secondary";

const PurchaseOrderPage = () => {
  const navigate = useNavigate();
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // for Product Modal and Product List
  const [showProductModal, setShowProductModal] = useState(false);
  const [products, setProducts] = useState([
    { id: 1, brand: "Acer", model: "Predator", description: "Gaming Laptop", purchasePrice: 55000, reorderPoint: 10, warrantyDuration: "1 Year", audit: false, damage: false, isEditing: false },
    { id: 2, brand: "Corsair", model: "K68", description: "Mechanical Keyboard", purchasePrice: 3500, reorderPoint: 20, warrantyDuration: "6 Months", audit: false, damage: false, isEditing: false },
  ]);
  const [newProduct, setNewProduct] = useState({
    description: "", purchasePrice: 0, reorderPoint: 0, warrantyDuration: "", model: "", brand: "", audit: false, damage: false});

  // Product CRUD Functions
  const handleAddProduct = () => {
    setProducts([...products, { id: products.length + 1, ...newProduct, isEditing: false }]);
    setNewProduct({ description: "", purchasePrice: 0, reorderPoint: 0, warrantyDuration: "", model: "", brand: "", audit: false, damage: false });
  };

  const handleEditProduct = (index) => {
    const updatedProducts = [...products];
    updatedProducts[index].isEditing = !updatedProducts[index].isEditing; // Toggle edit mode
    setProducts(updatedProducts);
  };

  const handleChangeProduct = (index, field, value) => {
    const updatedProducts = [...products];
    updatedProducts[index][field] = value;
    setProducts(updatedProducts);
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  // for Supplier Modal and Supplier List
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [suppliers, setSuppliers] = useState([
    { id: 1, name: "Hardware World", address: "123 Main St, Davao City", email: "info@hardwareworld.com", contact: "0912-345-6789", isEditing: false },
    { id: 2, name: "CD-R King", address: "456 IT Park, Cebu City", email: "support@cdrking.com", contact: "0901-234-5678", isEditing: false },
    { id: 3, name: "MGM Marketing Inc.", address: "789 Market St, Manila", email: "contact@mgm.com", contact: "0934-567-8910", isEditing: false },
  ]);
  const [newSupplier, setNewSupplier] = useState({ name: "", address: "", email: "", contact: "" });
  // Purchase order table
  useEffect(() => {setPurchaseOrders([
      { id: 1, poNumber: "#1234", supplier: "Hardware World", date: "2023-01-01", total: "₱199,100.00", status: "Order Placed" },
      { id: 2, poNumber: "#5678", supplier: "CD-R King", date: "2023-01-02", total: "₱50,050.00", status: "Shipped" },
      { id: 3, poNumber: "#9101", supplier: "MGM Marketing Inc.", date: "2023-01-03", total: "₱12,075.00", status: "Delivered" },
    ]);}, []
  );

  const filteredOrders = purchaseOrders.filter((order) => {
    const matchesSearch =
      order.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // 🔹 NEW CHANGE: Supplier CRUD Functions
  const handleAddSupplier = () => {
    setSuppliers([...suppliers, { id: suppliers.length + 1, ...newSupplier, isEditing: false }]);
    setNewSupplier({ name: "", address: "", email: "", contact: "" });
  };

  const handleEditSupplier = (index) => {
    const updatedSuppliers = [...suppliers];
    updatedSuppliers[index].isEditing = !updatedSuppliers[index].isEditing; // Toggle edit mode
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

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar_Primary />

      {/* Main Content */}
      <div className="flex-grow ml-64 p-6 bg-gray-50 min-h-screen">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-purple-600">Issued Purchase Orders</h1>
          <div className="flex gap-4">
            <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
              onClick={() => setShowProductModal(true)}>View Products</button>
            {/* 🔹 NEW CHANGE: View Suppliers Button */}
            <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
              onClick={() => setShowSupplierModal(true)}>View Suppliers</button>
            <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              onClick={() => navigate("/purchase-orders/create")}>+ Create PO</button>
          </div>
        </div>

        {/* 🔹 Product Modal */}
        {showProductModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                <div className="bg-white p-6 rounded shadow-lg h-[600px] w-[1450px] flex flex-col">

                <div className={`overflow-x-auto flex-grow ${products.length >= 4 ? "max-h-96 overflow-y-auto" : ""}`}>
                  <table className="min-w-full bg-white border border-gray-300 rounded">
                    <thead className="sticky top-0 bg-gray-100">
                      <tr>
                        <th className="p-3 text-center w-[110px]">Product ID</th>
                        <th className="p-3 text-center">Brand</th>
                        <th className="p-3 text-center">Model</th>
                        <th className="p-3 text-center">Description</th>
                        <th className="p-3 text-center">Purchase Price</th>
                        <th className="p-3 text-center">Reorder Point</th>
                        <th className="p-3 text-center">Warranty Duration</th>
                        <th className="p-3 text-center">Audit</th>
                        <th className="p-3 text-center">Damage</th>
                        <th className="p-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product, index) => (
                        <tr key={product.id} className={`border-t ${product.isEditing ? "bg-yellow-100" : ""}`}>
                          <td className="p-1">{product.id}</td>
                          <td className="p-1">
                            <input type="text" className="p-1 w-full" 
                              value={product.brand} disabled={!product.isEditing}
                              onChange={(e) => handleChangeProduct(index, "brand", e.target.value)}
                            />
                          </td>
                          <td className="p-1">
                            <input type="text" className="p-1 w-full" 
                              value={product.model} disabled={!product.isEditing}
                              onChange={(e) => handleChangeProduct(index, "model", e.target.value)}
                            />
                          </td>
                          <td className="p-1">
                            <input type="text" className="p-1 w-full"
                              value={product.description} disabled={!product.isEditing}
                              onChange={(e) => handleChangeProduct(index, "description", e.target.value)}
                            />
                          </td>
                          <td className="p-1 flex">
                            <span>₱</span>
                            <input type="text" className="p-1 w-full"
                              value={product.purchasePrice} disabled={!product.isEditing}
                              onChange={(e) => handleChangeProduct(index, "purchasePrice", e.target.value)}
                            />
                          </td>
                          <td className="p-1">    
                            <input type="text" className="p-1 w-full" 
                              value={product.reorderPoint} disabled={!product.isEditing}
                              onChange={(e) => handleChangeProduct(index, "reorderPoint", e.target.value)}
                            />
                          </td>
                          <td className="p-1">
                            <input type="text" className="p-1 w-full" 
                              value={product.warrantyDuration} disabled={!product.isEditing}
                              onChange={(e) => handleChangeProduct(index, "warrantyDuration", e.target.value)}
                            />
                          </td>
                          <td className="p-1">{product.audit ? "✅" : "❌"}</td>
                          <td className="p-1">{product.damage ? "✅" : "❌"}</td>
                          <td className="p-1 flex gap-2">
                            <button 
                              className={`px-2 py-1 rounded w-[50px] text-white
                              ${product.isEditing ? "bg-green-600" : "bg-blue-600"}`} 
                              onClick={() => handleEditProduct(index)}
                            >
                              {product.isEditing ? "Save" : "Edit"}
                            </button>
                            <button 
                              className="bg-red-600 px-2 py-1 rounded text-white" 
                              onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Add Product */}
                <div className="mt-4 grid grid-cols-3 gap-1">
                  <h3 className="text-lg font-bold">Add New Product</h3>
                  <div></div>
                  <div></div>
                  <input
                    type="text" placeholder="Brand" value={newProduct.brand}
                    onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                    className="border p-2 rounded w-full mb-2"/>
                  <input
                    type="text" placeholder="Model" value={newProduct.model}
                    onChange={(e) => setNewProduct({ ...newProduct, model: e.target.value })}
                    className="border p-2 rounded w-full mb-2"/>
                  <input
                    type="text" placeholder="Description" value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    className="border p-2 rounded w-full mb-2"/>
                  <input
                    type="text" placeholder="Purchase Price" value={newProduct.purchasePrice}
                    onChange={(e) => setNewProduct({ ...newProduct, purchasePrice: e.target.value })}
                    className="border p-2 rounded w-full mb-2"/>
                  <input
                    type="text" placeholder="Reorder Point" value={newProduct.reorderPoint}
                    onChange={(e) => setNewProduct({ ...newProduct, reorderPoint: e.target.value })}
                    className="border p-2 rounded w-full mb-2"/>
                  <input
                    type="text" placeholder="Warranty Duration" value={newProduct.warrantyDuration}
                    onChange={(e) => setNewProduct({ ...newProduct, warrantyDuration: e.target.value })}
                    className="border p-2 rounded w-full mb-2"/>
                  <input
                    type="text" placeholder="Audit" value={newProduct.audit}
                    onChange={(e) => setNewProduct({ ...newProduct, audit: e.target.value })}
                    className="border p-2 rounded w-full mb-2"/>
                  <input
                    type="text" placeholder="Damage" value={newProduct.damage}
                    onChange={(e) => setNewProduct({ ...newProduct, damage: e.target.value })}
                    className="border p-2 rounded w-full mb-2"/>
                  <div></div>
                  <div></div>
                  <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded w-full" onClick={handleAddProduct}>
                    Add Product
                  </button>
                  <button className="mt-4 bg-gray-500 text-white px-4 py-2 rounded w-full" onClick={() => setShowProductModal(false)}>
                    Close
                  </button>
                </div>
                </div>
            </div>
        )}

        {/* 🔹 NEW CHANGE: Supplier Modal with Editable Inputs */}
        {showSupplierModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-lg h-[600px] w-[1200px] flex flex-col">
              
              <div className={`overflow-x-auto flex-grow ${suppliers.length >= 4 ? "max-h-96 overflow-y-auto" : ""}`}>
                <table className="min-w-full bg-white border border-gray-300 rounded">
                  <thead className="sticky top-0 bg-gray-100">
                    <tr className="bg-gray-100">
                      <th className="p-3 text-center w-[110px]">Supplier ID</th>
                      <th className="p-3 text-center">Name</th>
                      <th className="p-3 text-center">Address</th>
                      <th className="p-3 text-center">Email</th>
                      <th className="p-3 text-center">Contact Number</th>
                      <th className="p-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {suppliers.map((supplier, index) => (
                      <tr key={supplier.id} className={`border-t ${supplier.isEditing ? "bg-yellow-100" : ""}`}>
                        <td className="p-1">{supplier.id}</td>
                        <td className="p-1">
                          <input 
                            type="text" className="p-1 w-full " value={supplier.name} 
                            onChange={(e) => handleChangeSupplier(index, "name", e.target.value)}
                            disabled={!supplier.isEditing}
                          />
                        </td>
                        <td className="p-1">
                          <input 
                            type="text" className="p-1 w-full" value={supplier.address} 
                            onChange={(e) => handleChangeSupplier(index, "address", e.target.value)}
                            disabled={!supplier.isEditing}
                          />
                        </td>
                        <td className="p-1">
                          <input 
                            type="email" className="p-1 w-full" value={supplier.email} 
                            onChange={(e) => handleChangeSupplier(index, "email", e.target.value)}
                            disabled={!supplier.isEditing}
                          />
                        </td>
                        <td className="p-1">
                          <input 
                            type="text" className="p-1 w-full" value={supplier.contact} 
                            onChange={(e) => handleChangeSupplier(index, "contact", e.target.value)}
                            disabled={!supplier.isEditing}
                          />
                        </td>
                        <td className="p-1 flex gap-2">
                          <button 
                            className={`px-2 py-1 rounded w-[50px] text-white
                            ${supplier.isEditing ? "bg-green-600" : "bg-blue-600"}`} 
                            onClick={() => handleEditSupplier(index)}
                          >
                            {supplier.isEditing ? "Save" : "Edit"}
                          </button>
                          <button 
                            className="bg-red-600 px-2 py-1 rounded text-white" 
                            onClick={() => handleDeleteSupplier(supplier.id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Add Supplier */}
              <div className="mt-4 grid grid-cols-2 gap-1">
                <h3 className="text-lg font-bold">Add New Supplier</h3>
                <div>
                </div>
                <input
                  type="text" placeholder="Supplier Name" value={newSupplier.name}
                  onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                  className="border p-2 rounded w-full mb-2"
                />
                <input
                  type="text" placeholder="Supplier Address" value={newSupplier.address}
                  onChange={(e) => setNewSupplier({ ...newSupplier, address: e.target.value })}
                  className="border p-2 rounded w-full mb-2"
                />
                <input
                  type="email" placeholder="Supplier Email" value={newSupplier.email}
                  onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
                  className="border p-2 rounded w-full mb-2"
                />
                <input
                  type="text" placeholder="Contact Number" value={newSupplier.contact}
                  onChange={(e) => setNewSupplier({ ...newSupplier, contact: e.target.value })}
                  className="border p-2 rounded w-full mb-2"
                />
                <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded w-full" onClick={handleAddSupplier}>
                  Add Supplier
                </button>
                <button className="mt-4 bg-gray-500 text-white px-4 py-2 rounded w-full" onClick={() => setShowSupplierModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex justify-start items-center mb-4">
          <div className="flex gap-4">
            <button className="bg-gray-200 px-3 py-2 rounded">Status</button>
            <select className="p-2 border border-gray-300 rounded"
              value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Order Placed">Order Placed</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="In Progress">In Progress</option>
            </select>          
            <input type="text" placeholder="Search by PO number, Supplier, or Date"
              className="p-2 border border-gray-300 rounded w-[600px]"
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
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
                      order.status === "Delivered" ? "bg-green-500" :
                      order.status === "Shipped" ? "bg-gray-500" :
                      order.status === "Order Placed"? "bg-purple-400": 
                      order.status === "On Hold"? "bg-yellow-400": ""
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="p-3 text-right">{order.total}</td>
                <td className="p-3">
                  <button
                    onClick={() => navigate("/purchase-orders/view", { state: { order } })}
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
