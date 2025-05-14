import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import DashboardLayout from "../../layouts/DashboardLayout";
import IncomeList from "../../pages/Sales/IncomeList";
import CustomerSales from "./CustomerSales";
import { X, RefreshCw, Plus } from "lucide-react";

// Define a constant for warranty storage
const WARRANTY_STORAGE_KEY = 'warrantyData';

// Define constants
const INCOME_STORAGE_KEY = 'incomeData';

const SalesOrderPage = ({ inventoryData, updateInventoryStatus }) => {
  const navigate = useNavigate();
  
  //---------------------------------------------
  // STATE MANAGEMENT
  //---------------------------------------------
  
  // Sales order management states
  const [salesOrders, setSalesOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Order creation states
  const [newOrderId, setNewOrderId] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [orderType, setOrderType] = useState("Walk-In");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [cart, setCart] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [availableProducts, setAvailableProducts] = useState([]);
  
  // Customer management states
  const [customers, setCustomers] = useState([
    { id: 1, name: "Juan Dela Cruz", email: "juan@example.com", phone: "0912-345-6789", address: "123 Main St, Davao City", type: "Walk-In" },
    { id: 2, name: "Maria Santos", email: "maria@example.com", phone: "0901-234-5678", address: "456 IT Park, Cebu City", type: "Contract" }
  ]);

  //---------------------------------------------
  // DATA LOADING & PERSISTENCE FUNCTIONS
  //---------------------------------------------
  
  // Function to save orders to localStorage
  const saveOrdersToLocalStorage = (orders) => {
    localStorage.setItem('salesOrdersData', JSON.stringify(orders));
  };

  useEffect(() => {
    const savedCustomers = localStorage.getItem('customersData');
    if (savedCustomers) {
      try {
        const parsedCustomers = JSON.parse(savedCustomers);
        setCustomers(parsedCustomers);
      } catch (error) {
        console.error("Error parsing customers from localStorage:", error);
        // Keep the default customers if parsing fails
      }
    } else {
      // If no customers in localStorage, save the initial ones
      localStorage.setItem('customersData', JSON.stringify(customers));
    }
  }, []);

  // Add this useEffect hook to automatically set order type based on selected customer
  useEffect(() => {
    if (selectedCustomer) {
      const customer = customers.find(c => c.id === parseInt(selectedCustomer));
      if (customer) {
        setOrderType(customer.type);
      }
    }
  }, [selectedCustomer, customers]);

  // Load inventory data
  useEffect(() => {
    loadInventoryData();
    
    // Listen for changes to inventory data
    const handleStorageChange = (e) => {
      if (e.key === 'inventoryData') {
        loadInventoryData();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Load inventory data from localStorage or API
  const loadInventoryData = () => {
    setIsLoading(true);
    console.log("Loading inventory data...");
    
    /* 
    // When API is ready, uncomment this section
    fetchInventory().then(inventoryData => {
      if (inventoryData) {
        // Filter out sold and damaged items
        const availableItems = inventoryData.filter(item => 
          item.saleStatus !== "Sold" && item.saleStatus !== "Damaged"
        );
        setAvailableProducts(availableItems);
      } else {
        // Fallback to localStorage if API fails
        loadInventoryFromLocalStorage();
      }
      setIsLoading(false);
    }).catch(error => {
      console.error("Error loading inventory from API:", error);
      loadInventoryFromLocalStorage();
      setIsLoading(false);
    });
    */
    
    // For now, load from localStorage
    loadInventoryFromLocalStorage();
    setIsLoading(false);
  };
  
  // Load inventory from localStorage (fallback)
  const loadInventoryFromLocalStorage = () => {
    const savedInventory = localStorage.getItem('inventoryData');
    
    if (savedInventory) {
      try {
        const parsedInventory = JSON.parse(savedInventory);
        console.log(`Loaded ${parsedInventory.length} inventory items from localStorage`);
        
        // Only show available (not sold) products
        const availableItems = parsedInventory.filter(item => 
          item.saleStatus !== "Sold" && item.saleStatus !== "Damaged"
        );
        
        setAvailableProducts(availableItems);
      } catch (error) {
        console.error("Error parsing inventory data:", error);
        setAvailableProducts([]);
      }
    } else {
      console.warn("No inventory data found in localStorage");
      setAvailableProducts([]);
    }
  };

  // Update inventory item status - either use the prop or fallback to local implementation
  const handleUpdateInventoryStatus = async (productId, newStatus) => {
    console.log(`Updating product status: ID=${productId}, Status=${newStatus}`);
    
    if (typeof updateInventoryStatus === 'function') {
      // Use the provided function from props
      return updateInventoryStatus(productId, newStatus);
    } else {
      // Fallback to local implementation
      try {
        const savedInventory = localStorage.getItem('inventoryData');
        if (!savedInventory) {
          console.error("No inventory data in localStorage");
          return false;
        }
        
        const inventory = JSON.parse(savedInventory);
        
        // Find the item by ID
        const itemIndex = inventory.findIndex(item => item.id === productId);
        
        if (itemIndex === -1) {
          console.error(`Product with ID ${productId} not found in inventory`);
          return false;
        }
        
        // Update the item's status
        inventory[itemIndex].saleStatus = newStatus;
        console.log(`Updated item:`, inventory[itemIndex]);
        
        // Save back to localStorage
        localStorage.setItem('inventoryData', JSON.stringify(inventory));
        
        // Update local state by reloading
        loadInventoryData();
        
        return true;
      } catch (error) {
        console.error("Error updating inventory status:", error);
        return false;
      }
    }
  };

  // Load sales orders data
  useEffect(() => {
    loadSalesOrdersData();
  }, []);
  
  // Function to load sales orders data
  const loadSalesOrdersData = () => {
    setIsLoading(true);
    
    /* 
    // When API is ready, uncomment this section
    fetchSalesOrders().then(ordersData => {
      if (ordersData) {
        setSalesOrders(ordersData);
        
        // Set next order ID based on highest existing ID
        if (ordersData.length > 0) {
          const orderNumbers = ordersData.map(order => 
            parseInt(order.id.replace('#SO', ''))
          );
          const maxOrderNumber = Math.max(...orderNumbers);
          setNewOrderId(`#SO${maxOrderNumber + 1}`);
        } else {
          setNewOrderId('#SO1001');
        }
      } else {
        // Fallback to localStorage if API fails
        loadSalesOrdersFromLocalStorage();
      }
      setIsLoading(false);
    }).catch(error => {
      console.error("Error loading sales orders from API:", error);
      loadSalesOrdersFromLocalStorage();
      setIsLoading(false);
    });
    */
    
    // For now, load from localStorage
    loadSalesOrdersFromLocalStorage();
    setIsLoading(false);
  };
  
  // Load sales orders from localStorage (fallback)
  const loadSalesOrdersFromLocalStorage = () => {
    // Try to load from localStorage first
    const savedOrders = localStorage.getItem('salesOrdersData');
    
    if (savedOrders) {
      try {
        const parsedOrders = JSON.parse(savedOrders);
        setSalesOrders(parsedOrders);
        
        // Set next order ID based on highest existing ID
        if (parsedOrders.length > 0) {
          const orderNumbers = parsedOrders.map(order => 
            parseInt(order.id.replace('#SO', ''))
          );
          const maxOrderNumber = Math.max(...orderNumbers);
          setNewOrderId(`#SO${maxOrderNumber + 1}`);
        } else {
          setNewOrderId('#SO1001');
        }
      } catch (error) {
        console.error("Error loading orders:", error);
        loadInitialOrders(); // Fall back to mock data
      }
    } else {
      // No saved orders found, load initial mock data
      loadInitialOrders();
    }
  };

  // Load initial mock sales orders
  const loadInitialOrders = () => {
    const initialOrders = [
      { id: "#SO1001", employee: "sales@pgmicro.com", dateSold: "2023-01-01", customer: "Juan Dela Cruz", type: "Walk-In", total: 10000.00 },
      { id: "#SO1002", employee: "sales@pgmicro.com", dateSold: "2023-01-02", customer: "Maria Santos", type: "Contract", total: 11000.00 },
      { id: "#SO1003", employee: "sales@pgmicro.com", dateSold: "2023-01-03", customer: "Juan Dela Cruz", type: "Walk-In", total: 12000.00 },
      { id: "#SO1004", employee: "sales@pgmicro.com", dateSold: "2023-01-04", customer: "Maria Santos", type: "Contract", total: 13000.00 },
      { id: "#SO1005", employee: "sales@pgmicro.com", dateSold: "2023-01-05", customer: "Juan Dela Cruz", type: "Walk-In", total: 14000.00 },
      { id: "#SO1006", employee: "sales@pgmicro.com", dateSold: "2023-01-06", customer: "Maria Santos", type: "Contract", total: 15000.00 },
      { id: "#SO1007", employee: "sales@pgmicro.com", dateSold: "2023-01-07", customer: "Juan Dela Cruz", type: "Walk-In", total: 16000.00 },
      { id: "#SO1008", employee: "sales@pgmicro.com", dateSold: "2023-01-08", customer: "Maria Santos", type: "Contract", total: 17000.00 },
      { id: "#SO1009", employee: "sales@pgmicro.com", dateSold: "2023-01-09", customer: "Juan Dela Cruz", type: "Walk-In", total: 18000.00 },
      { id: "#SO1010", employee: "sales@pgmicro.com", dateSold: "2023-01-10", customer: "Maria Santos", type: "Contract", total: 19000.00 }
    ];
    
    setSalesOrders(initialOrders);
    // Save initial orders to localStorage
    saveOrdersToLocalStorage(initialOrders);
    setNewOrderId('#SO1011');
  };

  //---------------------------------------------
  // CALCULATION & UTILITY FUNCTIONS
  //---------------------------------------------
  
  // Calculate total when cart changes
  useEffect(() => {
    let total = 0;
    cart.forEach(item => {
      const priceValue = parseFloat(
        String(item.sellingPrice).replace('₱', '').replace(/,/g, '')
      );
      total += isNaN(priceValue) ? 0 : priceValue;
    });
    setTotalAmount(total);
  }, [cart]);

  // Format price for display
  const formatPrice = (price) => {
    if (!price) return "0.00";
    
    // Remove any existing formatting (currency symbols and commas)
    const numericPrice = String(price).replace(/[₱±,]/g, '');
    
    return parseFloat(numericPrice).toLocaleString('en-PH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };
  
  // Find customer by name
  const findCustomerByName = (name) => {
    return customers.find(c => c.name === name) || null;
  };
  
  // Generate category list from products
  const categories = ["All", ...new Set(availableProducts.map(p => p.category).filter(Boolean))];
  
  // Filter products by category
  const filteredProducts = categoryFilter === "All" 
    ? availableProducts 
    : availableProducts.filter(p => p.category === categoryFilter);
  
  // Filter orders based on search and type
  const filteredOrders = salesOrders.filter(order => {
    const matchesType = filterType === "All" || order.type === filterType;
    const matchesSearch = searchTerm === "" || 
                         order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.dateSold.includes(searchTerm);
    return matchesType && matchesSearch;
  });

  //---------------------------------------------
  // INVOICE GENERATION
  //---------------------------------------------
  
  // Generate PDF invoice
  const generateInvoice = (order) => {
    return new Promise((resolve) => {
      try {
        const doc = new jsPDF();
        
        // Enhanced header with deeper purple
        doc.setFillColor(48, 44, 122);
        doc.rect(0, 0, 210, 25, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.setFont("helvetica", "bold");
        doc.text("PG Micro World", 15, 17);
        
        doc.setFontSize(14);
        doc.setFont("helvetica", "normal");
        doc.text("Invoice", 180, 17);
        
        // Reset text color for body content
        doc.setTextColor(0, 0, 0);
        
        // Company info with improved formatting
        doc.setFontSize(10);
        doc.text("PG Micro World Inc.", 15, 35);
        doc.text("123 Tech Plaza, Makati City", 15, 40);
        doc.text("Philippines, 1200", 15, 45);
        doc.text("Tel: +63 2 8123 4567", 15, 50);
        doc.text("Email: info@pgmicro.com", 15, 55);
        
        // Invoice details in a clean light gray box
        doc.setDrawColor(220, 220, 220);
        doc.setFillColor(245, 245, 245);
        doc.roundedRect(120, 30, 75, 40, 2, 2, 'FD');
        
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("INVOICE", 145, 38);
        
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`Invoice #: ${order.id}`, 125, 45);
        doc.text(`Date: ${order.dateSold}`, 125, 50);
        doc.text(`Payment: ${order.paymentMethod}`, 125, 55);
        doc.text(`Type: ${order.type}`, 125, 60);
        
        // Customer info in a clean light blue-gray box
        doc.setFillColor(240, 242, 245);
        doc.roundedRect(15, 65, 180, 30, 2, 2, 'FD');
        
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text("Customer Information", 20, 73);
        
        // Find customer details
        const customer = findCustomerByName(order.customer);
        
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`Customer: ${order.customer}`, 20, 80);
        doc.text(`Address: ${customer?.address || 'N/A'}`, 20, 85);
        
        doc.text(`Email: ${customer?.email || 'N/A'}`, 120, 80);
        doc.text(`Contact: ${customer?.phone || 'N/A'}`, 120, 85);
        
       // Items table with improved styling
        doc.setFillColor(240, 236, 255);
        doc.rect(15, 100, 180, 10, 'F');
        doc.setDrawColor(200, 200, 200);
        doc.line(15, 100, 195, 100);

        doc.setFont("helvetica", "bold");
        doc.text("Item ID", 20, 107);
        doc.text("Item", 60, 107);
        doc.text("Brand/Model", 100, 107);
        doc.text("Serial Number", 140, 107); // Changed from 150 to 140
        doc.text("Price", 180, 107, { align: "right" });
        doc.line(15, 110, 195, 110);

        // Items list with subtle alternating backgrounds
        let yPos = 120;
        if (order.items && order.items.length > 0) {
          order.items.forEach((item, index) => {
            if (index % 2 === 0) {
              doc.setFillColor(248, 248, 252);
              doc.rect(15, yPos - 6, 180, 14, 'F');
            }
            
            doc.setFont("helvetica", "normal");
            doc.text(item.id.toString(), 20, yPos);
            doc.text(item.category || "Unknown", 60, yPos);
            doc.text(`${item.brand || ""} ${item.model || ""}`, 100, yPos);
            doc.text(item.serialNumber || "N/A", 140, yPos); // Changed from 150 to 140
            doc.text(`₱${formatPrice(item.sellingPrice)}`, 180, yPos, { align: "right" });
                          
            doc.setDrawColor(240, 240, 240);
            doc.line(15, yPos + 4, 195, yPos + 4);
            
            yPos += 15;
          });
        }
        
        // Total section with stronger styling
        yPos += 5;
        doc.setDrawColor(180, 180, 180);
        doc.line(15, yPos, 195, yPos);
        
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.text("Total:", 150, yPos + 10);
        doc.text(`₱${formatPrice(order.total)}`, 180, yPos + 10, { align: "right" });
        
        // Footer with subtle top border
        doc.setDrawColor(200, 200, 200);
        doc.line(15, 250, 195, 250);
        
        doc.setFontSize(9);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(80, 80, 80);
        doc.text("Thank you for your business. For inquiries, please contact us at support@pgmicro.com", 105, 260, { align: "center" });
        doc.text("This invoice was generated electronically and is valid without a signature.", 105, 265, { align: "center" });
        
        // Add page numbers
        doc.setFont("helvetica", "normal");
        doc.text(`Page 1 of 1`, 180, 280);
        
        // Save PDF
        const pdfOutput = doc.output('datauristring');
        resolve(pdfOutput);
      } catch (error) {
        console.error("Error generating PDF:", error);
        const fallbackDoc = new jsPDF();
        fallbackDoc.text("Invoice generation failed: " + error.message, 20, 20);
        const fallbackPdf = fallbackDoc.output('datauristring');
        resolve(fallbackPdf);
      }
    });
  };

  //---------------------------------------------
  // CART MANAGEMENT FUNCTIONS
  //---------------------------------------------
  
  // Add product to cart
  const addToCart = (product) => {
    if (product.saleStatus === "Sold") {
      alert("This product is already sold");
      return;
    }
    
    if (cart.some(item => item.id === product.id)) {
      alert("This product is already in your cart");
      return;
    }
    
    setCart([...cart, product]);
  };

  // Remove product from cart
  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  //---------------------------------------------
  // ORDER MANAGEMENT FUNCTIONS
  //---------------------------------------------

  // Create warranty entries for purchased products
  const createWarrantyEntries = (order) => {
    try {
      // Get existing warranty data from localStorage or initialize empty array
      const existingWarranties = JSON.parse(localStorage.getItem(WARRANTY_STORAGE_KEY) || '[]');
      
      // Calculate next warranty ID
      const nextId = existingWarranties.length > 0 
        ? Math.max(...existingWarranties.map(w => w.id)) + 1 
        : 1;
      
      // Create warranty entries for each product in the order
      const newWarranties = order.items.map((item, index) => {
        // Calculate warranty period (1 year from purchase date)
        const issueDate = order.dateSold;
        const expiryDate = new Date(issueDate);
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);
        
        return {
          id: nextId + index,
          type: "Customer Warranty",
          product: `${item.brand || ''} ${item.model || item.category || 'Unknown Product'}`.trim(),
          customer: order.customer,
          salesOrderId: order.id,
          itemId: item.id, // Ensure this is properly passed
          serialNumber: item.serialNumber,
          issueDate: issueDate,
          expiryDate: expiryDate.toISOString().split('T')[0],
          status: "Active",
          warrantyUse: 0
        };
      });
      
      // Combine existing and new warranties
      const updatedWarranties = [...existingWarranties, ...newWarranties];
      
      // Save updated warranties to localStorage
      localStorage.setItem(WARRANTY_STORAGE_KEY, JSON.stringify(updatedWarranties));
      
      console.log(`Created ${newWarranties.length} warranty entries for order ${order.id}`);
    } catch (error) {
      console.error("Error creating warranty entries:", error);
    }
  };

  // Create income record for the order
  const createIncomeRecord = (order) => {
    try {
      // Get existing income records from localStorage or initialize empty array
      const existingIncomes = JSON.parse(localStorage.getItem(INCOME_STORAGE_KEY) || '[]');
      
      // Calculate next income ID
      const nextId = existingIncomes.length > 0 
        ? Math.max(...existingIncomes.map(income => income.id)) + 1 
        : 1;
      
      // For now, simple calculation where netIncome is 70% of total
      // In a real implementation, you'd calculate this based on actual costs
      const netIncome = order.total * 0.7;
      
      // Create the income record
      const newIncome = {
        id: nextId,
        incomeAmount: order.total,
        netIncome: netIncome,
        status: "Received", // Default status for completed orders
        paymentMethod: order.paymentMethod,
        dateReceived: new Date().toISOString(),
        orderId: order.id,
        customerName: order.customer,
        notes: ""
      };
      
      // Add the new income record to the array
      const updatedIncomes = [...existingIncomes, newIncome];
      
      // Save updated incomes to localStorage
      localStorage.setItem(INCOME_STORAGE_KEY, JSON.stringify(updatedIncomes));
      
      console.log(`Created income record #${nextId} for order ${order.id}`);
      
      return newIncome;
    } catch (error) {
      console.error("Error creating income record:", error);
      return null;
    }
  };
  
  // Create new sales order
  const handleCreateOrder = async () => {
    if (!selectedCustomer) {
      alert("Please select a customer");
      return;
    }
    
    if (!paymentMethod) {
      alert("Please select a payment method");
      return;
    }
    
    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }
    
    try {
      // Find the selected customer
      const customer = customers.find(c => c.id === parseInt(selectedCustomer));
      if (!customer) {
        alert("Invalid customer selected");
        return;
      }
      
      // Create the order object
      const newOrder = {
        id: newOrderId,
        employee: "sales@pgmicro.com",
        dateSold: new Date().toISOString().split('T')[0],
        customer: customer.name,
        type: orderType,
        total: totalAmount,
        items: cart,
        paymentMethod: paymentMethod
      };
      
      // Generate the invoice PDF
      console.log("Generating invoice for order:", newOrder);
      const invoiceUrl = await generateInvoice(newOrder);
      
      if (!invoiceUrl) {
        throw new Error("Failed to generate invoice");
      }
      
      newOrder.invoiceUrl = invoiceUrl;
      
      // For now, mark items as sold in localStorage inventory
      for (const item of cart) {
        const updated = await handleUpdateInventoryStatus(item.id, "Sold");
        console.log(`Updated item ${item.id} status:`, updated ? "Success" : "Failed");
      }
      
      // Add the new order to the sales orders list
      const updatedOrders = [...salesOrders, newOrder];
      setSalesOrders(updatedOrders);
      
      // Save to localStorage so orders persist after refresh
      saveOrdersToLocalStorage(updatedOrders);
      
      // Create warranty entries for each purchased product
      createWarrantyEntries(newOrder);
  
      // Create income record for the order
      const incomeRecord = createIncomeRecord(newOrder);
  
      /* 
      // When API is ready, uncomment this section - This is correctly placed here
      try {
        const response = await fetch(`${API_BASE_URL}/income/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderId: newOrder.id,
            customerName: newOrder.customer,
            incomeAmount: newOrder.total,
            netIncome: newOrder.total * 0.7,
            status: "Received",
            paymentMethod: newOrder.paymentMethod,
            dateReceived: new Date().toISOString(),
            notes: ""
          }),
        });
  
        if (!response.ok) throw new Error("Failed to create income record");
        const incomeData = await response.json();
        console.log("Income record created:", incomeData);
      } catch (error) {
        console.error("Error creating income record in API:", error);
        // Continue with the order process even if API fails
      }
      */
  
      // FIRST: Reset the form and close the modal
      setCart([]);
      setSelectedCustomer("");
      setPaymentMethod("");
      setShowCreateModal(false);
      
      // THEN: Generate next order ID
      const nextOrderNumber = parseInt(newOrderId.replace("#SO", "")) + 1;
      setNewOrderId(`#SO${nextOrderNumber}`);
      
      // NEXT: Open the invoice in a new window
      const pdfWindow = window.open("", "_blank");
      if (pdfWindow) {
        pdfWindow.document.write(
          `<iframe width="100%" height="100%" src="${invoiceUrl}"></iframe>`
        );
      } else {
        alert("Pop-up blocked. Please allow pop-ups to view the invoice.");
      }
      
      // FINALLY: Show success message
      alert("Order created successfully!");
      
    } catch (error) {
      console.error("Error creating order:", error);
      alert(`Failed to create order: ${error.message || "Unknown error"}`);
    }
  };

  // View order details
  const viewOrderDetails = (order) => {
    try {
      if (order.invoiceUrl) {
        const pdfWindow = window.open("", "_blank");
        if (pdfWindow) {
          pdfWindow.document.write(
            `<iframe width="100%" height="100%" src="${order.invoiceUrl}"></iframe>`
          );
        } else {
          alert("Pop-up blocked. Please allow pop-ups to view the invoice.");
        }
      } else {
        // Generate invoice on-the-fly if not available
        generateInvoice(order).then(invoiceUrl => {
          const pdfWindow = window.open("", "_blank");
          if (pdfWindow) {
            pdfWindow.document.write(
              `<iframe width="100%" height="100%" src="${invoiceUrl}"></iframe>`
            );
          } else {
            alert("Pop-up blocked. Please allow pop-ups to view the invoice.");
          }
        });
      }
    } catch (error) {
      console.error("Error viewing order:", error);
      alert("Failed to view order details");
    }
  };

  // Refresh data manually
  const handleRefreshData = () => {
    setIsLoading(true);
    loadInventoryData();
    loadSalesOrdersData();
    setTimeout(() => setIsLoading(false), 500); // Add a small delay for UX
  };
  
  // Navigate to Income List page
  const navigateToIncomeList = () => {
    navigate("/income-list");
  };
  
  // Navigate to Customer List page
  const navigateToCustomerSales = () => {
    navigate("/customer-sales");
  };
  
  //---------------------------------------------
// RENDER UI
//---------------------------------------------

return (
  <div className="p-4 bg-white min-h-screen">
    {/* Header and controls section */}
    <div className="bg-white p-4 rounded-lg mb-4 border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-purple-800">Issued Sale Orders</h1>
      </div>
      
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div>
          <label htmlFor="type-filter" className="mr-2">Type:</label>
          <select
            id="type-filter"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="p-2 border rounded bg-white"
          >
            <option value="All">All</option>
            <option value="Walk-In">Walk-In</option>
            <option value="Contract">Contract</option>
          </select>
        </div>
        
        <div className="flex-grow">
          <input
            type="text"
            placeholder="Search by SO ID, Customer, or Date"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border rounded w-full max-w-xl"
          />
        </div>
        
        <div className="flex space-x-2">
          <button 
            onClick={handleRefreshData} 
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 flex items-center"
            disabled={isLoading}
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            {isLoading ? "Loading..." : "Refresh Data"}
          </button>
          
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center"
          >
            <Plus className="h-4 w-4 mr-1" /> Create SO
          </button>
        </div>
      </div>
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="flex justify-center items-center py-4">
          <p className="text-purple-700 text-lg">Loading data...</p>
        </div>
      )}
      
      {/* Sales Orders Table */}
      {!isLoading && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100 text-gray-800">
                <th className="p-3 text-left">Sale Order ID</th>
                <th className="p-3 text-left">Employee</th>
                <th className="p-3 text-left">Date Sold</th>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-right">Total</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-4 text-center text-gray-500">No sales orders found</td>
                </tr>
              ) : (
                filteredOrders.map((order, index) => (
                  <tr key={order.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                    <td className="p-3 text-purple-700">{order.id}</td>
                    <td className="p-3">{order.employee}</td>
                    <td className="p-3">{order.dateSold}</td>
                    <td className="p-3">{order.customer}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-white ${
                        order.type === "Walk-In" ? "bg-green-500" : "bg-yellow-500"
                      }`}>
                        {order.type}
                      </span>
                    </td>
                    <td className="p-3 text-right">₱{formatPrice(order.total)}</td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => viewOrderDetails(order)}
                        className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                      >
                        View details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
    
    {/* Create Sales Order Modal */}
    {showCreateModal && (
      <div className="fixed inset-0 flex items-center justify-center z-50" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
        <div className="bg-white rounded-lg shadow-xl w-[95%] max-w-6xl max-h-[90vh] flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Create Sales Order</h2>
              <button 
                onClick={() => {
                  setShowCreateModal(false);
                  setCart([]);
                  setSelectedCustomer("");
                  setPaymentMethod("");
                }}
                className="text-white hover:text-black"
              >
                <X className="h-6 w-6 bg-red-500 rounded" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">Sales Order ID:</label>
                <p className="font-semibold">{newOrderId}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Employee:</label>
                <p className="font-semibold">sales@pgmicro.com</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Date:</label>
                <p className="font-semibold">{new Date().toISOString().split('T')[0]}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Status:</label>
                <p className="font-semibold">{orderType}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Time:</label>
                <p className="font-semibold">
                  {new Date().toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit', 
                    hour12: true 
                  })}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Payment Method:</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="p-1 border rounded w-full"
                  required
                >
                  <option value="">Select Payment Method</option>
                  <option value="Cash">Cash</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Online Payment">Online Payment</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600 mb-1">Select Customer:</label>
              <div className="flex gap-2">
                <select
                  value={selectedCustomer}
                  onChange={(e) => setSelectedCustomer(e.target.value)}
                  className="p-2 border rounded w-full"
                  required
                >
                  <option value="">Select Customer</option>
                  {customers.map(customer => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name} - {customer.email}
                    </option>
                  ))}
                </select>
                <button
                  onClick={navigateToCustomerSales}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  title="Manage Customers"
                >
                  Manage
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex-1 overflow-hidden flex flex-col md:flex-row p-4">
            {/* Product Selection */}
            <div className="md:w-1/2 pr-0 md:pr-2 mb-4 md:mb-0">
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">Category Filter:</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="p-2 border rounded w-full"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div className="border rounded p-2 h-[420px] flex flex-col">
                <h3 className="font-semibold mb-2">Available Products:</h3>
                <div className="flex-1 overflow-y-auto">
                  {filteredProducts.length === 0 ? (
                    <p className="text-gray-500 italic text-center p-4">No products available</p>
                  ) : (
                    <div className="space-y-2">
                      {filteredProducts.map(product => (
                        product.saleStatus !== "Sold" && (
                          <div 
                            key={product.id} 
                            className="p-3 border rounded bg-white flex justify-between items-center"
                            style={{minHeight: "80px"}}
                          >
                            <div>
                              <p className="font-semibold">{product.category || "Unknown Category"}</p>
                              <p>{product.brand || "Unknown Brand"} {product.model || ""}</p>
                              <p className="text-sm">Serial: {product.serialNumber || "N/A"}</p>
                              <p>{product.sellingPrice || "Price not available"}</p>
                            </div>
                            <button
                              onClick={() => addToCart(product)}
                              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                            >
                              Add to Cart
                            </button>
                          </div>
                        )
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Shopping Cart */}
            <div className="md:w-1/2 pl-0 md:pl-2">
              <div className="border rounded flex flex-col h-[420px]">
                <h3 className="font-semibold p-2 border-b bg-gray-100">Cart:</h3>
                <div className="flex-1 overflow-y-auto">
                  {cart.length === 0 ? (
                    <p className="text-gray-500 italic text-center p-4 my-6">Your cart is empty</p>
                  ) : (
                    <table className="min-w-full">
                      <thead className="bg-gray-100 sticky top-0">
                        <tr>
                          <th className="p-2 text-left">Item ID</th>
                          <th className="p-2 text-left">Brand</th>
                          <th className="p-2 text-left">Model</th>
                          <th className="p-2 text-right">Price</th>
                          <th className="p-2 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cart.map(item => (
                          <tr key={item.id} className="border-b">
                            <td className="p-2">{item.id}</td>
                            <td className="p-2">{item.brand}</td>
                            <td className="p-2">{item.model}</td>
                            <td className="p-2 text-right">{item.sellingPrice}</td>
                            <td className="p-2 text-center">
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 w-16"
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
                <div className="bg-gray-100 p-2 border-t">
                  <div className="font-semibold text-right">
                    Total: ₱{totalAmount.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-2 border-t border-gray-200 flex justify-end space-x-3">           
            <button
              onClick={handleCreateOrder}
              disabled={!selectedCustomer || cart.length === 0 || !paymentMethod}
              className={`px-4 py-2 rounded text-white w-32 ${
                !selectedCustomer || cart.length === 0 || !paymentMethod
                  ? "bg-green-300 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              Create Order
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);
};

export default SalesOrderPage;