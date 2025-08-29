// ActionsDropdown.js
import React, { useRef, useEffect } from "react";

const ActionsDropdown = ({ id, onToggle, onAction, isOpen }) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click is outside the dropdown's container
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        if (isOpen) {
          onToggle(null); // Close the dropdown
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onToggle]); // Re-run effect when the dropdown opens or closes

  return (
    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 relative">
      <div ref={dropdownRef}>
        <button
          className="flex items-center justify-center w-6 h-6 text-gray-600 hover:text-gray-800 transition duration-150 ease-in-out focus:outline-none focus:ring-1 focus:ring-gray-200 focus:ring-opacity-75 rounded-full"
          onClick={() => onToggle(id)}
          title="More Actions"
        >
          <i className="fas fa-ellipsis-h"></i>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg z-10 border border-primary-100">
            <div
              className="py-1"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="options-menu"
            >
              <button
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                role="menuitem"
                onClick={() => onAction("view", id)}
              >
                <i className="fas fa-eye mr-2 text-blue-500"></i>
                View
              </button>
              <button
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                role="menuitem"
                onClick={() => onAction("edit", id)}
              >
                <i className="fas fa-edit mr-2 text-yellow-500"></i>
                Edit
              </button>
              <button
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                role="menuitem"
                onClick={() => onAction("delete", id)}
              >
                <i className="fas fa-trash-alt mr-2 text-red-500"></i>
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </td>
  );
};

export default ActionsDropdown;
