import React, { useState, useEffect } from "react";
import api from "../../api/axios";

const AddColor = () => {
  // State to hold the currently selected color from the picker (hex code)
  const [currentColor, setCurrentColor] = useState("#FFFFFF"); // Default to white
  // State to hold the name entered by the user for the color
  const [colorName, setColorName] = useState("");
  // State to store the list of all saved colors
  // Each color object will have an id, hexCode, rgb, and name representation
  const [savedColors, setSavedColors] = useState([]);
  // State for alert messages (instead of window.alert)
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    const fetchColor = async () => {
      try {
        const response = await api.get("/color/colors");
        setSavedColors(response.data);
      } catch (error) {
        console.error("Error fetching colors:", error);
      }
    };

    fetchColor();
  }, []);

  // Function to convert hex to RGB (for display purposes, optional)
  const hexToRgb = (hex) => {
    let r = 0,
      g = 0,
      b = 0;
    // Handle short hex codes (e.g., #FFF)
    if (hex.length === 4) {
      r = parseInt(hex[1] + hex[1], 16);
      g = parseInt(hex[2] + hex[2], 16);
      b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
      r = parseInt(hex.substring(1, 3), 16);
      g = parseInt(hex.substring(3, 5), 16);
      b = parseInt(hex.substring(5, 7), 16);
    }
    return `rgb(${r}, ${g}, ${b})`;
  };

  // Handles the change in the color picker
  const handleColorChange = (e) => {
    setCurrentColor(e.target.value);
  };

  // Handles the change in the color name input
  const handleColorNameChange = (e) => {
    setColorName(e.target.value);
  };

  // State to track if we're editing an existing color
  const [editingId, setEditingId] = useState(null);

  // Handles adding a new color or updating an existing one
  const handleSaveColor = async () => {
    if (!colorName.trim()) {
      setMessage({ text: "Please enter a color name.", type: "error" });
      return;
    }

    try {
      if (editingId) {
        // Update existing color
        const payload = { name: colorName.trim(), hexCode: currentColor.toUpperCase() };
        const response = await api.put(`/color/colors/${editingId}`, payload);
        const updated = response.data;
        setSavedColors((prev) =>
          prev.map((c) => (c._id === editingId ? { ...c, name: updated.name, hexCode: updated.hexCode } : c))
        );
        setMessage({ text: "Color updated successfully!", type: "success" });
        setEditingId(null);
      } else {
        // Create new color
        const payload = { name: colorName.trim(), hexCode: currentColor.toUpperCase() };
        const response = await api.post("/color/colors", payload);
        setSavedColors((prevColors) => [...prevColors, response.data]);
        setMessage({ text: "Color added successfully!", type: "success" });
      }
      setColorName("");
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    } catch (error) {
      console.error(error);
      setMessage({ text: "An error occurred.", type: "error" });
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    }
  };

  // Prepare form for editing a color
  const handleEdit = (color) => {
    setEditingId(color._id);
    setColorName(color.name || "");
    setCurrentColor(color.hexCode || "#FFFFFF");
    // Optionally scroll to top or focus input
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-primary-50">
      <div className="">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-300">
          <h1 className="text-lg font-medium mb-6 whitespace-nowrap">
            {editingId ? "Edit Color" : "Add New Color"}
          </h1>

          <div className="space-y-6 text-sm p-4 border border-gray-300 rounded-lg bg-gray-50 mb-8">
            <h2 className="font-medium text-gray-700">
              Select Color and Details
            </h2>

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

            {/* Color Picker */}
            <div>
              <label
                htmlFor="colorPicker"
                className="block mb-2 whitespace-nowrap"
              >
                Choose Color
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="color"
                  id="colorPicker"
                  value={currentColor}
                  onChange={handleColorChange}
                  className="w-16 h-16 rounded-md border-2 border-gray-300 cursor-pointer"
                  title="Select a color"
                />
                <span className="text-lg font-mono">
                  {currentColor.toUpperCase()}
                </span>
                <div
                  className="w-16 h-16 rounded-md border border-gray-300 shadow-inner"
                  style={{ backgroundColor: currentColor }}
                  title="Current selected color preview"
                ></div>
              </div>
            </div>

            {/* Color Name Input */}
            <div>
              <label
                htmlFor="colorName"
                className="block mb-2 whitespace-nowrap"
              >
                Color Name
              </label>
              <input
                type="text"
                id="colorName"
                value={colorName}
                onChange={handleColorNameChange}
                placeholder="e.g., Red, Blue, Green"
                className="border border-gray-300 rounded-md p-2 w-full focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Add / Update Color Button */}
            <button
              type="button"
              onClick={handleSaveColor}
              className="bg-blue-600 text-white px-6 py-2 rounded-md whitespace-nowrap hover:bg-blue-700 transition-colors duration-200 shadow-md"
            >
              {editingId ? "Update Color" : "Add Color"}
            </button>
          </div>

          {/* Saved Colors Table */}
          {savedColors.length > 0 && (
            <div className="mt-8 p-4 border border-gray-300 rounded-lg bg-gray-50 shadow-sm">
              <h2 className="font-medium text-gray-700 mb-4">Saved Colors</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hex Code
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Color
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {savedColors.map((color) => (
                      <tr key={color.colorId}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {color.colorId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {color.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {color.hexCode}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div
                            className="w-8 h-8 rounded-full border border-gray-200 shadow-sm"
                            style={{ backgroundColor: color.hexCode }}
                            title={color.hexCode}
                          ></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleEdit(color)}
                            className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddColor;
