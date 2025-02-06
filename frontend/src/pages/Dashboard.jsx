import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";

const Dashboard = () => {
  const navigate = useNavigate(); // Get the navigate function from the hook
  const systemCards = [
    {
      title: "Sales",
      description: "Track and manage all sales activities in one place.",
      icon: "📈", // Use actual icons or images
      link: "/sales", // Link to the Sales page
    },
    {
      title: "Purchase Order",
      description: "Manage all your purchase orders efficiently.",
      icon: "📋",
      link: "/purchase-orders", // Link to the Purchase Order page
    },
    {
      title: "Return-Warranty",
      description: "Handle returns and warranties with ease.",
      icon: "🔄",
      link: "/return-warranty", // Link to the Return Warranty page
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
                <button  
                onClick={() => navigate(card.link)} // Navigate to the card's linked route
                className="text-purple-500 hover:text-purple-700">Open</button>
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
