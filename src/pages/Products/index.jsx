import React, { useState, useRef, useEffect, useMemo } from "react";
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
  const [filterByDate, setFilterByDate] = useState("all");
  const [filterByCategory, setFilterByCategory] = useState("all");
  const [filterByPromotion, setFilterByPromotion] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const [productList, setProductList] = useState([]);
  const [deleted, setDeleted] = useState(false);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState(null);
  const itemsPerPage = 20;

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchProducts = async (page = 1) => {
    try {
      setloading(true)
      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
      });

      // Add search parameter
      if (debouncedSearchQuery.trim()) {
        params.append("search", debouncedSearchQuery.trim());
      }

      // Add filter parameters
      if (filterByPromotion !== "all") {
        params.append("promotion", filterByPromotion);
      }
      if (filterByDate !== "all") {
        params.append("dateFilter", filterByDate);
      }
      if (filterByCategory !== "all") {
        params.append("category", filterByCategory);
      }

      const response = await api.get(`/products/items?${params.toString()}`);
      setProductList(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
      setTotalCount(response.data.pagination.totalCount);
    } catch (error) {
      seterror(error)
      console.error("Error fetching products:", error);
    } finally {
      setloading(false)
    }
  };

  console.log("products", productList)

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await api.get("/categories");
      setCategories(response.data.categories.map((category) => category.categoryName));
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage, deleted, debouncedSearchQuery, filterByDate, filterByCategory, filterByPromotion]);

  const getStockStatus = (stock) => {
    if (stock === 0)
      return <span className="bg-red-100 text-red-800 p-2 rounded-2xl">Out of Stock</span>;
    if (stock <= 5)
      return <span className="bg-yellow-100 text-yellow-800 p-2 rounded-2xl">Low Stock</span>;
    return <span className="bg-green-100 text-green-800 p-2 rounded-2xl">In Stock</span>;
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

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };


  // Group products by product _id to show actions only once per product
  const groupedProducts = useMemo(() => {
    const grouped = {};
    productList.forEach((item) => {
      const productId = item._id;
      if (!grouped[productId]) {
        grouped[productId] = [];
      }
      grouped[productId].push(item);
    });
    return grouped;
  }, [productList]);

  // Flatten grouped products for display, marking first variant of each product
  const displayProducts = useMemo(() => {
    const flattened = [];
    Object.keys(groupedProducts).forEach((productId) => {
      const variants = groupedProducts[productId];
      variants.forEach((variant, index) => {
        flattened.push({
          ...variant,
          isFirstVariant: index === 0,
          productId: productId,
        });
      });
    });
    return flattened;
  }, [groupedProducts]);

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

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterByDate, filterByCategory, filterByPromotion, debouncedSearchQuery]);


  return (
    <div className="flex-1 overflow-y-auto p-4 bg-primary-50">


      <div className="">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-primary-100 flex flex-col gap-5">
          {/* Header */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-700">
                Product Catalog
              </h2>
              <Link
                to="/products/add-new"
                className="cursor-pointer bg-red-200 hover:bg-red-300 text-red-800 text-sm font-medium py-2 px-4 rounded-md shadow-sm transition-colors"
              >
                Add New Product
              </Link>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              {/* Search Input */}
              <div className="flex-1 min-w-[200px]">
                <input
                  type="text"
                  placeholder="Search by name, product ID, or SKU..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm rounded-md shadow-sm"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-4">
                <select
                  className="cursor-pointer px-4 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm rounded-md shadow-sm font-medium"
                  value={filterByPromotion}
                  onChange={(e) => setFilterByPromotion(e.target.value)}
                >
                  <option value="all">All Promotions</option>
                  <option value="super_deal">Super Deal</option>
                  <option value="offers">Offers</option>
                  <option value="trending">Trending</option>
                  <option value="deal_of_the_day">Deal of the Day</option>
                  <option value="new_arrival">New Arrival</option>
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
          </div>
          {loading &&
            (<div className="flex justify-center m-auto">
              <div className="animate-spin rounded-full w-8 h-8 border-b-2 border-gray-900">
              </div>
            </div>)}

          {error && !loading &&
            (
              <div className="text-red-500 text-md">
                {error}
              </div>
            )
          }
          {
            !loading && !error &&
            (<>
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
                    {displayProducts.length > 0 ? (
                      displayProducts.map((product, index) => (
                        <tr
                          key={`${product.productId}-${product.itemId}`}
                          className={`hover:bg-gray-50 transition duration-150 ease-in-out ${!product.isFirstVariant ? "bg-gray-50/50" : ""
                            }`}
                        >
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                            {(currentPage - 1) * itemsPerPage + index + 1}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                            {product.productId}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 flex items-center">
                            {product.isFirstVariant && (
                              <img
                                src={product.images?.[0]}
                                alt={product.name}
                                className="w-10 h-10 rounded-md mr-3 object-cover shadow-sm"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src =
                                    "https://placehold.co/40x40/CCCCCC/000?text=N/A";
                                }}
                              />
                            )}
                            {!product.isFirstVariant && (
                              <div className="w-10 h-10 mr-3"></div>
                            )}
                            <span className="text-sm font-medium text-gray-800">
                              {product.isFirstVariant ? product.name : ""}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                            {product.isFirstVariant && (
                              <div className="mb-1">
                                {Array.isArray(product.category) && product.category[0]?.categoryName
                                  ? product.category[0].categoryName
                                  : typeof product.category === "string"
                                    ? product.category
                                    : "N/A"}
                              </div>
                            )}
                            <div className="flex flex-col gap-1">
                              <span className="text-sm text-gray-600">
                                {product.color}
                              </span>
                              <span className="inline-flex w-fit px-2 py-0.5 rounded-full text-xs bg-gray-200 text-gray-600">
                                {product.ageGroup}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                            {product.stock}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                            ₹{" "}
                            {parseFloat(
                              product.price
                            ).toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {getStockStatus(product.stock)}
                          </td>
                          <td className="px-4 py-3 relative whitespace-nowrap">
                            {product.isFirstVariant ? (
                              <>
                                <button
                                  className="flex cursor-pointer items-center justify-center w-6 h-6 rounded-full hover:bg-gray-100"
                                  onClick={() => toggleDropdown(product.productId)}
                                  title="More Actions"
                                >
                                  <EllipsisVertical className="w-5 h-5 text-gray-600" />
                                </button>
                                {openDropdownId === product.productId && (
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
                              </>
                            ) : (
                              <span className="text-xs text-gray-400">—</span>
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
            </>)
          }

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>



    </div>
  );
};

export default Products;
