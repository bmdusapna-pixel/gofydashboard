import React, { useState, useRef, useEffect } from "react";

// Main App component for Invoice Table
const App = () => {
  // Sample invoice data with a new 'customerAge' field
  const invoices = [
    {
      id: "inv-001",
      customerName: "Alex Johnson",
      customerAge: 1, // Represents 1 year old
      productName: "Crib Mobile",
      orderDate: "2025-08-01",
      total: 35.5,
      paymentMethod: "Credit Card",
      status: "Paid",
    },
    {
      id: "inv-002",
      customerName: "Sarah Davis",
      customerAge: 4,
      productName: "Dinosaur Toy Set",
      orderDate: "2025-07-29",
      total: 24.99,
      paymentMethod: "PayPal",
      status: "Paid",
    },
    {
      id: "inv-003",
      customerName: "Mark Wilson",
      customerAge: 8,
      productName: "Building Blocks Set",
      orderDate: "2025-07-28",
      total: 75.25,
      paymentMethod: "Bank Transfer",
      status: "Pending",
    },
    {
      id: "inv-004",
      customerName: "Emily White",
      customerAge: 2,
      productName: "Toddler T-shirt",
      orderDate: "2025-07-25",
      total: 15.0,
      paymentMethod: "Credit Card",
      status: "Paid",
    },
    {
      id: "inv-005",
      customerName: "David Lee",
      customerAge: 0.5, // 6 months old
      productName: "Plush Rattle",
      orderDate: "2025-07-24",
      total: 9.99,
      paymentMethod: "Bank Transfer",
      status: "Paid",
    },
    {
      id: "inv-006",
      customerName: "Jessica Chen",
      customerAge: 6,
      productName: "Children's Art Easel",
      orderDate: "2025-07-22",
      total: 52.75,
      paymentMethod: "PayPal",
      status: "Pending",
    },
  ];

  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterByAgeGroup, setFilterByAgeGroup] = useState("all"); // New filter state for age
  const itemsPerPage = 5;
  const dropdownRef = useRef(null);

  const getStatusClasses = (status) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const toggleDropdown = (id) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

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

  const handleView = (invoiceId) => {
    console.log(`Viewing details for invoice: ${invoiceId}`);
    setOpenDropdownId(null);
  };

  const handleEdit = (invoiceId) => {
    console.log(`Editing invoice: ${invoiceId}`);
    setOpenDropdownId(null);
  };

  const handleDelete = (invoiceId) => {
    console.log(`Deleting invoice: ${invoiceId}`);
    setOpenDropdownId(null);
  };

  // New filter logic for invoices based on age group
  const getFilteredInvoices = () => {
    if (filterByAgeGroup === "all") {
      return invoices;
    }
    return invoices.filter((invoice) => {
      const age = invoice.customerAge;
      switch (filterByAgeGroup) {
        case "infant":
          return age >= 0 && age <= 1;
        case "toddler":
          return age > 1 && age <= 3;
        case "preschool":
          return age > 3 && age <= 5;
        case "school-age":
          return age > 5;
        default:
          return true;
      }
    });
  };

  const filteredInvoices = getFilteredInvoices();

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentInvoices = filteredInvoices.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterByAgeGroup]); // Reset page when age group filter changes

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      setOpenDropdownId(null);
    }
  };

  // Function to handle CSV export
  const handleExportCSV = () => {
    const headers = [
      "Invoice ID",
      "Customer Name",
      "Customer Age",
      "Product Name",
      "Order Date",
      "Total",
      "Payment Method",
      "Status",
    ];
    const csvContent = [
      headers.join(","),
      ...filteredInvoices.map((invoice) =>
        Object.values(invoice)
          .map((value) => `"${value}"`)
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "invoices.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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
          <div className="bg-white p-6 rounded-xl shadow-sm border border-primary-100">
            {/* Header Section with Export Button and New Filter */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4 sm:mb-0">
                Children's Products Invoices
              </h2>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* Age Group Filter Dropdown */}
                <select
                  className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md shadow-sm w-auto max-w-fit"
                  value={filterByAgeGroup}
                  onChange={(e) => setFilterByAgeGroup(e.target.value)}
                >
                  <option value="all">All Ages</option>
                  <option value="infant">Infant (0-1 yr)</option>
                  <option value="toddler">Toddler (1-3 yrs)</option>
                  <option value="preschool">Preschool (3-5 yrs)</option>
                  <option value="school-age">School-Age (5+ yrs)</option>
                </select>

                {/* Export Button */}
                <button
                  onClick={handleExportCSV}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition duration-150 ease-in-out shadow-sm flex items-center"
                >
                  <i className="fas fa-file-csv mr-2"></i>
                  Export to CSV
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
                      Invoice ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Method
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
                  {currentInvoices.length > 0 ? (
                    currentInvoices.map((invoice, index) => (
                      <tr
                        key={invoice.id}
                        className="hover:bg-gray-50 transition duration-150 ease-in-out"
                      >
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {indexOfFirstItem + index + 1}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800">
                          {invoice.id}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {invoice.customerName}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {invoice.productName}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {invoice.orderDate}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          ₹{invoice.total.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {invoice.paymentMethod}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusClasses(
                              invoice.status
                            )}`}
                          >
                            {invoice.status}
                          </span>
                        </td>
                        <td
                          className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 relative"
                          ref={dropdownRef}
                        >
                          <button
                            className="flex items-center justify-center w-6 h-6 text-gray-600 hover:text-gray-800 transition duration-150 ease-in-out focus:outline-none focus:ring-1 focus:ring-gray-200 focus:ring-opacity-75 rounded-full"
                            onClick={() => toggleDropdown(invoice.id)}
                            title="More Actions"
                          >
                            <i className="fas fa-ellipsis-h"></i>
                          </button>

                          {openDropdownId === invoice.id && (
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
                                  onClick={() => handleView(invoice.id)}
                                >
                                  <i className="fas fa-eye mr-2 text-blue-500"></i>
                                  View
                                </button>
                                <button
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                                  role="menuitem"
                                  onClick={() => handleEdit(invoice.id)}
                                >
                                  <i className="fas fa-edit mr-2 text-yellow-500"></i>
                                  Edit
                                </button>
                                <button
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                                  role="menuitem"
                                  onClick={() => handleDelete(invoice.id)}
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
                        No invoices found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
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
