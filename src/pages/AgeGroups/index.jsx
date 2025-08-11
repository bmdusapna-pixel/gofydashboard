import React, { useState } from "react";
import { Pencil } from "lucide-react"; // Only Pencil icon is needed

// Import mock data for age groups
import ageGroups from "../../assets/ageGroups.list.js"; // Adjust path if necessary

const ageGroupTableHeaders = [
  { title: "Sr No.", _id: "srNo" },
  { title: "Image", _id: "image" },
  { title: "Age Group ID", _id: "ageGroupId" },
  { title: "Age Group Name", _id: "ageGroupName" },
  { title: "Action", _id: "action" },
];

const AgeGroups = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Display 5 items per page for consistency, though all 8 would fit.

  const handleEdit = (ageGroupName) => {
    console.log(`Editing age group: ${ageGroupName}`);
    // Implement your edit logic here, e.g., open a modal, navigate to an edit page.
  };

  const currentAgeGroups = ageGroups; // No filtering needed for fixed age groups

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedAgeGroups = currentAgeGroups.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(currentAgeGroups.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="bg-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5">
            <h2 className="text-base sm:text-lg font-semibold text-gray-700">
              Age Groups
            </h2>
          </div>

          {/* Table Section */}
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {ageGroupTableHeaders.map((item) => (
                    <th
                      key={item._id}
                      className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {item.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedAgeGroups.length > 0 ? (
                  paginatedAgeGroups.map((group, index) => (
                    <tr
                      key={group._id}
                      className="hover:bg-gray-50 transition duration-150 ease-in-out"
                    >
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                        {indexOfFirstItem + index + 1}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <img
                          src={group.imageUrl}
                          alt={group.name}
                          className="w-9 h-9 object-cover rounded-full shadow-sm border border-gray-200"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://placehold.co/80x80/CCCCCC/666666?text=❓`;
                          }}
                        />
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-700">
                        {group.id}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600">
                        {group.name}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <button
                          className="flex items-center gap-1 text-blue-500 hover:text-yellow-500 transition-colors duration-150 ease-in-out text-sm"
                          onClick={() => handleEdit(group.name)}
                          title="Edit Age Group"
                        >
                          <Pencil className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-4 py-3 text-center text-sm text-gray-500"
                    >
                      No age groups found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-end items-center mt-5 space-x-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <div className="flex space-x-1">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => paginate(i + 1)}
                  className={`px-3 py-1 text-sm rounded-md ${
                    currentPage === i + 1
                      ? "bg-yellow-200 text-yellow-800"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgeGroups;
