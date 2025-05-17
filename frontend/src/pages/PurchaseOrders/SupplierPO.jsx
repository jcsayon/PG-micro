import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { X } from "lucide-react";

// Base URL for backend API (Vite env variable)
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
// Reusable InputField Component
const InputField = ({ label, value, onChange, type = "text", disabled = false }) => (
  <div>
    {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
    <input
      type={type}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full px-3 py-2 border ${disabled ? 'bg-transparent border-0' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'} rounded-md shadow-sm sm:text-sm`}
    />
  </div>
);

// Modal for Managing Catalog
const ManageCatalogModal = ({ isOpen, onClose, supplier, products, onSave }) => {
  const [selection, setSelection] = useState([]);

  useEffect(() => {
    if (supplier?.catalog) {
      setSelection(supplier.catalog);
    }
  }, [supplier]);

  if (!isOpen || !supplier) return null;

  const toggle = (id) => {
    setSelection(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    onSave(supplier.id, selection);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-900/80 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-4/5 max-w-2xl max-h-[90vh] overflow-auto">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Manage Catalog for {supplier.name}</h2>
          <button onClick={onClose} className="text-white hover:text-black">
            <X className="h-6 w-6 bg-red-500 rounded" />
          </button>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {products.map(p => (
              <label key={p.id} className="flex items-center p-2 border rounded">
                <input
                  type="checkbox"
                  checked={selection.includes(p.id)}
                  onChange={() => toggle(p.id)}
                  className="mr-2"
                />
                <span>{p.brand} {p.model} (ID: {p.id})</span>
              </label>
            ))}
          </div>
        </div>
        <div className="p-4 border-t flex justify-end gap-2">
          <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

const SupplierPO = () => {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [newSupplier, setNewSupplier] = useState({ name: "", address: "", email: "", contact: "" });
  const [modalOpen, setModalOpen] = useState(false);
  const [activeSupplier, setActiveSupplier] = useState(null);

  // Load suppliers & products
  useEffect(() => {
    fetch(`${API_BASE_URL}/suppliers/`)
      .then(res => res.json())
      .then(data => setSuppliers(data))
      .catch(err => console.error(err));

    fetch(`${API_BASE_URL}/products/`)
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error(err));
  }, []);

  // Add supplier
  const addSupplier = () => {
    if (!newSupplier.name || !newSupplier.address) return;
    fetch(`${API_BASE_URL}/suppliers/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newSupplier, catalog: [] }),
    })
      .then(res => res.json())
      .then(created => setSuppliers(prev => [...prev, created]))
      .catch(err => console.error(err));
    setNewSupplier({ name: "", address: "", email: "", contact: "" });
  };

  // Edit supplier field
  const updateSupplierField = (id, field, value) => {
    setSuppliers(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  // Save edited supplier
  const saveSupplier = (supplier) => {
    fetch(`${API_BASE_URL}/suppliers/${supplier.id}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(supplier),
    })
      .then(res => res.json())
      .then(updated => setSuppliers(prev => prev.map(s => s.id === updated.id ? updated : s)))
      .catch(err => console.error(err));
  };

  // Delete supplier
  const deleteSupplier = (id) => {
    fetch(`${API_BASE_URL}/suppliers/${id}/`, { method: 'DELETE' })
      .then(() => setSuppliers(prev => prev.filter(s => s.id !== id)))
      .catch(err => console.error(err));
  };

  // Open catalog modal
  const openCatalog = (supplier) => {
    setActiveSupplier(supplier);
    setModalOpen(true);
  };

  // Save catalog changes
  const saveCatalog = (supplierId, catalogIds) => {
    fetch(`${API_BASE_URL}/suppliers/${supplierId}/catalog/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ catalog: catalogIds }),
    })
      .then(res => res.json())
      .then(updated => setSuppliers(prev => prev.map(s => s.id === updated.id ? updated : s)))
      .catch(err => console.error(err));
  };

  return (
    <DashboardLayout>
      <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Manage Suppliers</h1>
        <table className="min-w-full bg-white mb-6">
          <thead className="bg-gray-50">
            <tr>
              <th>ID</th><th>Name</th><th>Address</th><th>Email</th><th>Contact</th><th>Catalog</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map(s => (
              <tr key={s.id} className="border-b">
                <td className="p-2">{s.id}</td>
                {['name','address','email','contact'].map(f => (
                  <td key={f} className="p-2">
                    <InputField
                      value={s[f] || ''}
                      disabled={false}
                      onChange={e => updateSupplierField(s.id, f, e.target.value)}
                    />
                  </td>
                ))}
                <td className="p-2 text-center">
                  <button onClick={() => openCatalog(s)} className="px-2 py-1 bg-indigo-200 rounded">
                    Edit ({s.catalog?.length || 0})
                  </button>
                </td>
                <td className="p-2 space-x-2">
                  <button onClick={() => saveSupplier(s)} className="px-2 py-1 bg-emerald-200 rounded">Save</button>
                  <button onClick={() => deleteSupplier(s.id)} className="px-2 py-1 bg-red-200 rounded">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Add New Supplier</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <InputField label="Name" value={newSupplier.name} onChange={e => setNewSupplier({...newSupplier,name: e.target.value})} />
            <InputField label="Address" value={newSupplier.address} onChange={e => setNewSupplier({...newSupplier,address: e.target.value})} />
            <InputField label="Email" type="email" value={newSupplier.email} onChange={e => setNewSupplier({...newSupplier,email: e.target.value})} />
            <InputField label="Contact" value={newSupplier.contact} onChange={e => setNewSupplier({...newSupplier,contact: e.target.value})} />
          </div>
          <button onClick={addSupplier} className="px-4 py-2 bg-indigo-600 text-white rounded">Add Supplier</button>
        </div>

        {activeSupplier && (
          <ManageCatalogModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            supplier={activeSupplier}
            products={products}
            onSave={saveCatalog}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default SupplierPO;