import React from "react";

const Header = () => {
  return (
    <header className="bg-white shadow h-16 flex items-center justify-between px-8">
      <h1 className="text-xl font-bold text-purple-600">PG Micro Dashboard</h1>
      <div className="flex items-center gap-4">
        <span className="text-gray-600">Joshua Sayon III</span>
        <img
          src="https://via.placeholder.com/40"
          alt="User Avatar"
          className="w-10 h-10 rounded-full border"
        />
      </div>
    </header>
  );
};

export default Header;
