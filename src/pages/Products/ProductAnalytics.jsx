import React, { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  Legend,
} from "recharts";

/**
 * ProductAnalyticsAdvanced.jsx
 * - Demo-only product analytics dashboard
 * - Date-range filter (uses YYYY-MM from date inputs)
 * - Top section: category sales distribution + top category monthly sales + season/month highlights
 * - Product table: shows totals in the selected range and "View Analytics" (blue text)
 * - Product analytics panel: monthly views & sales charts, highlights max-view month
 *
 * Tailwind classes use border-gray-300 for borders as requested.
 */

const COLORS = [
  "#0ea5a4",
  "#60a5fa",
  "#f97316",
  "#ef4444",
  "#a78bfa",
  "#f59e0b",
];

const monthNamesShort = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function monthLabel(yyyymm) {
  // yyyymm like "2025-07" -> "Jul 2025"
  const [y, m] = yyyymm.split("-");
  const i = parseInt(m, 10) - 1;
  return `${monthNamesShort[i]} ${y}`;
}

function monthToSeason(yyyymm) {
  // Simple season mapping (northern-hemisphere generic)
  const m = parseInt(yyyymm.split("-")[1], 10);
  if (m === 12 || m === 1 || m === 2) return "Winter";
  if (m >= 3 && m <= 5) return "Spring";
  if (m >= 6 && m <= 8) return "Summer";
  return "Autumn";
}

// DEMO DATA: each product has monthlyStats with { month: "YYYY-MM", views, sales }
const DEMO_PRODUCTS = [
  {
    id: 1,
    sku: "KJW-001",
    name: "Kids Winter Jacket",
    category: "Children Clothing",
    monthlyStats: [
      { month: "2025-01", views: 120, sales: 30 },
      { month: "2025-02", views: 150, sales: 45 },
      { month: "2025-03", views: 180, sales: 50 },
      { month: "2025-04", views: 160, sales: 35 },
      { month: "2025-05", views: 140, sales: 28 },
      { month: "2025-06", views: 110, sales: 20 },
      { month: "2025-07", views: 220, sales: 70 },
      { month: "2025-08", views: 240, sales: 80 },
    ],
    dailyStats: [
      { date: "2025-07-01", views: 10, sales: 5 },
      { date: "2025-07-02", views: 12, sales: 6 },
      { date: "2025-07-03", views: 15, sales: 7 },
    ],
    stateStats: [
      { state: "Delhi", views: 50, sales: 20 },
      { state: "Noida", views: 30, sales: 15 },
      { state: "Mumbai", views: 40, sales: 10 },
    ],
  },
  {
    id: 2,
    sku: "TC-002",
    name: "Toy Car - Remote Controlled",
    category: "Toys",
    monthlyStats: [
      { month: "2025-01", views: 80, sales: 12 },
      { month: "2025-02", views: 90, sales: 15 },
      { month: "2025-03", views: 200, sales: 70 },
      { month: "2025-04", views: 160, sales: 40 },
      { month: "2025-05", views: 130, sales: 30 },
      { month: "2025-06", views: 300, sales: 110 },
      { month: "2025-07", views: 400, sales: 150 },
      { month: "2025-08", views: 360, sales: 130 },
    ],
    dailyStats: [
      { date: "2025-07-01", views: 25, sales: 8 },
      { date: "2025-07-02", views: 30, sales: 10 },
      { date: "2025-07-03", views: 35, sales: 12 },
    ],
    stateStats: [
      { state: "Delhi", views: 120, sales: 40 },
      { state: "Bangalore", views: 90, sales: 35 },
      { state: "Chennai", views: 80, sales: 25 },
    ],
  },
  {
    id: 3,
    sku: "BS-003",
    name: "Baby Shoes",
    category: "Children Clothing",
    monthlyStats: [
      { month: "2025-01", views: 60, sales: 8 },
      { month: "2025-02", views: 70, sales: 10 },
      { month: "2025-03", views: 90, sales: 18 },
      { month: "2025-04", views: 95, sales: 20 },
      { month: "2025-05", views: 110, sales: 30 },
      { month: "2025-06", views: 150, sales: 45 },
      { month: "2025-07", views: 170, sales: 55 },
      { month: "2025-08", views: 140, sales: 42 },
    ],
    dailyStats: [
      { date: "2025-07-01", views: 8, sales: 3 },
      { date: "2025-07-02", views: 12, sales: 4 },
      { date: "2025-07-03", views: 15, sales: 6 },
    ],
    stateStats: [
      { state: "Kolkata", views: 40, sales: 12 },
      { state: "Delhi", views: 50, sales: 20 },
      { state: "Lucknow", views: 30, sales: 10 },
    ],
  },
  {
    id: 4,
    sku: "PS-004",
    name: "Puzzle Set",
    category: "Toys",
    monthlyStats: [
      { month: "2025-01", views: 30, sales: 5 },
      { month: "2025-02", views: 40, sales: 6 },
      { month: "2025-03", views: 50, sales: 10 },
      { month: "2025-04", views: 70, sales: 18 },
      { month: "2025-05", views: 65, sales: 15 },
      { month: "2025-06", views: 90, sales: 25 },
      { month: "2025-07", views: 120, sales: 40 },
      { month: "2025-08", views: 110, sales: 35 },
    ],
    dailyStats: [
      { date: "2025-07-01", views: 5, sales: 2 },
      { date: "2025-07-02", views: 7, sales: 3 },
      { date: "2025-07-03", views: 10, sales: 4 },
    ],
    stateStats: [
      { state: "Hyderabad", views: 35, sales: 12 },
      { state: "Pune", views: 40, sales: 15 },
      { state: "Ahmedabad", views: 25, sales: 8 },
    ],
  },
];

