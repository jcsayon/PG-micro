import React, { useState, useEffect } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Search, Edit, Trash2, ChevronDown, Loader, User } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";
const CUSTOMERS_API = `${API_BASE_URL}/customers/`;

const CustomerSales = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    customer_type: "Walk-In",
    email: "",
    address: "",
    phone_number: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(CUSTOMERS_API);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setCustomers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const validate = () => {
    const err = {};
  
    if (!formData.name.trim()) err.name = "Name is required";
  
    if (!formData.email.trim()) err.email = "Email is required";
    else if (!formData.email.endsWith("@gmail.com")) err.email = "Must be a Gmail";
  
    const phoneStr = String(formData.phone_number || "").trim(); // Ensure it's a string
    if (phoneStr && !/^(\+639|09)\d{9}$/.test(phoneStr)) {
      err.phone_number = "Phone must start with 09 or +639 and be 11 digits";
    }
  
    setErrors(err);
    return Object.keys(err).length === 0;
  };
  

  const handleSave = async () => {
    if (!validate()) return;

    try {
      const res = await fetch(
        isEditing ? `${CUSTOMERS_API}${editingId}/` : CUSTOMERS_API,
        {
          method: isEditing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      if (!res.ok) throw new Error("Save failed");
      const data = await res.json();
      if (isEditing) {
        setCustomers((prev) =>
          prev.map((c) => (c.id === editingId ? data : c))
        );
      } else {
        setCustomers((prev) => [...prev, data]);
      }
      handleClear();
    } catch (err) {
      console.error(err);
      alert("Error saving client");
    }
  };

  const handleEdit = (id) => {
    const client = customers.find((c) => c.id === id);
    if (client) {
      setFormData(client);
      setIsEditing(true);
      setEditingId(id);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`${CUSTOMERS_API}${id}/`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      setCustomers((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  const handleClear = () => {
    setFormData({
      name: "",
      customer_type: "Walk-In",
      email: "",
      address: "",
      phone_number: "",
    });
    setErrors({});
    setIsEditing(false);
    setEditingId(null);
  };

  const filteredCustomers = customers.filter((c) =>
    `${c.name} ${c.email} ${c.phone_number}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const getInitials = (name) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);

  return (
    <DashboardLayout>
      <div className="p-4 h-screen flex flex-col">
        <div className="mb-3 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Client Directory</h1>
            <p className="text-gray-600">Add, view, and manage your client relationships</p>
          </div>
          <div className="w-72">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 p-3 border border-gray-300 rounded-lg w-full"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-grow">
          {/* Left Form */}
          <div className="lg:col-span-5">
            <div className="bg-white shadow rounded-lg overflow-hidden h-full flex flex-col max-h-[calc(100vh-100px)]">
              <div className="bg-indigo-600 px-6 py-4">
                <h3 className="text-lg font-bold text-white">
                  {isEditing ? "Update Client" : "Register New Client"}
                </h3>
              </div>
              <div className="p-4 flex-grow overflow-auto space-y-4">
                {/* Name */}
                <div>
                  <label className="text-sm font-medium text-gray-700">Client Name*</label>
                  <input
                    type="text"
                    className={`w-full px-3 py-2 border ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    } rounded`}
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Type */}
                <div>
                  <label className="text-sm font-medium text-gray-700">Client Type</label>
                  <select
                    value={formData.customer_type}
                    onChange={(e) =>
                      setFormData({ ...formData, customer_type: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  >
                    <option value="Walk-In">Walk-In</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>

                {/* Email */}
                <div>
                  <label className="text-sm font-medium text-gray-700">Email*</label>
                  <input
                    type="email"
                    className={`w-full px-3 py-2 border ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    } rounded`}
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label className="text-sm font-medium text-gray-700">Address</label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="text-sm font-medium text-gray-700">Contact Number</label>
                  <input
                    type="text"
                    className={`w-full px-3 py-2 border ${
                      errors.phone_number ? "border-red-500" : "border-gray-300"
                    } rounded`}
                    value={formData.phone_number}
                    onChange={(e) =>
                      setFormData({ ...formData, phone_number: e.target.value })
                    }
                  />
                  {errors.phone_number && (
                    <p className="text-xs text-red-500 mt-1">{errors.phone_number}</p>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex justify-between pt-2 border-t">
                  <button
                    onClick={handleClear}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded"
                  >
                    Clear
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-purple-700 text-white hover:bg-purple-800 rounded"
                  >
                    {isEditing ? "Update" : "Save"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Registry */}
          <div className="lg:col-span-7">
            <div className="bg-white shadow rounded-lg overflow-hidden h-full flex flex-col max-h-[calc(100vh-100px)]">
              <div className="bg-indigo-600 px-6 py-4 border-b border-purple-800 flex justify-between items-center">
                <h3 className="text-lg font-bold text-white">Client Registry</h3>
                <div className="text-sm text-white bg-indigo-500 bg-opacity-50 rounded-full px-3 py-1">
                  {filteredCustomers.length} client
                  {filteredCustomers.length !== 1 ? "s" : ""}
                </div>
              </div>

              <div className="overflow-y-auto flex-grow">
                {isLoading ? (
                  <div className="p-4 text-center text-gray-600">
                    <Loader className="animate-spin h-6 w-6 inline-block" />
                    <span className="ml-2">Loading...</span>
                  </div>
                ) : filteredCustomers.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    <User className="w-8 h-8 mx-auto mb-2" />
                    No clients found
                  </div>
                ) : (
                  filteredCustomers.map((c) => (
                    <div key={c.id} className="border-b hover:bg-gray-50 transition">
                      <div className="grid grid-cols-12 px-6 py-4 items-center">
                        <div className="col-span-3 flex items-center gap-3">
                          <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-800 font-bold text-sm">
                            {getInitials(c.name)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{c.name}</p>
                            <p className="text-xs text-gray-500">ID: {c.id}</p>
                          </div>
                        </div>
                        <div className="col-span-5">
                          <p className="text-sm">{c.email}</p>
                          <p className="text-sm text-gray-500">{c.phone_number || "No phone"}</p>
                        </div>
                        <div className="col-span-2 text-center">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              c.customer_type === "Walk-In"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {c.customer_type}
                          </span>
                        </div>
                        <div className="col-span-2 text-center space-x-2">
                          <button
                            onClick={() => handleEdit(c.id)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit className="inline-block w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(c.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="inline-block w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CustomerSales;
