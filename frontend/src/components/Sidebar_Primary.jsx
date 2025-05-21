import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {Home, User, Settings, Package, Users, DollarSign, ClipboardList, RotateCcw, BarChart3, Wallet, UserCircle, FileText, LogOut, Box
} from "lucide-react";

const Sidebar_Primary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const userRole = sessionStorage.getItem("userRole");
  
  // State to store current user's information
  const [userName, setUserName] = useState("");
  
  // Get current user info on component mount
  useEffect(() => {
    try {
      // Important: Use "userEmail" which is what LoginPage.jsx sets
      const userEmail = sessionStorage.getItem("userEmail");
      console.log("Found userEmail:", userEmail);
      
      if (userEmail) {
        // Try to get all users from localStorage to find the current user
        try {
          const usersStr = localStorage.getItem('users');
          if (usersStr) {
            const users = JSON.parse(usersStr);
            
            // Look for the matching user
            const currentUser = users.find(user => 
              user.username.toLowerCase() === userEmail.toLowerCase());
              
            if (currentUser && currentUser.employeeId) {
              // Try to get the employee record for this user
              const employeesStr = localStorage.getItem('employees');
              if (employeesStr) {
                const employees = JSON.parse(employeesStr);
                const employee = employees.find(emp => emp.id === currentUser.employeeId);
                
                if (employee) {
                  // Use the employee's first name
                  setUserName(employee.firstName);
                  return;
                }
              }
            }
          }
        } catch (e) {
          console.error("Error finding user data:", e);
        }
        
        // If we couldn't find a corresponding employee, just use the email
        const namePart = userEmail.split('@')[0];
        // Capitalize first letter for better display
        const displayName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
        setUserName(displayName);
      }
    } catch (error) {
      console.error("Error getting username:", error);
    }
  }, []);

  // Logout function
  const handleLogout = () => {
    // Clear all auth-related items from sessionStorage
    sessionStorage.removeItem("isAuthenticated");
    sessionStorage.removeItem("userRole");
    sessionStorage.removeItem("accessiblePages");
    sessionStorage.removeItem("userEmail"); // Clear this key which is set by LoginPage
    
    // Navigate to login page
    navigate("/");
  };

  // All menu items with Lucide icons
  const allMenuItems = [
    { name: "Home", path: "/dashboard", icon: Home, color: { default: "text-purple-100", hover: "hover:bg-purple-600", active: "bg-purple-500 text-white" } },
    // { name: "Account Info", path: "/account-info", icon: User, color: { default: "text-purple-100", hover: "hover:bg-purple-600", active: "bg-purple-500 text-white" } },
    // { name: "Settings", path: "/settings", icon: Settings, color: { default: "text-purple-100", hover: "hover:bg-purple-600", active: "bg-purple-500 text-white" } },
    { name: "Inventory", path: "/inventory", icon: Package, color: { default: "text-purple-100", hover: "hover:bg-purple-600", active: "bg-purple-500 text-white" } },
    { name: "User Management", path: "/user-management", icon: Users, adminOnly: true, color: { default: "text-purple-100", hover: "hover:bg-purple-600", active: "bg-purple-500 text-white" } },
    { name: "Sales", path: "/sales", icon: DollarSign, color: { default: "text-purple-100", hover: "hover:bg-purple-600", active: "bg-purple-500 text-white" } },
    { name: "Purchase Orders", path: "/purchase-orders", icon: ClipboardList, color: { default: "text-purple-100", hover: "hover:bg-purple-600", active: "bg-purple-500 text-white" } },

    { name: "Product List", path: "/product-list", icon: Box, isSubItem: true, parentName: "Purchase Orders", color: { default: "text-purple-100", hover: "hover:bg-purple-600", active: "bg-purple-500 text-white" } },
    { name: "Supplier PO", path: "/supplier-po", icon: UserCircle, isSubItem: true, parentName: "Purchase Orders", color: { default: "text-purple-100", hover: "hover:bg-purple-600", active: "bg-purple-500 text-white" } },

    { name: "Returns", path: "/return-warranty", icon: RotateCcw, color: { default: "text-purple-100", hover: "hover:bg-purple-600", active: "bg-purple-500 text-white" } },
    { name: "Reports", path: "/reports", icon: BarChart3, color: { default: "text-purple-100", hover: "hover:bg-purple-600", active: "bg-purple-500 text-white" } },
    { name: "Income List", path: "/income-list", icon: Wallet, isSubItem: true, parentName: "Sales", color: { default: "text-purple-100", hover: "hover:bg-purple-600", active: "bg-purple-500 text-white" } },
    { name: "Customer Sales", path: "/customer-sales", icon: UserCircle, isSubItem: true, parentName: "Sales", color: { default: "text-purple-100", hover: "hover:bg-purple-600", active: "bg-purple-500 text-white" } },
    { name: "Warranty List", path: "/warranties", icon: FileText, isSubItem: true, parentName: "Returns", color: { default: "text-purple-100", hover: "hover:bg-purple-600", active: "bg-purple-500 text-white" } },
    { name: "Customer Returns", path: "/customer-returns", icon: UserCircle, isSubItem: true, parentName: "Returns", color: { default: "text-purple-100", hover: "hover:bg-purple-600", active: "bg-purple-500 text-white" } }
  ];

  // Allowed items by route group
  const groupAPaths = ["/dashboard", "/account-info", "/settings", "/user-management"];
  const groupBPaths = ["/purchase-orders", "/sales", "/return-warranty", "/reports", "/income-list", "/customer-sales", "/warranties", "/customer-returns", "/product-list", "/supplier-po"];
  const groupCPaths = ["/inventory"];

  const groupAAllowed = ["Home", "Account Info", "Settings", "Inventory", "User Management"];
  const groupBAllowed = ["Home", "Purchase Orders", "Sales", "Returns", "Inventory", "Reports", "Income List", "Customer Sales", "Warranty List", "Customer Returns", "Product List", "Supplier PO"];
  const groupCAllowed = groupBAllowed;

  // Filter by group
  let visibleMenuItems = allMenuItems;
  if (groupAPaths.includes(currentPath)) {
    visibleMenuItems = allMenuItems.filter(item => groupAAllowed.includes(item.name));
  } else if (groupBPaths.includes(currentPath)) {
    visibleMenuItems = allMenuItems.filter(item => groupBAllowed.includes(item.name));
  } else if (groupCPaths.includes(currentPath)) {
    visibleMenuItems = allMenuItems.filter(item => groupCAllowed.includes(item.name));
  }

  // Filter out admin-only if not Admin
  visibleMenuItems = visibleMenuItems.filter(item => !(item.adminOnly && userRole !== "Admin"));

  // Organize menu items by parent
  const organizedMenuItems = visibleMenuItems.reduce((acc, item) => {
    if (item.isSubItem && item.parentName) {
      if (!acc.subItems[item.parentName]) {
        acc.subItems[item.parentName] = [];
      }
      acc.subItems[item.parentName].push(item);
    } else {
      acc.mainItems.push(item);
    }
    return acc;
  }, { mainItems: [], subItems: {} });

  return (
    <div className="h-screen w-64 bg-purple-700 text-white fixed top-0 left-0 flex flex-col">
      <div className="p-2 text-center font-bold text-2xl bg-purple-800">
        PG Micro World
      </div>
      
      {/* User Welcome Section - Enhanced Design */}
      <div className="relative px-4 py-4 bg-gradient-to-r from-purple-700 to-purple-600 border-b border-purple-900">
        {/* Decorative accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500"></div>
        
        <div className="flex items-center space-x-3">
          {/* User avatar circle */}
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-500 flex items-center justify-center border-2 border-purple-300 shadow-md">
            <span className="text-lg font-bold text-white">
              {userName ? userName.charAt(0).toUpperCase() : "U"}
            </span>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-purple-200">Welcome</div>
            <div className="text-white font-semibold text-lg truncate">{userName || "User"}</div>
            <div className="text-xs text-purple-200 opacity-80">{userRole || "Guest"}</div>
          </div>
        </div>
      </div>

      <nav className="flex-1">
        {organizedMenuItems.mainItems.map((item, index) => {
          const isActive = currentPath === item.path;
          const hasSubItems = organizedMenuItems.subItems[item.name]?.length > 0;
          const baseClass = isActive
            ? item.color.active
            : `${item.color.default} ${item.color.hover}`;
          
          const Icon = item.icon;
          
          return (
            <div key={index}>
              <NavLink
                to={item.path}
                className={`flex items-center gap-3 px-5 py-1 text-lg transition-all ${baseClass}`}
              >
                <Icon className="w-5 h-5" />
                {item.name}
                {hasSubItems && <span className="ml-auto">▼</span>}
              </NavLink>
              
              {hasSubItems && (
                <div className="ml-5 border-l-2 border-purple-600 pl-2">
                  {organizedMenuItems.subItems[item.name].map((subItem, subIndex) => {
                    const isSubActive = currentPath === subItem.path;
                    const subBaseClass = isSubActive
                      ? subItem.color.active
                      : `${subItem.color.default} ${subItem.color.hover}`;
                    
                    const SubIcon = subItem.icon;
                      
                    return (
                      <NavLink
                        key={`${index}-${subIndex}`}
                        to={subItem.path}
                        className={`flex items-center gap-3 px-5 py-1 text-md transition-all ${subBaseClass} pl-4`}
                      >
                        <SubIcon className="w-4 h-4" />
                        {subItem.name}
                      </NavLink>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="mt-auto">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-5 py-1 text-lg w-full text-left hover:bg-purple-600 transition-all text-purple-100"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>

      <div className="p-4 text-center text-sm bg-purple-800">
        © 2025 PG Micro World
      </div>
    </div>
  );
};

export default Sidebar_Primary;