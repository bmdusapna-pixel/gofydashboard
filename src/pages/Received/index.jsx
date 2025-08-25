import React, { useState, useRef, useEffect } from "react";
import { receivedOrders } from "../../assets/orders.list";
import { EllipsisVertical, Eye, Pencil, Trash2 } from "lucide-react";

const table_header = [
  { title: "Sr No.", _id: "srNo" },
  { title: "Order ID", _id: "orderId" },
  { title: "Customer", _id: "customer" },
  { title: "Items", _id: "items" },
  { title: "Amount", _id: "amount" },
  { title: "Payment Status", _id: "paymentStatus" },
  { title: "Received Status", _id: "receivedStatus" },
  { title: "Action", _id: "action" },
];

const ReceivedOrders = () => {
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const dropdownRef = useRef(null);

  const itemsPerPage = 5;

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

  const getReceivedStatusClasses = (status) => {
    switch (status) {
      case "Full":
        return "bg-green-100 text-green-800";
      case "Partial":
        return "bg-yellow-100 text-yellow-800";
      case "Pending":
        return "bg-blue-100 text-blue-800";
      case "Not Received":
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
    console.log(`Viewing details for received order: ${orderId}`);
    setOpenDropdownId(null);
  };

  const handleEdit = (orderId) => {
    console.log(`Editing received order: ${orderId}`);
    setOpenDropdownId(null);
  };

  const handleDelete = (orderId) => {
    console.log(`Deleting received order: ${orderId}`);
    setOpenDropdownId(null);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReceivedOrders = receivedOrders.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(receivedOrders.length / itemsPerPage);

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
            <h2 className="text-lg sm:text-xl font-semibold text-gray-700 whitespace-nowrap">
              Received Orders List
            </h2>
          </div>

          {/* Table Section */}
          <div className="overflow-x-auto rounded-lg border border-primary-100">
            <table className="min-w-full divide-y divide-primary-200">
              <thead className="bg-gray-50">
                <tr>
                  {table_header.map((item) => (
                    <th
                      key={item._id}
                      className="px-4 py-3 whitespace-nowrap text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {item.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-primary-200">
                {currentReceivedOrders.length > 0 ? (
                  currentReceivedOrders.map((order, index) => (
                    <tr
                      key={order._id}
                      className="hover:bg-gray-50 transition duration-150 ease-in-out"
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {indexOfFirstItem + index + 1}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                        {order.orderId}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {order.customer}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {order.items}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                        ₹ {order.amount.toFixed(2)}
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
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getReceivedStatusClasses(
                            order.receivedStatus
                          )}`}
                        >
                          {order.receivedStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 relative whitespace-nowrap">
                        <button
                          className="flex cursor-pointer items-center justify-center w-6 h-6 focus:outline-none focus:ring-1 focus:ring-gray-200 rounded-full"
                          onClick={() => toggleDropdown(order._id)}
                          title="More Actions"
                        >
                          <EllipsisVertical className="w-5 h-5 text-gray-600" />
                        </button>
                        {openDropdownId === order._id && (
                          <div
                            ref={dropdownRef}
                            className="absolute right-0 w-36 bg-white rounded-md shadow-lg z-10 border border-primary-100"
                          >
                            <div
                              className="flex flex-col gap-1 w-full"
                              role="menu"
                              aria-orientation="vertical"
                              aria-labelledby="options-menu"
                            >
                              <button
                                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-md"
                                onClick={() => handleView(order.orderId)}
                              >
                                <Eye className="w-4 h-4 text-blue-500" />
                                <span className="text-sm text-gray-700">
                                  View
                                </span>
                              </button>
                              <button
                                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-md"
                                onClick={() => handleEdit(order.orderId)}
                              >
                                <Pencil className="w-4 h-4 text-yellow-500" />
                                <span className="text-sm text-gray-700">
                                  Edit
                                </span>
                              </button>
                              <button
                                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-md"
                                onClick={() => handleDelete(order.orderId)}
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                                <span className="text-sm text-gray-700">
                                  Delete
                                </span>
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
                      colSpan="8"
                      className="px-4 py-3 text-center text-sm text-gray-600"
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
              className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceivedOrders;
