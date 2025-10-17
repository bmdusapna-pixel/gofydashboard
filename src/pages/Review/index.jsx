import React, { useState, useEffect, use } from "react";
import {
  Search,
  Filter,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
  Clock,
  Star,
  Flag,
} from "lucide-react";
import api from "../../api/axios.js";

const getReviewsApi = async (productId) => {
  const res = await api.get(`/reviews?productId=${productId}`);
  return res.data;
};

const deleteReviewApi = async (reviewId) => {
  const res = await api.delete(`/reviews/${reviewId}`);
  return res.data;
};

const ReviewManagementDashboard = () => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      const data = await getReviewsApi();
      setReviews(data);
      setFilteredReviews(data);
    };
    fetchReviews();
  }, []);

  const [statusFilter, setStatusFilter] = useState("all");
  const [flaggedFilter, setFlaggedFilter] = useState("all");
  const [selectedReviews, setSelectedReviews] = useState(new Set());
  const [newKeyword, setNewKeyword] = useState("");

  // Flagged keywords that trigger automatic flagging
  const initialFlaggedKeywords = [
    "damaged",
    "broken",
    "defective",
    "poor quality",
    "late delivery",
    "delayed",
    "never arrived",
    "missing",
    "terrible",
    "awful",
    "worst",
    "horrible",
    "scam",
    "fraud",
    "fake",
    "counterfeit",
    "refund",
    "return",
    "money back",
    "rash",
    "allergies",
    "unsafe",
    "choking hazard",
    "too small",
    "too big",
  ];
  const [flaggedKeywords, setFlaggedKeywords] = useState(
    initialFlaggedKeywords
  );

  // Function to re-evaluate flags on all reviews
  const reEvaluateFlags = (allReviews, keywords) => {
    return allReviews.map((review) => {
      const foundKeywords = keywords.filter((keyword) =>
        review.comment.toLowerCase().includes(keyword)
      );
      return {
        ...review,
        flagged: foundKeywords.length > 0,
        flaggedKeywords: foundKeywords,
      };
    });
  };

  // Mock review data
  // useEffect(() => {
  //   const mockReviews = [
  //     {
  //       id: 1,
  //       productName: "Soft Organic Cotton Onesie",
  //       customerName: "Maria Rodriguez",
  //       rating: 2,
  //       comment:
  //         "The fabric is soft but the sizing is way too small. It was a late delivery, and it caused a rash on my baby's skin. This is a very poor quality product.",
  //       date: "2025-08-28",
  //       status: "pending",
  //       flagged: true,
  //       flaggedKeywords: ["too small", "rash", "poor quality", "late delivery"],
  //     },
  //     {
  //       id: 2,
  //       productName: "Adventure Play Mat",
  //       customerName: "David Lee",
  //       rating: 5,
  //       comment:
  //         "Our baby loves this play mat! The colors are vibrant, and the material is very durable. Great value and fast delivery.",
  //       date: "2025-08-27",
  //       status: "approved",
  //       flagged: false,
  //       flaggedKeywords: [],
  //     },
  //     {
  //       id: 3,
  //       productName: "Baby Diaper Cream",
  //       customerName: "Jessica Chen",
  //       rating: 1,
  //       comment:
  //         "This is a scam! My order never arrived, and the customer service is awful. I need a refund immediately.",
  //       date: "2025-08-26",
  //       status: "pending",
  //       flagged: true,
  //       flaggedKeywords: ["scam", "never arrived", "awful", "refund"],
  //     },
  //     {
  //       id: 4,
  //       productName: "Wooden Building Blocks Set",
  //       customerName: "Tom Wilson",
  //       rating: 4,
  //       comment:
  //         "Good product overall. The blocks are a little smaller than I expected, but they are safe and well-made.",
  //       date: "2025-08-25",
  //       status: "approved",
  //       flagged: false,
  //       flaggedKeywords: [],
  //     },
  //     {
  //       id: 5,
  //       productName: "Silicone Baby Feeder",
  //       customerName: "Olivia Garcia",
  //       rating: 3,
  //       comment:
  //         "Works okay but the mouthpiece feels cheap. I'm worried it might be a choking hazard for my child.",
  //       date: "2025-08-24",
  //       status: "pending",
  //       flagged: true,
  //       flaggedKeywords: ["choking hazard", "cheap"],
  //     },
  //     {
  //       id: 6,
  //       productName: "Adjustable High Chair",
  //       customerName: "Chris Evans",
  //       rating: 5,
  //       comment:
  //         "This high chair is fantastic. It's easy to clean, sturdy, and adjusts perfectly as my baby grows. Very satisfied with this purchase!",
  //       date: "2025-08-23",
  //       status: "approved",
  //       flagged: false,
  //       flaggedKeywords: [],
  //     },
  //     {
  //       id: 7,
  //       productName: "Children's Rain Boots",
  //       customerName: "Chloe White",
  //       rating: 2,
  //       comment:
  //         "The boots are cute but the quality is terrible. The seams split after only one use, and the sole came damaged.",
  //       date: "2025-08-22",
  //       status: "pending",
  //       flagged: true,
  //       flaggedKeywords: ["terrible", "damaged"],
  //     },
  //   ];
  //   setReviews(reEvaluateFlags(mockReviews, flaggedKeywords));
  //   setFilteredReviews(reEvaluateFlags(mockReviews, flaggedKeywords));
  // }, [flaggedKeywords]);

  // Filter reviews based on search and filters
  useEffect(() => {
    let filtered = reviews;

    if (searchTerm) {
      filtered = filtered.filter(
        (review) =>
          review.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.customerName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          review.comment.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((review) => review.status === statusFilter);
    }

    if (flaggedFilter !== "all") {
      const isFlagged = flaggedFilter === "flagged";
      filtered = filtered.filter((review) => review.flagged === isFlagged);
    }

    setFilteredReviews(filtered);
  }, [searchTerm, statusFilter, flaggedFilter, reviews]);

  const handleStatusChange = (reviewId, newStatus) => {
    setReviews((prev) =>
      prev.map((review) =>
        review.id === reviewId ? { ...review, status: newStatus } : review
      )
    );
  };

  const handleDelete = async (reviewId) => {
    try {
      await deleteReviewApi(reviewId); // Call the API
      // If API call is successful, then update the state
      setReviews((prev) => prev.filter((review) => review.id !== reviewId));
      setSelectedReviews((prev) => {
        const newSet = new Set(prev);
        newSet.delete(reviewId);
        return newSet;
      });
    } catch (error) {
      console.error("Failed to delete review:", error);
      // Optionally show an error message to the user
    }
  };

  const handleBulkAction = (action) => {
    if (action === "delete") {
      setReviews((prev) =>
        prev.filter((review) => !selectedReviews.has(review.id))
      );
    } else {
      setReviews((prev) =>
        prev.map((review) =>
          selectedReviews.has(review.id)
            ? { ...review, status: action }
            : review
        )
      );
    }
    setSelectedReviews(new Set());
  };

  const handleAddKeyword = () => {
    const trimmedKeyword = newKeyword.trim().toLowerCase();
    if (trimmedKeyword && !flaggedKeywords.includes(trimmedKeyword)) {
      setFlaggedKeywords((prev) => [...prev, trimmedKeyword]);
      setNewKeyword("");
    }
  };

  const handleRemoveKeyword = (keywordToRemove) => {
    setFlaggedKeywords((prev) =>
      prev.filter((keyword) => keyword !== keywordToRemove)
    );
  };

  const toggleSelectReview = (reviewId) => {
    setSelectedReviews((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId);
      } else {
        newSet.add(reviewId);
      }
      return newSet;
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "text-green-600 bg-green-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "rejected":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const stats = {
    total: reviews.length,
    pending: reviews.filter((r) => r.status === "pending").length,
    flagged: reviews.filter((r) => r.flagged).length,
    approved: reviews.filter((r) => r.status === "approved").length,
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
      <div>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Review Management Dashboard
          </h1>
          <p className="text-gray-600">
            Monitor, moderate, and manage customer reviews
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Eye className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Reviews
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Pending Review
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.pending}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Flag className="w-8 h-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Flagged Reviews
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.flagged}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.approved}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">Reviews</h2>
            </div>
            <div className="flex gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <select
                value={flaggedFilter}
                onChange={(e) => setFlaggedFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Reviews</option>
                <option value="flagged">Flagged Only</option>
                <option value="unflagged">Not Flagged</option>
              </select>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedReviews.size > 0 && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700 mb-3">
                {selectedReviews.size} review(s) selected
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleBulkAction("approved")}
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                >
                  Approve Selected
                </button>
                <button
                  onClick={() => handleBulkAction("rejected")}
                  className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                >
                  Reject Selected
                </button>
                <button
                  onClick={() => handleBulkAction("delete")}
                  className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
                >
                  Delete Selected
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Reviews Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedReviews(
                            new Set(filteredReviews.map((r) => r.id))
                          );
                        } else {
                          setSelectedReviews(new Set());
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product & Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating & Review
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Flags
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReviews.map((review) => (
                  <tr
                    key={review.id}
                    className={`hover:bg-gray-50 ${
                      review.flagged ? "bg-red-50" : ""
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedReviews.has(review.id)}
                        onChange={() => toggleSelectReview(review.id)}
                        className="rounded border-gray-300"
                      />
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {review.productName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {review.customerName}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="max-w-md">
                        <div className="flex items-center mb-1">
                          {renderStars(review.rating)}
                          <span className="ml-2 text-sm text-gray-600">
                            ({review.rating}/5)
                          </span>
                        </div>
                        <p className="text-sm text-gray-800 line-clamp-3">
                          {review.comment}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          review.status
                        )}`}
                      >
                        {review.status.charAt(0).toUpperCase() +
                          review.status.slice(1)}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      {review.flagged ? (
                        <div className="space-y-1">
                          <div className="flex items-center text-red-600">
                            <AlertTriangle className="w-4 h-4 mr-1" />
                            <span className="text-xs font-medium">Flagged</span>
                          </div>
                          <div className="space-y-1">
                            {review.flaggedKeywords.map((keyword, index) => (
                              <span
                                key={index}
                                className="inline-block px-2 py-1 text-xs bg-red-100 text-red-700 rounded mr-1 mb-1"
                              >
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">No flags</span>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {review.date}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        {review.status === "pending" && (
                          <>
                            <button
                              onClick={() =>
                                handleStatusChange(review.id, "approved")
                              }
                              className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-100"
                              title="Approve"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                handleStatusChange(review.id, "rejected")
                              }
                              className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-100"
                              title="Reject"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDelete(review.id)}
                          className="text-gray-600 hover:text-red-800 p-1 rounded hover:bg-red-100"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredReviews.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                No reviews found matching your criteria.
              </p>
            </div>
          )}
        </div>

        {/* Flagged Keywords Panel */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Flag className="w-5 h-5 mr-2 text-red-600" />
            Monitored Keywords
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Reviews containing these keywords are automatically flagged for
            review:
          </p>
          <div className="flex flex-wrap gap-3">
            {flaggedKeywords.map((keyword, index) => (
              <div
                key={index}
                className="group relative inline-block px-3 py-2 pr-8 text-sm bg-gray-100 text-gray-700 rounded-lg border hover:bg-gray-200 transition-colors"
              >
                {keyword}
                <button
                  onClick={() => handleRemoveKeyword(keyword)}
                  className="absolute right-1 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  title={`Remove "${keyword}"`}
                >
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <h4 className="text-md font-medium text-gray-800 mb-2">
              Add New Keyword
            </h4>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddKeyword();
                  }
                }}
                placeholder="Enter new keyword (e.g., 'faulty')"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
              <button
                onClick={handleAddKeyword}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Add Keyword
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Activity
          </h3>
          <div className="space-y-3">
            <div className="flex items-center text-sm">
              <CheckCircle className="w-4 h-4 text-green-600 mr-3" />
              <span>Review for "Adventure Play Mat" approved by admin</span>
              <span className="ml-auto text-gray-500">2 hours ago</span>
            </div>
            <div className="flex items-center text-sm">
              <Flag className="w-4 h-4 text-red-600 mr-3" />
              <span>Review flagged for keywords "rash" and "poor quality"</span>
              <span className="ml-auto text-gray-500">4 hours ago</span>
            </div>
            <div className="flex items-center text-sm">
              <Trash2 className="w-4 h-4 text-gray-600 mr-3" />
              <span>Spam review deleted</span>
              <span className="ml-auto text-gray-500">6 hours ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewManagementDashboard;
