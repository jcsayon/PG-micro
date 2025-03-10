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
    },
    {
      title: "Purchase Order",
      description: "Manage all your purchase orders efficiently.",
      icon: "📋",
      link: "/purchase-orders",
    },
    {
      title: "Return-Warranty",
      description: "Handle returns and warranties with ease.",
      icon: "🔄",
      link: "/return-warranty",
    },
    {
      title: "Reports",
      description: "View monthly financial reports of income & expenses.",
      icon: "📊",
      link: "/reports",
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Welcome to PG Micro Dashboard
        </h1>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {systemCards.map((card, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg shadow-lg p-5 hover:shadow-xl transition-all cursor-pointer"
              onClick={() => navigate(card.link)}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-5xl">{card.icon}</span>
                <button className="text-purple-500 font-semibold hover:text-purple-700">
                  Open
                </button>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">
                {card.title}
              </h2>
              <p className="text-gray-600 mt-2">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
