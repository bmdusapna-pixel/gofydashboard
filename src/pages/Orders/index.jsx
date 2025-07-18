import React, { useState, useRef, useEffect } from "react";

// Main App component for Order Table
const App = () => {
  // Sample order data with updated fields
  const orders = [
    {
      id: "ord-001",
      createdAt: "2025-07-16 10:30 AM",
      customer: "John Doe",
      priority: "High",
      total: 125.5,
      paymentStatus: "Paid",
      items: 3,
      deliveryNumber: "DEL-98765",
      orderStatus: "Processing",
    },
    {
      id: "ord-002",
      createdAt: "2025-07-15 02:15 PM",
      customer: "Jane Smith",
      priority: "Medium",
      total: 240.0,
      paymentStatus: "Paid",
      items: 5,
      deliveryNumber: "DEL-12345",
      orderStatus: "Shipped",
    },
    {
      id: "ord-003",
      createdAt: "2025-07-14 09:00 AM",
      customer: "Peter Jones",
      priority: "Low",
      total: 75.25,
      paymentStatus: "Paid",
      items: 1,
      deliveryNumber: "DEL-67890",
      orderStatus: "Delivered",
    },
    {
      id: "ord-004",
      createdAt: "2025-07-13 04:45 PM",
      customer: "Alice Brown",
      priority: "High",
      total: 500.0,
      paymentStatus: "Pending",
      items: 8,
      deliveryNumber: "DEL-23456",
      orderStatus: "Pending",
    },
    {
      id: "ord-005",
      createdAt: "2025-07-12 11:00 AM",
      customer: "Robert Green",
      priority: "Medium",
      total: 99.99,
      paymentStatus: "Refunded",
      items: 2,
      deliveryNumber: "DEL-78901",
      orderStatus: "Cancelled",
    },
    {
      id: "ord-006",
      createdAt: "2025-07-11 08:30 AM",
      customer: "Maria Garcia",
      priority: "Low",
      total: 320.75,
      paymentStatus: "Paid",
      items: 4,
      deliveryNumber: "DEL-34567",
      orderStatus: "Delivered",
    },
    {
      id: "ord-007",
      createdAt: "2025-07-10 01:00 PM",
      customer: "David Wilson",
      priority: "High",
      total: 180.0,
      paymentStatus: "Paid",
      items: 2,
      deliveryNumber: "DEL-89012",
      orderStatus: "Processing",
    },
    {
      id: "ord-008",
      createdAt: "2025-07-09 03:20 PM",
      customer: "Laura Martinez",
      priority: "Medium",
      total: 45.1,
      paymentStatus: "Paid",
      items: 1,
      deliveryNumber: "DEL-45678",
      orderStatus: "Shipped",
    },
    {
      id: "ord-009",
      createdAt: "2025-07-08 10:45 AM",
      customer: "Chris Johnson",
      priority: "Low",
      total: 60.5,
      paymentStatus: "Pending",
      items: 3,
      deliveryNumber: "DEL-90123",
      orderStatus: "Pending",
    },
    {
      id: "ord-010",
      createdAt: "2025-07-07 07:00 PM",
      customer: "Sarah Davis",
      priority: "High",
      total: 15.0,
      paymentStatus: "Paid",
      items: 1,
      deliveryNumber: "DEL-56789",
      orderStatus: "Delivered",
    },
  ];

  // State to manage which dropdown is open (stores the order ID)
  const [openDropdownId, setOpenDropdownId] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of items to display per page

  // Filter state for order status
  const [filterByStatus, setFilterByStatus] = useState("all"); // 'all', 'Processing', 'Shipped', etc.

  // Ref to detect clicks outside the dropdown
  const dropdownRef = useRef(null);

  // Function to determine status badge styling for Order Status
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

  // Function to determine status badge styling for Payment Status
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

  // Toggle dropdown visibility
  const toggleDropdown = (id) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  // Close dropdown when clicking outside
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

  // Placeholder functions for actions
  const handleView = (orderId) => {
    console.log(`Viewing details for order: ${orderId}`);
    setOpenDropdownId(null); // Close dropdown after action
  };

  const handleEdit = (orderId) => {
    console.log(`Editing order: ${orderId}`);
    setOpenDropdownId(null); // Close dropdown after action
  };

  const handleDelete = (orderId) => {
    console.log(`Deleting order: ${orderId}`);
    setOpenDropdownId(null); // Close dropdown after action
  };

  // Filter logic for orders
  const getFilteredOrders = () => {
    if (filterByStatus === "all") {
      return orders;
    }
    return orders.filter((order) => order.orderStatus === filterByStatus);
  };

  const filteredOrders = getFilteredOrders();

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem); // Use filteredOrders
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage); // Use filteredOrders

  // Reset page to 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filterByStatus]);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      setOpenDropdownId(null); // Close any open dropdown when changing page
    }
  };

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
      />

      <div className="bg-white p-4 sm:p-6 lg:p-8 font-sans">
        <div className="max-w-7xl mx-auto">
          {/* Main component styling consistent with previous tables */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-primary-100">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              {/* Left side: Order List Title */}
              <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4 sm:mb-0">
                Order List
              </h2>

              {/* Right side: Filter Dropdown */}
              <div className="flex items-center">
                <select
                  className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md shadow-sm w-auto max-w-fit"
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

            {/* Table Section */}
            <div className="overflow-x-auto rounded-lg border border-primary-100">
              <table className="min-w-full divide-y divide-primary-100">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sr No.
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created at
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Delivery Number
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-primary-100">
                  {currentOrders.length > 0 ? (
                    currentOrders.map((order, index) => (
                      <tr
                        key={order.id}
                        className="hover:bg-gray-50 transition duration-150 ease-in-out"
                      >
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {indexOfFirstItem + index + 1}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800">
                          {order.id}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {order.createdAt}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {order.customer}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {order.priority}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          ${order.total.toFixed(2)}
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
                        <td
                          className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 relative"
                          ref={dropdownRef}
                        >
                          <button
                            className="flex items-center justify-center w-6 h-6 text-gray-600 hover:text-gray-800 transition duration-150 ease-in-out focus:outline-none focus:ring-1 focus:ring-gray-200 focus:ring-opacity-75 rounded-full"
                            onClick={() => toggleDropdown(order.id)}
                            title="More Actions"
                          >
                            <i className="fas fa-ellipsis-h"></i>
                          </button>

                          {/* Dropdown Menu */}
                          {openDropdownId === order.id && (
                            <div className="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg z-10 border border-primary-100">
                              <div
                                className="py-1"
                                role="menu"
                                aria-orientation="vertical"
                                aria-labelledby="options-menu"
                              >
                                <button
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                                  role="menuitem"
                                  onClick={() => handleView(order.id)}
                                >
                                  <i className="fas fa-eye mr-2 text-blue-500"></i>
                                  View
                                </button>
                                <button
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                                  role="menuitem"
                                  onClick={() => handleEdit(order.id)}
                                >
                                  <i className="fas fa-edit mr-2 text-yellow-500"></i>
                                  Edit
                                </button>
                                <button
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                                  role="menuitem"
                                  onClick={() => handleDelete(order.id)}
                                >
                                  <i className="fas fa-trash-alt mr-2 text-red-500"></i>
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
                        No orders found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls - Aligned to the right */}
            <div className="flex justify-end items-center mt-6 space-x-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <div className="flex space-x-1">
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
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
