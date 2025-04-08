// src/components/UnauthorizedPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50">
      <div className="bg-white p-8 rounded-xl shadow-md text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Unauthorized Access</h2>
        <p className="text-gray-600 mb-6">
          You do not have permission to access this page.
        </p>
        <div className="flex justify-center space-x-4">
          <button 
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md"
          >
            Back to Login
          </button>
          <button 
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-md"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;