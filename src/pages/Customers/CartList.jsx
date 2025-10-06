import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import CartViewModal from "./CartViewModal.jsx";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [selectedCart, setSelectedCart] = useState(null);
  const itemsPerPage = 5;

  const fetchCart = async () => {
    try {
      const response = await api.get("/user/cart");
      const items = response.data;

      const formatted = items.map((item) => {
        const product = item.productId;

        const variant = product.variants.find((v) => v.color === item.colorId);

        const ageGroup = variant?.ageGroups.find(
          (ag) => ag.ageGroup === item.ageGroupId
        );

        return {
          id: item._id,
          productName: product?.name || "N/A",
          productImages: variant?.images || ["https://placehold.co/60"],
          price: ageGroup?.price || 0,
          quantity: item.quantity || 1,
          subtotal: (ageGroup?.price || 0) * (item.quantity || 1),
          userName: item.userId?.name || "Unknown User",
          createdAt: item.createdAt
            ? new Date(item.createdAt).toISOString().split("T")[0]
            : "N/A",
          fullProduct: product,
          variant,
          ageGroup,
          colorId: item.colorId,
          ageGroupId: item.ageGroupId,
        };
      });

      setCartItems(formatted);
    } catch (err) {
      console.error("Error fetching cart:", err);
      setCartItems([]);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleView = (item) => {
    setOpen(true);
    setSelectedCart(item);
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCartItems = cartItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(cartItems.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-primary-50">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-primary-100">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-6">
          Cart Items
        </h2>

        <div className="overflow-x-auto rounded-lg border border-primary-100">
          <table className="min-w-full divide-y divide-primary-100">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Sr No.
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Product
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Quantity
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Subtotal
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  User
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date Added
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-primary-100">
              {currentCartItems.length > 0 ? (
                currentCartItems.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {indexOfFirstItem + index + 1}
                    </td>
                    <td className="px-4 py-3 flex items-center gap-3">
                      <img
                        src={item.productImages?.[0]}
                        alt={item.productName}
                        className="w-12 h-12 rounded-md object-cover shadow-sm"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://placehold.co/60";
                        }}
                      />
                      <span className="text-sm font-medium text-gray-800">
                        {item.productName}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      ₹{item.price}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {item.quantity}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800 font-medium">
                      ₹{item.subtotal}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {item.userName}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {item.createdAt}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      <button
                        onClick={() => handleView(item)}
                        className="flex items-center px-3 py-1 text-sm text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 hover:text-blue-800 transition"
                      >
                        <i className="fas fa-eye mr-2"></i>
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="px-4 py-3 text-center text-sm text-gray-500"
                  >
                    No items in cart.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-end items-center mt-6 space-x-2">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <div className="flex space-x-1">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => paginate(i + 1)}
                className={`px-3 py-1 text-sm rounded-md ${
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
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
      {open && (
        <CartViewModal
          isOpen={open}
          onClose={() => setOpen(false)}
          cartItem={selectedCart}
        />
      )}
    </div>
  );
};

export default Cart;
