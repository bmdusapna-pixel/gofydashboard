import React, { useState, useEffect } from "react";
import { Pencil, Upload } from "lucide-react";
import api from "../../api/axios.js";

export default function BannerDashboard() {
  const [loginBanner, setLoginBanner] = useState(null);
  const [logoutBanner, setLogoutBanner] = useState(null);
  const [loading, setLoading] = useState(true);

  // Editing states
  const [editing, setEditing] = useState({
    login: false,
    logout: false,
  });

  // Local states for editing fields
  const [loginForm, setLoginForm] = useState({
    openDelay: "",
    closeDelay: "",
    imageFile: null,
    preview: "",
  });

  const [logoutForm, setLogoutForm] = useState({
    openDelay: "",
    closeDelay: "",
    imageFile: null,
    preview: "",
  });

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await api.get("/user/banner");
        const { loginBanner, logoutBanner } = res.data;

        setLoginBanner(loginBanner);
        setLogoutBanner(logoutBanner);

        setLoginForm({
          openDelay: loginBanner?.openDelay || "",
          closeDelay: loginBanner?.closeDelay || "",
          imageFile: null,
          preview: loginBanner?.image || "",
        });

        setLogoutForm({
          openDelay: logoutBanner?.openDelay || "",
          closeDelay: logoutBanner?.closeDelay || "",
          imageFile: null,
          preview: logoutBanner?.image || "",
        });
      } catch (err) {
        console.error("Error fetching banners:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (type === "login") {
      setLoginForm((prev) => ({
        ...prev,
        imageFile: file,
        preview: URL.createObjectURL(file),
      }));
    } else {
      setLogoutForm((prev) => ({
        ...prev,
        imageFile: file,
        preview: URL.createObjectURL(file),
      }));
    }
  };

  const handleUpdate = async (type) => {
    const formData = new FormData();
    const form = type === "login" ? loginForm : logoutForm;

    formData.append("openDelay", form.openDelay);
    formData.append("closeDelay", form.closeDelay);
    if (form.imageFile) formData.append("image", form.imageFile);
    formData.append("type", type); // To tell backend which banner to update

    try {
      await api.put("/user/banner", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert(`${type === "login" ? "Login" : "Logout"} banner updated!`);
      setEditing((prev) => ({ ...prev, [type]: false }));
    } catch (err) {
      console.error("Error updating banner:", err);
      alert("Failed to update banner");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Loading banners...</p>
      </div>
    );

  // 🔹 Reusable section renderer
  const renderBannerSection = (title, type, form, isEditing) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-primary-100 flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h2 className="text-base sm:text-lg font-semibold text-gray-700">
          {title}
        </h2>
        {!isEditing && (
          <button
            onClick={() => setEditing((prev) => ({ ...prev, [type]: true }))}
            className="flex items-center gap-2 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-md hover:bg-yellow-200 transition-colors duration-200"
          >
            <Pencil className="w-4 h-4" />
            <span className="text-sm font-medium">Edit Banner</span>
          </button>
        )}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Image */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-full max-w-sm border border-primary-100 rounded-lg overflow-hidden">
            <img
              src={form.preview || "/placeholder-image.png"}
              alt={`${title} Preview`}
              className="w-full object-cover h-64"
            />
          </div>

          {isEditing && (
            <label className="cursor-pointer flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-md transition">
              <Upload className="w-4 h-4" />
              <span className="text-sm">Upload New Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, type)}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Fields */}
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Open Delay (in seconds)
            </label>
            <input
              type="number"
              value={form.openDelay}
              onChange={(e) =>
                type === "login"
                  ? setLoginForm((prev) => ({
                      ...prev,
                      openDelay: e.target.value,
                    }))
                  : setLogoutForm((prev) => ({
                      ...prev,
                      openDelay: e.target.value,
                    }))
              }
              disabled={!isEditing}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-200 focus:border-green-300 disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Close Delay (in seconds)
            </label>
            <input
              type="number"
              value={form.closeDelay}
              onChange={(e) =>
                type === "login"
                  ? setLoginForm((prev) => ({
                      ...prev,
                      closeDelay: e.target.value,
                    }))
                  : setLogoutForm((prev) => ({
                      ...prev,
                      closeDelay: e.target.value,
                    }))
              }
              disabled={!isEditing}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-200 focus:border-green-300 disabled:bg-gray-100"
            />
          </div>

          {isEditing && (
            <div className="flex gap-3 mt-2">
              <button
                onClick={() => handleUpdate(type)}
                className="bg-green-100 text-green-700 px-4 py-2 rounded-md hover:bg-green-200 transition-colors text-sm font-medium"
              >
                Save Changes
              </button>
              <button
                onClick={() =>
                  setEditing((prev) => ({ ...prev, [type]: false }))
                }
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-primary-50">
      <div className="flex flex-col gap-8">
        {renderBannerSection("Login Banner", "login", loginForm, editing.login)}
        {renderBannerSection(
          "Logout Banner",
          "logout",
          logoutForm,
          editing.logout
        )}
      </div>
    </div>
  );
}
