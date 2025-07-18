import React, { useState, useRef, useEffect } from "react";

// Main App component for Received Orders Table
const App = () => {
  // Sample received order data
  const receivedOrders = [
    {
      id: "rec-001",
      orderId: "ORD-2025-001",
      customer: "John Doe",
      items: 3,
      amount: 125.5,
      paymentStatus: "Paid",
      receivedStatus: "Full",
    },
    {
      id: "rec-002",
      orderId: "ORD-2025-002",
      customer: "Jane Smith",
      items: 5,
      amount: 240.0,
      paymentStatus: "Paid",
      receivedStatus: "Partial",
    },
    {
      id: "rec-003",
      orderId: "ORD-2025-003",
      customer: "Peter Jones",
      items: 1,
      amount: 75.25,
      paymentStatus: "Paid",
      receivedStatus: "Full",
    },
    {
      id: "rec-004",
      orderId: "ORD-2025-004",
      customer: "Alice Brown",
      items: 8,
      amount: 500.0,
      paymentStatus: "Pending",
      receivedStatus: "Pending",
    },
    {
      id: "rec-005",
      orderId: "ORD-2025-005",
      customer: "Robert Green",
      items: 2,
      amount: 99.99,
      paymentStatus: "Refunded",
      receivedStatus: "Not Received",
    },
    {
      id: "rec-006",
      orderId: "ORD-2025-006",
      customer: "Maria Garcia",
      items: 4,
      amount: 320.75,
      paymentStatus: "Paid",
      receivedStatus: "Full",
    },
    {
      id: "rec-007",
      orderId: "ORD-2025-007",
      customer: "David Wilson",
      items: 2,
      amount: 180.0,
      paymentStatus: "Paid",
      receivedStatus: "Partial",
    },
    {
      id: "rec-008",
      orderId: "ORD-2025-008",
      customer: "Laura Martinez",
      items: 1,
      amount: 45.1,
      paymentStatus: "Paid",
      receivedStatus: "Full",
    },
    {
      id: "rec-009",
      orderId: "ORD-2025-009",
      customer: "Chris Johnson",
      items: 3,
      amount: 60.5,
      paymentStatus: "Pending",
      receivedStatus: "Pending",
    },
    {
      id: "rec-010",
      orderId: "ORD-2025-010",
      customer: "Sarah Davis",
      items: 1,
      amount: 15.0,
      paymentStatus: "Paid",
      receivedStatus: "Full",
    },
  ];

  // State to manage which dropdown is open (stores the received order ID)
  const [openDropdownId, setOpenDropdownId] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of items to display per page

  // Ref to detect clicks outside the dropdown
  const dropdownRef = useRef(null);

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

  // Function to determine status badge styling for Received Status
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
    console.log(`Viewing details for received order: ${orderId}`);
    setOpenDropdownId(null); // Close dropdown after action
  };

  const handleEdit = (orderId) => {
    console.log(`Editing received order: ${orderId}`);
    setOpenDropdownId(null); // Close dropdown after action
  };

  const handleDelete = (orderId) => {
    console.log(`Deleting received order: ${orderId}`);
    setOpenDropdownId(null); // Close dropdown after action
  };

  // Pagination Logic
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
              {/* Left side: Received Orders List Title */}
              <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4 sm:mb-0">
                Received Orders List
              </h2>

              {/* Right side: No Add New button or filter for this table initially */}
              <div className="flex items-center">
                {/* Add filter dropdowns here if needed in the future */}
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
                      Customer
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Received Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-primary-100">
                  {currentReceivedOrders.length > 0 ? (
                    currentReceivedOrders.map((order, index) => (
                      <tr
                        key={order.id}
                        className="hover:bg-gray-50 transition duration-150 ease-in-out"
                      >
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {indexOfFirstItem + index + 1}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800">
                          {order.orderId}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {order.customer}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {order.items}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          ${order.amount.toFixed(2)}
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
                                  onClick={() => handleView(order.orderId)}
                                >
                                  <i className="fas fa-eye mr-2 text-blue-500"></i>
                                  View
                                </button>
                                <button
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                                  role="menuitem"
                                  onClick={() => handleEdit(order.orderId)}
                                >
                                  <i className="fas fa-edit mr-2 text-yellow-500"></i>
                                  Edit
                                </button>
                                <button
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                                  role="menuitem"
                                  onClick={() => handleDelete(order.orderId)}
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
                        colSpan="8"
                        className="px-4 py-3 text-center text-sm text-gray-500"
                      >
                        No received orders found.
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
