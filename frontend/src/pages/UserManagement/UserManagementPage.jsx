import React, { useState, useEffect } from "react";
import Sidebar_Primary from "../../components/Sidebar_Primary";
import { ROLES } from '../../utils/roleConfig';
import { Users,Search,UserPlus,X,User,Eye,EyeOff,Trash2,Edit,SearchX,PlusCircle} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";
const EMPLOYEE_API = `${API_BASE_URL}/employees/`;
const ACCOUNT_API = `${API_BASE_URL}/accounts/`;


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


  // ✅ Declare useState first
const [users, setUsers] = useState([]);
const [employees, setEmployees] = useState([]);

// 🔍 Filter users before slicing
const filteredUsers = users.filter(user => 
  (user.email || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
  (user.role || "").toLowerCase().includes(searchTerm.toLowerCase())
);

  // 🔁 Pagination state
const [currentPage, setCurrentPage] = useState(1);
const rowsPerPage = 10;

// 🔁 Reset to first page on tab switch or search
useEffect(() => {
  setCurrentPage(1);
}, [activeTab, searchTerm]);

  // Debug ROLES on component mount
  useEffect(() => {
    //console.log("ROLES object:", ROLES);
  }, []);

  // Current logged-in user (would typically come from auth context)
  // For demo purposes, we'll set it as Admin
  const currentUserRole = "Admin";



  // Save employees to local storage whenever employees change
  useEffect(() => {
    localStorage.setItem('employees', JSON.stringify(employees));
  }, [employees]);




  // Save users to local storage whenever users change
  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  // Sidebar collapse effect
  useEffect(() => {
    const collapsed = localStorage.getItem("sidebarCollapsed") === "true";
    setIsSidebarCollapsed(collapsed);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [employeeRes, userRes] = await Promise.all([
          fetch(EMPLOYEE_API),
          fetch(ACCOUNT_API),
        ]);
  
        const employeeData = await employeeRes.json();
        const userData = await userRes.json();
  
        const formattedEmployees = employeeData.map((emp) => {
          return {
            id: emp.id,
            fullName: emp.name || "",
            firstName: emp.name?.split(" ")[0] || "",
            lastName: emp.name?.split(" ").slice(1).join(" ") || "",
            email: emp.account?.email || "",
            phone: emp.phone_number || "",
            position: emp.role || "Employee",
            joinDate: emp.join_date || "2023-01-01",
            hasAccount: !!emp.account,

          };
        });
        
        
        
        
  
        // Format users
        const formattedUsers = userData.map((user) => ({
          id: user.id,
          email: user.email,
          role: user.role,
          password: user.password,
          status: user.status || "Active",
          employeeId: user.employee_id,
          accessiblePages: user.accessible_pages || getAccessiblePagesByRole(user.role),
        }));
        
        
  
        setEmployees(formattedEmployees);
        setUsers(formattedUsers);
      } catch (error) {
        console.error("Failed to fetch employee or user data:", error);
      }
    };
  
    fetchData();
  }, []);
  // ✅ Reset pagination to page 1 when switching tabs or searching
