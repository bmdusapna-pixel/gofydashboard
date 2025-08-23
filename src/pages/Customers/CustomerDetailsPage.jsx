import React from "react";
import { useParams, Link } from "react-router-dom";

import { Activity, Unlock, Lock, Trash2, RefreshCw } from "lucide-react";

const users = [
  {
    id: "CUST-001",
    name: "Alice Wonderland",
    email: "alice@example.com",
    mobile: "987-654-3210",
    totalSpent: 1250.75,
    walletBalance: 350.5,
    totalOrders: 15,
    cartItems: 2,
    country: "USA",
    state: "California",
    city: "San Francisco",
    pincode: "94103",
    loginActivity: [
      { date: "2025-08-20", time: "10:30 AM", device: "Chrome on Mac" },
      { date: "2025-08-19", time: "09:15 AM", device: "Firefox on Windows" },
    ],
    orderFunnelStatus: "Checked Out",
    tags: ["Loyal Customer", "High Spender"],
  },
  {
    id: "CUST-002",
    name: "Bob Builder",
    email: "bob@example.com",
    mobile: "123-456-7890",
    totalSpent: 250.0,
    walletBalance: 50.0,
    totalOrders: 3,
    cartItems: 0,
    country: "USA",
    state: "Texas",
    city: "Austin",
    pincode: "73301",
    loginActivity: [
      { date: "2025-08-21", time: "02:00 PM", device: "Safari on iPhone" },
      { date: "2025-08-18", time: "05:45 PM", device: "Chrome on Android" },
    ],
    orderFunnelStatus: "Browsing",
    tags: ["New User", "Mobile User"],
  },
  {
    id: "CUST-003",
    name: "Charlie Chaplin",
    email: "charlie@example.com",
    mobile: "555-123-4567",
    totalSpent: 89.99,
    walletBalance: 0.0,
    totalOrders: 1,
    cartItems: 5,
    country: "UK",
    state: "London",
    city: "London",
    pincode: "SW1A 0AA",
    loginActivity: [
      { date: "2025-08-23", time: "11:00 AM", device: "Edge on Windows" },
    ],
    orderFunnelStatus: "Cart Abandoned",
    tags: ["At-Risk", "First-time Buyer"],
  },
];

// Placeholder functions for user actions
const handleUserAction = (action, userId) => {
  console.log(`${action} action triggered for user: ${userId}`);
  // In a real app, this would be an API call
};

const resetPassword = (userId) => {
  console.log(`Password reset for user: ${userId}`);
  // In a real app, this would be an API call
};

const CustomerDetailsPage = () => {
  const { id } = useParams();
  const user = users.find((u) => u.id === id);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">User Not Found</h2>
          <p className="text-gray-600 mb-6">
            The user with ID "{id}" could not be found.
          </p>
          <Link
            to="/"
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Go Back to User List
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-primary-50">
      <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">User Profile</h2>
          <Link
            to="/"
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            Back to List
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-600 mb-1">
                  Total Spent
                </h3>
                <p className="text-2xl font-bold text-blue-600">
                  ₹{user.totalSpent.toFixed(2)}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-600 mb-1">
                  Wallet Balance
                </h3>
                <p className="text-2xl font-bold text-green-600">
                  ₹{user.walletBalance.toFixed(2)}
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-600 mb-1">
                  Total Orders
                </h3>
                <p className="text-2xl font-bold text-purple-600">
                  {user.totalOrders}
                </p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-600 mb-1">
                  Cart Items
                </h3>
                <p className="text-2xl font-bold text-orange-600">
                  {user.cartItems}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={user.name}
                      readOnly
                      className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email (Read-only)
                    </label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mobile
                    </label>
                    <input
                      type="text"
                      value={user.mobile}
                      readOnly
                      className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      User ID
                    </label>
                    <input
                      type="text"
                      value={user.id}
                      disabled
                      className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">Location Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      value={user.country}
                      readOnly
                      className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      value={user.state}
                      readOnly
                      className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={user.city}
                      readOnly
                      className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pincode
                    </label>
                    <input
                      type="text"
                      value={user.pincode}
                      readOnly
                      className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">Login Activity</h3>
                <div className="space-y-2">
                  {user.loginActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Activity className="w-4 h-4 text-blue-500" />
                        <span>
                          {activity.date} at {activity.time}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {activity.device}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Order Funnel Status</h3>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      user.orderFunnelStatus === "Browsing"
                        ? "bg-gray-400"
                        : user.orderFunnelStatus === "Added to Cart"
                        ? "bg-yellow-400"
                        : user.orderFunnelStatus === "Cart Abandoned"
                        ? "bg-red-400"
                        : "bg-green-400"
                    }`}
                  ></div>
                  <span className="text-sm">{user.orderFunnelStatus}</span>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">User Tags</h3>
                <div className="flex flex-wrap gap-1">
                  {user.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Account Actions
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => handleUserAction("enable", user.id)}
                    className="w-full group flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-green-200"
                  >
                    <div className="flex items-center justify-center w-8 h-8 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
                      <Unlock className="w-4 h-4" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium">Enable Account</div>
                      <div className="text-xs text-green-100">
                        Activate user access
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => resetPassword(user.id)}
                    className="w-full group flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-orange-200"
                  >
                    <div className="flex items-center justify-center w-8 h-8 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
                      <RefreshCw className="w-4 h-4" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium">Reset Password</div>
                      <div className="text-xs text-orange-100">
                        Generate new password
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleUserAction("disable", user.id)}
                    className="w-full group flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-red-200"
                  >
                    <div className="flex items-center justify-center w-8 h-8 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium">Disable Account</div>
                      <div className="text-xs text-red-100">
                        Suspend user access
                      </div>
                    </div>
                  </button>

                  <div className="pt-2 mt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleUserAction("delete", user.id)}
                      className="w-full group flex items-center gap-3 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-600 border-2 border-transparent hover:border-red-200 transition-all duration-200"
                    >
                      <div className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-lg group-hover:bg-red-100 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-medium">Delete Account</div>
                        <div className="text-xs text-gray-500 group-hover:text-red-400">
                          Permanently remove user
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailsPage;
