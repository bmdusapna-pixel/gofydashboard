import React, { useState } from "react";
import ageGroups from "../../assets/ageGroups.list.js";

const AddProduct = () => {
  // Common product fields
  const [product, setProduct] = useState({
    images: [],
    name: "",
    category: "",
    material: "",
    gender: "",
    color: "",
    description: "",
    shippingPolicy: "",
    washCare: "",
  });

  const categories = ["T-shirt", "Doll", "Shoes", "Pants", "Accessories"];
  const genders = ["Unisex", "Boys", "Girls"];
  const materials = [
    "Cotton",
    "Polyester",
    "Wool",
    "Plastic",
    "Leather",
    "Metal",
  ];
  const colors = ["Red", "Blue", "Green", "Black", "White", "Pink", "Yellow"];

  // Variants
  const [variants, setVariants] = useState([
    {
      ageGroup: "",
      price: "",
      cutPrice: "",
      discount: "",
      specifications: [{ key: "", value: "" }],
    },
  ]);

  // Handle common product changes
  const handleProductChange = (field, value) => {
    setProduct((prev) => ({ ...prev, [field]: value }));
  };

  // Image upload with 2–6 limit
  const handleImageUpload = (files) => {
    const fileArray = Array.from(files);
    setProduct((prev) => {
      const totalImages = prev.images.length + fileArray.length;
      if (totalImages > 6) {
        alert("You can upload a maximum of 6 images.");
      }
      return {
        ...prev,
        images: [...prev.images, ...fileArray].slice(0, 6),
      };
    });
  };

  const removeImage = (imgIndex) => {
    setProduct((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== imgIndex),
    }));
  };

  // Handle variant field change
  const handleVariantChange = (variantIndex, field, value) => {
    setVariants((prev) => {
      const updated = [...prev];
      updated[variantIndex][field] = value;

      if (field === "price" || field === "cutPrice") {
        const price = parseFloat(updated[variantIndex].price) || 0;
        const cutPrice = parseFloat(updated[variantIndex].cutPrice) || 0;
        updated[variantIndex].discount =
          cutPrice > 0 ? Math.round(((cutPrice - price) / cutPrice) * 100) : "";
      }

      return updated;
    });
  };

  // Specification changes
  const handleSpecChange = (variantIndex, specIndex, key, value) => {
    setVariants((prev) => {
      const updated = [...prev];
      updated[variantIndex].specifications[specIndex][key] = value;
      return updated;
    });
  };

  const addSpec = (variantIndex) => {
    setVariants((prev) => {
      const updated = [...prev];
      updated[variantIndex].specifications.push({ key: "", value: "" });
      return updated;
    });
  };

  // Add/remove variant
  const addVariant = () => {
    setVariants((prev) => [
      ...prev,
      {
        ageGroup: "",
        price: "",
        cutPrice: "",
        discount: "",
        specifications: [{ key: "", value: "" }],
      },
    ]);
  };

  const removeVariant = (index) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (product.images.length < 2) {
      alert("Please upload at least 2 images.");
      return;
    }
    console.log("Final Product:", { ...product, variants });
  };

  return (
    <div className="bg-white p-4 sm:p-6 lg:p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-300">
          <h1 className="text-lg font-medium mb-6 whitespace-nowrap">
            Add Product
          </h1>

          <form onSubmit={handleSubmit} className="space-y-8 text-sm">
            {/* Common Product Fields */}
            <div className="p-4 border border-gray-300 rounded-lg space-y-6 bg-gray-50">
              {/* Images */}
              <div>
                <label className="block mb-2 whitespace-nowrap">
                  Product Images (2–6)
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files)}
                  className="border border-gray-300 rounded p-2 w-full"
                />
                <div className="flex gap-4 flex-wrap mt-3">
                  {product.images.map((img, imgIndex) => (
                    <div
                      key={imgIndex}
                      className="relative w-24 h-24 border border-gray-300 rounded overflow-hidden"
                    >
                      <img
                        src={URL.createObjectURL(img)}
                        alt="preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(imgIndex)}
                        className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded px-1"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block mb-2 whitespace-nowrap">Name</label>
                <input
                  type="text"
                  value={product.name}
                  onChange={(e) => handleProductChange("name", e.target.value)}
                  className="border border-gray-300 rounded p-2 w-full"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block mb-2 whitespace-nowrap">Category</label>
                <select
                  value={product.category}
                  onChange={(e) =>
                    handleProductChange("category", e.target.value)
                  }
                  className="border border-gray-300 rounded p-2 w-full"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat, i) => (
                    <option key={i} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Material */}
              <div>
                <label className="block mb-2 whitespace-nowrap">Material</label>
                <select
                  value={product.material}
                  onChange={(e) =>
                    handleProductChange("material", e.target.value)
                  }
                  className="border border-gray-300 rounded p-2 w-full"
                >
                  <option value="">Select Material</option>
                  {materials.map((mat, i) => (
                    <option key={i} value={mat}>
                      {mat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Gender */}
              <div>
                <label className="block mb-2 whitespace-nowrap">Gender</label>
                <select
                  value={product.gender}
                  onChange={(e) =>
                    handleProductChange("gender", e.target.value)
                  }
                  className="border border-gray-300 rounded p-2 w-full"
                >
                  <option value="">Select Gender</option>
                  {genders.map((g, i) => (
                    <option key={i} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              {/* Color */}
              <div>
                <label className="block mb-2 whitespace-nowrap">Color</label>
                <select
                  value={product.color}
                  onChange={(e) => handleProductChange("color", e.target.value)}
                  className="border border-gray-300 rounded p-2 w-full"
                >
                  <option value="">Select Color</option>
                  {colors.map((col, i) => (
                    <option key={i} value={col}>
                      {col}
                    </option>
                  ))}
                </select>
              </div>

              {/* Textareas */}
              {[
                { label: "Description", field: "description" },
                { label: "Shipping & Return Policy", field: "shippingPolicy" },
                { label: "Wash Care", field: "washCare" },
              ].map(({ label, field }) => (
                <div key={field}>
                  <label className="block mb-2 whitespace-nowrap">
                    {label}
                  </label>
                  <textarea
                    value={product[field]}
                    onChange={(e) => handleProductChange(field, e.target.value)}
                    className="border border-gray-300 rounded p-2 w-full"
                  />
                </div>
              ))}
            </div>

            {/* Variants */}
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
                      <option key={group._id} value={group.id}>
                        {group.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

            {/* Submit */}
            <div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded whitespace-nowrap hover:bg-blue-700"
              >
                Add Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
