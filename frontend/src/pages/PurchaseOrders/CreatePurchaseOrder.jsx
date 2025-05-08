
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreatePurchaseOrder = () => {
  const navigate = useNavigate();

  const [supplier, setSupplier] = useState("");
  const [orderDate, setOrderDate] = useState("");
  const [items, setItems] = useState([{ name: "", quantity: 0, price: 0 }]);

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  const handleAddItem = () => {
    setItems([...items, { name: "", quantity: 0, price: 0 }]);
  };

  const handleRemoveItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newOrder = {
      supplier,
      orderDate,
      items,
    };

    console.log("New Purchase Order:", newOrder);
    alert("Purchase Order Created!");
    navigate("/purchase-orders");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-purple-600 mb-4">Create New Purchase Order</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 text-gray-700">Supplier</label>
          <input
            type="text"
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter supplier name"
          />
        </div>
        <div>
          <label className="block mb-1 text-gray-700">Order Date</label>
          <input
            type="date"
            value={orderDate}
            onChange={(e) => setOrderDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block mb-1 text-gray-700">Items</label>
          {items.map((item, index) => (
            <div key={index} className="flex space-x-2 mb-2">
              <input
                type="text"
                value={item.name}
                onChange={(e) => handleItemChange(index, "name", e.target.value)}
                placeholder="Item Name"
                className="w-full p-2 border border-gray-300 rounded"
              />
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                placeholder="Quantity"
                className="w-1/4 p-2 border border-gray-300 rounded"
              />
              <input
                type="number"
                value={item.price}
                onChange={(e) => handleItemChange(index, "price", e.target.value)}
                placeholder="Price"
                className="w-1/4 p-2 border border-gray-300 rounded"
              />
              <button
                type="button"
                onClick={() => handleRemoveItem(index)}
                className="bg-red-500 text-white px-3 rounded"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddItem}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Item
          </button>
        </div>
        <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreatePurchaseOrder;
