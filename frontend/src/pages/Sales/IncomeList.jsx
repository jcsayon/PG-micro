// src/components/Sales/IncomeList.jsx
import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import DashboardLayout from "../../layouts/DashboardLayout"; // Update path as needed
import {Search,FileText,X,DollarSign,ChevronDown,Loader,BarChart4,TrendingUp,Users} from "lucide-react";

// API endpoints and utility functions (commented out until backend is ready)
/*
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
const ENDPOINTS = {
  INCOME: `${API_BASE_URL}/income/`,
};

// API utility functions
const fetchIncomeData = async () => {
  try {
    const response = await fetch(ENDPOINTS.INCOME);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching income data:", error);
    return null;
  }
};

const updateIncomeAPI = async (incomeId, updatedIncome) => {
  try {
    const response = await fetch(`${ENDPOINTS.INCOME}${incomeId}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedIncome),
    });
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`Error updating income ${incomeId}:`, error);
    return null;
  }
};
*/

const IncomeList = ({ storageKey }) => {
  // State management
  const [incomeRecords, setIncomeRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showIncomeDetailsModal, setShowIncomeDetailsModal] = useState(false);
  const [selectedIncome, setSelectedIncome] = useState(null);
  const [editedIncome, setEditedIncome] = useState(null);
  const [period, setPeriod] = useState("all");

  // Load income data
  useEffect(() => {
    loadIncomeData();
  }, []);
  
  // Function to load income data
  const loadIncomeData = () => {
    setIsLoading(true);
    
    /* 
    // When API is ready, uncomment this section
    fetchIncomeData()
      .then(data => {
        if (data) {
          console.log(`Loaded ${data.length} income records from API`);
          setIncomeRecords(data);
          // Save to localStorage as a backup
          localStorage.setItem(storageKey, JSON.stringify(data));
        } else {
          // Fall back to localStorage if API fails
          console.warn("API call failed, loading from localStorage");
          loadIncomeFromLocalStorage();
        }
      })
      .catch(error => {
        console.error("Error loading income data from API:", error);
        // Fall back to localStorage
        loadIncomeFromLocalStorage();
      })
      .finally(() => {
        setIsLoading(false);
      });
    */
    
    // For now, load from localStorage
    loadIncomeFromLocalStorage();
    setIsLoading(false);
  };

  // Load income from localStorage
  const loadIncomeFromLocalStorage = () => {
    const savedIncome = localStorage.getItem(storageKey);
    
    if (savedIncome) {
      try {
        const parsedIncome = JSON.parse(savedIncome);
        console.log(`Loaded ${parsedIncome.length} income records from localStorage`);
        setIncomeRecords(parsedIncome);
      } catch (error) {
        console.error("Error parsing income data:", error);
        setIncomeRecords([]);
      }
    } else {
      console.warn("No income data found in localStorage");
      setIncomeRecords([]);
    }
  };

  // Save income records to localStorage
  const saveIncomesToLocalStorage = (incomes) => {
    localStorage.setItem(storageKey, JSON.stringify(incomes));
  };

  // Format price for display
  const formatPrice = (price) => {
    if (!price && price !== 0) return "₱0.00";
    
    // Remove any existing formatting
    const numericPrice = String(price).replace(/[₱,]/g, '');
    
    return `₱${parseFloat(numericPrice).toLocaleString('en-PH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
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

  // Handle viewing income details
  const handleViewDetails = (income) => {
    setSelectedIncome(income);
    setEditedIncome({...income});
    setShowIncomeDetailsModal(true);
  };

  // Handle saving edited income
  const handleSaveIncome = () => {
    if (editedIncome) {
      /* 
      // When API is ready, uncomment this section
      setIsLoading(true);
      
      updateIncomeAPI(editedIncome.id, editedIncome)
        .then(updatedIncome => {
          if (updatedIncome) {
            console.log(`Successfully updated income ${updatedIncome.id} via API`);
            // Refresh the income list with latest data
            loadIncomeData();
            setShowIncomeDetailsModal(false);
          } else {
            console.warn("API update failed, falling back to local update");
            // Update the income record locally
            const updatedIncomes = incomeRecords.map(income => 
              income.id === editedIncome.id ? editedIncome : income
            );
            
            setIncomeRecords(updatedIncomes);
            saveIncomesToLocalStorage(updatedIncomes);
            setShowIncomeDetailsModal(false);
          }
        })
        .catch(error => {
          console.error("Error updating income:", error);
          alert("Failed to update income record. Please try again.");
        })
        .finally(() => {
          setIsLoading(false);
        });
      */
      
      // For now, update locally
      const updatedIncomes = incomeRecords.map(income => 
        income.id === editedIncome.id ? editedIncome : income
      );
      
      setIncomeRecords(updatedIncomes);
      saveIncomesToLocalStorage(updatedIncomes);
      setShowIncomeDetailsModal(false);
    }
  };

  // Handle income field change
  const handleIncomeChange = (field, value) => {
    setEditedIncome({
      ...editedIncome,
      [field]: value
    });
  };

  // Generate income report
  const generateIncomeReport = async () => {
    try {
      // Filter records based on period if needed
      let filteredRecords = [...incomeRecords];
      let periodName = "All Time";
      
      if (period === "monthly") {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        filteredRecords = incomeRecords.filter(income => {
          const incomeDate = new Date(income.dateReceived);
          return incomeDate.getMonth() === currentMonth && 
                 incomeDate.getFullYear() === currentYear;
        });
        
        const monthName = new Date().toLocaleString('en-US', { month: 'long' });
        periodName = `${monthName} ${currentYear}`;
      } else if (period === "yearly") {
        const currentYear = new Date().getFullYear();
        filteredRecords = incomeRecords.filter(income => {
          const incomeDate = new Date(income.dateReceived);
          return incomeDate.getFullYear() === currentYear;
        });
        
        periodName = `${currentYear}`;
      }
      
      // Create PDF document
      const doc = new jsPDF();
      
      // Add header
      doc.setFillColor(48, 44, 122);
      doc.rect(0, 0, 210, 25, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text("PG Micro World", 15, 17);
      
      doc.setFontSize(14);
      doc.setFont("helvetica", "normal");
      doc.text("Income Report", 160, 17);
      
      // Reset text color
      doc.setTextColor(0, 0, 0);
      
      // Add company info
      doc.setFontSize(10);
      doc.text("PG Micro World Inc.", 15, 35);
      doc.text("123 Tech Plaza, Makati City", 15, 40);
      doc.text("Philippines, 1200", 15, 45);
      
      // Add report details
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(`Income Report - ${periodName}`, 15, 60);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 15, 67);
      
      // Calculate summary
      const totalIncome = filteredRecords.reduce((sum, record) => sum + record.incomeAmount, 0);
      const totalNetIncome = filteredRecords.reduce((sum, record) => sum + record.netIncome, 0);
      
      // Add summary section
      doc.setFillColor(240, 240, 245);
      doc.roundedRect(15, 75, 180, 25, 3, 3, 'F');
      doc.setFont("helvetica", "bold");
      doc.text("Summary", 20, 85);
      doc.setFont("helvetica", "normal");
      doc.text(`Total Income: ${formatPrice(totalIncome)}`, 20, 93);
      doc.text(`Total Net Income: ${formatPrice(totalNetIncome)}`, 120, 93);
      
      // Add table
      doc.autoTable({
        startY: 110,
        head: [['ID', 'Date', 'Order ID', 'Customer', 'Amount', 'Net Income', 'Payment Method', 'Status']],
        body: filteredRecords.map(record => [
          record.id,
          formatDate(record.dateReceived),
          record.orderId,
          record.customerName,
          formatPrice(record.incomeAmount),
          formatPrice(record.netIncome),
          record.paymentMethod,
          record.status
        ]),
        theme: 'striped',
        headStyles: {
          fillColor: [48, 44, 122],
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        margin: { top: 110 }
      });
      
      // Add footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text(`Page ${i} of ${pageCount}`, 180, 285);
      }
      
      // Save and open
      const pdfOutput = doc.output('datauristring');
      const pdfWindow = window.open("", "_blank");
      if (pdfWindow) {
        pdfWindow.document.write(`<iframe width="100%" height="100%" src="${pdfOutput}"></iframe>`);
      } else {
        alert("Pop-up blocked. Please allow pop-ups to view the report.");
      }
      
      return pdfOutput;
    } catch (error) {
      console.error("Error generating income report:", error);
      alert("Failed to generate income report. Please try again.");
      return null;
    }
  };
  
  // Calculate summary statistics
  const calculateSummary = () => {
    if (incomeRecords.length === 0) {
      return {
        totalIncome: 0,
        totalNetIncome: 0,
        averageIncome: 0,
        recordCount: 0
      };
    }
    
    const totalIncome = incomeRecords.reduce((sum, record) => sum + record.incomeAmount, 0);
    const totalNetIncome = incomeRecords.reduce((sum, record) => sum + record.netIncome, 0);
    const averageIncome = totalIncome / incomeRecords.length;
    
    return {
      totalIncome,
      totalNetIncome,
      averageIncome,
      recordCount: incomeRecords.length
    };
  };
  
  const filteredIncomes = incomeRecords.filter(income => {
    const matchesSearch = searchTerm === "" || 
                         (income.id && income.id.toString().includes(searchTerm)) ||
                         (income.orderId && income.orderId.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (income.customerName && income.customerName.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  // Get summary stats
  const summary = calculateSummary();
  
  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {/* Header and title */}
      <div className="bg-white p-5 rounded-lg mb-6 shadow-sm">
        <h1 className="text-2xl font-bold text-purple-800 mb-4">Income Management</h1>
        
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <div className="flex-grow relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by ID, Order, or Customer"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 p-2 border rounded-lg w-full shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white shadow-sm rounded-lg p-4 border-l-4 border-purple-500 hover:shadow-md transition-shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Income</h3>
          <p className="text-2xl font-bold text-gray-900">{formatPrice(summary.totalIncome)}</p>
          <p className="text-xs text-gray-500 mt-1">From {summary.recordCount} transactions</p>
        </div>
        <div className="bg-white shadow-sm rounded-lg p-4 border-l-4 border-green-500 hover:shadow-md transition-shadow">
          <h3 className="text-sm font-medium text-gray-500">Net Income</h3>
          <p className="text-2xl font-bold text-gray-900">{formatPrice(summary.totalNetIncome)}</p>
          <p className="text-xs text-green-500 mt-1">
            {(summary.totalNetIncome / summary.totalIncome * 100 || 0).toFixed(1)}% margin
          </p>
        </div>
        <div className="bg-white shadow-sm rounded-lg p-4 border-l-4 border-yellow-500 hover:shadow-md transition-shadow">
          <h3 className="text-sm font-medium text-gray-500">Average Income</h3>
          <p className="text-2xl font-bold text-gray-900">{formatPrice(summary.averageIncome)}</p>
          <p className="text-xs text-gray-500 mt-1">Per transaction</p>
        </div>
        <div className="bg-white shadow-sm rounded-lg p-4 border-l-4 border-blue-500 hover:shadow-md transition-shadow">
          <h3 className="text-sm font-medium text-gray-500">Record Count</h3>
          <p className="text-2xl font-bold text-gray-900">{summary.recordCount}</p>
          <p className="text-xs text-gray-500 mt-1">Total transactions</p>
        </div>
      </div>
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <Loader className="animate-spin -ml-1 mr-3 h-8 w-8 text-purple-500" />
          <p className="text-lg font-medium text-purple-600">Loading data...</p>
        </div>
      )}
      
      {/* Income Records Table */}
      {!isLoading && (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Income ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Net Income</th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredIncomes.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <FileText className="h-16 w-16 text-purple-200 mb-4" />
                        <p className="text-purple-700 text-lg font-medium mb-1">No income records found</p>
                        <p className="text-gray-500 text-sm">Income records will appear here after creating sales orders</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredIncomes.map((income, index) => (
                    <tr key={income.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-purple-600">#{income.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <div>{formatDate(income.dateReceived)}</div>
                        <div className="text-xs text-gray-500">{formatTime(income.dateReceived)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{income.orderId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">{income.customerName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{income.paymentMethod}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-right font-medium">{formatPrice(income.incomeAmount)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-right font-medium">{formatPrice(income.netIncome)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium ${
                          income.status === "Received" ? "bg-green-100 text-green-800" : 
                          income.status === "Pending" ? "bg-yellow-100 text-yellow-800" : 
                          "bg-blue-100 text-blue-800"
                        }`}>
                          {income.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {/* Income Details Modal */}
      {showIncomeDetailsModal && selectedIncome && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-purple-800">Income Details</h2>
              <button 
                onClick={() => setShowIncomeDetailsModal(false)}
                className="text-gray-400 hover:text-gray-500 focus:outline-none transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6 bg-white">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Basic Information</h3>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Income ID</p>
                        <p className="font-medium text-gray-800">#{editedIncome.id}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Order ID</p>
                        <p className="font-medium text-gray-800">{editedIncome.orderId}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Customer</p>
                        <p className="font-medium text-gray-800">{editedIncome.customerName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Date Received</p>
                        <p className="font-medium text-gray-800">{formatDate(editedIncome.dateReceived)} {formatTime(editedIncome.dateReceived)}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Financial Information</h3>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Total Amount</p>
                        <p className="font-medium text-lg text-gray-800">{formatPrice(editedIncome.incomeAmount)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Net Income</p>
                        <p className="font-medium text-lg text-gray-800">{formatPrice(editedIncome.netIncome)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Profit Margin</p>
                        <p className="font-medium text-green-600">
                          {(editedIncome.netIncome / editedIncome.incomeAmount * 100).toFixed(2)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Payment Method</p>
                        <p className="font-medium text-gray-800">{editedIncome.paymentMethod}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Income Amount</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      value={editedIncome.incomeAmount}
                      onChange={(e) => handleIncomeChange("incomeAmount", parseFloat(e.target.value))}
                      className="focus:ring-purple-500 focus:border-purple-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Net Income</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      value={editedIncome.netIncome}
                      onChange={(e) => handleIncomeChange("netIncome", parseFloat(e.target.value))}
                      className="focus:ring-purple-500 focus:border-purple-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                  <select
                    value={editedIncome.paymentMethod}
                    onChange={(e) => handleIncomeChange("paymentMethod", e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                  >
                    <option value="Cash">Cash</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Debit Card">Debit Card</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Online Payment">Online Payment</option>
                    <option value="GCash">GCash</option>
                    <option value="Maya">Maya</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <div className="relative">
                    <select
                      value={editedIncome.status}
                      onChange={(e) => handleIncomeChange("status", e.target.value)}
                      className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md ${
                        editedIncome.status === "Received" ? "bg-green-50 text-green-700" : 
                        editedIncome.status === "Pending" ? "bg-yellow-50 text-yellow-700" : 
                        "bg-blue-50 text-blue-700"
                      }`}
                    >
                      <option value="Received">Received</option>
                      <option value="Pending">Pending</option>
                      <option value="Partial">Partial</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3 sticky bottom-0 bg-white">
              <button
                onClick={() => setShowIncomeDetailsModal(false)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveIncome}
                className="px-4 py-2 bg-purple-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Footer */}
      <div className="mt-8 py-4 border-t border-gray-200 text-center text-sm text-gray-500">
        <p>© 2025 PG Micro World. All rights reserved.</p>
      </div>
    </div>
  );
};

export default IncomeList;