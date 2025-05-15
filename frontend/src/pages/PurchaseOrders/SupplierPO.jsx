import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { X } from "lucide-react";

// Placeholder for all products (ideally fetched or imported)
// For now, using a simplified version of the ProductList generation
const allProductsData = (() => {
    const products = [];
    const brands = ["Acer", "Corsair", "Logitech", "Asus", "MSI", "Razer", "HyperX", "Samsung", "LG", "Dell"];
    const models = ["Predator", "K68", "G502", "ROG Strix", "Stealth", "BlackWidow", "Cloud II", "Odyssey", "UltraGear", "Alienware"];
    const descriptions = ["Gaming Laptop", "Mechanical Keyboard", "Gaming Mouse", "Motherboard", "Gaming PC", "Headset", "Monitor", "SSD", "RAM", "CPU Cooler"];

    for (let i = 1; i <= 100; i++) {
      products.push({
        id: i,
        brand: brands[i % brands.length],
        model: models[i % models.length] + `-${i}`,
        description: descriptions[i % descriptions.length],
        purchasePrice: Math.floor(Math.random() * 100000) + 1000,
        reorderPoint: Math.floor(Math.random() * 50) + 5,
        warrantyDuration: "1 Year", // Simplified
        damage: false,
      });
    }
    return products;
  })();


