import React, { useState, useRef, useEffect } from "react";
// Removed FontAwesome imports as they are causing resolution errors in this environment.
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faPlus, faEye, faEdit, faTrashAlt, faEllipsisH } from '@fortawesome/free-solid-svg-icons';

// Main App component for Category Table
const App = () => {
  // Sample category data
  const categories = [
    {
      id: "cat-001",
      name: "Stuffed Animals",
      productCount: 15,
    },
    {
      id: "cat-002",
      name: "Construction Toys",
      productCount: 10,
    },
    {
      id: "cat-003",
      name: "Vehicles",
      productCount: 20,
    },
    {
      id: "cat-004",
      name: "Action Figures",
      productCount: 12,
    },
    {
      id: "cat-005",
      name: "Board Games",
      productCount: 8,
    },
    {
      id: "cat-006",
      name: "Robotics",
      productCount: 5,
    },
    {
      id: "cat-007",
      name: "Dolls",
      productCount: 18,
    },
    {
      id: "cat-008",
      name: "Puzzles",
      productCount: 7,
    },
    {
      id: "cat-009",
      name: "Art & Craft",
      productCount: 14,
    },
    {
      id: "cat-010",
      name: "Outdoor Toys",
      productCount: 25,
    },
  ];

  // State to manage which dropdown is open (stores the category ID)
  const [openDropdownId, setOpenDropdownId] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of items to display per page

  // Filter state for category name
  const [filterByCategory, setFilterByCategory] = useState("all"); // 'all', 'Stuffed Animals', etc.

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
  const handleView = (categoryName) => {
    console.log(`Viewing details for category: ${categoryName}`);
    setOpenDropdownId(null); // Close dropdown after action
  };

  const handleEdit = (categoryName) => {
    console.log(`Editing category: ${categoryName}`);
    setOpenDropdownId(null); // Close dropdown after action
  };

  const handleDelete = (categoryName) => {
    console.log(`Deleting category: ${categoryName}`);
    setOpenDropdownId(null); // Close dropdown after action
  };

  // Filter logic for categories
  const getFilteredCategories = () => {
    if (filterByCategory === "all") {
      return categories;
    }
    return categories.filter((category) => category.name === filterByCategory);
  };

  const filteredCategories = getFilteredCategories();

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCategories = filteredCategories.slice(
    indexOfFirstItem,
    indexOfLastItem
  ); // Use filteredCategories
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage); // Use filteredCategories

  // Reset page to 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filterByCategory]);

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
              {/* Left side: Category Table Title */}
              <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4 sm:mb-0">
                Product Categories
              </h2>

              {/* Right side: Add New Category Button and Filter Dropdown */}
              <div className="flex items-center space-x-4">
                <button className="bg-red-200 hover:bg-red-300 text-red-800 text-xs font-semibold py-2 px-4 rounded-md shadow-sm transition duration-300 ease-in-out">
                  <i className="fas fa-plus mr-2"></i>Add New Category
                </button>
                {/* Category Filter Dropdown */}
                <select
                  className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md shadow-sm w-auto max-w-fit"
                  value={filterByCategory}
                  onChange={(e) => setFilterByCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  {/* Dynamically generate options from unique category names */}
                  {[...new Set(categories.map((cat) => cat.name))].map(
                    (name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    )
                  )}
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
                      Category ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Number of Products
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-primary-100">
                  {currentCategories.length > 0 ? (
                    currentCategories.map((category, index) => (
                      <tr
                        key={category.id}
                        className="hover:bg-gray-50 transition duration-150 ease-in-out"
                      >
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {indexOfFirstItem + index + 1}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800">
                          {category.id}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800">
                          {category.name}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {category.productCount}
                        </td>
                        <td
                          className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 relative"
                          ref={dropdownRef}
                        >
                          <button
                            className="flex items-center justify-center w-6 h-6 text-gray-600 hover:text-gray-800 transition duration-150 ease-in-out focus:outline-none focus:ring-1 focus:ring-gray-200 focus:ring-opacity-75 rounded-full"
                            onClick={() => toggleDropdown(category.id)}
                            title="More Actions"
                          >
                            <i className="fas fa-ellipsis-h"></i>
                          </button>

                          {/* Dropdown Menu */}
                          {openDropdownId === category.id && (
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
                                  onClick={() => handleView(category.name)}
                                >
                                  <i className="fas fa-eye mr-2 text-blue-500"></i>
                                  View
                                </button>
                                <button
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                                  role="menuitem"
                                  onClick={() => handleEdit(category.name)}
                                >
                                  <i className="fas fa-edit mr-2 text-yellow-500"></i>
                                  Edit
                                </button>
                                <button
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                                  role="menuitem"
                                  onClick={() => handleDelete(category.name)}
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
                        colSpan="5"
                        className="px-4 py-3 text-center text-sm text-gray-500"
                      >
                        No categories found.
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
