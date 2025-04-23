import React, { useState, useEffect } from "react";
import Sidebar_Primary from "../../components/Sidebar_Primary";
import { ROLES } from '../../utils/roleConfig';

// Get status badge class
const getStatusBadgeClass = (status) => {
  switch(status) {
    case "Active": return "bg-green-100 text-green-800 border border-green-200";
    case "Inactive": return "bg-gray-100 text-gray-800 border border-gray-200";
    case "Suspended": return "bg-red-100 text-red-800 border border-red-200";
    case "Pending": return "bg-yellow-100 text-yellow-800 border border-yellow-200";
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

  // Debug ROLES on component mount
  useEffect(() => {
    console.log("ROLES object:", ROLES);
  }, []);

  // Current logged-in user (would typically come from auth context)
  // For demo purposes, we'll set it as Admin
  const currentUserRole = "Admin";

  // Initialize users from local storage
  const [users, setUsers] = useState(() => {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      return JSON.parse(storedUsers);
    }
    // Default users if none in local storage
    return [
      { 
        id: 1, 
        username: "admin@pgmicro.com", 
        role: ROLES.ADMIN, 
        password: "admin123", 
        status: "Active",
        accessiblePages: getAccessiblePagesByRole(ROLES.ADMIN)
      },
      { 
        id: 2, 
        username: "inventory@pgmicro.com", 
        role: ROLES.INVENTORY, 
        password: "inventory123", 
        status: "Active",
        accessiblePages: getAccessiblePagesByRole(ROLES.INVENTORY)
      },
      { 
        id: 3, 
        username: "sales@pgmicro.com", 
        role: ROLES.SALES, 
        password: "sales123", 
        status: "Active",
        accessiblePages: getAccessiblePagesByRole(ROLES.SALES)
      },
    ];
  });

  // Save users to local storage whenever users change
  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  // Sidebar collapse effect
  useEffect(() => {
    const collapsed = localStorage.getItem("sidebarCollapsed") === "true";
    setIsSidebarCollapsed(collapsed);
  }, []);

  // Form state
  const [form, setForm] = useState({
    username: "",
    password: "",
    role: ROLES.SALES,
    status: "Active"
  });

  // Handle form input changes
  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handle adding new user - UPDATED FUNCTION
  const handleAddUser = () => {
    if (!form.username || !form.password || !form.role) {
      alert("Please fill all fields");
      return;
    }
    
    const normalizedUsername = form.username.trim().toLowerCase();
    
    // Check for duplicate usernames
    if (users.some(user => 
      user.username.toLowerCase() === normalizedUsername && 
      (!isEditing || user.id !== selectedUser?.id)
    )) {
      alert("Username already exists");
      return;
    }

    // Debug role and permissions before saving
    console.log("Selected role:", form.role);
    console.log("Role type:", typeof form.role);
    console.log("Getting accessible pages for:", form.role);
    const accessiblePages = getAccessiblePagesByRole(form.role);
    console.log("Pages being assigned:", accessiblePages);

    if (isEditing && selectedUser) {
      // Update existing user
      const updatedUsers = users.map(user => 
        user.id === selectedUser.id 
          ? { 
              ...user, 
              username: normalizedUsername,
              password: form.password === "********" ? user.password : form.password.trim(),
              role: form.role,
              status: form.status,
              accessiblePages: accessiblePages
            } 
          : user
      );
      
      setUsers(updatedUsers);
      setIsEditing(false);
      setSelectedUser(null);
    } else {
      // Add new user with trimmed password
      const newUser = {
        id: Date.now(), // Use timestamp as unique ID
        username: normalizedUsername,
        password: form.password.trim(), // Explicitly trim the password
        role: form.role,
        status: form.status,
        accessiblePages: accessiblePages
      };
      
      // Debug log for new user
      console.log("Adding new user:", {
        ...newUser,
        password: '[REDACTED]', // Don't log actual password
        accessiblePages: newUser.accessiblePages
      });
      
      setUsers([...users, newUser]);
    }
    
    // Reset form and close modal
    setForm({ username: "", password: "", role: ROLES.SALES, status: "Active" });
    setIsAddingUser(false);
  };

  // Handle edit user
  const handleEditClick = (user) => {
    setSelectedUser(user);
    setForm({
      username: user.username,
      password: "********", // Don't show actual password
      role: user.role,
      status: user.status
    });
    setIsEditing(true);
    setIsAddingUser(true);
    setShowPassword(false);
  };

  // Handle delete user
  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setShowDeleteConfirm(true);
  };

  // Confirm delete user
  const confirmDelete = () => {
    const updatedUsers = users.filter(user => user.id !== selectedUser.id);
    setUsers(updatedUsers);
    setShowDeleteConfirm(false);
    setSelectedUser(null);
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
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
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 border border-slate-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
                />
              </div>
              {currentUserRole === "Admin" && (
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setSelectedUser(null);
                    setForm({ username: "", password: "", role: ROLES.SALES, status: "Active" });
                    setIsAddingUser(true);
                    setShowPassword(false);
                  }}
                  className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-3 rounded-xl hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="8.5" cy="7" r="4"></circle>
                    <line x1="20" y1="8" x2="20" y2="14"></line>
                    <line x1="23" y1="11" x2="17" y2="11"></line>
                  </svg>
                  <span>Add User</span>
                </button>
              )}
            </div>
          </div>

          {/* Add/Edit User Modal */}
          {isAddingUser && (
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
                    onClick={() => setIsAddingUser(false)}
                    className="text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-full hover:bg-slate-100"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-slate-700">Username / Email</label>
                    <input
                      name="username"
                      value={form.username}
                      onChange={handleChange}
                      placeholder="enter email address"
                      className="border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                    />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-slate-700">Password</label>
                    <div className="relative">
                      <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        onChange={handleChange}
                        placeholder={isEditing ? "leave blank to keep current" : "create password"}
                        className="border border-slate-200 p-3 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm w-full"
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
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-slate-700">Status</label>
                    <select
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                      className="border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Suspended">Suspended</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-slate-700">Role Assignment</label>
                  
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
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
                </div>
                
                <div className="mt-8 flex justify-end gap-3">
                  <button
                    onClick={() => setIsAddingUser(false)}
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

          {/* Delete Confirmation Modal */}
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
                  <h3 className="text-xl font-medium text-slate-900">Delete User</h3>
                  <p className="text-slate-500 mt-3">
                    Are you sure you want to delete the user "{selectedUser.username}"? This action cannot be undone.
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

          {/* User Table */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-slate-200">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-semibold text-slate-800">User Accounts</h2>
              <p className="text-slate-500 text-sm mt-1">Manage user access and permissions</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 text-left">
                    <th className="py-4 px-6 text-sm font-medium text-slate-600">USERNAME</th>
                    <th className="py-4 px-6 text-sm font-medium text-slate-600">ROLE</th>
                    <th className="py-4 px-6 text-sm font-medium text-slate-600">STATUS</th>
                    <th className="py-4 px-6 text-sm font-medium text-slate-600">PERMISSIONS</th>
                    <th className="py-4 px-6 text-sm font-medium text-slate-600 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="hover:bg-slate-50 transition-colors duration-150"
                      >
                        <td className="py-4 px-6">
                          <div className="font-medium text-slate-800">{user.username}</div>
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
                                  onClick={() => handleEditClick(user)}
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
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="py-10 text-center text-slate-500">
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
        </div>
      </div>
    </div>
  );
};

export default UserManagementPage;