import React, { useMemo, useRef, useEffect, useState } from "react";
import api from "../../api/axios";

// Main App component for Invoice Table
const App = () => {
  const [invoices, setInvoices] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalInvoices, setTotalInvoices] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const dropdownRef = useRef(null);
  const [viewInvoice, setViewInvoice] = useState(null);
  const [editInvoice, setEditInvoice] = useState(null);
  const [editStatus, setEditStatus] = useState("PENDING");
  const [editNotes, setEditNotes] = useState("");

  const getStatusClasses = (status) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CANCELLED":
        return "bg-gray-200 text-gray-800";
      case "REFUNDED":
        return "bg-blue-100 text-blue-800";
      case "FAILED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  

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

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("invoice", {
        params: { page: currentPage, limit: itemsPerPage },
      });

      const normalizedInvoices = (response.data.invoices || []).map((inv) => ({
        _id: inv._id,
        invoiceId: inv.invoiceId,
        customerName: inv.userId?.name || "N/A",
        customerEmail: inv.userId?.email || "",
        customerPhone: inv.userId?.phone || "",
        orderId: inv.orderId?.orderId || "",
        orderStatus: inv.orderId?.orderStatus || "",
        orderDate: inv.invoiceDate,
        total: inv.pricing?.total ?? 0,
        paymentMethod: inv.paymentMethod,
        status: inv.status,
        paymentStatus: inv.paymentStatus,
        raw: inv,
      }));

      setInvoices(normalizedInvoices);
      setTotalPages(Number(response.data.totalPages || 1));
      setTotalInvoices(Number(response.data.totalInvoices || 0));
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Failed to load invoices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      setOpenDropdownId(null);
    }
  };

  const handleView = async (invoiceId) => {
    try {
      setOpenDropdownId(null);
      const res = await api.get(`invoice/${invoiceId}`);
      setViewInvoice(res.data.invoice);
    } catch (e) {
      alert(e?.response?.data?.message || e.message || "Failed to load invoice");
    }
  };

  const handleEdit = async (invoiceId) => {
    try {
      setOpenDropdownId(null);
      const res = await api.get(`invoice/${invoiceId}`);
      setEditInvoice(res.data.invoice);
      setEditStatus(res.data.invoice?.status || "PENDING");
      setEditNotes(res.data.invoice?.notes || "");
    } catch (e) {
      alert(e?.response?.data?.message || e.message || "Failed to load invoice");
    }
  };

  const handleSaveEdit = async () => {
    if (!editInvoice?.invoiceId) return;
    try {
      await api.put(`invoice/${editInvoice.invoiceId}`, {
        status: editStatus,
        notes: editNotes,
      });
      setEditInvoice(null);
      await fetchInvoices();
    } catch (e) {
      alert(e?.response?.data?.message || e.message || "Failed to update invoice");
    }
  };

  const handleDelete = async (invoiceId) => {
    const ok = confirm("Delete this invoice? This cannot be undone.");
    if (!ok) return;
    try {
      setOpenDropdownId(null);
      await api.delete(`invoice/${invoiceId}`);
      await fetchInvoices();
    } catch (e) {
      alert(e?.response?.data?.message || e.message || "Failed to delete invoice");
    }
  };

  const pageButtons = useMemo(() => {
    const maxButtons = 7;
    const pages = [];
    const safeTotal = Math.max(1, totalPages);
    const start = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    const end = Math.min(safeTotal, start + maxButtons - 1);
    const finalStart = Math.max(1, end - maxButtons + 1);
    for (let p = finalStart; p <= end; p++) pages.push(p);
    return pages;
  }, [currentPage, totalPages]);

  // Function to handle CSV export
  const handleExportCSV = () => {
    const headers = [
      "Invoice ID",
      "Customer Name",
      "Product",
      "Invoice Date",
      "Total",
      "Payment Method",
      "Status",
    ];
  
    const csvContent = [
      headers.join(","),
      ...invoices.map((inv) =>
        [
          inv.invoiceId,
          inv.customerName,
          inv.raw?.items?.length > 1 ? "Multiple Items" : inv.raw?.items?.[0]?.productName || "N/A",
          new Date(inv.orderDate).toLocaleDateString(),
          inv.total,
          inv.paymentMethod,
          inv.status,
        ]
          .map((v) => `"${v}"`)
          .join(",")
      ),
    ].join("\n");
  
    const blob = new Blob([csvContent], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "invoices.csv";
    link.click();
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
            {/* Header Section with Export Button and New Filter */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4 sm:mb-0">
                Invoices
              </h2>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* Export Button */}
                <button
                  onClick={handleExportCSV}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition duration-150 ease-in-out shadow-sm flex items-center"
                >
                  <i className="fas fa-file-csv mr-2"></i>
                  Export to CSV
                </button>
              </div>
            </div>

            {/* Table Section */}
            <div className="overflow-x-auto rounded-lg border border-primary-100">
              <table className="min-w-full divide-y divide-primary-100">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sr No.
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Invoice ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Method
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-primary-100">
                  {!loading && invoices.length > 0 ? (
                    invoices.map((invoice, index) => (
                      <tr key={invoice._id} className="hover:bg-primary-50/50">
                        <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>

                        <td className="px-4 py-3 text-sm font-medium text-gray-800 whitespace-nowrap">
                          {invoice.invoiceId}
                        </td>

                        <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-800">{invoice.customerName}</span>
                            {invoice.customerEmail ? (
                              <span className="text-xs text-gray-500">{invoice.customerEmail}</span>
                            ) : null}
                          </div>
                        </td>

                        <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                          {invoice.orderDate ? new Date(invoice.orderDate).toLocaleDateString() : "—"}
                        </td>

                        <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                          ₹{Number(invoice.total || 0).toFixed(2)}
                        </td>

                        <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                          {invoice.paymentMethod}
                        </td>

                        <td className="px-4 py-3 text-sm whitespace-nowrap">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClasses(
                              invoice.status
                            )}`}
                          >
                            {invoice.status}
                          </span>
                        </td>

                        <td className="px-4 py-3 text-sm whitespace-nowrap">
                          <div className="relative inline-block text-left" ref={dropdownRef}>
                            <button
                              className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-gray-100"
                              onClick={() => toggleDropdown(invoice._id)}
                              aria-label="Actions"
                            >
                              <i className="fas fa-ellipsis-h"></i>
                            </button>

                            {openDropdownId === invoice._id && (
                              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-20 overflow-hidden">
                                <button
                                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                                  onClick={() => handleView(invoice.invoiceId)}
                                >
                                  View
                                </button>
                                <button
                                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                                  onClick={() => handleEdit(invoice.invoiceId)}
                                >
                                  Edit status
                                </button>
                                <button
                                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                  onClick={() => handleDelete(invoice.invoiceId)}
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : loading ? (
                    <tr>
                      <td colSpan="8" className="px-4 py-8 text-center text-sm text-gray-500">
                        Loading invoices...
                      </td>
                    </tr>
                  ) : (
                    <tr>
                      <td
                        colSpan="8"
                        className="px-4 py-3 text-center text-sm text-gray-500"
                      >
                        {error ? error : "No invoices found."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-6 gap-3">
              <div className="text-sm text-gray-600">
                Total: <span className="font-medium text-gray-800">{totalInvoices}</span>
              </div>

              <div className="flex justify-end items-center space-x-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <div className="flex space-x-1">
                {pageButtons.map((p) => (
                  <button
                    key={p}
                    onClick={() => paginate(p)}
                    className={`px-3 py-1 text-sm rounded-md ${
                      currentPage === p
                        ? "bg-yellow-200 text-yellow-800"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {p}
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
      </div>

      {/* View Modal */}
      {viewInvoice ? (
        <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
              <div className="font-semibold text-gray-800">Invoice {viewInvoice.invoiceId}</div>
              <button
                className="h-8 w-8 rounded-md hover:bg-gray-100"
                onClick={() => setViewInvoice(null)}
                aria-label="Close"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-xs text-gray-500">Customer</div>
                  <div className="text-gray-800 font-medium">{viewInvoice.userId?.name || "N/A"}</div>
                  <div className="text-gray-600">{viewInvoice.userId?.email || ""}</div>
                  <div className="text-gray-600">{viewInvoice.userId?.phone || ""}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Status</div>
                  <div className="mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClasses(viewInvoice.status)}`}>
                      {viewInvoice.status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-3">Invoice date</div>
                  <div className="text-gray-700">
                    {viewInvoice.invoiceDate ? new Date(viewInvoice.invoiceDate).toLocaleString() : "—"}
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="px-4 py-2 bg-gray-50 text-sm font-medium text-gray-700">Items</div>
                <div className="divide-y divide-gray-200">
                  {(viewInvoice.items || []).map((it, idx) => (
                    <div key={idx} className="px-4 py-3 text-sm flex justify-between gap-4">
                      <div className="text-gray-800">
                        <div className="font-medium">{it.productName}</div>
                        <div className="text-xs text-gray-500">Qty: {it.quantity}</div>
                      </div>
                      <div className="text-gray-700 whitespace-nowrap">₹{Number(it.totalPrice || 0).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-xs text-gray-500">Payment method</div>
                  <div className="text-gray-800">{viewInvoice.paymentMethod}</div>
                  <div className="text-xs text-gray-500 mt-2">Payment status</div>
                  <div className="text-gray-800">{viewInvoice.paymentStatus}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Total</div>
                  <div className="text-gray-800 font-semibold">₹{Number(viewInvoice.pricing?.total || 0).toFixed(2)}</div>
                </div>
              </div>

              {viewInvoice.notes ? (
                <div className="text-sm">
                  <div className="text-xs text-gray-500">Notes</div>
                  <div className="text-gray-700 whitespace-pre-wrap">{viewInvoice.notes}</div>
                </div>
              ) : null}
            </div>
            <div className="px-5 py-4 border-t border-gray-200 flex justify-end">
              <button className="px-4 py-2 text-sm bg-gray-100 rounded-md hover:bg-gray-200" onClick={() => setViewInvoice(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Edit Modal */}
      {editInvoice ? (
        <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
              <div className="font-semibold text-gray-800">Edit status: {editInvoice.invoiceId}</div>
              <button
                className="h-8 w-8 rounded-md hover:bg-gray-100"
                onClick={() => setEditInvoice(null)}
                aria-label="Close"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <div className="text-xs text-gray-500 mb-1">Status</div>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                >
                  <option value="PENDING">PENDING</option>
                  <option value="PAID">PAID</option>
                  <option value="CANCELLED">CANCELLED</option>
                  <option value="REFUNDED">REFUNDED</option>
                </select>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Notes (optional)</div>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
                  rows={4}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                />
              </div>
            </div>
            <div className="px-5 py-4 border-t border-gray-200 flex justify-end gap-2">
              <button className="px-4 py-2 text-sm bg-gray-100 rounded-md hover:bg-gray-200" onClick={() => setEditInvoice(null)}>
                Cancel
              </button>
              <button className="px-4 py-2 text-sm text-white bg-primary-600 rounded-md hover:bg-primary-700" onClick={handleSaveEdit}>
                Save
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default App;
