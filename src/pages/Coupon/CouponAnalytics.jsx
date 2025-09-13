import React, { useState } from "react";
import { X } from "lucide-react";

const dummyCoupons = [
  {
    _id: "1",
    code: "SAVE10",
    usedCount: 3,
    orders: [
      { orderId: "ORD001", user: "John Doe", phone: "+91-9876543210" },
      { orderId: "ORD002", user: "Jane Smith", phone: "+91-9123456780" },
      { orderId: "ORD003", user: "Alice Johnson", phone: "+91-9988776655" },
    ],
  },
  {
    _id: "2",
    code: "FREESHIP",
    usedCount: 2,
    orders: [
      { orderId: "ORD004", user: "Bob Brown", phone: "+91-9876123450" },
      { orderId: "ORD005", user: "Charlie Green", phone: "+91-9812345670" },
    ],
  },
];

export default function CouponAnalytics() {
  const [selectedCouponOrders, setSelectedCouponOrders] = useState(null);
  const [selectedCouponCode, setSelectedCouponCode] = useState("");

  const openModal = (coupon) => {
    setSelectedCouponOrders(coupon.orders);
    setSelectedCouponCode(coupon.code);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-primary-50">
      <h1 className="text-2xl font-bold mb-6">Coupon Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dummyCoupons.map((coupon) => (
          <div
            key={coupon._id}
            className="bg-white p-5 rounded-lg shadow hover:shadow-md transition cursor-pointer"
            onClick={() => openModal(coupon)}
          >
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-lg">{coupon.code}</h2>
              <span className="text-sm text-gray-500">
                Used: {coupon.usedCount}
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-400">
              Click to see orders and user details
            </p>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedCouponOrders && (
        <div
          className="fixed inset-0 flex items-start justify-center z-50 p-4"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 relative overflow-auto max-h-[80vh]">
            <button
              onClick={() => setSelectedCouponOrders(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold mb-4">
              Orders Using {selectedCouponCode}
            </h2>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                      #
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                      Order ID
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                      User
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                      Phone
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedCouponOrders.map((order, index) => (
                    <tr key={order.orderId} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm text-gray-600">
                        {index + 1}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-800">
                        {order.orderId}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-800">
                        {order.user}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-800">
                        {order.phone}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
