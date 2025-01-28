import React from "react";

const Header = () => {
  return (
    <header className="flex items-center justify-between p-4 bg-purple-600 text-white shadow-md">
      <h1 className="text-lg font-bold">PG Micro World Computers</h1>
      <div className="flex items-center space-x-4">
        <input
          type="text"
          placeholder="Search..."
          className="p-2 rounded bg-purple-500 text-white placeholder-white focus:outline-none"
        />
        <button className="p-2 bg-purple-500 rounded hover:bg-purple-700">
          Search
        </button>
        <div className="flex items-center space-x-2">
          <span className="text-sm">Joshua Sayon III</span>
          <img
            src="https://via.placeholder.com/40"
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
