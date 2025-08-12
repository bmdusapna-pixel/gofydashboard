import React, { useState, useRef, useEffect } from "react";
import { EllipsisVertical, Eye, Pencil, Plus, Trash2 } from "lucide-react";
import categories from "../../assets/categories.list.js";
import { Link } from "react-router-dom";

const categoryTableHeaders = [
  { title: "Sr No.", _id: "srNo" },
  { title: "Category ID", _id: "categoryId" },
  { title: "Category Name", _id: "categoryName" },
  { title: "Collection", _id: "collection" },
  { title: "Number of Products", _id: "numberOfProducts" },
  { title: "Action", _id: "action" },
];

const Categories = () => {
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const dropdownRef = useRef(null);
  const itemsPerPage = 5;

  const [filterByCollection, setFilterByCollection] = useState("all");

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

  const handleView = (categoryName) => {
    console.log(`Viewing details for category: ${categoryName}`);
    setOpenDropdownId(null);
  };

  const handleEdit = (categoryName) => {
    console.log(`Editing category: ${categoryName}`);
    setOpenDropdownId(null);
  };

  const handleDelete = (categoryName) => {
    console.log(`Deleting category: ${categoryName}`);
    setOpenDropdownId(null);
  };

  const getFilteredCategories = () => {
    return categories.filter((category) => {
      const matchesCollection =
        filterByCollection === "all" || category.segment === filterByCollection;
      return matchesCollection;
    });
  };

  const filteredCategories = getFilteredCategories();

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCategories = filteredCategories.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterByCollection]);

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
            <h2 className="text-lg sm:text-xl font-semibold text-gray-700">
              Product Categories
            </h2>
            <div className="flex items-center gap-3 mt-3 sm:mt-0">
              {/* Add Category Button */}
              <Link
                to="/categories/add-new"
                className="cursor-pointer flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 py-2 px-4 rounded-md shadow-sm text-sm font-medium transition-colors duration-200"
              >
                <Plus className="w-5 h-5" />
                Add New Category
              </Link>
              {/* Filter Dropdown */}
              <select
                className="px-4 py-2 border border-gray-300 bg-white text-gray-600 cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-sm rounded-md shadow-sm transition-colors duration-200"
                value={filterByCollection}
                onChange={(e) => setFilterByCollection(e.target.value)}
              >
                <option value="all">All Collections</option>
                <option value="Clothes">Clothes</option>
                <option value="Toys">Toys</option>
              </select>
            </div>
          </div>

          {/* Table Section */}
          <div className="overflow-x-auto rounded-lg border border-primary-100">
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
                        {category.id}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                        {category.name}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                        {category.segment}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                        {category.productCount}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap relative">
                        {/* Dropdown Button */}
                        <button
                          className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition"
                          onClick={() => toggleDropdown(category.id)}
                          title="More Actions"
                          aria-haspopup="true"
                          aria-expanded={openDropdownId === category.id}
                        >
                          <EllipsisVertical className="w-5 h-5 text-gray-500" />
                        </button>

                        {/* Dropdown Menu */}
                        {openDropdownId === category.id && (
                          <div
                            ref={dropdownRef}
                            className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-primary-100 z-10"
                          >
                            <div className="flex flex-col py-2" role="menu">
                              <button
                                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition text-sm text-gray-700"
                                onClick={() => handleView(category.name)}
                              >
                                <Eye className="w-4 h-4 text-blue-500" /> View
                              </button>
                              <button
                                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition text-sm text-gray-700"
                                onClick={() => handleEdit(category.name)}
                              >
                                <Pencil className="w-4 h-4 text-yellow-500" />{" "}
                                Edit
                              </button>
                              <button
                                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition text-sm text-gray-700"
                                onClick={() => handleDelete(category.name)}
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />{" "}
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
          <div className="flex justify-end items-center gap-2">
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
    </div>
  );
};

export default Categories;
