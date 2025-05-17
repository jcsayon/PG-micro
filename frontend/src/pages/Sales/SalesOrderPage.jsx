import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import DashboardLayout from "../../layouts/DashboardLayout";
import { X, RefreshCw, Plus } from "lucide-react";

const CUSTOMER_API     = "http://localhost:8000/api/customers/";
const SALES_ORDERS_API = "http://127.0.0.1:8000/api/api/orders/";
const PRODUCTS_API     = "http://localhost:8000/api/products/";

const SalesOrderPage = () => {
  const navigate = useNavigate();

  // ─── STATE ─────────────────────────────────────────────────────────────
  const [salesOrders,      setSalesOrders]      = useState([]);
  const [customers,        setCustomers]        = useState([]);
  const [availableProducts,setAvailableProducts]= useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [newOrderId,       setNewOrderId]       = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [orderType,        setOrderType]        = useState("Walk-In");
  const [paymentMethod,    setPaymentMethod]    = useState("");
  const [referenceNumber,  setReferenceNumber]  = useState("");
  const [cardLastFour,     setCardLastFour]     = useState("");
  const [bankName,         setBankName]         = useState("");
  const [cart,             setCart]             = useState([]);
  const [totalAmount,      setTotalAmount]      = useState(0);

  const [categoryFilter,   setCategoryFilter]   = useState("All");
  const [filterType,       setFilterType]       = useState("All");
  const [searchTerm,       setSearchTerm]       = useState("");

  const [showCreateModal,  setShowCreateModal]  = useState(false);
  const [isLoading,        setIsLoading]        = useState(false);

  // ─── FETCH CUSTOMERS ────────────────────────────────────────────────────
  useEffect(() => {
    fetch(CUSTOMER_API, { credentials: "include" })
      .then(r => { if (!r.ok) throw new Error(r.statusText); return r.json(); })
      .then(setCustomers)
      .catch(console.error);
  }, []);

  // auto‐set orderType when customer changes
  useEffect(() => {
    const c = customers.find(c => c.id === +selectedCustomer);
    if (c) setOrderType(c.type);
  }, [selectedCustomer, customers]);

  // ─── FETCH PRODUCTS ─────────────────────────────────────────────────────
  const loadProducts = () => {
    fetch(PRODUCTS_API, { credentials: "include" })
      .then(r => { if (!r.ok) throw r; return r.json(); })
      .then(data => {
        const avail = data.filter(p => p.sale_status !== "Sold" && p.sale_status !== "Damaged");
        setAvailableProducts(avail);
      })
      .catch(console.error);
  };
  useEffect(loadProducts, []);

  // ─── FETCH SALES ORDERS ─────────────────────────────────────────────────
  const loadSales = () => {
    setIsLoading(true);
    fetch(SALES_ORDERS_API, { credentials: "include" })
      .then(r => { if (!r.ok) throw new Error(r.statusText); return r.json(); })
      .then(data => {
        setSalesOrders(data);
        // compute next #SO
        const maxNum = data
          .map(o => {
            if (typeof o.id === "number") return o.id;
            const s = String(o.id).replace(/^#SO/, "");
            const n = parseInt(s, 10);
            return isNaN(n) ? 0 : n;
          })
          .reduce((a,b)=>Math.max(a,b), 1000);
        setNewOrderId(`#SO${maxNum+1}`);
      })
      .catch(console.error)
      .finally(()=>setIsLoading(false));
  };
  useEffect(loadSales, []);

  // ─── CART & TOTAL ───────────────────────────────────────────────────────
  useEffect(() => {
    setTotalAmount(
      cart.reduce((sum, i) => sum + parseFloat(i.selling_price||0), 0)
    );
  }, [cart]);

  // ─── HELPERS ────────────────────────────────────────────────────────────
  const formatPrice = price => {
    const n = price == null ? 0 : parseFloat(price)||0;
    return n.toLocaleString("en-PH", { minimumFractionDigits:2 });
  };

  const categories = ["All", ...new Set(availableProducts.map(p=>p.category))];
  const filteredProducts =
    categoryFilter==="All"
      ? availableProducts
      : availableProducts.filter(p=>p.category===categoryFilter);

  const filteredOrders = salesOrders.filter(o => {
    const byType = filterType==="All" || o.type===filterType;
    const term = searchTerm.toLowerCase();
    const bySearch = !term
      || String(o.id).toLowerCase().includes(term)
      || (customers.find(c=>c.id===o.customer)?.name||"").toLowerCase().includes(term)
      || o.date_sold.includes(term);
    return byType && bySearch;
  });

  // ─── PDF GENERATION ─────────────────────────────────────────────────────
  const generateInvoice = order => new Promise(resolve => {
    try {
      const doc = new jsPDF();
      // header
      doc.setFillColor(48,44,122); doc.rect(0,0,210,25,"F");
      doc.setTextColor(255,255,255).setFontSize(22).setFont("helvetica","bold");
      doc.text("PG Micro World",15,17);
      doc.setFontSize(14).setFont("helvetica","normal");
      doc.text("Invoice",180,17).setTextColor(0,0,0);

      // company block
      doc.setFontSize(10);
      doc.text("PG Micro World Inc.",15,35);
      doc.text("123 Tech Plaza, Makati City",15,40);
      doc.text("Philippines, 1200",15,45);
      doc.text("Tel: +63 2 8123 4567",15,50);
      doc.text("Email: info@pgmicro.com",15,55);

      // details box
      doc.setDrawColor(220,220,220).setFillColor(245,245,245);
      doc.roundedRect(120,30,75,40,2,2,"FD");
      doc.setFontSize(12).setFont("helvetica","bold");
      doc.text("INVOICE",145,38);
      doc.setFontSize(10).setFont("helvetica","normal");
      doc.text(`#${order.id}`,125,45);
      doc.text(`Date: ${order.date_sold}`,125,50);
      doc.text(`Pay: ${order.payment_method}`,125,55);
      doc.text(`Type: ${order.type}`,125,60);

      // customer box
      const cust = customers.find(c=>c.id===order.customer) || {};
      doc.setFillColor(240,242,245);
      doc.roundedRect(15,65,180,30,2,2,"FD");
      doc.setFontSize(11).setFont("helvetica","bold");
      doc.text("Customer Information",20,73);
      doc.setFontSize(10).setFont("helvetica","normal");
      doc.text(`Name: ${cust.name||""}`,20,80);
      doc.text(`Email: ${cust.email||""}`,120,80);
      doc.text(`Phone: ${cust.phone||""}`,120,85);

      // items header
      doc.setFillColor(240,236,255);
      doc.rect(15,100,180,10,"F");
      doc.setDrawColor(200,200,200).line(15,100,195,100);
      doc.setFont("helvetica","bold");
      doc.text("Item ID",20,107);
      doc.text("Brand/Model",80,107);
      doc.text("Price",180,107,{align:"right"});
      doc.line(15,110,195,110);

      // items rows
      let y=120;
      order.items.forEach((it,i)=>{
        if(i%2===0) {
          doc.setFillColor(248,248,252).rect(15,y-6,180,14,"F");
        }
        doc.setFont("helvetica","normal");
        doc.text(String(it.id),20,y);
        doc.text(`${it.brand||""} ${it.model||""}`,80,y);
        doc.text(`₱${formatPrice(it.selling_price)}`,180,y,{align:"right"});
        doc.setDrawColor(240,240,240).line(15,y+4,195,y+4);
        y+=15;
      });

      // total
      y+=5;
      doc.setDrawColor(180,180,180).line(15,y,195,y);
      doc.setFont("helvetica","bold");
      doc.text("Total:",150,y+10);
      doc.text(`₱${formatPrice(order.total)}`,180,y+10,{align:"right"});

      // footer
      doc.setDrawColor(200,200,200).line(15,250,195,250);
      doc.setFontSize(9).setFont("helvetica","italic").setTextColor(80,80,80);
      doc.text("Valid without signature",105,265,{align:"center"});
      doc.text(`Page 1 of 1`,180,280);

      resolve(doc.output("datauristring"));
    } catch(e) {
      console.error(e);
      const f = new jsPDF();
      f.text("Invoice failed: "+e.message,20,20);
      resolve(f.output("datauristring"));
    }
  });

  // ─── PAYMENT DETAILS FIELDS ─────────────────────────────────────────────
  const renderPaymentDetailsFields = () => {
    if (!paymentMethod || paymentMethod==="Cash") return null;
    if (paymentMethod==="Credit Card" || paymentMethod==="Debit Card") {
      return (
        <div className="flex gap-2">
          <input
            type="text"
            value={referenceNumber}
            onChange={e=>setReferenceNumber(e.target.value)}
            placeholder="Ref #"
            className="border p-1 flex-1"
            required
          />
          <input
            type="text"
            value={cardLastFour}
            onChange={e=>setCardLastFour(e.target.value.replace(/\D/g,"").slice(0,4))}
            placeholder="Last 4"
            className="border p-1 w-20"
            required
          />
        </div>
      );
    }
    // Bank Transfer or Cheque
    return (
      <div className="flex gap-2">
        <input
          type="text"
          value={referenceNumber}
          onChange={e=>setReferenceNumber(e.target.value)}
          placeholder="Ref # / Cheque #"
          className="border p-1 flex-1"
          required
        />
        <input
          type="text"
          value={bankName}
          onChange={e=>setBankName(e.target.value)}
          placeholder="Bank"
          className="border p-1 flex-1"
          required
        />
      </div>
    );
  };

  // ─── CREATE ORDER ────────────────────────────────────────────────────────
  const handleCreateOrder = async () => {
    if (!selectedCustomer || !paymentMethod || cart.length===0) {
      return alert("Fill all required fields and add ≥1 item");
    }

    const paymentDetails = {};
    if (referenceNumber) paymentDetails.referenceNumber = referenceNumber;
    if (cardLastFour)     paymentDetails.cardLastFour = cardLastFour;
    if (bankName)         paymentDetails.bankName = bankName;

    const payload = {
      id:             newOrderId,
      employee:       "sales@pgmicro.com",
      date_sold:      new Date().toISOString().slice(0,10),
      customer:       +selectedCustomer,
      type:           orderType,
      total:          totalAmount,
      payment_method: paymentMethod,
      payment_details: paymentDetails,
      items:          cart.map(i=>({
                        product:       i.id,
                        quantity:      1,
                        selling_price: i.selling_price
                      }))
    };

    try {
      // POST order
      const res = await fetch(SALES_ORDERS_API, {
        method:      "POST",
        credentials: "include",
        headers:     { "Content-Type":"application/json" },
        body:        JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(await res.text());
      const saved = await res.json();

      // PATCH each product
      await Promise.all(cart.map(p =>
        fetch(`${PRODUCTS_API}${p.id}/`, {
          method:  "PATCH",
          headers: { "Content-Type":"application/json" },
          body:    JSON.stringify({ sale_status:"Sold" })
        })
      ));

      // invoice
      const url = await generateInvoice({
        ...payload,
        date_sold: payload.date_sold
      });
      window.open("").document.write(
        `<iframe width="100%" height="100%" src="${url}"></iframe>`
      );

      // update UI
      setSalesOrders(so=>[...so, saved]);
      setCart([]);
      setSelectedCustomer("");
      setPaymentMethod("");
      setReferenceNumber("");
      setCardLastFour("");
      setBankName("");
      setShowCreateModal(false);

      // next ID
      const n = parseInt(newOrderId.replace("#SO",""),10)||0;
      setNewOrderId(`#SO${n+1}`);

      alert("Order created!");
    } catch(err) {
      console.error(err);
      alert("Failed to create order: "+err.message);
    }
  };

  // ─── VIEW INVOICE ────────────────────────────────────────────────────────
  const viewOrder = order => {
    generateInvoice({
      ...order,
      date_sold: order.date_sold,
      payment_method: order.payment_method
    }).then(url => {
      window.open("").document.write(
        `<iframe width="100%" height="100%" src="${url}"></iframe>`
      );
    });
  };

  // ─── REFRESH ─────────────────────────────────────────────────────────────
  const handleRefresh = () => {
    setIsLoading(true);
    loadSales();
    loadProducts();
    setTimeout(()=>setIsLoading(false),500);
  };

 // ─── RENDER ─────────────────────────────────────────────────────────────
 return (
  <DashboardLayout>
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-purple-800">Issued Sale Orders</h1>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <select
              className="pl-3 pr-8 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              value={filterType}
              onChange={e=>setFilterType(e.target.value)}
            >
              <option>All</option>
              <option>Walk-In</option>
              <option>Contract</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
          <div className="relative flex-grow max-w-md">
            <input
              className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Search by SO ID or customer..."
              value={searchTerm}
              onChange={e=>setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center justify-center px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors text-white font-medium disabled:opacity-70"
          >
            <RefreshCw className="w-4 h-4 mr-2" /> 
            {isLoading ? "Refreshing..." : "Refresh"}
          </button>
          <button
            onClick={()=>setShowCreateForm(!showCreateForm)}
            className={`flex items-center justify-center px-4 py-2 rounded-lg ${
              showCreateForm ? "bg-gray-600 hover:bg-gray-700" : "bg-green-600 hover:bg-green-700"
            } transition-colors text-white font-medium`}
          >
            {showCreateForm ? (
              <>
                <X className="w-4 h-4 mr-2" />Cancel
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />Create SO
              </>
            )}
          </button>
        </div>
      </div>

      {/* Create Order Form */}
      {showCreateForm && (
        <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-purple-50 px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-purple-800">Create New Sales Order</h2>
          </div>

          <div className="p-6">
            {/* Order Info Row */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-3">
                <label className="block text-xs font-medium text-gray-500 mb-1">SO ID</label>
                <div className="font-mono text-gray-800">{newOrderId}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <label className="block text-xs font-medium text-gray-500 mb-1">Employee</label>
                <div className="text-gray-800">sales@pgmicro.com</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <label className="block text-xs font-medium text-gray-500 mb-1">Date</label>
                <div className="text-gray-800">{new Date().toISOString().slice(0,10)}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
                <div className="text-gray-800">{orderType}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <label className="block text-xs font-medium text-gray-500 mb-1">Time</label>
                <div className="text-gray-800">
                  {new Date().toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"})}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Customer</label>
                <select
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
                  value={selectedCustomer}
                  onChange={e=>setSelectedCustomer(e.target.value)}
                  required
                >
                  <option value="">Select customer...</option>
                  {customers.map(c=>(
                    <option key={c.id} value={c.id}>
                      {typeof c.name === "string" ? c.name : JSON.stringify(c.name)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Payment Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="col-span-1 md:col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">Payment Method</label>
                <select
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
                  value={paymentMethod}
                  onChange={e=>setPaymentMethod(e.target.value)}
                  required
                >
                  <option value="">Select payment method...</option>
                  <option>Cash</option>
                  <option>Credit Card</option>
                  <option>Debit Card</option>
                  <option>Bank Transfer</option>
                  <option>Cheque</option>
                </select>
              </div>
              <div className="col-span-1 md:col-span-2">
                {renderPaymentDetailsFields()}
              </div>
            </div>

            {/* Main Body: Products & Cart */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Products */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-800">Available Products</h3>
                  <div className="relative">
                    <select
                      className="pl-3 pr-8 py-1 text-sm rounded-md border border-gray-300 bg-white text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      value={categoryFilter}
                      onChange={e=>setCategoryFilter(e.target.value)}
                    >
                      {categories.map(cat=>(
                        <option key={cat} value={cat}>{cat}</option>
                     ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="h-64 overflow-auto border border-gray-200 rounded-lg bg-white shadow-sm">
                  {filteredProducts.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500 p-4">
                      <svg className="w-12 h-12 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"></path>
                      </svg>
                      <p>No products in this category</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-200">
                      {filteredProducts.map(p=>(
                        <div
                          key={p.id}
                          className="flex justify-between items-center p-3 hover:bg-gray-50"
                        >
                          <div>
                            <div className="font-medium text-gray-800">{p.brand} {p.model}</div>
                            <div className="text-sm text-green-600 font-medium">₱{formatPrice(p.selling_price)}</div>
                          </div>
                          <button
                            onClick={()=>setCart(c=>[...c,p])}
                            className="flex items-center px-2 py-1 text-sm rounded-md bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors"
                          >
                            <Plus className="w-4 h-4 mr-1" /> Add
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Cart */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium text-gray-800">Shopping Cart</h3>
                  <div className="text-green-600 font-medium">₱{formatPrice(totalAmount)}</div>
                </div>
                <div className="h-64 border border-gray-200 rounded-lg bg-white shadow-sm overflow-auto p-3">
                  {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500">
                      <svg className="w-12 h-12 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                      </svg>
                      <p>Your cart is empty</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {cart.map((item, index) => (
                        <div 
                          key={`${item.id}-${index}`} 
                          className="flex justify-between items-center p-2 rounded-md bg-gray-50 border border-gray-100"
                        >
                          <div>
                            <div className="font-medium text-gray-800">{item.brand} {item.model}</div>
                            <div className="text-sm text-gray-500">₱{formatPrice(item.selling_price)}</div>
                          </div>
                          <button
                            onClick={()=>setCart(c=>c.filter((_, i)=>i!==index))}
                            className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
              <button
                onClick={()=>setShowCreateForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateOrder}
                disabled={!selectedCustomer || !paymentMethod || !cart.length}
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Orders Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
        <table className="min-w-full bg-white divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SO ID</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.length===0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                  <svg className="mx-auto w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <p className="mt-2 font-medium">No orders found</p>
                  <p className="text-sm">Try adjusting your search or filter criteria</p>
                </td>
              </tr>
            ) : (
              filteredOrders.map((o,i)=>(
                <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-purple-700">{o.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{o.employee}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{o.date_sold}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    {customers.find(c=>c.id===o.customer)?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      o.type === 'Walk-In' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {o.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                    ₱{formatPrice(o.total)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={()=>viewOrder(o)}
                      className="inline-flex items-center px-3 py-1.5 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors font-medium text-sm"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  </DashboardLayout>
);

};

export default SalesOrderPage;
