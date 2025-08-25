import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import dummyBannersData from "../../assets/banners.list.js"; // Import dummy data

const BannerForm = ({ onSaveBanner }) => {
  const { bannerId } = useParams(); // Get bannerId from URL params
  const navigate = useNavigate();

  // State for the banner form fields
  const [banner, setBanner] = useState({
    id: null, // null for new banners, ID for editing
    title: "",
    description: "",
    imageUrl: "",
    displayOn: "web",
  });
  // State for message display
  const [message, setMessage] = useState({ text: "", type: "" });

  // Effect to load banner data if in edit mode
  useEffect(() => {
    if (bannerId) {
      // Find the banner from the dummy data using the ID from params
      const bannerToEdit = dummyBannersData.find((b) => b.id === bannerId);
      if (bannerToEdit) {
        setBanner(bannerToEdit);
        setMessage({
          text: `Editing banner: ${bannerToEdit.title}`,
          type: "info",
        });
      } else {
        setMessage({
          text: "Banner not found. Redirecting to Add Banner...",
          type: "error",
        });
        setTimeout(() => navigate("/banner-add-edit"), 2000); // Redirect if ID not found
      }
    } else {
      // Reset form for adding a new banner
      setBanner({
        id: null,
        title: "",
        description: "",
        imageUrl: "",
        displayOn: "web",
      });
    }
    // Clear message after component mounts or ID changes for a moment
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  }, [bannerId, navigate]); // Re-run effect if bannerId or navigate changes

  // Handles input changes for the form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBanner((prev) => ({ ...prev, [name]: value }));
  };

  // Handles submitting the form (add or update)
  const handleSubmit = () => {
    // Basic validation
    if (
      !banner.title.trim() ||
      !banner.description.trim() ||
      !banner.imageUrl.trim()
    ) {
      setMessage({ text: "Please fill in all banner fields.", type: "error" });
      return;
    }

    let bannerToSave = { ...banner };

    if (!banner.id) {
      // If no ID, it's a new banner, so generate one
      bannerToSave.id =
        Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
    }

    // Call the prop function to save/update the banner in the parent's state
    onSaveBanner(bannerToSave);

    setMessage({
      text: banner.id
        ? "Banner updated successfully!"
        : "Banner added successfully!",
      type: "success",
    });

    // Clear the form after adding, or stay on edit for further changes
    if (!banner.id) {
      setBanner({
        id: null,
        title: "",
        description: "",
        imageUrl: "",
        displayOn: "web",
      });
    }

    setTimeout(() => {
      setMessage({ text: "", type: "" });
      navigate("/"); // Navigate back to the list page after save
    }, 1500);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-primary-50">
      <div className="max-w-xl">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-300">
          <h1 className="text-lg font-medium mb-6 whitespace-nowrap">
            {banner.id ? "Edit Banner" : "Add New Banner"}
          </h1>

          <div className="space-y-6 text-sm p-4 border border-gray-300 rounded-lg bg-gray-50 mb-8">
            {/* Message Box */}
            {message.text && (
              <div
                className={`p-3 rounded-md text-white text-center 
                ${
                  message.type === "error"
                    ? "bg-red-500"
                    : message.type === "success"
                    ? "bg-green-500"
                    : "bg-blue-500"
                }`}
              >
                {message.text}
              </div>
            )}

            {/* Banner ID (visible in edit mode) */}
            {banner.id && (
              <div>
                <label className="block mb-2 whitespace-nowrap">
                  Banner ID
                </label>
                <input
                  type="text"
                  value={banner.id}
                  readOnly
                  className="border border-gray-300 rounded-md p-2 w-full bg-gray-100"
                />
              </div>
            )}

            {/* Banner Title */}
            <div>
              <label htmlFor="title" className="block mb-2 whitespace-nowrap">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={banner.title}
                onChange={handleInputChange}
                placeholder="e.g., Summer Sale"
                className="border border-gray-300 rounded-md p-2 w-full focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Banner Description */}
            <div>
              <label
                htmlFor="description"
                className="block mb-2 whitespace-nowrap"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={banner.description}
                onChange={handleInputChange}
                placeholder="e.g., Up to 50% off on all summer essentials!"
                className="border border-gray-300 rounded-md p-2 w-full focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Image URL */}
            <div>
              <label
                htmlFor="imageUrl"
                className="block mb-2 whitespace-nowrap"
              >
                Image URL
              </label>
              <input
                type="text"
                id="imageUrl"
                name="imageUrl"
                value={banner.imageUrl}
                onChange={handleInputChange}
                placeholder="e.g., https://example.com/banner.jpg"
                className="border border-gray-300 rounded-md p-2 w-full focus:ring-blue-500 focus:border-blue-500"
              />
              {banner.imageUrl && (
                <div className="mt-2 w-full h-32 border border-gray-300 rounded-md overflow-hidden flex items-center justify-center bg-gray-100">
                  <img
                    src={banner.imageUrl}
                    alt="Banner Preview"
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://placehold.co/400x150/e0e0e0/000000?text=Image+Error";
                      e.target.alt = "Image not available";
                    }}
                  />
                </div>
              )}
              {!banner.imageUrl && (
                <div className="mt-2 w-full h-32 border border-gray-300 rounded-md overflow-hidden flex items-center justify-center bg-gray-100 text-gray-500">
                  No image URL provided.
                </div>
              )}
            </div>

            {/* Display On */}
            <div>
              <label
                htmlFor="displayOn"
                className="block mb-2 whitespace-nowrap"
              >
                Display On
              </label>
              <select
                id="displayOn"
                name="displayOn"
                value={banner.displayOn}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md p-2 w-full focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="web">Web</option>
                <option value="mobile">Mobile</option>
              </select>
            </div>

            {/* Save Button */}
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-6 py-2 rounded-md whitespace-nowrap hover:bg-blue-700 transition-colors duration-200 shadow-md"
            >
              {banner.id ? "Update Banner" : "Add Banner"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="ml-2 bg-gray-400 text-white px-6 py-2 rounded-md whitespace-nowrap hover:bg-gray-500 transition-colors duration-200 shadow-md"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerForm;
