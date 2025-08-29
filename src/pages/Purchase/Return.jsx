import React, { useState, useEffect } from "react";
import ReturnListModal from "./ReturnListModal";
import ActionsDropdown from "./ActionsDropdown"; // Import the new component

const App = () => {
  const returnList = [
    {
      id: "ret-001",
      orderBy: "Customer A",
      items: 2,
      returnDate: "2025-07-17",
      total: 50.0,
      returnStatus: "Pending",
      reason: "Item was not as described.",
      media: [
        "https://images.unsplash.com/photo-1621252033832-72013f9f30e7?q=80&w=1470&auto=format&fit=crop",
        "https://www.w3schools.com/html/mov_bbb.mp4",
        "https://images.unsplash.com/photo-1621252033832-72013f9f30e7?q=80&w=1470&auto=format&fit=crop",
      ],
    },
    {
      id: "ret-002",
      orderBy: "Customer B",
      items: 1,
      returnDate: "2025-07-16",
      total: 120.5,
      returnStatus: "Completed",
      reason: "Changed my mind.",
      media: [
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1470&auto=format&fit=crop",
      ],
    },
    {
      id: "ret-003",
      orderBy: "Customer C",
      items: 3,
      returnDate: "2025-07-15",
      total: 75.0,
      returnStatus: "Rejected",
      reason: "Incorrect size ordered.",
      media: [],
    },
    {
      id: "ret-004",
      orderBy: "Customer D",
      items: 1,
      returnDate: "2025-07-14",
      total: 25.0,
      returnStatus: "Pending",
      reason: "Damaged during shipping.",
      media: [
        "https://images.unsplash.com/photo-1621252033832-72013f9f30e7?q=80&w=1470&auto=format&fit=crop",
        "https://www.w3schools.com/html/mov_bbb.mp4",
      ],
    },
    {
      id: "ret-005",
      orderBy: "Customer E",
      items: 4,
      returnDate: "2025-07-13",
      total: 300.0,
      returnStatus: "Completed",
      reason: "Received the wrong item.",
      media: [
        "https://images.unsplash.com/photo-1579298245158-33e82554877c?q=80&w=1334&auto=format&fit=crop",
      ],
    },
    {
      id: "ret-006",
      orderBy: "Customer F",
      items: 2,
      returnDate: "2025-07-12",
      total: 88.99,
      returnStatus: "Pending",
      reason: "Color was different from website.",
      media: [],
    },
    {
      id: "ret-007",
      orderBy: "Customer G",
      items: 1,
      returnDate: "2025-07-11",
      total: 45.0,
      returnStatus: "Completed",
      reason: "No longer needed.",
      media: [],
    },
    {
      id: "ret-008",
      orderBy: "Customer H",
      items: 5,
      returnDate: "2025-07-10",
      total: 500.0,
      returnStatus: "Rejected",
      reason: "Item was used.",
      media: [],
    },
    {
      id: "ret-009",
      orderBy: "Customer I",
      items: 2,
      returnDate: "2025-07-09",
      total: 150.0,
      returnStatus: "Pending",
      reason: "Defective product.",
      media: [
        "https://images.unsplash.com/photo-1621252033832-72013f9f30e7?q=80&w=1470&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1470&auto=format&fit=crop",
      ],
    },
    {
      id: "ret-010",
      orderBy: "Customer J",
      items: 1,
      returnDate: "2025-07-08",
      total: 30.0,
      returnStatus: "Completed",
      reason: "Order was a mistake.",
      media: ["https://www.w3schools.com/html/mov_bbb.mp4"],
    },
  ];

  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [filterByReturnStatus, setFilterByReturnStatus] = useState("all");

  // Removed: const dropdownRef = useRef(null);
  // Removed: the useEffect hook for click outside logic

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({ reason: "", media: [] });

  const getReturnStatusClasses = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Centralized action handler
  const handleAction = (action, returnId) => {
    // Close the dropdown after any action
    setOpenDropdownId(null);

    if (action === "view") {
      const returnItem = returnList.find((item) => item.id === returnId);
      if (returnItem) {
        setModalData({
          reason: returnItem.reason,
          media: returnItem.media,
        });
        setIsModalOpen(true);
      }
    } else if (action === "edit") {
      console.log(`Editing return: ${returnId}`);
    } else if (action === "delete") {
      console.log(`Deleting return: ${returnId}`);
    }
  };

  const getFilteredReturnList = () => {
    if (filterByReturnStatus === "all") {
      return returnList;
    }
    return returnList.filter(
      (item) => item.returnStatus === filterByReturnStatus
    );
  };

  const filteredReturnList = getFilteredReturnList();

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReturnList = filteredReturnList.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredReturnList.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterByReturnStatus]);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      setOpenDropdownId(null);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
      />

      <div className="flex-1 overflow-y-auto p-4 bg-primary-50">
        <div className="">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-primary-100">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4 sm:mb-0">
                Return List
              </h2>
              <div className="flex items-center">
                <select
                  className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md shadow-sm w-auto max-w-fit"
                  value={filterByReturnStatus}
                  onChange={(e) => setFilterByReturnStatus(e.target.value)}
                >
                  <option value="all">All Return Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-primary-100">
              <table className="min-w-full divide-y divide-primary-100">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sr No.
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order By
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Return Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Return Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-primary-100">
                  {currentReturnList.length > 0 ? (
                    currentReturnList.map((item, index) => (
                      <tr
                        key={item.id}
                        className="hover:bg-gray-50 transition duration-150 ease-in-out"
                      >
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {indexOfFirstItem + index + 1}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800">
                          {item.id}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {item.orderBy}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {item.items}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {item.returnDate}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          ₹{item.total.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${getReturnStatusClasses(
                              item.returnStatus
                            )}`}
                          >
                            {item.returnStatus}
                          </span>
                        </td>
                        <ActionsDropdown
                          id={item.id}
                          onToggle={setOpenDropdownId}
                          onAction={handleAction}
                          isOpen={openDropdownId === item.id}
                        />
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="8"
                        className="px-4 py-3 text-center text-sm text-gray-500"
                      >
                        No returns found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end items-center mt-6 space-x-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      <ReturnListModal
        isOpen={isModalOpen}
        onClose={closeModal}
        reason={modalData.reason}
        media={modalData.media}
      />
    </>
  );
};

export default App;
