import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios.js";
// import ageGroups from "../../assets/ageGroups.list.js";

const EditAgeGroup = ({ initialAgeGroup, onSave, onCancel }) => {
  const [editedAgeGroup, setEditedAgeGroup] = useState(
    initialAgeGroup || {
      _id: "",
      id: "",
      ageRange: "",
      image: "https://placehold.co/80x80/CCCCCC/666666?text=Image",
    }
  );
  // State to hold the new image file
  const [newImageFile, setNewImageFile] = useState(null);
  const { ageGroupId } = useParams();

  useEffect(() => {
    const fetchAgeGroup = async () => {
      try {
        const response = await api.get(`/ages/${ageGroupId}`);
        console.log("Fetched age group:", response.data);
        const fetchedData = response.data;
        setEditedAgeGroup({
          _id: fetchedData._id,
          id: fetchedData.id,
          ageRange: fetchedData.ageRange,
          image: fetchedData.image,
        });
      } catch (error) {
        console.error("Error fetching age group:", error);
      }
    };
    if (ageGroupId) {
      fetchAgeGroup();
    }
  }, [ageGroupId]);

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
      // Store the file itself to be sent with FormData
      setNewImageFile(file);

      // Create a local URL for instant image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedAgeGroup((prev) => ({
          ...prev,
          image: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("ageRange", editedAgeGroup.ageRange);

    // Only append the image file if a new one was selected
    if (newImageFile) {
      formData.append("image", newImageFile);
    }

    try {
      const response = await api.put(`/ages/${ageGroupId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Age group updated:", response.data);
      if (onSave) {
        onSave(response.data);
      }
    } catch (error) {
      console.error("Error updating age group:", error);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-primary-50">
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
                src={editedAgeGroup.image}
                alt={editedAgeGroup.ageRange}
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

            {/* Age Group Range */}
            <div>
              <label
                htmlFor="ageRange"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                Age Group Range
              </label>
              <input
                type="text"
                id="ageRange"
                name="ageRange"
                value={editedAgeGroup.ageRange}
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
