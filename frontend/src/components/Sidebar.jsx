import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const links = [
    { name: "Home", path: "/dashboard" },
    { name: "Account Info", path: "/account-info" },
    { name: "Manage Account", path: "/manage-account" },
    { name: "Expense Center", path: "/expense-center" },
  ];

 

  return (
    <aside className="w-64 bg-purple-800 text-white p-4">
      <h2 className="text-2xl font-bold mb-6">PG Micro World Computers</h2>
      <nav>
        <ul className="space-y-2">
          <li>
            <a href="#" className="block p-2 hover:bg-purple-700 rounded">
              Home
            </a>
          </li>
          <li>
            <a href="#" className="block p-2 hover:bg-purple-700 rounded">
              Account Info
            </a>
          </li>
          <li>
            <a href="#" className="block p-2 hover:bg-purple-700 rounded">
              Settings
            </a>
          </li>
          <li className="mb-2">
            <Link to="/inventory" className="block p-2 hover:bg-purple-600 rounded">
              Inventory
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;