import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";

// HEADER STATUS DROPDOWN COLOR 
function getBackgroundColor(value) {
  switch (value) {
    case "All": return "bg-blue-300 rounded";
    case "Walk-In": return "bg-green-300 rounded";
    case "Contract": return "bg-amber-300 rounded";
    default: return "bg-white";
  }
}

const allCategories = [
  'Processor', 'Motherboards', 'Video Cards', 'Monitors', 'Laptops', 'Printers', 'Toners', 'Inks', 'Networking', 'DSLR Camera',
  'CCTV Camera', 'Keyboard & Mouse', 'Webcam', 'Power Supply', 'Thin Client'
];

const dummyInventory = {
  Laptops: [
    { id: 1, name: 'ACER Aspire 5', price: 32000, serial: 'SN-ACER-001', image: 'https://via.placeholder.com/100' },
    { id: 2, name: 'HP Pavilion 14', price: 28000, serial: 'SN-HP-002', image: 'https://via.placeholder.com/100' },
    { id: 3, name: 'LENOVO IdeaPad 3', price: 30000, serial: 'SN-LENOVO-003', image: 'https://via.placeholder.com/100' },
    { id: 4, name: 'ASUS VivoBook', price: 31000, serial: 'SN-ASUS-004', image: 'https://via.placeholder.com/100' },
    { id: 5, name: 'DELL Inspiron', price: 29000, serial: 'SN-DELL-005', image: 'https://via.placeholder.com/100' },
    { id: 5, name: 'DELL Inspiron 2', price: 29000, serial: 'SN-DELL-006', image: 'https://via.placeholder.com/100' },
  ]
};

