import React, { useState } from "react";
import collections from "../../assets/collections.list.js"; // Import collections data

const AddCategory = ({ onAdd, onCancel }) => {
  // State to hold the new category's data
  const [newCategory, setNewCategory] = useState({
    id: "",
    name: "",
    // productCount is removed as it comes from the backend
    collectionId: "", // Field to hold the selected collection ID
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCategory((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddCategory = () => {
    // Basic validation: ensure required fields are not empty
    if (!newCategory.id || !newCategory.name || !newCategory.collectionId) {
      console.error(
        "Please fill in all required fields (ID, Name, Collection)."
      );
      // In a real app, you'd show a user-friendly error message
      return;
    }

    const categoryToAdd = {
      ...newCategory,
      // productCount will be set by the backend based on actual products linked
      _id: `temp-${Date.now()}`, // Temporary ID for client-side representation
    };

    console.log("Adding New Category:", categoryToAdd);
    // In a real application, you would send this data to your backend API
    if (onAdd) {
      onAdd(categoryToAdd);
    }
    // Optionally, clear the form or navigate back to the Categories list
    setNewCategory({
      id: "",
      name: "",
      // productCount reset, though not a user input
      collectionId: "",
      metaTitle: "",
      metaDescription: "",
      metaKeywords: "",
    });
  };

  const handleCancel = () => {
    console.log("Cancelling New Category Addition");
    if (onCancel) {
      onCancel();
    }
    // Optionally, navigate back to the Categories list
  };

  return (
    <div className="bg-white p-4 sm:p-6 lg:p-8 overflow-y-scroll">
      <div className="max-w-4xl">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-primary-100 flex flex-col gap-5">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-700 whitespace-nowrap">
            Add New Category
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category ID */}
            <div>
              <label
                htmlFor="id"
                className="block text-sm font-medium text-gray-600 mb-1 whitespace-nowrap"
              >
                Category ID
              </label>
              <input
                type="text"
                id="id"
                name="id"
                value={newCategory.id}
                onChange={handleChange}
                placeholder="e.g., CAT001"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-sm text-gray-700 font-normal whitespace-nowrap"
              />
            </div>

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
                  <option key={collection._id} value={collection.id}>
                    {collection.name} ({collection.id})
                  </option>
                ))}
              </select>
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
