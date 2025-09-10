import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios.js";

const bannerTableHeaders = [
  { title: "Sr No.", _id: "srNo" },
  { title: "Image", _id: "image" },
  { title: "Banner Group", _id: "bannerGroup" },
  { title: "Titles", _id: "titles" },
  { title: "Action", _id: "action" },
];

const Banners = () => {
  const [groupedBanners, setGroupedBanners] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  // ✅ Fetch grouped banners from API
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await api.get("/banners/grouped");
        setGroupedBanners(res.data);
      } catch (err) {
        console.error("Error fetching banners:", err);
      }
    };
    fetchBanners();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentGroups = groupedBanners.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(groupedBanners.length / itemsPerPage);

  const handleEdit = (bannerId) => {
    navigate(`/banner-add-edit/${bannerId}`);
  };

  const handleDelete = async (bannerId) => {
    if (!window.confirm("Are you sure you want to delete this banner?")) return;

    try {
      await api.delete(`/banners/${bannerId}`);
      setGroupedBanners((prev) =>
        prev
          .map((group) => ({
            ...group,
            banners: group.banners.filter((b) => b._id !== bannerId),
          }))
          .filter((group) => group.banners.length > 0)
      );
    } catch (err) {
      console.error("Error deleting banner:", err);
    }
  };

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-primary-50">
      <div className="">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-primary-100 flex flex-col gap-5">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <h2 className="text-base sm:text-lg font-semibold text-gray-700">
              Banners
            </h2>
            <div className="flex items-center gap-4">
              <Link
                to="/banner-add-edit"
                className="cursor-pointer bg-red-100 flex items-center hover:bg-red-200 text-red-700 py-2 px-4 rounded-md shadow-sm transition-colors duration-200"
              >
                <Plus className="w-5 h-5" />
                <span className="text-sm font-medium">Add New Banner</span>
              </Link>
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
                {currentGroups.length > 0 ? (
                  currentGroups.map((group) => (
                    <React.Fragment key={group._id}>
                      {/* Group Header Row */}
                      <tr className="bg-gray-100">
                        <td
                          colSpan="7"
                          className="px-4 py-2 font-semibold text-gray-700"
                        >
                          {group._id} ({group.banners.length})
                        </td>
                      </tr>

                      {/* Each Banner in Group */}
                      {group.banners.map((banner, index) => (
                        <tr
                          key={banner._id}
                          className="hover:bg-gray-50 transition duration-150 ease-in-out"
                        >
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {index + 1}
                          </td>
                          <td className="px-4 py-3 flex gap-2">
                            {/* Web Image */}
                            <div className="flex flex-col items-center">
                              <img
                                src={banner.webImageUrl}
                                alt={`${banner.title} - Web`}
                                className="w-16 h-16 object-cover rounded-md border border-primary-100"
                              />
                              <span className="text-xs text-gray-500 mt-1">
                                Web
                              </span>
                            </div>
                            {/* Mobile Image */}
                            <div className="flex flex-col items-center">
                              <img
                                src={banner.appImageUrl}
                                alt={`${banner.title} - Mobile`}
                                className="w-16 h-16 object-cover rounded-md border border-primary-100"
                              />
                              <span className="text-xs text-gray-500 mt-1">
                                Mobile
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-800">
                            {banner.title}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
                            {banner.description}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {banner.isActive ? (
                              <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-medium">
                                Active
                              </span>
                            ) : (
                              <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-xs font-medium">
                                Inactive
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <button
                                className="text-yellow-600 hover:text-yellow-800 transition-colors duration-200"
                                onClick={() => handleEdit(banner._id)}
                                title="Edit"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                className="text-red-600 hover:text-red-800 transition-colors duration-200"
                                onClick={() => handleDelete(banner._id)}
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
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
