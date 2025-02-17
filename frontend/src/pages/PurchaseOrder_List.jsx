// frontend/src/components/PurchaseOrder_List.jsx
import React from 'react';
import Sidebar_Secondary from '../components/Sidebar_Secondary';
import { useNavigate } from "react-router-dom";

const PurchaseOrder_List = () => {
  const navigate = useNavigate(); // Define navigate
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar_Secondary />

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-6">
      </main>
    </div>
  );
};

export default PurchaseOrder_List;