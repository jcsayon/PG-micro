import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {Home,User,Settings,Package,Users,DollarSign,ClipboardList,RotateCcw,BarChart3,Wallet,UserCircle} from "lucide-react";

const Sidebar_Primary = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const userRole = sessionStorage.getItem("userRole");

  // All menu items with Lucide icons
  const allMenuItems = [
    {
      name: "Home",
      path: "/dashboard",
      icon: Home,
      color: {
        default: "text-purple-100",
        hover: "hover:bg-purple-600",
        active: "bg-purple-500 text-white",
      },
    },
    {
      name: "Account Info",
      path: "/account-info",
      icon: User,
      color: {
        default: "text-purple-100",
        hover: "hover:bg-purple-600",
        active: "bg-purple-500 text-white",
      },
    },
    {
      name: "Settings",
      path: "/settings",
      icon: Settings,
      color: {
        default: "text-purple-100",
        hover: "hover:bg-purple-600",
        active: "bg-purple-500 text-white",
      },
    },
    {
      name: "Inventory",
      path: "/inventory",
      icon: Package,
      color: {
        default: "text-purple-100",
        hover: "hover:bg-purple-600",
        active: "bg-purple-500 text-white",
      },
    },
    {
      name: "User Management",
      path: "/user-management",
      icon: Users,
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
      icon: DollarSign,
      color: {
        default: "text-purple-100",
        hover: "hover:bg-purple-600",
        active: "bg-purple-500 text-white",
      },
    },
    {
      name: "Purchase Orders",
      path: "/purchase-orders",
      icon: ClipboardList,
      color: {
        default: "text-purple-100",
        hover: "hover:bg-purple-600",
        active: "bg-purple-500 text-white",
      },
    },
    {
      name: "Returns",
      path: "/return-warranty",
      icon: RotateCcw,
      color: {
        default: "text-purple-100",
        hover: "hover:bg-purple-600",
        active: "bg-purple-500 text-white",
      },
    },
    {
      name: "Reports",
      path: "/reports",
      icon: BarChart3,
      color: {
        default: "text-purple-100",
        hover: "hover:bg-purple-600",
        active: "bg-purple-500 text-white",
      },
    },
    {
      name: "Income List",
      path: "/income-list",
      icon: Wallet,
      isSubItem: true,
      parentName: "Sales",
      color: {
        default: "text-purple-100",
        hover: "hover:bg-purple-600",
        active: "bg-purple-500 text-white",
      },
    },
    {
      name: "Customer List",
      path: "/customer-list",
      icon: UserCircle,
      isSubItem: true,
      parentName: "Sales",
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
    <div className="h-screen w-64 bg-purple-700 text-white fixed top-0 left-0 flex flex-col">
      <div className="p-4 text-center font-bold text-2xl bg-purple-800">
        PG Micro World
      </div>

      <nav className="flex-1 mt-6">
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
                className={`flex items-center gap-3 px-5 py-3 text-lg transition-all ${baseClass}`}
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
                        className={`flex items-center gap-3 px-5 py-2 text-md transition-all ${subBaseClass} pl-4`}
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

      <div className="p-4 text-center text-sm bg-purple-800">
        © 2025 PG Micro World
      </div>
    </div>
  );
};

export default Sidebar_Primary;