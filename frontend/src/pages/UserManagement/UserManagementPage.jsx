import React, { useState, useEffect } from "react";
import Sidebar_Primary from "../../components/Sidebar_Primary";
import { ROLES } from '../../utils/roleConfig';


const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

// Get status badge class - Simplified to just Active and Inactive
const getStatusBadgeClass = (status) => {
  switch(status) {
    case "Active": return "bg-green-100 text-green-800 border border-green-200";
    case "Inactive": return "bg-gray-100 text-gray-800 border border-gray-200";
    default: return "bg-gray-100 text-gray-800 border border-gray-200";
  }
};

// Fixed function to correctly map roles to accessible pages
const getAccessiblePagesByRole = (role) => {
  // Debug the role being passed
  console.log("Getting accessible pages for role:", role);
  
  // Make sure keys match the exact values used in your ROLES object and dropdown
  const accessMap = {
    [ROLES.ADMIN]: ['dashboard', 'user-management', 'inventory', 'sales', 'return-warranty', 'purchase-orders', 'reports'],
    [ROLES.INVENTORY]: ['dashboard', 'inventory'],
    [ROLES.SALES]: ['dashboard', 'sales'],
    "Returns": ['dashboard', 'return-warranty'],
    "Employee": ['dashboard'],
    "Purchase Order": ['dashboard', 'purchase-orders'],
    "Warranty List": ['dashboard', 'return-warranty']
  };
  
  // Fallback options for string-based roles
  const stringAccessMap = {
    "Admin": ['dashboard', 'user-management', 'inventory', 'sales', 'return-warranty', 'purchase-orders', 'reports'],
    "Inventory": ['dashboard', 'inventory'],
    "Sales": ['dashboard', 'sales'],
    "Returns": ['dashboard', 'return-warranty'],
    "Employee": ['dashboard'],
    "Purchase Order": ['dashboard', 'purchase-orders'],
    "Warranty List": ['dashboard', 'return-warranty']
  };
  
  // Try to get pages from the role-based map first, then try string map as fallback
  const pages = accessMap[role] || stringAccessMap[role] || ['dashboard'];
  console.log("Accessible pages assigned:", pages);
  return pages;
};

const UserManagementPage = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  
  // States for employee profiling
  const [activeTab, setActiveTab] = useState("employees"); // 'employees' or 'accounts'
  const [isAddingEmployee, setIsAddingEmployee] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isEditingEmployee, setIsEditingEmployee] = useState(false);
  const [showDeleteEmployeeConfirm, setShowDeleteEmployeeConfirm] = useState(false);

  // Debug ROLES on component mount
  useEffect(() => {
    console.log("ROLES object:", ROLES);
  }, []);

  // Current logged-in user (would typically come from auth context)
  // For demo purposes, we'll set it as Admin
  const currentUserRole = "Admin";

  // Initialize employees from local storage
  const [employees, setEmployees] = useState([]);

  const fetchEmployees = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/employees/`);
      const data = await res.json();
      setEmployees(data);
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  };
  
  useEffect(() => {
    fetchEmployees();
  }, []);
  

  // Save employees to local storage whenever employees change
  useEffect(() => {
    localStorage.setItem('employees', JSON.stringify(employees));
  }, [employees]);

  // Initialize users from local storage
  const [users, setUsers] = useState([]);

  const fetchAccounts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/accounts/`);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching accounts:", err);
    }
  };
  
  useEffect(() => {
    fetchAccounts();
  }, []);
  

  // Save users to local storage whenever users change
  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  // Sidebar collapse effect
  useEffect(() => {
    const collapsed = localStorage.getItem("sidebarCollapsed") === "true";
    setIsSidebarCollapsed(collapsed);
  }, []);

  // Employee form state
  const [employeeForm, setEmployeeForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    position: "",
    joinDate: new Date().toISOString().split('T')[0],
  });

  // User form state with module access - Simplified status options
  const [userForm, setUserForm] = useState({
    username: "",
    password: "",
    role: ROLES.SALES,
    status: "Active", // Default to Active
    modules: {
      admin: false,
      sales: false,
      inventory: false,
      returnWarranty: false,
      purchaseOrders: false,
      reports: false
    }
  });

  // Function to update module checkboxes based on selected role
  const updateModulesByRole = (role) => {
    // Default all modules to false
    const updatedModules = {
      admin: false,
      sales: false,
      inventory: false,
      returnWarranty: false,
      purchaseOrders: false,
      reports: false
    };
    
    // Set appropriate modules based on role
    switch(role) {
      case ROLES.ADMIN:
        updatedModules.admin = true;
        updatedModules.sales = true;
        updatedModules.inventory = true;
        updatedModules.returnWarranty = true;
        updatedModules.purchaseOrders = true;
        updatedModules.reports = true;
        break;
      case ROLES.SALES:
        updatedModules.sales = true;
        break;
      case ROLES.INVENTORY:
        updatedModules.inventory = true;
        break;
      case ROLES.RETURNS:
        updatedModules.returnWarranty = true;
        break;
      case ROLES.PURCHASE_ORDER:
        updatedModules.purchaseOrders = true;
        break;
      case ROLES.WARRANTY_LIST:
        updatedModules.returnWarranty = true;
        break;
      default:
        // For unrecognized roles, keep all modules unchecked
        break;
    }
    
    return updatedModules;
  };

  // Handle employee form input changes
  // Handle employee form input changes
