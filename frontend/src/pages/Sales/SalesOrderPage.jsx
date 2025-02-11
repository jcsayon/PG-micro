import React from "react";
import SalesDashboardLayout from "../../layouts/SalesDashboardLayout";

const SalesOrderPage = () => {
  return (
    <SalesDashboardLayout>
      <div className="p-6 flex-1">
        <h1 className="text-2xl font-semibold">Customer Form</h1>
        <p className="text-gray-600">
          Advanced forms are commonly seen in scenarios where large quantities
          of data are entered and submitted at once.
        </p>

        <div className="bg-white shadow-md rounded-lg p-6 mt-4">
          <h2 className="text-lg font-semibold">Customer Form</h2>

          <form className="grid grid-cols-3 gap-4 mt-4">
            <div className="col-span-1">
              <label className="block text-sm font-medium">Customer Name</label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full border rounded-lg p-2"
              />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium">
                Customer Address
              </label>
              <input
                type="text"
                placeholder="text@email.com"
                className="w-full border rounded-lg p-2"
              />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium">Customer Type</label>
              <select className="w-full border rounded-lg p-2">
                <option>Walk-in</option>
                <option>Registered</option>
              </select>
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium">
                Customer Phone
              </label>
              <input
                type="text"
                placeholder="+63"
                className="w-full border rounded-lg p-2"
              />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium">
                Customer Email
              </label>
              <input
                type="text"
                placeholder="example"
                className="w-full border rounded-lg p-2"
              />
            </div>
          </form>

          <div className="mt-6 flex justify-end">
            <button className="bg-purple-600 text-white px-6 py-2 rounded-lg">
              Submit
            </button>
          </div>
        </div>
      </div>
    </SalesDashboardLayout>
  );
};

export default SalesOrderPage;
