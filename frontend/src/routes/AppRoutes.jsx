import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";

// Import Pages
import LoginPage from "../pages/LoginPage";
import Dashboard from "../pages/Dashboard";
import InventoryPage from "../pages/InventoryPage";
import DamagedProductsPage from "../pages/DamageProductsPage";

// Purchase Orders
import PurchaseOrderPage from "../pages/PurchaseOrders/PurchaseOrderPage";
import ProductList from "../pages/PurchaseOrders/ProductList";
import SupplierPO from "../pages/PurchaseOrders/SupplierPO";

// Sales
import SalesOrderPage from "../pages/Sales/SalesOrderPage";
import IncomeList from "../pages/Sales/IncomeList"; 
import CustomerSales from "../pages/Sales/CustomerSales";

// Returns
import ReturnWarrantyPage from "../pages/Returns/ReturnWarrantyPage";
import WarrantyList from "../pages/Returns/WarrantiesList";
import CustomerReturns from "../pages/Returns/CustomerReturns";

// Reports Module
import ReportModule from "../pages/ReportModule/ReportModule";

// User Management Page import
import UserManagementPage from "../pages/UserManagement/UserManagementPage";
import { ROLES } from "../utils/roleConfig";

// Protected route wrapper
const ProtectedRoute = ({ element, allowedRoles }) => {
  const isAuthenticated = sessionStorage.getItem("isAuthenticated") === "true";
  const userRole = sessionStorage.getItem("userRole");
  const accessiblePages = JSON.parse(sessionStorage.getItem("accessiblePages") || "[]");
  
  // Get the base path from the current route
  const currentPath = window.location.pathname;
  const basePath = currentPath.split('/')[1]; // e.g., "inventory" from "/inventory"

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Check if the user has access based on either role or accessible pages
  const hasRoleAccess = allowedRoles.includes(userRole);
  const hasPageAccess = accessiblePages.includes(basePath);
  
  if (!hasRoleAccess && !hasPageAccess) {
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
      } catch (error) {
        console.error("Error saving inventory to localStorage:", error);
      }
    }
  }, [inventory]);

  // Function to handle inventory updates from InventoryPage
  const handleInventoryUpdate = (updatedInventory) => {
    setInventory(updatedInventory);
  };

  // Function to update product status (used by SalesOrderPage)
  const updateInventoryStatus = async (productId, status) => {
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
      {/* Public Login Page - No layout wrapper here */}
      <Route path="/" element={<LoginPage />} />

      {/* Protected Routes */}
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

      <Route path="/inventory"
        element={
          <ProtectedRoute
            element={<InventoryPage onInventoryUpdate={handleInventoryUpdate} />}
            allowedRoles={[ROLES.ADMIN, ROLES.INVENTORY]}
          />
        }
      />

      <Route
        path="/damaged-products"
        element={
          <ProtectedRoute
            element={<DamagedProductsPage />}
            allowedRoles={[ROLES.ADMIN, ROLES.INVENTORY]}
          />
        }
      />

      <Route
        path="/purchase-orders"
        element={
          <ProtectedRoute
            element={<PurchaseOrderPage />}
            allowedRoles={[ROLES.ADMIN, ROLES.PURCHASE_ORDER]}
          />
        }
      />

      <Route
        path="/product-list"
        element={
          <ProtectedRoute
            element={<ProductList />}
            allowedRoles={[ROLES.ADMIN, ROLES.PURCHASE_ORDER]}
          />
        }
      />

      <Route
        path="/supplier-po"
        element={
          <ProtectedRoute
            element={<SupplierPO />}
            allowedRoles={[ROLES.ADMIN, ROLES.PURCHASE_ORDER]}
          />
        }
      />

      {/* Important: Don't wrap SalesOrderPage with DashboardLayout since it already has it internally */}
      <Route
        path="/sales"
        element={
          <ProtectedRoute
            element={
              <DashboardLayout>
                <SalesOrderPage 
                  inventoryData={inventory} 
                  updateInventoryStatus={updateInventoryStatus} 
                />
              </DashboardLayout>
            }
            allowedRoles={[ROLES.ADMIN, ROLES.SALES]}
          />
        }
      />

      {/* Keep Income List wrapped with DashboardLayout */}
      <Route
        path="/income-list"
        element={
          <ProtectedRoute
            element={
              <DashboardLayout>
                <IncomeList onBack={() => window.history.back()} storageKey="incomeData" />
              </DashboardLayout>
            }
            allowedRoles={[ROLES.ADMIN, ROLES.SALES]}
          />
        }
      />

      {/* Keep Customer List wrapped with DashboardLayout */}
      <Route
        path="/customer-sales"
        element={
          <ProtectedRoute
            element={
              <DashboardLayout>
                <CustomerSales onBack={() => window.history.back()} />
              </DashboardLayout>
            }
            allowedRoles={[ROLES.ADMIN, ROLES.SALES]}
          />
        }
      />

      <Route
        path="/return-warranty"
        element={
          <ProtectedRoute
            element={<ReturnWarrantyPage />}
            allowedRoles={[ROLES.ADMIN, ROLES.RETURNS]}
          />
        }
      />

      {/* New Route for Warranties Page */}
      <Route
        path="/warranties"
        element={
          <ProtectedRoute
            element={<WarrantyList />}
            allowedRoles={[ROLES.ADMIN, ROLES.RETURNS, ROLES.WARRANTY_LIST]}
          />
        }
      />

      {/* New Route for Customer List Page */}
      <Route
        path="/customer-returns"
        element={
          <ProtectedRoute
            element={<CustomerReturns />}
            allowedRoles={[ROLES.ADMIN, ROLES.RETURNS]}
          />
        }
      />

      <Route
        path="/reports"
        element={
          <ProtectedRoute
            element={<ReportModule />}
            allowedRoles={[ROLES.ADMIN]}
          />
        }
      />

      <Route
        path="/user-management"
        element={
          <ProtectedRoute
            element={<UserManagementPage />}
            allowedRoles={[ROLES.ADMIN]}
          />
        }
      />

      {/* Default route - redirect to dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;