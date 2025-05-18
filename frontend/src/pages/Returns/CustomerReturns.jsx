import React, { useState, useEffect } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Search, Edit, Trash } from "lucide-react";


// Function to get background color based on customer type
function getBackgroundColor(value) {
  switch (value) {
    case "Walk-In": return "bg-green-100 text-green-800";
    case "Contract": return "bg-amber-100 text-amber-800";
    default: return "bg-white";
  }
}

const CustomerReturns = () => {
  const [editingCustomerId, setEditingCustomerId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formExpanded, setFormExpanded] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [newCustomer, setNewCustomer] = useState({
    name: "", 
    type: "Walk-In", 
    email: "", 
    address: "", 
    contact: ""
  });

  // Load customers when component mounts
  useEffect(() => {
    loadCustomers();
  }, []);

  // Function to load customers from localStorage
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

  const loadCustomers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/customers/`);
      const data = await res.json();
      setCustomers(data);
    } catch (error) {
      console.error("Failed to load customers from backend:", error);
    }
  };
  



  const handleSaveCustomer = async () => {
    if (!newCustomer.name || !newCustomer.email) {
      alert("Please fill in all required fields");
      return;
    }
  
    const payload = {
      name: newCustomer.name,
      customer_type: newCustomer.type,
      address: newCustomer.address,
      phone_number: newCustomer.contact,
      email: newCustomer.email,
    };
  
    try {
      if (editingCustomerId) {
        // UPDATE
        const res = await fetch(`${API_BASE_URL}/customers/${editingCustomerId}/`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to update customer");
        const updated = await res.json();
  
        setCustomers(prev => prev.map(c => c.id === updated.id ? updated : c));
      } else {
        // CREATE
        const res = await fetch(`${API_BASE_URL}/customers/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to create customer");
        const created = await res.json();
        setCustomers(prev => [...prev, created]);
      }
  
      // Reset form
      setNewCustomer({ name: "", type: "Walk-In", email: "", address: "", contact: "" });
      setEditingCustomerId(null);
    } catch (error) {
      console.error("Error saving customer:", error);
      alert("Error saving customer to backend.");
    }
  };
  
  

  // Function to handle form clear
  const handleClearForm = () => {
    setNewCustomer({
      name: "", 
      type: "Walk-In", 
      email: "", 
      address: "", 
      contact: ""
    });
  };

  // Function to handle edit customer
  const handleEditCustomer = (id) => {
    const customerToEdit = customers.find(c => c.id === id);
    if (customerToEdit) {
      setNewCustomer({
        name: customerToEdit.name,
        type: customerToEdit.customer_type,
        email: customerToEdit.email,
        address: customerToEdit.address,
        contact: customerToEdit.phone_number.toString()
      });
      setEditingCustomerId(id);
    }
  };
  

  // Function to handle delete customer
  const handleDeleteCustomer = (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      const updatedCustomers = customers.filter(customer => customer.id !== id);
      setCustomers(updatedCustomers);

    }
  };

  // Function to get initials for avatar
  const getInitials = (name) => {
    if (!name) return "";
    const nameParts = name.split(' ');
    if (nameParts.length === 1) {
      return nameParts[0].substring(0, 2).toUpperCase();
    }
    return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
  };

  // Filter customers based on search
  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.contact.includes(searchQuery)
  );

  return (
    <DashboardLayout>
      <div className="p-6 bg-white min-h-screen">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Client Directory</h1>
        </div>

        {/* Main Content */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Side - Register Form */}
          <div className="md:w-1/2">
            <div className="bg-indigo-600 rounded-lg overflow-hidden shadow-lg h-full">
              <div className="p-4 text-white text-xl font-semibold">
                Register New Client
              </div>
              <div className="bg-white p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Client Name<span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      className="w-full p-2 border border-gray-300 rounded-md" 
                      placeholder="Enter full name"
                      value={newCustomer.name}
                      onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Client Type
                    </label>
                    <div className="relative">
                      <select 
                        className="w-full p-2 border border-gray-300 rounded-md appearance-none pr-8"
                        value={newCustomer.type}
                        onChange={(e) => setNewCustomer({...newCustomer, type: e.target.value})}
                      >
                        <option value="Walk-In">Walk-In</option>
                        <option value="Contract">Contract</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email<span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="email" 
                      className="w-full p-2 border border-gray-300 rounded-md" 
                      placeholder="client@gmail.com"
                      value={newCustomer.email}
                      onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <textarea 
                      className="w-full p-2 border border-gray-300 rounded-md" 
                      placeholder="Complete address"
                      rows="3"
                      value={newCustomer.address}
                      onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
                    ></textarea>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Number
                    </label>
                    <input 
                      type="text" 
                      className="w-full p-2 border border-gray-300 rounded-md" 
                      placeholder="09XXXXXXXXX or +639XXXXXXXXX"
                      value={newCustomer.contact}
                      onChange={(e) => setNewCustomer({...newCustomer, contact: e.target.value})}
                    />
                  </div>
                  
                  <div className="flex justify-between pt-4">
                    <button 
                      className="px-4 py-2 bg-purple-700 text-white rounded-md hover:bg-purple-800"
                      onClick={handleClearForm}
                    >
                      Clear
                    </button>
                    <button 
                        className="px-4 py-2 bg-purple-700 text-white rounded-md hover:bg-purple-800"
                        onClick={handleSaveCustomer}
                      >
                        {editingCustomerId ? "Update" : "Save"}
                      </button>

                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Side - Client Registry */}
          <div className="md:w-1/2">
            <div className="bg-indigo-600 rounded-lg overflow-hidden shadow-lg h-full flex flex-col">
              <div className="p-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white">Client Registry</h2>
                <span className="text-white bg-indigo-700 px-2 py-1 rounded text-sm">
                  {filteredCustomers.length} clients
                </span>
              </div>
              
              <div className="bg-white flex-grow flex flex-col">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="col-span-4">CLIENT</div>
                  <div className="col-span-5">CONTACT INFORMATION</div>
                  <div className="col-span-1">TYPE</div>
                  <div className="col-span-2 text-right">ACTIONS</div>
                </div>
                
                {/* Search Bar */}
                <div className="px-4 py-2 border-b">
                  <div className="relative w-full">
                    <input
                      type="text"
                      placeholder="Search clients..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>
                
                {/* Table Content - Now with fixed height and scrolling */}
                <div className="divide-y divide-gray-200 overflow-y-auto" style={{ maxHeight: "320px" }}>
                  {filteredCustomers.length === 0 ? (
                    <div className="px-4 py-6 text-center text-sm text-gray-500">
                      No clients found. Create a new client to get started.
                    </div>
                  ) : (
                    filteredCustomers.map((customer) => (
                      <div key={customer.id} className="grid grid-cols-12 gap-4 px-4 py-4 items-center hover:bg-gray-50">
                        <div className="col-span-4 flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-800 font-medium">
                            {getInitials(customer.name)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                            <div className="text-xs text-gray-500">ID: {customer.id}</div>
                          </div>
                        </div>
                        <div className="col-span-5">
                          <div className="text-sm text-gray-900">{customer.email}</div>
                          <div className="text-sm text-gray-500">{customer.contact}</div>
                        </div>
                        {/* Type column */}
                        <div className="col-span-1 flex items-center justify-center">
                          <span className={`inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium ${
                            customer.type === "Walk-In" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {customer.customer_type}
                          </span>
                        </div>
                        <div className="col-span-2 text-right">
                          <button 
                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                            onClick={() => handleEditCustomer(customer.id)}
                          >
                            <Edit className="h-5 w-5 inline" />
                          </button>
                          <button 
                            className="text-red-600 hover:text-red-900"
                            onClick={() => handleDeleteCustomer(customer.id)}
                          >
                            <Trash className="h-5 w-5 inline" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                {/* Pagination */}
                {filteredCustomers.length > 0 && (
                  <div className="px-4 py-3 bg-white border-t border-gray-200 text-xs text-gray-500 mt-auto">
                    <div className="flex justify-between items-center">
                      <div>
                        Showing 1 to {Math.min(12, filteredCustomers.length)} of {filteredCustomers.length} results
                      </div>
                      <div className="flex space-x-1">
                        <button className="px-3 py-1 rounded border border-gray-300 bg-white">
                          1
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CustomerReturns;