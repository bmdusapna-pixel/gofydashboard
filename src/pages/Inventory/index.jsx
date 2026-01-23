// Inventory.jsx
import React, { useState, useRef, useEffect, useMemo } from "react";
import { EllipsisVertical, Eye, Pencil, Trash2 } from "lucide-react";
import api from "../../api/axios";
import axios from "axios";

const inventoryTableHeaders = [
  { title: "Sr No.", _id: "srNo" },
  { title: "Product ID", _id: "productId" },
  { title: "Product Name", _id: "productName" },
  { title: "Variant (Color / Age)", _id: "variant" },
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
  const [inventory,setInventory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const dropdownRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 20;

  const [filterByStock, setFilterByStock] = useState("all");

  const toggleDropdown = (id) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const fetchInventory = async(req,res)=>{
    try {
      setLoading(true);
      const res = await api.get("products/inventory");
      console.log("res",res);
      setInventory(res.data.data);
      setLoading(false);
      setError(null);
    } 
    catch (error) {
      setError(error);
      setLoading(false);
    }
  }
  useEffect(() => {
     fetchInventory();
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
  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      if (filterByStock === "all") return true;
      if (filterByStock === "out") return item.stock === 0;
      if (filterByStock === "low") return item.stock > 0 && item.stock <= 5;
      if (filterByStock === "in") return item.stock > 5;
      return true;
    });
  }, [inventory, filterByStock]);
  

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredInventory.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredInventory.length / itemsPerPage);

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
          <div className="overflow-x-auto rounded-xl border border-primary-100 bg-white shadow-sm">
  <table className="min-w-full divide-y divide-primary-100">
    {/* Header */}
    <thead className="bg-gray-100">
      <tr>
        {inventoryTableHeaders.map((item) => (
          <th
            key={item._id}
            className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
          >
            {item.title}
          </th>
        ))}
      </tr>
    </thead>

    {loading && (
      <div className="flex justify-center m-auto">
        <div className="animate-spin rounded-full w-8 h-8 border-b-2 border-gray-100"></div>
      </div>
    )}
    {error && !loading && (
      <div className="text-red-500">{error}</div>
    )}
      {/* Body */}
    <tbody className="divide-y divide-gray-100">
      { !loading && !error && currentProducts.length > 0 ? (
        currentProducts.map((item, index) => (
          <tr
            key={item.itemId}
            className={`transition ${
              item.stock === 0
                ? "bg-red-50 hover:bg-red-100"
                : "hover:bg-gray-50"
            }`}
          >
            {/* Sr No */}
            <td className="px-5 py-3 text-sm text-gray-600">
              {indexOfFirstItem + index + 1}
            </td>

            {/* Product ID */}
            <td className="px-5 py-3 text-sm font-medium text-gray-800">
              {item.productId}
            </td>

            {/* Product Name */}
            <td className="px-5 py-3 text-sm text-gray-800">
              {item.productName}
            </td>

            {/* Variant */}
            <td className="px-5 py-3">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-700">
                  {item.color}
                </span>
                <span className="inline-flex w-fit px-2 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
                  {item.ageGroup}
                </span>
              </div>
            </td>

            {/* Stock */}
            <td className="px-5 py-3 text-sm font-semibold text-gray-800">
              {item.stock}
            </td>

            {/* Status */}
            <td className="px-5 py-3 text-sm">
              {getStockStatus(item.stock)}
            </td>

            {/* Action */}
            <td className="px-5 py-3 text-sm text-right relative">
              <button className="p-2 rounded-full hover:bg-gray-200 transition">
                <EllipsisVertical className="w-5 h-5 text-gray-600" />
              </button>
            </td>
          </tr>
        ))
      ) : loading ? (
        <tr>
                      <td
                        colSpan="8"
                        className="px-4 py-8 text-center text-sm text-gray-500"
                      >
                        Loading inventory...
                      </td>
                    </tr>
      ) :(
        <tr>
          <td
            colSpan={inventoryTableHeaders.length}
            className="px-6 py-6 text-center text-sm text-gray-500"
          >
            No inventory found
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
