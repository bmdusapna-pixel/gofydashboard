import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import Select from "react-select"; // Import react-select
import { useParams } from "react-router-dom";
import { SquarePen } from "lucide-react";

const EditProduct = () => {
  const { url } = useParams();
  const [product, setProduct] = useState({
    name: "",
    url: "",
    brand: "",
    categories: [],
    material: "",
    gender: "",
    description: "",
    shippingPolicy:
      "Shipping and return policies will be automatically applied.",
    washCare: [""],
    status: "",
    redirectUrl: "",
    promotions: [],
    dealHours: "",
    images: [],
    video: null,
    specifications: [{ key: "", value: "" }],
    keyFeatures: [{ key: "", value: "" }],
    displayOn: [],
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    relatedCategories: [],
  });

  const [ageGroupOptions, setAgeGroupOptions] = useState([]);
  const [categories, setCategories] = useState([]);
  const genders = ["Unisex", "Boys", "Girls"];
  const [materials, setMaterials] = useState([]);
  const [colors, setColor] = useState([]);

  const [isDragging, setIsDragging] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [videoPreview, setVideoPreview] = useState(null);
  const [newVideo, setNewVideo] = useState(null);

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
      color: "",
      mainImageIndex: null,
      selectedImages: [],
      ageGroups: [
        {
          ageGroup: "",
          price: "",
          cutPrice: "",
          discount: "",
          stock: "",
          tax: "",
        },
      ],
      specifications: [{ key: "", value: "" }],
    },
  ]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${url}`); // use your API route
        const data = res.data.data;

        // 🟢 Map API data into your form state
        setProduct({
          _id: data._id,
          name: data.name || "",
          url: data.url || "",
          brand: data.brand || "",
          categories: data.categories?.map((c) => c._id) || [],
          relatedCategories: data.relatedCategories?.map((c) => c._id) || [],
          material: data.material?._id || "",
          gender: data.gender || "",
          description: data.description || "",
          shippingPolicy: data.shippingPolicy || "",
          washCare: data.washCare?.length ? data.washCare : [""],
          status: data.status || "",
          redirectUrl: data.redirectUrl || "",
          promotions: data.promotions || [],
          dealHours: data.dealHours || "",
          displayOn: data.displayOn || [],
          specifications: data.specifications?.length
            ? data.specifications
            : [{ key: "", value: "" }],
          keyFeatures: data.keyFeatures?.length
            ? data.keyFeatures
            : [{ key: "", value: "" }],
          metaTitle: data.metaTitle || "",
          metaDescription: data.metaDescription || "",
          metaKeywords: data.metaKeywords || "",
          images: data.images || [],
          video: data.video || null,
        });

        // 🟢 Preload media previews
        setImagePreviews(data.images || []);
        setVideoPreview(data.video || null);

        // 🟢 Map variants correctly
        setVariants(
          data.variants?.map((v) => ({
            color: v.color || "",
            mainImageIndex: data.images
              ? data.images.findIndex((img) => img === v.images[0]) // assume first variant image = main
              : null,
            selectedImages:
              v.images?.length > 1
                ? v.images
                    .slice(1)
                    .map((img) => data.images.findIndex((i) => i === img))
                    .filter((index) => index !== -1)
                : [],
            ageGroups: v.ageGroups?.map((ag) => ({
              ageGroup: ag.ageGroup || "",
              price: ag.price || "",
              cutPrice: ag.cutPrice || "",
              discount: ag.discount || 0,
              stock: ag.stock || "",
              tax: ag.tax || "",
            })) || [
              {
                ageGroup: "",
                price: "",
                cutPrice: "",
                discount: 0,
                stock: "",
                tax: "",
              },
            ],
            specifications: v.specifications?.length
              ? v.specifications
              : [{ key: "", value: "" }],
          })) || []
        );
        // 🟢 Reset new images and video states
        setNewImages([]);
        setNewVideo(null);
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };

    fetchProduct();
  }, [url]);

  const handleProductChange = (field, value) => {
    setProduct((prev) => ({ ...prev, [field]: value }));
  };

  const handleProductNameChange = (e) => {
    const { value } = e.target;
    const urlSlug = generateSlug(value);
    setProduct((prev) => ({ ...prev, name: value, url: urlSlug }));
  };

  const addProductSpec = () => {
    setProduct((prev) => ({
      ...prev,
      specifications: [...prev.specifications, { key: "", value: "" }],
    }));
  };

  const removeProductSpec = (specIndex) => {
    setProduct((prev) => {
      const specs = prev.specifications;
      if (specs.length > 1) {
        return {
          ...prev,
          specifications: specs.filter((_, i) => i !== specIndex),
        };
      }
      return prev;
    });
  };

  const handleProductSpecChange = (specIndex, field, value) => {
    setProduct((prev) => ({
      ...prev,
      specifications: prev.specifications.map((spec, i) =>
        i === specIndex ? { ...spec, [field]: value } : spec
      ),
    }));
  };

  const addKeyFeature = () => {
    setProduct((prev) => ({
      ...prev,
      keyFeatures: [...prev.keyFeatures, { key: "", value: "" }],
    }));
  };

  const removeKeyFeature = (keyIndex) => {
    setProduct((prev) => {
      const features = prev.keyFeatures;
      if (features.length > 1) {
        return {
          ...prev,
          keyFeatures: features.filter((_, i) => i !== keyIndex),
        };
      }
      return prev;
    });
  };

  const handleKeyFeatureChange = (keyIndex, field, value) => {
    setProduct((prev) => ({
      ...prev,
      keyFeatures: prev.keyFeatures.map((feature, i) =>
        i === keyIndex ? { ...feature, [field]: value } : feature
      ),
    }));
  };

  const handleImageUpload = (files) => {
    const fileArray = Array.from(files);
    setNewImages((prev) => [...prev, ...fileArray]);
    const newImageUrls = fileArray.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newImageUrls]);
  };

  const handleVideoUpload = (file) => {
    setNewVideo(file);
    setVideoPreview(URL.createObjectURL(file));
  };

  const removeMedia = (index, type) => {
    if (type === "image") {
      // Determine if the item to remove is an old image (URL) or a new one (File)
      const isNewImage = index >= product.images.length;
      let newImageIndex = -1;
      if (isNewImage) {
        newImageIndex = index - product.images.length;
      }

      // 1. Update the state for new and old images
      if (isNewImage) {
        setNewImages((prev) => prev.filter((_, i) => i !== newImageIndex));
      } else {
        setProduct((prev) => ({
          ...prev,
          images: prev.images.filter((_, i) => i !== index),
        }));
      }

      // 2. Update the previews
      setImagePreviews((prev) => prev.filter((_, i) => i !== index));

      // 3. Update the variants' image indices
      setVariants((prev) =>
        prev.map((variant) => {
          let updatedMainImageIndex = variant.mainImageIndex;
          let updatedSelectedImages = [...variant.selectedImages];

          // Adjust indices if the removed image was before them
          if (
            variant.mainImageIndex !== null &&
            variant.mainImageIndex > index
          ) {
            updatedMainImageIndex -= 1;
          }
          updatedSelectedImages = updatedSelectedImages
            .filter((imgIndex) => imgIndex !== index)
            .map((imgIndex) => (imgIndex > index ? imgIndex - 1 : imgIndex));

          // If the removed image was the main one, reset it
          if (variant.mainImageIndex === index) {
            updatedMainImageIndex = null;
          }

          return {
            ...variant,
            mainImageIndex: updatedMainImageIndex,
            selectedImages: updatedSelectedImages,
          };
        })
      );
    } else if (type === "video") {
      setProduct((prev) => ({ ...prev, video: null }));
      setNewVideo(null);
      setVideoPreview(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length) {
      const images = Array.from(files).filter((file) =>
        file.type.startsWith("image/")
      );
      const video = Array.from(files).find((file) =>
        file.type.startsWith("video/")
      );
      if (images.length > 0) handleImageUpload(images);
      if (video) handleVideoUpload(video);
    }
  };

  const handleVariantChange = (variantIndex, field, value) => {
    setVariants((prev) => {
      const updated = [...prev];
      updated[variantIndex][field] = value;
      return updated;
    });
  };

  const handleAgeGroupChange = (variantIndex, ageIndex, field, value) => {
    setVariants((prev) => {
      const updated = [...prev];
      updated[variantIndex].ageGroups[ageIndex][field] = value;
      if (field === "price" || field === "cutPrice") {
        const price =
          parseFloat(updated[variantIndex].ageGroups[ageIndex].price) || 0;
        const cutPrice =
          parseFloat(updated[variantIndex].ageGroups[ageIndex].cutPrice) || 0;
        updated[variantIndex].ageGroups[ageIndex].discount =
          cutPrice > 0 ? Math.round(((cutPrice - price) / cutPrice) * 100) : "";
      }
      return updated;
    });
  };

  const addAgeGroup = (variantIndex) => {
    setVariants((prev) => {
      const updated = [...prev];
      updated[variantIndex] = {
        ...updated[variantIndex],
        ageGroups: [
          ...updated[variantIndex].ageGroups,
          {
            ageGroup: "",
            price: "",
            cutPrice: "",
            discount: "",
            stock: "",
            tax: "",
          },
        ],
      };
      return updated;
    });
  };

  const removeAgeGroup = (variantIndex, ageIndex) => {
    setVariants((prev) => {
      const updated = [...prev];
      const ageGroups = updated[variantIndex].ageGroups;
      if (ageGroups.length > 1) {
        updated[variantIndex] = {
          ...updated[variantIndex],
          ageGroups: ageGroups.filter((_, i) => i !== ageIndex),
        };
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
      updated[variantIndex] = {
        ...updated[variantIndex],
        specifications: updated[variantIndex].specifications.filter(
          (_, i) => i !== specIndex
        ),
      };
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

  const copySpecsFromAbove = (variantIndex) => {
    if (variantIndex > 0) {
      setVariants((prev) => {
        const updated = [...prev];
        updated[variantIndex] = {
          ...updated[variantIndex],
          specifications: prev[variantIndex - 1].specifications.map((spec) => ({
            key: spec.key,
            value: spec.value,
          })),
        };
        return updated;
      });
    }
  };

  const addVariant = () => {
    setVariants((prev) => [
      ...prev,
      {
        color: "",
        mainImageIndex: null,
        selectedImages: [],
        ageGroups: [
          {
            ageGroup: "",
            price: "",
            cutPrice: "",
            discount: "",
            stock: "",
            tax: "",
          },
        ],
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

  const handleDisplayChange = (option) => {
    setProduct((prev) => {
      const newOptions = prev.displayOn.includes(option)
        ? prev.displayOn.filter((item) => item !== option)
        : [...prev.displayOn, option];
      return { ...prev, displayOn: newOptions };
    });
  };

  const handleBothDisplayChange = () => {
    setProduct((prev) => {
      const isBothSelected =
        prev.displayOn.includes("web") && prev.displayOn.includes("app");
      return {
        ...prev,
        displayOn: isBothSelected ? [] : ["web", "app"],
      };
    });
  };

  const handleCategoriesChange = (selectedOptions) => {
    setProduct((prev) => ({
      ...prev,
      categories: selectedOptions
        ? selectedOptions.map((option) => option.value)
        : [],
    }));
  };

  const handleRelatedCategoriesChange = (selectedOptions) => {
    setProduct((prev) => ({
      ...prev,
      relatedCategories: selectedOptions
        ? selectedOptions.map((option) => option.value)
        : [],
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

    if (!product.name || !product.url || !product.categories?.length) {
      alert("Please fill in all mandatory fields (Name, URL Slug, Category).");
      return;
    }

    if (imagePreviews.length < 2) {
      alert("Please upload at least 2 common images for the product.");
      return;
    }

    for (const variant of variants) {
      if (variant.mainImageIndex === null) {
        alert("Please select a main image for each variant.");
        return;
      }
    }

    if (product.displayOn.length === 0) {
      alert("Please select where the product will be displayed.");
      return;
    }

    try {
      const formData = new FormData();

      newImages.forEach((file) => {
        formData.append("images", file);
      });

      if (newVideo) {
        formData.append("video", newVideo);
      }

      const persistentImageUrls = imagePreviews.filter(
        (url) => !url.startsWith("blob:")
      );

      const variantsWithPersistentImages = variants.map((variant) => {
        const variantImages = [
          imagePreviews[variant.mainImageIndex],
          ...variant.selectedImages.map((i) => imagePreviews[i]),
        ];

        const updatedImages = variantImages
          .map((url) => {
            if (url.startsWith("blob:")) {
              const newImageIndex = newImages.findIndex(
                (file) => URL.createObjectURL(file) === url
              );
              return `new-image-${newImageIndex}`;
            }
            return url;
          })
          .filter(Boolean);

        return {
          ...variant,
          images: updatedImages,
          ageGroups: variant.ageGroups.map((ageGroup) => ({
            ageGroup: ageGroup.ageGroup,
            price: Number(ageGroup.price),
            cutPrice: Number(ageGroup.cutPrice),
            discount: Number(ageGroup.discount),
            stock: Number(ageGroup.stock),
            tax: Number(ageGroup.tax),
          })),
          specifications: variant.specifications.filter(
            (s) => s.key && s.value
          ),
        };
      });
      const payload = {
        ...product,
        images: persistentImageUrls,
        video: videoPreview && !newVideo ? product.video : null,
        variants: variantsWithPersistentImages,
        keyFeatures: product.keyFeatures.filter((f) => f.key && f.value),
      };

      formData.append("payload", JSON.stringify(payload));

      const response = await api.put(`/products/${product._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ Product updated successfully!");
      console.log("Updated:", response.data);
    } catch (error) {
      console.error("Error updating product:", error);
      alert(
        "❌ Failed to update product: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const isBothSelected =
    product.displayOn.includes("web") && product.displayOn.includes("app");

  const categoryOptions = categories.map((cat) => ({
    value: cat._id,
    label: cat.categoryName,
  }));

  const selectedRelatedCategories = categoryOptions.filter((option) =>
    product.relatedCategories.includes(option.value)
  );

  const selectedCategories = categoryOptions.filter((option) =>
    product.categories.includes(option.value)
  );

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-primary-50">
      <div className="">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-300">
          <h1 className="text-lg font-medium mb-6 whitespace-nowrap">
            Add Product
          </h1>

          <form onSubmit={handleSubmit} className="space-y-8 text-sm">
            {/* Moved Product Display Section inside the form */}
            <div className="p-4 border border-gray-300 rounded-lg bg-gray-50 space-y-4 mb-8">
              <h2 className="font-medium text-gray-700">
                Product Display Options
              </h2>
              <p>Select where this product will be visible:</p>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value="web"
                    checked={product.displayOn.includes("web")}
                    onChange={() => handleDisplayChange("web")}
                  />
                  <span>Web</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value="app"
                    checked={product.displayOn.includes("app")}
                    onChange={() => handleDisplayChange("app")}
                  />
                  <span>App</span>
                </label>
                <button
                  type="button"
                  onClick={handleBothDisplayChange}
                  className={`px-4 py-2 text-sm rounded transition-colors ${
                    isBothSelected
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {isBothSelected ? "Unselect Both" : "Select Both"}
                </button>
              </div>
            </div>

            {/* Promotions */}
            <div className="p-4 border border-gray-300 rounded-lg bg-gray-50 space-y-4">
              <label className="block font-medium text-gray-700">
                Product Promotions
              </label>
              <div className="space-y-2">
                {[
                  { value: "new_arrival", label: "New Arrivals" },
                  // { value: "super_deal", label: "Super Deal" },
                  { value: "offers", label: "Offers" },
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

            {/* Main Product Details */}
            <div className="p-4 border border-gray-300 rounded-lg space-y-6 bg-gray-50">
              {/* Product Images and Video */}
              <div className="space-y-4">
                <label className="block font-medium text-gray-700">
                  Product Media (Images & Video)
                </label>
                <div
                  className={`border-2 border-dashed rounded p-4 text-center cursor-pointer transition-colors ${
                    isDragging
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e)}
                >
                  <p>Drag & drop images and a video here, or</p>
                  <label
                    htmlFor="media-upload"
                    className="text-blue-500 underline cursor-pointer"
                  >
                    Click to browse
                  </label>
                  <input
                    id="media-upload"
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={(e) => {
                      const files = Array.from(e.target.files);
                      const images = files.filter((file) =>
                        file.type.startsWith("image/")
                      );
                      const video = files.find((file) =>
                        file.type.startsWith("video/")
                      );
                      if (images.length > 0) handleImageUpload(images);
                      if (video) handleVideoUpload(video);
                    }}
                    className="hidden"
                  />
                </div>
                {imagePreviews.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-medium mb-2">Uploaded Images:</h3>
                    <div className="flex gap-4 flex-wrap">
                      {imagePreviews.map((src, index) => (
                        <div
                          key={index}
                          className="relative w-24 h-24 border border-gray-300 rounded overflow-hidden"
                        >
                          <img
                            src={src}
                            alt={`preview ${index}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeMedia(index, "image")}
                            className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full p-1"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {videoPreview && (
                  <div className="mt-4">
                    <h3 className="font-medium mb-2">Uploaded Video:</h3>
                    <div className="relative w-48 h-32 border border-gray-300 rounded overflow-hidden">
                      <video
                        src={videoPreview}
                        controls
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeMedia(null, "video")}
                        className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full p-1"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="block mb-2 whitespace-nowrap font-medium">
                    Name<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={product.name}
                    onChange={handleProductNameChange}
                    className="border border-gray-300 rounded p-2 w-full"
                    required
                  />
                </div>
                {/* URL Slug/SKU */}
                <div>
                  <label className="block mb-2 whitespace-nowrap font-medium">
                    URL Slug/SKU<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={product.url}
                    onChange={(e) => handleProductChange("url", e.target.value)}
                    className="border border-gray-300 rounded p-2 w-full"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Brand */}
                <div>
                  <label className="block mb-2 whitespace-nowrap">
                    Brand (optional)
                  </label>
                  <input
                    type="text"
                    value={product.brand}
                    onChange={(e) =>
                      handleProductChange("brand", e.target.value)
                    }
                    className="border border-gray-300 rounded p-2 w-full"
                  />
                </div>
                {/* Category */}
                <div>
                  <label className="block mb-2 whitespace-nowrap font-medium">
                    Category<span className="text-red-500">*</span>
                  </label>
                  <Select
                    isMulti
                    name="relatedCategories"
                    options={categoryOptions}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    value={selectedCategories}
                    onChange={handleCategoriesChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {/* Material */}
                <div>
                  <label className="block mb-2 whitespace-nowrap">
                    Material (optional)
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
                {/* Gender */}
                <div>
                  <label className="block mb-2 whitespace-nowrap">
                    Gender<span className="text-red-500">*</span>
                  </label>
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
              </div>
              <div className="grid grid-cols-2 gap-4">
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
                {/* New Redirect URL */}
                <div>
                  <label className="block mb-2 whitespace-nowrap">
                    Redirect URL
                  </label>
                  <input
                    type="text"
                    value={product.redirectUrl}
                    onChange={(e) =>
                      handleProductChange("redirectUrl", e.target.value)
                    }
                    className="border border-gray-300 rounded p-2 w-full"
                  />
                </div>
              </div>
              {/* Related Categories */}
              <div>
                <label className="block mb-2 whitespace-nowrap">
                  Related Categories
                </label>
                <Select
                  isMulti
                  name="relatedCategories"
                  options={categoryOptions}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  value={selectedRelatedCategories}
                  onChange={handleRelatedCategoriesChange}
                />
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
              {/* Top-level Specifications */}
              <div>
                <label className="block mb-2 whitespace-nowrap">
                  Top-Level Specifications
                </label>
                {product.specifications.map((spec, sIndex) => (
                  <div key={sIndex} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Key"
                      value={spec.key}
                      onChange={(e) =>
                        handleProductSpecChange(sIndex, "key", e.target.value)
                      }
                      className="border border-gray-300 rounded p-2 flex-1"
                    />
                    <input
                      type="text"
                      placeholder="Value"
                      value={spec.value}
                      onChange={(e) =>
                        handleProductSpecChange(sIndex, "value", e.target.value)
                      }
                      className="border border-gray-300 rounded p-2 flex-1"
                    />
                    {product.specifications.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeProductSpec(sIndex)}
                        className="text-red-500 whitespace-nowrap"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addProductSpec}
                  className="text-blue-500 whitespace-nowrap"
                >
                  + Add Top-Level Specification
                </button>
              </div>
              {/* Additional Tabs (Dynamic Key-Value) */}
              <div>
                <label className="block mb-2 whitespace-nowrap">
                  Additional Tabs
                </label>
                {product.keyFeatures.map((feature, fIndex) => (
                  <div key={fIndex} className="flex gap-2 mb-2">
                    <div className="flex-1 flex-col flex">
                      <div className="flex items-center">
                        <SquarePen className="h-4 w-4 text-red-500" />
                        <input
                          type="text"
                          placeholder="Key"
                          value={feature.key}
                          onChange={(e) =>
                            handleKeyFeatureChange(
                              fIndex,
                              "key",
                              e.target.value
                            )
                          }
                          className="p-2 border-none outline-none focus:ring-0 focus:outline-none"
                        />
                      </div>
                      <textarea
                        placeholder="Value"
                        value={feature.value}
                        onChange={(e) =>
                          handleKeyFeatureChange(
                            fIndex,
                            "value",
                            e.target.value
                          )
                        }
                        className="border border-gray-300 rounded p-2"
                        rows="1"
                      />
                    </div>
                    {product.keyFeatures.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeKeyFeature(fIndex)}
                        className="text-red-500 whitespace-nowrap"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addKeyFeature}
                  className="text-blue-500 whitespace-nowrap"
                >
                  + Add Key Feature
                </button>
              </div>
              {/* Meta Data Section */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-700">
                  Meta Data for SEO (optional)
                </h3>
                {/* Meta Title */}
                <div>
                  <label className="block mb-2 whitespace-nowrap">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    value={product.metaTitle}
                    onChange={(e) =>
                      handleProductChange("metaTitle", e.target.value)
                    }
                    className="border border-gray-300 rounded p-2 w-full"
                  />
                </div>
                {/* Meta Description */}
                <div>
                  <label className="block mb-2 whitespace-nowrap">
                    Meta Description
                  </label>
                  <textarea
                    value={product.metaDescription}
                    onChange={(e) =>
                      handleProductChange("metaDescription", e.target.value)
                    }
                    className="border border-gray-300 rounded p-2 w-full"
                  />
                </div>
                {/* Meta Keywords */}
                <div>
                  <label className="block mb-2 whitespace-nowrap">
                    Keywords (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={product.metaKeywords}
                    onChange={(e) =>
                      handleProductChange("metaKeywords", e.target.value)
                    }
                    className="border border-gray-300 rounded p-2 w-full"
                  />
                </div>
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
                {/* Variant Color */}
                <div>
                  <label className="block mb-2 whitespace-nowrap">
                    Color<span className="text-red-500">*</span>
                  </label>
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
                {/* Image Selection for Variant */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-700">
                    Select Images for this Variant (max 4)
                  </h3>
                  {imagePreviews.length > 0 ? (
                    <div className="space-y-4">
                      {/* Main Image Selection */}
                      <div>
                        <label className="block mb-2 whitespace-nowrap">
                          Main Image (required)
                        </label>
                        <div className="flex gap-2 flex-wrap">
                          {imagePreviews.map((src, index) => (
                            <div
                              key={index}
                              onClick={() => {
                                handleVariantChange(
                                  vIndex,
                                  "mainImageIndex",
                                  index
                                );
                                const updatedSelected =
                                  variant.selectedImages.filter(
                                    (imgIndex) => imgIndex !== index
                                  );
                                handleVariantChange(
                                  vIndex,
                                  "selectedImages",
                                  updatedSelected
                                );
                              }}
                              className={`relative w-24 h-24 border-2 rounded overflow-hidden cursor-pointer ${
                                variant.mainImageIndex === index
                                  ? "border-blue-500 ring-2 ring-blue-500"
                                  : "border-gray-300"
                              }`}
                            >
                              <img
                                src={src}
                                alt={`image ${index}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                      {/* Additional Images */}
                      <div>
                        <label className="block mb-2 whitespace-nowrap">
                          Additional Images (select up to 3)
                        </label>
                        <div className="flex gap-2 flex-wrap">
                          {imagePreviews.map((src, index) => (
                            <div
                              key={index}
                              onClick={() => {
                                if (variant.mainImageIndex === index) return;
                                const isSelected =
                                  variant.selectedImages.includes(index);
                                let newSelected = [...variant.selectedImages];
                                if (isSelected) {
                                  newSelected = newSelected.filter(
                                    (i) => i !== index
                                  );
                                } else if (newSelected.length < 3) {
                                  newSelected.push(index);
                                }
                                handleVariantChange(
                                  vIndex,
                                  "selectedImages",
                                  newSelected
                                );
                              }}
                              className={`relative w-24 h-24 border-2 rounded overflow-hidden cursor-pointer ${
                                variant.selectedImages.includes(index)
                                  ? "border-green-500 ring-2 ring-green-500"
                                  : "border-gray-300"
                              } ${
                                variant.mainImageIndex === index
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                            >
                              <img
                                src={src}
                                alt={`image ${index}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500">
                      Please upload product images first.
                    </p>
                  )}
                </div>
                {/* Dynamic Age Groups */}
                <div>
                  <h3 className="font-medium text-gray-700">
                    Age Group & Pricing Details
                  </h3>
                  {variant.ageGroups.map((ageGroup, ageIndex) => (
                    <div
                      key={ageIndex}
                      className="p-3 border border-gray-200 rounded-md my-4 space-y-4 bg-white"
                    >
                      <div className="flex justify-between items-center">
                        <h4 className="font-normal text-gray-600">
                          Age Group {ageIndex + 1}
                        </h4>
                        {variant.ageGroups.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeAgeGroup(vIndex, ageIndex)}
                            className="text-red-500"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                        {/* Age Group */}
                        <div>
                          <label className="block mb-2 whitespace-nowrap">
                            Age Group<span className="text-red-500">*</span>
                          </label>
                          <select
                            value={ageGroup.ageGroup}
                            onChange={(e) =>
                              handleAgeGroupChange(
                                vIndex,
                                ageIndex,
                                "ageGroup",
                                e.target.value
                              )
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
                        {[
                          { label: "Sale Price*", field: "price" },
                          { label: "MRP*", field: "cutPrice" },
                        ].map(({ label, field }) => (
                          <div key={field}>
                            <label className="block mb-2 whitespace-nowrap">
                              {label}
                            </label>
                            <input
                              type="number"
                              value={ageGroup[field]}
                              onChange={(e) =>
                                handleAgeGroupChange(
                                  vIndex,
                                  ageIndex,
                                  field,
                                  e.target.value
                                )
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
                            value={ageGroup.discount}
                            readOnly
                            className="border border-gray-300 rounded p-2 w-full bg-gray-100"
                          />
                        </div>
                        <div>
                          <label className="block mb-2 whitespace-nowrap">
                            Stock Quantity
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            value={ageGroup.stock}
                            onChange={(e) =>
                              handleAgeGroupChange(
                                vIndex,
                                ageIndex,
                                "stock",
                                e.target.value
                              )
                            }
                            className="border border-gray-300 rounded p-2 w-full"
                          />
                        </div>
                        {/* Tax field */}
                        <div>
                          <label className="block mb-2 whitespace-nowrap">
                            Tax (%)
                          </label>
                          <select
                            value={ageGroup.tax}
                            onChange={(e) =>
                              handleAgeGroupChange(
                                vIndex,
                                ageIndex,
                                "tax",
                                e.target.value
                              )
                            }
                            className="border border-gray-300 rounded p-2 w-full"
                          >
                            <option value="">No Tax</option>
                            <option value="5">5%</option>
                            <option value="12">12%</option>
                            <option value="18">18%</option>
                            <option value="28">28%</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addAgeGroup(vIndex)}
                    className="text-blue-500 mt-2"
                  >
                    + Add Age Group
                  </button>
                </div>
                {/* Specifications */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block whitespace-nowrap">
                      Specifications
                    </label>
                    {vIndex > 0 && (
                      <button
                        type="button"
                        onClick={() => copySpecsFromAbove(vIndex)}
                        className="text-sm text-blue-500 underline"
                      >
                        Same as Above
                      </button>
                    )}
                  </div>
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