export default function ProductAnalyticsAdvanced() {
  // find global earliest & latest months in DEMO_PRODUCTS
  const allMonths = Array.from(
    new Set(DEMO_PRODUCTS.flatMap((p) => p.monthlyStats.map((m) => m.month)))
  ).sort(); // strings YYYY-MM sort lexicographically
  const defaultStart = `${allMonths[0]}-01`; // YYYY-MM-01
  const defaultEnd = `${allMonths[allMonths.length - 1]}-28`;

  const [startDate, setStartDate] = useState(defaultStart); // YYYY-MM-DD
  const [endDate, setEndDate] = useState(defaultEnd); // YYYY-MM-DD
  const [selectedProductId, setSelectedProductId] = useState(null);

  // helper to get YYYY-MM from date input
  const monthFromDate = (dateStr) => (dateStr ? dateStr.slice(0, 7) : null);
  const startMonth = monthFromDate(startDate);
  const endMonth = monthFromDate(endDate);

  // Filter months function (inclusive)
  const filterMonthsInRange = (monthlyStats) =>
    monthlyStats.filter((m) => m.month >= startMonth && m.month <= endMonth);

  // aggregated category sales (for the selected date range)
  const categorySales = useMemo(() => {
    const map = {};
    for (const p of DEMO_PRODUCTS) {
      const filtered = filterMonthsInRange(p.monthlyStats);
      const totalSales = filtered.reduce((s, x) => s + (x.sales || 0), 0);
      map[p.category] = (map[p.category] || 0) + totalSales;
    }
    return Object.entries(map).map(([category, sales]) => ({
      category,
      sales,
    }));
  }, [startMonth, endMonth]);

  // find top category (by sales)
  const topCategory = useMemo(() => {
    if (!categorySales.length) return null;
    return categorySales.slice().sort((a, b) => b.sales - a.sales)[0];
  }, [categorySales]);

  // monthly series for top category
  const topCategoryMonthly = useMemo(() => {
    if (!topCategory) return [];
    const months = allMonths.filter((m) => m >= startMonth && m <= endMonth);
    return months.map((m) => {
      const value = DEMO_PRODUCTS.filter(
        (p) => p.category === topCategory.category
      )
        .flatMap((p) => p.monthlyStats)
        .filter((ms) => ms.month === m)
        .reduce((s, x) => s + (x.sales || 0), 0);
      return { month: m, label: monthLabel(m), sales: value };
    });
  }, [topCategory, startMonth, endMonth, allMonths]);

  // top season for top category
  const topCategorySeason = useMemo(() => {
    if (!topCategoryMonthly.length) return null;
    const seasonMap = {};
    topCategoryMonthly.forEach((row) => {
      const s = monthToSeason(row.month);
      seasonMap[s] = (seasonMap[s] || 0) + row.sales;
    });
    const entries = Object.entries(seasonMap);
    if (!entries.length) return null;
    const [season, val] = entries.sort((a, b) => b[1] - a[1])[0];
    return { season, sales: val };
  }, [topCategoryMonthly]);

  // product totals in range (for table)
  const productsWithTotals = useMemo(() => {
    return DEMO_PRODUCTS.map((p) => {
      const filtered = filterMonthsInRange(p.monthlyStats);
      const totalSales = filtered.reduce((s, x) => s + (x.sales || 0), 0);
      const totalViews = filtered.reduce((s, x) => s + (x.views || 0), 0);
      // include monthlySeries for quick modal usage
      const monthlySeries = filtered.map((m) => ({
        month: m.month,
        label: monthLabel(m.month),
        views: m.views,
        sales: m.sales,
      }));
      return { ...p, totalSales, totalViews, monthlySeries };
    });
  }, [startMonth, endMonth]);

  const selectedProduct = productsWithTotals.find(
    (p) => p.id === selectedProductId
  );

  // product-level chart data and highlight the month with max views
  const productViewsMaxMonth = useMemo(() => {
    if (!selectedProduct) return null;
    const arr = selectedProduct.monthlySeries;
    if (!arr.length) return null;
    const max = arr.reduce(
      (mx, cur) => (cur.views > mx.views ? cur : mx),
      arr[0]
    );
    return max.month; // YYYY-MM
  }, [selectedProduct]);

  return (
    <div className="p-4 flex-1 overflow-y-auto space-y-6">
      <h2 className="text-xl font-semibold mb-2">
        📊 Product Performance Analytics
      </h2>

      {/* Date filters */}
      <div className="flex gap-3 items-end">
        <div>
          <label className="block text-sm text-gray-700">Start date</label>
          <input
            type="date"
            value={startDate}
            max={endDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700">End date</label>
          <input
            type="date"
            value={endDate}
            min={startDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1"
          />
        </div>

        <div className="ml-auto text-sm text-gray-600">
          Showing months: <strong>{startMonth}</strong> →{" "}
          <strong>{endMonth}</strong>
        </div>
      </div>

      {/* Top charts area */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Category sales bar */}
        <div className="p-4 border border-gray-300 rounded-lg bg-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-sm">Sales by Category</h3>
            <div className="text-xs text-gray-500">
              Sum of sales in selected range
            </div>
          </div>
          <div style={{ height: 160 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categorySales}
                margin={{ top: 8, bottom: 8, left: 0, right: 0 }}
              >
                <XAxis dataKey="category" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales">
                  {categorySales.map((entry, idx) => (
                    <Cell
                      key={`cell-${idx}`}
                      fill={COLORS[idx % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top category small chart */}
        <div className="p-4 border border-gray-300 rounded-lg bg-white">
          <h3 className="font-medium text-sm mb-2">Top Category</h3>
          {topCategory ? (
            <>
              <div className="text-sm text-gray-700 font-semibold mb-1">
                {topCategory.category}
              </div>
              <div className="text-xs text-gray-500 mb-2">
                Total sales: {topCategory.sales}
              </div>

              <div style={{ height: 120 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={topCategoryMonthly}
                    margin={{ top: 4, bottom: 4 }}
                  >
                    <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="sales" fill="#60a5fa" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-2 text-sm text-gray-600">
                Top season: <strong>{topCategorySeason?.season || "—"}</strong>
                <br />
                Best month:{" "}
                <strong>
                  {topCategoryMonthly.length
                    ? topCategoryMonthly
                        .slice()
                        .sort((a, b) => b.sales - a.sales)[0].label
                    : "—"}
                </strong>
              </div>
            </>
          ) : (
            <div className="text-sm text-gray-500">No category data</div>
          )}
        </div>

        {/* Pie distribution (categories) */}
        <div className="p-4 border border-gray-300 rounded-lg bg-white">
          <h3 className="font-medium text-sm mb-2">Category Distribution</h3>
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categorySales}
                  dataKey="sales"
                  nameKey="category"
                  innerRadius={30}
                  outerRadius={60}
                  paddingAngle={4}
                >
                  {categorySales.map((entry, idx) => (
                    <Cell
                      key={`cell-${idx}`}
                      fill={COLORS[idx % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Product table */}
      <div className="overflow-x-auto border border-gray-300 rounded-lg bg-white">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border-r border-gray-300">Sr No.</th>
              <th className="px-4 py-2 border-r border-gray-300">Product ID</th>
              <th className="px-4 py-2 border-r border-gray-300">Product</th>
              <th className="px-4 py-2 border-r border-gray-300">Category</th>
              <th className="px-4 py-2 border-r border-gray-300">
                Total Sales
              </th>
              <th className="px-4 py-2 border-r border-gray-300">
                Total Views
              </th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {productsWithTotals.map((p, idx) => (
              <tr
                key={p.id}
                className={`hover:bg-gray-50 ${
                  selectedProductId === p.id ? "bg-blue-50" : ""
                }`}
              >
                <td className="px-4 py-2 border-t border-r border-gray-300">
                  {idx + 1}
                </td>
                <td className="px-4 py-2 border-t border-r border-gray-300">
                  {p.sku}
                </td>
                <td className="px-4 py-2 border-t border-r border-gray-300">
                  {p.name}
                </td>
                <td className="px-4 py-2 border-t border-r border-gray-300">
                  {p.category}
                </td>
                <td className="px-4 py-2 border-t border-r border-gray-300">
                  {p.totalSales}
                </td>
                <td className="px-4 py-2 border-t border-r border-gray-300">
                  {p.totalViews}
                </td>
                <td className="px-4 py-2 border-t">
                  <span
                    onClick={() => setSelectedProductId(p.id)}
                    className="text-blue-600 hover:underline cursor-pointer"
                  >
                    View Analytics
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Selected product analytics panel */}
      {selectedProduct && (
        <div className="mt-4 p-4 border border-gray-300 rounded-lg bg-white space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">{selectedProduct.name}</h3>
              <div className="text-sm text-gray-500">
                {selectedProduct.category} • {selectedProduct.sku}
              </div>
            </div>
            <div>
              <button
                onClick={() => setSelectedProductId(null)}
                className="text-sm px-2 py-1 border border-gray-300 rounded"
              >
                Close
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Views by month (highlight max) */}
            <div className="p-3 border border-gray-300 rounded-lg">
              <div className="text-sm font-medium mb-2">Monthly Views</div>
              <div style={{ height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={selectedProduct.monthlySeries}
                    margin={{ top: 4, bottom: 4 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="views">
                      {selectedProduct.monthlySeries.map((entry) => (
                        <Cell
                          key={entry.month}
                          fill={
                            entry.month === productViewsMaxMonth
                              ? "#1e40af"
                              : "#60a5fa"
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                Highest views:{" "}
                <strong>
                  {productViewsMaxMonth
                    ? monthLabel(productViewsMaxMonth)
                    : "—"}
                </strong>
              </div>
            </div>

            {/* Sales by month */}
            <div className="p-3 border border-gray-300 rounded-lg">
              <div className="text-sm font-medium mb-2">Monthly Sales</div>
              <div style={{ height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={selectedProduct.monthlySeries}
                    margin={{ top: 4, bottom: 4 }}
                  >
                    <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="sales" fill="#34d399" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Daily stats */}
            <div className="p-3 border border-gray-300 rounded-lg">
              <div className="text-sm font-medium mb-2">
                Daily Views & Sales
              </div>
              <div style={{ height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={selectedProduct.dailyStats || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="views" fill="#60a5fa" />
                    <Bar dataKey="sales" fill="#34d399" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* State-wise stats */}
            <div className="p-3 border border-gray-300 rounded-lg">
              <div className="text-sm font-medium mb-2">
                State-wise Distribution
              </div>
              <div style={{ height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={selectedProduct.stateStats || []}
                    layout="vertical"
                    margin={{ top: 10, right: 30, left: 40, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis
                      dataKey="state"
                      type="category"
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="views" fill="#f59e0b" />
                    <Bar dataKey="sales" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
