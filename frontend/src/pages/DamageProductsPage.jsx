import { useState, useEffect } from "react";

const DamageProductPage = () => {
  const [inventoryList, setInventoryList] = useState([]);
  const [selectedInventoryId, setSelectedInventoryId] = useState("");
  const [damageType, setDamageType] = useState("");
  const [quantityDamaged, setQuantityDamaged] = useState(1);

  // Fetch available inventory to choose from
  useEffect(() => {
    const fetchInventory = async () => {
      const response = await fetch("http://localhost:8000/api/inventory/");
      const data = await response.json();
      setInventoryList(data);
    };

    fetchInventory();
  }, []);

  const handleSubmitDamage = async (e) => {
    e.preventDefault();
    const payload = {
      inventory_item: selectedInventoryId,
      damage_type: damageType,
      quantity_damaged: quantityDamaged,
    };

    try {
      const response = await fetch("http://localhost:8000/api/damage-products/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Damage Reported Successfully!");
        // Optionally clear fields
        setSelectedInventoryId("");
        setDamageType("");
        setQuantityDamaged(1);
      } else {
        alert("Failed to report damage");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Report Damaged Product</h1>

      <form onSubmit={handleSubmitDamage} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Select Inventory Item</label>
          <select
            value={selectedInventoryId}
            onChange={(e) => setSelectedInventoryId(e.target.value)}
            className="border p-2 w-full"
            required
          >
            <option value="">Select an Item</option>
            {inventoryList.map((item) => (
              <option key={item.id} value={item.id}>
                {item.product_name} - {item.serial_number}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Damage Type</label>
          <input
            type="text"
            value={damageType}
            onChange={(e) => setDamageType(e.target.value)}
            className="border p-2 w-full"
            placeholder="Ex: Cracked LCD"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Quantity Damaged</label>
          <input
            type="number"
            min="1"
            value={quantityDamaged}
            onChange={(e) => setQuantityDamaged(e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-purple-600 text-white p-2 rounded hover:bg-purple-700"
        >
          Report Damage
        </button>
      </form>
    </div>
  );
};

export default DamageProductPage;
