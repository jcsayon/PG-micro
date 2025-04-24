import React, { useState, useEffect } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";

const CustomerList = () => {
  // State management
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    address: '',
    phone: '',
    type: 'Walk-In'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingCustomerId, setEditingCustomerId] = useState(null);
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    phone: ''
  });

  // Load customer data
  useEffect(() => {
    loadCustomerData();
  }, []);

  // Function to load customer data
  const loadCustomerData = () => {
    setIsLoading(true);
    
    // For now, load from localStorage
    loadCustomersFromLocalStorage();
    setIsLoading(false);
  };
  
  // Load customers from localStorage
  const loadCustomersFromLocalStorage = () => {
    const savedCustomers = localStorage.getItem('customersData');
    
    if (savedCustomers) {
      try {
        const parsedCustomers = JSON.parse(savedCustomers);
        console.log(`Loaded ${parsedCustomers.length} customers from localStorage`);
        setCustomers(parsedCustomers);
      } catch (error) {
        console.error("Error parsing customer data:", error);
        // Set default customers if parsing fails
        setCustomers([
          { id: 1, name: "Juan Dela Cruz", email: "juan@gmail.com", phone: "09123456789", address: "123 Main St, Davao City", type: "Walk-In" },
          { id: 2, name: "Maria Santos", email: "maria@gmail.com", phone: "09012345678", address: "456 IT Park, Cebu City", type: "Contract" }
        ]);
      }
    } else {
      console.warn("No customer data found in localStorage");
      // Set default customers if none found
      const defaultCustomers = [
        { id: 1, name: "Juan Dela Cruz", email: "juan@gmail.com", phone: "09123456789", address: "123 Main St, Davao City", type: "Walk-In" },
        { id: 2, name: "Maria Santos", email: "maria@gmail.com", phone: "09012345678", address: "456 IT Park, Cebu City", type: "Contract" }
      ];
      setCustomers(defaultCustomers);
      localStorage.setItem('customersData', JSON.stringify(defaultCustomers));
    }
  };
  
  // Save customers to localStorage
  const saveCustomersToLocalStorage = (customers) => {
    localStorage.setItem('customersData', JSON.stringify(customers));
  };

  // Validate customer data
  const validateCustomerData = () => {
    let isValid = true;
    const errors = {
      name: '',
      email: '',
      phone: ''
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
    if (newCustomer.phone.trim() && !(/^(\+639|09)\d{9}$/).test(newCustomer.phone)) {
      errors.phone = "Phone must start with 09 or +639 followed by 9 digits";
      isValid = false;
    }
    
    setFormErrors(errors);
    return isValid;
  };

  // Add or update customer
  const handleAddCustomer = () => {
    // Validate data types and required fields
    if (!validateCustomerData()) {
      return;
    }
    
    if (isEditing) {
      // Update existing customer
      const updatedCustomers = customers.map(customer => 
        customer.id === editingCustomerId ? { ...newCustomer, id: editingCustomerId } : customer
      );
      setCustomers(updatedCustomers);
      saveCustomersToLocalStorage(updatedCustomers);
      setIsEditing(false);
      setEditingCustomerId(null);
      alert("Client updated successfully!");
    } else {
      // Add new customer
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
      
      // Update state immediately to show the new customer in the list
      setCustomers(updatedCustomers);
      saveCustomersToLocalStorage(updatedCustomers);
      alert("Client added successfully!");
    }
    
    // Reset form
    resetCustomerForm();
  };

  // Edit customer
  const handleEditCustomer = (customerId) => {
    const customerToEdit = customers.find(c => c.id === customerId);
    if (customerToEdit) {
      setNewCustomer({...customerToEdit});
      setIsEditing(true);
      setEditingCustomerId(customerId);
    }
  };

  // Delete customer
  const handleDeleteCustomer = (customerId) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      // Remove the customer from the state
      const updatedCustomers = customers.filter(c => c.id !== customerId);
      setCustomers(updatedCustomers);
      saveCustomersToLocalStorage(updatedCustomers);
      
      if (isEditing && editingCustomerId === customerId) {
        resetCustomerForm();
      }
      
      alert("Client deleted successfully!");
    }
  };
  
  // Reset customer form
  const resetCustomerForm = () => {
    setNewCustomer({
      name: '',
      email: '',
      address: '',
      phone: '',
      type: 'Walk-In'
    });
    setIsEditing(false);
    setEditingCustomerId(null);
    setFormErrors({
      name: '',
      email: '',
      phone: ''
    });
  };

  // Filter customers based on search
  const filteredCustomers = customers.filter(customer => {
    return searchTerm === "" || 
           customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
           customer.phone.includes(searchTerm);
  });

  // Format initials from name
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <div className="p-4 h-screen flex flex-col">
      {/* Header and title with search bar to the right */}
      <div className="mb-3 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Client Directory</h1>
          <p className="text-gray-600">Add, view, and manage your client relationships</p>
        </div>
        
        {/* Search Bar - moved to right side */}
        <div className="w-72">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 p-3 border border-gray-300 rounded-lg w-full"
            />
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-grow">
        {/* Left card - Registration Form */}
        <div className="lg:col-span-5">
          <div className="bg-white shadow rounded-lg overflow-hidden h-full flex flex-col" style={{ maxHeight: "calc(100vh - 240px)" }}>
            <div className="bg-indigo-600 px-6 py-4">
              <h3 className="text-lg font-bold text-white">
                {isEditing ? "Update Client" : "Register New Client"}
              </h3>
            </div>
            
            <div className="p-5 flex-grow overflow-y-auto">
              {/* Form fields - with fixed spacing regardless of validation state */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-1">Client Name<span className="text-red-500">*</span></label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                  className={`px-3 py-2 border ${formErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-md w-full`}
                />
                <div className="h-5 mt-1">
                  {formErrors.name && <p className="text-xs text-red-500">{formErrors.name}</p>}
                </div>
              </div>
              
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-1">Client Type</label>
                <div className="relative">
                  <select
                    value={newCustomer.type}
                    onChange={(e) => setNewCustomer({...newCustomer, type: e.target.value})}
                    className="px-3 py-2 border border-gray-300 rounded-md w-full appearance-none"
                  >
                    <option value="Walk-In">Walk-In</option>
                    <option value="Contract">Contract</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
                <div className="h-5"></div> {/* Spacer to match other fields */}
              </div>
              
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email<span className="text-red-500">*</span></label>
                <input
                  type="text"
                  placeholder="client@gmail.com"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                  className={`px-3 py-2 border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-md w-full`}
                />
                <div className="h-5 mt-1">
                  {formErrors.email && <p className="text-xs text-red-500">{formErrors.email}</p>}
                </div>
              </div>
              
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  placeholder="Complete address"
                  value={newCustomer.address}
                  onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-md w-full"
                  rows="2"
                />
                <div className="h-5"></div> {/* Spacer to match other fields */}
              </div>
              
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                <input
                  type="text"
                  placeholder="09XXXXXXXXX or +639XXXXXXXXX"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                  className={`px-3 py-2 border ${formErrors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md w-full`}
                />
                <div className="h-5 mt-1">
                  {formErrors.phone && <p className="text-xs text-red-500">{formErrors.phone}</p>}
                </div>
              </div>
              
              <div className="flex justify-between pt-4 border-t border-gray-100">
                <button
                  onClick={resetCustomerForm}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center"
                  type="button"
                >
                  Clear
                </button>
                
                <button
                  onClick={handleAddCustomer}
                  className="px-4 py-2 text-white rounded-md flex items-center bg-purple-700 hover:bg-purple-800 transition-colors"
                  type="button"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right card - Client Registry */}
        <div className="lg:col-span-7">
          <div className="bg-white shadow rounded-lg overflow-hidden h-full flex flex-col" style={{ maxHeight: "calc(100vh - 240px)" }}>
            {/* Fixed header - completely separate from content */}
            <div className="bg-indigo-600 px-6 py-4 border-b border-purple-800">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-white">Client Registry</h3>
                <div className="text-sm text-white bg-indigo-500 bg-opacity-50 rounded-full px-3 py-1">
                    {filteredCustomers.length} client{filteredCustomers.length !== 1 ? 's' : ''}
                    </div>
              </div>
            </div>
            
            {/* Fixed header for table columns */}
            <div className="bg-gray-50 border-b border-gray-200">
              <div className="grid grid-cols-12 px-6 py-3">
                <div className="col-span-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Client</div>
                <div className="col-span-5 text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Information</div>
                <div className="col-span-2 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Type</div>
                <div className="col-span-2 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Actions</div>
              </div>
            </div>
            
            {/* Scrollable content area with flexible height */}
            <div className="overflow-y-auto flex-grow">
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700"></div>
                  <p className="ml-3 text-base font-medium text-gray-600">Loading...</p>
                </div>
              ) : filteredCustomers.length === 0 ? (
                <div className="p-8 flex flex-col items-center justify-center text-center h-full">
                  <div className="bg-gray-100 rounded-full p-3 mb-4">
                    <svg className="w-12 h-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No clients found</h3>
                  <p className="text-gray-500 max-w-md">
                    {searchTerm ? 'Try adjusting your search criteria.' : 'Get started by adding your first client using the form.'}
                  </p>
                </div>
              ) : (
                <div>
                  {filteredCustomers.map((customer) => (
                    <div key={customer.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                      <div className="grid grid-cols-12 px-6 py-4">
                        {/* Client column */}
                        <div className="col-span-3">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                              <span className="text-purple-800 font-medium text-sm">
                                {getInitials(customer.name)}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                              <div className="text-sm text-gray-500">ID: {customer.id}</div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Contact Information column */}
                        <div className="col-span-5">
                          <div className="text-sm text-gray-900">{customer.email}</div>
                          <div className="text-sm text-gray-500">{customer.phone || "No phone provided"}</div>
                        </div>
                        
                        {/* Type column */}
                        <div className="col-span-2 flex items-center justify-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            customer.type === "Walk-In" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {customer.type}
                          </span>
                        </div>
                        
                        {/* Actions column */}
                        <div className="col-span-2 flex justify-center items-center space-x-3">
                          <button 
                            onClick={() => handleEditCustomer(customer.id)}
                            className="text-blue-600 hover:text-blue-900"
                            aria-label="Edit client"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => handleDeleteCustomer(customer.id)}
                            className="text-red-600 hover:text-red-900"
                            aria-label="Delete client"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Footer with pagination info */}
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredCustomers.length}</span> of{' '}
                <span className="font-medium">{filteredCustomers.length}</span> results
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerList;