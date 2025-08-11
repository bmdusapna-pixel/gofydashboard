import React, { useState, useRef, useEffect } from "react";
import { EllipsisVertical, Eye, Pencil, Plus, Trash2 } from "lucide-react";
import collections from "../../assets/collections.list.js"; // Adjust path if necessary

const collectionTableHeaders = [
  { title: "Sr No.", _id: "srNo" },
  { title: "Collection ID", _id: "collectionId" },
  { title: "Collection Name", _id: "collectionName" },
  { title: "Number of Categories", _id: "numberOfCategories" },
  { title: "Action", _id: "action" },
];

const Collections = () => {
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

  const handleView = (collectionName) => {
    console.log(`Viewing details for collection: ${collectionName}`);
    setOpenDropdownId(null);
  };

  const handleEdit = (collectionName) => {
    console.log(`Editing collection: ${collectionName}`);
    setOpenDropdownId(null);
  };

  const handleDelete = (collectionName) => {
    console.log(`Deleting collection: ${collectionName}`);
    setOpenDropdownId(null);
  };

  const getFilteredCollections = () => {
    // No filtering is implemented, so we return the raw collections data.
    return collections;
  };

  const filteredCollections = getFilteredCollections();

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCollections = filteredCollections.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredCollections.length / itemsPerPage);

  // No useEffect dependency on filterQuery as it's removed.

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      setOpenDropdownId(null); // Close dropdown on page change
    }
  };

  return (
    <div className="bg-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-primary-100 flex flex-col gap-5">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <h2 className="text-base sm:text-lg font-semibold text-gray-700">
              Product Collections
            </h2>
            <div className="flex items-center gap-4">
              <button className="cursor-pointer bg-red-100 flex items-center hover:bg-red-200 text-red-700 py-2 px-4 rounded-md shadow-sm transition-colors duration-200">
                <Plus className="w-5 h-5" />
                <span className="text-sm font-medium">Add New Collection</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-lg border border-primary-100">
            <table className="min-w-full divide-y divide-primary-100">
              <thead className="bg-gray-50">
                <tr>
                  {collectionTableHeaders.map((item) => (
                    <th
                      key={item._id}
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {item.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-primary-100">
                {currentCollections.length > 0 ? (
                  currentCollections.map((collection, index) => (
                    <tr
                      key={collection._id}
                      className="hover:bg-gray-50 transition duration-150 ease-in-out"
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {indexOfFirstItem + index + 1}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                        {collection.id}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                        {collection.name}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {collection.categoryCount}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap relative">
                        <button
                          className="flex cursor-pointer items-center justify-center w-6 h-6 focus:outline-none focus:ring-1 focus:ring-gray-200 rounded-full"
                          onClick={() => toggleDropdown(collection.id)}
                          title="More Actions"
                        >
                          <EllipsisVertical className="w-4 h-4 text-gray-500" />
                        </button>
                        {openDropdownId === collection.id && (
                          <div
                            ref={dropdownRef}
                            className="absolute right-0 w-36 bg-white rounded-md shadow-lg z-10 border border-primary-100"
                          >
                            <div
                              className="flex flex-col w-full"
                              role="menu"
                              aria-orientation="vertical"
                              aria-labelledby="options-menu"
                            >
                              <button
                                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                                onClick={() => handleView(collection.name)}
                              >
                                <Eye className="w-4 h-4 text-blue-500" />
                                <span>View</span>
                              </button>
                              <button
                                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                                onClick={() => handleEdit(collection.name)}
                              >
                                <Pencil className="w-4 h-4 text-yellow-500" />
                                <span>Edit</span>
                              </button>
                              <button
                                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                                onClick={() => handleDelete(collection.name)}
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                                <span>Delete</span>
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
                      className="px-4 py-3 text-center text-sm text-gray-600"
                    >
                      No collections found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-end items-center gap-2 mt-4">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <div className="flex gap-1">
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
              className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collections;
