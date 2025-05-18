import React, { useState, useEffect } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Search, Edit, Trash } from "lucide-react";

// Backend connection configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";
const CUSTOMERS_API = `${API_BASE_URL}/customers/`;

// Function to get background color based on customer type
function getBackgroundColor(type) {
  switch (type) {
    case "Walk-In": return "bg-green-100 text-green-800";
    case "Contract": return "bg-yellow-100 text-yellow-800";
    default: return "bg-gray-100 text-gray-800";
  }
}

const CustomerSales = () => {
  // State management
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [editingCustomerId, setEditingCustomerId] = useState(null);
  const [newCustomer, setNewCustomer] = useState({
    name: "", 
    type: "Walk-In", 
    email: "", 
    address: "", 
    contact: ""
  });
  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    contact: ""
  });

  // Load customers when component mounts
  useEffect(() => {
    fetchCustomers();
  }, []);

  // Fetch customers from backend API
  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(CUSTOMERS_API);
      if (!res.ok) throw new Error("Failed to fetch customers");
      const data = await res.json();
      
      // Map backend field names to our frontend field names if necessary
      const mappedData = data.map(customer => ({
        id: customer.id,
        name: customer.name,
        email: customer.email,
        contact: customer.phone_number || '',
        address: customer.address || '',
        type: customer.customer_type || 'Walk-In'
      }));
      
      setCustomers(mappedData);
      console.log("Successfully loaded customers from API");
    } catch (err) {
      console.error("Error fetching customers from API:", err);
      // Fallback to localStorage if API fails
      loadCustomersFromLocalStorage();
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load customers from localStorage (fallback)
  const loadCustomersFromLocalStorage = () => {
    const savedCustomers = localStorage.getItem('customersData');
    
    if (savedCustomers) {
      try {
        const parsedCustomers = JSON.parse(savedCustomers);
        console.log(`Loaded ${parsedCustomers.length} customers from localStorage`);
        setCustomers(parsedCustomers);
      } catch (error) {
        console.error("Error parsing customer data:", error);
        setDefaultCustomers();
      }
    } else {
      console.warn("No customer data found in localStorage");
      setDefaultCustomers();
    }
  };
  
  // Set default customers if needed
  const setDefaultCustomers = () => {
    const defaultCustomers = [
      { id: 1, name: "Juan Dela Cruz", email: "juan@gmail.com", contact: "09123456789", address: "123 Main St, Davao City", type: "Walk-In" },
      { id: 2, name: "Maria Santos", email: "maria@gmail.com", contact: "09012345678", address: "456 IT Park, Cebu City", type: "Contract" }
    ];
    setCustomers(defaultCustomers);
    localStorage.setItem('customersData', JSON.stringify(defaultCustomers));
  };
  
  // Save customers to localStorage (backup)
  const saveCustomersToLocalStorage = (updatedCustomers) => {
    localStorage.setItem('customersData', JSON.stringify(updatedCustomers));
  };

  // Validate customer data
  const validateCustomerData = () => {
    let isValid = true;
    const errors = {
      name: '',
      email: '',
      contact: ''
    };
    
    // Name validation
    if (!newCustomer.name.trim()) {
      errors.name = "Client name is required";
      isValid = false;
    }
    
    // Email validation - must end with @gmail.com
    if (!newCustomer.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!newCustomer.email.endsWith('@gmail.com')) {
      errors.email = "Email must be a Gmail address";
      isValid = false;
    }
    
    // Phone validation - must start with 09 or +639 followed by 9 digits
    if (newCustomer.contact.trim() && !(/^(\+639|09)\d{9}$/).test(newCustomer.contact)) {
      errors.contact = "Phone must start with 09 or +639 followed by 9 digits";
      isValid = false;
    }
    
    setFormErrors(errors);
    return isValid;
  };

  // Save or update customer
  const handleSaveCustomer = async () => {
    // Validate data types and required fields
    if (!validateCustomerData()) {
      return;
    }
    
    try {
      // Map frontend field names to backend field names
      const customerData = {
        name: newCustomer.name,
        email: newCustomer.email,
        address: newCustomer.address,
        phone_number: newCustomer.contact,
        customer_type: newCustomer.type
      };
      
      // Call API to save or update
      const url = editingCustomerId 
        ? `${CUSTOMERS_API}${editingCustomerId}/` 
        : CUSTOMERS_API;
      
      const method = editingCustomerId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(customerData)
      });
      
      if (!response.ok) {
        throw new Error(`API ${editingCustomerId ? 'update' : 'create'} failed with status: ${response.status}`);
      }
      
      const savedData = await response.json();
      
      // Map the response back to our frontend structure
      const savedCustomer = {
        id: savedData.id,
        name: savedData.name,
        email: savedData.email,
        contact: savedData.phone_number || '',
        address: savedData.address || '',
        type: savedData.customer_type || 'Walk-In'
      };
      
      // Update local state
      if (editingCustomerId) {
        const updatedCustomers = customers.map(c => 
          c.id === editingCustomerId ? savedCustomer : c
        );
        setCustomers(updatedCustomers);
        saveCustomersToLocalStorage(updatedCustomers);
      } else {
        const updatedCustomers = [...customers, savedCustomer];
        setCustomers(updatedCustomers);
        saveCustomersToLocalStorage(updatedCustomers);
      }
      
      // Clear form
      handleClearForm();
      alert(`Client ${editingCustomerId ? "updated" : "added"} successfully!`);
      
    } catch (error) {
      console.error(`Error ${editingCustomerId ? "updating" : "adding"} customer:`, error);
      alert(`Error ${editingCustomerId ? "updating" : "adding"} client. Falling back to local storage.`);
      
      // Fallback to localStorage if API fails
      fallbackSaveToLocalStorage();
    }
  };
  
  // Fallback save to localStorage if API fails
  const fallbackSaveToLocalStorage = () => {
    if (editingCustomerId) {
      // Update existing customer locally
      const updatedCustomers = customers.map(customer => 
        customer.id === editingCustomerId ? { ...newCustomer, id: editingCustomerId } : customer
      );
      setCustomers(updatedCustomers);
      saveCustomersToLocalStorage(updatedCustomers);
    } else {
      // Add new customer locally
      const newCustomerId = customers.length > 0 
        ? Math.max(...customers.map(c => c.id)) + 1 
        : 1;
        
      const updatedCustomers = [
        ...customers, 
        {
          ...newCustomer,
          id: newCustomerId
        }
      ];
      
      setCustomers(updatedCustomers);
      saveCustomersToLocalStorage(updatedCustomers);
    }
    
    // Reset form
    handleClearForm();
    alert(`Client ${editingCustomerId ? "updated" : "added"} successfully in offline mode!`);
  };

  const handleEditCustomer = (id) => {
  const customerToEdit = customers.find(c => c.id === id);
  if (customerToEdit) {
    setNewCustomer({
      ...customerToEdit,
      contact: customerToEdit.contact?.toString() || ''
    });
    setEditingCustomerId(id);
  }
};


  // Function to handle delete customer
  const handleDeleteCustomer = async (id) => {
    if (!window.confirm("Are you sure you want to delete this client?")) {
      return;
    }
    
    try {
      // Call API to delete
      const response = await fetch(`${CUSTOMERS_API}${id}/`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error(`API delete failed with status: ${response.status}`);
      }
      
      // Update local state
      const updatedCustomers = customers.filter(c => c.id !== id);
      setCustomers(updatedCustomers);
      saveCustomersToLocalStorage(updatedCustomers);
      
      if (editingCustomerId === id) {
        handleClearForm();
      }
      
      alert("Client deleted successfully!");
      
    } catch (error) {
      console.error("Error deleting customer:", error);
      alert("Error deleting client. Falling back to local storage.");
      
      // Fallback to localStorage if API fails
      const updatedCustomers = customers.filter(c => c.id !== id);
      setCustomers(updatedCustomers);
      saveCustomersToLocalStorage(updatedCustomers);
      
      if (editingCustomerId === id) {
        handleClearForm();
      }
      
      alert("Client deleted successfully in offline mode!");
    }
  };
  
  // Function to handle form clear
  const handleClearForm = () => {
    setNewCustomer({
      name: '',
      email: '',
      address: '',
      contact: '',
      type: 'Walk-In'
    });
    setEditingCustomerId(null);
    setFormErrors({
      name: '',
      email: '',
      contact: ''
    });
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
  const filteredCustomers = customers.filter(customer => {
    const term = searchQuery.toLowerCase();
    return customer.name.toLowerCase().includes(term) ||
           customer.email.toLowerCase().includes(term) ||
           (customer.contact && customer.contact.includes(term));
  });

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="px-1 py-6 max-w-9xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Client Directory</h1>
        </div>

        {/* Main Content */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Side - Register Form */}

          <div className="md:w-1/2">
            <div className="bg-indigo-600 rounded-lg overflow-hidden shadow-md">
              <div className="p-4 text-white text-xl font-semibold">
                {editingCustomerId ? "Update Client" : "Register New Client"}
              </div>
              <div className="bg-white p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Client Name<span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      className={`w-full p-2 border ${formErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                      placeholder="Enter full name"
                      value={newCustomer.name}
                      onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                    />
                    {formErrors.name && (
                      <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>
                    )}
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
                      className={`w-full p-2 border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                      placeholder="client@gmail.com"
                      value={newCustomer.email}
                      onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                    />
                    {formErrors.email && (
                      <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>
                    )}
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
                      className={`w-full p-2 border ${formErrors.contact ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                      placeholder="09XXXXXXXXX or +639XXXXXXXXX"
                      value={newCustomer.contact}
                      onChange={(e) => setNewCustomer({...newCustomer, contact: e.target.value})}
                    />
                    {formErrors.contact && (
                      <p className="text-xs text-red-500 mt-1">{formErrors.contact}</p>
                    )}
                  </div>
                  
                  <div className="flex justify-between pt-4">
                    <button 
                      className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                      onClick={handleClearForm}
                    >
                      Clear
                    </button>
                    <button 
                      className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
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
            <div className="bg-indigo-600 rounded-lg overflow-hidden shadow-md h-full flex flex-col">
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
                
                {/* Table Content */}
                <div className="divide-y divide-gray-200 overflow-y-auto flex-grow" style={{ maxHeight: "420px" }}>
                  {isLoading ? (
                    <div className="px-4 py-6 text-center text-sm text-gray-500">
                      <svg className="animate-spin h-5 w-5 mr-3 inline text-purple-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading clients...
                    </div>
                  ) : filteredCustomers.length === 0 ? (
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
                          <div className="text-sm text-gray-500">{customer.contact || "No phone provided"}</div>
                        </div>
                        {/* Type column */}
                        <div className="col-span-1 flex items-center justify-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBackgroundColor(customer.type)}`}>
                            {customer.type}
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
                  <div className="px-4 py-3 bg-white border-t border-gray-200 text-xs text-gray-500">
                    <div className="flex justify-between items-center">
                      <div>
                        Showing 1 to {Math.min(filteredCustomers.length, 10)} of {filteredCustomers.length} results
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
    </div>
  );
};

export default CustomerSales;