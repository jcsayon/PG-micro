import React from "react";

const Header = () => {
    return (
        <header className="flex items-center justify-between p-4 bg-purple-600 text-white">
        <h1 className="text-xl font-bold">PG Micro World Computers</h1>
        <div className="flex items-enter space-x-4">
        <input type="text" placeholder="Seach..." className="p-2 rounded bg purple-500 text-white placeholder-white focus:outline-none" />
            <button className="p-2 bg-purple-500 rounded hover:bg-purple-700">
                Search
            </button>
        </div>
        </header>
    );
    };
    export default Header;