// src/routes/AppRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import Dashboard from "../pages/Dashboard";
import InventoryPage from "../pages/InventoryPage";
import PurchaseOrderPage from "../pages/PurchaseOrders/PurchaseOrderPage";
import SalesOrderPage from "../pages/Sales/SalesOrderPage";
import ReturnWarrantyPage from "../pages/Returns/ReturnWarrantyPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/inventory" element={<InventoryPage />} />
      <Route path="/purchase-orders" element={<PurchaseOrderPage />} />
      <Route path="/sales" element={<SalesOrderPage />} />
      <Route path="/return-warranty" element={<ReturnWarrantyPage />} />
    </Routes>
  );
};

export default AppRoutes;
