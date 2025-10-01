import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

import api from "../../api/axios";

const App = () => {
  const [customerProfiles, setCustomerProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";

  const [openDropdownId, setOpenDropdownId] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const dropdownRefs = useRef({});

  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const response = await api.get("/user/auth/all");
      const fetchedUsers = response.data.users;

      const formattedProfiles = fetchedUsers.map((user, index) => {
        const registrationDate = user.createdAt
          ? new Date(user.createdAt).toISOString().split("T")[0]
          : "N/A";
        const customerId = `CUST-${user._id.slice(-4).toUpperCase()}`;
        const nameInitials = user.name
          ? user.name
              .split(" ")
              .map((n) => n[0])
              .join("")
          : "N/A";
        const imageColor =
          "#" +
          Math.floor(Math.random() * 16777215)
            .toString(16)
            .padStart(6, "0");
        const customerImage = `https://placehold.co/40x40/${imageColor.substring(
          1
        )}/000?text=${nameInitials}`;

        return {
          id: user._id,
          customerId: customerId,
          customerName: user.name || "N/A",
          customerImage: customerImage,
          phone: user.phone || "N/A",
          registrationDate: registrationDate,
          totalOrders: 15,
          lastActive: "2025-07-18",
          source: "Web",
        };
      });

      setCustomerProfiles(formattedProfiles);
    } catch (error) {
      console.error("Error fetching users:", error);
      setCustomerProfiles([
        {
          id: "cust-001",
          customerId: "CUST-001",
          customerName: "Alice Wonderland",
          customerImage: "https://placehold.co/40x40/FFD700/000?text=AW",
          phone: "123-456-7890",
          registrationDate: "2024-01-15",
          totalOrders: 15,
          lastActive: "2025-07-18",
          source: "Web",
        },
      ]);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    setFilteredProfiles(customerProfiles);
  }, [customerProfiles]);

  useEffect(() => {
    const filtered = customerProfiles.filter(
      (customer) =>
        customer.customerName.toLowerCase().includes(searchQuery) ||
        customer.customerId.toLowerCase().includes(searchQuery) ||
        customer.phone.toLowerCase().includes(searchQuery)
    );
    setFilteredProfiles(filtered);
    setCurrentPage(1);
  }, [searchQuery, customerProfiles]);

  // Toggle dropdown visibility
  const toggleDropdown = (id) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        openDropdownId &&
        dropdownRefs.current[openDropdownId] &&
        !dropdownRefs.current[openDropdownId].contains(event.target)
      ) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdownId]);

  const handleView = (customerId) => {
    navigate(`/customers/${customerId}`);
    console.log(`Navigating to profile for customer: ${customerId}`);
    setOpenDropdownId(null);
  };

  const handleEdit = (customerId) => {
    console.log(`Editing customer: ${customerId}`);
    setOpenDropdownId(null);
  };

  const handleDelete = (customerId) => {
    console.log(`Deleting customer: ${customerId}`);
    setOpenDropdownId(null);
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCustomerProfiles = filteredProfiles.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredProfiles.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      setOpenDropdownId(null);
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
          <div className="bg-white p-6 rounded-xl shadow-sm border border-primary-100 mb-6">
            <h3 className="text-md font-semibold text-gray-700 mb-4">Filter</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* Sign Up From */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Sign Up From
                </label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary-300 focus:outline-none"
                />
              </div>

              {/* Sign Up To */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Sign Up To
                </label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary-300 focus:outline-none"
                />
              </div>

              {/* Last Login From */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Last Login From
                </label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary-300 focus:outline-none"
                />
              </div>

              {/* Last Login To */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Last Login To
                </label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary-300 focus:outline-none"
                />
              </div>

              {/* State */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  State
                </label>
                <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary-300 focus:outline-none">
                  <option value="">Select State</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Karnataka">Karnataka</option>
                </select>
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  City
                </label>
                <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary-300 focus:outline-none">
                  <option value="">Select City</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Pune">Pune</option>
                  <option value="Bengaluru">Bengaluru</option>
                </select>
              </div>

              {/* Pincode */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Pincode
                </label>
                <input
                  type="text"
                  placeholder="Enter Pincode"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary-300 focus:outline-none"
                />
              </div>

              {/* Platform */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Platform
                </label>
                <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary-300 focus:outline-none">
                  <option value="">Select Platform</option>
                  <option value="Web">Web</option>
                  <option value="Android">Android App</option>
                  <option value="iOS">iOS App</option>
                </select>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end mt-4 space-x-2">
              <button className="px-4 py-2 text-sm font-medium bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
                Reset
              </button>
              <button className="px-4 py-2 text-sm font-medium bg-yellow-500 text-white rounded-md hover:bg-yellow-600">
                Apply Filter
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-primary-100">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4 sm:mb-0">
                Customer Profiles
              </h2>
              <div className="flex items-center"></div>
            </div>
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
                      Source
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
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
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800">
                          {customer.source}
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
                          {customer.phone}
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
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 relative">
                          <button
                            className="flex items-center justify-center w-6 h-6 text-gray-600 hover:text-gray-800 transition duration-150 ease-in-out focus:outline-none focus:ring-1 focus:ring-gray-200 focus:ring-opacity-75 rounded-full"
                            onClick={() => toggleDropdown(customer.id)}
                            title="More Actions"
                          >
                            <i className="fas fa-ellipsis-h"></i>
                          </button>
                          {openDropdownId === customer.id && (
                            <div
                              className="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg z-10 border border-primary-100"
                              ref={(el) =>
                                (dropdownRefs.current[customer.id] = el)
                              }
                            >
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
                        colSpan="9"
                        className="px-4 py-3 text-center text-sm text-gray-500"
                      >
                        No customer profiles found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
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
