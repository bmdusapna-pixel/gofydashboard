import React, { useState, useRef, useEffect } from "react";
import {
  EllipsisVertical,
  Eye,
  Pencil,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import api from "../../api/axios";
import CategoryModalTable from "./CategoryModalTable";

const collectionTableHeaders = [
  { title: "Sr No.", _id: "srNo" },
  { title: "Collection ID", _id: "collectionId" },
  { title: "Collection Image", _id: "collectionImage" },
  { title: "Collection Name", _id: "collectionName" },
  { title: "Number of Categories", _id: "numberOfCategories" },
  { title: "Status", _id: "status" }, // <-- new column
  { title: "Action", _id: "action" },
];

const Collections = () => {
  const [collections, setCollections] = useState([]);
  const [categories, setCategories] = useState([]);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const dropdownRef = useRef(null);
  const itemsPerPage = 5;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCollectionId, setSelectedCollectionId] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const result = await api.get("/collections");
        setCollections(result.data.collections);
        const cat = await api.get("/categories");
        setCategories(cat.data.categories);
      } catch (error) {
        console.log(error);
      }
    };
    fetch();
  }, []);

  console.log("collections", collections);
  console.log("categories", categories);

  const toggleDropdown = (id) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleView = (collectionName, collectionId) => {
    console.log(`Viewing details for collection: ${collectionName}`);
    console.log(`Viewing details for collectionId: ${collectionId}`);
    setSelectedCollectionId(collectionId);
    setIsModalOpen(true);

    setOpenDropdownId(null);
  };

  const handleEdit = (collectionName) => {
    console.log(`Editing collection: ${collectionName}`);
    setOpenDropdownId(null);
  };

  const handleDelete = (collectionName) => {
    console.log(`Deleting collection: ${collectionName}`);
    setOpenDropdownId(null);
  };

  const handleToggleStatus = async (collection) => {
    try {
      const newStatus = collection.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

      const res = await api.put(`/collections/${collection.collectionId}`, {
        status: newStatus,
      });

      // Update state locally without refetch
      setCollections((prev) =>
        prev.map((col) =>
          col.collectionId === collection.collectionId
            ? { ...col, status: newStatus }
            : col
        )
      );

      setOpenDropdownId(null);
      console.log(res.data.message);
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };

  const getFilteredCollections = () => {
    return collections;
  };

  const filteredCollections = getFilteredCollections();
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCollections = filteredCollections.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredCollections.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      setOpenDropdownId(null);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-primary-50">
      <div className="">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-primary-100 flex flex-col gap-5">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <h2 className="text-base sm:text-lg font-semibold text-gray-700">
              Product Collections
            </h2>
            <div className="flex items-center gap-4">
              <button className="cursor-pointer bg-red-100 flex items-center hover:bg-red-200 text-red-700 py-2 px-4 rounded-md shadow-sm transition-colors duration-200">
                <Plus className="w-5 h-5" />
                <span className="text-sm font-medium">Add New Collection</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-lg border border-primary-100">
            <table className="min-w-full divide-y divide-primary-100">
              <thead className="bg-gray-50">
                <tr>
                  {collectionTableHeaders.map((item) => (
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
                {currentCollections.length > 0 ? (
                  currentCollections.map((collection, index) => (
                    <tr
                      key={collection._id}
                      className="hover:bg-gray-50 transition duration-150 ease-in-out"
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {indexOfFirstItem + index + 1}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                        {collection.collectionId}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                        <img
                          src={collection.imageUrl}
                          alt=""
                          className="h-20 w-20 object-cover rounded-md"
                        />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                        {collection.collectionName}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {
                         categories.filter(p => p.collectionId?._id === collection._id).length
                        }
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            collection.status === "ACTIVE"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {collection.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap relative">
                        <button
                          className="flex cursor-pointer items-center justify-center w-6 h-6 focus:outline-none focus:ring-1 focus:ring-gray-200 rounded-full"
                          onClick={() =>
                            toggleDropdown(collection.collectionId)
                          }
                          title="More Actions"
                        >
                          <EllipsisVertical className="w-4 h-4 text-gray-500" />
                        </button>
                        {openDropdownId === collection.collectionId && (
                          <div
                            ref={dropdownRef}
                            className="absolute right-0 w-36 bg-white rounded-md shadow-lg z-10 border border-primary-100"
                          >
                            <div className="flex flex-col w-full" role="menu">
                              <button
                                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                                onClick={() =>
                                  handleView(
                                    collection.collectionName,
                                    collection._id
                                  )
                                }
                              >
                                <Eye className="w-4 h-4 text-blue-500" />
                                <span>View</span>
                              </button>
                              <button
                                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                                onClick={() =>
                                  handleEdit(collection.collectionName)
                                }
                              >
                                <Pencil className="w-4 h-4 text-yellow-500" />
                                <span>Edit</span>
                              </button>
                              <button
                                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                                onClick={() => handleToggleStatus(collection)}
                              >
                                {collection.status === "ACTIVE" ? (
                                  <XCircle className="text-red-500 w-4 h-4" />
                                ) : (
                                  <CheckCircle className="text-green-500 w-4 h-4" />
                                )}
                                <span>
                                  {collection.status === "ACTIVE"
                                    ? "Deactivate"
                                    : "Activate"}
                                </span>
                              </button>
                              <button
                                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                                onClick={() =>
                                  handleDelete(collection.collectionName)
                                }
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                                <span>Delete</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-4 py-3 text-center text-sm text-gray-600"
                    >
                      No collections found
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
          {/* Modal */}
          {isModalOpen && selectedCollectionId && (
            <CategoryModalTable
              collectionId={selectedCollectionId}
              onClose={() => setIsModalOpen(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Collections;
