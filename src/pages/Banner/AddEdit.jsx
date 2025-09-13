import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios.js";

const bannerOptions = {
  "hero banner": { web: "1920x600 px", app: "1080x400 px" },
  "offer banner": { web: "1200x400 px", app: "800x300 px" },
  "trending banner": { web: "1000x300 px", app: "600x200 px" },
  "bottom banner": { web: "1920x250 px", app: "1080x250 px" },
};

const BannerForm = () => {
  const { bannerId } = useParams();
  const navigate = useNavigate();

  const [banner, setBanner] = useState({
    id: null,
    bannerName: "",
    title: "",
    description: "",
    webImageUrl: "",
    appImageUrl: "",
    bannerUrl: "",
  });

  const [files, setFiles] = useState({ web: null, app: null });
  const [previews, setPreviews] = useState({ web: "", app: "" });
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    if (bannerId) {
      api
        .get(`/banners/${bannerId}`)
        .then((res) => {
          const b = res.data;
          setBanner({
            id: b._id,
            bannerName: b.bannerName || "",
            title: b.title || "",
            description: b.description || "",
            webImageUrl: b.webImageUrl || "",
            appImageUrl: b.appImageUrl || "",
            bannerUrl: b.bannerUrl || "",
          });
          setPreviews({
            web: b.webImageUrl || "",
            app: b.appImageUrl || "",
          });
          setMessage({
            text: `Editing banner: ${b.bannerName}`,
            type: "info",
          });
        })
        .catch(() => {
          setMessage({ text: "Failed to load banner", type: "error" });
          setTimeout(() => navigate("/banner-add-edit"), 2000);
        });
    }
  }, [bannerId, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBanner((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setFiles((prev) => ({ ...prev, [type]: file }));
      setPreviews((prev) => ({ ...prev, [type]: URL.createObjectURL(file) }));
    }
  };

  const handleSubmit = async () => {
    if (!banner.bannerName.trim() || !banner.title.trim()) {
      setMessage({ text: "Please fill in required fields.", type: "error" });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("bannerName", banner.bannerName);
      formData.append("title", banner.title);
      formData.append("description", banner.description);
      formData.append("bannerUrl", banner.bannerUrl);

      if (files.web) formData.append("webImage", files.web);
      if (files.app) formData.append("appImage", files.app);

      let response;
      if (banner.id) {
        response = await api.put(`/banners/${banner.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMessage({ text: "Banner updated successfully!", type: "success" });
      } else {
        response = await api.post(`/banners`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMessage({ text: "Banner added successfully!", type: "success" });
      }

      if (!banner.id) {
        setBanner({
          id: null,
          bannerName: "",
          title: "",
          description: "",
          webImageUrl: "",
          appImageUrl: "",
          bannerUrl: "",
        });
        setFiles({ web: null, app: null });
        setPreviews({ web: "", app: "" });
      }

      setTimeout(() => {
        setMessage({ text: "", type: "" });
        navigate("/banners");
      }, 1500);
    } catch (err) {
      console.error(err);
      setMessage({ text: "Something went wrong!", type: "error" });
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-primary-50">
      <div className="max-w-3xl">
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

            {/* Banner Type (Dropdown) */}
            <div>
              <label className="block mb-2">Banner Type</label>
              <select
                name="bannerName"
                value={banner.bannerName}
                onChange={handleInputChange}
                disabled={!!banner.id} // disable when editing
                className="border border-gray-300 rounded-md p-2 w-full"
              >
                <option value="">Select Banner Type</option>
                {Object.keys(bannerOptions).map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="block mb-2">Title</label>
              <input
                type="text"
                name="title"
                value={banner.title}
                onChange={handleInputChange}
                placeholder="e.g., Summer Sale"
                className="border border-gray-300 rounded-md p-2 w-full"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block mb-2">Description</label>
              <textarea
                name="description"
                value={banner.description}
                onChange={handleInputChange}
                placeholder="e.g., Up to 50% off"
                className="border border-gray-300 rounded-md p-2 w-full"
              />
            </div>

            {/* Banner URL */}
            <div>
              <label className="block mb-2">Banner URL</label>
              <input
                type="text"
                name="bannerUrl"
                value={banner.bannerUrl}
                onChange={handleInputChange}
                placeholder="https://example.com"
                className="border border-gray-300 rounded-md p-2 w-full"
              />
            </div>

            {/* Web & App Images */}
            {banner.bannerName && (
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2">Web Image</label>
                  <p className="text-xs text-gray-500 mb-1">
                    Required size: {bannerOptions[banner.bannerName]?.web}
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "web")}
                  />
                  {previews.web && (
                    <div className="mt-2 h-32 border border-gray-300 rounded-md overflow-hidden">
                      <img
                        src={previews.web}
                        alt="Web Preview"
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )}
                </div>
                <div>
                  <label className="block mb-2">App Image</label>
                  <p className="text-xs text-gray-500 mb-1">
                    Required size: {bannerOptions[banner.bannerName]?.app}
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "app")}
                  />
                  {previews.app && (
                    <div className="mt-2 h-32 border border-gray-300 rounded-md overflow-hidden">
                      <img
                        src={previews.app}
                        alt="App Preview"
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={handleSubmit}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
              >
                {banner.id ? "Update Banner" : "Add Banner"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/banners")}
                className="bg-gray-400 text-white px-6 py-2 rounded-md hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerForm;
