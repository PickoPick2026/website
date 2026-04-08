import { useEffect, useState } from "react";
import { User, Mail, Phone, Calendar, MapPin, Lock, Edit2, Save, X, Camera } from "lucide-react";
import { supabase } from "@/src/lib/supabase";
import toast from 'react-hot-toast';

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // 🔥 MAIN DATA (USED BY UI)
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    bio: "Tech enthusiast and gadget lover. Always looking for the latest electronics!",
    address: "India",
    country: "India",
  });

  // 🔥 EDIT STATE
  const [editData, setEditData] = useState(profileData);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // ✅ FETCH PROFILE FROM DB
  const fetchProfile = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const { data, error } = await supabase
      .from("customerList")
      .select("*")
      .eq("customerID", user.customerID)
      .single();

    if (error) {
      console.error(error);
      return;
    }

    const mapped = {
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      email: data.emailID || "",
      phone: data.phoneNumber || "",
      gender: data.gender || "",
      dateOfBirth: data.dob || "",
      bio: "Tech enthusiast and gadget lover. Always looking for the latest electronics!",
      address: "India",
      country: "India",
    };

    setProfileData(mapped);
    setEditData(mapped);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // 🔥 INPUT CHANGE
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handlePasswordChange = (e: any) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  // ✅ SAVE → UPDATE DB
  const handleSave = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const { error } = await supabase
      .from("customerList")
      .update({
        firstName: editData.firstName,
        lastName: editData.lastName,
        phoneNumber: editData.phone,
        gender: editData.gender,
        dob: editData.dateOfBirth,
        updated_at: new Date(),
      })
      .eq("customerID", user.customerID);

    if (error) {
      console.error(error);
      return;
    }

    setProfileData(editData);
    setIsEditing(false);
    toast.success("Profile updated ✅");
  };

  const handleCancel = () => {
    setEditData(profileData);
    setIsEditing(false);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword === passwordData.confirmPassword) {
      setIsChangingPassword(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      alert("Password changed successfully!");
    } else {
      alert("Passwords don't match!");
    }
  };
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">My Profile</h1>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit2 className="size-5" />
            Edit Profile
          </button>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Profile Picture & Quick Stats */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
            {/* Profile Picture */}
            <div className="relative mb-6">
              <div className="size-32 mx-auto bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <User className="size-16 text-white" />
              </div>
              {isEditing && (
                <button className="absolute bottom-0 right-1/2 translate-x-16 size-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors shadow-lg">
                  <Camera className="size-5" />
                </button>
              )}
            </div>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {profileData.firstName} {profileData.lastName}
              </h2>
              <p className="text-gray-600">{profileData.email}</p>
            </div>

            {/* Quick Stats 
            <div className="space-y-4 pt-6 border-t">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Member Since</span>
                <span className="font-semibold">Jan 2024</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Orders</span>
                <span className="font-semibold">47</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Spent</span>
                <span className="font-semibold text-blue-600">$12,450</span>
              </div>
            </div>
            */}
          </div>
        </div>

        {/* Right Column - Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Personal Information</h3>
              {isEditing && (
                <div className="flex gap-2">
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <X className="size-4" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Save className="size-4" />
                    Save Changes
                  </button>
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="firstName"
                    value={editData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                ) : (
                  <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg">
                    <User className="size-5 text-gray-400" />
                    <span className="text-gray-900">{profileData.firstName}</span>
                  </div>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="lastName"
                    value={editData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                ) : (
                  <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg">
                    <User className="size-5 text-gray-400" />
                    <span className="text-gray-900">{profileData.lastName}</span>
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={editData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                ) : (
                  <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg">
                    <Mail className="size-5 text-gray-400" />
                    <span className="text-gray-900">{profileData.email}</span>
                  </div>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={editData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                ) : (
                  <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg">
                    <Phone className="size-5 text-gray-400" />
                    <span className="text-gray-900">{profileData.phone}</span>
                  </div>
                )}
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                {isEditing ? (
                  <select
                    name="gender"
                    value={editData.gender}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                ) : (
                  <div className="px-4 py-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-900 capitalize">{profileData.gender}</span>
                  </div>
                )}
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={editData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                ) : (
                  <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg">
                    <Calendar className="size-5 text-gray-400" />
                    <span className="text-gray-900">
                      {new Date(profileData.dateOfBirth).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                )}
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City / State
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="address"
                    value={editData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                ) : (
                  <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg">
                    <MapPin className="size-5 text-gray-400" />
                    <span className="text-gray-900">{profileData.address}</span>
                  </div>
                )}
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                {isEditing ? (
                  <select
                    name="country"
                    value={editData.country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="India">India</option>
                    <option value="USA">United States</option>
                    <option value="UK">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                    <option value="Germany">Germany</option>
                    <option value="France">France</option>
                    <option value="Japan">Japan</option>
                  </select>
                ) : (
                  <div className="px-4 py-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-900">{profileData.country}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Bio 
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={editData.bio}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <div className="px-4 py-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-900">{profileData.bio}</p>
                </div>
              )}
            </div>

            */}
          </div>

          {/* Security Section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold">Security</h3>
                <p className="text-sm text-gray-600">Manage your password and security settings</p>
              </div>
              {!isChangingPassword && (
                <button
                  onClick={() => setIsChangingPassword(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Lock className="size-4" />
                  Change Password
                </button>
              )}
            </div>

            {isChangingPassword ? (
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Enter current password"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Enter new password"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Confirm new password"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Update Password
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsChangingPassword(false);
                      setPasswordData({
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                      });
                    }}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg">
                <Lock className="size-5 text-gray-400" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Password</p>
                  <p className="text-sm text-gray-600">Last changed 45 days ago</p>
                </div>
              </div>
            )}
          </div>

          {/* Account Preferences 
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-xl font-bold mb-6">Preferences</h3>
            
            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <p className="font-medium text-gray-900">Email Notifications</p>
                  <p className="text-sm text-gray-600">Receive order updates via email</p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="size-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <p className="font-medium text-gray-900">SMS Notifications</p>
                  <p className="text-sm text-gray-600">Get delivery alerts via SMS</p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="size-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <p className="font-medium text-gray-900">Marketing Emails</p>
                  <p className="text-sm text-gray-600">Receive offers and promotions</p>
                </div>
                <input
                  type="checkbox"
                  className="size-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </label>
            </div>
          </div>
          */}

          {/* Danger Zone */}
          <div className="bg-red-50 rounded-xl border-2 border-red-200 p-6">
            <h3 className="text-xl font-bold text-red-900 mb-2">Danger Zone</h3>
            <p className="text-sm text-red-700 mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
