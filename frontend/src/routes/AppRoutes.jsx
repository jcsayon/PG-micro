import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Import Pages
import LoginPage from "../pages/LoginPage";
import Dashboard from "../pages/Dashboard";
import InventoryPage from "../pages/InventoryPage";
import DamagedProductsPage from "../pages/DamageProductsPage";

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

// Reports Module
import ReportModule from "../pages/ReportModule/ReportModule";

// ✅ Corrected User Management Page import
import UserManagementPage from "../pages/UserManagement/UserManagementPage";

// 🔐 Protected route wrapper
const ProtectedRoute = ({ element, allowedRoles }) => {
  const isAuthenticated = sessionStorage.getItem("isAuthenticated") === "true";
  const role = sessionStorage.getItem("userRole");

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return element;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Login Page */}
      <Route path="/" element={<LoginPage />} />

      {/* ✅ Protected Dashboard with proper roles */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute
            element={<Dashboard />}
            allowedRoles={["Admin", "Employee", "Inventory", "Sales", "Returns"]}
          />
        }
      />

      {/* Inventory */}
      <Route
        path="/inventory"
        element={
          <ProtectedRoute
            element={<InventoryPage />}
            allowedRoles={["Admin", "Inventory"]}
          />
        }
      />

      {/* Damaged Products Page */}
      <Route
        path="/damaged-products"
        element={
          <ProtectedRoute
            element={<DamagedProductsPage />}
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

      {/* Reports */}
      <Route
        path="/reports"
        element={
          <ProtectedRoute
            element={<ReportModule />}
            allowedRoles={["Admin"]}
          />
        }
      />

      {/* User Management (Admin Only) */}
      <Route
        path="/user-management"
        element={
          <ProtectedRoute
            element={<UserManagementPage />}
            allowedRoles={["Admin"]}
          />
        }
      />
    </Routes>
  );
};

export default AppRoutes;
