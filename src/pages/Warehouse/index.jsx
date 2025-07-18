import React, { useState, useRef, useEffect } from "react";
// Removed FontAwesome imports as they are causing resolution errors in this environment.
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faPlus, faEye, faEdit, faTrashAlt, faEllipsisH } from '@fortawesome/free-solid-svg-icons';

// Main App component for Warehouse Table
const App = () => {
  // Sample warehouse data
  const warehouses = [
    {
      id: "wh-001",
      name: "Central Distribution Hub",
      location: "New York, USA",
      manager: "Alice Johnson",
      contact: "555-123-4567",
      stockAvailable: 15000,
      stockShipping: 3000,
      revenue: 1200000,
    },
    {
      id: "wh-002",
      name: "West Coast Fulfillment",
      location: "Los Angeles, USA",
      manager: "Bob Williams",
      contact: "555-987-6543",
      stockAvailable: 10000,
      stockShipping: 2500,
      revenue: 950000,
    },
    {
      id: "wh-003",
      name: "East Coast Logistics",
      location: "Miami, USA",
      manager: "Carol Davis",
      contact: "555-111-2222",
      stockAvailable: 8000,
      stockShipping: 1500,
      revenue: 700000,
    },
    {
      id: "wh-004",
      name: "Midwest Storage",
      location: "Chicago, USA",
      manager: "David Lee",
      contact: "555-333-4444",
      stockAvailable: 20000,
      stockShipping: 4000,
      revenue: 1500000,
    },
    {
      id: "wh-005",
      name: "Southern Depot",
      location: "Dallas, USA",
      manager: "Eve Taylor",
      contact: "555-555-6666",
      stockAvailable: 7000,
      stockShipping: 1000,
      revenue: 600000,
    },
    {
      id: "wh-006",
      name: "Northern Hub",
      location: "Seattle, USA",
      manager: "Frank White",
      contact: "555-777-8888",
      stockAvailable: 11000,
      stockShipping: 2000,
      revenue: 850000,
    },
  ];

  // State to manage which dropdown is open (stores the warehouse ID)
  const [openDropdownId, setOpenDropdownId] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of items to display per page

  // Ref to detect clicks outside the dropdown
  const dropdownRef = useRef(null);

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
  const handleView = (warehouseName) => {
    console.log(`Viewing details for warehouse: ${warehouseName}`);
    setOpenDropdownId(null); // Close dropdown after action
  };

  const handleEdit = (warehouseName) => {
    console.log(`Editing warehouse: ${warehouseName}`);
    setOpenDropdownId(null); // Close dropdown after action
  };

  const handleDelete = (warehouseName) => {
    console.log(`Deleting warehouse: ${warehouseName}`);
    setOpenDropdownId(null); // Close dropdown after action
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentWarehouses = warehouses.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(warehouses.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      setOpenDropdownId(null); // Close any open dropdown when changing page
    }
  };

  return (
    <>
      {/* Re-added Font Awesome CDN link */}
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
              {/* Left side: Warehouse List Title */}
              <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4 sm:mb-0">
                Warehouse List
              </h2>

              {/* Right side: Add New Warehouse Button */}
              <div className="flex items-center">
                <button className="bg-red-200 hover:bg-red-300 text-red-800 text-xs font-semibold py-2 px-4 rounded-md shadow-sm transition duration-300 ease-in-out">
                  <i className="fas fa-plus mr-2"></i>Add New Warehouse{" "}
                  {/* Changed to i tag */}
                </button>
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
                      Warehouse ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Warehouse Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Manager
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact Number
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock Available
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock Shipping
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Warehouse Revenue
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-primary-100">
                  {currentWarehouses.length > 0 ? (
                    currentWarehouses.map((warehouse, index) => (
                      <tr
                        key={warehouse.id}
                        className="hover:bg-gray-50 transition duration-150 ease-in-out"
                      >
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {indexOfFirstItem + index + 1}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800">
                          {warehouse.id}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {warehouse.name}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {warehouse.location}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {warehouse.manager}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {warehouse.contact}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {warehouse.stockAvailable.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {warehouse.stockShipping.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          ${warehouse.revenue.toLocaleString()}
                        </td>
                        <td
                          className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 relative"
                          ref={dropdownRef}
                        >
                          <button
                            className="flex items-center justify-center w-6 h-6 text-gray-600 hover:text-gray-800 transition duration-150 ease-in-out focus:outline-none focus:ring-1 focus:ring-gray-200 focus:ring-opacity-75 rounded-full"
                            onClick={() => toggleDropdown(warehouse.id)}
                            title="More Actions"
                          >
                            <i className="fas fa-ellipsis-h"></i>{" "}
                            {/* Changed to i tag */}
                          </button>

                          {/* Dropdown Menu */}
                          {openDropdownId === warehouse.id && (
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
                                  onClick={() => handleView(warehouse.name)}
                                >
                                  <i className="fas fa-eye mr-2 text-blue-500"></i>
                                  View {/* Changed to i tag */}
                                </button>
                                <button
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                                  role="menuitem"
                                  onClick={() => handleEdit(warehouse.name)}
                                >
                                  <i className="fas fa-edit mr-2 text-yellow-500"></i>
                                  Edit {/* Changed to i tag */}
                                </button>
                                <button
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                                  role="menuitem"
                                  onClick={() => handleDelete(warehouse.name)}
                                >
                                  <i className="fas fa-trash-alt mr-2 text-red-500"></i>
                                  Delete {/* Changed to i tag */}
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
                        colSpan="10"
                        className="px-4 py-3 text-center text-sm text-gray-500"
                      >
                        No warehouses found.
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
