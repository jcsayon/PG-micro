import React, { useState, useEffect } from "react";
import Sidebar_Primary from "../../components/Sidebar_Primary";

const UserManagementPage = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const collapsed = localStorage.getItem("sidebarCollapsed") === "true";
    setIsSidebarCollapsed(collapsed);
  }, []);

  // Initial users data
  const [users, setUsers] = useState([
    { id: 1, username: "admin@pgmicro.com", role: "Admin", password: "********" },
    { id: 2, username: "inventory@pgmicro.com", role: "Inventory", password: "********" },
    { id: 3, username: "sales@pgmicro.com", role: "Sales", password: "********" },
  ]);

  // Form state
  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "Sales"
  });

  // Handle form input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle adding new user
  const handleAddUser = () => {
    if (!form.username || !form.password || !form.role) {
      alert("Please fill all fields");
      return;
    }
    
    // Check for duplicate usernames
    if (users.some(user => user.username === form.username && (!isEditing || user.id !== selectedUser.id))) {
      alert("Username already exists");
      return;
    }

    if (isEditing && selectedUser) {
      // Update existing user
      setUsers(users.map(user => 
        user.id === selectedUser.id ? { ...user, ...form } : user
      ));
      setIsEditing(false);
      setSelectedUser(null);
    } else {
      // Add new user
      const newUser = {
        id: Math.max(0, ...users.map(u => u.id)) + 1,
        username: form.username,
        password: form.password,
        role: form.role
      };
      setUsers([...users, newUser]);
    }
    
    // Reset form and close modal
    setForm({ username: "", password: "", role: "Sales" });
    setIsAddingUser(false);
  };

  // Handle edit user
  const handleEditClick = (user) => {
    setSelectedUser(user);
    setForm({
      username: user.username,
      password: "********", // Don't show actual password
      role: user.role
    });
    setIsEditing(true);
    setIsAddingUser(true);
  };

  // Handle delete user
  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    setUsers(users.filter(user => user.id !== selectedUser.id));
    setShowDeleteConfirm(false);
    setSelectedUser(null);
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Role color map
  const getRoleBadgeClass = (role) => {
    switch(role) {
      case "Admin": return "bg-purple-100 text-purple-800";
      case "Inventory": return "bg-blue-100 text-blue-800";
      case "Sales": return "bg-green-100 text-green-800";
      case "Purchase Order": return "bg-amber-100 text-amber-800";
      case "Warranty List": return "bg-rose-100 text-rose-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
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
        className={`transition-all duration-300 flex-1 p-8 ${
          isSidebarCollapsed ? "ml-16" : "ml-64"
        }`}
      >
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="bg-purple-100 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setSelectedUser(null);
                  setForm({ username: "", password: "", role: "Sales" });
                  setIsAddingUser(true);
                }}
                className="flex items-center justify-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="8.5" cy="7" r="4"></circle>
                  <line x1="20" y1="8" x2="20" y2="14"></line>
                  <line x1="23" y1="11" x2="17" y2="11"></line>
                </svg>
                <span>Add User</span>
              </button>
            </div>
          </div>

          {/* Add/Edit User Modal */}
          {isAddingUser && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 mx-4">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="16"></line>
                      <line x1="8" y1="12" x2="16" y2="12"></line>
                    </svg>
                    {isEditing ? "Edit User Account" : "New User Account"}
                  </h2>
                  <button 
                    onClick={() => setIsAddingUser(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">Username / Email</label>
                    <input
                      name="username"
                      value={form.username}
                      onChange={handleChange}
                      placeholder="enter email address"
                      className="border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">Password</label>
                    <input
                      name="password"
                      type="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder={isEditing ? "leave blank to keep current" : "create password"}
                      className="border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">Role Assignment</label>
                    <select
                      name="role"
                      value={form.role}
                      onChange={handleChange}
                      className="border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                    >
                      <option value="Inventory">Inventory</option>
                      <option value="Sales">Sales</option>
                      <option value="Purchase Order">Purchase Order</option>
                      <option value="Warranty List">Warranty List</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    onClick={() => setIsAddingUser(false)}
                    className="px-5 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddUser}
                    className="bg-purple-600 text-white font-medium px-5 py-2 rounded-lg hover:bg-purple-700 transition shadow-sm"
                  >
                    {isEditing ? "Update Account" : "Create Account"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && selectedUser && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 mx-4">
                <div className="text-center mb-6">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      <line x1="10" y1="11" x2="10" y2="17"></line>
                      <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">Delete User</h3>
                  <p className="text-gray-500 mt-2">
                    Are you sure you want to delete the user "{selectedUser.username}"? This action cannot be undone.
                  </p>
                </div>
                
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-5 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="bg-red-600 text-white font-medium px-5 py-2 rounded-lg hover:bg-red-700 transition shadow-sm"
                  >
                    Delete User
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* User Table */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800">User Accounts</h2>
              <p className="text-gray-500 text-sm mt-1">Manage user access and permissions</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="py-4 px-6 text-sm font-medium text-gray-600">USERNAME</th>
                    <th className="py-4 px-6 text-sm font-medium text-gray-600">ROLE</th>
                    <th className="py-4 px-6 text-sm font-medium text-gray-600 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="border-t border-gray-100 hover:bg-gray-50 transition"
                      >
                        <td className="py-4 px-6">
                          <div className="font-medium text-gray-800">{user.username}</div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeClass(user.role)}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => handleEditClick(user)}
                              className="p-1 rounded-md hover:bg-gray-100"
                              aria-label="Edit user"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                              </svg>
                            </button>
                            <button 
                              onClick={() => handleDeleteClick(user)}
                              className="p-1 rounded-md hover:bg-gray-100"
                              aria-label="Delete user"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                <line x1="14" y1="11" x2="14" y2="17"></line>
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="py-8 text-center text-gray-500">
                        {searchTerm ? "No users matching your search" : "No users found"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="p-4 bg-gray-50 border-t border-gray-100 text-sm text-gray-500">
              Showing {filteredUsers.length} of {users.length} users
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagementPage;