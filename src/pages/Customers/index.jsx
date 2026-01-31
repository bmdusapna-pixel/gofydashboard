import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

import api from "../../api/axios";
import axios from "axios";

const App = () => {
  const [customerProfiles, setCustomerProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [points, setPoints] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [remarks, setRemarks] = useState("");
  const [state, setState] = useState([]);
  const [city, setCity] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const [openDropdownId, setOpenDropdownId] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const dropdownRefs = useRef({});
  const [filters, setFilters] = useState(
    {
      userId: "",
      name: "",
      email: "",
      phone: "",
      signupFrom: "",
      signupTo: "",
      state: "",
      city: "",
      pincode: ""
    }
  )

  const navigate = useNavigate();

  const fetchUsers = async (query) => {
    try {
      setLoading(true)
      console.log(query)
      const response = await api.get(`/user/auth/all?${query}`);
      const fetchedUsers = response.data.users;
      console.log(fetchedUsers)
      const stateSet = new Set();
      const citySet = new Set();
      const formattedProfiles = fetchedUsers.map((user, index) => {
        console.log("user see", user.isEnabled)
        const address = user.addresses?.[0];
        if (address?.state) stateSet.add(address.state);
        if (address?.city) citySet.add(address.city);
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
          totalOrders: user.totalOrders,
          isEnabled: user.isEnabled || false
        };
      });
      setCustomerProfiles(formattedProfiles);
      setState([...stateSet]);
      setCity([...citySet]);
    } catch (error) {
      setError(error)
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false)
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const buildQueryParams = () => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });

    return params.toString();
  };

  const applyFilters = () => {
    const query = buildQueryParams();
    fetchUsers(query);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({
      userId: "",
      name: "",
      email: "",
      phone: "",
      signupFrom: "",
      signupTo: "",
      state: "",
      city: "",
      pincode: "",
    });

    fetchUsers(); // fetch all users again
    setCurrentPage(1);
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

  const toggleUserStatus = async (userId) => {
    try {
      await api.patch(`/user/auth/toggle-enable/${userId}`);
  
      // Update UI instantly (no refetch needed)
      setCustomerProfiles((prev) =>
        prev.map((user) =>
          user.id === userId
            ? { ...user, isEnabled: !user.isEnabled }
            : user
        )
      );
    } catch (error) {
      console.error("Failed to toggle user status", error);
      alert("Failed to update user status");
    }
  };
  

  const handleView = (customerId) => {
    navigate(`/customers/${customerId}`);
    console.log(`Navigating to profile for customer: ${customerId}`);
    setOpenDropdownId(null);
  };

  const handleEdit = (customerId) => {
    console.log(`Editing customer: ${customerId}`);
    setOpenDropdownId(null);
  };

  const handleDelete = async (customerId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this customer? This action cannot be undone."
    );
  
    if (!confirmed) return;
  
    try {
      await api.delete(`/user/auth/delete/${customerId}`);
  
      // remove from UI after delete
      setCustomerProfiles((prev) =>
        prev.filter((customer) => customer.id !== customerId)
      );
  
      alert("Customer deleted successfully");
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete customer");
    }
  };
  

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCustomerProfiles = filteredProfiles.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  console.log("customer profiles", currentCustomerProfiles)
  const totalPages = Math.ceil(filteredProfiles.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      setOpenDropdownId(null);
    }
  };

  // Handle Save points
  const handleSavePoints = () => {
    if (!points || !expiryDate) {
      alert("Please fill both fields!");
      return;
    }

    console.log("Add Points:", {
      customerId: selectedCustomer.customerId,
      customerName: selectedCustomer.customerName,
      points,
      expiryDate,
    });

    setPoints("");
    setExpiryDate("");
    setIsModalOpen(false);
    setSelectedCustomer(null);
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
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
              {/* Customer ID */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Customer ID
                </label>
                <input
                  type="text"
                  name="userId"
                  value={filters.userId}
                  onChange={handleChange}
                  placeholder="Enter Customer ID"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary-300 focus:outline-none"
                />
              </div>
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={filters.name}
                  onChange={handleChange}
                  placeholder="Enter Name"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={filters.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary-300 focus:outline-none"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={filters.phone}
                  onChange={handleChange}
                  placeholder="Enter Phone Number"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary-300 focus:outline-none"
                />
              </div>
              {/* Sign Up From */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Sign Up From
                </label>
                <input
                  type="date"
                  name="signupFrom"
                  value={filters.signupFrom}
                  onChange={handleChange}
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
                  name="signupTo"
                  value={filters.signupTo}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary-300 focus:outline-none"
                />
              </div>

              {/* State */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  State
                </label>
                <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary-300 focus:outline-none"
                  name="state"
                  value={filters.state}
                  onChange={handleChange}>
                  {
                    state.map((name) =>
                      <option value={name}>{name}</option>
                    )
                  }
                </select>
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  City
                </label>
                <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary-300 focus:outline-none"
                  name="city"
                  value={filters.city}
                  onChange={handleChange}>
                  {
                    city.map((name) =>
                      <option value={name}>{name}</option>
                    )
                  }
                </select>
              </div>

              {/* Pincode */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Pincode
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={filters.pincode}
                  onChange={handleChange}
                  placeholder="Enter Pincode"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary-300 focus:outline-none"
                />
              </div>
            </div>
            {/* Buttons */}
            <div>
              <div className="w-full flex justify-end mt-6 space-x-2">
                <button className="px-4 py-2 text-sm font-medium bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                  onClick={resetFilters}>
                  Reset
                </button>
                <button className="px-4 py-2 text-sm font-medium bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                  onClick={applyFilters}>
                  Apply Filter
                </button>
              </div>
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
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-primary-100">
                  {!loading && !error && currentCustomerProfiles.length > 0 ?
                    (
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
                            {customer.phone}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                            {customer.registrationDate}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                            {customer.totalOrders}
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => toggleUserStatus(customer.id)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${customer.isEnabled ? "bg-green-500" : "bg-gray-300"
                                }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${customer.isEnabled ? "translate-x-6" : "translate-x-1"
                                  }`}
                              />
                            </button>
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
                                      handleView(customer.id)
                                    }
                                  >
                                    <i className="fas fa-eye mr-2 text-blue-500"></i>
                                    View
                                  </button>
                                  <button
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                                    role="menuitem"
                                    onClick={() => {
                                      setSelectedCustomer(customer);
                                      setIsModalOpen(true);
                                      setOpenDropdownId(null);
                                    }}
                                  >
                                    <i className="fas fa-plus mr-2 text-green-600"></i>
                                    Add Points
                                  </button>
                                  <button
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                                    role="menuitem"
                                    onClick={() =>
                                      handleEdit(customer.id)
                                    }
                                  >
                                    <i className="fas fa-edit mr-2 text-yellow-500"></i>
                                    Edit
                                  </button>
                                  <button
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                                    role="menuitem"
                                    onClick={() =>
                                      handleDelete(customer.id)
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
                    ) : loading ?
                      (
                        <tr>
                          <td
                            colSpan="9"
                            className="px-4 py-8 text-center text-sm text-gray-500"
                          >
                            Loading users...
                          </td>
                        </tr>
                      )
                      : (
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
                    className={`px-3 py-1 text-sm rounded-md ${currentPage === i + 1
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
        {/* Modal for Add Points */}
        {isModalOpen && selectedCustomer && (
          <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-2xl shadow-lg">
              <div className="flex justify-between">
                <h3 className="text-lg font-semibold mb-4">
                  Add Points for {selectedCustomer.customerName}
                </h3>
                <div className="h-6 w-6 p-1 bg-gray-200 rounded-full hover:bg-gray-300 cursor-pointer flex items-center justify-center">
                  <i
                    className="fas fa-times"
                    onClick={() => {
                      setIsModalOpen(false);
                      setPoints("");
                      setExpiryDate("");
                      setRemarks("");
                    }}
                  ></i>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm text-gray-700 mb-1">
                  Points
                </label>
                <input
                  type="number"
                  value={points}
                  onChange={(e) => setPoints(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring focus:ring-blue-200"
                  placeholder="Enter points"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm text-gray-700 mb-1">
                  Expiry Date
                </label>
                <input
                  type="datetime-local"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring focus:ring-blue-200"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm text-gray-700 mb-1">
                  Remarks
                </label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  rows="3"
                  placeholder="Enter remarks (optional)"
                  className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring focus:ring-blue-200 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setPoints("");
                    setExpiryDate("");
                    setRemarks("");
                  }}
                  className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePoints}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default App;
