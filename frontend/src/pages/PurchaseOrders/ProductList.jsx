import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout"; 

// Helper functions
const helpers = {
  statusBadge: (status) => { 
    const badges = {
      "true": "bg-red-100 text-red-800", 
      "false": "bg-emerald-100 text-emerald-800" 
    };
    return badges[status] || "bg-gray-100 text-gray-800";
  }
};

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

const ProductList = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([
    {
      id: 1, brand: "Acer", model: "Predator", description: "Gaming Laptop",
      purchasePrice: 55000, reorderPoint: 10, warrantyDuration: "1 Year", damage: false, isEditing: false,
    },
    {
      id: 2, brand: "Corsair", model: "K68", description: "Mechanical Keyboard",
      purchasePrice: 3500, reorderPoint: 20, warrantyDuration: "6 Months", damage: false, isEditing: false,
    },
  ]);
  
  const [newProduct, setNewProduct] = useState({
    description: "", purchasePrice: "", reorderPoint: "", warrantyDuration: "",
    model: "", brand: "", damage: false,
  });

  // Product handlers
  const handleEditProduct = (index) => {
    const updatedProducts = products.map((product, i) => 
      i === index ? { ...product, isEditing: !product.isEditing } : product
    );
    setProducts(updatedProducts);
  };
  
  const handleChangeProduct = (index, field, value) => {
    setProducts(prev => {
      const updated = [...prev];
      const productToUpdate = { ...updated[index] };

      if (field === "purchasePrice" || field === "reorderPoint") {
        productToUpdate[field] = value === '' ? '' : parseFloat(value) || 0;
      } else if (field === "damage") {
        productToUpdate[field] = value === "true";
      } 
      else {
        productToUpdate[field] = value;
      }
      updated[index] = productToUpdate;
      return updated;
    });
  };
  
  const handleDeleteProduct = (idToDelete) => {
    setProducts(prev => prev.filter(p => p.id !== idToDelete));
  };

  const handleAddProduct = () => {
    if (!newProduct.brand || !newProduct.model || !newProduct.description) {
        alert("Please fill in at least Brand, Model, and Description.");
        return;
    }
    setProducts(prev => [...prev, { 
      id: prev.length > 0 ? Math.max(...prev.map(p => p.id)) + 1 : 1,
      ...newProduct,
      purchasePrice: parseFloat(newProduct.purchasePrice) || 0,
      reorderPoint: parseInt(newProduct.reorderPoint) || 0,
      isEditing: false 
    }]);
    setNewProduct({
      description: "", purchasePrice: "", reorderPoint: "", warrantyDuration: "",
      model: "", brand: "", damage: false,
    });
  };

  useEffect(() => {
    // Optional: localStorage.setItem('productsData', JSON.stringify(products));
  }, [products]);

  return (
    <DashboardLayout>
      <div className="p-6 min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Manage Products</h1>
                {/* "Back to Purchase Orders" button removed */}
            </div>

            {/* Products Table */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {["ID", "Brand", "Model", "Description", "Purchase Price", "Reorder Point", "Warranty", "Damage", "Actions"].map((header, i) => (
                        <th key={i} scope="col" className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${i === 8 ? "text-right" : ""}`}>
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product, index) => (
                      <tr key={product.id} className={product.isEditing ? "bg-indigo-50" : "hover:bg-gray-50"}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {product.id}
                        </td>
                        {["brand", "model", "description"].map((field) => (
                          <td key={field} className="px-4 py-3 whitespace-nowrap text-sm">
                            <input
                              type="text"
                              className={`w-full px-2 py-1 ${product.isEditing ? "border border-gray-300 rounded" : "border-0 bg-transparent"}`}
                              value={product[field]}
                              disabled={!product.isEditing}
                              onChange={(e) => handleChangeProduct(index, field, e.target.value)}
                            />
                          </td>
                        ))}
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <div className="flex items-center">
                            <span className={`mr-1 ${product.isEditing ? "" : "hidden"}`}>₱</span>
                            <input
                              type="number"
                              className={`w-full px-2 py-1 ${product.isEditing ? "border border-gray-300 rounded" : "border-0 bg-transparent"}`}
                              value={product.isEditing ? product.purchasePrice : `₱${product.purchasePrice}`}
                              disabled={!product.isEditing}
                              onChange={(e) => handleChangeProduct(index, "purchasePrice", e.target.value)}
                              step="0.01"
                            />
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <input
                            type="number"
                            className={`w-full px-2 py-1 ${product.isEditing ? "border border-gray-300 rounded" : "border-0 bg-transparent"}`}
                            value={product.reorderPoint}
                            disabled={!product.isEditing}
                            onChange={(e) => handleChangeProduct(index, "reorderPoint", e.target.value)}
                          />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <input
                            type="text"
                            className={`w-full px-2 py-1 ${product.isEditing ? "border border-gray-300 rounded" : "border-0 bg-transparent"}`}
                            value={product.warrantyDuration}
                            disabled={!product.isEditing}
                            onChange={(e) => handleChangeProduct(index, "warrantyDuration", e.target.value)}
                          />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          {product.isEditing ? (
                            <select
                              className={`text-sm rounded-full px-3 py-1 font-medium border border-gray-300 ${helpers.statusBadge(String(product.damage))}`}
                              value={String(product.damage)}
                              onChange={(e) => handleChangeProduct(index, "damage", e.target.value)}
                            >
                              <option value="false">No</option>
                              <option value="true">Yes</option>
                            </select>
                          ) : (
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${helpers.statusBadge(String(product.damage))}`}>
                              {product.damage ? "Damaged" : "No Damage"}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleEditProduct(index)}
                              className={`px-3 py-1 rounded-md text-sm font-medium ${
                                product.isEditing
                                  ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                                  : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                              }`}
                            >
                              {product.isEditing ? "Save" : "Edit"}
                            </button>
                            {!product.isEditing && (
                                <button
                                onClick={() => handleDeleteProduct(product.id)}
                                className="px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded-md text-sm font-medium"
                                >
                                Delete
                                </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {products.length === 0 && (
                        <tr>
                            <td colSpan="9" className="px-4 py-4 text-center text-sm text-gray-500">
                                No products found. Add a new product below.
                            </td>
                        </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Add New Product Form */}
            <div className="bg-white shadow sm:rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Add New Product</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InputField label="Brand" value={newProduct.brand} onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })} />
                <InputField label="Model" value={newProduct.model} onChange={(e) => setNewProduct({ ...newProduct, model: e.target.value })} />
                <InputField label="Description" value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} />
                <InputField label="Purchase Price" type="number" prefix="₱" value={newProduct.purchasePrice} onChange={(e) => setNewProduct({ ...newProduct, purchasePrice: e.target.value })} />
                <InputField label="Reorder Point" type="number" value={newProduct.reorderPoint} onChange={(e) => setNewProduct({ ...newProduct, reorderPoint: e.target.value })} />
                <InputField label="Warranty Duration" value={newProduct.warrantyDuration} onChange={(e) => setNewProduct({ ...newProduct, warrantyDuration: e.target.value })} />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Damage</label>
                  <select
                    value={String(newProduct.damage)}
                    onChange={(e) => setNewProduct({ ...newProduct, damage: e.target.value === "true" })}
                    className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                </div>
                <div className="md:col-span-3 flex justify-end items-end">
                  <button
                    onClick={handleAddProduct}
                    className="w-full md:w-auto inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Add Product
                  </button>
                </div>
              </div>
            </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProductList;