// src/components/SalesSidebar.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaHome, FaShoppingCart, FaRedo } from "react-icons/fa";

const SalesSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div
      className={`bg-purple-700 text-white h-screen transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
    >
      <div className="p-4 flex items-center">
        {!isCollapsed && (
          <span className="ml-2 text-lg font-bold">
            PG Micro World Computers
          </span>
        )}
      </div>
      <nav className="mt-6">
        <ul>
          <li className="mb-2 flex items-center">
            <FaHome className="ml-4" />
            {!isCollapsed && (
              <Link to="/dashboard" className="block p-2 ml-2">
                Home
              </Link>
            )}
          </li>
          <li className="mb-2 flex items-center">
            <FaShoppingCart className="ml-4" />
            {!isCollapsed && (
              <Link to="/purchase-orders" className="block p-2 ml-2">
                Purchase Order
              </Link>
            )}
          </li>
          <li className="mb-2 flex items-center">
            <FaRedo className="ml-4" />
            {!isCollapsed && (
              <Link to="/returns/ReturnWarrantyPage" className="block p-2 ml-2">
                Return Warranty Page
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default SalesSidebar;
