import { info } from "autoprefixer";
import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
    const links = [
        { name: "Home", path: '/dashboard' },
        { name: 'About info', paths: '/account-info'},
        { name: 'Manage Account', paths: '/manage-account'},
        { name: 'Expense center ', paths: '/expense-center'},
    ];
    return (
        <aside className="w-64 bg-purple-700 text-white h-screen">
            <div className="p-4 text-xl font-bold border-b border-purple-600">
                PG Micro Wolrd Computers
            </div>
            <nav className="flex flex-col p-4 space-y-2">
                {links.map((link, index) => (
                    <Link 
                        key={index} 
                        to={link.path} 
                        className="p-2 hover:bg-purple-600"
                        > 
                        {link.name}
                    </Link>
                
                ))}
            </nav>
        </aside>
    );
}
export default Sidebar;