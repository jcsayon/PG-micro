import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import Dashboard from "../pages/Dashboard";
import InventoryPage from "../pages/InventoryPage";

// Purchase Orders
import PurchaseOrderPage from "../pages/PurchaseOrders/PurchaseOrderPage";
import CreatePurchaseOrder from "../pages/PurchaseOrders/CreatePurchaseOrder";
import ViewPurchaseOrder from "../pages/PurchaseOrders/ViewPurchaseOrder";
// Sales
import SalesOrderPage from "../pages/Sales/SalesOrderPage";
//import ViewSalesDetails from "../pages/Sales/ViewSalesDetails"; // Ensure this file exists

// Returns
import ReturnWarrantyPage from "../pages/Returns/ReturnWarrantyPage";
//import ViewReturnDetails from "../pages/Returns/ViewReturnDetails"; // Ensure this file exists

const AppRoutes = () => {
    console.log("AppRoutes is rendering"); // Log a message to the console
    return (
        <Routes>
            {/* Define the route for the login page */}
            <Route path="/" element={<LoginPage />} />
            {/* Define the route for the dashboard */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/inventory" element={<InventoryPage />} />

            {/* Purchase Orders */}
            <Route path="/purchase-orders" element={<PurchaseOrderPage />} />
            <Route path="/purchase-orders/create" element={<CreatePurchaseOrder />} />
            <Route path="/purchase-orders/view" element={<ViewPurchaseOrder />} />

            {/* For Sales */}
            <Route path="/sales" element={<SalesOrderPage />} />
            {/* <Route path="/sales/view" element={<ViewSalesDetails />} /> */}

            {/* For Returns */}
            <Route path="/return-warranty" element={<ReturnWarrantyPage />} />
            {/* <Route path="/return-warranty/view" element={<ViewReturnDetails />} /> */}
        </Routes>
    );
};

export default AppRoutes;