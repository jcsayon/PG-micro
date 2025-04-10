import React, { useState } from 'react';
import ModuleLayout from '../../layouts/ModuleLayout';
import { ShoppingCart, Package, Calendar, User, MapPin, Phone, Trash2, Plus, Search, ChevronRight, UserPlus } from 'lucide-react';

const allCategories = [
  'Processor', 'Motherboards', 'Video Cards', 'Monitors', 'Laptops',
  'Printers', 'Toners', 'Inks', 'Networking', 'DSLR Camera',
  'CCTV Camera', 'Keyboard & Mouse', 'Webcam', 'Power Supply', 'Thin Client'
];

const dummyInventory = {
  Laptops: [
    { id: 1, name: 'ACER Aspire 5', price: 32000, serial: 'SN-ACER-001', image: 'https://via.placeholder.com/100' },
    { id: 2, name: 'HP Pavilion 14', price: 28000, serial: 'SN-HP-002', image: 'https://via.placeholder.com/100' },
    { id: 3, name: 'LENOVO IdeaPad 3', price: 30000, serial: 'SN-LENOVO-003', image: 'https://via.placeholder.com/100' },
    { id: 4, name: 'ASUS VivoBook', price: 31000, serial: 'SN-ASUS-004', image: 'https://via.placeholder.com/100' },
    { id: 5, name: 'DELL Inspiron', price: 29000, serial: 'SN-DELL-005', image: 'https://via.placeholder.com/100' },
  ],
  Monitors: [
    { id: 6, name: 'Samsung 24" Curved', price: 10500, image: 'https://via.placeholder.com/100' },
    { id: 7, name: 'LG UltraGear', price: 14500, image: 'https://via.placeholder.com/100' },
    { id: 8, name: 'AOC 22B1HS', price: 7000, image: 'https://via.placeholder.com/100' },
    { id: 9, name: 'Philips 242E1GSJ', price: 9500, image: 'https://via.placeholder.com/100' },
  ],
  Printers: [
    { id: 10, name: 'EPSON EcoTank L3250', price: 9500, image: 'https://via.placeholder.com/100' },
    { id: 11, name: 'Canon Pixma G3000', price: 8200, image: 'https://via.placeholder.com/100' },
    { id: 12, name: 'HP DeskJet 2332', price: 5000, image: 'https://via.placeholder.com/100' },
    { id: 13, name: 'Brother HL-L2320D', price: 7900, image: 'https://via.placeholder.com/100' },
  ],
  Processor: [
    { id: 14, name: 'Intel Core i5-12400', price: 12000, image: '/intel core i5 12400.jpg' },
    { id: 15, name: 'AMD Ryzen 5 5600X', price: 11000, image: 'https://via.placeholder.com/100' },
    { id: 16, name: 'Intel Core i7-12700K', price: 18000, image: 'https://via.placeholder.com/100' },
    { id: 17, name: 'AMD Ryzen 7 5800X', price: 16000, image: 'https://via.placeholder.com/100' },
  ],
  Motherboards: [
    { id: 18, name: 'ASUS Prime B450M', price: 4800, image: 'https://via.placeholder.com/100' },
    { id: 19, name: 'MSI B550 Tomahawk', price: 8600, image: 'https://via.placeholder.com/100' },
    { id: 20, name: 'Gigabyte A520M', price: 3800, image: 'https://via.placeholder.com/100' },
  ],
  'Video Cards': [
    { id: 21, name: 'NVIDIA RTX 3060', price: 22000, image: 'https://via.placeholder.com/100' },
    { id: 22, name: 'AMD RX 6600', price: 19000, image: 'https://via.placeholder.com/100' },
    { id: 23, name: 'GTX 1660 Super', price: 15000, image: 'https://via.placeholder.com/100' },
  ],
  Toners: [
    { id: 24, name: 'HP 12A', price: 1200, image: 'https://via.placeholder.com/100' },
    { id: 25, name: 'Brother TN-1000', price: 1400, image: 'https://via.placeholder.com/100' },
  ],
  Inks: [
    { id: 26, name: 'Canon GI-71', price: 400, image: 'https://via.placeholder.com/100' },
    { id: 27, name: 'Epson 003 Ink', price: 500, image: 'https://via.placeholder.com/100' },
  ],
  Networking: [
    { id: 28, name: 'TP-Link TL-WR840N', price: 800, image: 'https://via.placeholder.com/100' },
    { id: 29, name: 'D-Link DIR-615', price: 1000, image: 'https://via.placeholder.com/100' },
  ],
  'DSLR Camera': [
    { id: 30, name: 'Canon EOS 1500D', price: 24000, image: 'https://via.placeholder.com/100' },
    { id: 31, name: 'Sony Alpha a6000', price: 28000, image: 'https://via.placeholder.com/100' },
  ],
  'CCTV Camera': [
    { id: 32, name: 'Hikvision Dome Camera', price: 2200, image: 'https://via.placeholder.com/100' },
    { id: 33, name: 'Dahua Bullet Camera', price: 2500, image: 'https://via.placeholder.com/100' },
  ],
  'Keyboard & Mouse': [
    { id: 34, name: 'Logitech MK270', price: 1400, image: 'https://via.placeholder.com/100' },
    { id: 35, name: 'A4Tech Wired Combo', price: 1200, image: 'https://via.placeholder.com/100' },
  ],
  Webcam: [
    { id: 36, name: 'A4Tech PK-910H', price: 1500, image: 'https://via.placeholder.com/100' },
    { id: 37, name: 'Logitech C920', price: 3000, image: 'https://via.placeholder.com/100' },
  ],
  'Power Supply': [
    { id: 38, name: 'Corsair CV550', price: 2800, image: 'https://via.placeholder.com/100' },
    { id: 39, name: 'Seasonic S12III', price: 3500, image: 'https://via.placeholder.com/100' },
  ],
  'Thin Client': [
    { id: 40, name: 'NComputing RX300', price: 4500, image: 'https://via.placeholder.com/100' },
    { id: 41, name: 'HP t530 Thin Client', price: 6500, image: 'https://via.placeholder.com/100' },
  ],
};

