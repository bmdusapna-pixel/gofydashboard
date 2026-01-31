import React, { useEffect, useRef, useState } from 'react';
import {
  Search,
  Filter,
  Download,
  ArrowUpDown,
  HelpCircle,
  Check,
  EllipsisVertical,
  Eye,
  Pencil,
  Trash2,
} from 'lucide-react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';

const Payment = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('ALL');
  const [transactions, setTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('Select');
  const [amountFilter, setAmountFilter] = useState('Select');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'initiatedAt', direction: 'desc' });

  const dropdownRef = useRef(null);

  const mapStatusLabelToValue = (label) => {
    switch (label) {
      case 'succeeded':
        return 'SUCCESS';
      case 'failed':
        return 'FAILED';
      case 'refunded':
        return 'REFUNDED';
      default:
        return '';
    }
  };

  const computeDateRange = () => {
    const now = new Date();
    if (dateFilter === 'Today') {
      const start = new Date(now);
      start.setHours(0, 0, 0, 0);
      const end = new Date(now);
      end.setHours(23, 59, 59, 999);
      return { startDate: start.toISOString(), endDate: end.toISOString() };
    }
    if (dateFilter === 'Last 7 days') {
      const start = new Date(now);
      start.setDate(start.getDate() - 7);
      return { startDate: start.toISOString(), endDate: now.toISOString() };
    }
    if (dateFilter === 'Last 30 days') {
      const start = new Date(now);
      start.setDate(start.getDate() - 30);
      return { startDate: start.toISOString(), endDate: now.toISOString() };
    }
    return {};
  };

  const computeAmountRange = () => {
    if (amountFilter === 'Less than ₹100') {
      return { maxAmount: 100 };
    }
    if (amountFilter === '₹100 - ₹1000') {
      return { minAmount: 100, maxAmount: 1000 };
    }
    if (amountFilter === 'More than ₹1000') {
      return { minAmount: 1000 };
    }
    return {};
  };

  const mapPaymentMethodFilter = () => {
    if (paymentMethodFilter === 'All') return '';
    if (paymentMethodFilter === 'UPI') return 'UPI';
    if (paymentMethodFilter === 'Card') return 'CARD';
    if (paymentMethodFilter === 'Net Banking') return 'NETBANKING';
    return '';
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = {
          page,
          limit: 50,
        };

        // Status from tab takes precedence, else dropdown
        const tabStatus = activeTab === 'ALL' ? '' : mapStatusLabelToValue(activeTab.toLowerCase());
        const dropdownStatus = statusFilter === 'All' ? '' : mapStatusLabelToValue(statusFilter.toLowerCase());
        const status = tabStatus || dropdownStatus;
        if (status) params.status = status;

        if (searchQuery) params.search = searchQuery;

        const { startDate, endDate } = computeDateRange();
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;

        const { minAmount, maxAmount } = computeAmountRange();
        if (minAmount) params.minAmount = minAmount;
        if (maxAmount) params.maxAmount = maxAmount;

        const paymentMethod = mapPaymentMethodFilter();
        if (paymentMethod) params.paymentMethod = paymentMethod;

        const res = await api.get('/admin/payments', { params });

        setTransactions(res.data.payments || []);
        setTotalPages(res.data.totalPages || 1);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch payments');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [page, activeTab, searchQuery, dateFilter, amountFilter, paymentMethodFilter, statusFilter]);

  const toggleDropdown = (id) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const handleView = (paymentId) => {
    navigate(`/payment/${paymentId}`);
    setOpenDropdownId(null);
  };

  const tabs = ['ALL', 'succeeded', 'refunded', 'failed'];

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === 'asc' ? 'desc' : 'asc',
        };
      }
      return { key, direction: 'asc' };
    });
  };

  const sortedTransactions = [...transactions].sort((a, b) => {
    const { key, direction } = sortConfig;
    let aVal = a[key];
    let bVal = b[key];

    if (key === 'initiatedAt') {
      aVal = a.initiatedAt ? new Date(a.initiatedAt).getTime() : 0;
      bVal = b.initiatedAt ? new Date(b.initiatedAt).getTime() : 0;
    }

    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  const handleExportCSV = async () => {
    try {
      const params = {};

      const tabStatus = activeTab === 'ALL' ? '' : mapStatusLabelToValue(activeTab.toLowerCase());
      const dropdownStatus = statusFilter === 'All' ? '' : mapStatusLabelToValue(statusFilter.toLowerCase());
      const status = tabStatus || dropdownStatus;
      if (status) params.status = status;

      if (searchQuery) params.search = searchQuery;

      const { startDate, endDate } = computeDateRange();
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const { minAmount, maxAmount } = computeAmountRange();
      if (minAmount) params.minAmount = minAmount;
      if (maxAmount) params.maxAmount = maxAmount;

      const paymentMethod = mapPaymentMethodFilter();
      if (paymentMethod) params.paymentMethod = paymentMethod;

      const response = await api.get('/admin/payments/export/csv', {
        params,
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `payments-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export CSV', err);
    }
  };

  return (
    <div className="h-screen overflow-y-auto p-4 bg-primary-50">
      {/* Main Content */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Payment Management</h1>
            <div className="flex items-center gap-2">
              {/* <button className="p-2 hover:bg-gray-100 rounded-lg">
                <ArrowUpDown className="w-5 h-5 text-gray-600" />
              </button> */}
              <button
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                onClick={handleExportCSV}
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              {/* <button className="p-2 hover:bg-gray-100 rounded-lg">
                <ArrowUpDown className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <HelpCircle className="w-5 h-5 text-gray-600" />
              </button>
              <button className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white hover:bg-orange-600">
                <span className="text-lg">?</span>
              </button> */}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-6 mb-6 border-b ">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setPage(1);
                }}
                className={`pb-3 px-1 border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600 font-medium'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg border border-primary-100 mb-6">
            <div className="p-4 flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded">
                <Filter className="w-5 h-5 text-gray-600" />
              </button>
              
              <div className="flex-1 relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Phone, Email, Payment ID, or Reference#"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Date</span>
                <select
                  value={dateFilter}
                  onChange={(e) => {
                    setDateFilter(e.target.value);
                    setPage(1);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Select</option>
                  <option>Today</option>
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Amount</span>
                <select
                  value={amountFilter}
                  onChange={(e) => {
                    setAmountFilter(e.target.value);
                    setPage(1);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Select</option>
                  <option>Less than ₹100</option>
                  <option>₹100 - ₹1000</option>
                  <option>More than ₹1000</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Payment Method</span>
                <select
                  value={paymentMethodFilter}
                  onChange={(e) => {
                    setPaymentMethodFilter(e.target.value);
                    setPage(1);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>All</option>
                  <option>UPI</option>
                  <option>Card</option>
                  <option>Net Banking</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Status</span>
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(1);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>All</option>
                  <option>succeeded</option>
                  <option>failed</option>
                  <option>refunded</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg border border-primary-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      type="button"
                      className="inline-flex items-center gap-1"
                      onClick={() => handleSort('initiatedAt')}
                    >
                      <span>DATE & TIME</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      type="button"
                      className="inline-flex items-center gap-1"
                      onClick={() => handleSort('amount')}
                    >
                      <span>AMOUNT</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    STATUS
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CUSTOMER DETAILS
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    PAYMENT METHOD
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    PAYMENT ID
                  </th>
                  <th className="w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-8 text-center text-sm text-gray-500"
                    >
                      Loading payments...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-8 text-center text-sm text-red-500"
                    >
                      {error}
                    </td>
                  </tr>
                ) : sortedTransactions.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-8 text-center text-sm text-gray-500"
                    >
                      No payments found
                    </td>
                  </tr>
                ) : (
                  sortedTransactions.map((tx) => (
                    <tr key={tx._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {tx.initiatedAt
                          ? new Date(tx.initiatedAt).toLocaleString()
                          : '—'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {tx.amount}{' '}
                        <span className="text-gray-500">
                          {tx.currency || 'INR'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 text-sm text-green-700">
                          <Check className="w-4 h-4" />
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="text-gray-900">
                          {tx.userId?.email || tx.customerDetails?.email || '—'}
                        </div>
                        <div className="text-gray-500">
                          {tx.userId?.phone || tx.customerDetails?.phone || '—'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">⚡</span>
                          <span className="text-sm text-gray-900">
                            {tx.paymentMethod}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          type="button"
                          onClick={() => handleView(tx.paymentId)}
                          className="text-blue-600 hover:underline cursor-pointer"
                        >
                          {tx.paymentId}
                        </button>
                        <div className="text-gray-500">
                          Ref# - {tx.orderId?.orderId || tx.referenceNumber}
                        </div>
                      </td>
                      <td className="px-6 py-4 relative">
                        <button
                          className="flex items-center justify-center w-6 h-6 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-1 focus:ring-gray-200"
                          onClick={() => toggleDropdown(tx.paymentId)}
                          title="More Actions"
                        >
                          <EllipsisVertical className="w-4 h-4 text-gray-500" />
                        </button>
                        {openDropdownId === tx.paymentId && (
                          <div
                            ref={dropdownRef}
                            className="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg z-10 border border-primary-100"
                          >
                            <div
                              className="flex flex-col gap-1 w-full py-2"
                              role="menu"
                            >
                              <button
                                className="flex items-center gap-2 px-4 py-1.5 hover:bg-gray-100 text-sm text-gray-600"
                                onClick={() => handleView(tx.paymentId)}
                              >
                                <Eye className="w-4 h-4 text-blue-500" />
                                View
                              </button>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="flex justify-end items-center gap-2 mt-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
            >
              Previous
            </button>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setPage(i + 1)}
                  className={`px-3 py-1 text-sm rounded-md ${
                    page === i + 1
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
  );
};

export default Payment;