// UserList.jsx
import React, { useState, useEffect } from "react";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ emailPrefix: "", password: "", role: "Sales", accessiblePages: [] });

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    setUsers(storedUsers);
  }, []);

  const handleCreateUser = () => {
    const email = `${newUser.emailPrefix}@pgmicro.com`;
    const newUserData = {
      email,
      password: newUser.password,
      role: newUser.role,
      status: "Active",
      accessiblePages: newUser.accessiblePages,
    };
    const updatedUsers = [...users, newUserData];
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
    setNewUser({ emailPrefix: "", password: "", role: "Sales", accessiblePages: [] });
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">User Management</h2>

      <div className="bg-white p-4 rounded shadow mb-6">
        <h3 className="text-lg font-semibold mb-2">Create New User</h3>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            placeholder="username"
            value={newUser.emailPrefix}
            onChange={(e) => setNewUser({ ...newUser, emailPrefix: e.target.value })}
            className="border px-3 py-1 rounded"
          />
          <span className="self-center">@pgmicro.com</span>
          <input
            type="password"
            placeholder="password"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            className="border px-3 py-1 rounded"
          />
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            className="border px-2 py-1 rounded"
          >
            <option value="Sales">Sales</option>
            <option value="Inventory">Inventory</option>
            <option value="PurchaseOrder">Purchase Order</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
        <div className="mb-2">
          <label className="block font-medium">Accessible Pages:</label>
          <div className="flex gap-3 mt-1">
            {["dashboard", "sales", "inventory", "purchase-order"].map((page) => (
              <label key={page} className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={newUser.accessiblePages.includes(page)}
                  onChange={(e) => {
                    const updatedPages = e.target.checked
                      ? [...newUser.accessiblePages, page]
                      : newUser.accessiblePages.filter((p) => p !== page);
                    setNewUser({ ...newUser, accessiblePages: updatedPages });
                  }}
                />
                {page}
              </label>
            ))}
          </div>
        </div>
        <button
          onClick={handleCreateUser}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Create User
        </button>
      </div>

      <h3 className="text-lg font-semibold mb-2">All Users</h3>
      <table className="w-full table-auto border">
        <thead className="bg-purple-100">
          <tr>
            <th className="border px-2 py-1">Email</th>
            <th className="border px-2 py-1">Role</th>
            <th className="border px-2 py-1">Status</th>
            <th className="border px-2 py-1">Accessible Pages</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, idx) => (
            <tr key={idx} className="text-center">
              <td className="border px-2 py-1">{user.email}</td>
              <td className="border px-2 py-1">{user.role}</td>
              <td className="border px-2 py-1">{user.status}</td>
              <td className="border px-2 py-1">{user.accessiblePages?.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
