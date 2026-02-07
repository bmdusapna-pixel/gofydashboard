import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  Truck,
  MapPin,
  CreditCard,
  Calendar,
  User,
  Phone,
  Mail,
  FileText,
  Download,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import axios from "axios";
import api from "../../api/axios";

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      console.log(orderId)
      const response = await api.get(`admin/order/${orderId}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });
      console.log(response.data)

      if (response.data.success) {
        setOrder(response.data.order);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch order details");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const statusColors = {
      PLACED: "bg-blue-100 text-blue-800",
      CONFIRMED: "bg-green-100 text-green-800",
      PROCESSING: "bg-yellow-100 text-yellow-800",
      SHIPPED: "bg-indigo-100 text-indigo-800",
      DELIVERED: "bg-green-100 text-green-800",
      CANCELLED: "bg-red-100 text-red-800",
      RETURNED: "bg-gray-100 text-gray-800",
    };
    return statusColors[status] || "bg-gray-100 text-gray-800";
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      PENDING: "bg-yellow-100 text-yellow-800",
      PAID: "bg-green-100 text-green-800",
      FAILED: "bg-red-100 text-red-800",
      REFUNDED: "bg-purple-100 text-purple-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 text-lg">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 overflow-auto">
      <div className="max-w-7xl mx-auto pb-10">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Orders
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Order Details
              </h1>
              <p className="text-gray-600 mt-1">Order ID: {order._id}</p>
            </div>
            <div className="flex gap-3">
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                  order.orderStatus
                )}`}
              >
                {order.orderStatus}
              </span>
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${getPaymentStatusColor(
                  order.paymentStatus
                )}`}
              >
                {order.paymentStatus}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Order Items & Summary */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                Order Items
              </h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <img
                      src={item.productId?.images?.[0] || "/placeholder.png"}
                      alt={item.productId?.name}
                      className="w-24 h-24 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {item.productId?.name}
                      </h3>
                      <div className="text-sm text-gray-600 mt-1 space-y-1">
                        {item.colorId && (
                          <p>Color: {item.colorId.name}</p>
                        )}
                        {item.ageGroupId && (
                          <p>Age Group: {item.ageGroupId.ageRange}</p>
                        )}
                        <p>Quantity: {item.quantity}</p>
                        <p className="font-semibold text-gray-900">
                          Price: {formatCurrency(order.pricing.total)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-gray-900">
                        {formatCurrency(item.pricePerUnit * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                Shipping Address
              </h2>
              <div className="space-y-2 text-gray-700">
                <p className="font-semibold">{order.shippingAddress.name}</p>
                <p>{order.shippingAddress.address}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                  {order.shippingAddress.pincode}
                </p>
                <p className="flex items-center gap-2 mt-3">
                  <Phone className="w-4 h-4" />
                  {order.shippingAddress.phone}
                </p>
                {order.shippingAddress.email && (
                  <p className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {order.shippingAddress.email}
                  </p>
                )}
              </div>
            </div>

            {/* Shipping Details */}
            {order.courier?.awb && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-blue-600" />
                  Shipping Details
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-gray-600">Courier</span>
                    <span className="font-semibold">
                      {order.courier.partner || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-gray-600">Tracking Number (AWB)</span>
                    <span className="font-mono font-semibold">
                      {order.courier.awb}
                    </span>
                  </div>
                  {order.courier.labelUrl && (
                    <button
                      onClick={() => window.open(order.courier.labelUrl, "_blank")}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download Shipping Label
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Order Summary & Payment */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Order Summary
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>{formatCurrency(order.pricing.subtotal)}</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{formatCurrency(order.pricing.totalDiscount)}</span>
                  </div>
                )}
                {order.couponId && (
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Coupon Applied</span>
                    <span className="font-mono bg-green-50 px-2 py-1 rounded">
                      {order.couponId.code}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-gray-700">
                  <span>Shipping Charges</span>
                  <span>{formatCurrency(order.pricing.deliveryCharges)}</span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total Amount</span>
                  <span>{formatCurrency(order.pricing.total)}</span>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                Payment Details
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="text-gray-600">Payment Method</span>
                  <span className="font-semibold uppercase">
                    {order.paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="text-gray-600">Payment Status</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getPaymentStatusColor(
                      order.paymentStatus
                    )}`}
                  >
                    {order.paymentStatus}
                  </span>
                </div>
                {order.razorpayOrderId && (
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-gray-600">Transaction ID</span>
                    <span className="font-mono text-xs">
                      {order.razorpayOrderId}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Order Timeline */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Order Timeline
              </h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Order Placed
                    </p>
                    <p className="text-xs text-gray-600">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                </div>
                {order.updatedAt !== order.createdAt && (
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Last Updated
                      </p>
                      <p className="text-xs text-gray-600">
                        {formatDate(order.updatedAt)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;