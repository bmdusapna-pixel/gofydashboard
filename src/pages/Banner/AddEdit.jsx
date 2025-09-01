import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import dummyBannersData from "../../assets/banners.list.js";

const BannerForm = ({ onSaveBanner }) => {
  const { bannerId } = useParams();
  const navigate = useNavigate();

  // State for the banner form fields
  const [banner, setBanner] = useState({
    id: null,
    title: "",
    description: "",
    imageUrl: "", // This will now be a URL from the server after upload
    displayOn: "web",
  });
  // State to hold the selected image file
  const [imageFile, setImageFile] = useState(null);
  // State for message display
  const [message, setMessage] = useState({ text: "", type: "" });
  // State for the preview URL of the selected image
  const [previewUrl, setPreviewUrl] = useState("");

  // Effect to load banner data if in edit mode
  useEffect(() => {
    if (bannerId) {
      const bannerToEdit = dummyBannersData.find((b) => b.id === bannerId);
      if (bannerToEdit) {
        setBanner(bannerToEdit);
        setPreviewUrl(bannerToEdit.imageUrl);
        setMessage({
          text: `Editing banner: ${bannerToEdit.title}`,
          type: "info",
        });
      } else {
        setMessage({
          text: "Banner not found. Redirecting to Add Banner...",
          type: "error",
        });
        setTimeout(() => navigate("/banner-add-edit"), 2000);
      }
    } else {
      setBanner({
        id: null,
        title: "",
        description: "",
        imageUrl: "",
        displayOn: "web",
      });
      setPreviewUrl("");
    }
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  }, [bannerId, navigate]);

  // Handles input changes for text fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBanner((prev) => ({ ...prev, [name]: value }));
  };

  // Handles file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      // Create a URL for the file to show a local preview
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl("");
    }
  };

  // Handles submitting the form (add or update)
  const handleSubmit = () => {
    // Basic validation
    if (!banner.title.trim() || !banner.description.trim()) {
      setMessage({
        text: "Please fill in all required fields.",
        type: "error",
      });
      return;
    }

    // In a real app, you would upload the 'imageFile' here
    // and receive a new `imageUrl` from the server.
    // For this example, we'll simulate the update.

    let bannerToSave = { ...banner };
    if (!banner.id) {
      // New banner, create an ID and assume a new image URL
      bannerToSave.id =
        Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
      // This is a placeholder for the URL you'd get from a real upload
      bannerToSave.imageUrl = previewUrl;
    } else if (imageFile) {
      // If a new file was selected during edit, update the imageUrl
      // Placeholder for a new URL from a real upload
      bannerToSave.imageUrl = previewUrl;
    }

    onSaveBanner(bannerToSave);

    setMessage({
      text: banner.id
        ? "Banner updated successfully!"
        : "Banner added successfully!",
      type: "success",
    });

    if (!banner.id) {
      setBanner({
        id: null,
        title: "",
        description: "",
        imageUrl: "",
        displayOn: "web",
      });
      setImageFile(null);
      setPreviewUrl("");
    }

    setTimeout(() => {
      setMessage({ text: "", type: "" });
      navigate("/");
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

            {/* Image File Input */}
            <div>
              <label
                htmlFor="imageFile"
                className="block mb-2 whitespace-nowrap"
              >
                Image File
              </label>
              <input
                type="file"
                id="imageFile"
                name="imageFile"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
              {/* Image Preview */}
              {(previewUrl || banner.imageUrl) && (
                <div className="mt-2 w-full h-32 border border-gray-300 rounded-md overflow-hidden flex items-center justify-center bg-gray-100">
                  <img
                    src={previewUrl || banner.imageUrl}
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
              {!previewUrl && !banner.imageUrl && (
                <div className="mt-2 w-full h-32 border border-gray-300 rounded-md overflow-hidden flex items-center justify-center bg-gray-100 text-gray-500">
                  No image selected.
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
