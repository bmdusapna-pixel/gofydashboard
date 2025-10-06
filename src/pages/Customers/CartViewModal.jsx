import React from "react";

const CartViewModal = ({ isOpen, onClose, cartItem }) => {
  if (!isOpen || !cartItem) return null;

  const { fullProduct, variant, ageGroup, quantity } = cartItem;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl p-6 overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{fullProduct.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 font-bold text-lg"
          >
            &times;
          </button>
        </div>

        {/* Images */}
        <div className="flex gap-2 mb-4 overflow-x-auto">
          {variant?.images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`${fullProduct.name} ${idx + 1}`}
              className="w-24 h-24 object-cover rounded-md border border-gray-200"
            />
          ))}
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p>
              <span className="font-semibold">Brand:</span> {fullProduct.brand}
            </p>
            <p>
              <span className="font-semibold">Gender:</span>{" "}
              {fullProduct.gender}
            </p>
            <p>
              <span className="font-semibold">Age Group:</span>{" "}
              {ageGroup?.ageGroup || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Price:</span> ₹
              {ageGroup?.price || 0}
            </p>
            <p>
              <span className="font-semibold">Discount:</span>{" "}
              {ageGroup?.discount || 0}%
            </p>
            <p>
              <span className="font-semibold">Stock:</span>{" "}
              {ageGroup?.stock || 0}
            </p>
          </div>
          <div>
            <p>
              <span className="font-semibold">Shipping Policy:</span>{" "}
              {fullProduct.shippingPolicy}
            </p>
            <p>
              <span className="font-semibold">Promotions:</span>{" "}
              {fullProduct.promotions?.join(", ")}
            </p>
            <p>
              <span className="font-semibold">Status:</span>{" "}
              {fullProduct.status}
            </p>
            <p>
              <span className="font-semibold">Quantity in Cart:</span>{" "}
              {quantity}
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          <p className="font-semibold mb-1">Description:</p>
          <p className="text-gray-700">{fullProduct.description}</p>
        </div>

        {/* Specifications */}
        {variant?.specifications?.length > 0 && (
          <div className="mb-4">
            <p className="font-semibold mb-1">Specifications:</p>
            <ul className="list-disc list-inside text-gray-700">
              {variant.specifications.map((spec, idx) => (
                <li key={idx}>
                  {spec.key}: {spec.value}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Key Features */}
        {fullProduct.keyFeatures?.length > 0 && (
          <div className="mb-4">
            <p className="font-semibold mb-1">Key Features:</p>
            <ul className="list-disc list-inside text-gray-700">
              {fullProduct.keyFeatures.map((kf, idx) => (
                <li key={idx}>
                  {kf.key}: {kf.value}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartViewModal;
