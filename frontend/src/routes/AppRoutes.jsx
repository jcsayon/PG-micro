import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Import Pages
import LoginPage from "../pages/LoginPage";
import SignUpPage from "../pages/SignUpPage";
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

const AppRoutes = () => {
  const [auth, setAuth] = useState({
    isAuthenticated: sessionStorage.getItem("isAuthenticated") === "true",
    role: sessionStorage.getItem("userRole") || null,
  });

  useEffect(() => {
    setAuth({
      isAuthenticated: sessionStorage.getItem("isAuthenticated") === "true",
      role: sessionStorage.getItem("userRole") || null,
    });
  }, []);

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
      <Route path="/" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />

      <Route
        path="/dashboard"
        element={
          auth.isAuthenticated ? <Dashboard /> : <Navigate to="/" replace />
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

      {/* ✅ Damaged Products Page Route */}
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
          <ProtectedRoute element={<ReportModule />} allowedRoles={["Admin"]} />
        }
      />
    </Routes>
  );
};

export default AppRoutes;