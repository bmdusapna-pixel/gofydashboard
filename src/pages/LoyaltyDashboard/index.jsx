import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Mock data for customers
const customerProfiles = [
  {
    id: "cust-001",
    customerId: "CUST-001",
    customerName: "Alice Wonderland",
    customerImage: "https://placehold.co/40x40/FFD700/000?text=AW",
    phone: "123-456-7890",
    registrationDate: "2024-01-15",
    totalOrders: 15,
    lastActive: "2025-07-18",
    totalPoints: 550,
  },
  {
    id: "cust-002",
    customerId: "CUST-002",
    customerName: "Bob The Builder",
    customerImage: "https://placehold.co/40x40/87CEEB/000?text=BB",
    phone: "987-654-3210",
    registrationDate: "2023-11-01",
    totalOrders: 8,
    lastActive: "2025-07-10",
    totalPoints: 300,
  },
  {
    id: "cust-003",
    customerId: "CUST-003",
    customerName: "Charlie Chaplin",
    customerImage: "https://placehold.co/40x40/FF6347/000?text=CC",
    phone: "111-222-3333",
    registrationDate: "2024-03-20",
    totalOrders: 22,
    lastActive: "2025-07-19",
    totalPoints: 870,
  },
];

const CustomerProfilesWithPoints = () => {
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRefs = useRef({});
  const navigate = useNavigate();

  // Toggle dropdown
  const toggleDropdown = (id) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  // Click outside to close dropdown
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdownId]);

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-primary-50">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-300">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-6">
          Loyalty Dashboard
        </h2>

        <div className="overflow-x-auto rounded-lg border border-gray-300">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Sr No.
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Customer ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Customer Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Phone
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Registration
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Total Orders
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Last Active
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Wallet Points
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-300">
              {customerProfiles.map((customer, index) => (
                <React.Fragment key={customer.id}>
                  <tr className="hover:bg-gray-50 transition duration-150 ease-in-out">
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">
                      {customer.customerId}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-800 flex items-center">
                      <img
                        src={customer.customerImage}
                        alt={customer.customerName}
                        className="w-10 h-10 rounded-full mr-3 object-cover shadow-sm"
                      />
                      {customer.customerName}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {customer.phone}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {customer.registrationDate}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {customer.totalOrders}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {customer.lastActive}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-yellow-700">
                      {customer.totalPoints} pts
                    </td>

                    {/* Action: plain text link "View Transactions" + ellipsis dropdown for other actions */}
                    <td className="px-4 py-3 text-sm text-gray-600 relative flex items-center gap-3">
                      <span
                        onClick={() =>
                          navigate(`/loyalty-dashboard/${customer.customerId}`)
                        }
                        className="text-blue-600 hover:underline cursor-pointer"
                      >
                        View Transactions
                      </span>

                      {/* Ellipsis dropdown (Edit/Delete etc.) */}
                      <button
                        className="flex items-center justify-center w-6 h-6 text-gray-600 hover:text-gray-800 rounded-full"
                        onClick={() => toggleDropdown(customer.id)}
                        title="More Actions"
                      >
                        <i className="fas fa-ellipsis-h"></i>
                      </button>

                      {openDropdownId === customer.id && (
                        <div
                          className="absolute right-0 mt-8 w-36 bg-white rounded-md shadow-lg z-10 border border-gray-300"
                          ref={(el) => (dropdownRefs.current[customer.id] = el)}
                        >
                          <div className="py-1">
                            <button
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => {
                                // example Edit action
                                console.log("Edit", customer.customerId);
                                setOpenDropdownId(null);
                              }}
                            >
                              <i className="fas fa-edit mr-2 text-yellow-500"></i>
                              Edit
                            </button>
                            <button
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => {
                                // example Delete action
                                console.log("Delete", customer.customerId);
                                setOpenDropdownId(null);
                              }}
                            >
                              <i className="fas fa-trash-alt mr-2 text-red-500"></i>
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfilesWithPoints;
