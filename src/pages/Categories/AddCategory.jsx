import React, { useState, useEffect } from "react";
import api from "../../api/axios.js";

const AddCategory = ({ onAdd, onCancel }) => {
  const [collections, setCollections] = useState([]);
  const [newCategory, setNewCategory] = useState({
    name: "",
    collectionId: "",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    image: null,
    bannerImage: null, // New state for the banner image
  });

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await api.get("/collections");
        console.log("Fetched Collections:", response.data);
        setCollections(response.data.collections);
      } catch (error) {
        console.error("Error fetching collections:", error);
      }
    };
    fetchCollections();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files.length > 0) {
      setNewCategory((prev) => ({
        ...prev,
        [name]: files[0], // The name attribute now correctly maps to either 'image' or 'bannerImage'
      }));
    } else {
      setNewCategory((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAddCategory = async () => {
    // Basic validation
    if (
      !newCategory.name ||
      !newCategory.collectionId ||
      !newCategory.metaTitle ||
      !newCategory.metaKeywords ||
      !newCategory.metaDescription ||
      !newCategory.image ||
      !newCategory.bannerImage // Add validation for the new banner image
    ) {
      console.error("Please fill in all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("categoryName", newCategory.name);
    formData.append("collectionId", newCategory.collectionId);
    formData.append("metaTitle", newCategory.metaTitle);
    formData.append("metaKeywords", newCategory.metaKeywords);
    formData.append("metaDescription", newCategory.metaDescription);
    formData.append("categoryImage", newCategory.image);
    formData.append("categoryBannerImage", newCategory.bannerImage); // Append the new banner image

    try {
      const response = await api.post("/categories", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Category added successfully:", response.data);
      if (onAdd) {
        onAdd(response.data);
      }

      setNewCategory({
        name: "",
        collectionId: "",
        metaTitle: "",
        metaDescription: "",
        metaKeywords: "",
        image: null,
        bannerImage: null,
      });
    } catch (error) {
      console.error(
        "Error adding category:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleCancel = () => {
    console.log("Cancelling New Category Addition");
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="flex-1 p-4 bg-primary-50 overflow-y-scroll">
      <div className="max-w-4xl">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-primary-100 flex flex-col gap-5">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-700 whitespace-nowrap">
            Add New Category
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-600 mb-1 whitespace-nowrap"
              >
                Category Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={newCategory.name}
                onChange={handleChange}
                placeholder="e.g., Men's T-Shirts"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-sm text-gray-700 font-normal whitespace-nowrap"
              />
            </div>

            {/* Select Collection */}
            <div>
              <label
                htmlFor="collectionId"
                className="block text-sm font-medium text-gray-600 mb-1 whitespace-nowrap"
              >
                Select Collection
              </label>
              <select
                id="collectionId"
                name="collectionId"
                value={newCategory.collectionId}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-sm text-gray-700 font-normal whitespace-nowrap"
              >
                <option value="">-- Choose a Collection --</option>
                {collections.map((collection) => (
                  <option key={collection._id} value={collection._id}>
                    {collection.collectionName} ({collection.collectionId})
                  </option>
                ))}
              </select>
            </div>

            {/* Category Image */}
            <div>
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-600 mb-1 whitespace-nowrap"
              >
                Category Image
              </label>
              <input
                type="file"
                id="image"
                name="image" // Name is now unique for this input
                accept="image/*"
                onChange={handleChange}
                className="w-full text-sm text-gray-700 font-normal file:cursor-pointer file:rounded-md file:border-0 file:bg-primary-50 file:py-2 file:px-4 file:text-sm file:font-semibold file:text-primary-600 hover:file:bg-primary-100 whitespace-nowrap"
              />
              <p className="text-xs text-gray-500 mt-1 whitespace-nowrap">
                Upload a representative image for the category.
              </p>
            </div>

            {/* Category Banner Image */}
            <div>
              <label
                htmlFor="bannerImage"
                className="block text-sm font-medium text-gray-600 mb-1 whitespace-nowrap"
              >
                Category Banner Image
              </label>
              <input
                type="file"
                id="bannerImage"
                name="bannerImage" // Name is now unique for this input
                accept="image/*"
                onChange={handleChange}
                className="w-full text-sm text-gray-700 font-normal file:cursor-pointer file:rounded-md file:border-0 file:bg-primary-50 file:py-2 file:px-4 file:text-sm file:font-semibold file:text-primary-600 hover:file:bg-primary-100 whitespace-nowrap"
              />
              <p className="text-xs text-gray-500 mt-1 whitespace-nowrap">
                Upload a representative image for the category banner.
              </p>
            </div>

            {/* Meta Details */}
            <h3 className="text-md font-semibold text-gray-700 mt-4 col-span-1 md:col-span-2 whitespace-nowrap">
              SEO Meta Details (Optional)
            </h3>

            {/* Meta Title */}
            <div>
              <label
                htmlFor="metaTitle"
                className="block text-sm font-medium text-gray-600 mb-1 whitespace-nowrap"
              >
                Meta Title
              </label>
              <input
                type="text"
                id="metaTitle"
                name="metaTitle"
                value={newCategory.metaTitle}
                onChange={handleChange}
                placeholder="e.g., Men's T-Shirts - Shop Online"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-sm text-gray-700 font-normal whitespace-nowrap"
                maxLength="60"
              />
              <p className="text-xs text-gray-500 mt-1 whitespace-nowrap">
                Max 60 characters for optimal search engine display.
              </p>
            </div>

            {/* Meta Keywords */}
            <div>
              <label
                htmlFor="metaKeywords"
                className="block text-sm font-medium text-gray-600 mb-1 whitespace-nowrap"
              >
                Meta Keywords
              </label>
              <input
                type="text"
                id="metaKeywords"
                name="metaKeywords"
                value={newCategory.metaKeywords}
                onChange={handleChange}
                placeholder="e.g., t-shirts, men's fashion, casual wear"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-sm text-gray-700 font-normal whitespace-nowrap"
              />
              <p className="text-xs text-gray-500 mt-1 whitespace-nowrap">
                Comma-separated keywords relevant to the category.
              </p>
            </div>

            {/* Meta Description */}
            <div className="col-span-1 md:col-span-2">
              <label
                htmlFor="metaDescription"
                className="block text-sm font-medium text-gray-600 mb-1 whitespace-nowrap"
              >
                Meta Description
              </label>
              <textarea
                id="metaDescription"
                name="metaDescription"
                value={newCategory.metaDescription}
                onChange={handleChange}
                placeholder="e.g., Browse our wide selection..."
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-sm text-gray-700 font-normal resize-y"
                maxLength="160"
              ></textarea>
              <p className="text-xs text-gray-500 mt-1 whitespace-nowrap">
                Max 160 characters for optimal search engine display.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={handleCancel}
              className="cursor-pointer px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors duration-300 ease-in-out whitespace-nowrap"
            >
              Cancel
            </button>
            <button
              onClick={handleAddCategory}
              className="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors duration-300 ease-in-out whitespace-nowrap"
            >
              Add Category
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCategory;
