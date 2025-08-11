import React, { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import dummyBanners from "../../assets/banners.list.js"; // Adjust path if necessary

const bannerTableHeaders = [
  { title: "Sr No.", _id: "srNo" },
  { title: "Image", _id: "image" },
  { title: "Banner Title", _id: "bannerTitle" },
  { title: "Description", _id: "description" },
  { title: "Display On", _id: "displayOn" },
  { title: "Action", _id: "action" },
];

const Banners = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const getBanners = () => {
    // No filtering is implemented, so we return the raw data.
    return dummyBanners;
  };

  const banners = getBanners();

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBanners = banners.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(banners.length / itemsPerPage);

  const handleEdit = (bannerId) => {
    console.log(`Editing banner with ID: ${bannerId}`);
  };

  const handleDelete = (bannerId) => {
    console.log(`Deleting banner with ID: ${bannerId}`);
  };

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="bg-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-primary-100 flex flex-col gap-5">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <h2 className="text-base sm:text-lg font-semibold text-gray-700">
              Banners
            </h2>
            <div className="flex items-center gap-4">
              <button className="cursor-pointer bg-red-100 flex items-center hover:bg-red-200 text-red-700 py-2 px-4 rounded-md shadow-sm transition-colors duration-200">
                <Plus className="w-5 h-5" />
                <span className="text-sm font-medium">Add New Banner</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-lg border border-primary-100">
            <table className="min-w-full divide-y divide-primary-100">
              <thead className="bg-gray-50">
                <tr>
                  {bannerTableHeaders.map((item) => (
                    <th
                      key={item._id}
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {item.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-primary-100">
                {currentBanners.length > 0 ? (
                  currentBanners.map((banner, index) => (
                    <tr
                      key={banner.id}
                      className="hover:bg-gray-50 transition duration-150 ease-in-out"
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {indexOfFirstItem + index + 1}
                      </td>
                      <td className="px-4 py-3">
                        <img
                          src={banner.imageUrl}
                          alt={banner.title}
                          className="w-16 h-16 object-cover rounded-md border border-primary-100"
                        />
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800">
                        {banner.title}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
                        {banner.description}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            banner.displayOn === "web"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {banner.displayOn}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            className="text-yellow-600 hover:text-yellow-800 transition-colors duration-200"
                            onClick={() => handleEdit(banner.id)}
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-800 transition-colors duration-200"
                            onClick={() => handleDelete(banner.id)}
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-4 py-3 text-center text-sm text-gray-600"
                    >
                      No banners found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-end items-center gap-2 mt-4">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => paginate(i + 1)}
                  className={`px-3 py-1 text-sm rounded-md ${
                    currentPage === i + 1
                      ? "bg-yellow-200 text-yellow-800"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banners;
