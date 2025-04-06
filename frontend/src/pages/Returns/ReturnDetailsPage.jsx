import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar_Secondary from "../../components/Sidebar_Secondary";

const ReturnDetailsPage = () => {
  const navigate = useNavigate();

  const returnData = {
    orderId: "12345",
    returnDate: "5/1/2023",
    name: "John Doe",
    email: "johndoe@gmail.com",
    billTo: "123 Main St, San Francisco, CA 94105",
    shipTo: "123 Main St, San Francisco, CA 94105",
    paymentMethod: "Cash",
    reason: "The Hinge is Broke when I close it opens",
  };

  const returnedItems = [
    {
      id: "TradeCode 98",
      description: "Quam aliquam odio ullamcorper ornare eleifend ipsum",
      brand: "Samsung",
      quantity: 12,
      price: "100,000",
    },
    {
      id: "TradeCode 95",
      description: "Sed at ornare scelerisque in facilisis tincidunt",
      brand: "Apple",
      quantity: 24,
      price: "456,456",
    },
    {
      id: "TradeCode 94",
      description: "Molestie est pharetra eu congue velit felis ipsum velit.",
      brand: "Epson",
      quantity: 123,
      price: "647,770",
    },
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      {/* <Sidebar_Secondary /> */}

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-6">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-4">
          Home / Form / <span className="text-gray-800 font-semibold">Basic Form</span>
        </div>

        {/* Return Details Section */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Request Return</h2>
          <h1 className="text-3xl font-bold text-purple-700">Return #{returnData.orderId}</h1>
          <p className="text-gray-500 mb-6">Summary</p>

          {/* Return Information */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-gray-700"><strong>Return Date:</strong> {returnData.returnDate}</p>
              <p className="text-gray-700"><strong>Name:</strong> {returnData.name}</p>
              <p className="text-gray-700"><strong>Email:</strong> {returnData.email}</p>
            </div>
            <div>
              <p className="text-gray-700"><strong>Status:</strong> -</p>
              <p className="text-gray-700"><strong>Reason:</strong> {returnData.reason}</p>
            </div>
          </div>

          {/* Address & Payment */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-gray-700"><strong>Bill To:</strong> {returnData.billTo}</p>
            </div>
            <div>
              <p className="text-gray-700"><strong>Ship To:</strong> {returnData.shipTo}</p>
              <p className="text-gray-700"><strong>Payment Method:</strong> {returnData.paymentMethod}</p>
            </div>
          </div>

          {/* Returned Items Table */}
          <h3 className="text-lg font-bold text-gray-800 mt-6">Returned Items</h3>
          <div className="overflow-x-auto mt-4">
            <table className="w-full border-collapse bg-white shadow-md rounded-lg">
              <thead>
                <tr className="bg-purple-200 text-left">
                  <th className="p-3">Product ID</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">Brand</th>
                  <th className="p-3">Quantity</th>
                  <th className="p-3">Price</th>
                </tr>
              </thead>
              <tbody>
                {returnedItems.map((item, index) => (
                  <tr key={index} className="border-t">
                    <td className="p-3 text-purple-500 hover:underline cursor-pointer">{item.id}</td>
                    <td className="p-3">{item.description}</td>
                    <td className="p-3">{item.brand}</td>
                    <td className="p-3">{item.quantity}</td>
                    <td className="p-3">{item.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-between">
            <button
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400"
              onClick={() => navigate("/return-warranty")}
            >
              Cancel
            </button>
            <button className="bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-700">
              Submit Return
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReturnDetailsPage;
