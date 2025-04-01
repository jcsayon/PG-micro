// src/pages/UserManagement/UserList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useNavigate } from 'react-router-dom';

const UserList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/users/', {
        headers: { 'Content-Type': 'application/json' }
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

  // Pagination calculation
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
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-8">User Management</h1>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => navigate('/users/add')}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Add User
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">ID</th>
                <th className="px-4 py-2 border">Username</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Name</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.length > 0 ? (
                currentUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="px-4 py-2 border text-center">{user.id}</td>
                    <td className="px-4 py-2 border">{user.username}</td>
                    <td className="px-4 py-2 border">{user.email}</td>
                    <td className="px-4 py-2 border">
                      {user.first_name} {user.last_name}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-4 py-2 border text-center" colSpan="4">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex justify-center mt-4 space-x-4">
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