// Reusable InputField Component
const InputField = ({ label, value, onChange, type = "text", prefix, disabled = false }) => (
  <div>
    {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
    <div className="relative rounded-md">
      {prefix && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-gray-500 sm:text-sm">{prefix}</span>
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`${prefix ? 'pl-7' : 'pl-3'} pr-3 py-2 w-full ${
          disabled ? 'bg-transparent border-0' : 'border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
        } rounded-md shadow-sm sm:text-sm`}
      />
    </div>
  </div>
);

// Modal for Managing Catalog (Basic Structure)
const ManageCatalogModal = ({ isOpen, onClose, supplier, allProducts, onSaveCatalog }) => {
  const [currentCatalog, setCurrentCatalog] = useState(supplier ? [...supplier.catalog] : []);

  useEffect(() => {
    if (supplier) {
      setCurrentCatalog([...supplier.catalog]);
    }
  }, [supplier]);

  if (!isOpen || !supplier) return null;

  const handleToggleProduct = (productId) => {
    setCurrentCatalog(prev =>
      prev.find(p => p.id === productId)
        ? prev.filter(p => p.id !== productId)
        : [...prev, allProducts.find(p => p.id === productId)]
    );
  };

  return (
    <div className="fixed inset-0 bg-gray-900/80 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-4/5 max-w-2xl max-h-[90vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Manage Catalog for {supplier.name}</h2>
          <button onClick={onClose} className="text-white hover:text-black">
            <X className="h-6 w-6 bg-red-500 rounded"/>
          </button>
        </div>
        <div className="p-4 overflow-auto flex-1">
          <h3 className="text-lg font-medium mb-2">Available Products:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-64 overflow-y-auto">
            {allProducts.map(product => (
              <div key={product.id} className="flex items-center p-2 border rounded">
                <input
                  type="checkbox"
                  id={`product-${product.id}`}
                  checked={currentCatalog.some(p => p.id === product.id)}
                  onChange={() => handleToggleProduct(product.id)}
                  className="mr-2"
                />
                <label htmlFor={`product-${product.id}`}>{product.brand} {product.model} (ID: {product.id})</label>
              </div>
            ))}
          </div>
        </div>
        <div className="p-4 border-t flex justify-end gap-2">          
          <button onClick={() => { onSaveCatalog(supplier.id, currentCatalog); onClose(); }} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Save Catalog</button>
        </div>
      </div>
    </div>
  );
};


const SupplierPO = () => {
  const navigate = useNavigate();
  const [isCatalogModalOpen, setIsCatalogModalOpen] = useState(false);
  const [selectedSupplierForCatalog, setSelectedSupplierForCatalog] = useState(null);

  const [suppliers, setSuppliers] = useState([
    { id: 1, name: "Hardware World", address: "123 Main St, Davao City", email: "info@hardwareworld.com", contact: "0912-345-6789", isEditing: false, catalog: allProductsData.slice(0, 10) }, // First 10 products
    { id: 2, name: "CD-R King", address: "456 IT Park, Cebu City", email: "support@cdrking.com", contact: "0901-234-5678", isEditing: false, catalog: allProductsData.slice(10, 25) }, // Next 15 products
    { id: 3, name: "MGM Marketing Inc.", address: "789 Market St, Manila", email: "contact@mgm.com", contact: "0934-567-8910", isEditing: false, catalog: allProductsData.slice(25, 35) }, // Next 10 products
  ]);

  const [newSupplier, setNewSupplier] = useState({
    name: "", address: "", email: "", contact: "",
  });

  // Supplier handlers
  const handleEditSupplier = (index) => {
    const updatedSuppliers = suppliers.map((supplier, i) =>
        i === index ? { ...supplier, isEditing: !supplier.isEditing } : supplier
    );
    setSuppliers(updatedSuppliers);
  };

  const handleChangeSupplier = (index, field, value) => {
    setSuppliers(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleDeleteSupplier = (idToDelete) => {
    setSuppliers(prev => prev.filter(s => s.id !== idToDelete));
  };

  const handleAddSupplier = () => {
    if (!newSupplier.name || !newSupplier.address) {
        alert("Please fill in at least Name and Address.");
        return;
    }
    setSuppliers(prev => [...prev, {
      id: prev.length > 0 ? Math.max(...prev.map(s => s.id)) + 1 : 1,
      ...newSupplier,
      catalog: [], // New suppliers start with an empty catalog
      isEditing: false
    }]);
    setNewSupplier({ name: "", address: "", email: "", contact: "" });
  };

  const handleOpenCatalogModal = (supplier) => {
    setSelectedSupplierForCatalog(supplier);
    setIsCatalogModalOpen(true);
  };

  const handleSaveCatalog = (supplierId, newCatalog) => {
    setSuppliers(prev => prev.map(s =>
      s.id === supplierId ? { ...s, catalog: newCatalog } : s
    ));
  };


  useEffect(() => {
    // Optional: localStorage.setItem('suppliersData', JSON.stringify(suppliers));
    // console.log("Updated Supplier List for other components:", JSON.stringify(suppliers)); // For debugging
  }, [suppliers]);


  return (
    <DashboardLayout>
      <div className="p-6 min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Manage Suppliers</h1>
            </div>

            {/* Suppliers Table */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
                <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        {["ID", "Name", "Address", "Email", "Contact", "Catalog", "Actions"].map((header, i) => (
                        <th key={i} scope="col" className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${i === 6 ? "text-right" : ""}`}>
                            {header}
                        </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {suppliers.map((supplier, index) => (
                        <tr key={supplier.id} className={supplier.isEditing ? "bg-indigo-50" : "hover:bg-gray-50"}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                            {supplier.id}
                        </td>
                        {["name", "address", "email", "contact"].map((field) => (
                            <td key={field} className="px-4 py-3 whitespace-nowrap text-sm">
                            <input
                                type={field === "email" ? "email" : "text"}
                                className={`w-full px-2 py-1 ${supplier.isEditing ? "border border-gray-300 rounded" : "border-0 bg-transparent"}`}
                                value={supplier[field]}
                                disabled={!supplier.isEditing}
                                onChange={(e) => handleChangeSupplier(index, field, e.target.value)}
                            />
                            </td>
                        ))}
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                           <button
                             onClick={() => handleOpenCatalogModal(supplier)}
                             className="text-white bg-indigo-400 rounded p-1 hover:text-indigo-900"
                           >
                             View/Edit ({supplier.catalog.length} items)
                           </button>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => handleEditSupplier(index)}
                                className={`px-3 py-1 rounded-md text-sm font-medium ${
                                supplier.isEditing
                                    ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                                    : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                                }`}
                            >
                                {supplier.isEditing ? "Save" : "Edit"}
                            </button>
                            {!supplier.isEditing && (
                                <button
                                    onClick={() => handleDeleteSupplier(supplier.id)}
                                    className="px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded-md text-sm font-medium"
                                >
                                Delete
                                </button>
                            )}
                            </div>
                        </td>
                        </tr>
                    ))}
                    {suppliers.length === 0 && (
                        <tr>
                            <td colSpan="7" className="px-4 py-4 text-center text-sm text-gray-500"> {/* Updated colSpan */}
                                No suppliers found. Add a new supplier below.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
                </div>
            </div>

            {/* Add New Supplier Form */}
            <div className="bg-white shadow sm:rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Add New Supplier</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="Name" value={newSupplier.name} onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })} />
                <InputField label="Address" value={newSupplier.address} onChange={(e) => setNewSupplier({ ...newSupplier, address: e.target.value })} />
                <InputField label="Email" type="email" value={newSupplier.email} onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })} />
                <InputField label="Contact" value={newSupplier.contact} onChange={(e) => setNewSupplier({ ...newSupplier, contact: e.target.value })} />
                <div className="md:col-span-2 flex justify-end items-end">
                <button
                    onClick={handleAddSupplier}
                    className="w-full md:w-auto inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Add Supplier
                </button>
                </div>
            </div>
            </div>
        </div>
      </div>
      {selectedSupplierForCatalog && (
        <ManageCatalogModal
          isOpen={isCatalogModalOpen}
          onClose={() => setIsCatalogModalOpen(false)}
          supplier={selectedSupplierForCatalog}
          allProducts={allProductsData}
          onSaveCatalog={handleSaveCatalog}
        />
      )}
    </DashboardLayout>
  );
};

export default SupplierPO;