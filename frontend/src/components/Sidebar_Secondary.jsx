// frontend/src/components/Sidebar_Secondary.jsx
import React from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";

const Sidebar_Secondary = () => {
  const location = useLocation(); // Get the current route
  const navigate = useNavigate();

  // Define all possible menu links
  const MenuLinks = [
    // SALES
    { name: "Sales List", path: "/sales-list" },
    { name: "Sales Customer", path: "/sales-customer" }, 
    // { name: "Sales Summary", path: "/sales-summary" }, // Hidden from all pages

    // PURCHASE ORDERS
    { name: "Purchase Order List", path: "/purchase-order-list" },
    { name: "Supplier Form", path: "/purchase-order-supplier" },
    { name: "Order Form", path: "/purchase-order-order" },

    // RETURN WARRANTY
    { name: "Return List", path: "/return-warranty-list" },
    { name: "Return Form", path: "/return-warranty-form" },
  ];

  // Define visibility rules for specific pages
  let menuLinks = MenuLinks.filter((link) => {
    if (location.pathname === "/sales-list" || location.pathname === "/sales-customer") {
      return link.path === "/sales-list" || link.path === "/sales-customer";
    }
    if (location.pathname === "/sales-summary") {
      return false; // Hide Sales Summary from all pages
    }
    if (
      location.pathname === "/purchase-order-list" ||
      location.pathname === "/purchase-order-supplier" ||
      location.pathname === "/purchase-order-order"
    ) {
      return (
        link.path === "/purchase-order-list" ||
        link.path === "/purchase-order-supplier" ||
        link.path === "/purchase-order-order"
      );
    }
    if (location.pathname === "/return-warranty-list" || location.pathname === "/return-warranty-form") {
      return link.path === "/return-warranty-list" || link.path === "/return-warranty-form";
    }
    return false; // Hide everything else
  });

  return (
    <aside className="w-64 bg-purple-700 text-white p-5 min-h-screen">
      <div className="flex items-center mb-6">
        {/* Back to Dashboard Button */}
        <button
          onClick={() => navigate("/")}
          className="bg-purple-800 border-2 border-purple-800 text-white px-4 py-2 mb-4 block p-2 mr-2 hover:bg-purple-700 hover:border-2 hover:border-purple-800 rounded"
        >
          &lt;
        </button>

        {/* Section Headers Based on Current Page */}
        {(location.pathname === "/sales-list" || location.pathname === "/sales-customer") && (
          <h2 className="text-lg font-bold mb-4">Sales</h2>
        )}
        {(location.pathname === "/purchase-order-list" ||
          location.pathname === "/purchase-order-supplier" ||
          location.pathname === "/purchase-order-order") && (
          <h2 className="text-lg font-bold mb-4">Purchase Order</h2>
        )}
        {(location.pathname === "/return-warranty-list" || location.pathname === "/return-warranty-form") && (
          <h2 className="text-lg font-bold mb-4">Return-Warranty</h2>
        )}
      </div>

      <nav className="space-y-3">
        {menuLinks.map((link, index) => (
          <NavLink
            key={index}
            to={link.path}
            className={({ isActive }) =>
              isActive
                ? "block bg-purple-800 p-3 rounded transition"
                : "block p-3 hover:bg-purple-800 rounded transition"
            }
          >
            {link.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar_Secondary;

