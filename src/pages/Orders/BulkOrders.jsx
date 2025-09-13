import React, { useState, useEffect, useRef } from "react";
import { EllipsisVertical, Eye, Pencil, Trash2 } from "lucide-react";
import api from "../../api/axios.js";

const table_header = [
  { _id: 1, title: "Sr No." },
  { _id: 2, title: "Order ID" },
  { _id: 3, title: "Created At" },
  { _id: 4, title: "Customer" },
  { _id: 5, title: "Products" },
  { _id: 6, title: "Status" },
  { _id: 7, title: "Action" },
];

const BulkOrders = () => {
  const [bulkOrders, setBulkOrders] = useState([]);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [filterByStatus, setFilterByStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const dropdownRef = useRef(null);

  const itemsPerPage = 5;

  const getOrderStatusClasses = (status) => {
    switch (status?.toLowerCase()) {
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const toggleDropdown = (id) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  // Fetch bulk orders
  useEffect(() => {
    const fetchBulkOrders = async () => {
      try {
        const result = await api.get("/user/bulk-orders");
        setBulkOrders(result.data.orders || []);
      } catch (err) {
        console.error("Error fetching bulk orders:", err);
      }
    };
    fetchBulkOrders();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleView = (orderId) => {
    console.log(`Viewing bulk order: ${orderId}`);
    setOpenDropdownId(null);
  };

  const handleEdit = (orderId) => {
    console.log(`Editing bulk order: ${orderId}`);
    setOpenDropdownId(null);
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this bulk order?"))
      return;

    try {
      await api.delete(`/user/bulk-orders/${orderId}`);
      setBulkOrders((prevOrders) =>
        prevOrders.filter((order) => order._id !== orderId)
      );

      alert("Bulk order deleted successfully");
      setOpenDropdownId(null);
    } catch (err) {
      console.error("Failed to delete bulk order:", err);
      alert("Failed to delete bulk order");
    }
  };

  const getFilteredOrders = () => {
    if (filterByStatus === "all") return bulkOrders;
    return bulkOrders.filter(
      (order) => order.status.toLowerCase() === filterByStatus.toLowerCase()
    );
  };

  const filteredOrders = getFilteredOrders();
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

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
              Bulk Orders
            </h2>
            <div className="flex items-center gap-4">
              <select
                className="px-3 py-2 border border-gray-300 cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-300 ease-in-out text-sm rounded-md shadow-sm text-gray-600"
                value={filterByStatus}
                onChange={(e) => setFilterByStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Completed">Completed</option>
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
                        {order.bulkOrderId}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                        {order.contactDetails?.name} <br />
                        <span className="text-xs text-gray-500">
                          {order.contactDetails?.phone}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                        {order.productDetails.length} item(s)
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getOrderStatusClasses(
                            order.status
                          )}`}
                        >
                          {order.status}
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
                      No bulk orders found
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

export default BulkOrders;
