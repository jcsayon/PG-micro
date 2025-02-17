// frontend/src/components/Sidebar_Secondary.jsx
import React from "react";
import { NavLink, useNavigate ,useLocation } from "react-router-dom";

const Sidebar_Secondary = () => {
  const location = useLocation(); // Get the current route
  const navigate = useNavigate();

  // list all other paths for page links from return-warranty, purchase-order, sales
  // Define all possible menu links
  const MenuLinks = [    
    //SALES
    { name: "Sales", path: "/sales" }, // Default SALES Page
    { name: "Customer Form", path: "/customerform" },
    //PURCHASE ORDERS
    { name: "Purchase Order", path: "/purchase-order-list" }, // Default PURCHASE ORDERS Page
    //RETRUN WARRANTY
    { name: "Return List", path: "/return-warranty-list" }, // Default RETRUN WARRANTY Page 
    { name: "Return Form", path: "/return-warranty-form" },
  ];

  // Define visibility rules for specific pages
  let menuLinks = MenuLinks.filter(link => {
    if (location.pathname === "/return-warranty-list" || location.pathname === "/return-warranty-form") {
      // Only show Return List & Return Form on these pages
      return link.path === "/return-warranty-list" || link.path === "/return-warranty-form";
    } 
    
    else if (location.pathname === "/sales" || location.pathname === "/purchase-order-list") {
      // Hide Return List & Return Form in Sales and Purchase Order
      return link.path !== "/return-warranty-list" && link.path !== "/return-warranty-form";
    }

    return true; // Show all links for other pages
  });

  return (
    <aside className="w-64 bg-purple-700 text-white p-5 min-h-screen">
      <div className="flex items-center mb-6">
        {/* Back to Dashboard Button */}
        <button onClick={() => navigate("/")}
        className="bg-purple-800 border-2 border-purple-800 text-white px-4 py-2 mb-4 block p-2 mr-2 hover:bg-purple-700 hover:border-2 hover:border-purple-800 rounded"
        >&lt;</button>

        {/* Section Headers Based on Current Page */}
        {location.pathname === "/sales" && <h2 className="text-lg font-bold mb-4">Sales</h2>}
        {location.pathname === "/purchase-order-list" && <h2 className="text-lg font-bold mb-4">Purchase Order</h2>}
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
