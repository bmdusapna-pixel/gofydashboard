import React, { useState, useEffect, useCallback } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faIndianRupeeSign,
  faShoppingBag,
  faUserPlus,
  faChartPie,
  faEllipsisH,
  faBox,
  faCreditCard,
  faExchangeAlt,
  faMapMarkerAlt,
  faUsers,
  faPercent,
  faSmile,
  faStar,
  faTruck,
  faDownload,
  faFileExcel,
  faEnvelope,
  faCity,
  faSyncAlt,
} from "@fortawesome/free-solid-svg-icons";
import * as XLSX from "xlsx";
import api from "../../api/axios";
import FilterForm from "./FilterForm";

const formatCurrency = (n) =>
  typeof n === "number"
    ? `₹${Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : "₹0.00";
const formatDate = (d) => {
  if (!d) return "-";
  const dt = typeof d === "string" ? new Date(d) : d;
  return dt.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const Index = () => {
  const [timeFilter, setTimeFilter] = useState("This Month");
  const [liveVisitors, setLiveVisitors] = useState(1247);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [topBuyers, settopBuyers] = useState([]);
  const [topProducts,settopProducts] = useState([]);

  const fetchDashboardStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("dashboard/stats");
      setStats(data.stats || []);
      setRecentOrders(data.recentOrders || []);
      settopBuyers(data.topBuyers);
      settopProducts(data.topSellingProducts)
      setLastUpdated(new Date());
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to load dashboard stats");
      setStats([]);
      setRecentOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  // Simulate real-time updates for live visitors only
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveVisitors((prev) => prev + Math.floor(Math.random() * 10) - 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const MetricCard = ({ title, value, change, icon, iconColorClass }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
          {change && (
            <p
              className={`text-xs mt-1 ${
                change.startsWith("+") ? "text-green-600" : "text-red-600"
              }`}
            >
              <span className="font-semibold">{change}</span> from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${iconColorClass}`}>
          <FontAwesomeIcon icon={icon} />
        </div>
      </div>
    </div>
  );

  const getStat = (key) => {
    const s = (stats || []).find((x) => x.key === key);
    return s ? s.value : null;
  };

  const exportData = () => {
    const totalSales = getStat("totalSales");
    const totalOrders = getStat("totalOrders");
    const newCustomers = getStat("newCustomers");
    const avgOrderValue = getStat("avgOrderValue");
    const rows = [
      "Metric,Value",
      `Total Sales,${totalSales != null ? formatCurrency(totalSales) : "—"}`,
      `Total Orders,${totalOrders != null ? totalOrders : "—"}`,
      `New Customers,${newCustomers != null ? newCustomers : "—"}`,
      `Average Order Value,${avgOrderValue != null ? formatCurrency(avgOrderValue) : "—"}`,
    ];
    const csvContent =
      "data:text/csv;charset=utf-8," + rows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "gofy_kids_dashboard_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportExcel = () => {
    const totalSales = getStat("totalSales");
    const totalOrders = getStat("totalOrders");
    const newCustomers = getStat("newCustomers");
    const avgOrderValue = getStat("avgOrderValue");
    const data = [
      ["Metric", "Value"],
      ["Total Sales", totalSales != null ? formatCurrency(totalSales) : "—"],
      ["Total Orders", totalOrders != null ? totalOrders : "—"],
      ["New Customers", newCustomers != null ? newCustomers : "—"],
      ["Average Order Value", avgOrderValue != null ? formatCurrency(avgOrderValue) : "—"],
    ];
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Dashboard Data");
    XLSX.writeFile(workbook, "gofy_kids_dashboard_data.xlsx");
  };

  const salesData = [
    { name: "Jan", total: 9500 },
    { name: "Feb", total: 11100 },
    { name: "Mar", total: 10900 },
    { name: "Apr", total: 13300 },
    { name: "May", total: 15200 },
    { name: "Jun", total: 17000 },
    { name: "Jul", total: 16200 },
  ];

  const categoryData = [
    { name: "Toys", value: 45, sales: "₹3,24,500", colorClass: "text-red-600" },
    {
      name: "Baby Clothes",
      value: 32,
      sales: "₹2,31,200",
      colorClass: "text-blue-600",
    },
    {
      name: "Accessories",
      value: 15,
      sales: "₹1,08,300",
      colorClass: "text-yellow-600",
    },
    { name: "Books", value: 8, sales: "₹57,800", colorClass: "text-green-600" },
  ];

  // const topProducts = [
  //   { name: "Cuddly Teddy Bear", sales: 347, rank: "#1", category: "Toys" },
  //   {
  //     name: "Colorful Building Blocks",
  //     sales: 298,
  //     rank: "#2",
  //     category: "Toys",
  //   },
  //   { name: "Princess Doll Set", sales: 256, rank: "#3", category: "Toys" },
  //   {
  //     name: "Baby Cotton T-Shirt",
  //     sales: 234,
  //     rank: "#4",
  //     category: "Clothes",
  //   },
  //   {
  //     name: "Kids School Backpack",
  //     sales: 189,
  //     rank: "#5",
  //     category: "Accessories",
  //   },
  // ];

  const searchTermsData = [
    { term: "baby frock", searches: 2847, rate: "8.7%", trend: "+23%" },
    { term: "lego set", searches: 1923, rate: "9.8%", trend: "+15%" },
    { term: "school bag", searches: 1567, rate: "9.3%", trend: "+8%" },
    { term: "teddy bear", searches: 1234, rate: "13.5%", trend: "+12%" },
    { term: "kids shoes", searches: 987, rate: "9.0%", trend: "+5%" },
  ];

  const stateOrdersData = [
    { state: "Maharashtra", orders: 1847, Sales: "₹2,77,050" },
    { state: "Karnataka", orders: 1523, Sales: "₹2,28,450" },
    { state: "Tamil Nadu", orders: 1234, Sales: "₹1,85,100" },
    { state: "Gujarat", orders: 1098, Sales: "₹1,64,700" },
    { state: "Delhi", orders: 987, Sales: "₹1,48,050" },
  ];

  const cityOrdersData = [
    { city: "Mumbai", orders: 1200, Sales: "₹1,80,500" },
    { city: "Bengaluru", orders: 950, Sales: "₹1,42,750" },
    { city: "Chennai", orders: 780, Sales: "₹1,15,200" },
    { city: "Ahmedabad", orders: 640, Sales: "₹98,600" },
    { city: "Delhi", orders: 590, Sales: "₹87,400" },
  ];

  const postalOrdersData = [
    { code: "400001 (Mumbai)", orders: 450, Sales: "₹67,800" },
    { code: "560001 (Bengaluru)", orders: 380, Sales: "₹55,200" },
    { code: "600001 (Chennai)", orders: 320, Sales: "₹47,900" },
    { code: "380001 (Ahmedabad)", orders: 280, Sales: "₹41,600" },
    { code: "110001 (Delhi)", orders: 260, Sales: "₹39,200" },
  ];

  // const topBuyers = [
  //   { name: "Priya Sharma", city: "Mumbai", orders: 23, spent: "₹34,500" },
  //   { name: "Rajesh Kumar", city: "Delhi", orders: 19, spent: "₹28,700" },
  //   {
  //     name: "Little Stars Daycare",
  //     city: "Bangalore",
  //     orders: 15,
  //     spent: "₹45,600",
  //     flag: true,
  //   },
  //   { name: "Sneha Patel", city: "Pune", orders: 17, spent: "₹25,400" },
  //   {
  //     name: "Happy Kids School",
  //     city: "Chennai",
  //     orders: 12,
  //     spent: "₹67,800",
  //     flag: true,
  //   },
  // ];

  const displayOrders = recentOrders.map((o) => ({
    id: o.id,
    customer: o.customer || "Unknown",
    date: formatDate(o.date),
    amount: formatCurrency(Number(o.amount)),
    status: o.status || "—",
  }));

  return (
    <main className="flex-1 overflow-y-auto p-4 bg-primary-50">
      {/* Filter and Export Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-medium">
            <FontAwesomeIcon icon={faUsers} className="h-4 w-4" />
            <span>{liveVisitors} Kids Browsing</span>
          </div>
          <div className="text-sm text-gray-600 bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-200">
            Updated: {lastUpdated.toLocaleTimeString()}
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchDashboardStats}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors bg-white shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
            title="Refresh dashboard"
          >
            <FontAwesomeIcon
              icon={faSyncAlt}
              className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
            <span>Refresh</span>
          </button>
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white shadow-sm"
          >
            <option>This Month</option>
            <option>Last Month</option>
            <option>This Week</option>
            <option>Custom Range</option>
          </select>
          <button
            onClick={exportData}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
          >
            <FontAwesomeIcon icon={faDownload} className="h-4 w-4" />
            <span>Export Data</span>
          </button>
          <button
            onClick={exportExcel}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
          >
            <FontAwesomeIcon icon={faFileExcel} className="h-4 w-4" />
            <span>Export Excel</span>
          </button>
        </div>
      </div>
      <div className="mb-6">
        <FilterForm />
      </div>
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={fetchDashboardStats}
            className="px-3 py-1 bg-red-100 hover:bg-red-200 rounded-lg text-sm font-medium"
          >
            Retry
          </button>
        </div>
      )}
      {/* Main Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="Total Sales"
          value={
            loading && !stats?.length
              ? "…"
              : (() => {
                  const v = getStat("totalSales");
                  return v != null ? formatCurrency(v) : "—";
                })()
          }
          change={
            (() => {
              const s = (stats || []).find((x) => x.key === "totalSales");
              const p = s?.changePct;
              if (p == null || p === 0) return null;
              return (p > 0 ? "+" : "") + Number(p).toFixed(1) + "%";
            })() || null
          }
          icon={faIndianRupeeSign}
          iconColorClass="bg-blue-200 text-blue-700"
        />
        <MetricCard
          title="Total Orders"
          value={
            loading && !stats?.length
              ? "…"
              : (() => {
                  const v = getStat("totalOrders");
                  return v != null ? Number(v).toLocaleString() : "—";
                })()
          }
          change={
            (() => {
              const s = (stats || []).find((x) => x.key === "totalOrders");
              const p = s?.changePct;
              if (p == null || p === 0) return null;
              return (p > 0 ? "+" : "") + Number(p).toFixed(1) + "%";
            })() || null
          }
          icon={faShoppingBag}
          iconColorClass="bg-yellow-200 text-yellow-700"
        />
        <MetricCard
          title="New Customers"
          value={
            loading && !stats?.length
              ? "…"
              : (() => {
                  const v = getStat("newCustomers");
                  return v != null ? Number(v).toLocaleString() : "—";
                })()
          }
          change={
            (() => {
              const s = (stats || []).find((x) => x.key === "newCustomers");
              const p = s?.changePct;
              if (p == null || p === 0) return null;
              return (p > 0 ? "+" : "") + Number(p).toFixed(1) + "%";
            })() || null
          }
          icon={faUserPlus}
          iconColorClass="bg-red-200 text-red-700"
        />
        <MetricCard
          title="Avg. Order Value"
          value={
            loading && !stats?.length
              ? "…"
              : (() => {
                  const v = getStat("avgOrderValue");
                  return v != null ? formatCurrency(v) : "—";
                })()
          }
          change={null}
          icon={faChartPie}
          iconColorClass="bg-green-200 text-green-700"
        />
      </div>

      {/* Second Row Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
         title="COD Orders"
         value={
           loading && !stats?.length
             ? "…"
             : (() => {
                 const v = getStat("codOrders");
                 return v != null ? formatCurrency(v) : "—";
                })()
              }
          icon={faBox}
          iconColor Class="bg-purple-200 text-purple-700"
        />
        <MetricCard
          title="Online Orders"
          value={
            loading && !stats?.length
              ? "…"
              : (() => {
                  const v = getStat("onlineOrders");
                  return v != null ? formatCurrency(v) : "—";
                 })()
               }
          icon={faCreditCard}
          iconColorClass="bg-cyan-200 text-cyan-700"
        />
        <MetricCard
          title="Returns/Cancelled"
          value="0"
          change="0%"
          icon={faExchangeAlt}
          iconColorClass="bg-red-200 text-red-700"
        />
        <MetricCard
          title="Products Sold"
          value={
            loading && !stats?.length
              ? "…"
              : (() => {
                  const v = getStat("productsSold");
                  return v != null ? formatCurrency(v) : "—";
                 })()
               }
          icon={faBox}
          iconColorClass="bg-teal-200 text-teal-700"
        />
      </div>

      {/* Charts and Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Sales Overview Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-primary-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Sales Overview
            </h2>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-xs bg-primary-100 text-primary-700 rounded-full">
                This Month
              </button>
              <button className="px-3 py-1 text-xs bg-white text-gray-600 border border-gray-200 rounded-full">
                Last Month
              </button>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis
                  tickFormatter={(value) => `₹${value.toLocaleString()}`}
                />
                <Tooltip
                  formatter={(value) => [`₹${value.toLocaleString()}`]}
                  labelFormatter={(label) => `Month: ${label}`}
                  contentStyle={{
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    border: "none",
                    borderRadius: "8px",
                    color: "white",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#DC3545"
                  strokeWidth={2}
                  dot={{
                    r: 4,
                    fill: "#DC3545",
                    stroke: "#fff",
                    strokeWidth: 2,
                  }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Categories */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-primary-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Top Categories
          </h2>
          <div className="space-y-4">
            {categoryData.map((category, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-xl border border-gray-200"
              >
                <div className="flex items-center space-x-3">
                  <div className={`text-2xl ${category.colorClass}`}>
                    <FontAwesomeIcon
                      icon={
                        index === 0
                          ? faBox
                          : index === 1
                          ? faBox
                          : index === 2
                          ? faBox
                          : faBox
                      }
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">
                      {category.name}
                    </p>
                    <p className="text-xs text-gray-600">
                      {category.value}% of sales
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold text-sm ${category.colorClass}`}>
                    {category.sales}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products and Search Terms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Top Selling Products */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-primary-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Top Selling Products
          </h2>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-xl border border-gray-200"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src="https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                    alt={product.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-800">
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Total Sold {product.totalSold} 
                    </p>
                  </div>
                </div>
                {/* <div className="text-right">
                  <div className="ml-auto bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs font-medium">
                    {product.rank}
                  </div>
                </div> */}
              </div>
            ))}
          </div>
        </div>

        {/* Search Terms Analytics */}
        {/* <div className="bg-white p-6 rounded-xl shadow-sm border border-primary-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            What Parents Search
          </h2>
          <div className="space-y-4">
            {searchTermsData.map((term, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-xl border border-gray-200"
              >
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    "{term.term}"
                  </p>
                  <p className="text-xs text-gray-600">
                    {term.searches.toLocaleString()} searches
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm text-green-600">
                    {term.rate}
                  </p>
                  <p
                    className={`text-xs font-medium ${
                      term.trend.startsWith("+")
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {term.trend}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div> */}

        <div className="bg-white p-6 rounded-xl shadow-sm border border-primary-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Top Buyers
          </h2>
          <div className="space-y-3">
            {topBuyers.map((buyer, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-xl border ${
                  buyer.flag
                    ? "bg-red-50 border-red-200"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-purple-600">
                      {buyer.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <p className="font-semibold text-gray-900 text-sm">
                        {buyer.name}
                      </p>
                    </div>
                    <p className="text-xs text-gray-600">
                      Delhi • {buyer.totalOrders} orders
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm text-green-600">
                    {buyer.totalSpent}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Advanced Analytics */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6"> */}
        {/* Quick Stats */}
        {/* <div className="bg-white p-6 rounded-xl shadow-sm border border-primary-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Quick Stats
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 px-4 bg-yellow-50 rounded-xl">
              <span className="text-gray-700 font-medium text-sm">
                Abandoned Carts
              </span>
              <span className="font-bold text-orange-600">127</span>
            </div>
            <div className="flex justify-between items-center py-3 px-4 bg-blue-50 rounded-xl">
              <span className="text-gray-700 font-medium text-sm">
                Pending Deliveries
              </span>
              <span className="font-bold text-blue-600">89</span>
            </div>
            <div className="flex justify-between items-center py-3 px-4 bg-green-50 rounded-xl">
              <span className="text-gray-700 font-medium text-sm">
                Promo Code Usage
              </span>
              <span className="font-bold text-green-600">23.4%</span>
            </div>
            <div className="flex justify-between items-center py-3 px-4 bg-purple-50 rounded-xl">
              <span className="text-gray-700 font-medium text-sm">
                Refund Volume
              </span>
              <span className="font-bold text-purple-600">₹12,450</span>
            </div>
          </div>
        </div> */}

        {/* Top States */}
        {/* <div className="bg-white p-6 rounded-xl shadow-sm border border-primary-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Top States
          </h2>
          <div className="space-y-3">
            {stateOrdersData.map((state, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-xl border border-gray-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100">
                    <FontAwesomeIcon
                      icon={faMapMarkerAlt}
                      className="text-gray-500"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">
                      {state.state}
                    </p>
                    <p className="text-xs text-gray-600">
                      {state.orders} orders
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm text-indigo-600">
                    {state.Sales}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div> */}

        {/* Top Buyers */}
        {/* <div className="bg-white p-6 rounded-xl shadow-sm border border-primary-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Top Buyers
          </h2>
          <div className="space-y-3">
            {topBuyers.map((buyer, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-xl border ${
                  buyer.flag
                    ? "bg-red-50 border-red-200"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-purple-600">
                      {buyer.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <p className="font-semibold text-gray-900 text-sm">
                        {buyer.name}
                      </p>
                    </div>
                    <p className="text-xs text-gray-600">
                      Delhi • {buyer.totalOrders} orders
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm text-green-600">
                    {buyer.totalSpent}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div> */}
      {/* </div> */}

      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6"> */}
        {/* Top Cities */}
        {/* <div className="bg-white p-6 rounded-xl shadow-sm border border-primary-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Top Cities
          </h2>
          <div className="space-y-3">
            {cityOrdersData.map((city, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-xl border border-gray-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-50">
                    <FontAwesomeIcon icon={faCity} className="text-blue-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">
                      {city.city}
                    </p>
                    <p className="text-xs text-gray-600">
                      {city.orders} orders
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm text-indigo-600">
                    {city.Sales}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div> */}

        {/* Top Postal Codes */}
        {/* <div className="bg-white p-6 rounded-xl shadow-sm border border-primary-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Top Postal Codes
          </h2>
          <div className="space-y-3">
            {postalOrdersData.map((postal, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-xl border border-gray-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-50">
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      className="text-green-500"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">
                      {postal.code}
                    </p>
                    <p className="text-xs text-gray-600">
                      {postal.orders} orders
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm text-indigo-600">
                    {postal.Sales}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div> */}
      {/* </div> */}

      {/* Recent Orders Table */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-primary-100 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
          <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          {loading && !displayOrders.length ? (
            <div className="py-12 text-center text-gray-500">
              <FontAwesomeIcon icon={faSyncAlt} className="animate-spin h-8 w-8 mb-2" />
              <p>Loading recent orders…</p>
            </div>
          ) : !displayOrders.length ? (
            <div className="py-12 text-center text-gray-500">No recent orders</div>
          ) : (
            <table className="min-w-full divide-y divide-primary-100">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    DATE
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    AMOUNT
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    STATUS
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ACTION
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-primary-100">
                {displayOrders.map((order, index) => (
                  <tr
                    key={order.id || index}
                    className="border-b border-gray-50 hover:bg-gray-100 transition-all"
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800">
                      {order.id}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {order.customer}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {order.date}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {order.amount}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          order.status === "Delivered" || order.status === "DELIVERED"
                            ? "bg-green-100 text-green-800"
                            : order.status === "Processing" || order.status === "PROCESSING"
                            ? "bg-yellow-100 text-yellow-800"
                            : order.status === "Shipped" || order.status === "SHIPPED"
                            ? "bg-blue-100 text-blue-800"
                            : order.status === "Bulk Order" || order.status === "BULK_ORDER"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      <button className="text-primary-600 hover:text-primary-700">
                        <FontAwesomeIcon icon={faEllipsisH} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Footer Stats */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl mb-2 text-primary-500">
              <FontAwesomeIcon icon={faSmile} />
            </div>
            <div className="text-2xl font-bold mb-1 text-gray-800">2,847</div>
            <div className="text-sm">Happy Kids This Month</div>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2 text-yellow-500">
              <FontAwesomeIcon icon={faStar} />
            </div>
            <div className="text-2xl font-bold mb-1 text-gray-800">4.8/5</div>
            <div className="text-sm">Customer Rating</div>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2 text-blue-500">
              <FontAwesomeIcon icon={faTruck} />
            </div>
            <div className="text-2xl font-bold mb-1 text-gray-800">24h</div>
            <div className="text-sm">Average Delivery</div>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2 text-green-500">
              <FontAwesomeIcon icon={faPercent} />
            </div>
            <div className="text-2xl font-bold mb-1 text-gray-800">98.2%</div>
            <div className="text-sm">Order Success Rate</div>
          </div>
        </div>
        <div className="text-center mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Dashboard last updated: {lastUpdated.toLocaleString()} •
            <span className="ml-2 inline-flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Real-time sync active
            </span>
          </p>
        </div>
      </div>
    </main>
  );
};

export default Index;
