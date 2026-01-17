import React, { useState, useRef, useEffect } from "react";
import { EllipsisVertical, Eye, Pencil, Trash2 } from "lucide-react";
import api from "../../api/axios.js";
import Cookies from "js-cookie";

const table_header = [
  { _id: 1, title: "Sr No." },
  { _id: 2, title: "Order ID" },
  { _id: 3, title: "Created at" },
  { _id: 4, title: "Customer" },
  { _id: 5, title: "Total" },
  { _id: 6, title: "Order Status" },
  { _id: 7, title: "Action" },
];

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const dropdownRef = useRef(null);

  const itemsPerPage = 5;
  const [filterByStatus, setFilterByStatus] = useState("all");

  const getOrderStatusClasses = (status) => {
    switch (status?.toLowerCase()) {
      case "processing":
        return "bg-blue-100 text-blue-800";
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

  const token = Cookies.get("token");

  const toggleDropdown = (id) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const params = {
          page: currentPage,
          limit: itemsPerPage,
        };
        if (filterByStatus !== "all") {
          params.status = filterByStatus.toUpperCase();
        }

        const result = await api.get("/user/order/admin", { params },{
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        // API returns { success, orders, totalPages, currentPage, totalOrders }
        const data = result.data || {};
        setOrders(Array.isArray(data.orders) ? data.orders : []);
        setTotalPages(data.totalPages || 1);
        setCurrentPage(data.currentPage || currentPage);
        setTotalOrders(data.totalOrders || 0);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };
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
  };

  const handleEdit = (orderId) => {
    console.log(`Editing order: ${orderId}`);
    setOpenDropdownId(null);
  };

  const handleDelete = (orderId) => {
    console.log(`Deleting order: ${orderId}`);
    setOpenDropdownId(null);
  };

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
    <div className="flex-1 overflow-y-auto p-4 bg-primary-50">
      <div className="">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-primary-100 flex flex-col gap-5">
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
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Pending">Pending</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-lg border border-primary-100">
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
              <tbody className="bg-white divide-y divide-primary-100">
                {currentOrders.length > 0 ? (
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
                            order.orderStatus || order.status
                          )}`}
                        >
                          {order.orderStatus || order.status}
                        </span>
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
                            className="absolute right-0 w-36 bg-white rounded-md shadow-lg z-10 border border-primary-100"
                          >
                            <div
                              className="flex flex-col gap-1 w-full py-2"
                              role="menu"
                            >
                              <button
                                className="flex items-center gap-2 px-4 py-1.5 hover:bg-gray-50 text-sm text-gray-600"
                                onClick={() => handleView(order._id)}
                              >
                                <Eye className="w-4 h-4 text-blue-500" />
                                View
                              </button>
                              <button
                                className="flex items-center gap-2 px-4 py-1.5 hover:bg-gray-50 text-sm text-gray-600"
                                onClick={() => handleEdit(order._id)}
                              >
                                <Pencil className="w-4 h-4 text-yellow-500" />
                                Edit
                              </button>
                              <button
                                className="flex items-center gap-2 px-4 py-1.5 hover:bg-gray-50 text-sm text-gray-600"
                                onClick={() => handleDelete(order._id)}
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
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
