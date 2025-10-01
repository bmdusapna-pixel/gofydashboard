import React, { useState, useEffect, useMemo, useRef } from "react";
import { EllipsisVertical, Eye, Pencil, Trash2 } from "lucide-react";
import api from "../../api/axios.js";

const categoryTableHeaders = [
  { title: "Sr No.", _id: "srNo" },
  { title: "Category ID", _id: "categoryId" },
  { title: "Category Name", _id: "categoryName" },
  { title: "Collection", _id: "collection" },
  { title: "Number of Products", _id: "numberOfProducts" },
  { title: "Action", _id: "action" },
];

const CategoryModalTable = ({ collectionId, onClose }) => {
  const [categories, setCategories] = useState([]);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRef = useRef(null);

  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const toggleDropdown = (id) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await api.get("/categories");
        setCategories(result.data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

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

  const handleView = (categoryName) => {
    console.log(`Viewing details for category: ${categoryName}`);
    setOpenDropdownId(null);
  };

  const handleEdit = (id) => {
    console.log(`Editing category: ${id}`);
    setOpenDropdownId(null);
  };

  const handleDelete = async (categoryId, categoryName) => {
    try {
      await api.delete(`/categories/${categoryId}`);
      setCategories((prev) =>
        prev.filter((cat) => cat.categoryId !== categoryId)
      );
      setOpenDropdownId(null);
      console.log(`Deleted category: ${categoryName}`);
    } catch (err) {
      console.error(err);
    }
  };

  // Filter categories based on collectionId prop
  const filteredCategories = useMemo(() => {
    return categories.filter(
      (category) =>
        collectionId === "all" || category.collectionId?._id === collectionId
    );
  }, [categories, collectionId]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCategories = filteredCategories.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) setCurrentPage(pageNumber);
  };

  return (
    <div
      className="fixed inset-0 flex justify-center items-start pt-20 z-50"
      style={{ background: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="bg-white rounded-xl shadow-lg border border-primary-100 w-full max-w-4xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-700">Categories</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            X
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-primary-100">
            <thead className="bg-gray-50">
              <tr>
                {categoryTableHeaders.map((item) => (
                  <th
                    key={item._id}
                    className="px-4 py-3 whitespace-nowrap text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {item.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-primary-100">
              {currentCategories.length > 0 ? (
                currentCategories.map((category, index) => (
                  <tr
                    key={category._id}
                    className="hover:bg-gray-50 transition duration-150 ease-in-out"
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {indexOfFirstItem + index + 1}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                      {category.categoryId}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                      {category.categoryName}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                      {category.collectionId?.collectionName}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                      0
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap relative">
                      {/* Dropdown Button */}
                      <button
                        className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition"
                        onClick={() => toggleDropdown(category._id)}
                      >
                        <EllipsisVertical className="w-5 h-5 text-gray-500" />
                      </button>

                      {/* Dropdown Menu */}
                      {openDropdownId === category._id && (
                        <div
                          ref={dropdownRef}
                          className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-primary-100 z-10"
                        >
                          <div className="flex flex-col py-2">
                            <button
                              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                              onClick={() => handleView(category.categoryName)}
                            >
                              <Eye className="w-4 h-4 text-blue-500" /> View
                            </button>
                            <button
                              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                              onClick={() => handleEdit(category.categoryId)}
                            >
                              <Pencil className="w-4 h-4 text-yellow-500" />{" "}
                              Edit
                            </button>
                            <button
                              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                              onClick={() =>
                                handleDelete(
                                  category.categoryId,
                                  category.categoryName
                                )
                              }
                            >
                              <Trash2 className="w-4 h-4 text-red-500" /> Delete
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
                    colSpan={categoryTableHeaders.length}
                    className="px-4 py-3 text-center text-sm text-gray-500"
                  >
                    No categories found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-end items-center gap-2 p-4 border-t border-gray-200">
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
                    ? "bg-yellow-200 text-yellow-800 font-medium"
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
  );
};

export default CategoryModalTable;
