import React, { useState, useRef, useEffect } from "react";

// Main App component for Return List Table
const App = () => {
  // Sample return list data
  const returnList = [
    {
      id: "ret-001",
      orderBy: "Customer A",
      items: 2,
      returnDate: "2025-07-17",
      total: 50.0,
      returnStatus: "Pending",
    },
    {
      id: "ret-002",
      orderBy: "Customer B",
      items: 1,
      returnDate: "2025-07-16",
      total: 120.5,
      returnStatus: "Completed",
    },
    {
      id: "ret-003",
      orderBy: "Customer C",
      items: 3,
      returnDate: "2025-07-15",
      total: 75.0,
      returnStatus: "Rejected",
    },
    {
      id: "ret-004",
      orderBy: "Customer D",
      items: 1,
      returnDate: "2025-07-14",
      total: 25.0,
      returnStatus: "Pending",
    },
    {
      id: "ret-005",
      orderBy: "Customer E",
      items: 4,
      returnDate: "2025-07-13",
      total: 300.0,
      returnStatus: "Completed",
    },
    {
      id: "ret-006",
      orderBy: "Customer F",
      items: 2,
      returnDate: "2025-07-12",
      total: 88.99,
      returnStatus: "Pending",
    },
    {
      id: "ret-007",
      orderBy: "Customer G",
      items: 1,
      returnDate: "2025-07-11",
      total: 45.0,
      returnStatus: "Completed",
    },
    {
      id: "ret-008",
      orderBy: "Customer H",
      items: 5,
      returnDate: "2025-07-10",
      total: 500.0,
      returnStatus: "Rejected",
    },
    {
      id: "ret-009",
      orderBy: "Customer I",
      items: 2,
      returnDate: "2025-07-09",
      total: 150.0,
      returnStatus: "Pending",
    },
    {
      id: "ret-010",
      orderBy: "Customer J",
      items: 1,
      returnDate: "2025-07-08",
      total: 30.0,
      returnStatus: "Completed",
    },
  ];

  // State to manage which dropdown is open (stores the return ID)
  const [openDropdownId, setOpenDropdownId] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of items to display per page

  // Filter state for return status
  const [filterByReturnStatus, setFilterByReturnStatus] = useState("all"); // 'all', 'Pending', 'Completed', etc.

  // Ref to detect clicks outside the dropdown
  const dropdownRef = useRef(null);

  // Function to determine status badge styling for Return Status
  const getReturnStatusClasses = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Rejected":
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
  const handleView = (returnId) => {
    console.log(`Viewing details for return: ${returnId}`);
    setOpenDropdownId(null); // Close dropdown after action
  };

  const handleEdit = (returnId) => {
    console.log(`Editing return: ${returnId}`);
    setOpenDropdownId(null); // Close dropdown after action
  };

  const handleDelete = (returnId) => {
    console.log(`Deleting return: ${returnId}`);
    setOpenDropdownId(null); // Close dropdown after action
  };

  // Filter logic for return list
  const getFilteredReturnList = () => {
    if (filterByReturnStatus === "all") {
      return returnList;
    }
    return returnList.filter(
      (item) => item.returnStatus === filterByReturnStatus
    );
  };

  const filteredReturnList = getFilteredReturnList();

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReturnList = filteredReturnList.slice(
    indexOfFirstItem,
    indexOfLastItem
  ); // Use filteredReturnList
  const totalPages = Math.ceil(filteredReturnList.length / itemsPerPage); // Use filteredReturnList

  // Reset page to 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filterByReturnStatus]);

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
              {/* Left side: Return List Title */}
              <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4 sm:mb-0">
                Return List
              </h2>

              {/* Right side: Filter Dropdown */}
              <div className="flex items-center">
                <select
                  className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md shadow-sm w-auto max-w-fit"
                  value={filterByReturnStatus}
                  onChange={(e) => setFilterByReturnStatus(e.target.value)}
                >
                  <option value="all">All Return Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                  <option value="Rejected">Rejected</option>
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
                      ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order By
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Return Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Return Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-primary-100">
                  {currentReturnList.length > 0 ? (
                    currentReturnList.map((item, index) => (
                      <tr
                        key={item.id}
                        className="hover:bg-gray-50 transition duration-150 ease-in-out"
                      >
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {indexOfFirstItem + index + 1}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800">
                          {item.id}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {item.orderBy}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {item.items}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {item.returnDate}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          ${item.total.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${getReturnStatusClasses(
                              item.returnStatus
                            )}`}
                          >
                            {item.returnStatus}
                          </span>
                        </td>
                        <td
                          className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 relative"
                          ref={dropdownRef}
                        >
                          <button
                            className="flex items-center justify-center w-6 h-6 text-gray-600 hover:text-gray-800 transition duration-150 ease-in-out focus:outline-none focus:ring-1 focus:ring-gray-200 focus:ring-opacity-75 rounded-full"
                            onClick={() => toggleDropdown(item.id)}
                            title="More Actions"
                          >
                            <i className="fas fa-ellipsis-h"></i>
                          </button>

                          {/* Dropdown Menu */}
                          {openDropdownId === item.id && (
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
                                  onClick={() => handleView(item.id)}
                                >
                                  <i className="fas fa-eye mr-2 text-blue-500"></i>
                                  View
                                </button>
                                <button
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                                  role="menuitem"
                                  onClick={() => handleEdit(item.id)}
                                >
                                  <i className="fas fa-edit mr-2 text-yellow-500"></i>
                                  Edit
                                </button>
                                <button
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                                  role="menuitem"
                                  onClick={() => handleDelete(item.id)}
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
                        No returns found.
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
