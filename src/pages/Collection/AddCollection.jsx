import React, { useState } from "react";
import api from "../../api/axios";

const AddCollection = ({ onAdd, onCancel }) => {
  // State to hold the new collection's data
  const [newCollection, setNewCollection] = useState({
    collectionName: "",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
  });

  // State for the selected image files
  const [selectedCollectionImage, setSelectedCollectionImage] = useState(null);
  const [selectedBannerImage, setSelectedBannerImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCollection((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCollectionImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedCollectionImage(e.target.files[0]);
    }
  };

  const handleBannerImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedBannerImage(e.target.files[0]);
    }
  };

  const handleAddCollection = async () => {
    // Basic validation: ensure the required name field is not empty
    if (!newCollection.collectionName) {
      console.error("Please fill in the collection name.");
      return;
    }

    const formData = new FormData();
    formData.append("collectionName", newCollection.collectionName);
    formData.append("metaTitle", newCollection.metaTitle);
    formData.append("metaDescription", newCollection.metaDescription);
    formData.append("metaKeywords", newCollection.metaKeywords);

    // Append both image files if they are selected
    if (selectedCollectionImage) {
      formData.append("collectionImage", selectedCollectionImage);
    }
    if (selectedBannerImage) {
      formData.append("collectionBannerImage", selectedBannerImage);
    }

    try {
      await api.post("/collections", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Collection added successfully!");

      // Clear the form and image states
      setNewCollection({
        collectionName: "",
        metaTitle: "",
        metaDescription: "",
        metaKeywords: "",
      });
      setSelectedCollectionImage(null);
      setSelectedBannerImage(null);

      if (onAdd) {
        onAdd();
      }
    } catch (error) {
      console.error("Error adding collection:", error);
    }
  };

  const handleCancel = () => {
    console.log("Cancelling New Collection Addition");
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="flex-1 overflow-auto p-4 bg-primary-50">
      <div className="max-w-4xl">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-primary-100 flex flex-col gap-5">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-700 whitespace-nowrap">
            Add New Collection
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Collection Name */}
            <div className="col-span-1">
              <label
                htmlFor="collectionName"
                className="block text-sm font-medium text-gray-600 mb-1 whitespace-nowrap"
              >
                Collection Name
              </label>
              <input
                type="text"
                id="collectionName"
                name="collectionName"
                value={newCollection.collectionName}
                onChange={handleChange}
                placeholder="e.g., Summer Essentials"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-sm text-gray-700"
              />
            </div>

            {/* Collection Image Upload */}
            <div className="col-span-1">
              <label
                htmlFor="collectionImage"
                className="block text-sm font-medium text-gray-600 mb-1 whitespace-nowrap"
              >
                Collection Image
              </label>
              <input
                type="file"
                id="collectionImage"
                name="collectionImage"
                accept="image/*"
                onChange={handleCollectionImageChange}
                className="w-full text-sm text-gray-700 font-normal file:cursor-pointer file:rounded-md file:border-0 file:bg-primary-50 file:py-2 file:px-4 file:text-sm file:font-semibold file:text-primary-600 hover:file:bg-primary-100 whitespace-nowrap"
              />
            </div>

            {/* Collection Banner Image Upload */}
            <div className="col-span-1">
              <label
                htmlFor="collectionBannerImage"
                className="block text-sm font-medium text-gray-600 mb-1 whitespace-nowrap"
              >
                Collection Banner Image
              </label>
              <input
                type="file"
                id="collectionBannerImage"
                name="collectionBannerImage"
                accept="image/*"
                onChange={handleBannerImageChange}
                className="w-full text-sm text-gray-700 font-normal file:cursor-pointer file:rounded-md file:border-0 file:bg-primary-50 file:py-2 file:px-4 file:text-sm file:font-semibold file:text-primary-600 hover:file:bg-primary-100 whitespace-nowrap"
              />
            </div>

            {/* --- Meta Details --- */}
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
                value={newCollection.metaTitle}
                onChange={handleChange}
                placeholder="e.g., Summer Collection 2024 - Shop Now!"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-sm text-gray-700"
                maxLength="60"
              />
              <p className="text-xs text-gray-500 mt-1">
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
                value={newCollection.metaKeywords}
                onChange={handleChange}
                placeholder="e.g., summer clothes, beachwear, new arrivals, fashion"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-sm text-gray-700"
              />
              <p className="text-xs text-gray-500 mt-1">
                Comma-separated keywords relevant to the collection.
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
                value={newCollection.metaDescription}
                onChange={handleChange}
                placeholder="e.g., Discover our new summer collection featuring lightweight dresses, sandals, and accessories perfect for the season."
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-sm text-gray-700 resize-y"
                maxLength="160"
              ></textarea>
              <p className="text-xs text-gray-500 mt-1">
                Max 160 characters for optimal search engine display.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={handleCancel}
              className="cursor-pointer px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors duration-300 ease-in-out"
            >
              Cancel
            </button>
            <button
              onClick={handleAddCollection}
              className="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors duration-300 ease-in-out"
            >
              Add Collection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCollection;