useEffect(() => {
  setCurrentPage(1);
}, [activeTab, searchTerm]);

  // Employee form state
  const [employeeForm, setEmployeeForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    position: "Employee",
    joinDate: new Date().toISOString().split('T')[0],
  });
  

  // User form state with module access - Simplified status options
  const [userForm, setUserForm] = useState({
  // now represents a display name / login name
    email: "",     // explicitly separate
    password: "",
    role: ROLES.SALES,
    status: "Active",
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

  // Password validation
  if (name === 'password' && !isEditing) {
    if (value.length !== 0 && value.length !== 8) {
      setPasswordError("Password must be exactly 8 characters long");
    } else {
      setPasswordError("");
    }
  }

  // Email format validation (optional but useful)
  if (name === 'email') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !emailRegex.test(value)) {
      setPhoneError("Invalid email format");
    } else {
      setPhoneError("");  // reuse existing error state or create new emailError state
    }
  }

  // Role-based module update
  if (name === 'role') {
    const updatedModules = updateModulesByRole(value);
    setUserForm(prev => ({
      ...prev,
      role: value,
      modules: updatedModules
    }));
  } else {
    // Standard field update
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

  const handleAddEmployee = async () => {
    const fullName = `${employeeForm.firstName.trim()} ${employeeForm.lastName.trim()}`;
    const role = employeeForm.position.trim() || "Employee";
  
    if (!employeeForm.firstName || !employeeForm.lastName) {
      alert("Please fill out First Name and Last Name.");
      return;
    }
  
    try {
      if (isEditingEmployee && selectedEmployee) {
        // 🔁 Update employee in backend
        const response = await fetch(`${EMPLOYEE_API}${selectedEmployee.id}/`, {
          method: "PUT", // or "PATCH"
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: fullName,
            role: role,
            employee_status: "Active"
          }),
        });
  
        if (!response.ok) throw new Error("Failed to update employee");
  
        const updatedEmp = await response.json();
  
        setEmployees((prev) =>
          prev.map((emp) =>
            emp.id === selectedEmployee.id
              ? {
                  ...emp,
                  firstName: employeeForm.firstName,
                  lastName: employeeForm.lastName,
                  position: role,
                  joinDate: employeeForm.joinDate,
                }
              : emp
          )
        );
  
      } else {
        // ➕ Add employee to backend
        const response = await fetch(EMPLOYEE_API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: fullName,
            role: role,
            employee_status: "Active"
          }),
        });
  
        if (!response.ok) throw new Error("Failed to add employee");
  
        const newEmp = await response.json();
  
        setEmployees((prev) => [
          ...prev,
          {
            id: newEmp.id,
            firstName: employeeForm.firstName,
            lastName: employeeForm.lastName,
            position: role,
            joinDate: employeeForm.joinDate,
            hasAccount: false,
          },
        ]);
      }
  
      resetForms();
      alert("Employee saved successfully!");
    } catch (error) {
      console.error("Error saving employee:", error);
      alert("There was a problem saving the employee.");
    }
  };
  

  // Handle adding new user after employee creation
