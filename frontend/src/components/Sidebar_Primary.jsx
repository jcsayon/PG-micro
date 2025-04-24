import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";

const Sidebar_Primary = ({ isCollapsed: propCollapsed, toggleCollapse: propToggleCollapse }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const userRole = sessionStorage.getItem("userRole");

  const [internalCollapsed, setInternalCollapsed] = useState(
    localStorage.getItem("sidebarCollapsed") === "true"
  );
  const isCollapsed = propCollapsed !== undefined ? propCollapsed : internalCollapsed;

  useEffect(() => {
    if (propCollapsed === undefined) {
      localStorage.setItem("sidebarCollapsed", internalCollapsed);
    }
  }, [internalCollapsed, propCollapsed]);

  const toggleSidebar = () => {
    if (propToggleCollapse) {
      propToggleCollapse();
    } else {
      setInternalCollapsed(!internalCollapsed);
    }
  };

  // All menu items
  const allMenuItems = [
    {
      name: "Home",
      path: "/dashboard",
      icon: "🏠",
      color: {
        default: "text-purple-100",
        hover: "hover:bg-purple-600",
        active: "bg-purple-500 text-white",
      },
    },
    {
      name: "Account Info",
      path: "/account-info",
      icon: "👤",
      color: {
        default: "text-purple-100",
        hover: "hover:bg-purple-600",
        active: "bg-purple-500 text-white",
      },
    },
    {
      name: "Settings",
      path: "/settings",
      icon: "⚙️",
      color: {
        default: "text-purple-100",
        hover: "hover:bg-purple-600",
        active: "bg-purple-500 text-white",
      },
    },
    {
      name: "Inventory",
      path: "/inventory",
      icon: "📦",
      color: {
        default: "text-purple-100",
        hover: "hover:bg-purple-600",
        active: "bg-purple-500 text-white",
      },
    },
    {
      name: "User Management",
      path: "/user-management",
      icon: "🧑‍💼",
      adminOnly: true,
      color: {
        default: "text-purple-100",
        hover: "hover:bg-purple-600",
        active: "bg-purple-500 text-white",
      },
    },
    {
      name: "Sales",
      path: "/sales",
      icon: "💵",
      color: {
        default: "text-purple-100",
        hover: "hover:bg-purple-600",
        active: "bg-purple-500 text-white",
      },
    },
    {
      name: "Purchase Orders",
      path: "/purchase-orders",
      icon: "📋",
      color: {
        default: "text-purple-100",
        hover: "hover:bg-purple-600",
        active: "bg-purple-500 text-white",
      },
    },
    {
      name: "Returns",
      path: "/return-warranty",
      icon: "🔄",
      color: {
        default: "text-purple-100",
        hover: "hover:bg-purple-600",
        active: "bg-purple-500 text-white",
      },
    },
    {
      name: "Reports",
      path: "/reports",
      icon: "📊",
      color: {
        default: "text-purple-100",
        hover: "hover:bg-purple-600",
        active: "bg-purple-500 text-white",
      },
    },
    {
      name: "Income List",
      path: "/income-list",
      icon: "💰",
      isSubItem: true,
      parentName: "Sales", // Change from "Reports" to "Sales"
      color: {
        default: "text-purple-100",
        hover: "hover:bg-purple-600",
        active: "bg-purple-500 text-white",
      },
    },
    {
      name: "Customer List",
      path: "/customer-list",
      icon: "👥",
      isSubItem: true,
      parentName: "Sales", // Change from "Reports" to "Sales"
      color: {
        default: "text-purple-100",
        hover: "hover:bg-purple-600",
        active: "bg-purple-500 text-white",
      },
    }
  ];

  // Allowed items by route group
  const groupAPaths = ["/dashboard", "/account-info", "/settings", "/user-management"];
  const groupBPaths = ["/purchase-orders", "/sales", "/return-warranty", "/reports", "/income-list", "/customer-list"];
  const groupCPaths = ["/inventory"];

  const groupAAllowed = ["Home", "Account Info", "Settings", "Inventory", "User Management"];
  const groupBAllowed = ["Home", "Purchase Orders", "Sales", "Returns", "Inventory", "Reports", "Income List", "Customer List"];
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
    <div className={`h-screen ${isCollapsed ? "w-16" : "w-64"} bg-purple-700 text-white fixed top-0 left-0 flex flex-col transition-all duration-300`}>
      <div className="p-4 text-center font-bold text-2xl bg-purple-800">
        {!isCollapsed && "PG Micro World"}
      </div>

      <nav className="flex-1 mt-6">
        {organizedMenuItems.mainItems.map((item, index) => {
          const isActive = currentPath === item.path;
          const hasSubItems = organizedMenuItems.subItems[item.name]?.length > 0;
          const baseClass = isActive
            ? item.color.active
            : `${item.color.default} ${item.color.hover}`;
          
          return (
            <div key={index}>
              <NavLink
                to={item.path}
                className={`flex items-center gap-3 px-5 py-3 text-lg transition-all ${baseClass}`}
              >
                <span>{item.icon}</span>
                {!isCollapsed && item.name}
                {!isCollapsed && hasSubItems && <span className="ml-auto">▼</span>}
              </NavLink>
              
              {hasSubItems && !isCollapsed && (
                <div className="ml-5 border-l-2 border-purple-600 pl-2">
                  {organizedMenuItems.subItems[item.name].map((subItem, subIndex) => {
                    const isSubActive = currentPath === subItem.path;
                    const subBaseClass = isSubActive
                      ? subItem.color.active
                      : `${subItem.color.default} ${subItem.color.hover}`;
                      
                    return (
                      <NavLink
                        key={`${index}-${subIndex}`}
                        to={subItem.path}
                        className={`flex items-center gap-3 px-5 py-2 text-md transition-all ${subBaseClass} pl-4`}
                      >
                        <span>{subItem.icon}</span>
                        {!isCollapsed && subItem.name}
                      </NavLink>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <button
        className="absolute bottom-20 right-0 bg-purple-100 border-2 border-purple-300 border-r-purple-700 text-black w-8 h-8 flex items-center justify-center hover:bg-blue-500 rounded-l z-50"
        onClick={toggleSidebar}
      >
        {isCollapsed ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        )}
      </button>

      <div className="p-4 text-center text-sm bg-purple-800">
        {!isCollapsed && "© 2025 PG Micro World"}
      </div>
    </div>
  );
};

export default Sidebar_Primary;