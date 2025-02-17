// frontend/src/components/AppRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import InventoryPage from "../pages/InventoryPage";
//SALES
import Sales_List from "../pages/Sales_List";
import Sales_Customer from "../pages/Sales_Customer";
import Sales_Summary from "../pages/Sales_Summary";
//PURCHASE ORDER
import PurchaseOrder_List from "../pages/PurchaseOrder_List";
import PurchaseOrder_Supplier from "../pages/PurchaseOrder_Supplier";
import PurchaseOrder_Order from "../pages/PurchaseOrder_Order";
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
      <Route path="/sales-list" element={<Sales_List />} />
      <Route path="/sales-customer" element={<Sales_Customer />} />
      <Route path="/sales-summary/:saleId" element={<Sales_Summary />} />
      {/* PURCHASE ORDER */}
      <Route path="/purchase-order-list" element={<PurchaseOrder_List />} />
      <Route path="/purchase-order-supplier" element={<PurchaseOrder_Supplier />} />
      <Route path="/purchase-order-order" element={<PurchaseOrder_Order />} />
      {/* RETRUN WARRANTY */}
      <Route path="/return-warranty-list" element={<ReturnWarranty_List />} />
      <Route path="/return-warranty-form" element={<ReturnWarranty_Form />} />
      <Route path="/return-warranty-details" element={<ReturnWarranty_Details />} />
    </Routes>
  );
};

export default AppRoutes;
