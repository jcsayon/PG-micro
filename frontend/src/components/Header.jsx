import React from "react";

const Header = () => {
  return (
    <header className="bg-white p-4 flex justify-between items-center">
      {/* Search Bar */}
      <div className="flex items-center">
        <input type="text" placeholder="Search" className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus: ring-purple-500" />
      </div>
      {/* User Profile */}
      <div className="flex items-center space-x-4">
        <span className="text-gray-700">John Doe</span>
        <img 
          src="https://via.placeholder.com/40"
          alt="User Avatar"
          className="h-10 w-10 rounded-full"
          />
      </div>
    </header>
  );
};
export default Header;
