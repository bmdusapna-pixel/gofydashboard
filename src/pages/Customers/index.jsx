import React, { useState, useRef, useEffect } from "react";

// Main App component for Customer User Profile Table
const App = () => {
  // Sample customer user profile data
  const customerProfiles = [
    {
      id: "cust-001",
      customerId: "CUST-001",
      customerName: "Alice Wonderland",
      customerImage: "https://placehold.co/40x40/FFD700/000?text=AW", // Placeholder image
      email: "alice.w@example.com",
      phone: "123-456-7890",
      address: "123 Main St, Anytown, USA",
      registrationDate: "2024-01-15",
      totalOrders: 15,
      lastActive: "2025-07-18",
    },
    {
      id: "cust-002",
      customerId: "CUST-002",
      customerName: "Bob The Builder",
      customerImage: "https://placehold.co/40x40/87CEEB/000?text=BB",
      email: "bob.b@example.com",
      phone: "987-654-3210",
      address: "456 Oak Ave, Somewhere, USA",
      registrationDate: "2023-11-01",
      totalOrders: 8,
      lastActive: "2025-07-10",
    },
    {
      id: "cust-003",
      customerId: "CUST-003",
      customerName: "Charlie Chaplin",
      customerImage: "https://placehold.co/40x40/FF6347/000?text=CC",
      email: "charlie.c@example.com",
      phone: "111-222-3333",
      address: "789 Pine Ln, Cityville, USA",
      registrationDate: "2024-03-20",
      totalOrders: 22,
      lastActive: "2025-07-19",
    },
    {
      id: "cust-004",
      customerId: "CUST-004",
      customerName: "Diana Prince",
      customerImage: "https://placehold.co/40x40/9ACD32/000?text=DP",
      email: "diana.p@example.com",
      phone: "444-555-6666",
      address: "101 Elm St, Townsville, USA",
      registrationDate: "2023-09-05",
      totalOrders: 10,
      lastActive: "2025-07-15",
    },
    {
      id: "cust-005",
      customerId: "CUST-005",
      customerName: "Eve Harrington",
      customerImage: "https://placehold.co/40x40/DDA0DD/000?text=EH",
      email: "eve.h@example.com",
      phone: "777-888-9999",
      address: "202 Maple Rd, Villageton, USA",
      registrationDate: "2024-06-10",
      totalOrders: 5,
      lastActive: "2025-07-01",
    },
    {
      id: "cust-006",
      customerId: "CUST-006",
      customerName: "Frank Sinatra",
      customerImage: "https://placehold.co/40x40/C0C0C0/000?text=FS",
      email: "frank.s@example.com",
      phone: "321-654-9870",
      address: "303 Birch Ct, Hamlet, USA",
      registrationDate: "2023-04-22",
      totalOrders: 30,
      lastActive: "2025-07-18",
    },
    {
      id: "cust-007",
      customerId: "CUST-007",
      customerName: "Grace Kelly",
      customerImage: "https://placehold.co/40x40/ADD8E6/000?text=GK",
      email: "grace.k@example.com",
      phone: "654-321-0987",
      address: "404 Cedar Dr, Borough, USA",
      registrationDate: "2024-02-14",
      totalOrders: 18,
      lastActive: "2025-07-05",
    },
    {
      id: "cust-008",
      customerId: "CUST-008",
      customerName: "Harry Potter",
      customerImage: "https://placehold.co/40x40/FFB6C1/000?text=HP",
      email: "harry.p@example.com",
      phone: "999-888-7777",
      address: "505 Fir Blvd, Metropolis, USA",
      registrationDate: "2023-07-30",
      totalOrders: 12,
      lastActive: "2025-07-12",
    },
    {
      id: "cust-009",
      customerId: "CUST-009",
      customerName: "Ivy Queen",
      customerImage: "https://placehold.co/40x40/90EE90/000?text=IQ",
      email: "ivy.q@example.com",
      phone: "123-987-4560",
      address: "606 Spruce Rd, Capital, USA",
      registrationDate: "2024-05-01",
      totalOrders: 7,
      lastActive: "2025-07-17",
    },
    {
      id: "cust-010",
      customerId: "CUST-010",
      customerName: "Jack Sparrow",
      customerImage: "https://placehold.co/40x40/DDA0DD/000?text=JS",
      email: "jack.s@example.com",
      phone: "098-765-4321",
      address: "707 Willow Way, Port Town, USA",
      registrationDate: "2023-10-10",
      totalOrders: 25,
      lastActive: "2025-07-16",
    },
  ];

  // State to manage which dropdown is open (stores the customer ID)
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
  const handleView = (customerId) => {
    console.log(`Viewing details for customer: ${customerId}`);
    setOpenDropdownId(null); // Close dropdown after action
  };

  const handleEdit = (customerId) => {
    console.log(`Editing customer: ${customerId}`);
    setOpenDropdownId(null); // Close dropdown after action
  };

  const handleDelete = (customerId) => {
    console.log(`Deleting customer: ${customerId}`);
    setOpenDropdownId(null); // Close dropdown after action
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCustomerProfiles = customerProfiles.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(customerProfiles.length / itemsPerPage);

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
              {/* Left side: Customer User Profile Title */}
              <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4 sm:mb-0">
                Customer User Profiles
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
                      Customer ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Address
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Registration Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Orders
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Active
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-primary-100">
                  {currentCustomerProfiles.length > 0 ? (
                    currentCustomerProfiles.map((customer, index) => (
                      <tr
                        key={customer.id}
                        className="hover:bg-gray-50 transition duration-150 ease-in-out"
                      >
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {indexOfFirstItem + index + 1}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800">
                          {customer.customerId}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800 flex items-center">
                          <img
                            src={customer.customerImage}
                            alt={customer.customerName}
                            className="w-10 h-10 rounded-full mr-3 object-cover shadow-sm"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                "https://placehold.co/40x40/CCCCCC/000?text=N/A";
                            }}
                          />
                          <span>{customer.customerName}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {customer.email}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {customer.phone}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {customer.address}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {customer.registrationDate}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {customer.totalOrders}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {customer.lastActive}
                        </td>
                        <td
                          className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 relative"
                          ref={dropdownRef}
                        >
                          <button
                            className="flex items-center justify-center w-6 h-6 text-gray-600 hover:text-gray-800 transition duration-150 ease-in-out focus:outline-none focus:ring-1 focus:ring-gray-200 focus:ring-opacity-75 rounded-full"
                            onClick={() => toggleDropdown(customer.id)}
                            title="More Actions"
                          >
                            <i className="fas fa-ellipsis-h"></i>
                          </button>

                          {/* Dropdown Menu */}
                          {openDropdownId === customer.id && (
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
                                  onClick={() =>
                                    handleView(customer.customerId)
                                  }
                                >
                                  <i className="fas fa-eye mr-2 text-blue-500"></i>
                                  View
                                </button>
                                <button
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                                  role="menuitem"
                                  onClick={() =>
                                    handleEdit(customer.customerId)
                                  }
                                >
                                  <i className="fas fa-edit mr-2 text-yellow-500"></i>
                                  Edit
                                </button>
                                <button
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                                  role="menuitem"
                                  onClick={() =>
                                    handleDelete(customer.customerId)
                                  }
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
                        colSpan="10"
                        className="px-4 py-3 text-center text-sm text-gray-500"
                      >
                        No customer profiles found.
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
