import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import DashboardLayout from "../../layouts/DashboardLayout";

// API endpoints and utility functions (commented out until backend is ready)
/*
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
const ENDPOINTS = {
  INVENTORY: `${API_BASE_URL}/inventory/`,
  SALES_ORDERS: `${API_BASE_URL}/sales-orders/`,
  CUSTOMERS: `${API_BASE_URL}/customers/`,
};

// Inventory API functions
const fetchInventory = async () => {
  try {
    const response = await fetch(ENDPOINTS.INVENTORY);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching inventory:", error);
    return null;
  }
};

const updateInventoryItemStatus = async (itemId, newStatus) => {
  try {
    const response = await fetch(`${ENDPOINTS.INVENTORY}${itemId}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ saleStatus: newStatus }),
    });
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`Error updating inventory item ${itemId}:`, error);
    return null;
  }
};

// Sales Order API functions
const fetchSalesOrders = async () => {
  try {
    const response = await fetch(ENDPOINTS.SALES_ORDERS);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching sales orders:", error);
    return null;
  }
};

const createSalesOrder = async (orderData) => {
  try {
    const response = await fetch(ENDPOINTS.SALES_ORDERS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error creating sales order:", error);
    return null;
  }
};

// Customer API functions
const fetchCustomers = async () => {
  try {
    const response = await fetch(ENDPOINTS.CUSTOMERS);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching customers:", error);
    return null;
  }
};

const createCustomer = async (customerData) => {
  try {
    const response = await fetch(ENDPOINTS.CUSTOMERS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customerData),
    });
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error creating customer:", error);
    return null;
  }
};

const updateCustomer = async (customerId, customerData) => {
  try {
    const response = await fetch(`${ENDPOINTS.CUSTOMERS}${customerId}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customerData),
    });
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`Error updating customer ${customerId}:`, error);
    return null;
  }
};

const deleteCustomer = async (customerId) => {
  try {
    const response = await fetch(`${ENDPOINTS.CUSTOMERS}${customerId}/`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return true;
  } catch (error) {
    console.error(`Error deleting customer ${customerId}:`, error);
    return false;
  }
};
*/

