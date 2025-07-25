import React, { useState, useRef, useEffect } from "react";
import { EllipsisVertical, Eye, Pencil, Plus, Trash2 } from "lucide-react";
import categories from "../../assets/categories.list.js";

const categoryTableHeaders = [
  { title: "Sr No.", _id: "srNo" },
  { title: "Category ID", _id: "categoryId" },
  { title: "Category Name", _id: "categoryName" },
  { title: "Segment", _id: "segment" },
  { title: "Number of Products", _id: "numberOfProducts" },
  { title: "Action", _id: "action" },
];

const Categories = () => {
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const dropdownRef = useRef(null);
  const itemsPerPage = 5;

  const [filterBySegment, setFilterBySegment] = useState("all");

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
      const matchesSegment = filterBySegment === "all" || category.segment === filterBySegment;
      return matchesSegment;
    });
  };

  const filteredCategories = getFilteredCategories();

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCategories = filteredCategories.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterBySegment]);

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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-700">Product Categories</h2>
            <div className="flex items-center gap-4">
              <button className="cursor-pointer bg-red-200 flex items-center hover:bg-red-300 text-red-800 py-2 px-4 rounded-md shadow-sm transition-colors duration-300 ease-in-out">
                <Plus className="w-5 h-5" />
                <p className="text-sm font-semibold">Add New Category</p>
              </button> 
              <select className="px-4 py-2 border border-gray-300 cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-300 ease-in-out text-sm rounded-md shadow-sm font-semibold" value={filterBySegment} onChange={(e) => setFilterBySegment(e.target.value)}>
                <option value="all">All Segments</option>
                <option value="Clothes">Clothes</option>
                <option value="Toys">Toys</option>
              </select>
            </div>
          </div>

            {/* Table Section */}
          <div className="overflow-x-auto rounded-lg border border-primary-100">
            <table className="min-w-full divide-y-2 divide-primary-200">
              <thead className="bg-gray-200">
                <tr>
                  {
                    categoryTableHeaders.map((item) => (
                      <th key={item._id} className="px-4 py-3 whitespace-nowrap text-left text-sm font-semibold text-black uppercase tracking-wider">{item.title}</th>
                    ))
                  }
                </tr>
              </thead>
              <tbody className="bg-white divide-y-2 divide-primary-200">
                {
                  currentCategories.length > 0 ? (
                    currentCategories.map((category, index) => (
                      <tr key={category._id} className="hover:bg-[#f8f9fa] transition duration-200 ease-in-out">
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-black">{indexOfFirstItem + index + 1}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-black">{category.id}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-black">{category.name}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-black">{category.segment}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-black">{category.productCount}</td>
                        <td className="px-4 py-3 whitespace-nowrap relative">
                          <button className="flex cursor-pointer items-center justify-center w-6 h-6 focus:outline-none focus:ring-1 focus:ring-gray-200 focus:ring-opacity-75 rounded-full" onClick={() => toggleDropdown(category.id)} title="More Actions">
                            <EllipsisVertical className="w-5 h-5 text-black" />
                          </button>
                          {
                            openDropdownId === category.id && (
                              <div ref={dropdownRef} className="absolute right-0 w-36 bg-white rounded-md shadow-lg z-10 border border-primary-100">
                                <div className="flex flex-col gap-2 w-full" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                  <button className="flex items-center gap-2 w-full cursor-pointer px-4 py-2 hover:bg-gray-100 rounded-md" role="menuitem" onClick={() => handleView(category.name)}>
                                    <Eye className="w-4 h-4 text-blue-500" />
                                    <p className="hover:text-red-400 font-semibold text-left text-sm text-black">View</p>
                                  </button>
                                  <button className="flex items-center gap-2 w-full cursor-pointer px-4 py-2 hover:bg-gray-100 rounded-md" role="menuitem" onClick={() => handleEdit(category.name)}>
                                    <Pencil className="w-4 h-4 text-yellow-500" />
                                    <p className="hover:text-red-400 font-semibold text-left text-sm text-black">Edit</p>
                                  </button>
                                  <button className="flex items-center gap-2 w-full cursor-pointer px-4 py-2 hover:bg-gray-100 rounded-md" role="menuitem" onClick={() => handleDelete(category.name)}>
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                    <p className="hover:text-red-400 font-semibold text-left text-sm text-black">Delete</p>
                                  </button>
                                </div>
                              </div>
                            )
                          }
                        </td>
                      </tr>
                    ))
                  ) 
                  : 
                  (
                    <tr>
                      <td colSpan="8" className="px-4 py-3 text-center text-sm text-black">No categories found</td>
                    </tr>
                  )
                }
              </tbody>
            </table>
          </div>

            {/* Pagination Controls - Aligned to the right */}
          <div className="flex justify-end items-center gap-3">
            <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="cursor-pointer px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">Previous</button>
            <div className="flex gap-2">
              {
                Array.from({ length: totalPages }, (_, i) => (
                  <button key={i + 1} onClick={() => paginate(i + 1)} className={`cursor-p px-3 py-1 text-sm rounded-md ${ currentPage === i + 1 ? "bg-yellow-200 text-yellow-800" : "bg-gray-200 text-gray-700 hover:bg-gray-300" }`}>{i + 1}</button>
                ))
              }
            </div>
            <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="cursor-pointer px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
