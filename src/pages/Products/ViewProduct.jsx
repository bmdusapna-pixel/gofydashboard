import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";

const ViewProduct = () => {
  const { url } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${url}`);
        const fetchedProduct = response.data.data;
        console.log("Fetched Product:", fetchedProduct);
        setProduct(fetchedProduct);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to fetch product data.");
        setIsLoading(false);
      }
    };

    if (url) {
      fetchProduct();
    }
  }, [url]);

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto p-4 bg-primary-50">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-300 text-center">
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 overflow-y-auto p-4 bg-primary-50">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-300 text-center">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex-1 overflow-y-auto p-4 bg-primary-50">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-300 text-center">
          <p className="text-sm text-gray-500">Product not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-primary-50">
      <div className="">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-300 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-sm font-semibold">{product.name}</h1>
            <p className="text-sm text-gray-500">
              {product.categories?.[0]?.categoryName || "N/A"}
            </p>
          </div>

          {/* Product-level details */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500">Material</p>
              <p className="text-sm font-semibold">
                {product.material?.name || "N/A"}
              </p>
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
              <p className="text-sm font-semibold">
                {new Date(product.createdAt).toLocaleDateString()}
              </p>
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

          {/* Product-level Specifications */}
          {product.specifications?.length > 0 && (
            <div>
              <p className="text-sm font-semibold mb-1">
                Product Specifications
              </p>
              <ul className="list-disc list-inside space-y-1">
                {product.specifications.map((spec, idx) => (
                  <li key={idx} className="text-sm text-gray-700">
                    <span className="font-semibold">{spec.key}:</span>{" "}
                    {spec.value}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Product-level Key Features */}
          {product.keyFeatures?.length > 0 && (
            <div>
              <p className="text-sm font-semibold mb-1">Key Features</p>
              <ul className="list-disc list-inside space-y-1">
                {product.keyFeatures.map((feature, idx) => (
                  <li key={idx} className="text-sm text-gray-700">
                    <span className="font-semibold">{feature.key}:</span>{" "}
                    {feature.value}
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
                        <p className="text-sm text-gray-500">Color</p>
                        <p className="text-sm font-semibold">
                          {variant.color?.name || variant.color}
                        </p>
                      </div>
                    </div>

                    {/* Correctly iterating over ageGroups */}
                    {variant.ageGroups?.length > 0 && (
                      <div className="space-y-4">
                        <h4 className="text-sm font-semibold pt-2">
                          Age Groups
                        </h4>
                        {variant.ageGroups.map((ageGroup, j) => (
                          <div
                            key={j}
                            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
                          >
                            <div>
                              <p className="text-sm text-gray-500">Age Group</p>
                              <p className="text-sm font-semibold">
                                {ageGroup.ageGroup?.ageRange || "N/A"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">
                                Stock Quantity
                              </p>
                              <p className="text-sm font-semibold">
                                {ageGroup.stock}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">
                                Sale Price
                              </p>
                              <p className="text-sm font-semibold">
                                ₹ {parseFloat(ageGroup.price).toFixed(2)}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">MRP</p>
                              <p className="text-sm font-semibold">
                                ₹ {parseFloat(ageGroup.cutPrice).toFixed(2)}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Discount</p>
                              <p className="text-sm font-semibold">
                                {ageGroup.discount}%
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {/* Variant-level Specifications */}
                    {variant.specifications?.length > 0 && (
                      <div>
                        <p className="text-sm font-semibold mb-1">
                          Variant Specifications
                        </p>
                        <ul className="list-disc list-inside space-y-1">
                          {variant.specifications.map((spec, idx) => {
                            const [key, value] = Object.entries(spec)[0];
                            return (
                              <li key={idx} className="text-sm text-gray-700">
                                <span className="font-semibold">{key}:</span>{" "}
                                {value}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- New Section: Metadata and Display --- */}
          <div>
            <h2 className="text-sm font-bold mb-2">Additional Details</h2>
            <div className="space-y-4">
              {/* Display on */}
              {product.displayOn?.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500">Display On</p>
                  <div className="flex flex-wrap gap-2">
                    {product.displayOn.map((platform, idx) => (
                      <span
                        key={idx}
                        className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full"
                      >
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Promotions */}
              {product.promotions?.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500">Promotions</p>
                  <ul className="list-disc list-inside space-y-1">
                    {product.promotions.map((promo, idx) => (
                      <li key={idx} className="text-sm text-gray-700">
                        {promo}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Meta Data */}
              <div>
                <p className="text-sm text-gray-500">Meta Title</p>
                <p className="text-sm font-semibold">
                  {product.metaTitle || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Meta Description</p>
                <p className="text-sm font-semibold">
                  {product.metaDescription || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Meta Keywords</p>
                <p className="text-sm font-semibold">
                  {product.metaKeywords || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProduct;
