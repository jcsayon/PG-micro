import React from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const systemCards = [
    { title: "Sales", description: "Track and manage sales.", icon: "📈", link: "/sales" },
    { title: "Purchase Order", description: "Manage purchase orders.", icon: "📋", link: "/purchase-orders" },
    { title: "Return-Warranty", description: "Handle returns & warranties.", icon: "🔄", link: "/return-warranty" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Home</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {systemCards.map((card, index) => (
          <button
            key={index}
            onClick={() => navigate(card.link)}
            className="border border-gray-300 rounded-lg shadow hover:shadow-lg transition-shadow p-4 bg-white w-full text-left"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-5xl">{card.icon}</span>
            </div>
            <h2 className="text-lg font-semibold text-gray-800">{card.title}</h2>
            <p className="text-gray-600 mt-2">{card.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
