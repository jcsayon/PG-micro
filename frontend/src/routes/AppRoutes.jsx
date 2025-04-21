import React, { useState, useEffect } from "react";
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

// User Management Page import
import UserManagementPage from "../pages/UserManagement/UserManagementPage";
import { ROLES } from "../utils/roleConfig";

// Protected route wrapper
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
  // Initialize inventory from localStorage if available
  const [inventory, setInventory] = useState(() => {
    try {
      const savedInventory = localStorage.getItem('inventoryData');
      return savedInventory ? JSON.parse(savedInventory) : [];
    } catch (error) {
      console.error("Error loading inventory from localStorage:", error);
      return [];
    }
  });

  // Save inventory to localStorage whenever it changes
  useEffect(() => {
    if (inventory && inventory.length > 0) {
      try {
        localStorage.setItem('inventoryData', JSON.stringify(inventory));
        console.log("Saved inventory to localStorage:", inventory.length);
      } catch (error) {
        console.error("Error saving inventory to localStorage:", error);
      }
    }
  }, [inventory]);

  // Function to handle inventory updates from InventoryPage
  const handleInventoryUpdate = (updatedInventory) => {
    console.log("Inventory updated with", updatedInventory.length, "items");
    setInventory(updatedInventory);
  };

  // Function to update product status (used by SalesOrderPage)
  const updateInventoryStatus = async (productId, status) => {
    console.log(`Updating product ${productId} status to ${status}`);
    
    const updatedInventory = inventory.map(product => 
      product.id === productId ? {...product, saleStatus: status} : product
    );
    
    setInventory(updatedInventory);
    
    // Save to localStorage immediately for extra safety
    try {
      localStorage.setItem('inventoryData', JSON.stringify(updatedInventory));
    } catch (error) {
      console.error("Error saving updated inventory to localStorage:", error);
    }
    
    return updatedInventory; // Return value for promise chaining
  };

  return (
    <Routes>
      {/* Public Login Page */}
      <Route path="/" element={<LoginPage />} />

      {/* Protected Dashboard with proper roles */}
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
              ROLES.RETURNS,
              ROLES.PURCHASE_ORDER,
              ROLES.WARRANTY_LIST
            ]}
          />
        }
      />

      {/* Inventory - Only Admin and Inventory roles */}
      <Route
        path="/inventory"
        element={
          <ProtectedRoute
            element={<InventoryPage onInventoryUpdate={handleInventoryUpdate} />}
            allowedRoles={[ROLES.ADMIN, ROLES.INVENTORY]}
          />
        }
      />

      {/* Damaged Products Page - Only Admin and Inventory roles */}
      <Route
        path="/damaged-products"
        element={
          <ProtectedRoute
            element={<DamagedProductsPage />}
            allowedRoles={[ROLES.ADMIN, ROLES.INVENTORY]}
          />
        }
      />

      {/* Purchase Orders - Only Admin and Purchase Order roles */}
      <Route
        path="/purchase-orders"
        element={
          <ProtectedRoute
            element={<PurchaseOrderPage />}
            allowedRoles={[ROLES.ADMIN, ROLES.PURCHASE_ORDER]} // Removed INVENTORY role
          />
        }
      />
      <Route
        path="/purchase-orders/create"
        element={
          <ProtectedRoute
            element={<CreatePurchaseOrder />}
            allowedRoles={[ROLES.ADMIN, ROLES.PURCHASE_ORDER]} // Removed INVENTORY role
          />
        }
      />
      <Route
        path="/purchase-orders/view"
        element={
          <ProtectedRoute
            element={<ViewPurchaseOrder />}
            allowedRoles={[ROLES.ADMIN, ROLES.PURCHASE_ORDER]} // Removed INVENTORY role
          />
        }
      />

      {/* Sales - Only Admin and Sales roles */}
      <Route
        path="/sales"
        element={
          <ProtectedRoute
            element={<SalesOrderPage 
              inventoryData={inventory} 
              updateInventoryStatus={updateInventoryStatus} 
            />}
            allowedRoles={[ROLES.ADMIN, ROLES.SALES]}
          />
        }
      />

      {/* Returns - Admin, Returns, and Warranty List roles */}
      <Route
        path="/return-warranty"
        element={
          <ProtectedRoute
            element={<ReturnWarrantyPage />}
            allowedRoles={[ROLES.ADMIN, ROLES.RETURNS, ROLES.WARRANTY_LIST]}
          />
        }
      />
      <Route
        path="/returnform"
        element={
          <ProtectedRoute
            element={<ReturnsFormPage />}
            allowedRoles={[ROLES.ADMIN, ROLES.RETURNS, ROLES.WARRANTY_LIST]}
          />
        }
      />
      <Route
        path="/return-details"
        element={
          <ProtectedRoute
            element={<ReturnDetailsPage />}
            allowedRoles={[ROLES.ADMIN, ROLES.RETURNS, ROLES.WARRANTY_LIST]}
          />
        }
      />

      {/* Reports - Admin only */}
      <Route
        path="/reports"
        element={
          <ProtectedRoute
            element={<ReportModule />}
            allowedRoles={[ROLES.ADMIN]}
          />
        }
      />

      {/* User Management - Admin Only */}
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