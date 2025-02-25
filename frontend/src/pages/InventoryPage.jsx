import React, { useState } from "react";
import Sidebar_Primary from "../components/Sidebar_Primary";

const InventoryPage = () => {
  const [inventory, setInventory] = useState([
    {
      id: 1,
      Model: "SN12345",
      description: "Laptop",
      quantityReceived: 20,
      quantityAvailable: 15,
      stockStatus: "In Stock",
      location: "Warehouse A",
      Brand: "2024-02-24",
      sellingPrice: "₱800.00",
    },
    {
      id: 2,
      Model: "SN67890",
      description: "Mouse",
      quantityReceived: 50,
      quantityAvailable: 30,
      stockStatus: "In Stock",
      location: "Warehouse B",
      Brand: "2024-02-20",
      sellingPrice: "₱25.00",
    },
  ]);

  const [newProduct, setNewProduct] = useState({
    Model: "",
    description: "",
    quantityReceived: "",
    quantityAvailable: "",
    stockStatus: "In Stock",
    location: "",
    Brand: "",
    sellingPrice: "",
  });

  const [editProduct, setEditProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const stockStatusOptions = ["In Stock", "Limited Stock", "Out of Stock"];

  const handleEdit = (index) => {
    setEditProduct({ ...inventory[index], index });
    setIsModalOpen(true);
  };

  const handleSaveChanges = () => {
    if (editProduct) {
      const updatedInventory = [...inventory];
      updatedInventory[editProduct.index] = {
        ...editProduct,
        id: inventory[editProduct.index].id,
      };
      setInventory(updatedInventory);
      setIsModalOpen(false);
      setEditProduct(null);
    }
  };

  const handleDelete = (index) => {
    const updatedInventory = inventory.filter((_, i) => i !== index);
    setInventory(updatedInventory);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddProduct = () => {
    if (newProduct.Model && newProduct.description) {
      setInventory([...inventory, { ...newProduct, id: inventory.length + 1 }]);
      setNewProduct({
        Model: "",
        description: "",
        quantityReceived: "",
        quantityAvailable: "",
        stockStatus: "In Stock",
        location: "",
        Brand: "",
        sellingPrice: "",
      });
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar_Primary />
      <div className="flex-1 p-6 overflow-auto ml-64">
        <h1 className="text-2xl font-bold text-purple-600 mb-4">
          Inventory Management
        </h1>

        {/* Inventory Table */}
        <div className="overflow-y-auto max-h-96 bg-white shadow-md rounded-lg mb-6">
          <table className="min-w-full border border-gray-200 rounded">
            <thead className="sticky top-0 bg-purple-100 text-left text-sm font-medium text-gray-700">
              <tr>
                <th className="p-3 border">Item ID</th>
                <th className="p-3 border">Model</th>
                <th className="p-3 border">Description</th>
                <th className="p-3 border">Brand</th>
                <th className="p-3 border">Quantity Received</th>
                <th className="p-3 border">Quantity Available</th>
                <th className="p-3 border">Stock Status</th>
                <th className="p-3 border">Location</th>
                <th className="p-3 border">Selling Price</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item, index) => (
                <tr key={item.id} className="text-sm text-gray-700 border-t">
                  <td className="p-3 border">{item.id}</td>
                  <td className="p-3 border">{item.Model}</td>
                  <td className="p-3 border">{item.description}</td>
                  <td className="p-3 border">{item.Brand}</td>
                  <td className="p-3 border">{item.quantityReceived}</td>
                  <td className="p-3 border">{item.quantityAvailable}</td>
                  <td className="p-3 border">{item.stockStatus}</td>
                  <td className="p-3 border">{item.location}</td>
                  <td className="p-3 border">{item.sellingPrice}</td>
                  <td className="p-3 border">
                    <button
                      onClick={() => handleEdit(index)}
                      className="text-blue-600 hover:text-blue-800 px-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      className="text-red-600 hover:text-red-800 px-2"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add to Inventory Form */}
        <div className="mb-4 p-6 border rounded-lg bg-white shadow-md">
          <h2 className="text-lg font-bold mb-4 text-gray-700">
            Add to Inventory
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {Object.keys(newProduct).map((key) =>
              key === "stockStatus" ? (
                <select
                  key={key}
                  name={key}
                  value={newProduct[key]}
                  onChange={handleChange}
                  className="p-3 border rounded bg-gray-100 text-black"
                >
                  {stockStatusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  key={key}
                  type="text"
                  name={key}
                  placeholder={key.replace(/([A-Z])/g, " $1").trim()}
                  value={newProduct[key]}
                  onChange={handleChange}
                  className="p-3 border rounded bg-gray-100 text-black"
                />
              )
            )}
          </div>
          <button
            onClick={handleAddProduct}
            className="mt-4 bg-purple-700 text-white px-6 py-2 rounded shadow hover:bg-purple-800"
          >
            Add to Inventory
          </button>
        </div>

        {/* Floating Edit Modal */}
        {isModalOpen && editProduct && (
          <div className="fixed inset-0 flex items-center justify-center bg-transparent">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
              <h2 className="text-lg font-bold mb-4">Edit Product</h2>
              <div className="grid grid-cols-2 gap-4">
                {Object.keys(editProduct).map(
                  (key) =>
                    key !== "index" &&
                    key !== "id" &&
                    (key === "stockStatus" ? (
                      <select
                        key={key}
                        name={key}
                        value={editProduct[key]}
                        onChange={(e) =>
                          setEditProduct({
                            ...editProduct,
                            [key]: e.target.value,
                          })
                        }
                        className="p-3 border rounded bg-gray-100 text-black"
                      >
                        {stockStatusOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        key={key}
                        type="text"
                        name={key}
                        value={editProduct[key]}
                        onChange={(e) =>
                          setEditProduct({
                            ...editProduct,
                            [key]: e.target.value,
                          })
                        }
                        className="p-3 border rounded bg-gray-100 text-black"
                      />
                    ))
                )}
              </div>
              <button
                onClick={handleSaveChanges}
                className="bg-purple-700 text-white px-4 py-2 rounded"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryPage;
