import React from "react";
import { Routes, Route} from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import Dashboard from '../pages/Dashboard';

const AppRoutes = () => {
    console.log("AppRoutes is rendering"); // Log a message to the console
    return (
        <Routes>
            {/* Define the route for the login page */}
            <Route path="/" element={<LoginPage />} />
            {/* Define the route for the dashboard */}
            <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
    );
};
export default AppRoutes;