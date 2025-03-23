import React, { useState } from 'react';
import ModuleLayout from '../../layouts/ModuleLayout';

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

const SalesOrderPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('Laptops');
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (serial) => {
    setCart(cart.filter(item => item.serial !== serial));
  };

  return (
    <ModuleLayout>
      <div className="p-4 bg-gray-100 w-full h-[calc(100vh-5rem)] overflow-hidden">
        <div className="flex h-full gap-4">
          {/* Product List */}
          <div className="w-2/5 flex flex-col">
            <label className="text-sm font-semibold mb-1">Categories</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="mb-3 p-2 rounded border border-purple-500"
            >
              {allCategories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <div className="overflow-y-auto space-y-3 pr-2 flex-1">
              {(dummyInventory[selectedCategory] || []).map((product) => (
                <div key={product.serial} className="bg-purple-700 text-white p-3 rounded flex gap-4 items-center shadow-md">
                  <img src={product.image} alt={product.name} className="w-16 h-16 rounded-md" />
                  <div className="flex-1">
                    <p className="text-xs italic">{selectedCategory}</p>
                    <h4 className="text-sm font-bold">{product.name}</h4>
                    <p className="text-xs">Serial: {product.serial}</p>
                    <p className="text-xs">Price: ₱{product.price.toLocaleString()}</p>
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    className="text-sm bg-white text-purple-700 font-semibold py-1 px-3 rounded hover:bg-purple-200"
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Order Details */}
          <div className="w-3/5 bg-white p-6 rounded-xl shadow-md flex flex-col max-h-full overflow-hidden">
            <h2 className="text-xl font-bold mb-4 text-purple-800 border-b pb-2">📝 Order Details</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input className="col-span-1 border p-2 rounded" placeholder="Order ID" />
              <input className="col-span-1 border p-2 rounded" placeholder="Customer Name" />
              <input className="col-span-2 border p-2 rounded" placeholder="Shipping Address" />
              <input className="col-span-2 border p-2 rounded" placeholder="Contact Number" />
              <input className="col-span-2 border p-2 rounded" type="date" />
            </div>

            <h3 className="text-md font-semibold mb-2 text-purple-700">🛒 Cart</h3>
            <div className="overflow-y-auto flex-1 max-h-[180px] space-y-2 mb-4 pr-1">
              {cart.map((item) => (
                <div
                  key={item.serial}
                  className="bg-purple-100 text-purple-800 p-3 rounded flex justify-between items-center shadow-sm"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-xs text-purple-600">Serial: {item.serial}</span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="font-semibold text-sm">₱{item.price.toLocaleString()}</span>
                    <button
                      onClick={() => removeFromCart(item.serial)}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-right font-semibold text-lg border-t pt-4">
              Total: <span className="text-green-700">₱{cart.reduce((sum, item) => sum + item.price, 0).toLocaleString()}</span>
            </div>

            <div className="text-right mt-4">
              <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 font-semibold shadow-md">
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
