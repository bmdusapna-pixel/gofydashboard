import React, { useState, useEffect } from "react";
import ageGroups from "../../assets/ageGroups.list.js";

const EditAgeGroup = ({ initialAgeGroup, onSave, onCancel }) => {
  const [editedAgeGroup, setEditedAgeGroup] = useState(
    initialAgeGroup ||
      ageGroups[0] || {
        _id: "",
        id: "",
        name: "",
        imageUrl: "https://placehold.co/80x80/CCCCCC/666666?text=Image",
      }
  );

  useEffect(() => {
    if (initialAgeGroup) {
      setEditedAgeGroup(initialAgeGroup);
    }
  }, [initialAgeGroup]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedAgeGroup((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedAgeGroup((prev) => ({
          ...prev,
          imageUrl: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave(editedAgeGroup);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="bg-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-md">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-300 flex flex-col gap-5">
          <h2 className="text-base sm:text-lg font-medium text-gray-700">
            Edit Age Group
          </h2>

          <div className="flex flex-col gap-4">
            {/* Image Upload */}
            <div className="flex flex-col items-center gap-2">
              <label
                htmlFor="imageUpload"
                className="text-sm font-medium text-gray-600"
              >
                Current Image
              </label>
              <img
                src={editedAgeGroup.imageUrl}
                alt={editedAgeGroup.name}
                className="w-24 h-24 object-cover rounded-full shadow-sm border border-gray-300"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://placehold.co/80x80/CCCCCC/666666?text=No+Image`;
                }}
              />
              <input
                type="file"
                id="imageUpload"
                name="imageUpload"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                Upload a new image (JPG, PNG, GIF)
              </p>
            </div>

            {/* Age Group ID */}
            <div>
              <label
                htmlFor="id"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                Age Group ID
              </label>
              <input
                type="text"
                id="id"
                name="id"
                value={editedAgeGroup.id}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed text-sm"
              />
            </div>

            {/* Age Group Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                Age Group Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={editedAgeGroup.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-sm"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={handleCancel}
                className="cursor-pointer px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="cursor-pointer px-4 py-2 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors duration-200"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditAgeGroup;
