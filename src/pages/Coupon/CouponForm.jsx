import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios.js";

const CouponForm = () => {
  const { couponId } = useParams();
  const navigate = useNavigate();

  const [coupon, setCoupon] = useState({
    id: null,
    code: "",
    description: "",
    discountType: "PERCENTAGE",
    discountValue: "",
    minOrderValue: "",
    maxDiscount: "",
    startDate: "",
    expiryDate: "",
    usageLimit: "",
  });

  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    if (couponId) {
      api
        .get(`/user/coupons/${couponId}`)
        .then((res) => {
          const c = res.data.coupon;
          setCoupon({
            id: c._id,
            code: c.code || "",
            description: c.description || "",
            discountType: c.discountType || "PERCENTAGE",
            discountValue: c.discountValue || "",
            minOrderValue: c.minOrderValue || "",
            maxDiscount: c.maxDiscount || "",
            startDate: c.startDate ? c.startDate.slice(0, 10) : "",
            expiryDate: c.expiryDate ? c.expiryDate.slice(0, 10) : "",
            usageLimit: c.usageLimit || "",
          });
          setMessage({ text: `Editing coupon: ${c.code}`, type: "info" });
        })
        .catch(() => {
          setMessage({ text: "Failed to load coupon", type: "error" });
          setTimeout(() => navigate("/coupons"), 2000);
        });
    }
  }, [couponId, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCoupon((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!coupon.code.trim() || !coupon.discountValue || !coupon.expiryDate) {
      setMessage({ text: "Please fill in required fields.", type: "error" });
      return;
    }

    try {
      let response;
      if (coupon.id) {
        response = await api.put(`/user/coupons/${coupon.id}`, coupon);
        setMessage({ text: "Coupon updated successfully!", type: "success" });
      } else {
        response = await api.post(`/user/coupons`, coupon);
        setMessage({ text: "Coupon added successfully!", type: "success" });
      }

      // Reset form only if new coupon
      if (!coupon.id) {
        setCoupon({
          id: null,
          code: "",
          description: "",
          discountType: "PERCENTAGE",
          discountValue: "",
          minOrderValue: "",
          maxDiscount: "",
          startDate: "",
          expiryDate: "",
          usageLimit: "",
        });
      }

      setTimeout(() => {
        setMessage({ text: "", type: "" });
        navigate("/coupons");
      }, 1500);
    } catch (err) {
      console.error(err);
      setMessage({ text: "Something went wrong!", type: "error" });
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-primary-50">
      <div className="max-w-3xl">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-300">
          <h1 className="text-lg font-medium mb-6 whitespace-nowrap">
            {coupon.id ? "Edit Coupon" : "Add New Coupon"}
          </h1>

          <div className="space-y-6 text-sm p-4 border border-gray-300 rounded-lg bg-gray-50 mb-8">
            {message.text && (
              <div
                className={`p-3 rounded-md text-white text-center 
                ${
                  message.type === "error"
                    ? "bg-red-500"
                    : message.type === "success"
                    ? "bg-green-500"
                    : "bg-blue-500"
                }`}
              >
                {message.text}
              </div>
            )}

            {/* Coupon Code */}
            <div>
              <label className="block mb-2">Coupon Code</label>
              <input
                type="text"
                name="code"
                value={coupon.code}
                onChange={handleInputChange}
                disabled={!!coupon.id}
                placeholder="e.g., FLAT10"
                className="border border-gray-300 rounded-md p-2 w-full"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block mb-2">Description</label>
              <textarea
                name="description"
                value={coupon.description}
                onChange={handleInputChange}
                placeholder="e.g., Flat 10% off on orders above ₹1999"
                className="border border-gray-300 rounded-md p-2 w-full"
              />
            </div>

            {/* Discount Type & Value */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block mb-2">Discount Type</label>
                <select
                  name="discountType"
                  value={coupon.discountType}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-md p-2 w-full"
                >
                  <option value="PERCENTAGE">Percentage</option>
                  <option value="FLAT">Flat</option>
                </select>
              </div>
              <div>
                <label className="block mb-2">Discount Value</label>
                <input
                  type="number"
                  name="discountValue"
                  value={coupon.discountValue}
                  onChange={handleInputChange}
                  placeholder="e.g., 10 for 10%"
                  className="border border-gray-300 rounded-md p-2 w-full"
                />
              </div>
            </div>

            {/* Min Order & Max Discount */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block mb-2">Min Order Value</label>
                <input
                  type="number"
                  name="minOrderValue"
                  value={coupon.minOrderValue}
                  onChange={handleInputChange}
                  placeholder="e.g., 1999"
                  className="border border-gray-300 rounded-md p-2 w-full"
                />
              </div>
              <div>
                <label className="block mb-2">Max Discount (optional)</label>
                <input
                  type="number"
                  name="maxDiscount"
                  value={coupon.maxDiscount}
                  onChange={handleInputChange}
                  placeholder="e.g., 500"
                  className="border border-gray-300 rounded-md p-2 w-full"
                />
              </div>
            </div>

            {/* Start & Expiry Date */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block mb-2">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={coupon.startDate}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-md p-2 w-full"
                />
              </div>
              <div>
                <label className="block mb-2">Expiry Date</label>
                <input
                  type="date"
                  name="expiryDate"
                  value={coupon.expiryDate}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-md p-2 w-full"
                />
              </div>
            </div>

            {/* Usage Limit */}
            <div>
              <label className="block mb-2">Usage Limit (optional)</label>
              <input
                type="number"
                name="usageLimit"
                value={coupon.usageLimit}
                onChange={handleInputChange}
                placeholder="e.g., 100"
                className="border border-gray-300 rounded-md p-2 w-full"
              />
            </div>

            {/* Buttons */}
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={handleSubmit}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
              >
                {coupon.id ? "Update Coupon" : "Add Coupon"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/coupons")}
                className="bg-gray-400 text-white px-6 py-2 rounded-md hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CouponForm;
