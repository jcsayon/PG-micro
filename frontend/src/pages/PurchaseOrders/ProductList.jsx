import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Search } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const helpers = {
  statusBadge: (status) => {
    const badges = {
      "true": "bg-red-100 text-red-800", // Damaged
      "false": "bg-emerald-100 text-emerald-800" // No Damage
    };
    return badges[status] || "bg-gray-100 text-gray-800";
  }
};

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
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    purchase_price: "",
    reorder_point: "",
    warranty_duration: "",
    model: "",
    brand: "",
    status: "",
    category_id: "",  // this must be an ID, not name like "Processor"
    damage: false,    // optional if not used in backend
  });
  const [categories, setCategories] = useState([]);

useEffect(() => {
  fetch(`${API_BASE_URL}/product-categories/`)
    .then((res) => res.json())
    .then((data) => setCategories(data))
    .catch((err) => console.error("Failed to fetch categories:", err));
}, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/`);
      if (!response.ok) throw new Error("Failed to fetch products.");
      const data = await response.json();
      const withEditingFlag = data.map(item => ({ ...item, isEditing: false }));
      setProducts(withEditingFlag);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleEdit = (id) => {
    setProducts(prev =>
      prev.map(p => p.id === id ? { ...p, isEditing: !p.isEditing } : p)
    );
  };

  const handleChange = (id, field, value) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id === id) {
          const updated = { ...p };
          if (field === "purchase_price" || field === "reorder_point") {
            updated[field] = value === '' ? '' : parseFloat(value) || 0;
          } else if (field === "damage") {
            updated[field] = value === "true";
          } else {
            updated[field] = value;
          }
          return updated;
        }
        return p;
      })
    );
  };

  const handleAddProduct = async () => {
    if (!newProduct.brand || !newProduct.model || !newProduct.description) {
      alert("Please fill in Brand, Model, and Description.");
      return;
    }
  
    try {
      console.log("Sending product data:", {
        name: newProduct.name,
        status: newProduct.status,
        category_id: parseInt(newProduct.category_id),
        brand: newProduct.brand,
        model: newProduct.model,
        description: newProduct.description,
        purchase_price: parseFloat(newProduct.purchase_price),
        reorder_point: parseInt(newProduct.reorder_point),
        warranty_duration: newProduct.warranty_duration,
        damage: newProduct.damage === true,
      });
      
      const response = await fetch(`${API_BASE_URL}/products/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newProduct.name,                       // ✅ Must be included
          status: newProduct.status,                   // ✅ Must be included
          category_id: parseInt(newProduct.category_id), // ✅ Must be an integer ID
          brand: newProduct.brand,
          model: newProduct.model,
          description: newProduct.description,
          purchase_price: parseFloat(newProduct.purchase_price),
          reorder_point: parseInt(newProduct.reorder_point),
          warranty_duration: newProduct.warranty_duration,
          damage: newProduct.damage === true,
        }),
      });
      
  
      if (!response.ok) {
        const errorText = await response.text(); // use .json() if response is JSON
        console.error("Backend response:", errorText);
        throw new Error("Failed to add product.");
      }
  
      const created = await response.json();
      setProducts((prev) => [...prev, { ...created, isEditing: false }]);
  
      setNewProduct({
        name: "",
        status: "",
        category_id: "",
        brand: "",
        model: "",
        description: "",
        purchase_price: "",
        reorder_point: "",
        warranty_duration: "",
        damage: false,
      });
      
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Something went wrong while adding the product.");
    }
  };
  
  

  const filtered = products.filter(p =>
    p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) setCurrentPage(totalPages);
  }, [searchQuery, totalPages, currentPage]);

  return (
    <DashboardLayout>
      <div className="p-4 min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Manage Products</h1>
            <div className="relative w-full sm:w-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full sm:w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {["ID", "Brand", "Model", "Description", "Purchase Price", "Reorder Point", "Warranty", "Damage", "Actions"].map((header, i) => (
                      <th key={i} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentItems.map((product) => (
                    <tr key={product.id} className={product.isEditing ? "bg-indigo-50" : "hover:bg-gray-100"}>
                      <td className="px-4 py-2 font-medium text-gray-900">{product.id}</td>
                      {["brand", "model", "description"].map(field => (
                        <td key={field} className="px-4 py-2">
                          <input
                            type="text"
                            value={product[field]}
                            onChange={(e) => handleChange(product.id, field, e.target.value)}
                            disabled={!product.isEditing}
                            className={`w-full ${product.isEditing ? "border border-indigo-400 rounded" : "border-0 bg-transparent"}`}
                          />
                        </td>
                      ))}
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          value={product.purchase_price}
                          onChange={(e) => handleChange(product.id, "purchase_price", e.target.value)}
                          disabled={!product.isEditing}
                          className={`w-full ${product.isEditing ? "border border-indigo-400 rounded" : "border-0 bg-transparent"}`}
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          value={product.reorder_point}
                          onChange={(e) => handleChange(product.id, "reorder_point", e.target.value)}
                          disabled={!product.isEditing}
                          className={`w-full ${product.isEditing ? "border border-indigo-400 rounded" : "border-0 bg-transparent"}`}
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={product.warranty_duration}
                          onChange={(e) => handleChange(product.id, "warranty_duration", e.target.value)}
                          disabled={!product.isEditing}
                          className={`w-full ${product.isEditing ? "border border-indigo-400 rounded" : "border-0 bg-transparent"}`}
                        />
                      </td>
                      <td className="px-4 py-2">
                        {product.isEditing ? (
                          <select
                            value={String(product.damage)}
                            onChange={(e) => handleChange(product.id, "damage", e.target.value)}
                            className={`text-sm rounded-full px-3 py-1 border ${helpers.statusBadge(String(product.damage))}`}
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
                      <td className="px-4 py-2 text-right">
                        <button
                          onClick={() => handleEdit(product.id)}
                          className={`px-3 py-1 rounded-md text-sm font-medium ${
                            product.isEditing ? "bg-green-100 text-green-700" : "bg-indigo-100 text-indigo-700"
                          } hover:bg-indigo-200`}
                        >
                          {product.isEditing ? "Save" : "Edit"}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {currentItems.length === 0 && (
                    <tr>
                      <td colSpan="9" className="px-4 py-6 text-center text-sm text-gray-500">
                        {searchQuery ? "No products match your search." : "No products found."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-4 py-2 flex justify-end space-x-1 border-t bg-gray-50">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => paginate(i + 1)}
                    className={`px-3 py-1 rounded-md text-sm ${currentPage === i + 1 ? "bg-indigo-500 text-white" : "bg-white border border-gray-300"}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}

          </div>
                    {/* Add New Product Form - Always Visible */}
          <div className="bg-white shadow sm:rounded-lg p-2 mt-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Add New Product</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <InputField
                label="Brand"
                value={newProduct.brand}
                onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
              />
              <InputField
                label="Model"
                value={newProduct.model}
                onChange={(e) => setNewProduct({ ...newProduct, model: e.target.value })}
              />
              <InputField
                label="Description"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              />
              <InputField
                label="Purchase Price"
                type="number"
                prefix="₱"
                value={newProduct.purchase_price}
                onChange={(e) => setNewProduct({ ...newProduct, purchase_price: e.target.value })}
              />
              <InputField
                label="Reorder Point"
                type="number"
                value={newProduct.reorder_point}
                onChange={(e) => setNewProduct({ ...newProduct, reorder_point: e.target.value })}
              />
              <InputField
                label="Warranty Duration"
                value={newProduct.warranty_duration}
                onChange={(e) => setNewProduct({ ...newProduct, warranty_duration: e.target.value })}
              />
              <InputField
                label="Name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={newProduct.status}
                    onChange={(e) => setNewProduct({ ...newProduct, status: e.target.value })}
                    className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="">Select status...</option>
                    <option value="In Stock">In Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                    <option value="Low Stock">Low Stock</option>
                    <option value="Discontinued">Discontinued</option>
                  </select>
                </div>


                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={newProduct.category_id}
                    onChange={(e) => setNewProduct({ ...newProduct, category_id: e.target.value })}
                    className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="">Select category...</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

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
              <div className="col-span-1 flex justify-end items-center">
                <button
                  onClick={handleAddProduct}
                  className="w-full md:w-auto inline-flex justify-center items-center px-3 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