const handleAddUser = async () => {
  if (!userForm.email) {
    alert("Email is required.");
    return;
  }

  if (!userForm.password || userForm.password.length !== 8) {
    alert("Password must be exactly 8 characters long.");
    return;
  }

  try {
    const payload = {
      email: userForm.email.trim(),
      role: userForm.role,
      status: userForm.status,
      accessible_pages: ['dashboard'].concat(
        Object.entries(userForm.modules)
          .filter(([_, value]) => value)
          .map(([key]) => {
            switch (key) {
              case 'admin': return 'user-management';
              case 'sales': return 'sales';
              case 'inventory': return 'inventory';
              case 'returnWarranty': return 'return-warranty';
              case 'purchaseOrders': return 'purchase-orders';
              case 'reports': return 'reports';
              default: return null;
            }
          }).filter(Boolean)
      ),
      password: userForm.password.trim(),
    };

    console.debug("📦 Add User Payload:", payload);

    const response = await fetch(ACCOUNT_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      console.error("❌ Backend error (Add User):", errorResponse);
      throw new Error("Failed to add user account.");
    }

    const savedUser = await response.json();

    if (selectedEmployee) {
      await fetch(`${EMPLOYEE_API}${selectedEmployee.id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account: savedUser.id }),
      });
    }

    setUsers(prev => [...prev, savedUser]);
    setEmployees(prev => prev.map(emp =>
      emp.id === selectedEmployee.id ? { ...emp, hasAccount: true } : emp
    ));

    resetForms();
    alert("✅ User account created!");

  } catch (error) {
    console.error("🔥 Error adding user:", error);
    alert("Failed to add user.");
  }
};

const handleUpdateUser = async () => {
  if (!userForm.email) {
    alert("Email is required.");
    return;
  }

  try {
    const updatedPayload = {
      email: userForm.email.trim(),
      role: userForm.role,
      status: userForm.status,
      accessible_pages: ['dashboard'].concat(
        Object.entries(userForm.modules)
          .filter(([_, value]) => value)
          .map(([key]) => {
            switch (key) {
              case 'admin': return 'user-management';
              case 'sales': return 'sales';
              case 'inventory': return 'inventory';
              case 'returnWarranty': return 'return-warranty';
              case 'purchaseOrders': return 'purchase-orders';
              case 'reports': return 'reports';
              default: return null;
            }
          }).filter(Boolean)
      ),
    };

    // 🔐 Include password if user typed a new one
    if (userForm.password && userForm.password !== "********") {
      updatedPayload.password = userForm.password.trim();
    }

    const response = await fetch(`${ACCOUNT_API}${selectedUser.id}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedPayload),
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      console.error("❌ Backend error (Update User):", errorResponse);
      throw new Error("Failed to update user account.");
    }

    const updatedUser = await response.json();
    setUsers((prev) =>
      prev.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );

    resetForms();
    alert("✅ User account updated!");
  } catch (error) {
    console.error("🔥 Error updating user:", error);
    alert("Failed to update user.");
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
      email: "",
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

  const confirmDeleteEmployee = async () => {
    try {
      // 🔁 Delete from backend
      const response = await fetch(`${EMPLOYEE_API}${selectedEmployee.id}/`, {
        method: "DELETE",
      });
  
      if (!response.ok) throw new Error("Failed to delete employee");
  
      // ✅ Update local state
      setEmployees((prev) =>
        prev.filter((emp) => emp.id !== selectedEmployee.id)
      );
  
      // ✅ Also delete associated user if exists
      if (selectedEmployee.hasAccount) {
        const userToDelete = users.find((u) => u.employeeId === selectedEmployee.id);
        if (userToDelete) {
          setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
        }
      }
  
      setShowDeleteEmployeeConfirm(false);
      setSelectedEmployee(null);
      alert("Employee deleted successfully!");
    } catch (error) {
      console.error("Error deleting employee:", error);
      alert("There was a problem deleting the employee.");
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
      email: user.email,
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
    if (!selectedUser || !selectedUser.id) {
      alert("No user selected for deletion.");
      return;
    }
  
    try {
      // ✅ DELETE request to backend
      const response = await fetch(`${ACCOUNT_API}${selectedUser.id}/`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete user from backend");
      }
  
      // ✅ Remove from frontend state
      setUsers(prev => prev.filter(user => user.id !== selectedUser.id));
  
      // ✅ Update linked employee's `hasAccount`
      const employeeToUpdate = employees.find(emp => emp.id === selectedUser.employeeId);
      if (employeeToUpdate) {
        setEmployees(prev => prev.map(emp =>
          emp.id === employeeToUpdate.id
            ? { ...emp, hasAccount: false }
            : emp
        ));
      }
  
      setShowDeleteConfirm(false);
      setSelectedUser(null);
      alert("User account deleted successfully!");
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user account.");
    }
  };
  

  const handleCreateAccountClick = (employee) => {
    const initialRole = ROLES.SALES;
    const initialModules = updateModulesByRole(initialRole);
  
    setSelectedEmployee(employee);
  
    setUserForm({
      email: employee.email || "",
      password: "",
      role: initialRole,
      status: "Active",
      modules: initialModules
    });
  
    setIsAddingUser(true);
    setIsEditing(false);
    setActiveTab("accounts");
  };
  

  // Filter employees based on search term
  const filteredEmployees = employees.filter(emp => 
    (emp.firstName || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
    (emp.lastName || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
    (emp.email || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
    (emp.position || "").toLowerCase().includes(searchTerm.toLowerCase())
  );
  
// Employee pagination
const indexOfLastEmployee = currentPage * rowsPerPage;
const indexOfFirstEmployee = indexOfLastEmployee - rowsPerPage;
const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);

// User pagination
const indexOfLastUser = currentPage * rowsPerPage;
const indexOfFirstUser = indexOfLastUser - rowsPerPage;
const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);



  

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
                <Users className="h-6 w-6 text-indigo-600" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800">User Management</h1>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
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
                  <UserPlus className="h-5 w-5" />
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
                    <PlusCircle className="h-5 w-5 text-indigo-600" /> 
                    </div>
                    {isEditingEmployee ? "Edit Employee Profile" : "New Employee Profile"}
                  </h2>
                  <button 
                    onClick={resetForms}
                    className="text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-full hover:bg-slate-100"
                  >
                    <X className="h-5 w-5" />
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
                      <label className="text-sm font-medium text-slate-700">Position</label>
                      <select
                        name="position"
                        value={employeeForm.position}
                        onChange={handleEmployeeChange}
                        className="border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm bg-white"
                      >
                        <option value="">Select a position</option>
                        <option value="Admin">Admin</option>
                        <option value="Inventory">Inventory</option>
                        <option value="Sales">Sales</option>
                        <option value="Returns">Returns</option>
                        <option value="Purchase Order">Purchase Order</option>
                        <option value="Warranty List">Warranty List</option>
                        <option value="Employee">Employee</option>
                      </select>
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
        <Edit className="h-5 w-5 text-indigo-600" />
        </div>
        {isEditing ? "Edit User Account" : "New User Account"}
      </h2>
      <button 
        onClick={resetForms}
        className="text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-full hover:bg-slate-100"
      >
        <X className="h-5 w-5" />
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
        <label className="text-sm font-medium text-slate-700">Email Address</label>
        <input
          name="email"
          value={userForm.email}
          onChange={handleUserChange}
          placeholder="Enter valid email address"
          type="email"
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
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
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
        onClick={isEditing ? handleUpdateUser : handleAddUser}
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
        <Trash2 className="h-7 w-7 text-red-600" />
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
        <Trash2 className="h-7 w-7 text-red-600" />
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
          {/* <th className="py-4 px-6 text-sm font-medium text-slate-600">PHONE NUMBER</th> */}
          <th className="py-4 px-6 text-sm font-medium text-slate-600 text-right">ACTIONS</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {filteredEmployees.length > 0 ? (
          currentEmployees.map((employee) => (
            <tr
              key={employee.id}
              className="hover:bg-slate-50 transition-colors duration-150"
            >
              <td className="py-4 px-6">
              <div className="font-medium text-slate-800">
                {employee.firstName && employee.lastName
                  ? `${employee.firstName} ${employee.lastName}`
                  : employee.fullName || "—"}
              </div>
              </td>
              <td className="py-4 px-6 text-slate-600">
                {(() => {
                  const user = users.find((u) => u.employeeId === employee.id);
                  return user ? user.email : <span className="text-slate-400 text-sm">—</span>;
                })()}
              </td>
              <td className="py-4 px-6 text-slate-600">
                {employee.position || <span className="text-slate-400 text-sm">—</span>}
              </td>
              <td className="py-4 px-6 text-slate-600">
                {new Date(employee.joinDate).toLocaleDateString()}
              </td>
              {/* <td className="py-4 px-6 text-slate-600">
                {employee.phone || <span className="text-slate-400 text-sm">—</span>}
              </td> */}
              <td className="py-4 px-6 text-right">
                <div className="flex items-center justify-end gap-2">
                {!employee.hasAccount && (
                    <button
                      onClick={() => handleCreateAccountClick(employee)}
                      className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-emerald-600 transition-colors"
                      aria-label="Create Account"
                    >
                      <UserPlus className="h-4 w-4" />
                    </button>
                  )}

                  {currentUserRole === "Admin" && (
                    <>
                      <button 
                        onClick={() => handleEditEmployeeClick(employee)}
                        className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-indigo-600 transition-colors"
                        aria-label="Edit employee"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      
                      <button 
                        onClick={() => handleDeleteEmployeeClick(employee)}
                        className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-red-600 transition-colors"
                        aria-label="Delete employee"
                      >
                        <Trash2 className="h-4 w-4" />
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
                <SearchX className="h-10 w-10 text-slate-300 mb-3" />
                {searchTerm ? "No employees matching your search" : "No employees found"}
              </div>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
  
  <div className="p-4 bg-slate-50 border-t border-slate-100 text-sm text-slate-500 font-medium flex justify-between items-center">
  <span>
    Showing {Math.min(rowsPerPage, filteredEmployees.length - (currentPage - 1) * rowsPerPage)} of {filteredEmployees.length} employees
  </span>
  <div className="flex gap-2">
    <button
      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
      disabled={currentPage === 1}
      className="px-3 py-1 border rounded-md disabled:opacity-50"
    >
      Prev
    </button>
    <span>Page {currentPage}</span>
    <button
      onClick={() => {
        const totalPages = Math.ceil(filteredEmployees.length / rowsPerPage);
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
      }}
      disabled={currentPage === Math.ceil(filteredEmployees.length / rowsPerPage)}
      className="px-3 py-1 border rounded-md disabled:opacity-50"
    >
      Next
    </button>
  </div>
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
          <th className="py-4 px-6 text-sm font-medium text-slate-600">EMAIL</th>
          {/* <th className="py-4 px-6 text-sm font-medium text-slate-600">EMPLOYEE</th> */}
          <th className="py-4 px-6 text-sm font-medium text-slate-600">ROLE</th>
          <th className="py-4 px-6 text-sm font-medium text-slate-600">STATUS</th>
          <th className="py-4 px-6 text-sm font-medium text-slate-600">PERMISSIONS</th>
          <th className="py-4 px-6 text-sm font-medium text-slate-600 text-right">ACTIONS</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {filteredUsers.length > 0 ? (
          currentUsers.map((user) => {
            console.log("Users:", users);
            console.log("Employees:", employees);
            console.log("Filtered Users:", filteredUsers);
            const relatedEmployee = employees.find(emp => Number(emp.id) === Number(user.employee_id));
            return (
              <tr
                key={user.id}
                className="hover:bg-slate-50 transition-colors duration-150"
              >
                <td className="py-4 px-6">
                  <div className="font-medium text-slate-800">{user.email}</div>
                </td>
                {/* <td className="py-4 px-6">
                  {relatedEmployee ? (
                    <div className="text-slate-600">
                      {relatedEmployee.firstName} {relatedEmployee.lastName}
                    </div>
                  ) : (
                    <span className="text-red-500 text-sm italic">No employee linked</span>
                  )}
                </td> */}

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
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(user)}
                          className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-red-600 transition-colors"
                          aria-label="Delete user"
                        >
                          <Trash2 className="h-4 w-4" />
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
                <SearchX className="h-10 w-10 text-slate-300 mb-3" />
                {searchTerm ? "No users matching your search" : "No users found"}
              </div>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
  
  <div className="p-4 bg-slate-50 border-t border-slate-100 text-sm text-slate-500 font-medium flex justify-between items-center">
  <span>
    Showing {Math.min(rowsPerPage, filteredUsers.length - (currentPage - 1) * rowsPerPage)} of {filteredUsers.length} users
  </span>
  <div className="flex gap-2">
    <button
      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
      disabled={currentPage === 1}
      className="px-3 py-1 border rounded-md disabled:opacity-50"
    >
      Prev
    </button>
    <span>Page {currentPage}</span>
    <button
      onClick={() => {
        const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
      }}
      disabled={currentPage === Math.ceil(filteredUsers.length / rowsPerPage)}
      className="px-3 py-1 border rounded-md disabled:opacity-50"
    >
      Next
    </button>
  </div>
</div>

</div>
)}
</div>
</div>
</div>
);
};

export default UserManagementPage;