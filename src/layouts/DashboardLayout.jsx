import React from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const DashboardLayout = ({ children }) => {
    return (
        <div className="flex h-screen">
            {/* Sidebar */} // sidebar component
            <Sidebar />

            {/* Main content */}
            <div class name="flex-1 flex flex-col">
                <Header /> //  header component
                <main className="p-6 flex-1 bg-gray-100 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;