import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const sections = [
  "General Settings",
  "Display Settings",
  "SEO Settings",
  "Filters & Layout",
  "Featured Products",
  "Advanced Options",
];

const SettingsPanel = () => {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="w-full space-y-3 p-4">
      {sections.map((section) => (
        <div
          key={section}
          className="border border-gray-300 rounded-xl overflow-hidden shadow-sm bg-white"
        >
          {/* Header */}
          <button
            onClick={() => toggleSection(section)}
            className="w-full flex justify-between items-center px-4 py-3 text-left font-medium text-gray-800 hover:bg-gray-100"
          >
            <span>{section}</span>
            {openSection === section ? (
              <ChevronUp className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            )}
          </button>

          {/* Section Content */}
          {openSection === section && (
            <div className="p-4 border-t border-gray-200 bg-gray-50 text-sm text-gray-600 space-y-4">
              {section === "General Settings" && (
                <>
                  <div>
                    <label className="block text-gray-700 mb-1">
                      Site Title
                    </label>
                    <input
                      type="text"
                      placeholder="My E-Commerce Store"
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">Tagline</label>
                    <input
                      type="text"
                      placeholder="Best deals at your fingertips"
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">
                      Primary Color
                    </label>
                    <input
                      type="color"
                      defaultValue="#00BBAE"
                      className="w-16 h-10 p-1 border border-gray-300 rounded-lg"
                    />
                  </div>
                </>
              )}

              {section === "Display Settings" && (
                <>
                  <div>
                    <label className="block text-gray-700 mb-1">
                      Products per Page
                    </label>
                    <input
                      type="number"
                      defaultValue={12}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">
                      Default Layout
                    </label>
                    <select className="w-full p-2 border border-gray-300 rounded-lg">
                      <option>Grid</option>
                      <option>List</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">
                      Show Out-of-Stock Items?
                    </label>
                    <select className="w-full p-2 border border-gray-300 rounded-lg">
                      <option>Yes</option>
                      <option>No</option>
                    </select>
                  </div>
                </>
              )}

              {section === "SEO Settings" && (
                <>
                  <div>
                    <label className="block text-gray-700 mb-1">
                      Meta Title
                    </label>
                    <input
                      type="text"
                      placeholder="Buy Electronics Online | My Store"
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">
                      Meta Description
                    </label>
                    <textarea
                      placeholder="Shop latest mobiles, laptops, and accessories at best prices."
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">Keywords</label>
                    <input
                      type="text"
                      placeholder="electronics, mobile, laptop, online shopping"
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </>
              )}

              {section === "Filters & Layout" && (
                <>
                  <div>
                    <label className="block text-gray-700 mb-1">
                      Enable Category Filter
                    </label>
                    <select className="w-full p-2 border border-gray-300 rounded-lg">
                      <option>Yes</option>
                      <option>No</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">
                      Enable Price Filter
                    </label>
                    <select className="w-full p-2 border border-gray-300 rounded-lg">
                      <option>Yes</option>
                      <option>No</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">
                      Default Sorting
                    </label>
                    <select className="w-full p-2 border border-gray-300 rounded-lg">
                      <option>Relevance</option>
                      <option>Price: Low to High</option>
                      <option>Price: High to Low</option>
                      <option>Newest First</option>
                    </select>
                  </div>
                </>
              )}

              {section === "Featured Products" && (
                <>
                  <div>
                    <label className="block text-gray-700 mb-1">
                      Featured Product IDs
                    </label>
                    <input
                      type="text"
                      placeholder="123, 456, 789"
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">
                      Number of Featured Items
                    </label>
                    <input
                      type="number"
                      defaultValue={5}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">
                      Show Featured on Home?
                    </label>
                    <select className="w-full p-2 border border-gray-300 rounded-lg">
                      <option>Yes</option>
                      <option>No</option>
                    </select>
                  </div>
                </>
              )}

              {section === "Advanced Options" && (
                <>
                  <div>
                    <label className="block text-gray-700 mb-1">
                      Enable Wishlist
                    </label>
                    <select className="w-full p-2 border border-gray-300 rounded-lg">
                      <option>Yes</option>
                      <option>No</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">
                      Enable Product Reviews
                    </label>
                    <select className="w-full p-2 border border-gray-300 rounded-lg">
                      <option>Yes</option>
                      <option>No</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">
                      Enable Lazy Loading for Images
                    </label>
                    <select className="w-full p-2 border border-gray-300 rounded-lg">
                      <option>Yes</option>
                      <option>No</option>
                    </select>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SettingsPanel;
