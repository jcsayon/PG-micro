import React, { useState, useEffect } from "react";
import Sidebar_Primary from "../../components/Sidebar_Primary";

const UserManagementPage = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const collapsed = localStorage.getItem("sidebarCollapsed") === "true";
    setIsSidebarCollapsed(collapsed);
  }, []);

  const [users, setUsers] = useState([
    { username: "admin@pgmicro.com", role: "Admin" },
  ]);
  const [form, setForm] = useState({ username: "", password: "", role: "Inventory" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddUser = () => {
    if (!form.username || !form.password || !form.role) return;
    setUsers([...users, { username: form.username, role: form.role }]);
    setForm({ username: "", password: "", role: "Inventory" });
  };

  return (
    <div className="flex">
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
        className={`p-6 min-h-screen bg-gray-50 transition-all duration-300 flex-1 ${
          isSidebarCollapsed ? "ml-16" : "ml-64"
        }`}
      >
        <h1 className="text-3xl font-bold text-purple-700 mb-6">User Management</h1>

        <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Username / Email"
              className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="Inventory">Inventory</option>
              <option value="Sales">Sales</option>
              <option value="Purchase Order">Purchase Order</option>
              <option value="Warranty List">Warranty List</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <button
            onClick={handleAddUser}
            className="mt-4 bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition"
          >
            Add User
          </button>
        </div>

        <h2 className="text-xl font-semibold text-purple-600 mb-2">Registered Users</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead>
              <tr className="bg-purple-100 text-purple-800">
                <th className="text-left py-3 px-4 font-medium">Username</th>
                <th className="text-left py-3 px-4 font-medium">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index} className="border-t border-gray-200">
                  <td className="py-2 px-4">{user.username}</td>
                  <td className="py-2 px-4">{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagementPage;
