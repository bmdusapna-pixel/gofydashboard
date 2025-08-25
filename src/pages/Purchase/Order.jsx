import React, { useState, useRef, useEffect } from "react";

// Main App component for Purchase Order Table
const App = () => {
  // Sample purchase order data
  const purchaseOrders = [
    {
      id: "po-001",
      customerName: "Alice Johnson",
      email: "alice.j@example.com",
      orderDate: "2025-07-18",
      total: 750.0,
      orderStatus: "Pending",
    },
    {
      id: "po-002",
      customerName: "Bob Williams",
      email: "bob.w@example.com",
      orderDate: "2025-07-17",
      total: 1200.5,
      orderStatus: "Confirmed",
    },
    {
      id: "po-003",
      customerName: "Charlie Davis",
      email: "charlie.d@example.com",
      orderDate: "2025-07-16",
      total: 300.25,
      orderStatus: "Shipped",
    },
    {
      id: "po-004",
      customerName: "Diana Miller",
      email: "diana.m@example.com",
      orderDate: "2025-07-15",
      total: 980.0,
      orderStatus: "Delivered",
    },
    {
      id: "po-005",
      customerName: "Eve Brown",
      email: "eve.b@example.com",
      orderDate: "2025-07-14",
      total: 450.75,
      orderStatus: "Pending",
    },
    {
      id: "po-006",
      customerName: "Frank White",
      email: "frank.w@example.com",
      orderDate: "2025-07-13",
      total: 620.0,
      orderStatus: "Confirmed",
    },
    {
      id: "po-007",
      customerName: "Grace Green",
      email: "grace.g@example.com",
      orderDate: "2025-07-12",
      total: 150.0,
      orderStatus: "Shipped",
    },
    {
      id: "po-008",
      customerName: "Harry Black",
      email: "harry.b@example.com",
      orderDate: "2025-07-11",
      total: 2100.0,
      orderStatus: "Delivered",
    },
    {
      id: "po-009",
      customerName: "Ivy Blue",
      email: "ivy.bl@example.com",
      orderDate: "2025-07-10",
      total: 88.99,
      orderStatus: "Pending",
    },
    {
      id: "po-010",
      customerName: "Jack Red",
      email: "jack.r@example.com",
      orderDate: "2025-07-09",
      total: 345.6,
      orderStatus: "Confirmed",
    },
  ];

  // State to manage which dropdown is open (stores the purchase order ID)
  const [openDropdownId, setOpenDropdownId] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of items to display per page

  // Ref to detect clicks outside the dropdown
  const dropdownRef = useRef(null);

  // Function to determine status badge styling for Order Status
  const getOrderStatusClasses = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Confirmed":
        return "bg-blue-100 text-blue-800";
      case "Shipped":
        return "bg-indigo-100 text-indigo-800";
      case "Delivered":
        return "bg-green-100 text-green-800";
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
    console.log(`Viewing details for purchase order: ${orderId}`);
    setOpenDropdownId(null); // Close dropdown after action
  };

  const handleEdit = (orderId) => {
    console.log(`Editing purchase order: ${orderId}`);
    setOpenDropdownId(null); // Close dropdown after action
  };

  const handleDelete = (orderId) => {
    console.log(`Deleting purchase order: ${orderId}`);
    setOpenDropdownId(null); // Close dropdown after action
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPurchaseOrders = purchaseOrders.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(purchaseOrders.length / itemsPerPage);

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

      <div className="flex-1 overflow-y-auto p-4 bg-primary-50">
        <div className="">
          {/* Main component styling consistent with previous tables */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-primary-100">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              {/* Left side: Purchase Order List Title */}
              <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4 sm:mb-0">
                Purchase Order List
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
                      Customer Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
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
                  {currentPurchaseOrders.length > 0 ? (
                    currentPurchaseOrders.map((order, index) => (
                      <tr
                        key={order.id}
                        className="hover:bg-gray-50 transition duration-150 ease-in-out"
                      >
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {indexOfFirstItem + index + 1}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800">
                          {order.customerName}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {order.email}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {order.orderDate}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          ${order.total.toFixed(2)}
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
                        colSpan="7"
                        className="px-4 py-3 text-center text-sm text-gray-500"
                      >
                        No purchase orders found.
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
