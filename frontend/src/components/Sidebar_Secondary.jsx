// frontend/src/components/Sidebar_Secondary.jsx
import React from "react";
import { NavLink,useLocation } from "react-router-dom";

const Sidebar_Secondary = () => {
  const location = useLocation(); // Get the current route

  // list all other paths for page links from return-warranty, purchase-orders, sales
  // Define all possible menu links
  const MenuLinks = [
    //PO
    { name: "Purchase Orders", path: "/purchase-orders" },
    //SALES
    { name: "Sales", path: "/sales" },  
    { name: "Customer Form", path: "/customerform" },
    //RETURN-WARRANTY
    { name: "Return List", path: "/return-warranty" },
    { name: "Return Form", path: "/returnform" },
  ];

  // Define visibility rules for specific pages
let menuLinks = MenuLinks.filter(link => {
  if (location.pathname === "/return-warranty" || location.pathname === "/returnform") {
    // Only show Return List & Return Form on these pages
    return link.path === "/return-warranty" || link.path === "/returnform";
  } 
  
  else if (location.pathname === "/sales" || location.pathname === "/purchase-orders") {
    // Hide Return List & Return Form in Sales and Purchase Orders
    return link.path !== "/return-warranty" && link.path !== "/returnform";
  }

  return true; // Show all links for other pages
});



  return (
    <aside className="w-64 bg-purple-700 text-white p-5 min-h-screen">
      <h2 className="text-lg font-bold mb-6">Returns & Warranty</h2>
      <nav className="space-y-3">
        {menuLinks.map((link, index) => (
          <NavLink
            key={index}
            to={link.path}
            className={({ isActive }) =>
              isActive
                ? "block bg-purple-900 p-3 rounded transition"
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
