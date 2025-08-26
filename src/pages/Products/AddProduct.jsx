import React, { useState, useEffect } from "react";
import api from "../../api/axios";

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    brand: "",
    category: "",
    material: "",
    gender: "",
    description: "",
    shippingPolicy: "",
    washCare: [""],
    status: "",
    promotions: [],
    dealHours: "",
  });

  const [ageGroupOptions, setAgeGroupOptions] = useState([]);
  const [categories, setCategories] = useState([]);
  const genders = ["Unisex", "Boys", "Girls"];
  const [materials, setMaterials] = useState([]);
  const [colors, setColor] = useState([]);

  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const fetchAgeGroups = async () => {
      try {
        const response = await api.get("/ages");
        setAgeGroupOptions(response.data);
      } catch (error) {
        console.error("Error fetching age groups:", error);
      }
    };
    const fetchMaterials = async () => {
      try {
        const response = await api.get("/material");
        setMaterials(response.data.materials);
      } catch (error) {
        console.error("Error fetching materials:", error);
      }
    };
    const fetchColors = async () => {
      try {
        const response = await api.get("/color/colors");
        setColor(response.data);
      } catch (error) {
        console.error("Error fetching colors:", error);
      }
    };
    const fetchCategories = async () => {
      try {
        const response = await api.get("/categories");
        setCategories(response.data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
    fetchAgeGroups();
    fetchMaterials();
    fetchColors();
  }, []);
  const statuses = ["In Stock", "Out of Stock", "Discontinued"];

  const [variants, setVariants] = useState([
    {
      ageGroup: "",
      color: "",
      images: [],
      price: "",
      cutPrice: "",
      discount: "",
      specifications: [{ key: "", value: "" }],
      stock: "",
    },
  ]);

  const handleProductChange = (field, value) => {
    setProduct((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (variantIndex, files) => {
    const fileArray = Array.from(files);
    setVariants((prev) => {
      const updated = [...prev];
      const currentImages = updated[variantIndex].images;
      const newImagesToAdd = fileArray.filter(
        (file) => !currentImages.some((img) => img.name === file.name)
      );
      const newImages = [...currentImages, ...newImagesToAdd].slice(0, 6);
      updated[variantIndex].images = newImages;
      return updated;
    });
  };

  const removeImage = (variantIndex, imgIndex) => {
    setVariants((prev) => {
      const updated = [...prev];
      updated[variantIndex].images = updated[variantIndex].images.filter(
        (_, i) => i !== imgIndex
      );
      return updated;
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e, variantIndex) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length) {
      handleImageUpload(variantIndex, files);
    }
  };

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
      updated[variantIndex] = {
        ...updated[variantIndex],
        specifications: updated[variantIndex].specifications.map((spec, i) =>
          i === specIndex ? { ...spec, [field]: value } : spec
        ),
      };
      return updated;
    });
  };

  const addVariant = () => {
    setVariants((prev) => [
      ...prev,
      {
        ageGroup: "",
        color: "",
        images: [],
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

  const handleWashCareChange = (index, value) => {
    setProduct((prev) => {
      const updated = [...prev.washCare];
      updated[index] = value;
      return { ...prev, washCare: updated };
    });
  };

  const addWashCareItem = () => {
    setProduct((prev) => ({ ...prev, washCare: [...prev.washCare, ""] }));
  };

  const removeWashCareItem = (index) => {
    setProduct((prev) => ({
      ...prev,
      washCare: prev.washCare.filter((_, i) => i !== index),
    }));
  };

  const generateSlug = (name) => {
    const base = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return `${base}-${Date.now()}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    for (const variant of variants) {
      if (variant.images.length < 2) {
        alert("Please upload at least 2 images for each variant.");
        return;
      }
    }
    try {
      const formData = new FormData();
      const ranges = [];
      let fileIndex = 1;
      variants.forEach((variant) => {
        const start = fileIndex;
        variant.images.forEach((file) => {
          formData.append("image", file);
        });
        fileIndex += variant.images.length;
        const end = fileIndex - 1;
        ranges.push([start, end]);
      });
      const urlSlug = generateSlug(product.name);
      const payload = {
        ...product,
        url: urlSlug,
        variants: variants.map((variant) => ({
          ageGroup: variant.ageGroup,
          color: variant.color,
          price: Number(variant.price),
          cutPrice: Number(variant.cutPrice),
          discount: Number(variant.discount),
          stock: Number(variant.stock),
          specifications: variant.specifications
            .filter((s) => s.key && s.value)
            .map((s) => ({ [s.key]: s.value })),
        })),
        images: ranges,
      };
      formData.append("payload", JSON.stringify(payload));
      const response = await api.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ Product created successfully!");
      console.log("Saved:", response.data);
    } catch (error) {
      console.error("Error submitting product:", error);
      alert(
        "❌ Failed to create product: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-primary-50">
      <div className="">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-300">
          <h1 className="text-lg font-medium mb-6 whitespace-nowrap">
            Add Product
          </h1>

          <form onSubmit={handleSubmit} className="space-y-8 text-sm">
            {/* Common Product Fields */}
            <div className="p-4 border border-gray-300 rounded-lg bg-gray-50 space-y-4">
              <label className="block font-medium text-gray-700">
                Product Promotions
              </label>

              <div className="space-y-2">
                {[
                  { value: "super_deal", label: "Super Deal" },
                  { value: "deal_product", label: "Deal Product" },
                  { value: "trending", label: "Trending Product" },
                  { value: "deal_of_the_day", label: "Deal of the Day" },
                ].map((promo) => (
                  <label key={promo.value} className="flex items-center gap-2">
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
                  className="w-full border border-gray-300 rounded-md p-2"
                  value={product.dealHours || ""}
                  onChange={(e) =>
                    setProduct({ ...product, dealHours: e.target.value })
                  }
                />
              )}
            </div>

            <div className="p-4 border border-gray-300 rounded-lg space-y-6 bg-gray-50">
              <div className="grid grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="block mb-2 whitespace-nowrap">Name</label>
                  <input
                    type="text"
                    value={product.name}
                    onChange={(e) =>
                      handleProductChange("name", e.target.value)
                    }
                    className="border border-gray-300 rounded p-2 w-full"
                  />
                </div>

                {/* Brand */}
                <div>
                  <label className="block mb-2 whitespace-nowrap">Brand</label>
                  <input
                    type="text"
                    value={product.brand}
                    onChange={(e) =>
                      handleProductChange("brand", e.target.value)
                    }
                    className="border border-gray-300 rounded p-2 w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Category */}
                <div>
                  <label className="block mb-2 whitespace-nowrap">
                    Category
                  </label>
                  <select
                    value={product.category}
                    onChange={(e) =>
                      handleProductChange("category", e.target.value)
                    }
                    className="border border-gray-300 rounded p-2 w-full"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat, i) => (
                      <option key={i} value={cat._id}>
                        {cat.categoryName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Material */}
                <div>
                  <label className="block mb-2 whitespace-nowrap">
                    Material
                  </label>
                  <select
                    value={product.material}
                    onChange={(e) =>
                      handleProductChange("material", e.target.value)
                    }
                    className="border border-gray-300 rounded p-2 w-full"
                  >
                    <option value="">Select Material</option>
                    {materials.map((mat, i) => (
                      <option key={i} value={mat._id}>
                        {mat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
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

                {/* Status */}
                <div>
                  <label className="block mb-2 whitespace-nowrap">Status</label>
                  <select
                    value={product.status}
                    onChange={(e) =>
                      handleProductChange("status", e.target.value)
                    }
                    className="border border-gray-300 rounded p-2 w-full"
                  >
                    <option value="">Select Status</option>
                    {statuses.map((s, i) => (
                      <option key={i} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
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

              {/* Wash Care as List */}
              <div>
                <label className="block mb-2 whitespace-nowrap">
                  Wash Care Instructions
                </label>
                <ul className="space-y-2">
                  {product.washCare.map((item, index) => (
                    <li key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) =>
                          handleWashCareChange(index, e.target.value)
                        }
                        placeholder="Enter wash care instruction"
                        className="border border-gray-300 rounded p-2 flex-1"
                      />
                      {product.washCare.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeWashCareItem(index)}
                          className="bg-red-500 text-white px-2 rounded"
                        >
                          ✕
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={addWashCareItem}
                  className="text-blue-500 mt-2"
                >
                  + Add Instruction
                </button>
              </div>
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

                {/* Images with Drag-and-Drop */}
                <div>
                  <label className="block mb-2 whitespace-nowrap">
                    Variant Images (2–6)
                  </label>
                  <div
                    className={`border-2 border-dashed rounded p-4 text-center cursor-pointer transition-colors ${
                      isDragging
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300"
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, vIndex)}
                  >
                    <p>Drag & drop images here, or</p>
                    <label
                      htmlFor={`file-upload-${vIndex}`}
                      className="text-blue-500 underline cursor-pointer"
                    >
                      Click to browse
                    </label>
                    <input
                      id={`file-upload-${vIndex}`}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) =>
                        handleImageUpload(vIndex, e.target.files)
                      }
                      className="hidden"
                    />
                  </div>
                  <div className="flex gap-4 flex-wrap mt-3">
                    {variant.images.map((img, imgIndex) => (
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
                          onClick={() => removeImage(vIndex, imgIndex)}
                          className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded px-1"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Color */}
                <div>
                  <label className="block mb-2 whitespace-nowrap">Color</label>
                  <select
                    value={variant.color}
                    onChange={(e) =>
                      handleVariantChange(vIndex, "color", e.target.value)
                    }
                    className="border border-gray-300 rounded p-2 w-full"
                  >
                    <option value="">Select Color</option>
                    {colors.map((col, i) => (
                      <option key={i} value={col._id}>
                        {col.name}
                      </option>
                    ))}
                  </select>
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
                    {ageGroupOptions.map((group) => (
                      <option key={group._id} value={group._id}>
                        {group.ageRange}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price, Cut Price, Discount, Stock */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  {[
                    { label: "Sale Price", field: "price" },
                    { label: "MRP", field: "cutPrice" },
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
                      Stock Quantity
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
