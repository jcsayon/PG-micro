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
    <aside className="w-64 bg-purple-700 text-white h-screen shadow-lg">
      <div className="p-4 text-xl font-bold border-b border-purple-600">
        PG Micro World Computers
      </div>
      <nav className="flex flex-col p-4 space-y-2">
        {links.map((link, index) => (
          <Link
            key={index}
            to={link.path}
            className="p-3 rounded-md hover:bg-purple-600 transition"
          >
            {link.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
