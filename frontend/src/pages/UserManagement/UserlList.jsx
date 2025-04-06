// src/pages/UserManagement/UserList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';

// Mapping for role descriptions
const roleDescriptions = {
  Admin: 'Full system access and management',
  Employee: 'General employee access',
  Inventory: 'Manage inventory and stock',
  Sales: 'Handle sales orders and customer data',
};

const UserList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/users/', {
        headers: { 'Content-Type': 'application/json' },
      });
      setUsers(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch users.');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
          <button
            onClick={() => navigate('/users/add')}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded shadow transition"
          >
            Add User
          </button>
        </div>

        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-6 py-3 border text-left text-sm font-semibold text-gray-700">
                  ID
                </th>
                <th className="px-6 py-3 border text-left text-sm font-semibold text-gray-700">
                  Username
                </th>
                <th className="px-6 py-3 border text-left text-sm font-semibold text-gray-700">
                  Email
                </th>
                <th className="px-6 py-3 border text-left text-sm font-semibold text-gray-700">
                  Name
                </th>
                <th className="px-6 py-3 border text-left text-sm font-semibold text-gray-700">
                  Role
                </th>
                <th className="px-6 py-3 border text-left text-sm font-semibold text-gray-700">
                  Role Description
                </th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.length > 0 ? (
                currentUsers.map((user) => (
                  <tr key={user.id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-3 border text-sm text-center">
                      {user.id}
                    </td>
                    <td className="px-6 py-3 border text-sm">{user.username}</td>
                    <td className="px-6 py-3 border text-sm">{user.email}</td>
                    <td className="px-6 py-3 border text-sm">
                      {user.first_name} {user.last_name}
                    </td>
                    <td className="px-6 py-3 border text-sm">{user.role}</td>
                    <td className="px-6 py-3 border text-sm">
                      {roleDescriptions[user.role] || 'N/A'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-6 py-3 border text-center" colSpan="6">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center mt-6 space-x-4">
          <button
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-4 py-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserList;
