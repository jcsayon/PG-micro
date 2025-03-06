import React, { useState, useEffect } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";

// Placeholder data for demonstration
const dummyReports = Array.from({ length: 24 }, (_, i) => {
  const totalIncome = (Math.random() * 100000).toFixed(2);
  const totalExpenses = (Math.random() * 50000).toFixed(2);
  const netProfit = (totalIncome - totalExpenses).toFixed(2);
  const status = netProfit > 0 ? "Profitable" : "Loss";

  return {
    id: i + 1,
    dateGenerated: new Date(
      2024 + Math.floor(i / 12),
      i % 12,
      1
    ).toLocaleDateString(),
    totalIncome,
    totalExpenses,
    netProfit,
    status,
  };
});

const ReportModule = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    // Simulating data fetch
    setReports(dummyReports);

    // Uncomment the below code to fetch data from Supabase when ready
    /*
    import { createClient } from "@supabase/supabase-js";
    const supabase = createClient("YOUR_SUPABASE_URL", "YOUR_SUPABASE_ANON_KEY");

    const fetchReports = async () => {
      const { data, error } = await supabase.from("ReportModule").select("*");
      if (error) console.error("Error fetching reports:", error);
      else setReports(data);
    };

    fetchReports();
    */
  }, []);

  // Calculate Total Summary
  const totalIncome = reports
    .reduce((sum, report) => sum + parseFloat(report.totalIncome), 0)
    .toFixed(2);
  const totalExpenses = reports
    .reduce((sum, report) => sum + parseFloat(report.totalExpenses), 0)
    .toFixed(2);
  const totalNetProfit = (totalIncome - totalExpenses).toFixed(2);

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Monthly Reports
        </h1>

        {/* Summary Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-blue-100 p-6 rounded-lg shadow-md text-center">
            <h2 className="text-xl font-semibold text-blue-700">
              Total Income
            </h2>
            <p className="text-2xl font-bold text-blue-900">₱{totalIncome}</p>
          </div>
          <div className="bg-red-100 p-6 rounded-lg shadow-md text-center">
            <h2 className="text-xl font-semibold text-red-700">
              Total Expenses
            </h2>
            <p className="text-2xl font-bold text-red-900">₱{totalExpenses}</p>
          </div>
          <div
            className={`p-6 rounded-lg shadow-md text-center ${
              totalNetProfit > 0 ? "bg-green-100" : "bg-red-100"
            }`}
          >
            <h2
              className={`text-xl font-semibold ${
                totalNetProfit > 0 ? "text-green-700" : "text-red-700"
              }`}
            >
              Net Profit
            </h2>
            <p
              className={`text-2xl font-bold ${
                totalNetProfit > 0 ? "text-green-900" : "text-red-900"
              }`}
            >
              ₱{totalNetProfit}
            </p>
          </div>
        </div>

        {/* Reports Table */}
        <div className="bg-white shadow-lg rounded-lg p-4 overflow-hidden border border-gray-300">
          <div className="overflow-y-auto max-h-[60vh]">
            <table className="min-w-full border border-gray-300">
              {/* Fix the header to stay at the top */}
              <thead className="sticky top-0 bg-blue-300 text-gray-800 text-left text-sm font-medium shadow-md z-50 border-b-2 border-blue-500">
                <tr>
                  <th className="p-3 border border-blue-400">Report ID</th>
                  <th className="p-3 border border-blue-400">Date Generated</th>
                  <th className="p-3 border border-blue-400">Total Income</th>
                  <th className="p-3 border border-blue-400">Total Expenses</th>
                  <th className="p-3 border border-blue-400">Net Profit</th>
                  <th className="p-3 border border-blue-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report, index) => (
                  <tr
                    key={report.id}
                    className={`border-t text-sm text-gray-700 ${
                      index % 2 === 0 ? "bg-blue-50" : "bg-white"
                    }`}
                  >
                    <td className="p-3 border border-blue-200">{report.id}</td>
                    <td className="p-3 border border-blue-200">
                      {report.dateGenerated}
                    </td>
                    <td className="p-3 border border-blue-200">
                      ₱{report.totalIncome}
                    </td>
                    <td className="p-3 border border-blue-200">
                      ₱{report.totalExpenses}
                    </td>
                    <td className="p-3 border border-blue-200">
                      ₱{report.netProfit}
                    </td>
                    <td
                      className={`p-3 border border-blue-200 font-semibold ${
                        report.status === "Profitable"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {report.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReportModule;
