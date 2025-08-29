// Inventory.jsx
import React, { useState, useRef, useEffect, useMemo } from "react";
import { EllipsisVertical, Eye, Pencil, Trash2 } from "lucide-react";

const inventoryTableHeaders = [
  { title: "Sr No.", _id: "srNo" },
  { title: "Product ID", _id: "productId" },
  { title: "Product Name", _id: "productName" },
  { title: "Stock", _id: "stock" },
  { title: "Status", _id: "status" },
  { title: "Action", _id: "action" },
];

// Demo Data: Children Clothes & Toys
const demoProducts = [
  { _id: "1", productId: "C001", productName: "Baby Romper (0-6M)", stock: 12 },
  { _id: "2", productId: "C002", productName: "Kids T-Shirt (2-5Y)", stock: 4 },
  { _id: "3", productId: "C003", productName: "Girls Frock (3-6Y)", stock: 0 },
  { _id: "4", productId: "C004", productName: "Boys Jeans (5-8Y)", stock: 8 },
  {
    _id: "5",
    productId: "C005",
    productName: "Winter Jacket (4-7Y)",
    stock: 2,
  },
  { _id: "6", productId: "T001", productName: "Teddy Bear Toy", stock: 0 },
  {
    _id: "7",
    productId: "T002",
    productName: "Building Blocks Set",
    stock: 15,
  },
  { _id: "8", productId: "T003", productName: "Remote Car Toy", stock: 5 },
  { _id: "9", productId: "T004", productName: "Doll House", stock: 1 },
  { _id: "10", productId: "T005", productName: "Puzzle Game (3+)", stock: 6 },
];

const Inventory = () => {
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const dropdownRef = useRef(null);
  const itemsPerPage = 5;

  const [filterByStock, setFilterByStock] = useState("all");

  const toggleDropdown = (id) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  useEffect(() => {
    // Load demo data
    setProducts(demoProducts);
  }, []);

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

  // stock filter logic
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (filterByStock === "all") return true;
      if (filterByStock === "out" && product.stock === 0) return true;
      if (filterByStock === "low" && product.stock > 0 && product.stock <= 5)
        return true;
      if (filterByStock === "in" && product.stock > 5) return true;
      return false;
    });
  }, [products, filterByStock]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterByStock]);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      setOpenDropdownId(null);
    }
  };

  const getStockStatus = (stock) => {
    if (stock === 0)
      return <span className="text-red-600 font-medium">Out of Stock</span>;
    if (stock <= 5)
      return <span className="text-yellow-600 font-medium">Low Stock</span>;
    return <span className="text-green-600 font-medium">In Stock</span>;
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-primary-50">
      <div className="">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-primary-100 flex flex-col gap-5">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-700">
              Inventory Management
            </h2>
            <div className="flex items-center gap-3 mt-3 sm:mt-0">
              {/* Stock Filter */}
              <select
                className="px-4 py-2 border border-gray-300 bg-white text-gray-600 cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-sm rounded-md shadow-sm transition-colors duration-200"
                value={filterByStock}
                onChange={(e) => setFilterByStock(e.target.value)}
              >
                <option value="all">All</option>
                <option value="in">In Stock</option>
                <option value="low">Low Stock (≤5)</option>
                <option value="out">Out of Stock</option>
              </select>
            </div>
          </div>

          {/* Table Section */}
          <div className="overflow-x-auto rounded-lg border border-primary-100">
            <table className="min-w-full divide-y divide-primary-100">
              <thead className="bg-gray-50">
                <tr>
                  {inventoryTableHeaders.map((item) => (
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
                {currentProducts.length > 0 ? (
                  currentProducts.map((product, index) => (
                    <tr
                      key={product._id}
                      className={`hover:bg-gray-50 transition duration-150 ease-in-out ${
                        product.stock === 0 ? "bg-red-50" : ""
                      }`}
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {indexOfFirstItem + index + 1}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                        {product.productId}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                        {product.productName}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                        {product.stock}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        {getStockStatus(product.stock)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap relative">
                        <button
                          className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition"
                          onClick={() => toggleDropdown(product._id)}
                          title="More Actions"
                          aria-haspopup="true"
                          aria-expanded={openDropdownId === product._id}
                        >
                          <EllipsisVertical className="w-5 h-5 text-gray-500" />
                        </button>

                        {openDropdownId === product._id && (
                          <div
                            ref={dropdownRef}
                            className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-primary-100 z-10"
                          >
                            <div className="flex flex-col py-2" role="menu">
                              <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition text-sm text-gray-700">
                                <Eye className="w-4 h-4 text-blue-500" /> View
                              </button>
                              <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition text-sm text-gray-700">
                                <Pencil className="w-4 h-4 text-yellow-500" />{" "}
                                Edit
                              </button>
                              <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition text-sm text-gray-700">
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
                      colSpan={inventoryTableHeaders.length}
                      className="px-4 py-3 text-center text-sm text-gray-500"
                    >
                      No products found
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

export default Inventory;
