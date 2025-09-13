import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios.js";

const couponTableHeaders = [
  { title: "Sr No.", _id: "srNo" },
  { title: "Code", _id: "code" },
  { title: "Discount", _id: "discount" },
  { title: "Min Order", _id: "minOrder" },
  { title: "Max Discount", _id: "maxDiscount" },
  { title: "Start Date", _id: "startDate" },
  { title: "Expiry Date", _id: "expiryDate" },
  { title: "Status", _id: "status" },
  { title: "Action", _id: "action" },
];

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  // ✅ Fetch coupons from API
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await api.get("/user/coupons");
        setCoupons(res.data.coupons);
      } catch (err) {
        console.error("Error fetching coupons:", err);
      }
    };
    fetchCoupons();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCoupons = coupons.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(coupons.length / itemsPerPage);

  const handleEdit = (couponCode) => {
    navigate(`/coupon-form/${couponCode}`);
  };

  const handleDelete = async (couponId) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;

    try {
      await api.delete(`/user/coupons/${couponId}`);
      setCoupons((prev) => prev.filter((c) => c._id !== couponId));
    } catch (err) {
      console.error("Error deleting coupon:", err);
    }
  };

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-primary-50">
      <div className="">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-primary-100 flex flex-col gap-5">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <h2 className="text-base sm:text-lg font-semibold text-gray-700">
              Coupons
            </h2>
            <div className="flex items-center gap-4">
              <Link
                to="/coupon-form"
                className="cursor-pointer bg-green-100 flex items-center hover:bg-green-200 text-green-700 py-2 px-4 rounded-md shadow-sm transition-colors duration-200"
              >
                <Plus className="w-5 h-5" />
                <span className="text-sm font-medium">Add New Coupon</span>
              </Link>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-lg border border-primary-100">
            <table className="min-w-full divide-y divide-primary-100">
              <thead className="bg-gray-50">
                <tr>
                  {couponTableHeaders.map((item) => (
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
                {currentCoupons.length > 0 ? (
                  currentCoupons.map((coupon, index) => (
                    <tr
                      key={coupon._id}
                      className="hover:bg-gray-50 transition duration-150 ease-in-out"
                    >
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {indexOfFirstItem + index + 1}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-800">
                        {coupon.code}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {coupon.discountType === "PERCENTAGE"
                          ? `${coupon.discountValue}%`
                          : `₹${coupon.discountValue}`}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        ₹{coupon.minOrderValue}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {coupon.maxDiscount
                          ? `₹${coupon.maxDiscount}`
                          : "No Limit"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {new Date(coupon.startDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {new Date(coupon.expiryDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {coupon.status === "ACTIVE" ? (
                          <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-medium">
                            Active
                          </span>
                        ) : (
                          <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-xs font-medium">
                            {coupon.status}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            className="text-yellow-600 hover:text-yellow-800 transition-colors duration-200"
                            onClick={() => handleEdit(coupon.code)}
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-800 transition-colors duration-200"
                            onClick={() => handleDelete(coupon._id)}
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="9"
                      className="px-4 py-3 text-center text-sm text-gray-600"
                    >
                      No coupons found
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
                      ? "bg-green-200 text-green-800"
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

export default Coupons;
