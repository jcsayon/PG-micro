// frontend/src/components/AppRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import InventoryPage from "../pages/InventoryPage";
//SALES
import SalesPage from "../pages/SalesPage";
//PURCHASE ORDER
import PurchaseOrder_List from "../pages/PurchaseOrder_List";
//RETRUN WARRANTY
import ReturnWarranty_List from "../pages/ReturnWarranty_List";
import ReturnWarranty_Form from "../pages/ReturnWarranty_Form";
import ReturnWarranty_Details from "../pages/ReturnWarranty_Details";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/inventory" element={<InventoryPage />} />
      {/* SALES */}
      <Route path="/sales" element={<SalesPage />} />
      {/* PURCHASE ORDER */}
      <Route path="/purchase-order-list" element={<PurchaseOrder_List />} />
      {/* RETRUN WARRANTY */}
      <Route path="/return-warranty-list" element={<ReturnWarranty_List />} />
      <Route path="/return-warranty-form" element={<ReturnWarranty_Form />} />
      <Route path="/return-warranty-details" element={<ReturnWarranty_Details />} />
    </Routes>
  );
};

export default AppRoutes;
