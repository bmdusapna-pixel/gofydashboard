import React, { useState, useRef, useEffect } from "react";
import { EllipsisVertical, Eye, Pencil, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import products from "../../assets/product.list.js";

const heading_items = [
  { _id: 1, title: "Sr No." },
  { _id: 2, title: "Product ID" },
  { _id: 3, title: "Toy Details" },
  { _id: 4, title: "Category" },
  { _id: 5, title: "Stock" },
  { _id: 6, title: "Price" },
  { _id: 7, title: "Status" },
  { _id: 8, title: "Action" },
];

const Products = () => {
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterByDate, setFilterByDate] = useState("all");
  const itemsPerPage = 5;
  const [filterByCategory, setFilterByCategory] = useState("all");
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const getStatusClasses = (status) => {
    switch (status) {
      case "In Stock":
        return "bg-green-100 text-green-800";
      case "Low Stock":
        return "bg-yellow-100 text-yellow-800";
      case "On Order":
        return "bg-blue-100 text-blue-800";
      case "Out of Stock":
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

  const handleView = (product) => {
    navigate(`/products/view/${product.url}`);
    setOpenDropdownId(null);
  };

  const handleEdit = (product) => {
    navigate(`/products/edit/${product.url}`);
    setOpenDropdownId(null);
  };

  const handleDelete = (productName) => {
    setOpenDropdownId(null);
  };

  const getFilteredProducts = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return products.filter((product) => {
      const productDate = new Date(product.dateAdded);
      productDate.setHours(0, 0, 0, 0);
      let matchesDate = true;
      if (filterByDate === "week") {
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);
        matchesDate = productDate >= sevenDaysAgo && productDate <= today;
      } else if (filterByDate === "month") {
        matchesDate =
          productDate.getMonth() === today.getMonth() &&
          productDate.getFullYear() === today.getFullYear();
      } else if (filterByDate === "year") {
        matchesDate = productDate.getFullYear() === today.getFullYear();
      }
      const matchesCategory =
        filterByCategory === "all" || product.category === filterByCategory;
      return matchesDate && matchesCategory;
    });
  };

  const filteredProducts = getFilteredProducts();
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)

  useEffect(() => {
    setCurrentPage(1);
  }, [filterByDate, filterByCategory]);

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
            <h2 className="text-lg sm:text-xl font-semibold text-gray-700">Product Catalog</h2>
              <div className="flex items-center gap-4">
                <Link to="/products/add-new" className="cursor-pointer bg-red-200 hover:bg-red-300 text-red-800 text-sm font-semibold py-2 px-4 rounded-md shadow-sm transition-colors duration-300 ease-in-out">Add New Toy</Link>
                <select className="px-4 py-2 border border-gray-300 cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-300 ease-in-out text-sm rounded-md shadow-sm font-semibold" value={filterByDate} onChange={(e) => setFilterByDate(e.target.value)}>
                  <option value="all">All Time</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
                </select>
                <select className="cursor-pointer px-4 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500  transition-colors duration-300 ease-in-out text-sm rounded-md shadow-sm font-semibold" value={filterByCategory} onChange={(e) => setFilterByCategory(e.target.value)}>
                  <option value="all">All Categories</option>
                  {
                    [...new Set(products.map((product) => product.category))].map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))
                  }
                </select>
              </div>
          </div>

          {/* Table Section */}
          <div className="overflow-x-auto rounded-lg border border-primary-100">
            <table className="min-w-full divide-y-2 divide-primary-200">
              <thead className="bg-gray-200">
                <tr>
                  {
                    heading_items.map((item) => (
                      <th key={item._id} className="px-4 py-3 whitespace-nowrap text-left text-sm font-semibold text-black uppercase tracking-wider">{item.title}</th>
                    ))
                  }
                </tr>
              </thead>
              <tbody className="bg-white divide-y-2 divide-primary-200">
                {
                  currentProducts.length > 0 ? (
                    currentProducts.map((product, index) => (
                      <tr key={product._id} className="hover:bg-[#f8f9fa] transition duration-200 ease-in-out">
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-black">{indexOfFirstItem + index + 1}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-black">{product._id}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-black flex items-center">
                          <img src={product.image_header} alt={product.name} className="w-10 h-10 whitespace-nowrap rounded-md mr-3 object-cover shadow-sm" onError={(e) => {e.target.onerror = null; e.target.src = "https://placehold.co/40x40/CCCCCC/000?text=N/A"; }}/>
                          <span className="px-4 py-3 text-sm font-semibold text-black">{product.name}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-black">{product.category}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-black">{product.stock}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-black">₹ {product.price.toFixed(2)}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClasses(product.status )}`}>{product.status}</span>
                        </td>
                        <td className="px-4 py-3 relative whitespace-nowrap">
                          <button className="flex cursor-pointer items-center justify-center w-6 h-6 focus:outline-none focus:ring-1 focus:ring-gray-200 focus:ring-opacity-75 rounded-full" onClick={() => toggleDropdown(product._id)} title="More Actions">
                            <EllipsisVertical className="w-5 h-5 text-black" />
                          </button>
                          {
                            openDropdownId === product._id && (
                              <div ref={dropdownRef} className="absolute right-0 w-36 bg-white rounded-md shadow-lg z-10 border border-primary-100">
                                <div className="flex flex-col gap-2 w-full" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                  <button className="flex items-center gap-2 w-full cursor-pointer px-4 py-2 hover:bg-gray-100 rounded-md" role="menuitem" onClick={() => handleView(product)}>
                                    <Eye className="w-4 h-4 text-blue-500" />
                                    <p className="hover:text-red-400 font-semibold text-left text-sm text-black">View</p>
                                  </button>
                                  <button className="flex items-center gap-2 w-full cursor-pointer px-4 py-2 hover:bg-gray-100 rounded-md" role="menuitem" onClick={() => handleEdit(product)}>
                                    <Pencil className="w-4 h-4 text-yellow-500" />
                                    <p className="hover:text-red-400 font-semibold text-left text-sm text-black">Edit</p>
                                  </button>
                                  <button className="flex items-center gap-2 w-full cursor-pointer text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md" role="menuitem" onClick={() => handleDelete(product.name)}>
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
                      <td colSpan="8" className="px-4 py-3 text-center text-sm text-black">No products found for the selected filter.</td>
                    </tr>
                  )
                }
              </tbody>
            </table>
          </div>

          <div className="flex justify-end items-center gap-3">
            <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="cursor-pointer px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">Previous</button>
            <div className="flex gap-2">
              {
                Array.from({ length: totalPages }, (_, i) => (
                  <button key={i + 1} onClick={() => paginate(i + 1)} className={`cursor-pointer px-3 py-2 text-sm rounded-md ${ currentPage === i + 1 ? "bg-yellow-200 text-yellow-800" : "bg-gray-200 text-gray-700 hover:bg-gray-300" }`}>{i + 1}</button>
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

export default Products;
