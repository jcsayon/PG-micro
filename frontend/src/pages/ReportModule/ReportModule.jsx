import React, { useState, useEffect } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { ChevronLeft, ChevronRight, X, Search, FileText } from "lucide-react";

// API endpoints and utility functions (commented out until backend is ready)
/*
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
const ENDPOINTS = {
  INCOME: `${API_BASE_URL}/income/`,
  REPORTS: `${API_BASE_URL}/reports/`,
  EXPENSES: `${API_BASE_URL}/expenses/`,
};

// API utility functions
const fetchReportData = async (year, month) => {
  try {
    const response = await fetch(`${ENDPOINTS.REPORTS}?year=${year}&month=${month+1}`);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching report data:", error);
    return null;
  }
};

const fetchIncomeData = async (year, month) => {
  try {
    const response = await fetch(`${ENDPOINTS.INCOME}?year=${year}&month=${month+1}`);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching income data:", error);
    return null;
  }
};

const fetchExpenseData = async (year, month) => {
  try {
    const response = await fetch(`${ENDPOINTS.EXPENSES}?year=${year}&month=${month+1}`);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching expense data:", error);
    return null;
  }
};
*/

const ReportModule = () => {
  // State for reports and filtered data
  const [reports, setReports] = useState([]);
  const [incomeRecords, setIncomeRecords] = useState([]);
  const [activeReport, setActiveReport] = useState(null);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [showIncomeBreakdown, setShowIncomeBreakdown] = useState(false);
  const [selectedMonthIncome, setSelectedMonthIncome] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(Date.now());

  // Set up polling for real-time updates
  useEffect(() => {
    // Set up a polling interval to check for new data every 5 seconds
    const pollingInterval = setInterval(() => {
      // Only reload if we're not already loading
      if (!isLoading) {
        loadData();
      }
    }, 5000); // 5 seconds

    // Clean up interval on component unmount
    return () => clearInterval(pollingInterval);
  }, [isLoading]);

  // Add storage event listener for real-time updates
  useEffect(() => {
    // Function to handle storage changes
    const handleStorageChange = (event) => {
      // Check if the changed key is one of our income keys
      const possibleKeys = ["pgMicroWorldIncome", "incomeData", "incomeRecords"];
      if (possibleKeys.includes(event.key)) {
        console.log("Income data changed in localStorage, refreshing...");
        loadData();
      }
    };

    // Add event listener
    window.addEventListener('storage', handleStorageChange);

    // Remove event listener on cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Load data on component mount and whenever month/year changes
  useEffect(() => {
    // Clear existing data
    setReports([]);
    setIncomeRecords([]);
    
    // Load fresh data
    loadData();
  }, [currentMonth, currentYear]);

  // Load data from API or localStorage
  const loadData = async () => {
    setIsLoading(true);
    
    try {
      /*
      // When API is ready, uncomment this section
      // Try to fetch reports directly from API
      const reportResponse = await fetchReportData(currentYear, currentMonth);
      
      if (reportResponse) {
        console.log(`Loaded ${reportResponse.length} reports from API`);
        setReports(reportResponse);
        setLastSyncTime(Date.now());
        setIsLoading(false);
        return;
      }
      
      // If reports API fails, try to get income data
      console.warn("Reports API failed, attempting to build reports from income data");
      const incomeResponse = await fetchIncomeData(currentYear, currentMonth);
      
      if (incomeResponse) {
        console.log(`Loaded ${incomeResponse.length} income records from API`);
        setIncomeRecords(incomeResponse);
        
        // Generate reports based on income data
        generateMonthlyReports(incomeResponse);
        setLastSyncTime(Date.now());
        setIsLoading(false);
        return;
      }
      
      // If API calls fail, fall back to localStorage
      console.warn("API calls failed, loading from localStorage");
      */
      
      // For now, continue using localStorage
      const incomeData = loadIncomeFromLocalStorage();
      
      // Generate monthly reports based on income data
      if (incomeData && incomeData.length > 0) {
        generateMonthlyReports(incomeData);
      } else {
        setReports([]);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLastSyncTime(Date.now());
      setIsLoading(false);
    }
  };

  // Load income data from localStorage
  const loadIncomeFromLocalStorage = () => {
    // Try all possible storage keys that might be used by IncomeList
    const possibleKeys = ["pgMicroWorldIncome", "incomeData", "incomeRecords"];
    let incomeData = null;
    
    // Try each key to find the data
    for (const key of possibleKeys) {
      const savedData = localStorage.getItem(key);
      if (savedData) {
        console.log(`Found data using key: ${key}`);
        try {
          const parsed = JSON.parse(savedData);
          if (Array.isArray(parsed) && parsed.length > 0) {
            console.log(`Successfully loaded ${parsed.length} records from key: ${key}`);
            incomeData = parsed;
            break;
          }
        } catch (error) {
          console.error(`Error parsing data from key ${key}:`, error);
        }
      }
    }
    
    if (incomeData) {
      setIncomeRecords(incomeData);
      return incomeData;
    } else {
      console.warn("No income data found in any known localStorage key");
      setIncomeRecords([]);
      return [];
    }
  };

  // Generate monthly reports from income data
  const generateMonthlyReports = (incomeData) => {
    // Group income by month and year
    const monthlyData = {};
    
    console.log("Processing income data for reports:", incomeData);
    
    // Check if we have valid income data
    if (!incomeData || incomeData.length === 0) {
      console.warn("No income data to process");
      return;
    }
    
    // Debug: Print the first record to inspect its structure
    console.log("First income record structure:", incomeData[0]);
    
    incomeData.forEach(income => {
      // Handle different date formats - ensure we have a proper Date object
      let date;
      let dateString = "";
      
      if (income.dateReceived) {
        // Try to parse MM/DD/YYYY format first
        if (typeof income.dateReceived === 'string' && income.dateReceived.includes('/')) {
          const parts = income.dateReceived.split('/');
          if (parts.length === 3) {
            // American format: MM/DD/YYYY
            const month = parseInt(parts[0]) - 1;
            const day = parseInt(parts[1]);
            const year = parseInt(parts[2]);
            date = new Date(year, month, day);
            dateString = income.dateReceived;
            console.log(`Date parsed from MM/DD/YYYY: ${income.dateReceived} -> ${date}`);
          }
        } else {
          // Standard date parsing
          dateString = income.dateReceived;
          date = new Date(income.dateReceived);
        }
      } else if (income.date) {
        // Alternative: some implementations might use 'date' property instead
        dateString = income.date;
        date = new Date(income.date);
      } else {
        // If no date property exists, try to extract date from other fields
        console.log("No standard date field found. Checking other fields:", income);
        
        // Try any field that might contain a date
        for (const key in income) {
          if (typeof income[key] === 'string' && 
              (key.toLowerCase().includes('date') || 
               key.toLowerCase().includes('time') || 
               key.toLowerCase().includes('created'))) {
            console.log(`Found potential date field: ${key} = ${income[key]}`);
            try {
              date = new Date(income[key]);
              dateString = income[key];
              if (!isNaN(date.getTime())) {
                console.log(`Successfully parsed date from ${key}: ${date}`);
                break;
              }
            } catch (e) {
              console.error(`Error parsing date from ${key}:`, e);
            }
          }
        }
        
        if (!date) {
          // Last resort: use current date
          date = new Date();
          dateString = "current date (fallback)";
          console.warn("No date field found in income record, using current date:", income);
        }
      }
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.warn("Invalid date for income record:", income);
        console.log("Attempted to parse date:", dateString);
        
        // Last resort: use current date
        date = new Date();
        console.warn("Using current date as fallback");
      }
      
      const year = date.getFullYear();
      const month = date.getMonth();
      const key = `${year}-${month}`;
      
      console.log(`Processing income record for ${year}-${month+1} (${date.toISOString()}):`, income);
      
      if (!monthlyData[key]) {
        monthlyData[key] = {
          year: year,
          month: month,
          totalIncome: 0,
          totalNetIncome: 0,
          incomeRecords: []
        };
      }
      
      // Ensure numerical values for calculations
      const incomeAmount = parseFloat(income.incomeAmount || 0);
      const netIncome = parseFloat(income.netIncome || 0);
      
      monthlyData[key].totalIncome += incomeAmount;
      monthlyData[key].totalNetIncome += netIncome;
      monthlyData[key].incomeRecords.push(income);
    });
    
    console.log("Monthly data after processing:", monthlyData);
    
    // Check if we have any monthly data
    if (Object.keys(monthlyData).length === 0) {
      console.warn("No monthly data was generated from income records");
      return;
    }
    
    // Generate monthly expense data (placeholder until Purchase Orders are integrated)
    // In a real implementation, this would come from your Purchase Orders module
    const generateExpenses = (totalIncome) => {
      return totalIncome * (Math.random() * 0.4 + 0.1); // 10-50% of income as expenses
    };
    
    // Convert to array of reports
    const generatedReports = Object.keys(monthlyData).map((key, index) => {
      const data = monthlyData[key];
      const totalExpenses = generateExpenses(data.totalIncome);
      const netProfit = data.totalIncome - totalExpenses;
      
      return {
        id: index + 1,
        year: data.year,
        month: data.month,
        dateGenerated: new Date(data.year, data.month, 1).toLocaleDateString(),
        totalIncome: data.totalIncome.toFixed(2),
        totalExpenses: totalExpenses.toFixed(2),
        netProfit: netProfit.toFixed(2),
        status: netProfit > 0 ? "Profitable" : "Loss",
        incomeRecords: data.incomeRecords
      };
    });
    
    // Sort by date (newest first)
    generatedReports.sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.month - a.month;
    });
    
    console.log("Generated reports:", generatedReports);
    setReports(generatedReports);
  };

  // Filter reports based on current month/year
  const filteredReports = reports.filter(report => {
    return report.month === currentMonth && report.year === currentYear;
  });

  // Available months for selection
  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];
  
  const years = Array.from(
    { length: 5 }, 
    (_, i) => new Date().getFullYear() - 2 + i
  );

  // Format currency with peso sign
  const formatCurrency = (value) => {
    return `₱${parseFloat(value).toLocaleString('en-PH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  // Handle time navigation
  const navigateTime = (direction) => {
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
  };

  // Format date for display
  const formatDate = (isoDate) => {
    if (!isoDate) return "";
    
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-PH', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };
  
  // Format time for display
  const formatTime = (isoDate) => {
    if (!isoDate) return "";
    
    const date = new Date(isoDate);
    return date.toLocaleTimeString('en-PH', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handle clicking on a report to see income breakdown
  const handleViewIncomeBreakdown = (report) => {
    setSelectedMonthIncome(report.incomeRecords);
    setShowIncomeBreakdown(true);
    setActiveReport(report.id);
  };

  // Calculate summaries for filtered reports
  const filteredIncome = filteredReports.reduce((sum, report) => sum + parseFloat(report.totalIncome), 0).toFixed(2);
  const filteredExpenses = filteredReports.reduce((sum, report) => sum + parseFloat(report.totalExpenses), 0).toFixed(2);
  const filteredProfit = filteredReports.reduce((sum, report) => sum + parseFloat(report.netProfit), 0).toFixed(2);

  // Filter income records based on search term
  const filteredIncomeRecords = selectedMonthIncome.filter(income => {
    return searchTerm === "" || 
           (income.id && income.id.toString().includes(searchTerm)) ||
           (income.orderId && income.orderId.toLowerCase().includes(searchTerm.toLowerCase())) ||
           (income.customerName && income.customerName.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  return (
    <DashboardLayout>
      <div className="min-h-screen">
        <div className="p-4">
          <header className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Financial Reports</h1>
          </header>

          {/* Time Range Controls - Monthly Only */}
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex space-x-4">
                  {/* Fixed to Monthly only */}
                  <div className="px-3 py-2 border border-gray-300 rounded-md shadow-sm">
                    Monthly
                  </div>

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
                </div>

                <div className="flex space-x-2">
                  <button 
                    className="p-2 rounded-md border border-gray-300 hover:bg-gray-50"
                    onClick={() => navigateTime("prev")}
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-500" />
                  </button>
                  <button 
                    className="p-2 rounded-md border border-gray-300 hover:bg-gray-50"
                    onClick={() => navigateTime("next")}
                  >
                    <ChevronRight className="w-5 h-5 text-gray-500" />
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
          <div className="bg-white shadow rounded-lg overflow-hidden ">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Report Details</h2>
              <p className="text-sm text-gray-500 mt-1">
                {months[currentMonth]} {currentYear} Financial Summary
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
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredReports.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-10 text-center text-sm text-gray-500">
                        No reports found for this period
                      </td>
                    </tr>
                  ) : (
                    filteredReports.map((report) => (
                      <tr 
                        key={report.id} 
                        className={activeReport === report.id ? "bg-indigo-50" : "hover:bg-gray-50"}
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button 
                            onClick={() => handleViewIncomeBreakdown(report)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            View Breakdown
                          </button>
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
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                      1
                    </button>
                    <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                      <span className="sr-only">Next</span>
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
          
          {/* Income Breakdown Modal - Dark background with only top close button */}
          {showIncomeBreakdown && (
              <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] flex flex-col">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
                  <h2 className="text-xl font-bold text-indigo-800">Income Breakdown</h2>
                  <button 
                    onClick={() => {
                      setShowIncomeBreakdown(false);
                      setActiveReport(null);
                    }}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="p-6 bg-white flex-1 overflow-y-auto">
                  {/* Search Bar */}
                  <div className="mb-6">
                    <div className="relative w-full">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Search by ID, Order, or Customer"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 p-2 border rounded-lg w-full shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                  
                   {/* Income Records Table */}
                   <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Income ID</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Net Income</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredIncomeRecords.length === 0 ? (
                          <tr>
                            <td colSpan="7" className="px-6 py-12 text-center">
                              <div className="flex flex-col items-center">
                                <FileText className="h-16 w-16 text-indigo-200 mb-4" />
                                <p className="text-indigo-700 text-lg font-medium mb-1">No income records found</p>
                                <p className="text-gray-500 text-sm">Try adjusting your search criteria</p>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          filteredIncomeRecords.map((income) => (
                            <tr key={income.id} className="hover:bg-gray-50 transition-colors duration-150">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">#{income.id}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                {formatDate(income.dateReceived)}
                                <div className="text-xs text-gray-500">{formatTime(income.dateReceived)}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{income.orderId}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">{income.customerName}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{income.paymentMethod}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-right font-medium">{formatCurrency(income.incomeAmount)}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-right font-medium">{formatCurrency(income.netIncome)}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Income Summary */}
                  <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-blue-900 mb-2">Income Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white p-4 rounded-md shadow-sm">
                        <p className="text-sm text-gray-500 mb-1">Total Income</p>
                        <p className="text-xl font-bold text-gray-900">
                          {formatCurrency(filteredIncomeRecords.reduce((sum, income) => sum + parseFloat(income.incomeAmount || 0), 0))}
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-md shadow-sm">
                        <p className="text-sm text-gray-500 mb-1">Total Net Income</p>
                        <p className="text-xl font-bold text-gray-900">
                          {formatCurrency(filteredIncomeRecords.reduce((sum, income) => sum + parseFloat(income.netIncome || 0), 0))}
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-md shadow-sm">
                        <p className="text-sm text-gray-500 mb-1">Number of Transactions</p>
                        <p className="text-xl font-bold text-gray-900">{filteredIncomeRecords.length}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReportModule;