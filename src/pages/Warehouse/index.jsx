import React, { useState, useRef, useEffect } from "react";
import { warehouses } from "../../assets/orders.list";
import { EllipsisVertical, Eye, Pencil, Plus, Trash2 } from "lucide-react";

const table_header = [
  { _id: 1, title: "Sr No." },
  { _id: 2, title: "Warehouse ID" },
  { _id: 3, title: "Warehouse Name" },
  { _id: 4, title: "Location" },
  { _id: 5, title: "Manager" },
  { _id: 6, title: "Contact Number" },
  { _id: 7, title: "Stock Available" },
  { _id: 8, title: "Stock Shipping" },
  { _id: 9, title: "Warehouse Revenue" },
  { _id: 10, title: "Action" },
];

const WareHouse = () => {
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const dropdownRef = useRef(null);

  const itemsPerPage = 5;

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

  const handleView = (warehouseName) => {
    console.log(`Viewing details for warehouse: ${warehouseName}`);
    setOpenDropdownId(null);
  };

  const handleEdit = (warehouseName) => {
    console.log(`Editing warehouse: ${warehouseName}`);
    setOpenDropdownId(null);
  };

  const handleDelete = (warehouseName) => {
    console.log(`Deleting warehouse: ${warehouseName}`);
    setOpenDropdownId(null);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentWarehouses = warehouses.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(warehouses.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      setOpenDropdownId(null);
    }
  };

  return (
    <div className="bg-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-primary-100 flex flex-col gap-5">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
              Warehouse List
            </h2>
            <div className="flex items-center gap-4">
              <button className="cursor-pointer bg-red-200 flex items-center hover:bg-red-300 text-red-800 py-2 px-4 rounded-md shadow-sm transition-colors duration-300 ease-in-out">
                <Plus className="w-5 h-5" />
                <p className="text-sm font-medium">Add New Warehouse</p>
              </button>
            </div>
          </div>

          {/* Table Section */}
          <div className="overflow-x-auto rounded-lg border border-primary-100">
            <table className="min-w-full divide-y divide-primary-200">
              <thead className="bg-gray-50">
                <tr>
                  {table_header.map((item) => (
                    <th
                      key={item._id}
                      className="px-4 py-3 whitespace-nowrap text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      {item.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-primary-200">
                {currentWarehouses.length > 0 ? (
                  currentWarehouses.map((warehouse, index) => (
                    <tr
                      key={warehouse._id}
                      className="hover:bg-gray-50 transition duration-200 ease-in-out"
                    >
                      <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                        {indexOfFirstItem + index + 1}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                        {warehouse._id}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                        {warehouse.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                        {warehouse.location}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                        {warehouse.manager}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                        {warehouse.contact}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                        {warehouse.stockAvailable.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                        {warehouse.stockShipping.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                        ₹ {warehouse.revenue.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 relative">
                        <button
                          className="cursor-pointer flex items-center justify-center w-6 h-6 text-gray-500 hover:text-gray-700 rounded-full transition"
                          onClick={() => toggleDropdown(warehouse._id)}
                          title="More Actions"
                        >
                          <EllipsisVertical className="w-5 h-5" />
                        </button>
                        {openDropdownId === warehouse._id && (
                          <div
                            ref={dropdownRef}
                            className="absolute right-0 w-36 bg-white rounded-lg shadow-lg z-10 border border-primary-100"
                          >
                            <div
                              className="flex flex-col w-full"
                              role="menu"
                              aria-orientation="vertical"
                            >
                              {[
                                {
                                  icon: (
                                    <Eye className="w-4 h-4 text-blue-500" />
                                  ),
                                  label: "View",
                                  action: () => handleView(warehouse.name),
                                },
                                {
                                  icon: (
                                    <Pencil className="w-4 h-4 text-yellow-500" />
                                  ),
                                  label: "Edit",
                                  action: () => handleEdit(warehouse.name),
                                },
                                {
                                  icon: (
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                  ),
                                  label: "Delete",
                                  action: () => handleDelete(warehouse.name),
                                },
                              ].map(({ icon, label, action }) => (
                                <button
                                  key={label}
                                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 whitespace-nowrap"
                                  onClick={action}
                                >
                                  {icon}
                                  <span>{label}</span>
                                </button>
                              ))}
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
                      No warehouses found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-end items-center gap-3">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="cursor-pointer px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
            >
              Previous
            </button>
            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => paginate(i + 1)}
                  className={`cursor-pointer px-3 py-1 text-sm rounded-md whitespace-nowrap ${
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
              className="cursor-pointer px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WareHouse;
