import React, { useState, useRef, useEffect } from "react";
import { orders } from "../../assets/orders.list";
import { EllipsisVertical, Eye, Pencil, Trash2 } from "lucide-react";

const table_header = [
  { _id: 1, title: "Sr No." },
  { _id: 2, title: "Order ID" },
  { _id: 3, title: "Created at" },
  { _id: 4, title: "Customer" },
  { _id: 5, title: "Priority" },
  { _id: 6, title: "Total" },
  { _id: 7, title: "Payment Status" },
  { _id: 8, title: "Items" },
  { _id: 9, title: "Delivery Number" },
  { _id: 10, title: "Order Status" },
  { _id: 11, title: "Action" },
];

const AllOrders = () => {
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const dropdownRef = useRef(null);

  const itemsPerPage = 5;
  const [filterByStatus, setFilterByStatus] = useState("all");

  const getOrderStatusClasses = (status) => {
    switch (status) {
      case "Processing":
        return "bg-blue-100 text-blue-800";
      case "Shipped":
        return "bg-indigo-100 text-indigo-800";
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusClasses = (status) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Refunded":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const toggleDropdown = (id) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

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

  const getFilteredOrders = () => {
    if (filterByStatus === "all") {
      return orders;
    }
    return orders.filter((order) => order.orderStatus === filterByStatus);
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
    <div className="bg-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
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
                        {order._id}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {order.createdAt}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                        {order.customer}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {order.priority}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                        ₹ {order.total.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusClasses(
                            order.paymentStatus
                          )}`}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {order.items}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {order.deliveryNumber}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getOrderStatusClasses(
                            order.orderStatus
                          )}`}
                        >
                          {order.orderStatus}
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
                      colSpan="11"
                      className="px-4 py-3 text-center text-sm text-gray-500"
                    >
                      No categories found
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
