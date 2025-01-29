import React from "react";
import DashboardLayout from "../layouts/DashboardLayout";

const Dashboard = () => {
  const systemCards = [
    {
      title: "Sales",
      description: "Track and manage all sales activities in one place.",
      icon: "📈", // Use actual icons or images
    },
    {
      title: "Purchase Order",
      description: "Manage all your purchase orders efficiently.",
      icon: "📋",
    },
    {
      title: "Return-Warranty",
      description: "Handle returns and warranties with ease.",
      icon: "🔄",
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Home</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {systemCards.map((card, index) => (
            <div
              key={index}
              className="border border-gray-300 rounded-lg shadow hover:shadow-lg transition-shadow p-4 bg-white"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-5xl">{card.icon}</span>
                <button className="text-purple-500 hover:text-purple-700">Open</button>
              </div>
              <h2 className="text-lg font-semibold text-gray-800">{card.title}</h2>
              <p className="text-gray-600 mt-2">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
