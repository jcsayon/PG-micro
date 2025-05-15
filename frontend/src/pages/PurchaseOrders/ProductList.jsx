import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Search } from "lucide-react"; // Import Search icon

// Helper functions
const helpers = {
  statusBadge: (status) => {
    const badges = {
      "true": "bg-red-100 text-red-800", // Damaged
      "false": "bg-emerald-100 text-emerald-800" // No Damage
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

  const [allProducts, setAllProducts] = useState(() => {
    const initialProducts = [];
    const brands = ["Acer", "Corsair", "Logitech", "Asus", "MSI", "Razer", "HyperX", "Samsung", "LG", "Dell", "Apple", "Sony", "HP", "Lenovo", "Gigabyte"];
    const models = ["Predator", "K68", "G502", "ROG Strix", "Stealth", "BlackWidow", "Cloud II", "Odyssey", "UltraGear", "Alienware", "MacBook Pro", "Alpha", "Pavilion", "IdeaPad", "Aorus"];
    const descriptions = ["Gaming Laptop", "Mechanical Keyboard", "Gaming Mouse", "Motherboard", "Gaming PC", "Headset", "Monitor", "SSD", "RAM", "CPU Cooler", "Ultrabook", "Camera", "Printer", "Tablet", "Graphics Card"];
    const warrantyDurations = ["1 Year", "6 Months", "2 Years", "3 Years", "5 Years"];

    for (let i = 1; i <= 100; i++) {
      initialProducts.push({
        id: i,
        brand: brands[i % brands.length],
        model: models[i % models.length] + `-${i}`,
        description: descriptions[i % descriptions.length],
        purchasePrice: Math.floor(Math.random() * 100000) + 1000,
        reorderPoint: Math.floor(Math.random() * 50) + 5,
        warrantyDuration: warrantyDurations[i % warrantyDurations.length],
        damage: false, // All products default to no damage
        isEditing: false,
      });
    }
    return initialProducts;
  });

  const [newProduct, setNewProduct] = useState({
    description: "", purchasePrice: "", reorderPoint: "", warrantyDuration: "",
    model: "", brand: "", damage: false, // New product also defaults to no damage
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Number of items per page

  // Product handlers
  const handleEditProduct = (productId) => {
    setAllProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === productId ? { ...product, isEditing: !product.isEditing } : product
      )
    );
  };

  const handleChangeProduct = (productId, field, value) => {
    setAllProducts(prevProducts =>
      prevProducts.map(product => {
        if (product.id === productId) {
          const productToUpdate = { ...product };
          if (field === "purchasePrice" || field === "reorderPoint") {
            productToUpdate[field] = value === '' ? '' : parseFloat(value) || 0;
          } else if (field === "damage") {
            productToUpdate[field] = value === "true";
          } else {
            productToUpdate[field] = value;
          }
          return productToUpdate;
        }
        return product;
      })
    );
  };

  const handleDeleteProduct = (idToDelete) => {
    setAllProducts(prev => prev.filter(p => p.id !== idToDelete));
  };

  const handleAddProduct = () => {
    if (!newProduct.brand || !newProduct.model || !newProduct.description) {
        alert("Please fill in at least Brand, Model, and Description.");
        return;
    }
    setAllProducts(prev => [...prev, {
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

  // Filtered and Paginated Products
  const filteredProducts = allProducts.filter(product =>
    product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    // Reset to first page if search query changes and current page becomes invalid
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (totalPages === 0 && filteredProducts.length === 0) {
      setCurrentPage(1); // Reset to page 1 if no results
    }
  }, [searchQuery, totalPages, currentPage, filteredProducts.length]);


  return (
    <DashboardLayout>
      <div className="p-1 min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-2 gap-4">
                <h1 className="text-2xl font-bold text-gray-900">Manage Products</h1>
                {/* Search Input */}
                <div className="relative w-full sm:w-auto">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block w-full sm:w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-2">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {["ID", "Brand", "Model", "Description", "Purchase Price", "Reorder Point", "Warranty", "Damage", "Actions"].map((header, i) => (
                        <th key={i} scope="col" className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider mr-1${i === 8 ? "text-right" : ""}`}>
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentItems.map((product) => ( // Changed from 'products' to 'currentItems'
                      <tr key={product.id} className={product.isEditing ? "bg-indigo-200" : "hover:bg-gray-300"}>
                        <td className="px-4 py-1 whitespace-nowrap text-sm font-medium text-gray-900">
                          {product.id}
                        </td>
                        {["brand", "model", "description"].map((field) => (
                          <td key={field} className="px-4 py-3 whitespace-nowrap text-sm mr-1">
                            <input
                              type="text"
                              className={`w-full px-2 py-1 ${product.isEditing ? "border border-indigo-400 rounded" : "border-0 bg-transparent"}`}
                              value={product[field]}
                              disabled={!product.isEditing}
                              onChange={(e) => handleChangeProduct(product.id, field, e.target.value)}
                            />
                          </td>
                        ))}
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <div className="flex items-center">
                            <span className={`mr-1 ${product.isEditing ? "" : "hidden"}`}>₱</span>
                            <input
                              type="number"
                              className={`w-full px-2 py-1 ${product.isEditing ? "border border-indigo-400 rounded" : "border-0 bg-transparent"}`}
                              value={product.isEditing ? product.purchasePrice : `₱${product.purchasePrice}`}
                              disabled={!product.isEditing}
                              onChange={(e) => handleChangeProduct(product.id, "purchasePrice", e.target.value)}
                              step="0.01"
                            />
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <input
                            type="number"
                            className={`w-full px-2 py-1 ${product.isEditing ? "border border-indigo-400 rounded" : "border-0 bg-transparent"}`}
                            value={product.reorderPoint}
                            disabled={!product.isEditing}
                            onChange={(e) => handleChangeProduct(product.id, "reorderPoint", e.target.value)}
                          />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <input
                            type="text"
                            className={`w-full px-2 py-1 ${product.isEditing ? "border border-indigo-400 rounded" : "border-0 bg-transparent"}`}
                            value={product.warrantyDuration}
                            disabled={!product.isEditing}
                            onChange={(e) => handleChangeProduct(product.id, "warrantyDuration", e.target.value)}
                          />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          {product.isEditing ? (
                            <select
                              className={`text-sm rounded-full px-3 py-1 font-medium border border-indigo-400 ${helpers.statusBadge(String(product.damage))}`}
                              value={String(product.damage)}
                              onChange={(e) => handleChangeProduct(product.id, "damage", e.target.value)}
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
                              onClick={() => handleEditProduct(product.id)}
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
                    {currentItems.length === 0 && (
                        <tr>
                            <td colSpan="9" className="px-4 py-4 text-center text-sm text-gray-500">
                                {searchQuery ? "No products match your search." : "No products found. Add a new product below."}
                            </td>
                        </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="px-4 py-1 flex items-center justify-between border-t border-gray-200 sm:px-6">
                    <div className="flex-1 flex justify-between sm:hidden">
                        <button
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to <span className="font-medium">{Math.min(indexOfLastItem, filteredProducts.length)}</span> of{' '}
                                <span className="font-medium">{filteredProducts.length}</span> results
                            </p>
                        </div>
                        <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                <button
                                    onClick={() => paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-600 bg-white text-sm font-medium text-gray-500 hover:bg-gray-300 disabled:opacity-50"
                                >
                                    <span className="sr-only">Previous</span>
                                    &lt;
                                </button>
                                {[...Array(totalPages).keys()].map(number => (
                                  <button
                                    key={number + 1}
                                    onClick={() => paginate(number + 1)}
                                    className={`relative inline-flex items-center px-4 py-2 border border-gray-600 bg-indigo-100 text-sm font-medium ${currentPage === number + 1 ? 'z-10 bg-indigo-300 border-indigo-500 text-indigo-600' : 'text-gray-700 hover:bg-gray-300'}`}
                                  >
                                    {number + 1}
                                  </button>
                                ))}
                                <button
                                    onClick={() => paginate(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-600 bg-white text-sm font-medium text-gray-500 hover:bg-gray-300 disabled:opacity-50"
                                >
                                    <span className="sr-only">Next</span>
                                    &gt;
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
              )}
            </div>

            {/* Add New Product Form - Always Visible */}
            <div className="bg-white shadow sm:rounded-lg p-6 mt-8">
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
                    value={String(newProduct.damage)} // Ensure this is 'false' by default for new products
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