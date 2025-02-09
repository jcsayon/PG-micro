import React from "react";
import { Routes, Route} from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import Dashboard from '../pages/Dashboard';
import InventoryPage from "../pages/InventoryPage";
import PurchaseOrderPage from "../pages/PurchaseOrders/PurchaseOrderPage";
import SalesPage from "../pages/Sales/SalesPage"; // Create this page
import ReturnWarrantyPage from "../pages/Returns/ReturnWarrantyPage"; // Create this page

const AppRoutes = () => {
    console.log("AppRoutes is rendering"); // Log a message to the console
    return (
        <Routes>
            {/* Define the route for the login page */}
            <Route path="/" element={<LoginPage />} />
            {/* Define the route for the dashboard */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/purchase-orders" element={<PurchaseOrderPage />} />
            <Route path="/sales" element={<SalesPage />} />
            <Route path="/return-warranty" element={<ReturnWarrantyPage />} />
        </Routes>
    );
};
export default AppRoutes;