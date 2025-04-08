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
import { ROLES } from "../utils/roleConfig";

// 🔐 Protected route wrapper
const ProtectedRoute = ({ element, allowedRoles }) => {
  const isAuthenticated = sessionStorage.getItem("isAuthenticated") === "true";
  const userRole = sessionStorage.getItem("userRole");

  console.group("Protected Route Check");
  console.log("Is Authenticated:", isAuthenticated);
  console.log("User Role:", userRole);
  console.log("Allowed Roles:", allowedRoles);
  console.groupEnd();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    console.error("Access Denied", { userRole, allowedRoles });
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
            allowedRoles={[
              ROLES.ADMIN, 
              ROLES.EMPLOYEE, 
              ROLES.INVENTORY, 
              ROLES.SALES, 
              ROLES.RETURNS
            ]}
          />
        }
      />

      {/* Inventory */}
      <Route
        path="/inventory"
        element={
          <ProtectedRoute
            element={<InventoryPage />}
            allowedRoles={[ROLES.ADMIN, ROLES.INVENTORY]}
          />
        }
      />

      {/* Damaged Products Page */}
      <Route
        path="/damaged-products"
        element={
          <ProtectedRoute
            element={<DamagedProductsPage />}
            allowedRoles={[ROLES.ADMIN, ROLES.INVENTORY]}
          />
        }
      />

      {/* Purchase Orders */}
      <Route
        path="/purchase-orders"
        element={
          <ProtectedRoute
            element={<PurchaseOrderPage />}
            allowedRoles={[ROLES.ADMIN, ROLES.INVENTORY]}
          />
        }
      />
      <Route
        path="/purchase-orders/create"
        element={
          <ProtectedRoute
            element={<CreatePurchaseOrder />}
            allowedRoles={[ROLES.ADMIN, ROLES.INVENTORY]}
          />
        }
      />
      <Route
        path="/purchase-orders/view"
        element={
          <ProtectedRoute
            element={<ViewPurchaseOrder />}
            allowedRoles={[ROLES.ADMIN, ROLES.INVENTORY]}
          />
        }
      />

      {/* Sales */}
      <Route
        path="/sales"
        element={
          <ProtectedRoute
            element={<SalesOrderPage />}
            allowedRoles={[ROLES.ADMIN, ROLES.SALES]}
          />
        }
      />

      {/* Returns */}
      <Route
        path="/return-warranty"
        element={
          <ProtectedRoute
            element={<ReturnWarrantyPage />}
            allowedRoles={[ROLES.ADMIN, ROLES.RETURNS]}
          />
        }
      />
      <Route
        path="/returnform"
        element={
          <ProtectedRoute
            element={<ReturnsFormPage />}
            allowedRoles={[ROLES.ADMIN, ROLES.RETURNS]}
          />
        }
      />
      <Route
        path="/return-details"
        element={
          <ProtectedRoute
            element={<ReturnDetailsPage />}
            allowedRoles={[ROLES.ADMIN, ROLES.RETURNS]}
          />
        }
      />

      {/* Reports */}
      <Route
        path="/reports"
        element={
          <ProtectedRoute
            element={<ReportModule />}
            allowedRoles={[ROLES.ADMIN]}
          />
        }
      />

      {/* User Management (Admin Only) */}
      <Route
        path="/user-management"
        element={
          <ProtectedRoute
            element={<UserManagementPage />}
            allowedRoles={[ROLES.ADMIN]}
          />
        }
      />
    </Routes>
  );
};

export default AppRoutes;