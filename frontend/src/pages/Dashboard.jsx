import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";

const Dashboard = () => {
  const navigate = useNavigate();

  const systemCards = [
    {
      title: "Sales",
      description: "Track and manage all sales activities in one place.",
      icon: "📈",
      link: "/sales",
      bg: "bg-gradient-to-r from-red-300 to-red-100",
      text: "text-red-700",
      button: "text-red-600 hover:text-red-800",
    },
    {
      title: "Purchase Order",
      description: "Manage all your purchase orders efficiently.",
      icon: "📋",
      link: "/purchase-orders",
      bg: "bg-gradient-to-r from-yellow-300 to-yellow-100",
      text: "text-yellow-700",
      button: "text-yellow-600 hover:text-yellow-800",
    },
    {
      title: "Return-Warranty",
      description: "Handle returns and warranties with ease.",
      icon: "🔄",
      link: "/return-warranty",
      bg: "bg-gradient-to-r from-blue-300 to-blue-100",
      text: "text-blue-700",
      button: "text-blue-600 hover:text-blue-800",
    },
    {
      title: "Reports",
      description: "View monthly financial reports of income & expenses.",
      icon: "📊",
      link: "/reports",
      bg: "bg-gradient-to-r from-green-300 to-green-100",
      text: "text-green-700",
      button: "text-green-600 hover:text-green-800",
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 bg-gradient-to-r from-purple-500 to-purple-200 min-h-screen">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {systemCards.map((card, index) => (
            <div
              key={index}
              onClick={() => navigate(card.link)}
              className={`rounded-lg border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer ${card.bg}`}
            >
              <div className="p-5 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-5xl">{card.icon}</span>
                  <button className={`${card.button} font-semibold`}>
                    Open
                  </button>
                </div>
                <h2 className={`text-xl font-semibold ${card.text}`}>
                  {card.title}
                </h2>
                <p className="text-gray-700 mt-2">{card.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;