// Mock customer data
const dummyCustomers = [
  { id: 1, name: 'John Doe', email: 'john.doe@example.com', phone: '+63 912 345 6789', address: '123 Main St, Manila', company: 'ABC Corporation', type: 'Regular' },
  { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', phone: '+63 945 678 1234', address: '456 Oak Ave, Quezon City', company: 'XYZ Enterprises', type: 'VIP' },
  { id: 3, name: 'Michael Johnson', email: 'michael.j@example.com', phone: '+63 918 765 4321', address: '789 Pine Rd, Makati', company: 'Johnson Trading', type: 'Regular' },
  { id: 4, name: 'Sarah Williams', email: 'sarah.w@example.com', phone: '+63 927 654 3210', address: '321 Cedar Ln, Pasig', company: 'Williams Inc.', type: 'VIP' },
  { id: 5, name: 'Robert Garcia', email: 'robert.g@example.com', phone: '+63 939 123 4567', address: '654 Maple Dr, Taguig', company: 'Garcia Holdings', type: 'Regular' },
];

const CategoryButton = ({ category, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
      isActive 
        ? 'bg-indigo-600 text-white shadow-md' 
        : 'bg-white text-gray-700 hover:bg-gray-100'
    }`}
  >
    {category}
  </button>
);

const ProductCard = ({ product, category, onAddToCart }) => (
  <div className="bg-white rounded-xl overflow-hidden shadow-md transition-all duration-200 hover:shadow-lg">
    <div className="h-32 bg-gray-100 flex items-center justify-center">
      <img src={product.image} alt={product.name} className="h-24 w-24 object-contain" />
    </div>
    <div className="p-4">
      <span className="text-xs text-indigo-600 font-medium">{category}</span>
      <h3 className="font-semibold text-gray-800 mb-1">{product.name}</h3>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs text-gray-500">SN: {product.serial}</p>
          <p className="text-indigo-700 font-bold">₱{product.price.toLocaleString()}</p>
        </div>
        <button
          onClick={() => onAddToCart(product)}
          className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 p-2 rounded-full transition-colors"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  </div>
);

const CartItem = ({ item, onRemove, onUpdateQuantity }) => (
  <div className="flex items-center p-3 bg-white rounded-lg shadow-sm border border-gray-100">
    <img src={item.image} alt={item.name} className="w-12 h-12 rounded object-contain bg-gray-50" />
    <div className="ml-3 flex-1">
      <h4 className="font-medium text-gray-800 text-sm">{item.name}</h4>
      <p className="text-xs text-gray-500">SN: {item.serial}</p>
    </div>
    <div className="flex items-center gap-3">
      <div className="flex items-center">
        <button 
          onClick={() => onUpdateQuantity(item.id, (item.quantity || 1) - 1)}
          className="w-6 h-6 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded"
        >
          -
        </button>
        <span className="mx-2 text-sm font-medium w-6 text-center">{item.quantity || 1}</span>
        <button 
          onClick={() => onUpdateQuantity(item.id, (item.quantity || 1) + 1)}
          className="w-6 h-6 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded"
        >
          +
        </button>
      </div>
      <span className="font-semibold text-sm text-indigo-700">₱{((item.price * (item.quantity || 1))).toLocaleString()}</span>
      <button
        onClick={() => onRemove(item.id)}
        className="text-gray-400 hover:text-red-500 transition-colors"
      >
        <Trash2 size={16} />
      </button>
    </div>
  </div>
);

const CustomerCard = ({ customer, isSelected, onClick }) => (
  <div 
    onClick={onClick}
    className={`p-3 border rounded-lg mb-2 cursor-pointer transition-colors ${
      isSelected ? 'bg-indigo-50 border-indigo-300' : 'bg-white hover:bg-gray-50 border-gray-200'
    }`}
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          customer.type === 'VIP' ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-600'
        }`}>
          <User size={16} />
        </div>
        <div className="ml-3">
          <p className="font-medium text-gray-800">{customer.name}</p>
          <p className="text-xs text-gray-500">{customer.company}</p>
        </div>
      </div>
      <ChevronRight size={16} className="text-gray-400" />
    </div>
  </div>
);

