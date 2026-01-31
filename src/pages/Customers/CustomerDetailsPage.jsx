import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Activity,
  Unlock,
  Lock,
  Trash2,
  RefreshCw,
  Wallet,
  MapPin,
} from "lucide-react";
import api from "../../api/axios";

// const users = [
//   {
//     id: "CUST-001",
//     name: "Alice Wonderland",
//     email: "alice@example.com",
//     mobile: "987-654-3210",
//     source: "Web", // New: User source
//     totalSpent: 1250.75,
//     walletDetails: {
//       // New: Wallet details object
//       balance: 350.5,
//       lastUpdated: "2025-08-25",
//     },
//     totalOrders: 15,
//     cartItems: 2,
//     country: "USA",
//     state: "California",
//     city: "San Francisco",
//     pincode: "94103",
//     savedAddresses: [
//       // New: Saved addresses array
//       {
//         address: "123 Main Street, Apt 4B, San Francisco, CA 94103",
//         isDefault: true,
//       },
//       { address: "456 Oak Avenue, San Francisco, CA 94103", isDefault: false },
//     ],
//     loginActivity: [
//       { date: "2025-08-20", time: "10:30 AM", device: "Chrome on Mac" },
//       { date: "2025-08-19", time: "09:15 AM", device: "Firefox on Windows" },
//     ],
//     orderFunnelStatus: "Checked Out",
//     tags: ["Loyal Customer", "High Spender"],
//   },
//   {
//     id: "CUST-002",
//     name: "Bob Builder",
//     email: "bob@example.com",
//     mobile: "123-456-7890",
//     source: "App", // New: User source
//     totalSpent: 250.0,
//     walletDetails: {
//       // New: Wallet details object
//       balance: 50.0,
//       lastUpdated: "2025-08-26",
//     },
//     totalOrders: 3,
//     cartItems: 0,
//     country: "USA",
//     state: "Texas",
//     city: "Austin",
//     pincode: "73301",
//     savedAddresses: [
//       // New: Saved addresses array
//       { address: "789 Pine Street, Austin, TX 73301", isDefault: true },
//     ],
//     loginActivity: [
//       { date: "2025-08-21", time: "02:00 PM", device: "Safari on iPhone" },
//       { date: "2025-08-18", time: "05:45 PM", device: "Chrome on Android" },
//     ],
//     orderFunnelStatus: "Browsing",
//     tags: ["New User", "Mobile User"],
//   },
//   {
//     id: "CUST-003",
//     name: "Charlie Chaplin",
//     email: "charlie@example.com",
//     mobile: "555-123-4567",
//     source: "Web", // New: User source
//     totalSpent: 89.99,
//     walletDetails: {
//       // New: Wallet details object
//       balance: 0.0,
//       lastUpdated: "2025-08-27",
//     },
//     totalOrders: 1,
//     cartItems: 5,
//     country: "UK",
//     state: "London",
//     city: "London",
//     pincode: "SW1A 0AA",
//     savedAddresses: [], // New: Empty addresses array
//     loginActivity: [
//       { date: "2025-08-23", time: "11:00 AM", device: "Edge on Windows" },
//     ],
//     orderFunnelStatus: "Cart Abandoned",
//     tags: ["At-Risk", "First-time Buyer"],
//   },
// ];

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
  const [user,setUser] = useState(null);
  const [orders,setOrders] = useState([])
  const { id } = useParams();
  console.log(id)
  useEffect(()=>{
    const fetchDetail = async ()=>{
      try {
        const res= await api.get(`user/auth/profile/${id}`)
        console.log(res.data.user)
        setUser(res.data.user)
      } 
      catch (error) {
        console.log(error)
      }
    }
    const fetchOrders = async () => {
      try {
        const res = await api.get(`order/user/${id}`)
        console.log(res.data)
        setOrders(res.data)
      } catch (error) {
        console.log(error)
      }
    }
    fetchDetail();
    fetchOrders();
  },[id])

  console.log("orders",orders)

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-primary-50">
      <div className=" rounded-lg shadow-sm p-6 border border-primary-100 bg-white">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">User Profile</h2>
          <Link
            to="/customers"
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            Back to List
          </Link>
        </div>
        {!user ? (
  <p className="text-gray-500">No User Found.....</p>
) : (
  <>
    {/* Profile Header */}
    <div className="flex items-center gap-6 mb-6">
      <img
        src={user.profileImg || "https://placehold.co/100x100"}
        alt={user.name}
        className="w-24 h-24 rounded-full border"
      />

      <div>
        <h3 className="text-2xl font-semibold">{user.name}</h3>
        <p className="text-gray-600">{user.email}</p>
        <p className="text-gray-600">{user.phone}</p>
      </div>
    </div>

    {/* User Stats */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-gray-50 p-4 rounded border">
        <p className="text-sm text-gray-500">Points</p>
        <p className="font-semibold">{user.point}</p>
      </div>

      <div className="bg-gray-50 p-4 rounded border">
        <p className="text-sm text-gray-500">Age Group</p>
        <p className="font-semibold">{user.age || "N/A"}</p>
      </div>

      <div className="bg-gray-50 p-4 rounded border">
        <p className="text-sm text-gray-500">Total Orders</p>
        <p className="font-semibold">{user.totalOrders || "N/A"}</p>
      </div>

      <div className="bg-gray-50 p-4 rounded border">
        <p className="text-sm text-gray-500">Total Spent</p>
        <p className="font-semibold">{user.totalSpent || "N/A"}</p>
      </div>
    </div>

    {/* User Tags */}
<div className="mb-6">
  <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
    🏷️ User Tags
  </h4>

  {user.tags?.length === 0 ? (
    <p className="text-gray-500 text-sm">No tags assigned</p>
  ) : (
    <div className="flex flex-wrap gap-2">
      {user.tags.map((tag, index) => (
        <span
          key={index}
          className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-700 border border-blue-200"
        >
          {tag}
        </span>
      ))}
    </div>
  )}
</div>


    {/* Addresses */}
    <div className="mb-6">
      <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
        <MapPin size={18} /> Saved Addresses
      </h4>

      {user.addresses?.length === 0 ? (
        <p className="text-gray-500">No addresses found</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {user.addresses.map((addr) => (
            <div
              key={addr._id}
              className="border rounded-lg p-4 bg-gray-50"
            >
              <p className="font-semibold">{addr.nickname}</p>
              <p className="text-sm text-gray-600">
                {addr.houseStreet}, {addr.apartment}
              </p>
              <p className="text-sm text-gray-600">
                {addr.city}, {addr.district}
              </p>
              <p className="text-sm text-gray-600">
                {addr.state}, {addr.country} - {addr.zipCode}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>

    {/* Account Info */}
    <div className="border-t pt-4 text-sm text-gray-500">
      <p>Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
      <p>Last Updated: {new Date(user.updatedAt).toLocaleDateString()}</p>
    </div>
    {/* ORDER HISTORY */}
<div className="mt-8">
  <h3 className="text-xl font-semibold mb-4">Order History</h3>

  {orders.length === 0 ? (
    <p className="text-gray-500">No orders found</p>
  ) : (
    <div className="space-y-6">
      {orders.map((order) => (
        <div
          key={order._id}
          className="border rounded-lg p-5 bg-white shadow-sm"
        >
          {/* Order Header */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="font-semibold">
                Order ID: {order.orderId}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>

            <span className="px-3 py-1 text-sm rounded-full bg-yellow-100 text-yellow-700">
              {order.orderStatus}
            </span>
          </div>

          {/* Items */}
          <div className="divide-y">
            {order.items.map((item) => (
              <div
                key={item.productId}
                className="flex gap-4 py-3"
              >
                <img
                  src={item.image}
                  alt={item.productName}
                  className="w-16 h-16 rounded border"
                />

                <div className="flex-1">
                  <p className="font-medium">{item.productName}</p>
                  <p className="text-sm text-gray-500">
                    Age Group: {item.ageGroupName}
                  </p>
                  <p className="text-sm text-gray-500">
                    Qty: {item.quantity}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-semibold">₹{item.totalPrice}</p>
                  <p className="text-sm line-through text-gray-400">
                    ₹{item.totalCutPrice}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Summary */}
          <div className="mt-4 border-t pt-4 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{order.pricing.subtotal}</span>
            </div>

            <div className="flex justify-between">
              <span>Discount</span>
              <span className="text-green-600">
                -₹{order.pricing.totalDiscount}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Delivery</span>
              <span>₹{order.pricing.deliveryCharges}</span>
            </div>

            <div className="flex justify-between font-semibold text-base mt-2">
              <span>Total</span>
              <span>₹{order.pricing.total}</span>
            </div>
          </div>

          {/* Address & Payment */}
          <div className="mt-4 grid md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <p className="font-medium text-gray-800">Shipping Address</p>
              <p>
                {order.shippingAddress.houseStreet},{" "}
                {order.shippingAddress.city},{" "}
                {order.shippingAddress.state} -{" "}
                {order.shippingAddress.zipCode}
              </p>
            </div>

            <div>
              <p className="font-medium text-gray-800">Payment</p>
              <p>Method: {order.paymentMethod}</p>
              <p>Status: {order.paymentStatus}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )}
</div>

  </>
)}

       
      </div>
    </div>
  );
};

export default CustomerDetailsPage;