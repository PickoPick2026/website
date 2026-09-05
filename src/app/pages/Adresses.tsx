import { useEffect, useState } from "react";
import { MapPin, Plus, Edit, Trash2, Home, Briefcase, X } from "lucide-react";
import { supabase } from "@/src/lib/supabase";
import { toast } from "sonner";

interface AddressForm {
  addressID?: number | string;
  type: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

const emptyForm: AddressForm = {
  type: "home",
  name: "",
  phone: "",
  street: "",
  city: "",
  state: "",
  zipCode: "",
  isDefault: false,
};

export default function Addresses() {
  const [addresses, setAddresses] = useState<AddressForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<number | string | null>(null);
  const [formData, setFormData] = useState<AddressForm>(emptyForm);

  const getUser = () => JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    const user = getUser();
    if (!user?.customerID) {
      setLoading(false);
      return;
    }

    const [{ data, error }, { data: customer }] = await Promise.all([
      supabase.from("addressTable").select("*").eq("customerID", user.customerID),
      supabase.from("customerList").select("firstName, phoneNumber").eq("customerID", user.customerID).maybeSingle(),
    ]);

    if (error) {
      console.error(error);
      toast.error("Could not load your addresses");
      setLoading(false);
      return;
    }

    const formatted: AddressForm[] = (data || []).map((item) => {
      const parts = (item.addressDetails || "").split(",");
      return {
        addressID: item.addressID,
        type: item.addressType || "home",
        isDefault: !!item.isDefault,
        street: parts[0]?.trim() || "",
        city: parts[1]?.trim() || "",
        state: parts[2]?.trim() || "",
        zipCode: parts[3]?.trim() || "",
        name: item.recipient_name || customer?.firstName || "",
        phone: item.recipient_phone || customer?.phoneNumber || "",
      };
    });

    setAddresses(formatted);
    setLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const openAdd = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setShowAddForm(true);
  };

  const handleEdit = (address: AddressForm) => {
    setEditingId(address.addressID ?? null);
    setFormData({ ...emptyForm, ...address });
    setShowAddForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;

    const user = getUser();
    if (!user?.customerID) {
      toast.error("Please log in to manage addresses");
      return;
    }

    setSaving(true);
    try {
      const addressDetails = [formData.street, formData.city, formData.state, formData.zipCode]
        .map((p) => (p || "").trim())
        .join(", ");

      const payload = {
        addressType: formData.type,
        addressDetails,
        addressStatus: true,
        isDefault: !!formData.isDefault,
        customerID: user.customerID,
        recipient_name: formData.name || null,
        recipient_phone: formData.phone || null,
      };

      let savedId = editingId;

      if (editingId != null) {
        const { error } = await supabase
          .from("addressTable")
          .update(payload)
          .eq("addressID", editingId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("addressTable")
          .insert([payload])
          .select("addressID")
          .single();
        if (error) throw error;
        savedId = data?.addressID ?? null;
      }

      // Only one address can be default.
      if (formData.isDefault && savedId != null) {
        await supabase
          .from("addressTable")
          .update({ isDefault: false })
          .eq("customerID", user.customerID)
          .neq("addressID", savedId);
      }

      await fetchAddresses();
      setShowAddForm(false);
      setEditingId(null);
      setFormData(emptyForm);
      toast.success(editingId != null ? "Address updated" : "Address added");
    } catch (err) {
      console.error(err);
      toast.error("Could not save the address. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number | string) => {
    if (!window.confirm("Delete this address?")) return;

    const { error } = await supabase.from("addressTable").delete().eq("addressID", id);
    if (error) {
      console.error(error);
      toast.error("Could not delete the address");
      return;
    }
    await fetchAddresses();
    toast.success("Address removed");
  };

  const setAsDefault = async (id: number | string) => {
    const user = getUser();
    if (!user?.customerID) return;

    const { error: clearError } = await supabase
      .from("addressTable")
      .update({ isDefault: false })
      .eq("customerID", user.customerID);

    const { error: setError } = await supabase
      .from("addressTable")
      .update({ isDefault: true })
      .eq("addressID", id);

    if (clearError || setError) {
      console.error(clearError || setError);
      toast.error("Could not update the default address");
      return;
    }

    await fetchAddresses();
    toast.success("Default address updated");
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
          onClick={openAdd}
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
                {editingId != null ? "Edit Address" : "Add New Address"}
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
                  placeholder="Recipient name"
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
                  placeholder="+91 98765 43210"
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
                  placeholder="House / flat, street, area"
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
                    placeholder="Chennai"
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
                    placeholder="Tamil Nadu"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    PIN Code
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0B56D9] focus:border-transparent outline-none transition"
                    placeholder="600001"
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
                  disabled={saving}
                  className="flex-1 bg-[#0B56D9] text-white py-3 rounded-xl font-semibold hover:bg-[#0849B7] transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Saving…" : editingId != null ? "Update Address" : "Add Address"}
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
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-52 animate-pulse rounded-2xl border border-slate-200 bg-white" />
          ))}
        </div>
      ) : addresses.length === 0 ? (
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
                    onClick={() => address.addressID != null && handleDelete(address.addressID)}
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
                  {[address.city, address.state, address.zipCode].filter(Boolean).join(", ")}
                </p>
              </div>

              {!address.isDefault && (
                <button
                  onClick={() => address.addressID != null && setAsDefault(address.addressID)}
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
