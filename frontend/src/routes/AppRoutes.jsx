// src/components/AppRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import InventoryPage from "../pages/InventoryPage";
import PurchaseOrderPage from "../pages/PurchaseOrderPage";
import SalesPage from "../pages/SalesPage";
import ReturnWarrantyPage from "../pages/ReturnWarrantyPage";
import ReturnForm from "../pages/ReturnFormPage";
import ReturnDetails from "../pages/ReturnDetailsPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/inventory" element={<InventoryPage />} />
      <Route path="/purchase-orders" element={<PurchaseOrderPage />} />
      <Route path="/sales" element={<SalesPage />} />
      <Route path="/return-warranty" element={<ReturnWarrantyPage />} />
      <Route path="/returnform" element={<ReturnForm />} />
      <Route path="/return-details" element={<ReturnDetails />} />
    </Routes>
  );
};

export default AppRoutes;
