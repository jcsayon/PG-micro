import React, { useState } from "react";
import Sidebar_Primary from "../components/Sidebar_Primary";

const InventoryPage = () => {
  const [inventory, setInventory] = useState([
    {
      id: 1,
      serialNumber: "SN12345",
      description: "Laptop",
      quantityReceived: 20,
      quantityAvailable: 15,
      stockStatus: "In Stock",
      location: "Warehouse A",
      dateReceived: "2024-02-24",
      sellingPrice: "₱800.00",
    },
    {
      id: 2,
      serialNumber: "SN67890",
      description: "Mouse",
      quantityReceived: 50,
      quantityAvailable: 30,
      stockStatus: "In Stock",
      location: "Warehouse B",
      dateReceived: "2024-02-20",
      sellingPrice: "₱25.00",
    },
  ]);

  const [newProduct, setNewProduct] = useState({
    serialNumber: "",
    description: "",
    quantityReceived: "",
    quantityAvailable: "",
    stockStatus: "In Stock",
    location: "",
    dateReceived: "",
    sellingPrice: "",
  });

  const [editProduct, setEditProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Open Edit Modal
  const handleEdit = (index) => {
    setEditProduct({ ...inventory[index], index });
    setIsModalOpen(true);
  };

  // Save Changes in Edit Modal
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

  // Handle Delete Item
  const handleDelete = (index) => {
    const updatedInventory = inventory.filter((_, i) => i !== index);
    setInventory(updatedInventory);
  };

  // Handle Input Change for Adding New Product
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: name === "sellingPrice" ? `₱${value.replace(/₱/g, "")}` : value,
    }));
  };

  // Handle Adding New Product
  const handleAddProduct = () => {
    if (newProduct.serialNumber && newProduct.description) {
      setInventory([...inventory, { ...newProduct, id: inventory.length + 1 }]);
      setNewProduct({
        serialNumber: "",
        description: "",
        quantityReceived: "",
        quantityAvailable: "",
        stockStatus: "In Stock",
        location: "",
        dateReceived: "",
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
                <th className="p-3 border">Serial Number</th>
                <th className="p-3 border">Description</th>
                <th className="p-3 border">Date Received</th>
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
                  <td className="p-3 border">{item.serialNumber}</td>
                  <td className="p-3 border">{item.description}</td>
                  <td className="p-3 border">{item.dateReceived}</td>
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
            {Object.keys(newProduct).map((key) => (
              <input
                key={key}
                type={key.includes("date") ? "date" : "text"}
                name={key}
                placeholder={key.replace(/([A-Z])/g, " $1").trim()}
                value={newProduct[key]}
                onChange={handleChange}
                className="p-3 border rounded bg-gray-100 text-black"
              />
            ))}
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
                    key !== "id" && (
                      <input
                        key={key}
                        type={key.includes("date") ? "date" : "text"}
                        name={key}
                        placeholder={key.replace(/([A-Z])/g, " $1").trim()}
                        value={editProduct[key]}
                        onChange={(e) =>
                          setEditProduct({
                            ...editProduct,
                            [key]:
                              key === "sellingPrice"
                                ? `₱${e.target.value.replace(/₱/g, "")}`
                                : e.target.value,
                          })
                        }
                        className="p-3 border rounded bg-gray-100 text-black"
                      />
                    )
                )}
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveChanges}
                  className="bg-purple-700 text-white px-4 py-2 rounded"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryPage;
