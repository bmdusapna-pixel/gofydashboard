import React, { useState, useRef, useEffect } from "react";
import { EllipsisVertical, Eye, Pencil, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios.js";

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
  const [filterByPromotion, setFilterByPromotion] = useState("all");
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const [productList, setProductList] = useState([]);
  const [deleted, setDeleted] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products");
        setProductList(response.data.data);
        console.log("Fetched products:", response.data.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, [deleted]);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await api.get("/categories");
      setCategories(response.data.categories.map((category) => category.categoryName));
    };
    fetchCategories();
  }, []);
  console.log(categories);

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

  const handleDelete = async (productId) => {
    console.log("Delete product with ID:", productId);
    await api.delete(`/products/${productId}`);
    setDeleted(true);
    setTimeout(() => {
      setDeleted(false);
    }, 300);
    setOpenDropdownId(null);
  };

  const getFilteredProducts = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return productList.filter((product) => {
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
        filterByCategory === "all" ||
        product.categories?.[0]?.categoryName === filterByCategory ||
        product.zohoCategory === filterByCategory;
      const matchesPromotion =
        filterByPromotion === "all" ||
        (Array.isArray(product.promotions)
          ? product.promotions.includes(filterByPromotion)
          : product.promotions === filterByPromotion);
      return matchesDate && matchesCategory && matchesPromotion;
    });
  };

  const filteredProducts = getFilteredProducts();
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterByDate, filterByCategory, filterByPromotion]);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      setOpenDropdownId(null);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-primary-50">
      <div className="">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-primary-100 flex flex-col gap-5">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-700">
              Product Catalog
            </h2>
            <div className="flex items-center gap-4">
              <Link
                to="/products/add-new"
                className="cursor-pointer bg-red-200 hover:bg-red-300 text-red-800 text-sm font-medium py-2 px-4 rounded-md shadow-sm transition-colors"
              >
                Add New Product
              </Link>
              <select
                className="cursor-pointer px-4 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm rounded-md shadow-sm font-medium"
                value={filterByPromotion}
                onChange={(e) => setFilterByPromotion(e.target.value)}
              >
                <option value="all">All Promotions</option>
                {[
                  ...new Set(
                    productList.flatMap((p) =>
                      Array.isArray(p.promotions)
                        ? p.promotions
                        : [p.promotions]
                    )
                  ),
                ]
                  .filter(Boolean)
                  .map((promo) => (
                    <option key={promo} value={promo}>
                      {promo}
                    </option>
                  ))}
              </select>
              <select
                className="px-4 py-2 border border-gray-300 cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm rounded-md shadow-sm font-medium"
                value={filterByDate}
                onChange={(e) => setFilterByDate(e.target.value)}
              >
                <option value="all">All Time</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
              <select
                className="cursor-pointer px-4 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm rounded-md shadow-sm font-medium"
                value={filterByCategory}
                onChange={(e) => setFilterByCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>  
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-lg border border-primary-100">
            <table className="min-w-full divide-y divide-primary-200">
              <thead className="bg-gray-100">
                <tr>
                  {heading_items.map((item) => (
                    <th
                      key={item._id}
                      className="px-4 py-3 whitespace-nowrap text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      {item.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-primary-100">
                {currentProducts.length > 0 ? (
                  currentProducts.map((product, index) => (
                    <tr
                      key={product._id}
                      className="hover:bg-gray-50 transition duration-150 ease-in-out"
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                        {indexOfFirstItem + index + 1}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                        {product.productId}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 flex items-center">
                        <img
                          src={product.variants[0]?.images[0]}
                          alt={product.name}
                          className="w-10 h-10 rounded-md mr-3 object-cover shadow-sm"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://placehold.co/40x40/CCCCCC/000?text=N/A";
                          }}
                        />
                        <span className="text-sm font-medium text-gray-800">
                          {product.name}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {product.categories?.[0]?.categoryName || product.zohoCategory}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {product.variants[0]?.ageGroups?.[0]?.stock}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                        ₹{" "}
                        {parseFloat(
                          product.variants[0]?.ageGroups?.[0]?.price
                        ).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusClasses(
                            product.status
                          )}`}
                        >
                          {product.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 relative whitespace-nowrap">
                        <button
                          className="flex cursor-pointer items-center justify-center w-6 h-6 rounded-full hover:bg-gray-100"
                          onClick={() => toggleDropdown(product._id)}
                          title="More Actions"
                        >
                          <EllipsisVertical className="w-5 h-5 text-gray-600" />
                        </button>
                        {openDropdownId === product._id && (
                          <div
                            ref={dropdownRef}
                            className="absolute right-0 w-36 bg-white rounded-md shadow-lg z-10 border border-primary-100"
                          >
                            <div className="flex flex-col gap-1 p-1">
                              <button
                                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-md text-sm text-gray-700"
                                onClick={() => handleView(product)}
                              >
                                <Eye className="w-4 h-4 text-blue-500" />
                                View
                              </button>
                              <button
                                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-md text-sm text-gray-700"
                                onClick={() => handleEdit(product)}
                              >
                                <Pencil className="w-4 h-4 text-yellow-500" />
                                Edit
                              </button>
                              <button
                                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-md text-sm text-red-600"
                                onClick={() => handleDelete(product._id)}
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
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
                      colSpan="8"
                      className="px-4 py-3 text-center text-sm text-gray-500"
                    >
                      No products found for the selected filter.
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
                  className={`cursor-pointer px-3 py-2 text-sm rounded-md ${
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

export default Products;