const SalesOrderPage = () => {
  const navigate = useNavigate();
  
  //---------------------------------------------
  // STATE MANAGEMENT
  //---------------------------------------------
  
  // Sales order management states
  const [salesOrders, setSalesOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
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
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    address: '',
    phone: '',
    type: 'Walk-In'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingCustomerId, setEditingCustomerId] = useState(null);
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
  const saveCustomersToLocalStorage = (customers) => {
    localStorage.setItem('customersData', JSON.stringify(customers));
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

  // Update inventory item status
  const updateInventoryStatus = async (productId, newStatus) => {
    console.log(`Updating product status: ID=${productId}, Status=${newStatus}`);
    
    /* 
    // When API is ready, uncomment this section
    try {
      const updatedItem = await updateInventoryItemStatus(productId, newStatus);
      if (updatedItem) {
        // Refresh inventory data after update
        loadInventoryData();
        return true;
      }
      return false;
    } catch (error) {
      console.error(`Error updating product ${productId} status:`, error);
      return false;
    }
    */
    
    // For now, update in localStorage
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
  
  // Load customer data
  useEffect(() => {
    loadCustomerData();
  }, []);
  
  // Function to load customer data
  const loadCustomerData = () => {
    /* 
    // When API is ready, uncomment this section
    fetchCustomers().then(customersData => {
      if (customersData) {
        setCustomers(customersData);
      } else {
        // Keep using local customer data if API fails
        console.warn("Failed to load customers from API, using local data");
      }
    }).catch(error => {
      console.error("Error loading customers from API:", error);
    });
    */
    
    // For now, continue using the local customer data
    // It's already initialized in the state
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
        doc.text("Item", 20, 107);
        doc.text("Brand/Model", 70, 107);
        doc.text("Serial Number", 130, 107);
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
            doc.text(item.category || "Unknown", 20, yPos);
            doc.text(`${item.brand || ""} ${item.model || ""}`, 70, yPos);
            doc.text(item.serialNumber || "N/A", 130, yPos);
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
  // CUSTOMER MANAGEMENT FUNCTIONS
  //---------------------------------------------
  
  // Add or update customer
  const handleAddCustomer = () => {
    if (!newCustomer.name || !newCustomer.email) {
      alert("Customer name and email are required");
      return;
    }
    
    if (isEditing) {
      /* 
      // When API is ready, uncomment this section
      updateCustomer(editingCustomerId, newCustomer).then(updatedCustomer => {
        if (updatedCustomer) {
          // Refresh customer list
          loadCustomerData();
          
          setIsEditing(false);
          setEditingCustomerId(null);
          alert("Customer updated successfully!");
        } else {
          alert("Failed to update customer. Please try again.");
        }
      }).catch(error => {
        console.error("Error updating customer:", error);
        alert(`Failed to update customer: ${error.message}`);
      });
      */
      
      // For now, update in local state
      const updatedCustomers = customers.map(customer => 
        customer.id === editingCustomerId ? { ...newCustomer, id: editingCustomerId } : customer
      );
      setCustomers(updatedCustomers);
      // Save to localStorage for persistence
      localStorage.setItem('customersData', JSON.stringify(updatedCustomers));
      setIsEditing(false);
      setEditingCustomerId(null);
      alert("Customer updated successfully!");
    } else {
      /* 
      // When API is ready, uncomment this section
      createCustomer(newCustomer).then(createdCustomer => {
        if (createdCustomer) {
          // Refresh customer list
          loadCustomerData();
          
          alert("Customer added successfully!");
        } else {
          alert("Failed to add customer. Please try again.");
        }
      }).catch(error => {
        console.error("Error creating customer:", error);
        alert(`Failed to add customer: ${error.message}`);
      });
      */
      
      // For now, add to local state
      const newCustomerId = customers.length > 0 
        ? Math.max(...customers.map(c => c.id)) + 1 
        : 1;
        
      const updatedCustomers = [...customers, {
        ...newCustomer,
        id: newCustomerId
      }];
      setCustomers(updatedCustomers);
      // Save to localStorage for persistence
      localStorage.setItem('customersData', JSON.stringify(updatedCustomers));
      alert("Customer added successfully!");
    }
    
    // Reset form
    setNewCustomer({
      name: '',
      email: '',
      address: '',
      phone: '',
      type: 'Walk-In'
    });
  };

  // Edit customer
  const handleEditCustomer = (customerId) => {
    const customerToEdit = customers.find(c => c.id === customerId);
    if (customerToEdit) {
      setNewCustomer({...customerToEdit});
      setIsEditing(true);
      setEditingCustomerId(customerId);
    }
  };

  // Delete customer
  const handleDeleteCustomer = (customerId) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      /* 
      // When API is ready, uncomment this section
      deleteCustomer(customerId).then(success => {
        if (success) {
          // Refresh customer list
          loadCustomerData();
          
          if (isEditing && editingCustomerId === customerId) {
            resetCustomerForm();
          }
          
          alert("Customer deleted successfully!");
        } else {
          alert("Failed to delete customer. Please try again.");
        }
      }).catch(error => {
        console.error("Error deleting customer:", error);
        alert(`Failed to delete customer: ${error.message}`);
      });
      */
      
      // For now, delete from local state
      const updatedCustomers = customers.filter(c => c.id !== customerId);
      setCustomers(updatedCustomers);
      // Save to localStorage for persistence
      localStorage.setItem('customersData', JSON.stringify(updatedCustomers));
      
      if (isEditing && editingCustomerId === customerId) {
        resetCustomerForm();
      }
    }
  };
  
  // Reset customer form
  const resetCustomerForm = () => {
    setNewCustomer({
      name: '',
      email: '',
      address: '',
      phone: '',
      type: 'Walk-In'
    });
    setIsEditing(false);
    setEditingCustomerId(null);
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
      
      /* 
      // When API is ready, uncomment this section
      // Create the order in the backend
      const createdOrder = await createSalesOrder(newOrder);
      if (!createdOrder) {
        throw new Error("Failed to save order to server");
      }
        // Mark items as sold in inventory via API
      const inventoryUpdates = [];
      for (const item of cart) {
        inventoryUpdates.push(updateInventoryItemStatus(item.id, "Sold"));
      }
      
      await Promise.all(inventoryUpdates);
      
      // Refresh orders and inventory from server
      loadSalesOrdersData();
      loadInventoryData();
      */
      
      // For now, mark items as sold in localStorage inventory
      for (const item of cart) {
        const updated = await updateInventoryStatus(item.id, "Sold");
        console.log(`Updated item ${item.id} status:`, updated ? "Success" : "Failed");
      }
      
      // Add the new order to the sales orders list
      const updatedOrders = [...salesOrders, newOrder];
      setSalesOrders(updatedOrders);
      
      // Save to localStorage so orders persist after refresh
      saveOrdersToLocalStorage(updatedOrders);
      
      // Immediately open the invoice in a new window
      const pdfWindow = window.open("", "_blank");
      if (pdfWindow) {
        pdfWindow.document.write(
          `<iframe width="100%" height="100%" src="${invoiceUrl}"></iframe>`
        );
      } else {
        alert("Pop-up blocked. Please allow pop-ups to view the invoice.");
      }
      
      // Reset the form
      setCart([]);
      setSelectedCustomer("");
      setPaymentMethod("");
      setShowCreateModal(false);
      
      // Generate next order ID
      const nextOrderNumber = parseInt(newOrderId.replace("#SO", "")) + 1;
      setNewOrderId(`#SO${nextOrderNumber}`);
      
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
    loadCustomerData();
    setTimeout(() => setIsLoading(false), 500); // Add a small delay for UX
  };

  //---------------------------------------------
  // RENDER UI
  //---------------------------------------------
  
  return (
    <DashboardLayout>
      <div className="p-4 bg-white min-h-screen">
        {/* Header and controls section */}
        <div className="bg-white p-4 rounded-lg mb-4 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-purple-800">Issued Sale Orders</h1>
            
            {/* Add refresh button */}
            <button 
              onClick={handleRefreshData} 
              className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 flex items-center"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Refresh Data"}
            </button>
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
            
            <button 
              onClick={() => setShowCustomerModal(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              View Customers
            </button>
            
            <button 
              onClick={() => setShowCreateModal(true)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              + Create SO
            </button>
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
      </div>
      
      {/* Customer List Modal */}
      {showCustomerModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{backgroundColor: 'rgba(0,0,0,0.05)'}}>
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-4xl h-[650px] flex flex-col shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-purple-800">Customer List</h2>
              <button 
                onClick={() => {
                  setShowCustomerModal(false);
                  resetCustomerForm();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="bg-white rounded-lg mb-6 overflow-auto shadow-md flex-grow">
              <table className="min-w-full">
              <thead className="bg-gray-100 sticky top-0">
                  <tr>
                    <th className="p-3 text-left">Customer ID</th>
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Type</th>
                    <th className="p-3 text-left">Address</th>
                    <th className="p-3 text-left">Email</th>
                    <th className="p-3 text-left">Contact Number</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="p-4 text-center text-gray-500">No customers found</td>
                    </tr>
                  ) : (
                    customers.map((customer) => (
                      <tr key={customer.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">{customer.id}</td>
                        <td className="p-3 font-medium">{customer.name}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-white ${
                            customer.type === "Walk-In" ? "bg-green-500" : "bg-yellow-500"
                          }`}>
                            {customer.type}
                          </span>
                        </td>
                        <td className="p-3">{customer.address}</td>
                        <td className="p-3">{customer.email}</td>
                        <td className="p-3">{customer.phone}</td>
                        <td className="p-3 text-center">
                          <div className="flex justify-center space-x-2">
                            <button 
                              onClick={() => handleEditCustomer(customer.id)}
                              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 w-16"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDeleteCustomer(customer.id)}
                              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 w-16"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold mb-3 text-purple-800">
                {isEditing ? "Edit Customer" : "New Customer"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                  <input
                    type="text"
                    placeholder="Customer Name"
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                    className="p-2 border rounded w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer Type</label>
                  <select
                    value={newCustomer.type}
                    onChange={(e) => setNewCustomer({...newCustomer, type: e.target.value})}
                    className="p-2 border rounded w-full"
                  >
                    <option value="Walk-In">Walk-In</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    placeholder="Customer Address"
                    value={newCustomer.address}
                    onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
                    className="p-2 border rounded w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="Customer Email"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                    className="p-2 border rounded w-full"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                  <input
                    type="text"
                    placeholder="Contact Number"
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                    className="p-2 border rounded w-full"
                  />
                </div>
              </div>
              
              <div className="flex justify-between">
                <button
                  onClick={resetCustomerForm}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 w-24"
                >
                  Clear
                </button>
                
                <button
                  onClick={handleAddCustomer}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-auto min-w-[120px]"
                >
                  {isEditing ? "Update Customer" : "Add Customer"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Create Sales Order Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{backgroundColor: 'rgba(0,0,0,0.05)'}}>
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
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
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
                  <select
                    value={orderType}
                    onChange={(e) => setOrderType(e.target.value)}
                    className="p-1 border rounded w-full"
                  >
                    <option value="Walk-In">Walk-In</option>
                    <option value="Contract">Contract</option>
                  </select>
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
                              style={{minHeight: "80px"}}>
                              <div>
                                {/* Log for debugging */}
                                {console.log("Rendering product:", product)}
                                <p className="font-semibold">{product.category || "Unknown Category"}</p>
                                <p>{product.brand || "Unknown Brand"} {product.model || ""}</p>
                                <p className="text-sm">Serial: {product.serialNumber || "N/A"}</p>
                                <p>{product.sellingPrice || "Price not available"}</p>
                              </div>
                              <button
                                onClick={() => addToCart(product)}
                                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
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
                            <th className="p-2 text-left">Item</th>
                            <th className="p-2 text-left">Brand</th>
                            <th className="p-2 text-left">Model</th>
                            <th className="p-2 text-right">Price</th>
                            <th className="p-2 text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cart.map(item => (
                            <tr key={item.id} className="border-b">
                              <td className="p-2">{item.category}</td>
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
            
            <div className="p-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setCart([]);
                  setSelectedCustomer("");
                  setPaymentMethod("");
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 w-24"
              >
                Cancel
              </button>
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
    </DashboardLayout>
  );
};

export default SalesOrderPage;