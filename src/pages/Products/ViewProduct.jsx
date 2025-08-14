import React from "react";
import { useParams } from "react-router-dom";
import products from "../../assets/product.list.js";
import ageGroups from "../../assets/ageGroups.list.js";

const ViewProduct = () => {
  const { url } = useParams();
  const product = products.find((p) => p.url === url);

  if (!product) {
    return (
      <div className="bg-white p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-300 text-center">
            <p className="text-sm text-gray-500">Product not found</p>
          </div>
        </div>
      </div>
    );
  }

  // Helper function to find age group name
  const getAgeGroupName = (ageGroupId) => {
    const ageGroup = ageGroups.find((group) => group.id === ageGroupId);
    return ageGroup ? ageGroup.name : ageGroupId;
  };

  return (
    <div className="bg-white p-4 sm:p-6 lg:p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-300 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-sm font-semibold">{product.name}</h1>
            <p className="text-sm text-gray-500">{product.category}</p>
          </div>

          {/* Product-level details */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500">Material</p>
              <p className="text-sm font-semibold">{product.material}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Gender</p>
              <p className="text-sm font-semibold">{product.gender}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="text-sm font-semibold">{product.status}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date Added</p>
              <p className="text-sm font-semibold">{product.dateAdded}</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <p className="text-sm font-semibold mb-1">Description</p>
            <p className="text-sm text-gray-700">{product.description}</p>
          </div>

          {/* Wash Care */}
          {product.washCare?.length > 0 && (
            <div>
              <p className="text-sm font-semibold mb-1">Wash Care</p>
              <ul className="list-disc list-inside space-y-1">
                {product.washCare.map((item, idx) => (
                  <li key={idx} className="text-sm text-gray-700">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Variants */}
          {product.variants?.length > 0 && (
            <div>
              <h2 className="text-sm font-bold mb-2">Product Variants</h2>
              <div className="space-y-4">
                {product.variants.map((variant, i) => (
                  <div
                    key={i}
                    className="p-3 border border-gray-300 rounded-lg space-y-3"
                  >
                    <h3 className="text-sm font-semibold">Variant {i + 1}</h3>

                    {/* Variant-specific Images */}
                    <div>
                      <p className="text-sm font-semibold mb-2">Images</p>
                      <div className="flex gap-3 overflow-x-auto">
                        {variant.images.map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt={`Variant ${i + 1} image ${idx + 1}`}
                            className="w-20 h-20 object-cover rounded border border-gray-300"
                          />
                        ))}
                      </div>
                    </div>

                    {/* Basic Variant Info */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Age Group</p>
                        <p className="text-sm font-semibold">
                          {getAgeGroupName(variant.ageGroup)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Color</p>
                        <p className="text-sm font-semibold">{variant.color}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Stock</p>
                        <p className="text-sm font-semibold">{variant.stock}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Price</p>
                        <p className="text-sm font-semibold">
                          ₹ {parseFloat(variant.price).toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Cut Price</p>
                        <p className="text-sm font-semibold">
                          ₹ {parseFloat(variant.cutPrice).toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Discount</p>
                        <p className="text-sm font-semibold">
                          {variant.discount}%
                        </p>
                      </div>
                    </div>
                    {/* Specifications */}
                    {variant.specifications?.length > 0 && (
                      <div>
                        <p className="text-sm font-semibold mb-1">
                          Specifications
                        </p>
                        <ul className="list-disc list-inside space-y-1">
                          {variant.specifications.map((spec, idx) => (
                            <li key={idx} className="text-sm text-gray-700">
                              <span className="font-semibold">{spec.key}:</span>{" "}
                              {spec.value}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewProduct;
