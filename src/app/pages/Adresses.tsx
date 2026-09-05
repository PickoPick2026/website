import { useEffect, useState } from "react";
import { MapPin, Plus, Edit, Trash2, Home, Briefcase, X } from "lucide-react";
import { supabase } from "@/src/lib/supabase";

interface Address {
  id: number;
  type: "home" | "work" | "other";
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}



export default function Addresses() {
  
  const [addresses, setAddresses] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState<Partial<Address>>({
    type: "home",
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    isDefault: false,
  });

  useEffect(() => {
  fetchAddresses();
}, []);

const fetchAddresses = async () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const { data, error } = await supabase
    .from("addressTable")
    .select("*")
    .eq("customerID", user.customerID);

  if (error) {
    console.error(error);
    return;
  }

  const { data: customer } = await supabase
  .from("customerList")
  .select("*")
  .eq("customerID", user.customerID)
  .single();

  // 🔥 ADD THIS PART (VERY IMPORTANT)
  const formatted = data.map((item) => {
    const parts = item.addressDetails?.split(",") || [];

    return {
      addressID: item.addressID,
      type: item.addressType,
      isDefault: item.isDefault,

      street: parts[0]?.trim() || "",
      city: parts[1]?.trim() || "",
      state: parts[2]?.trim() || "",
      zipCode: parts[3]?.trim() || "",

    name: customer?.firstName || "User",
    phone: customer?.phoneNumber || "N/A",
    };
  });

  // ✅ SET FORMATTED DATA
  setAddresses(formatted);
};

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const addressDetails = `${formData.street}, ${formData.city}, ${formData.state}, ${formData.zipCode}`;

  if (!editingAddress) {
    const { error } = await supabase.from("addressTable").insert([
      {
        addressType: formData.type,
        addressDetails,
        addressStatus: true,
        isDefault: formData.isDefault,
        customerID: user.customerID ,
      },
    ]);

    if (!error) {
      fetchAddresses();
    }
  }

  setShowAddForm(false);
};

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setFormData(address);
    setShowAddForm(true);
  };

 const handleDelete = async (id: string) => {
  await supabase
    .from("addressTable")
    .delete()
    .eq("addressID", id);

  fetchAddresses();
};

  const setAsDefault = (id: number) => {
    setAddresses(
      addresses.map((addr) => ({
        ...addr,
        isDefault: addr.addressID === id 
      }))
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "home":
        return <Home className="size-5" />;
      case "work":
        return <Briefcase className="size-5" />;
      default:
        return <MapPin className="size-5" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-[#0A1931]">My Addresses</h1>
        <button
          onClick={() => {
            setEditingAddress(null);
            setFormData({
              type: "home",
              name: "",
              phone: "",
              street: "",
              city: "",
              state: "",
              zipCode: "",
              isDefault: false,
            });
            setShowAddForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-[#0B56D9] text-white rounded-xl hover:bg-[#0849B7] transition-colors"
        >
          <Plus className="size-5" />
          Add New Address
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-extrabold tracking-tight text-[#0A1931]">
                {editingAddress ? "Edit Address" : "Add New Address"}
              </h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X className="size-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Address Type */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Address Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0B56D9] focus:border-transparent outline-none transition"
                  required
                >
                  <option value="home">Home</option>
                  <option value="work">Work</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0B56D9] focus:border-transparent outline-none transition"
                  placeholder="John Doe"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0B56D9] focus:border-transparent outline-none transition"
                  placeholder="+1 (555) 123-4567"
                  required
                />
              </div>

              {/* Street Address */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Street Address
                </label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0B56D9] focus:border-transparent outline-none transition"
                  placeholder="123 Main Street, Apt 4B"
                  required
                />
              </div>

              {/* City, State, Zip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0B56D9] focus:border-transparent outline-none transition"
                    placeholder="San Francisco"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0B56D9] focus:border-transparent outline-none transition"
                    placeholder="CA"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0B56D9] focus:border-transparent outline-none transition"
                    placeholder="94102"
                    required
                  />
                </div>
              </div>

              {/* Default Address */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleInputChange}
                  className="size-4 rounded border-slate-300 text-[#0B56D9] focus:ring-[#0B56D9]"
                />
                <span className="text-sm text-slate-700">Set as default address</span>
              </label>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-[#0B56D9] text-white py-3 rounded-xl font-semibold hover:bg-[#0849B7] transition-colors"
                >
                  {editingAddress ? "Update Address" : "Add Address"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Addresses Grid */}
      {addresses.length === 0 ? (
        <div className="text-center py-16">
          <MapPin className="size-24 mx-auto text-slate-300 mb-6" />
          <h2 className="text-2xl font-extrabold tracking-tight text-[#0A1931] mb-4">No addresses yet</h2>
          <p className="text-slate-500 mb-8">Add an address to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {addresses.map((address) => (
            <div
              key={address.addressID}
              className={`bg-white rounded-2xl border p-6 transition-colors ${
                address.isDefault ? "border-[#0B56D9] ring-2 ring-[#0B56D9]/20" : "border-slate-200"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#0B56D9]/10 text-[#0B56D9] rounded-xl">
                    {getTypeIcon(address.type)}
                  </div>
                  <div>
                    <p className="font-semibold capitalize text-[#0A1931]">{address.type}</p>
                    {address.isDefault && (
                      <span className="text-xs font-semibold bg-[#0B56D9]/10 text-[#0B56D9] px-2 py-0.5 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(address)}
                    className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    <Edit className="size-4" />
                  </button>
                  <button
                    onClick={() =>handleDelete(address.addressID)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-slate-600 mb-4">
                <p className="font-semibold text-[#0A1931]">{address.name}</p>
                <p className="text-sm">{address.phone}</p>
                <p className="text-sm">{address.street}</p>
                <p className="text-sm">
                  {address.city}, {address.state} {address.zipCode}
                </p>
              </div>

              {!address.isDefault && (
                <button
                  onClick={() => setAsDefault(address.addressID)}
                  className="w-full px-4 py-2 font-semibold text-[#0B56D9] border border-[#0B56D9] rounded-xl hover:bg-[#0B56D9]/5 transition-colors"
                >
                  Set as Default
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
