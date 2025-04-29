import { useState, useEffect } from "react";

const DamageProductListPage = () => {
  const [damageList, setDamageList] = useState([]);

  useEffect(() => {
    const fetchDamageProducts = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/damage-products/");
        const data = await response.json();
        setDamageList(data);
      } catch (error) {
        console.error("Error fetching damage products:", error);
      }
    };

    fetchDamageProducts();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Damaged Products Report</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-md">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b">Inventory Item</th>
              <th className="py-2 px-4 border-b">Damage Type</th>
              <th className="py-2 px-4 border-b">Quantity Damaged</th>
              <th className="py-2 px-4 border-b">Date Reported</th>
            </tr>
          </thead>
          <tbody>
            {damageList.length > 0 ? (
              damageList.map((damage) => (
                <tr key={damage.id} className="text-center">
                  <td className="py-2 px-4 border-b">{damage.inventory_item}</td>
                  <td className="py-2 px-4 border-b">{damage.damage_type}</td>
                  <td className="py-2 px-4 border-b">{damage.quantity_damaged}</td>
                  <td className="py-2 px-4 border-b">
                    {new Date(damage.date_reported).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-4">No damage reports found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DamageProductListPage;