const ReturnWarrantyPage = () => {

  const navigate = useNavigate();
  const [returnOrders, setReturnOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // RETURN ORDER TABLE STATUS DROPDOWN COLOR
  const statusOptions = [
    { label: "Walk-In", value: "Walk-In", colorClass: "bg-green-200" },
    { label: "Contract", value: "Contract", colorClass: "bg-amber-200" },
  ];

  const handleStatusChange = (orderId, newStatus) => {
    setReturnOrders((prev) => prev.map((order) => order.id === orderId ? { ...order, status: newStatus } : order));
  };
  // RETURN ORDER TABLE STATUS DROPDOWN COLOR

  // VIEW CUSTOMER MODAL
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [customers, setCustomers] = useState([
    {id: 1, name: "Juan Dela Cruz", address: "123 Main St, Davao City", email: "juan@example.com", contact: "0912-345-6789", type: "Walk-In", isEditing: false,},
    {id: 2, name: "Maria Santos", address: "456 IT Park, Cebu City", email: "maria@example.com", contact: "0901-234-5678", type: "Contract", isEditing: false,},
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
  // VIEW CUSTOMER MODAL

  // CREATE RETURN ORDER MODAL
  const [showCreateROModal, setShowCreateROModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Laptops');
  const [cart, setCart] = useState([]);
  const addToCart = (product) => {
    setCart([...cart, product]);
  };
  const removeFromCart = (serial) => {
    setCart(cart.filter(item => item.serial !== serial));
  };
  // CREATE RETURN ORDER MODAL

  // DUMMY DATA FOR RETURN ORDER TABLE
  useEffect(() => {
    setReturnOrders([...Array(2)].map((_, i) => ({
      id: i + 1,
      roNumber: `#RO${(i + 1).toString().padStart(2, '0')}`,
      customer: customers[i % customers.length].name,
      date: `2023-01-${(i + 1).toString().padStart(2, '0')}`,
      total: `₱${(10000 + i * 1000).toLocaleString()}.00`,
      status: i % 2 === 0 ? "Walk-In" : "Contract",
      employee: "admin@pgmicro.com",
    })));
  }, []);

  const filteredOrders = returnOrders.filter((order) => {
    const matchesSearch = order.roNumber.toLowerCase().includes(searchQuery.toLowerCase()) || order.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout>
      <div className="p-2 rounded bg-blue-400 min-h-screen">
        <div className="bg-purple-300 rounded sticky top-0 z-20 px-2 space-y-2">
          <h1 className="text-2xl font-bold text-purple-700">Issued Return Orders</h1>

          <div className="flex gap-4 mb-4 justify-between items-center py-2">
            <div className="flex gap-4">
              <button className="bg-gray-300 px-3 py-2 rounded">Type</button>
              <select
                className={`p-2 border border-purple-700 rounded ${getBackgroundColor(statusFilter)}`}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option className="bg-blue-300" value="All">All</option>
                <option className="bg-green-300" value="Walk-In">Walk-In</option>
                <option className="bg-amber-300" value="Contract">Contract</option>
              </select>
              <input
                type="text"
                placeholder="Search by RO ID, Customer, or Date"
                className="p-2 border border-purple-700 rounded w-[400px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-4">
              <button
                className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-800"
                onClick={() => setShowCustomerModal(true)}
              >
                View Customers
              </button>
              <button
                className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-800"
                onClick={() => setShowCreateROModal(true)}
              >
                + Create RO
              </button>
            </div>
          </div>
        </div>

        {/* Return Orders Table */}
        <table className="min-w-full bg-white border border-gray-300 rounded">
          <thead className="sticky top-[100px] z-20">
            <tr className="bg-purple-300 text-purple-800">
              <th className="p-2 text-left">Return Order ID</th>
              <th className="p-2 text-left">Employee</th>
              <th className="p-2 text-left">Date Return</th>
              <th className="p-2 text-left">Customer</th>
              <th className="p-2 text-left">Type</th>
              <th className="p-2 text-right">Total</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id} className="border-t bg-purple-200 text-purple-700">
                <td className="p-1">{order.roNumber}</td>
                <td className="p-1">{order.employee}</td>
                <td className="p-1">{order.date}</td>
                <td className="p-1">{order.customer}</td>
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
                  <button
                    onClick={() => navigate("/return/view", { state: { order } })}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-800"
                  >
                    View details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* CUSTOMER MODAL */}
        {showCustomerModal && (
          <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-20">
            <div className="bg-purple-100 p-6 rounded shadow-lg h-[600px] w-[1200px] flex flex-col text-purple-700">
              <div className={`overflow-x-auto flex-grow ${customers.length >= 4 ? "max-h-96 overflow-y-auto" : ""}`}>
                <h3 className="text-lg font-bold">Customer List</h3>
                <table className="min-w-full bg-purple-200 border border-gray-300 rounded">
                  <thead className="sticky top-0">
                    <tr className="bg-purple-300 text-purple-700">
                      <th className="p-3 text-left w-[130px]">Customer ID</th>
                      <th className="p-3 text-left">Name</th>
                      <th className="p-3 text-left">Type</th>
                      <th className="p-3 text-left">Address</th>
                      <th className="p-3 text-left">Email</th>
                      <th className="p-3 text-left">Contact Number</th>
                      <th className="p-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((customer, index) => (
                      <tr key={customer.id} className={`border-t ${customer.isEditing ? "bg-yellow-100" : ""}`}>
                        <td className="p-1">{customer.id}</td>
                        <td className="p-1">
                          <input
                            type="text"
                            className="p-1 w-full"
                            value={customer.name}
                            onChange={(e) => handleChangeCustomer(index, "name", e.target.value)}
                            disabled={!customer.isEditing}
                          />
                        </td>
                        <td className="p-1">
                          <select
                            value={customer.type}
                            onChange={(e) => handleChangeCustomer(index, "type", e.target.value)}
                            disabled={!customer.isEditing}
                            className={`border border-gray-300 rounded px-2 py-1 w-full ${getBackgroundColor(customer.type)}`}
                          >
                            {statusOptions.map((opt) => (
                              <option key={opt.value} value={opt.value} className={opt.colorClass}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="p-1">
                          <input
                            type="text"
                            className="p-1 w-full"
                            value={customer.address}
                            onChange={(e) => handleChangeCustomer(index, "address", e.target.value)}
                            disabled={!customer.isEditing}
                          />
                        </td>
                        <td className="p-1">
                          <input
                            type="email"
                            className="p-1 w-full"
                            value={customer.email}
                            onChange={(e) => handleChangeCustomer(index, "email", e.target.value)}
                            disabled={!customer.isEditing}
                          />
                        </td>
                        <td className="p-1">
                          <input
                            type="text"
                            className="p-1 w-full"
                            value={customer.contact}
                            onChange={(e) => handleChangeCustomer(index, "contact", e.target.value)}
                            disabled={!customer.isEditing}
                          />
                        </td>
                        <td className="p-1 flex gap-2">
                          <button
                            className={`px-2 py-1 rounded w-[50px] text-white ${
                              customer.isEditing ? "bg-green-600" : "bg-blue-600"
                            }`}
                            onClick={() => handleEditCustomer(index)}
                          >
                            {customer.isEditing ? "Save" : "Edit"}
                          </button>
                          <button
                            className="bg-red-600 px-2 py-1 rounded text-white"
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
              <div className="mt-4 grid grid-cols-2 gap-1">
                <h3 className="text-lg font-bold">New Customer</h3>
                <div></div>
                <input type="text" placeholder="Customer Name" value={newCustomer.name} onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  className="border p-2 rounded w-full"
                />
                <select value={newCustomer.type} onChange={(e) => setNewCustomer({ ...newCustomer, type: e.target.value })}
                  className={`border p-2 rounded w-full ${getBackgroundColor(newCustomer.type)}`}>
                  {statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value} className={opt.colorClass}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <input type="text" placeholder="Customer Address" value={newCustomer.address} onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                  className="border p-2 rounded w-full"
                />
                <input type="email" placeholder="Customer Email" value={newCustomer.email} onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                  className="border p-2 rounded w-full"
                />
                <input type="text" placeholder="Contact Number" value={newCustomer.contact} onChange={(e) => setNewCustomer({ ...newCustomer, contact: e.target.value })}
                  className="border p-2 rounded w-full"
                />
                <div></div>
                <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded w-full" onClick={handleAddCustomer}>Add Customer</button>
                <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded w-full" onClick={() => setShowCustomerModal(false)}>Close</button>
              </div>
            </div>
          </div>
        )}
        
        {/* CREATE RO MODAL */}
        {showCreateROModal && (
          <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
            <div className="bg-purple-100 rounded-lg p-6 w-[1400px] h-[90vh] overflow-hidden shadow-xl">
              <div className="flex h-full gap-4">
                <div className="w-2/5 flex flex-col">
                  <label className="text-sm font-semibold mb-1">Categories</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="mb-3 p-2 rounded border border-purple-500"
                  >
                    {allCategories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <div className="overflow-y-auto space-y-3 pr-2 flex-1">
                    {(dummyInventory[selectedCategory] || []).map((product) => (
                      <div key={product.serial} className="bg-purple-700 text-white p-3 rounded flex gap-4 items-center shadow-md">
                        <img src={product.image} alt={product.name} className="w-16 h-16 rounded-md" />
                        <div className="flex-1">
                          <p className="text-xs italic">{selectedCategory}</p>
                          <h4 className="text-sm font-bold">{product.name}</h4>
                          <p className="text-xs">Serial: {product.serial}</p>
                          <p className="text-xs">Price: ₱{product.price.toLocaleString()}</p>
                        </div>
                        <button
                          onClick={() => addToCart(product)}
                          className="text-sm bg-white text-purple-700 font-semibold py-1 px-3 rounded hover:bg-purple-200"
                        >
                          Add to Cart
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="w-3/5 bg-purple-200 p-6 rounded-xl shadow-md flex flex-col max-h-full overflow-hidden">
                  <h2 className="text-l font-bold mb-4 text-purple-800">📝 Return Details</h2>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <input className="col-span-1 border p-2 rounded" placeholder="Return Order ID" />
                    <input className="col-span-1 border p-2 rounded" placeholder="Customer Name" />
                    <input className="col-span-2 border p-2 rounded" placeholder="Shipping Address" />
                    <input className="col-span-2 border p-2 rounded" placeholder="Contact Number" />
                    <input className="col-span-2 border p-2 rounded" type="date" />
                  </div>
                  <h3 className="text-md font-semibold mb-2 text-purple-700">🛒 Return Items</h3>
                  <div className="overflow-y-auto flex-1 max-h-[180px] space-y-2 mb-4 pr-1">
                    {cart.map((item) => (
                      <div
                        key={item.serial}
                        className="bg-purple-100 text-purple-800 p-3 rounded flex justify-between items-center shadow-sm"
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">{item.name}</span>
                          <span className="text-xs text-purple-600">Serial: {item.serial}</span>
                        </div>
                        <div className="flex gap-2 items-center">
                          <span className="font-semibold text-sm">₱{item.price.toLocaleString()}</span>
                          <button
                            onClick={() => removeFromCart(item.serial)}
                            className="text-xs text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-right font-semibold text-lg border-t pt-4">
                    Total: <span className="text-green-700">₱{cart.reduce((sum, item) => sum + item.price, 0).toLocaleString()}</span>
                  </div>
                  <div className="text-right mt-4 flex justify-between">
                    <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 font-semibold shadow-md">
                      Process Return
                    </button>
                    <button
                      className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 font-semibold shadow-md"
                      onClick={() => setShowCreateROModal(false)}
                    >
                      Close
                    </button>
                  </div>
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