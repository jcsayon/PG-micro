// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { ROLES } from '../utils/roleConfig';

const ProtectedRoute = ({ element, allowedRoles }) => {
  const isAuthenticated = sessionStorage.getItem("isAuthenticated") === "true";
  const userRole = sessionStorage.getItem("userRole");

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Check if user's role is allowed
  const isAuthorized = allowedRoles.includes(userRole);

  // If not authorized, redirect to unauthorized page
  if (!isAuthorized) {
    return <Navigate to="/unauthorized" replace />;
  }

  return element;
};

export default ProtectedRoute;