const handleEmployeeChange = (e) => {
  const { name, value } = e.target;
  
  if (name === 'phone') {
    // Allow only numeric input and + symbol
    const phoneRegex = /^[0-9+]*$/;
    if (!phoneRegex.test(value)) {
      setPhoneError("Phone number can only contain numbers and + symbol");
      return;
    } else {
      setPhoneError("");
    }
  }
  
  setEmployeeForm(prev => ({ ...prev, [name]: value }));
};

  // Handle user form input changes
const handleUserChange = (e) => {
  const { name, value } = e.target;
  
  if (name === 'password' && !isEditing) {
    // Validate password length
    if (value.length !== 0 && value.length !== 8) {
      setPasswordError("Password must be exactly 8 characters long");
    } else {
      setPasswordError("");
    }
  }
  
  if (name === 'role') {
    // When role changes, update the modules automatically
    const updatedModules = updateModulesByRole(value);
    
    setUserForm(prev => ({
      ...prev,
      [name]: value,
      modules: updatedModules
    }));
  } else {
    // For other fields, just update the value
    setUserForm(prev => ({ ...prev, [name]: value }));
  }
};
  
  // Function to handle module checkbox changes
  const handleModuleChange = (module) => {
    setUserForm(prev => ({
      ...prev,
      modules: {
        ...prev.modules,
        [module]: !prev.modules[module]
      }
    }));
  };

  // Handle adding or updating employee
  const handleAddEmployee = async () => {
    if (!employeeForm.firstName || !employeeForm.lastName || !employeeForm.email) {
      alert("Please fill all required fields");
      return;
    }
  
    const newEmployee = {
      name: `${employeeForm.firstName} ${employeeForm.lastName}`,
      role: employeeForm.position,
      employee_status: "Active"
    };
  
    try {
      await fetch(`${API_BASE_URL}/employees/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEmployee)
      });
  
      await fetchEmployees(); // Refresh list
      resetForms();
    } catch (err) {
      console.error("Failed to add employee:", err);
      alert("Error saving employee");
    }
  };
  

  // Handle adding new user after employee creation
  const handleAddUser = async () => {
    if (!userForm.username || (!isEditing && !userForm.password)) {
      alert("Please fill all required fields");
      return;
    }
  
    const normalizedUsername = userForm.username.trim().toLowerCase();
    const accessiblePages = ['dashboard'];
    if (userForm.modules.admin) accessiblePages.push('user-management');
    if (userForm.modules.sales) accessiblePages.push('sales');
    if (userForm.modules.inventory) accessiblePages.push('inventory');
    if (userForm.modules.returnWarranty) accessiblePages.push('return-warranty');
    if (userForm.modules.purchaseOrders) accessiblePages.push('purchase-orders');
    if (userForm.modules.reports) accessiblePages.push('reports');
  
    const accountPayload = {
      employee: selectedEmployee.id,
      username: normalizedUsername,
      password: userForm.password,
      role: userForm.role,
      status: userForm.status,
      accessible_pages: accessiblePages
    };
  
    try {
      await fetch(`${API_BASE_URL}/accounts/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(accountPayload)
      });
  
      // Optionally patch employee status
      await fetch(`${API_BASE_URL}/employees/${selectedEmployee.id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employee_status: "Active" }) // or a boolean has_account: true
      });
  
      await fetchAccounts(); // Refresh
      await fetchEmployees(); // To reflect has_account
      resetForms();
    } catch (err) {
      console.error("Failed to add user:", err);
      alert("Error saving user");
    }
  };
  

  // Reset all forms and modal states
  const resetForms = () => {
    setEmployeeForm({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      position: "",
      joinDate: new Date().toISOString().split('T')[0],
    });

    setPhoneError("");
      setPasswordError("");
    
    // Initialize with Sales role and its default modules
    const initialRole = ROLES.SALES;
    const initialModules = updateModulesByRole(initialRole);
    
    setUserForm({
      username: "",
      password: "",
      role: initialRole,
      status: "Active",
      modules: initialModules
    });
    
    setIsAddingEmployee(false);
    setIsAddingUser(false);
    setIsEditingEmployee(false);
    setIsEditing(false);
    setSelectedEmployee(null);
    setSelectedUser(null);
    setShowPassword(false);
  };

  // Handle edit employee
  const handleEditEmployeeClick = (employee) => {
    setSelectedEmployee(employee);
    setEmployeeForm({
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phone: employee.phone || "",
      position: employee.position || "",
      joinDate: employee.joinDate
    });
    setIsEditingEmployee(true);
    setIsAddingEmployee(true);
  };

  // Handle delete employee
  const handleDeleteEmployeeClick = (employee) => {
    setSelectedEmployee(employee);
    setShowDeleteEmployeeConfirm(true);
  };

  // Confirm delete employee
  const confirmDeleteEmployee = async () => {
    try {
      if (selectedEmployee.hasAccount) {
        const relatedUser = users.find(user => user.employee === selectedEmployee.id);
        if (relatedUser) {
          await fetch(`${API_BASE_URL}/accounts/${relatedUser.id}/`, { method: 'DELETE' });
        }
      }
  
      await fetch(`${API_BASE_URL}/employees/${selectedEmployee.id}/`, {
        method: 'DELETE'
      });
  
      await fetchEmployees();
      await fetchAccounts();
      setShowDeleteEmployeeConfirm(false);
      setSelectedEmployee(null);
    } catch (err) {
      console.error("Error deleting employee:", err);
    }
  };
  

  // Handle edit user
  const handleEditClick = (user) => {
    console.log("handleEditClick called with user:", user);
    
    setSelectedUser(user);
    
    // Extract modules from user's accessible pages
    const modules = {
      admin: user.accessiblePages?.includes('user-management') || false,
      sales: user.accessiblePages?.includes('sales') || false,
      inventory: user.accessiblePages?.includes('inventory') || false,
      returnWarranty: user.accessiblePages?.includes('return-warranty') || false,
      purchaseOrders: user.accessiblePages?.includes('purchase-orders') || false,
      reports: user.accessiblePages?.includes('reports') || false
    };
    
    setUserForm({
      username: user.username,
      password: "********", // Don't show actual password
      role: user.role,
      status: user.status,
      modules: modules
    });
    
    // Make sure we're in the accounts tab
    setActiveTab("accounts");
    
    // These are crucial for the modal to appear
    setIsEditing(true);
    setIsAddingUser(true);
  };

  // Handle delete user
  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setShowDeleteConfirm(true);
  };

  // Confirm delete user
  const confirmDelete = async () => {
    try {
      await fetch(`${API_BASE_URL}/accounts/${selectedUser.id}/`, { method: 'DELETE' });
  
      await fetchAccounts();
      setSelectedUser(null);
      setShowDeleteConfirm(false);
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };
  

  // Handle create account for employee
  const handleCreateAccountClick = (employee) => {
    const initialRole = ROLES.SALES; // Default role
    const initialModules = updateModulesByRole(initialRole);
    
    setSelectedEmployee(employee);
    setUserForm({
      username: employee.email,
      password: "",
      role: initialRole,
      status: "Active",
      modules: initialModules
    });
    
    setIsAddingUser(true);
    setActiveTab("accounts"); // Switch to accounts tab when creating an account
  };

  // Filter employees based on search term
  const filteredEmployees = employees.filter(emp => 
    emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    emp.lastName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    emp.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
    emp.position?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user &&
    (
      (user.username || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.role || "").toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
  
  

  // Role color map - Enhanced with more vibrant colors
  const getRoleBadgeClass = (role) => {
    switch(role) {
      case ROLES.ADMIN: return "bg-indigo-100 text-indigo-800 border border-indigo-200";
      case ROLES.INVENTORY: return "bg-sky-100 text-sky-800 border border-sky-200";
      case ROLES.SALES: return "bg-emerald-100 text-emerald-800 border border-emerald-200";
      case "Purchase Order": return "bg-amber-100 text-amber-800 border border-amber-200";
      case "Warranty List": return "bg-rose-100 text-rose-800 border border-rose-200";
      default: return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar_Primary
        isCollapsed={isSidebarCollapsed}
        toggleCollapse={() => {
          const next = !isSidebarCollapsed;
          setIsSidebarCollapsed(next);
          localStorage.setItem("sidebarCollapsed", next);
        }}
      />

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ease-in-out flex-1 p-4 md:p-8 ${
          isSidebarCollapsed ? "ml-16" : "ml-64"
        }`}
      >
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 md:mb-10">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <div className="bg-indigo-100 p-3 rounded-xl shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800">User Management</h1>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-3 h-5 w-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 border border-slate-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
                />
              </div>
              {currentUserRole === "Admin" && activeTab === "employees" && (
                <button
                  onClick={() => {
                    resetForms();
                    setIsAddingEmployee(true);
                  }}
                  className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-3 rounded-xl hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="8.5" cy="7" r="4"></circle>
                    <line x1="20" y1="8" x2="20" y2="14"></line>
                    <line x1="23" y1="11" x2="17" y2="11"></line>
                  </svg>
                  <span>Add Employee</span>
                </button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6 border-b border-slate-200">
            <div className="flex space-x-6">
              <button
                onClick={() => setActiveTab("employees")}
                className={`py-3 font-medium text-sm transition-colors relative ${
                  activeTab === "employees" 
                    ? "text-indigo-600 border-b-2 border-indigo-600" 
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Employee Profiles
              </button>
              <button
                onClick={() => setActiveTab("accounts")}
                className={`py-3 font-medium text-sm transition-colors relative ${
                  activeTab === "accounts" 
                    ? "text-indigo-600 border-b-2 border-indigo-600" 
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                User Accounts
              </button>
            </div>
          </div>
          
          {/* Employee Profile Creation/Edit Modal */}
          {isAddingEmployee && (
            <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50 px-4">
              <div className="bg-white/95 rounded-2xl shadow-xl w-full max-w-2xl p-6 md:p-8 transform transition-all duration-300 scale-100 backdrop-filter backdrop-blur-md">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-3">
                    <div className="bg-indigo-100 p-2 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </div>
                    {isEditingEmployee ? "Edit Employee Profile" : "New Employee Profile"}
                  </h2>
                  <button 
                    onClick={resetForms}
                    className="text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-full hover:bg-slate-100"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-slate-700">First Name *</label>
                    <input
                      name="firstName"
                      value={employeeForm.firstName}
                      onChange={handleEmployeeChange}
                      placeholder="Enter first name"
                      className="border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                      required
                    />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-slate-700">Last Name *</label>
                    <input
                      name="lastName"
                      value={employeeForm.lastName}
                      onChange={handleEmployeeChange}
                      placeholder="Enter last name"
                      className="border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                      required
                    />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-slate-700">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={employeeForm.email}
                      onChange={handleEmployeeChange}
                      placeholder="Enter email address"
                      className="border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                      required
                    />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-slate-700">Phone Number</label>
                      <input
                        name="phone"
                        value={employeeForm.phone}
                        onChange={handleEmployeeChange}
                        placeholder="Enter phone number (e.g., +639XXXXXXXXX)"
                        className={`border ${phoneError ? "border-red-500" : "border-slate-200"} p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm`}
                      />
                      {phoneError && <p className="text-red-500 text-xs mt-1">{phoneError}</p>}
                    </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-slate-700">Position</label>
                    <input
                      name="position"
                      value={employeeForm.position}
                      onChange={handleEmployeeChange}
                      placeholder="Enter job position"
                      className="border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                    />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-slate-700">Join Date</label>
                    <input
                      type="date"
                      name="joinDate"
                      value={employeeForm.joinDate}
                      onChange={handleEmployeeChange}
                      className="border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                    />
                  </div>
                </div>
                
                <div className="mt-8 flex justify-end gap-3">
                  <button
                    onClick={resetForms}
                    className="px-5 py-2.5 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddEmployee}
                    className="bg-indigo-600 text-white font-medium px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    {isEditingEmployee ? "Update Profile" : "Save Profile"}
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* User Account Creation Modal - Only show in User Accounts tab */}
          {isAddingUser && activeTab === "accounts" && (
            <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50 px-4">
              <div className="bg-white/95 rounded-2xl shadow-xl w-full max-w-2xl p-6 md:p-8 transform transition-all duration-300 scale-100 backdrop-filter backdrop-blur-md">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-3">
                    <div className="bg-indigo-100 p-2 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="16"></line>
                        <line x1="8" y1="12" x2="16" y2="12"></line>
                      </svg>
                    </div>
                    {isEditing ? "Edit User Account" : "New User Account"}
                  </h2>
                  <button 
                    onClick={resetForms}
                    className="text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-full hover:bg-slate-100"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
                
                {!isEditing && selectedEmployee && (
                  <div className="mb-6 p-4 bg-indigo-50 rounded-xl">
                    <h3 className="font-medium text-indigo-700 mb-2">Creating account for:</h3>
                    <p className="text-slate-700">
                      <span className="font-medium">{selectedEmployee.firstName} {selectedEmployee.lastName}</span> • {selectedEmployee.position || "No position"}
                    </p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-slate-700">Username / Email</label>
                    <input
                      name="username"
                      value={userForm.username}
                      onChange={handleUserChange}
                      placeholder="Enter email address"
                      className="border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                    />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-slate-700">Password</label>
                    <div className="relative">
                      <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={userForm.password}
                        onChange={handleUserChange}
                        placeholder={isEditing ? "Leave blank to keep current" : "Create 8-character password"}
                        className={`border ${passwordError ? "border-red-500" : "border-slate-200"} p-3 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm w-full`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 hover:text-indigo-600"
                      >
                        {showPassword ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                            <line x1="1" y1="1" x2="23" y2="23"></line>
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                        )}
                      </button>
                    </div>
                    {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-slate-700">Status</label>
                    <select
                      name="status"
                      value={userForm.status}
                      onChange={handleUserChange}
                      className="border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-slate-700">Role Assignment</label>
                    <select
                      name="role"
                      value={userForm.role}
                      onChange={handleUserChange}
                      className="border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm"
                    >
                      <option value={ROLES.INVENTORY}>Inventory</option>
                      <option value={ROLES.SALES}>Sales</option>
                      <option value={ROLES.PURCHASE_ORDER}>Purchase Order</option>
                      <option value={ROLES.WARRANTY_LIST}>Warranty List</option>
                      <option value={ROLES.RETURNS}>Returns</option>
                      {currentUserRole === "Admin" && <option value={ROLES.ADMIN}>Admin</option>}
                    </select>
                  </div>
                  
                  {/* Module Access Section */}
                  <div className="md:col-span-2 mt-4">
                    <h3 className="text-lg font-medium text-slate-800 mb-3">Module Access</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {currentUserRole === "Admin" && (
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={userForm.modules.admin}
                            onChange={() => handleModuleChange('admin')}
                            className="rounded text-indigo-600 focus:ring-indigo-500"
                          />
                          <span>Admin</span>
                        </label>
                      )}
                      
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={userForm.modules.sales}
                          onChange={() => handleModuleChange('sales')}
                          className="rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <span>Sales</span>
                      </label>
                      
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={userForm.modules.inventory}
                          onChange={() => handleModuleChange('inventory')}
                          className="rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <span>Inventory</span>
                      </label>
                      
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={userForm.modules.returnWarranty}
                          onChange={() => handleModuleChange('returnWarranty')}
                          className="rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <span>Return/Warranty</span>
                      </label>
                      
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={userForm.modules.purchaseOrders}
                          onChange={() => handleModuleChange('purchaseOrders')}
                          className="rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <span>Purchase Order</span>
                      </label>
                      
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={userForm.modules.reports}
                          onChange={() => handleModuleChange('reports')}
                          className="rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <span>Reports</span>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-end gap-3">
                  <button
                    onClick={resetForms}
                    className="px-5 py-2.5 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddUser}
                    className="bg-indigo-600 text-white font-medium px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    {isEditing ? "Update Account" : "Create Account"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Delete Employee Confirmation Modal */}
          {showDeleteEmployeeConfirm && selectedEmployee && currentUserRole === "Admin" && (
            <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50 px-4">
              <div className="bg-white/95 rounded-2xl shadow-xl w-full max-w-md p-6 md:p-8 transform transition-all duration-300 scale-100 backdrop-filter backdrop-blur-md">
                <div className="text-center mb-6">
                  <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-red-100 mb-5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      <line x1="10" y1="11" x2="10" y2="17"></line>
                      <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium text-slate-900">Delete Employee</h3>
                  <p className="text-slate-500 mt-3">
                    Are you sure you want to delete {selectedEmployee.firstName} {selectedEmployee.lastName}? {selectedEmployee.hasAccount && "This will also delete their user account."} This action cannot be undone.
                  </p>
                </div>
                
                <div className="flex justify-center gap-4 mt-6">
                  <button
                    onClick={() => setShowDeleteEmployeeConfirm(false)}
                    className="px-5 py-2.5 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDeleteEmployee}
                    className="bg-red-600 text-white font-medium px-5 py-2.5 rounded-xl hover:bg-red-700 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Delete Employee
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Delete User Confirmation Modal */}
          {showDeleteConfirm && selectedUser && currentUserRole === "Admin" && (
            <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50 px-4">
              <div className="bg-white/95 rounded-2xl shadow-xl w-full max-w-md p-6 md:p-8 transform transition-all duration-300 scale-100 backdrop-filter backdrop-blur-md">
                <div className="text-center mb-6">
                  <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-red-100 mb-5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      <line x1="10" y1="11" x2="10" y2="17"></line>
                      <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium text-slate-900">Delete User Account</h3>
                  <p className="text-slate-500 mt-3">
                    Are you sure you want to delete the user account "{selectedUser.username}"? This action cannot be undone.
                  </p>
                </div>
                
                <div className="flex justify-center gap-4 mt-6">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-5 py-2.5 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="bg-red-600 text-white font-medium px-5 py-2.5 rounded-xl hover:bg-red-700 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Delete User
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Content Based on Active Tab */}
          {activeTab === "employees" ? (
            /* Employees Table */
            <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-slate-200">
              <div className="p-6 border-b border-slate-100">
                <h2 className="text-xl font-semibold text-slate-800">Employee Profiles</h2>
                <p className="text-slate-500 text-sm mt-1">Manage employee information and create user accounts</p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 text-left">
                      <th className="py-4 px-6 text-sm font-medium text-slate-600">NAME</th>
                      <th className="py-4 px-6 text-sm font-medium text-slate-600">EMAIL</th>
                      <th className="py-4 px-6 text-sm font-medium text-slate-600">POSITION</th>
                      <th className="py-4 px-6 text-sm font-medium text-slate-600">HIRE DATE</th>
                      <th className="py-4 px-6 text-sm font-medium text-slate-600">PHONE NUMBER</th>
                      <th className="py-4 px-6 text-sm font-medium text-slate-600 text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredEmployees.length > 0 ? (
                      filteredEmployees.map((employee) => (
                        <tr
                          key={employee.id}
                          className="hover:bg-slate-50 transition-colors duration-150"
                        >
                          <td className="py-4 px-6">
                            <div className="font-medium text-slate-800">{employee.firstName} {employee.lastName}</div>
                          </td>
                          <td className="py-4 px-6 text-slate-600">
                            {employee.email}
                          </td>
                          <td className="py-4 px-6 text-slate-600">
                            {employee.position || <span className="text-slate-400 text-sm">—</span>}
                          </td>
                          <td className="py-4 px-6 text-slate-600">
                            {new Date(employee.joinDate).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-6 text-slate-600">
                            {employee.phone || <span className="text-slate-400 text-sm">—</span>}
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {currentUserRole === "Admin" && (
                                <>
                                  <button 
                                    onClick={() => handleEditEmployeeClick(employee)}
                                    className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-indigo-600 transition-colors"
                                    aria-label="Edit employee"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                    </svg>
                                  </button>
                                  
                                  <button 
                                    onClick={() => handleDeleteEmployeeClick(employee)}
                                    className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-red-600 transition-colors"
                                    aria-label="Delete employee"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <polyline points="3 6 5 6 21 6"></polyline>
                                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                      <line x1="10" y1="11" x2="10" y2="17"></line>
                                      <line x1="14" y1="11" x2="14" y2="17"></line>
                                    </svg>
                                  </button>
                                </>
                              )}
                              {currentUserRole !== "Admin" && (
                                <span className="text-sm text-slate-400 italic">No actions available</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="py-10 text-center text-slate-500">
                          <div className="flex flex-col items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-300 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="11" cy="11" r="8"></circle>
                              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                              <line x1="11" y1="8" x2="11" y2="14"></line>
                              <line x1="8" y1="11" x2="14" y2="11"></line>
                            </svg>
                            {searchTerm ? "No employees matching your search" : "No employees found"}
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              <div className="p-4 bg-slate-50 border-t border-slate-100 text-sm text-slate-500 font-medium">
                Showing {filteredEmployees.length} of {employees.length} employees
              </div>
            </div>
          ) : (
            /* Users Table */
            <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-slate-200">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-slate-800">User Accounts</h2>
                  <p className="text-slate-500 text-sm mt-1">Manage user access and permissions</p>
                </div>
                
                {/* Add this button to the User Accounts tab header */}
                {currentUserRole === "Admin" && (
                  <button
                    onClick={() => {
                      // Find employees without accounts
                      const eligibleEmployees = employees.filter(emp => !emp.hasAccount);
                      if (eligibleEmployees.length === 0) {
                        alert("All employees already have accounts. Create a new employee first.");
                        return;
                      }
                      
                      setSelectedEmployee(eligibleEmployees[0]);
                      setUserForm(prev => ({ 
                        ...prev, 
                        username: eligibleEmployees[0].email,
                        role: ROLES.SALES,
                        modules: updateModulesByRole(ROLES.SALES)
                      }));
                      setIsAddingUser(true);
                      setIsEditing(false);
                    }}
                    className="bg-indigo-600 text-white font-medium px-4 py-2 rounded-xl hover:bg-indigo-700 transition-all duration-200"
                  >
                    New User Account
                  </button>
                )}
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 text-left">
                      <th className="py-4 px-6 text-sm font-medium text-slate-600">USERNAME</th>
                      <th className="py-4 px-6 text-sm font-medium text-slate-600">EMPLOYEE</th>
                      <th className="py-4 px-6 text-sm font-medium text-slate-600">ROLE</th>
                      <th className="py-4 px-6 text-sm font-medium text-slate-600">STATUS</th>
                      <th className="py-4 px-6 text-sm font-medium text-slate-600">PERMISSIONS</th>
                      <th className="py-4 px-6 text-sm font-medium text-slate-600 text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => {
                        const relatedEmployee = employees.find(emp => emp.id === user.employeeId);
                        return (
                          <tr
                            key={user.id}
                            className="hover:bg-slate-50 transition-colors duration-150"
                          >
                            <td className="py-4 px-6">
                            <div className="font-medium text-slate-800">{user.username}</div>
                            </td>
                            <td className="py-4 px-6">
                              {relatedEmployee ? (
                                <div className="text-slate-600">{relatedEmployee.firstName} {relatedEmployee.lastName}</div>
                              ) : (
                                <span className="text-red-500 text-sm italic">No employee linked</span>
                              )}
                            </td>
                            <td className="py-4 px-6">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeClass(user.role)}`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(user.status)}`}>
                                {user.status}
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <div className="text-xs text-slate-600">
                                {user.accessiblePages ? (
                                  <span>{user.accessiblePages.join(', ')}</span>
                                ) : (
                                  <span className="text-red-500">No permissions</span>
                                )}
                              </div>
                            </td>
                            <td className="py-4 px-6 text-right">
                              <div className="flex items-center justify-end gap-3">
                                {currentUserRole === "Admin" && (
                                  <>
                                    <button 
                                      onClick={() => {
                                        console.log('Edit button clicked for user:', user);
                                        handleEditClick(user);
                                      }}
                                      className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-indigo-600 transition-colors"
                                      aria-label="Edit user"
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                      </svg>
                                    </button>
                                    <button 
                                      onClick={() => handleDeleteClick(user)}
                                      className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-red-600 transition-colors"
                                      aria-label="Delete user"
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="3 6 5 6 21 6"></polyline>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                        <line x1="10" y1="11" x2="10" y2="17"></line>
                                        <line x1="14" y1="11" x2="14" y2="17"></line>
                                      </svg>
                                    </button>
                                  </>
                                )}
                                {currentUserRole !== "Admin" && (
                                  <span className="text-sm text-slate-400 italic">No actions available</span>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="6" className="py-10 text-center text-slate-500">
                          <div className="flex flex-col items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-300 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="11" cy="11" r="8"></circle>
                              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                              <line x1="11" y1="8" x2="11" y2="14"></line>
                              <line x1="8" y1="11" x2="14" y2="11"></line>
                            </svg>
                            {searchTerm ? "No users matching your search" : "No users found"}
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              <div className="p-4 bg-slate-50 border-t border-slate-100 text-sm text-slate-500 font-medium">
                Showing {filteredUsers.length} of {users.length} users
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagementPage;