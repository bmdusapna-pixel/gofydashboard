import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ageGroups from "../../assets/ageGroups.list.js";
import products from "../../assets/product.list.js";

const EditProduct = () => {
  const { url } = useParams();
  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);

  useEffect(() => {
    const productToEdit = products.find((p) => p.url === url);
    if (productToEdit) {
      setProduct({
        images: productToEdit.images,
        name: productToEdit.name,
        category: productToEdit.category,
        material: productToEdit.material,
        gender: productToEdit.gender,
        color: productToEdit.color,
        description: productToEdit.description,
        shippingPolicy: productToEdit.shippingPolicy,
        washCare: productToEdit.washCare,
        status: productToEdit.status,
        promotions: productToEdit.promotions,
        dealHours: productToEdit.dealDuration,
      });
      setVariants(productToEdit.variants);
    }
  }, [url]);

  const handleProductChange = (field, value) => {
    setProduct((prev) => ({ ...prev, [field]: value }));
  };

  const handleVariantChange = (variantIndex, field, value) => {
    setVariants((prev) => {
      const updated = [...prev];
      updated[variantIndex] = { ...updated[variantIndex], [field]: value };
      if (field === "price" || field === "cutPrice") {
        const price = parseFloat(updated[variantIndex].price) || 0;
        const cutPrice = parseFloat(updated[variantIndex].cutPrice) || 0;
        updated[variantIndex].discount =
          cutPrice > 0 ? Math.round(((cutPrice - price) / cutPrice) * 100) : "";
      }
      return updated;
    });
  };

  const addSpec = (variantIndex) => {
    setVariants((prev) => {
      const updated = [...prev];
      updated[variantIndex] = {
        ...updated[variantIndex],
        specifications: [
          ...updated[variantIndex].specifications,
          { key: "", value: "" },
        ],
      };
      return updated;
    });
  };

  const removeSpec = (variantIndex, specIndex) => {
    setVariants((prev) => {
      const updated = [...prev];
      const specs = updated[variantIndex].specifications;
      if (specs.length > 1) {
        updated[variantIndex] = {
          ...updated[variantIndex],
          specifications: specs.filter((_, i) => i !== specIndex),
        };
      }
      return updated;
    });
  };

  const handleSpecChange = (variantIndex, specIndex, field, value) => {
    setVariants((prev) => {
      const updated = [...prev];
      const updatedSpecs = updated[variantIndex].specifications.map((spec, i) =>
        i === specIndex ? { ...spec, [field]: value } : spec
      );
      updated[variantIndex] = {
        ...updated[variantIndex],
        specifications: updatedSpecs,
      };
      return updated;
    });
  };

  const addVariant = () => {
    setVariants((prev) => [
      ...prev,
      {
        ageGroup: "",
        price: "",
        cutPrice: "",
        discount: "",
        specifications: [{ key: "", value: "" }],
        stock: "",
      },
    ]);
  };

  const removeVariant = (index) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedProduct = {
      ...product,
      variants,
    };
    console.log("Updated Product:", updatedProduct);
    alert("Product updated! Check the console for the new object.");
  };

  if (!product) {
    return (
      <div className="text-center p-8">
        <h1 className="text-lg font-medium">Product not found.</h1>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 sm:p-6 lg:p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-300">
          <h1 className="text-lg font-medium mb-6 whitespace-nowrap">
            Edit Product
          </h1>

          <form onSubmit={handleSubmit} className="space-y-8 text-sm">
            {/* Read-only Common Product Fields */}
            <div className="p-4 border border-gray-300 rounded-lg space-y-6 bg-gray-50">
              <label className="block mb-2 whitespace-nowrap font-medium text-gray-700">
                Product Details (Read-only)
              </label>
              {/* Images */}
              <div>
                <label className="block mb-2 whitespace-nowrap">
                  Product Images
                </label>
                <div className="flex gap-4 flex-wrap mt-3">
                  {product.images.map((img, imgIndex) => (
                    <div
                      key={imgIndex}
                      className="relative w-24 h-24 border border-gray-300 rounded overflow-hidden"
                    >
                      <img
                        src={img}
                        alt="product preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
              {/* Other Read-only fields */}
              <div>
                <label className="block mb-2 whitespace-nowrap">Name</label>
                <input
                  type="text"
                  value={product.name}
                  readOnly
                  className="border border-gray-300 rounded p-2 w-full bg-gray-100"
                />
              </div>
            </div>

            {/* Editable Fields Section */}
            <div className="p-4 border border-gray-300 rounded-lg space-y-6 bg-gray-50">
              <label className="block mb-2 whitespace-nowrap font-medium text-gray-700">
                Editable Product Fields
              </label>
              {/* Product Promotions */}
              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  Product Promotions
                </label>
                <div className="space-y-2">
                  {[
                    { value: "super_deal", label: "Super Deal" },
                    { value: "deal_product", label: "Deal Product" },
                    { value: "trending", label: "Trending Product" },
                    { value: "deal_of_the_day", label: "Deal of the Day" },
                  ].map((promo) => (
                    <label
                      key={promo.value}
                      className="flex items-center gap-2"
                    >
                      <input
                        type="checkbox"
                        value={promo.value}
                        checked={product.promotions.includes(promo.value)}
                        onChange={(e) => {
                          let newPromos = [...product.promotions];
                          if (e.target.checked) {
                            newPromos.push(promo.value);
                          } else {
                            newPromos = newPromos.filter(
                              (p) => p !== promo.value
                            );
                          }
                          setProduct({ ...product, promotions: newPromos });
                        }}
                      />
                      <span>{promo.label}</span>
                    </label>
                  ))}
                </div>

                {product.promotions.includes("deal_of_the_day") && (
                  <input
                    type="number"
                    placeholder="Deal duration (hours)"
                    className="w-full border border-gray-300 rounded-md p-2 mt-2"
                    value={product.dealHours || ""}
                    onChange={(e) =>
                      setProduct({ ...product, dealHours: e.target.value })
                    }
                  />
                )}
              </div>
              {/* Description */}
              <div>
                <label className="block mb-2 whitespace-nowrap">
                  Description
                </label>
                <textarea
                  value={product.description}
                  onChange={(e) =>
                    handleProductChange("description", e.target.value)
                  }
                  className="border border-gray-300 rounded p-2 w-full"
                />
              </div>
              {/* Shipping & Return Policy */}
              <div>
                <label className="block mb-2 whitespace-nowrap">
                  Shipping & Return Policy
                </label>
                <textarea
                  value={product.shippingPolicy}
                  onChange={(e) =>
                    handleProductChange("shippingPolicy", e.target.value)
                  }
                  className="border border-gray-300 rounded p-2 w-full"
                />
              </div>
              {/* Editable Variants Section */}
              {variants.map((variant, vIndex) => (
                <div
                  key={vIndex}
                  className="p-4 border border-gray-300 rounded-lg space-y-6 bg-gray-50"
                >
                  <div className="flex justify-between items-center">
                    <h2 className="font-medium whitespace-nowrap">
                      Variant {vIndex + 1}
                    </h2>
                    {variants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVariant(vIndex)}
                        className="text-red-500 whitespace-nowrap"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  {/* Age Group */}
                  <div>
                    <label className="block mb-2 whitespace-nowrap">
                      Age Group
                    </label>
                    <select
                      value={variant.ageGroup}
                      onChange={(e) =>
                        handleVariantChange(vIndex, "ageGroup", e.target.value)
                      }
                      className="border border-gray-300 rounded p-2 w-full"
                    >
                      <option value="">Select Age Group</option>
                      {ageGroups.map((group) => (
                        <option key={group.id} value={group.id}>
                          {group.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Price, Cut Price, Discount, Stock */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    {[
                      { label: "Price", field: "price" },
                      { label: "Cut Price", field: "cutPrice" },
                    ].map(({ label, field }) => (
                      <div key={field}>
                        <label className="block mb-2 whitespace-nowrap">
                          {label}
                        </label>
                        <input
                          type="number"
                          value={variant[field]}
                          onChange={(e) =>
                            handleVariantChange(vIndex, field, e.target.value)
                          }
                          className="border border-gray-300 rounded p-2 w-full"
                        />
                      </div>
                    ))}
                    <div>
                      <label className="block mb-2 whitespace-nowrap">
                        Discount %
                      </label>
                      <input
                        type="number"
                        value={variant.discount}
                        readOnly
                        className="border border-gray-300 rounded p-2 w-full bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 whitespace-nowrap">
                        Stock Number
                      </label>
                      <input
                        type="number"
                        value={variant.stock}
                        onChange={(e) =>
                          handleVariantChange(vIndex, "stock", e.target.value)
                        }
                        className="border border-gray-300 rounded p-2 w-full"
                      />
                    </div>
                  </div>
                  {/* Specifications */}
                  <div>
                    <label className="block mb-2 whitespace-nowrap">
                      Specifications
                    </label>
                    {variant.specifications.map((spec, sIndex) => (
                      <div key={sIndex} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          placeholder="Key"
                          value={spec.key}
                          onChange={(e) =>
                            handleSpecChange(
                              vIndex,
                              sIndex,
                              "key",
                              e.target.value
                            )
                          }
                          className="border border-gray-300 rounded p-2 flex-1"
                        />
                        <input
                          type="text"
                          placeholder="Value"
                          value={spec.value}
                          onChange={(e) =>
                            handleSpecChange(
                              vIndex,
                              sIndex,
                              "value",
                              e.target.value
                            )
                          }
                          className="border border-gray-300 rounded p-2 flex-1"
                        />
                        {variant.specifications.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeSpec(vIndex, sIndex)}
                            className="text-red-500 whitespace-nowrap"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addSpec(vIndex)}
                      className="text-blue-500 whitespace-nowrap"
                    >
                      + Add Specification
                    </button>
                  </div>
                </div>
              ))}
              {/* Add Variant */}
              <button
                type="button"
                onClick={addVariant}
                className="text-green-600 whitespace-nowrap"
              >
                + Add Variant
              </button>
            </div>
            {/* Submit */}
            <div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded whitespace-nowrap hover:bg-blue-700"
              >
                Update Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
