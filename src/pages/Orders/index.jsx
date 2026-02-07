import React, { useState, useRef, useEffect } from "react";
import { Check, EllipsisVertical, Eye, Pencil, Trash2, X } from "lucide-react";
import api from "../../api/axios.js";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const table_header = [
  { _id: 1, title: "Sr No." },
  { _id: 2, title: "Order ID" },
  { _id: 3, title: "Created at" },
  { _id: 4, title: "Customer" },
  { _id: 5, title: "Total" },
  { _id: 6, title: "Order Status" },
  { _id: 7, title: "Delivery Type" },
  { _id: 8, title: "Payment Method" },
  { _id: 9, title: "Action" },
];

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const dropdownRef = useRef(null);
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState(null);
  const [actionLoading, setActionLoading] = useState(null); // Track which order is being processed
  const [successMessage, setSuccessMessage] = useState("");

  const itemsPerPage = 20;
  const [filterByStatus, setFilterByStatus] = useState("all");

  const getOrderStatusClasses = (status) => {
    switch (status?.toLowerCase()) {
      case "placed":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-pink-100 text-pink-800";
      case "shipped":
        return "bg-indigo-100 text-indigo-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  const navigate = useNavigate();
  const token = sessionStorage.getItem("adminToken");

  const toggleDropdown = (id) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const fetchOrders = async () => {
    try {
      setloading(true);
      const params = {
        page: currentPage,
        limit: itemsPerPage,
      };
      if (filterByStatus !== "all") {
        params.status = filterByStatus.toUpperCase();
      }

      const result = await api.get(
        "/user/order/admin",
        { params },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      // API returns { success, orders, totalPages, currentPage, totalOrders }
      const data = result.data || {};
      console.log(data);
      setOrders(Array.isArray(data.orders) ? data.orders : []);
      setTotalPages(data.totalPages || 1);
      setCurrentPage(data.currentPage || currentPage);
      setTotalOrders(data.totalOrders || 0);
    } catch (err) {
      seterror(err);
      console.error("Error fetching orders:", err);
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage, filterByStatus]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleView = (orderId) => {
    console.log(`Viewing details for order: ${orderId}`);
    setOpenDropdownId(null);
    navigate(`/orders/${orderId}`);
  };

  const handleEdit = (orderId) => {
    console.log(`Editing order: ${orderId}`);
    setOpenDropdownId(null);
  };

  const handleDelete = (orderId) => {
    console.log(`Deleting order: ${orderId}`);
    setOpenDropdownId(null);
  };

  // ========== NEW HANDLERS ==========

  const handleCreateShipment = async (orderId) => {
    try {
      setActionLoading(orderId);
      const token = sessionStorage.getItem("adminToken");

      const response = await api.post(
        `courier/dtdc/create-shipment/${orderId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data.success) {
        setSuccessMessage(`✅ Shipment created! AWB: ${response.data.awb}`);
        // Refresh orders
        setTimeout(() => {
          setCurrentPage(currentPage);
          setSuccessMessage("");
        }, 2000);
      }
      setOpenDropdownId(null);
    } catch (err) {
      console.error("Shipment creation error:", err);
      alert(`❌ Error: ${err.response?.data?.message || err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleGenerateLabel = async (orderId) => {
    try {
      setActionLoading(orderId);

      const token = sessionStorage.getItem("adminToken");

      const response = await api.get(`courier/dtdc/generate-label/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob", // 🔥 CRITICAL
      });

      const fileURL = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/pdf" }),
      );

      window.open(fileURL);

      setOpenDropdownId(null);
    } catch (err) {
      console.error("Label generation error:", err);
      alert("❌ Failed to generate label");
    } finally {
      setActionLoading(null);
    }
  };
  // Confirm Order
  const handleConfirmOrder = async (orderId) => {
    try {
      setActionLoading(true);
      const response = await api.post(
        `admin/order/${orderId}/confirm`,
        { notes: "Order confirmed by admin" },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      alert("✅ Order confirmed successfully");
      fetchOrders();
    } catch (error) {
      console.error("Error confirming order:", error);
      alert(`❌ ${error.response?.data?.message || "Failed to confirm order"}`);
    } finally {
      setActionLoading(false);
    }
  };

  // Cancel Order
  const handleCancelOrder = async (orderId) => {
    const reason = prompt("Enter reason for cancellation:");
    if (!reason) return;

    try {
      setActionLoading(true);
      await api.post(
        `admin/order/${orderId}/cancel`,
        { reason },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      alert("✅ Order cancelled successfully");
      fetchOrders();
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert(`❌ ${error.response?.data?.message || "Failed to cancel order"}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReadyForPickup = async (orderId) => {
    try {
      setActionLoading(true);
      await api.post(
        `admin/order/${orderId}/readyForPickup`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },

      );
      alert("✅ Order marked as Ready for Pickup");
      fetchOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
      alert(`❌ ${error.response?.data?.message || "Failed to update order status"}`);
    } finally {      setActionLoading(false);
    }  };

  // Server side filtering and pagination. `orders` contains current page results.
  const currentOrders = orders;
  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;

  useEffect(() => {
    setCurrentPage(1);
  }, [filterByStatus]);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      setOpenDropdownId(null);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-primary-50 ">
      <div className="">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-primary-100 flex flex-col gap-5">
          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {successMessage}
            </div>
          )}

          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-700">
              Order List
            </h2>
            <div className="flex items-center gap-4">
              <select
                className="px-3 py-2 border border-gray-300 cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-300 ease-in-out text-sm rounded-md shadow-sm text-gray-600"
                value={filterByStatus}
                onChange={(e) => setFilterByStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-lg border border-primary-100 min-h-screen">
            <table className="min-w-full divide-y divide-primary-100">
              <thead className="bg-gray-50">
                <tr>
                  {table_header.map((item) => (
                    <th
                      key={item._id}
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {item.title}
                    </th>
                  ))}
                </tr>
              </thead>
              {loading && (
                <div className="flex justify-center m-auto">
                  <div className="animate-spin rounded-full w-8 h-8 border-b-2 border-gray-100"></div>
                </div>
              )}

              {error && !loading && <div className="text-red-500">{error}</div>}
              <tbody className="bg-white divide-y divide-primary-100">
                {!loading && !error && currentOrders.length > 0 ? (
                  currentOrders.map((order, index) => (
                    <tr
                      key={order._id}
                      className="hover:bg-gray-50 transition duration-150 ease-in-out"
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {indexOfFirstItem + index + 1}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                        {order.orderId}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                        {order.userId?.name}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                        ₹ {Number(order.pricing?.total ?? 0).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getOrderStatusClasses(
                            order.orderStatus || order.status,
                          )}`}
                        >
                          {order.orderStatus || order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                        {order.deliveryType}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                        {order.paymentMethod}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap relative">
                        <button
                          className="flex items-center justify-center w-6 h-6 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-1 focus:ring-gray-200"
                          onClick={() => toggleDropdown(order._id)}
                          title="More Actions"
                        >
                          <EllipsisVertical className="w-4 h-4 text-gray-500" />
                        </button>
                        {openDropdownId === order._id && (
                          <div
                            ref={dropdownRef}
                            className="absolute right-0 w-48 bg-white rounded-md shadow-lg z-10 border border-primary-100"
                          >
                            <div
                              className="flex flex-col gap-1 w-full py-2"
                              role="menu"
                            >
                              <button
                                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-sm text-gray-600"
                                onClick={() => handleView(order._id)}
                              >
                                <Eye className="w-4 h-4 text-blue-500" />
                                View Details
                              </button>

                              <hr className="my-1" />

                              {/* NORMAL DELIVERY (DTDC) */}
                              {order.deliveryType !== "STORE_PICKUP" && (
                                <>
                                  {!order.courier?.awb ? (
                                    <button
                                      disabled={actionLoading === order._id}
                                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-sm text-gray-600 disabled:opacity-50"
                                      onClick={() =>
                                        handleCreateShipment(order._id)
                                      }
                                    >
                                      <span className="text-lg">🚚</span>
                                      {actionLoading === order._id
                                        ? "Creating..."
                                        : "Create Shipment"}
                                    </button>
                                  ) : (
                                    <button
                                      disabled={actionLoading === order._id}
                                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-sm text-gray-600 disabled:opacity-50"
                                      onClick={() =>
                                        handleGenerateLabel(order._id)
                                      }
                                    >
                                      <span className="text-lg">📄</span>
                                      {actionLoading === order._id
                                        ? "Downloading..."
                                        : "Download Label"}
                                    </button>
                                  )}
                                </>
                              )}

                              {order.deliveryType === "STORE_PICKUP" &&
                                order.orderStatus === "CONFIRMED" && (
                                  <button
                                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-sm text-gray-600"
                                    onClick={() =>
                                      handleReadyForPickup(order._id)
                                    }
                                  >
                                    <span className="text-lg">📦</span>
                                    Ready for Pickup
                                  </button>
                                )}

                              {order.orderStatus === "PLACED" && (
                                <>
                                  <button
                                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-sm text-gray-600"
                                    onClick={() =>
                                      handleConfirmOrder(order._id)
                                    }
                                  >
                                    <Check className="w-4 h-4 text-yellow-500" />
                                    Confirm
                                  </button>
                                  <button
                                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-sm text-gray-600"
                                    onClick={() => handleCancelOrder(order._id)}
                                  >
                                    <X className="w-4 h-4 text-red-500" />
                                    Cancel
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : loading ? (
                  <tr>
                    <td
                      colSpan="9"
                      className="px-4 py-8 text-center text-sm text-gray-500"
                    >
                      Loading orders...
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-4 py-3 text-center text-sm text-gray-500"
                    >
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-end items-center gap-2 mt-4">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
            >
              Previous
            </button>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => paginate(i + 1)}
                  className={`px-3 py-1 text-sm rounded-md ${
                    currentPage === i + 1
                      ? "bg-yellow-200 text-yellow-800"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllOrders;