const FormField = ({ icon, placeholder, type = "text", className = "" }) => (
  <div className={`relative ${className}`}>
    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
      {icon}
    </div>
    <input
      type={type}
      placeholder={placeholder}
      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg bg-white text-gray-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
    />
  </div>
);

const SalesOrderPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('Laptops');
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [customerSearchTerm, setCustomerSearchTerm] = useState('');
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const addToCart = (product) => {
    // Check if the product is already in the cart
    const existingProductIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingProductIndex !== -1) {
      // Product already exists, update quantity
      const updatedCart = [...cart];
      updatedCart[existingProductIndex] = {
        ...updatedCart[existingProductIndex],
        quantity: (updatedCart[existingProductIndex].quantity || 1) + 1
      };
      setCart(updatedCart);
    } else {
      // Add new product with quantity 1
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };
  
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCart(cart.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };
  
  const toggleCustomerModal = () => {
    setShowCustomerModal(!showCustomerModal);
  };
  
  const selectCustomer = (customer) => {
    setSelectedCustomer(customer);
    setShowCustomerModal(false);
  };
  
  const filteredCustomers = customerSearchTerm 
    ? dummyCustomers.filter(customer => 
        customer.name.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
        customer.company.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(customerSearchTerm.toLowerCase())
      )
    : dummyCustomers;

  // Filter products based on search term
  const filteredProducts = searchTerm
    ? (dummyInventory[selectedCategory] || []).filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        product.serial.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : (dummyInventory[selectedCategory] || []);

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

  return (
    <ModuleLayout>
      <div className="p-4 bg-gray-100 w-full h-[calc(100vh-5rem)] overflow-hidden">
        <div className="flex h-full gap-4">
          {/* Left Side - Product Selection */}
          <div className="w-2/5 flex flex-col">
            <div className="bg-white p-4 rounded-xl shadow-sm mb-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800">Product Catalog</h2>
                
                {/* Search */}
                <div className="relative w-1/2">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-9 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              {/* Categories */}
              <div className="mb-3">
                <h3 className="text-xs font-semibold text-gray-600 mb-2">Categories</h3>
                <div className="flex flex-wrap gap-2 pb-2 overflow-x-auto">
                  {allCategories.map((category) => (
                    <CategoryButton
                      key={category}
                      category={category}
                      isActive={category === selectedCategory}
                      onClick={() => setSelectedCategory(category)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="overflow-y-auto flex-1 pr-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      category={selectedCategory}
                      onAddToCart={addToCart}
                    />
                  ))
                ) : (
                  <div className="col-span-full py-8 text-center text-gray-500">
                    <Package className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                    <p>No products found in this category or matching your search.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Side - Order Form */}
          <div className="w-3/5 bg-white p-6 rounded-xl shadow-md flex flex-col max-h-full overflow-hidden">
            <h2 className="text-xl font-bold mb-4 text-indigo-800 border-b pb-2">📝 Order Details</h2>
            
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-1">
                  <FormField 
                    icon={<Calendar size={18} />}
                    placeholder="Order Date"
                    type="date"
                  />
                </div>
                <div className="col-span-1">
                  <input 
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg" 
                    placeholder="Order ID" 
                    value={`SO-${Math.floor(Math.random() * 90000) + 10000}`}
                    readOnly
                  />
                </div>
              </div>
              
              <div className="relative">
                <button
                  onClick={toggleCustomerModal}
                  className="w-full flex items-center justify-between px-4 py-2.5 border border-gray-200 rounded-lg bg-white text-gray-800 hover:border-indigo-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
                >
                  <div className="flex items-center">
                    <User size={18} className="text-gray-400 mr-2" />
                    <span className={selectedCustomer ? "text-gray-800" : "text-gray-400"}>
                      {selectedCustomer ? selectedCustomer.name : "Select Customer"}
                    </span>
                  </div>
                  <ChevronRight size={16} className="text-gray-400" />
                </button>
                
                {/* Customer selection modal */}
                {showCustomerModal && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <div className="p-3 border-b">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          type="text"
                          placeholder="Search customers..."
                          className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg"
                          value={customerSearchTerm}
                          onChange={(e) => setCustomerSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="max-h-64 overflow-y-auto p-3">
                      {filteredCustomers.length > 0 ? (
                        filteredCustomers.map(customer => (
                          <CustomerCard
                            key={customer.id}
                            customer={customer}
                            isSelected={selectedCustomer && selectedCustomer.id === customer.id}
                            onClick={() => selectCustomer(customer)}
                          />
                        ))
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          No customers found
                        </div>
                      )}
                    </div>
                    <div className="p-3 border-t bg-gray-50">
                      <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-medium">
                        <UserPlus size={16} />
                        <span>Add New Customer</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {selectedCustomer ? (
                <>
                  <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          selectedCustomer.type === 'VIP' ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-600'
                        }`}>
                          <User size={14} />
                        </div>
                        <div className="ml-2">
                          <p className="font-medium text-gray-800 text-sm">{selectedCustomer.name}</p>
                          <p className="text-xs text-gray-500">{selectedCustomer.company}</p>
                        </div>
                      </div>
                      {selectedCustomer.type === 'VIP' && (
                        <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full font-medium">
                          VIP
                        </span>
                      )}
                    </div>
                    <div className="space-y-1 text-xs text-gray-600">
                      <p className="flex items-center"><MapPin size={12} className="mr-1" /> {selectedCustomer.address}</p>
                      <p className="flex items-center"><Phone size={12} className="mr-1" /> {selectedCustomer.phone}</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <FormField 
                    icon={<MapPin size={18} />}
                    placeholder="Shipping Address"
                  />
                  <FormField 
                    icon={<Phone size={18} />}
                    placeholder="Contact Number"
                  />
                </>
              )}
            </div>

            <h3 className="text-md font-semibold mb-2 text-indigo-700 flex items-center">
              <ShoppingCart className="mr-2 h-4 w-4" /> 
              Cart Items
              <span className="ml-2 text-sm font-normal text-gray-500">({cart.length} items)</span>
            </h3>
            
            <div className="overflow-y-auto flex-1 max-h-[180px] space-y-2 mb-4 pr-1">
              {cart.length > 0 ? (
                cart.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onRemove={removeFromCart}
                    onUpdateQuantity={updateQuantity}
                  />
                ))
              ) : (
                <div className="text-center py-6 text-gray-400 bg-gray-50 rounded-lg">
                  <ShoppingCart className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Your cart is empty</p>
                  <p className="text-xs mt-1">Add products from the catalog</p>
                </div>
              )}
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₱{totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (12%)</span>
                <span>₱{(totalAmount * 0.12).toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-lg text-gray-800">
                <span>Total</span>
                <span>₱{(totalAmount * 1.12).toLocaleString()}</span>
              </div>
            </div>

            <div className="text-right mt-4 flex justify-end gap-3">
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors">
                Save as Draft
              </button>
              <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 font-medium shadow-sm transition-colors">
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
};

export default SalesOrderPage;