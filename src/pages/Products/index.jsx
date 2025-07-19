import React, { useState, useRef, useEffect } from "react";
// Removed FontAwesome imports as they are causing resolution errors in this environment.
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faPlus, faEye, faEdit, faTrashAlt, faEllipsisH } from '@fortawesome/free-solid-svg-icons';

// Main App component
const App = () => {
  // Sample product data for toys with diverse dates
  const products = [
    {
      id: "toy-001",
      image: "https://placehold.co/40x40/FFD700/000?text=Bear", // Fixed image URL
      name: "Cuddly Plush Bear",
      category: "Stuffed Animals",
      stock: 150,
      price: 19.99,
      status: "In Stock",
      dateAdded: "2025-07-15", // This week
    },
    {
      id: "toy-002",
      image: "https://placehold.co/40x40/87CEEB/000?text=Blocks", // Fixed image URL
      name: "Giant Building Blocks Set",
      category: "Construction Toys",
      stock: 75,
      price: 49.5,
      status: "Low Stock",
      dateAdded: "2025-07-01", // This month
    },
    {
      id: "toy-003",
      image: "https://placehold.co/40x40/FF6347/000?text=Car", // Fixed image URL
      name: "Remote Control Race Car",
      category: "Vehicles",
      stock: 30,
      price: 34.99,
      status: "On Order",
      dateAdded: "2025-06-28", // Last month
    },
    {
      id: "toy-004",
      image: "https://placehold.co/40x40/9ACD32/000?text=Dino", // Fixed image URL
      name: "Roaring Dinosaur Figure",
      category: "Action Figures",
      stock: 90,
      price: 25.0,
      status: "In Stock",
      dateAdded: "2025-07-10", // This week
    },
    {
      id: "toy-005",
      image: "https://placehold.co/40x40/DDA0DD/000?text=Game", // Fixed image URL
      name: "Family Fun Board Game",
      category: "Board Games",
      stock: 0,
      price: 29.99,
      status: "Out of Stock",
      dateAdded: "2025-01-20", // This year
    },
    {
      id: "toy-006",
      image: "https://placehold.co/40x40/C0C0C0/000?text=Robot", // Fixed image URL
      name: "Interactive Robot",
      category: "Robotics",
      stock: 45,
      price: 79.99,
      status: "In Stock",
      dateAdded: "2024-12-01", // Last year
    },
    {
      id: "toy-007",
      image: "https://placehold.co/40x40/ADD8E6/000?text=Doll", // Fixed image URL
      name: "Fashion Doll Set",
      category: "Dolls",
      stock: 120,
      price: 24.99,
      status: "In Stock",
      dateAdded: "2025-07-18", // Today
    },
    {
      id: "toy-008",
      image: "https://placehold.co/40x40/FFB6C1/000?text=Puzzle", // Fixed image URL
      name: "Jigsaw Puzzle (1000 pcs)",
      category: "Puzzles",
      stock: 60,
      price: 15.0,
      status: "Low Stock",
      dateAdded: "2025-07-05", // This month
    },
    {
      id: "toy-009",
      image: "https://placehold.co/40x40/90EE90/000?text=Train", // Fixed image URL
      name: "Electric Train Set",
      category: "Vehicles",
      stock: 20,
      price: 120.0,
      status: "On Order",
      dateAdded: "2025-05-10", // This year
    },
    {
      id: "toy-010",
      image: "https://placehold.co/40x40/DDA0DD/000?text=Art", // Fixed image URL
      name: "Deluxe Art Kit",
      category: "Art & Craft",
      stock: 80,
      price: 39.99,
      status: "In Stock",
      dateAdded: "2025-07-17", // This week
    },
    {
      id: "toy-011",
      image: "https://placehold.co/40x40/ADD8E6/000?text=Truck", // Fixed image URL
      name: "Monster Truck",
      category: "Vehicles",
      stock: 10,
      price: 29.99,
      status: "Low Stock",
      dateAdded: "2024-09-15", // Last year
    },
    {
      id: "toy-012",
      image: "https://placehold.co/40x40/FFD700/000?text=Fig", // Fixed image URL
      name: "Superhero Action Figure",
      category: "Action Figures",
      stock: 50,
      price: 14.5,
      status: "In Stock",
      dateAdded: "2025-02-28", // This year
    },
  ];

  // State to manage which dropdown is open (stores the product ID)
  const [openDropdownId, setOpenDropdownId] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of items to display per page

  // Date filter state
  const [filterByDate, setFilterByDate] = useState("all"); // 'all', 'week', 'month', 'year'

  // Category filter state
  const [filterByCategory, setFilterByCategory] = useState("all"); // 'all', 'Stuffed Animals', etc.

  // Ref to detect clicks outside the dropdown
  const dropdownRef = useRef(null);

  // Function to determine status badge styling
  const getStatusClasses = (status) => {
    switch (status) {
      case "In Stock":
        return "bg-green-100 text-green-800";
      case "Low Stock":
        return "bg-yellow-100 text-yellow-800";
      case "On Order":
        return "bg-blue-100 text-blue-800";
      case "Out of Stock":
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
  const handleView = (productName) => {
    console.log(`Viewing details for: ${productName}`);
    setOpenDropdownId(null); // Close dropdown after action
  };

  const handleEdit = (productName) => {
    console.log(`Editing: ${productName}`);
    setOpenDropdownId(null); // Close dropdown after action
  };

  const handleDelete = (productName) => {
    console.log(`Deleting: ${productName}`);
    setOpenDropdownId(null); // Close dropdown after action
  };

  // Filtering logic
  const getFilteredProducts = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // Midnight today

    return products.filter((product) => {
      const productDate = new Date(product.dateAdded);
      productDate.setHours(0, 0, 0, 0); // Normalize to midnight for comparison

      let matchesDate = true;
      if (filterByDate === "week") {
        const sevenDaysAgo = new Date(today); // Create a new Date object
        sevenDaysAgo.setDate(today.getDate() - 7);
        matchesDate = productDate >= sevenDaysAgo && productDate <= today;
      } else if (filterByDate === "month") {
        matchesDate =
          productDate.getMonth() === today.getMonth() &&
          productDate.getFullYear() === today.getFullYear();
      } else if (filterByDate === "year") {
        matchesDate = productDate.getFullYear() === today.getFullYear();
      }

      const matchesCategory =
        filterByCategory === "all" || product.category === filterByCategory;

      return matchesDate && matchesCategory;
    });
  };

  const filteredProducts = getFilteredProducts();

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  ); // Use filteredProducts
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage); // Use filteredProducts

  // Reset page to 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filterByDate, filterByCategory]); // Reset page on any filter change

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
          <div className="bg-white p-6 rounded-xl shadow-sm border border-primary-100">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              {/* Left side: Product Catalog Title */}
              <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4 sm:mb-0">
                Product Catalog
              </h2>

              {/* Right side: Add New Toy Button and Filter Dropdowns, grouped */}
              <div className="flex items-center space-x-4">
                <button className="bg-red-200 hover:bg-red-300 text-red-800 text-xs font-semibold py-2 px-4 rounded-md shadow-sm transition duration-300 ease-in-out">
                  <i className="fas fa-plus mr-2"></i>Add New Toy
                </button>
                {/* Date Filter Dropdown */}
                <select
                  className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md shadow-sm w-auto max-w-fit"
                  value={filterByDate}
                  onChange={(e) => setFilterByDate(e.target.value)}
                >
                  <option value="all">All Time</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
                </select>
                {/* Category Filter Dropdown */}
                <select
                  className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md shadow-sm w-auto max-w-fit"
                  value={filterByCategory}
                  onChange={(e) => setFilterByCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  {/* Dynamically generate options from unique category names */}
                  {[
                    ...new Set(products.map((product) => product.category)),
                  ].map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
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
                      Product ID
                    </th>{" "}
                    {/* Added Product ID column */}
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Toy Details
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-primary-100">
                  {currentProducts.length > 0 ? (
                    currentProducts.map((product, index) => (
                      <tr
                        key={product.id}
                        className="hover:bg-gray-50 transition duration-150 ease-in-out"
                      >
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {indexOfFirstItem + index + 1}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800">
                          {product.id} {/* Display Product ID */}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800 flex items-center">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-10 h-10 rounded-md mr-3 object-cover shadow-sm"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                "https://placehold.co/40x40/CCCCCC/000?text=N/A";
                            }}
                          />
                          <span>{product.name}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {product.category}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {product.stock}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          ${product.price.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusClasses(
                              product.status
                            )}`}
                          >
                            {product.status}
                          </span>
                        </td>
                        <td
                          className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 relative"
                          ref={dropdownRef}
                        >
                          <button
                            className="flex items-center justify-center w-6 h-6 text-gray-600 hover:text-gray-800 transition duration-150 ease-in-out focus:outline-none focus:ring-1 focus:ring-gray-200 focus:ring-opacity-75 rounded-full"
                            onClick={() => toggleDropdown(product.id)}
                            title="More Actions"
                          >
                            <i className="fas fa-ellipsis-h"></i>
                          </button>

                          {/* Dropdown Menu */}
                          {openDropdownId === product.id && (
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
                                  onClick={() => handleView(product.name)}
                                >
                                  <i className="fas fa-eye mr-2 text-blue-500"></i>
                                  View
                                </button>
                                <button
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                                  role="menuitem"
                                  onClick={() => handleEdit(product.name)}
                                >
                                  <i className="fas fa-edit mr-2 text-yellow-500"></i>
                                  Edit
                                </button>
                                <button
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                                  role="menuitem"
                                  onClick={() => handleDelete(product.name)}
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
                        {" "}
                        {/* Updated colspan */}
                        No products found for the selected filter.
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
