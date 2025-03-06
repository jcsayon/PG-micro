import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Import Pages
import LoginPage from "../pages/LoginPage";
import SignUpPage from "../pages/SignUpPage";
import Dashboard from "../pages/Dashboard";
import InventoryPage from "../pages/InventoryPage";

// Purchase Orders
import PurchaseOrderPage from "../pages/PurchaseOrders/PurchaseOrderPage";
import CreatePurchaseOrder from "../pages/PurchaseOrders/CreatePurchaseOrder";
import ViewPurchaseOrder from "../pages/PurchaseOrders/ViewPurchaseOrder";

// Sales
import SalesOrderPage from "../pages/Sales/SalesOrderPage";

// Returns
import ReturnWarrantyPage from "../pages/Returns/ReturnWarrantyPage";
import ReturnsFormPage from "../pages/Returns/ReturnsFormPage";
import ReturnDetailsPage from "../pages/Returns/ReturnDetailsPage";

// Reports Module (Fixed import path)
import ReportModule from "../pages/ReportModule/ReportModule";

const AppRoutes = () => {
  // Load authentication state from sessionStorage
  const [auth, setAuth] = useState({
    isAuthenticated: sessionStorage.getItem("isAuthenticated") === "true",
    role: sessionStorage.getItem("userRole") || null,
  });

  useEffect(() => {
    // Update state when session storage changes
    setAuth({
      isAuthenticated: sessionStorage.getItem("isAuthenticated") === "true",
      role: sessionStorage.getItem("userRole") || null,
    });
  }, []);

  // Protected Route Component
  const ProtectedRoute = ({ element, allowedRoles }) => {
    if (!auth.isAuthenticated) {
      return <Navigate to="/" replace />;
    }
    if (!allowedRoles.includes(auth.role)) {
      return <Navigate to="/dashboard" replace />;
    }
    return element;
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />

      {/* Dashboard (Accessible to All Authenticated Users) */}
      <Route
        path="/dashboard"
        element={
          auth.isAuthenticated ? <Dashboard /> : <Navigate to="/" replace />
        }
      />

      {/* Protected Routes */}
      <Route
        path="/inventory"
        element={
          <ProtectedRoute
            element={<InventoryPage />}
            allowedRoles={["Admin", "Inventory"]}
          />
        }
      />

      {/* Purchase Orders */}
      <Route
        path="/purchase-orders"
        element={
          <ProtectedRoute
            element={<PurchaseOrderPage />}
            allowedRoles={["Admin", "Inventory"]}
          />
        }
      />
      <Route
        path="/purchase-orders/create"
        element={
          <ProtectedRoute
            element={<CreatePurchaseOrder />}
            allowedRoles={["Admin", "Inventory"]}
          />
        }
      />
      <Route
        path="/purchase-orders/view"
        element={
          <ProtectedRoute
            element={<ViewPurchaseOrder />}
            allowedRoles={["Admin", "Inventory"]}
          />
        }
      />

      {/* Sales */}
      <Route
        path="/sales"
        element={
          <ProtectedRoute
            element={<SalesOrderPage />}
            allowedRoles={["Admin", "Sales"]}
          />
        }
      />

      {/* Returns */}
      <Route
        path="/return-warranty"
        element={
          <ProtectedRoute
            element={<ReturnWarrantyPage />}
            allowedRoles={["Admin", "Returns"]}
          />
        }
      />
      <Route
        path="/returnform"
        element={
          <ProtectedRoute
            element={<ReturnsFormPage />}
            allowedRoles={["Admin", "Returns"]}
          />
        }
      />
      <Route
        path="/return-details"
        element={
          <ProtectedRoute
            element={<ReturnDetailsPage />}
            allowedRoles={["Admin", "Returns"]}
          />
        }
      />

      {/* Report Module */}
      <Route
        path="/reports"
        element={
          <ProtectedRoute element={<ReportModule />} allowedRoles={["Admin"]} />
        }
      />
    </Routes>
  );
};

export default AppRoutes;
