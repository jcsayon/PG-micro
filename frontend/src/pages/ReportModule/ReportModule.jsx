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
  const [activeReport, setActiveReport] = useState(null);
  const [timeRange, setTimeRange] = useState("monthly");
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());

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

  // Filter reports based on current time range
  const filteredReports = reports.filter(report => {
    const reportDate = new Date(report.dateGenerated);
    if (timeRange === "monthly") {
      return reportDate.getMonth() === currentMonth && 
             reportDate.getFullYear() === currentYear;
    } else if (timeRange === "quarterly") {
      const quarter = Math.floor(currentMonth / 3);
      const reportQuarter = Math.floor(reportDate.getMonth() / 3);
      return reportQuarter === quarter && 
             reportDate.getFullYear() === currentYear;
    } else if (timeRange === "yearly") {
      return reportDate.getFullYear() === currentYear;
    }
    return true;
  });

  // Available months and years for selection
  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];
  
  const years = Array.from(
    { length: 5 }, 
    (_, i) => new Date().getFullYear() - 2 + i
  );

  // Generate quarters for dropdown
  const quarters = ["Q1 (Jan-Mar)", "Q2 (Apr-Jun)", "Q3 (Jul-Sep)", "Q4 (Oct-Dec)"];
  const currentQuarter = Math.floor(currentMonth / 3);

  // Format currency with peso sign
  const formatCurrency = (value) => {
    return `₱${parseFloat(value).toLocaleString('en-PH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  // Handle time navigation
  const navigateTime = (direction) => {
    if (timeRange === "monthly") {
      if (direction === "prev") {
        if (currentMonth === 0) {
          setCurrentMonth(11);
          setCurrentYear(currentYear - 1);
        } else {
          setCurrentMonth(currentMonth - 1);
        }
      } else {
        if (currentMonth === 11) {
          setCurrentMonth(0);
          setCurrentYear(currentYear + 1);
        } else {
          setCurrentMonth(currentMonth + 1);
        }
      }
    } else if (timeRange === "quarterly") {
      const newQuarter = direction === "prev" ? currentQuarter - 1 : currentQuarter + 1;
      if (newQuarter < 0) {
        setCurrentYear(currentYear - 1);
        setCurrentMonth(9); // Q4 of previous year
      } else if (newQuarter > 3) {
        setCurrentYear(currentYear + 1);
        setCurrentMonth(0); // Q1 of next year
      } else {
        setCurrentMonth(newQuarter * 3); // First month of quarter
      }
    } else if (timeRange === "yearly") {
      setCurrentYear(direction === "prev" ? currentYear - 1 : currentYear + 1);
    }
  };

  // Calculate summaries for filtered reports
  const filteredIncome = filteredReports
    .reduce((sum, report) => sum + parseFloat(report.totalIncome), 0)
    .toFixed(2);
  const filteredExpenses = filteredReports
    .reduce((sum, report) => sum + parseFloat(report.totalExpenses), 0)
    .toFixed(2);
  const filteredProfit = filteredReports
    .reduce((sum, report) => sum + parseFloat(report.netProfit), 0)
    .toFixed(2);

  return (
    <DashboardLayout>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <header className="bg-white shadow rounded-lg p-6 mb-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-800">Financial Reports</h1>
            </div>
          </header>

          {/* Time Range Controls */}
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex space-x-4">
                  <select 
                    className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                  >
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </select>

                  {timeRange === "monthly" && (
                    <>
                      <select 
                        className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        value={currentMonth}
                        onChange={(e) => setCurrentMonth(parseInt(e.target.value))}
                      >
                        {months.map((month, index) => (
                          <option key={month} value={index}>{month}</option>
                        ))}
                      </select>
                      <select 
                        className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        value={currentYear}
                        onChange={(e) => setCurrentYear(parseInt(e.target.value))}
                      >
                        {years.map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </>
                  )}

                  {timeRange === "quarterly" && (
                    <>
                      <select 
                        className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        value={currentQuarter}
                        onChange={(e) => setCurrentMonth(parseInt(e.target.value) * 3)}
                      >
                        {quarters.map((quarter, index) => (
                          <option key={quarter} value={index}>{quarter}</option>
                        ))}
                      </select>
                      <select 
                        className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        value={currentYear}
                        onChange={(e) => setCurrentYear(parseInt(e.target.value))}
                      >
                        {years.map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </>
                  )}

                  {timeRange === "yearly" && (
                    <select 
                      className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      value={currentYear}
                      onChange={(e) => setCurrentYear(parseInt(e.target.value))}
                    >
                      {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="flex space-x-2">
                  <button 
                    className="p-2 rounded-md border border-gray-300 hover:bg-gray-50"
                    onClick={() => navigateTime("prev")}
                  >
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button 
                    className="p-2 rounded-md border border-gray-300 hover:bg-gray-50"
                    onClick={() => navigateTime("next")}
                  >
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-100">
                <h3 className="text-sm font-medium text-blue-500 uppercase tracking-wide">Income</h3>
                <p className="mt-2 text-3xl font-extrabold text-gray-900">{formatCurrency(filteredIncome)}</p>
                <div className="mt-1 text-sm text-gray-500">
                  <span className="text-green-700 font-medium">+2.5%</span> from previous period
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-lg border border-red-100">
                <h3 className="text-sm font-medium text-red-500 uppercase tracking-wide">Expenses</h3>
                <p className="mt-2 text-3xl font-extrabold text-gray-900">{formatCurrency(filteredExpenses)}</p>
                <div className="mt-1 text-sm text-gray-500">
                  <span className="text-red-700 font-medium">+0.7%</span> from previous period
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-100">
                <h3 className="text-sm font-medium text-green-500 uppercase tracking-wide">Net Profit</h3>
                <p className="mt-2 text-3xl font-extrabold text-gray-900">{formatCurrency(filteredProfit)}</p>
                <div className="mt-1 text-sm text-gray-500">
                  <span className="text-green-700 font-medium">+4.1%</span> from previous period
                </div>
              </div>
            </div>
          </div>

          {/* Reports Table */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Report Details</h2>
              <p className="text-sm text-gray-500 mt-1">
                {timeRange === "monthly" ? `${months[currentMonth]} ${currentYear}` : 
                 timeRange === "quarterly" ? `${quarters[currentQuarter]} ${currentYear}` : 
                 `Year ${currentYear}`} Financial Summary
              </p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Report ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date Generated
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Income
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Expenses
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Net Profit
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredReports.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-10 text-center text-sm text-gray-500">
                        No reports found for this period
                      </td>
                    </tr>
                  ) : (
                    filteredReports.map((report) => (
                      <tr 
                        key={report.id} 
                        className={activeReport === report.id ? "bg-indigo-50" : "hover:bg-gray-50"}
                        onClick={() => setActiveReport(activeReport === report.id ? null : report.id)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {report.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {report.dateGenerated}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(report.totalIncome)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(report.totalExpenses)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <span className={parseFloat(report.netProfit) >= 0 ? "text-green-600" : "text-red-600"}>
                            {formatCurrency(report.netProfit)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            report.status === "Profitable" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-red-100 text-red-800"
                          }`}>
                            {report.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredReports.length}</span> of{' '}
                    <span className="font-medium">{filteredReports.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                      <span className="sr-only">Previous</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                      1
                    </button>
                    <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                      <span className="sr-only">Next</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReportModule;