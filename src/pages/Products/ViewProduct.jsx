import React from "react";
import { useParams } from "react-router-dom";
import products from "../../assets/product.list.js";

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

  return (
    <div className="bg-white p-4 sm:p-6 lg:p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-300 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-sm font-semibold">{product.name}</h1>
            <p className="text-sm text-gray-500">{product.category}</p>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500">Stock</p>
              <p className="text-sm font-semibold">{product.stock}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Price</p>
              <p className="text-sm font-semibold">${product.price}</p>
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

          {/* Images */}
          <div>
            <p className="text-sm font-semibold mb-2">Images</p>
            <div className="flex gap-3">
              {product.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Product ${idx}`}
                  className="w-20 h-20 object-cover rounded border border-gray-300"
                />
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <p className="text-sm font-semibold mb-1">Description</p>
            <p className="text-sm text-gray-700">{product.description}</p>
          </div>

          {/* Variants */}
          {product.variants?.length > 0 && (
            <div>
              <p className="text-sm font-semibold mb-2">Variants</p>
              <div className="space-y-2">
                {product.variants.map((variant, i) => (
                  <div
                    key={i}
                    className="p-3 border border-gray-300 rounded-lg space-y-2"
                  >
                    {/* Basic Variant Info */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                      <div>
                        <p className="text-sm text-gray-500">Age Group</p>
                        <p className="text-sm font-semibold">
                          {variant.ageGroup}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Price</p>
                        <p className="text-sm font-semibold">
                          ${variant.price}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Cut Price</p>
                        <p className="text-sm font-semibold">
                          ${variant.cutPrice}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Discount</p>
                        <p className="text-sm font-semibold">
                          {variant.discount}%
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Stock</p>
                        <p className="text-sm font-semibold">{variant.stock}</p>
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
