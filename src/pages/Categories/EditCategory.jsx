import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios.js";

const EditCategory = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const [collections, setCollections] = useState([]);
  const [category, setCategory] = useState({
    categoryName: "",
    collectionId: "",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    categoryImage: null, // This will hold the existing image URL
    newImage: null, // This will hold the new image file if a user uploads one
    categoryBannerImage: null, // This will hold the existing banner image URL
    newBannerImage: null, // This will hold the new banner image file
    displayOrder: 0,
    isVisible: true,
    visibleFrom: null,
    visibleTo: null,
    homepageTag: null,
    layoutType: 'grid',
    isPinned: false,
    pinOrder: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all collections for the dropdown
        const collectionsResponse = await api.get("/collections");
        setCollections(collectionsResponse.data.collections);

        // Fetch the specific category's data
        const categoryResponse = await api.get(`/categories/${categoryId}`);
        console.log("Fetched Category:", categoryResponse.data);
        const categoryData = categoryResponse.data.category;

        // Populate the state with fetched data
        setCategory({
          categoryName: categoryData.categoryName,
          collectionId: categoryData.collectionId._id,
          metaTitle: categoryData.metaTitle,
          metaDescription: categoryData.metaDescription,
          metaKeywords: categoryData.metaKeywords,
          categoryImage: categoryData.categoryImage,
          categoryBannerImage: categoryData.categoryBannerImage, // Set the existing banner image URL
          newImage: null,
          newBannerImage: null,
          displayOrder: categoryData.displayOrder || 0,
          isVisible: categoryData.isVisible || true,
          visibleFrom: categoryData.visibleFrom || null,
          visibleTo: categoryData.visibleTo || null,
          homepageTag: categoryData.homepageTag || null,
          layoutType: categoryData.layoutType || 'grid',
          isPinned: categoryData.isPinned || false,
          pinOrder: categoryData.pinOrder || 0,
        });

        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load category data.");
        setIsLoading(false);
      }
    };
    fetchData();
  }, [categoryId]);


  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;

    if (type === "checkbox") {
      setCategory((prev) => ({
        ...prev,
        [name]: checked,
      }));
      return;
    }

    if (files && files.length > 0) {
      setCategory((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    } else {
      setCategory((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleUpdateCategory = async () => {
    // Basic validation
    if (!category.categoryName || !category.collectionId) {
      console.error("Category Name and Collection are required.");
      return;
    }

    const formData = new FormData();
    formData.append("categoryName", category.categoryName);
    formData.append("collectionId", category.collectionId);
    formData.append("metaTitle", category.metaTitle);
    formData.append("metaKeywords", category.metaKeywords);
    formData.append("metaDescription", category.metaDescription);
    formData.append("displayOrder", category.displayOrder);
    formData.append("isVisible", category.isVisible);
    formData.append("homepageTag", category.homepageTag);
    formData.append("layoutType", category.layoutType);
    formData.append("isPinned", category.isPinned);
    formData.append("pinOrder", category.pinOrder);

    // Only append the new image if a new one was selected
    if (category.newImage) {
      formData.append("categoryImage", category.newImage);
    }
    // Only append the new banner image if a new one was selected
    if (category.newBannerImage) {
      formData.append("categoryBannerImage", category.newBannerImage);
    }

    try {
      const response = await api.patch(`/categories/${categoryId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Category updated successfully:", response.data);
      // Navigate back to the categories list or a confirmation page
      navigate("/categories/list");
    } catch (err) {
      console.error(
        "Error updating category:",
        err.response ? err.response.data : err.message
      );
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <div className="flex-1 p-4 bg-primary-50 overflow-y-scroll">
      <div className="max-w-4xl">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-primary-100 flex flex-col gap-5">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-700 whitespace-nowrap">
            Edit Category
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category Name */}
            <div>
              <label
                htmlFor="categoryName"
                className="block text-sm font-medium text-gray-600 mb-1 whitespace-nowrap"
              >
                Category Name
              </label>
              <input
                type="text"
                id="categoryName"
                name="categoryName"
                value={category.categoryName}
                onChange={handleChange}
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
                value={category.collectionId}
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

            {/* Existing Image & New Image Upload */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-600 mb-1 whitespace-nowrap">
                Current Category Image
              </label>
              {category.categoryImage && (
                <img
                  src={category.categoryImage}
                  alt="Current Category"
                  className="w-32 h-32 object-cover rounded-md border border-gray-300 mb-2"
                />
              )}
              <input
                type="file"
                id="newImage"
                name="newImage"
                accept="image/*"
                onChange={handleChange}
                className="w-full text-sm text-gray-700 font-normal file:cursor-pointer file:rounded-md file:border-0 file:bg-primary-50 file:py-2 file:px-4 file:text-sm file:font-semibold file:text-primary-600 hover:file:bg-primary-100 whitespace-nowrap"
              />
              <p className="text-xs text-gray-500 mt-1 whitespace-nowrap">
                Upload a new image to replace the existing one.
              </p>
            </div>

            {/* Existing Banner Image & New Banner Image Upload */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-600 mb-1 whitespace-nowrap">
                Current Banner Image
              </label>
              {category.categoryBannerImage && (
                <img
                  src={category.categoryBannerImage}
                  alt="Current Category Banner"
                  className="w-full h-auto object-cover rounded-md border border-gray-300 mb-2"
                />
              )}
              <input
                type="file"
                id="newBannerImage"
                name="newBannerImage"
                accept="image/*"
                onChange={handleChange}
                className="w-full text-sm text-gray-700 font-normal file:cursor-pointer file:rounded-md file:border-0 file:bg-primary-50 file:py-2 file:px-4 file:text-sm file:font-semibold file:text-primary-600 hover:file:bg-primary-100 whitespace-nowrap"
              />
              <p className="text-xs text-gray-500 mt-1 whitespace-nowrap">
                Upload a new banner image to replace the existing one.
              </p>
            </div>

            {/* Meta Details */}
            <h3 className="text-md font-semibold text-gray-700 mt-4 col-span-1 md:col-span-2 whitespace-nowrap">
              SEO Meta Details
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
                value={category.metaTitle}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-sm text-gray-700 font-normal whitespace-nowrap"
                maxLength="60"
              />
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
                value={category.metaKeywords}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-sm text-gray-700 font-normal whitespace-nowrap"
              />
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
                value={category.metaDescription}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-sm text-gray-700 font-normal resize-y"
                maxLength="160"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Display Order
              </label>
              <input
                type="number"
                name="displayOrder"
                value={category.displayOrder}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md text-sm"
              />
            </div>

            <div className="flex items-center gap-2 mt-6">
              <input
                type="checkbox"
                name="isVisible"
                checked={category.isVisible}
                onChange={handleChange}
              />
              <label className="text-sm text-gray-700">Visible on Website</label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Homepage Tag
              </label>
              <select
                name="homepageTag"
                value={category.homepageTag}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md text-sm"
              >
                <option value="None">None</option>
                <option value="Trending">Trending</option>
                <option value="Bestseller">Bestseller</option>
                <option value="New">New</option>
                <option value="Featured">Featured</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Category Layout
              </label>
              <select
                name="layoutType"
                value={category.layoutType}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md text-sm"
              >
                <option value="grid">Grid</option>
                <option value="list">List</option>
                <option value="banner-first">Banner First</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isPinned"
                checked={category.isPinned}
                onChange={handleChange}
              />
              <label className="text-sm text-gray-700">Pin this Category</label>
            </div>

            {category.isPinned && (
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Pin Order
                </label>
                <input
                  type="number"
                  name="pinOrder"
                  value={category.pinOrder}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md text-sm"
                />
              </div>
            )}

          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={() => navigate("/categories")}
              className="cursor-pointer px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors duration-300 ease-in-out whitespace-nowrap"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateCategory}
              className="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-300 ease-in-out whitespace-nowrap"
            >
              Update Category
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCategory;
