import React, { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  Legend,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Users,
  DollarSign,
  X,
  MapPin,
  RefreshCw,
  UserPlus,
  Truck,
  Package,
} from "lucide-react";
import api from "../../api/axios";
import axios from "axios";

const dashboardData = {
  sales: [
    {
      name: "Jan",
      sales: 4500,
      orders: 120,
      traffic: 2400,
      returns: 45,
      signups: 75,
      cod: 80,
      prepaid: 40,
    },
    {
      name: "Feb",
      sales: 5200,
      orders: 145,
      traffic: 2800,
      returns: 52,
      signups: 82,
      cod: 95,
      prepaid: 50,
    },
    {
      name: "Mar",
      sales: 4800,
      orders: 135,
      traffic: 2600,
      returns: 38,
      signups: 91,
      cod: 85,
      prepaid: 50,
    },
    {
      name: "Apr",
      sales: 6200,
      orders: 168,
      traffic: 3200,
      returns: 62,
      signups: 105,
      cod: 110,
      prepaid: 58,
    },
    {
      name: "May",
      sales: 7100,
      orders: 195,
      traffic: 3800,
      returns: 71,
      signups: 120,
      cod: 130,
      prepaid: 65,
    },
    {
      name: "Jun",
      sales: 8300,
      orders: 220,
      traffic: 4200,
      returns: 83,
      signups: 145,
      cod: 150,
      prepaid: 70,
    },
    {
      name: "Jul",
      sales: 7800,
      orders: 210,
      traffic: 4000,
      returns: 78,
      signups: 132,
      cod: 140,
      prepaid: 70,
    },
  ],
  stats: [
    {
      title: "Total Sales",
      value: "₹24,780",
      change: "+12.5%",
      changeType: "positive",
      icon: DollarSign,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Total Orders",
      value: "1,245",
      change: "+8.2%",
      changeType: "positive",
      icon: ShoppingCart,
      bgColor: "bg-amber-100",
      iconColor: "text-amber-600",
    },
    {
      title: "Total Customers",
      value: "342",
      change: "+5.3%",
      changeType: "positive",
      icon: Users,
      bgColor: "bg-pink-100",
      iconColor: "text-pink-600",
    },
    {
      title: "Avg. Order Value",
      value: "₹45.67",
      change: "+3.1%",
      changeType: "positive",
      icon: TrendingUp,
      bgColor: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
    // {
    //   title: "Refund Volume",
    //   value: "₹2,340",
    //   change: "-2.1%",
    //   changeType: "negative",
    //   icon: RefreshCw,
    //   bgColor: "bg-red-100",
    //   iconColor: "text-red-600",
    // },
    // {
    //   title: "Cancelled Orders",
    //   value: "18",
    //   change: "-5.2%",
    //   changeType: "negative",
    //   icon: X,
    //   bgColor: "bg-orange-100",
    //   iconColor: "text-orange-600",
    // },
    // {
    //   title: "Daily Traffic",
    //   value: "4,200",
    //   change: "+15.3%",
    //   changeType: "positive",
    //   icon: Users,
    //   bgColor: "bg-purple-100",
    //   iconColor: "text-purple-600",
    // },
    // {
    //   title: "Returning Customers",
    //   value: "156",
    //   change: "+7.8%",
    //   changeType: "positive",
    //   icon: Users,
    //   bgColor: "bg-indigo-100",
    //   iconColor: "text-indigo-600",
    // },
  ],
  topProducts: [
    { name: "Cuddly Teddy Bear", sales: 32, rank: 1, image: "🧸" },
    { name: "Colorful Building Blocks", sales: 28, rank: 2, image: "🧱" },
    { name: "Princess Doll Set", sales: 25, rank: 3, image: "👸" },
    { name: "Animal Puzzle", sales: 21, rank: 4, image: "🧩" },
    { name: "Remote Control Car", sales: 18, rank: 5, image: "🚗" },
  ],
  deviceData: [
    { name: "Web", value: 65, color: "#60A5FA" },
    { name: "Mobile App", value: 35, color: "#34D399" },
  ],
  cityData: [
    { city: "Mumbai", sales: 12500, orders: 340 },
    { city: "Delhi", sales: 11200, orders: 298 },
    { city: "Bangalore", sales: 9800, orders: 267 },
    { city: "Chennai", sales: 8900, orders: 245 },
    { city: "Kolkata", sales: 7600, orders: 198 },
  ],
  recentOrders: [
    {
      id: "#PP-8744",
      customer: "Emily Johnson",
      date: "Jun 12, 2023",
      amount: 899.99,
      status: "Delivered",
    },
    {
      id: "#PP-8743",
      customer: "Michael Brown",
      date: "Jun 11, 2023",
      amount: 1124.5,
      status: "Processing",
    },
    {
      id: "#PP-8742",
      customer: "Sarah Wilson",
      date: "Jun 10, 2023",
      amount: 567.99,
      status: "Shipped",
    },
  ],
};

const StatCard = ({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  bgColor,
  iconColor,
}) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p
          className={`text-xs flex items-center mt-2 ${
            changeType === "positive" ? "text-emerald-600" : "text-rose-500"
          }`}
        >
          {changeType === "positive" ? (
            <TrendingUp className="w-3 h-3 mr-1" />
          ) : (
            <TrendingDown className="w-3 h-3 mr-1" />
          )}
          {change} from last month
        </p>
      </div>
      <div className={`p-3 rounded-xl ${bgColor}`}>
        <Icon className={`w-6 h-6 ${iconColor}`} />
      </div>
    </div>
  </div>
);

const ChartCard = ({ title, children, className = "" }) => (
  <div
    className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 ${className}`}
  >
    <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
    {children}
  </div>
);

const LineAndBarChart = ({
  data,
  title,
  lineKey,
  barKey,
  lineColor,
  barColor,
}) => (
  <ChartCard title={title}>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis dataKey="name" stroke="#64748b" />
        <YAxis stroke="#64748b" />
        <Tooltip
          contentStyle={{
            backgroundColor: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
          }}
        />
        <Bar dataKey={barKey} fill={barColor} radius={4} />
        <Line
          type="monotone"
          dataKey={lineKey}
          stroke={lineColor}
          strokeWidth={2}
        />
      </BarChart>
    </ResponsiveContainer>
  </ChartCard>
);

const SalesOverviewChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
      <XAxis dataKey="name" stroke="#64748b" />
      <YAxis stroke="#64748b" />
      <Tooltip
        contentStyle={{
          backgroundColor: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "8px",
        }}
      />
      <Line type="monotone" dataKey="sales" stroke="#dc2626" strokeWidth={3} />
    </LineChart>
  </ResponsiveContainer>
);

const AverageOrderValueChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <AreaChart data={data}>
      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
      <XAxis dataKey="name" stroke="#64748b" />
      <YAxis stroke="#64748b" />
      <Tooltip
        contentStyle={{
          backgroundColor: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "8px",
        }}
      />
      <Area
        type="monotone"
        dataKey="sales"
        stroke="#10b981"
        fill="#10b981"
        fillOpacity={0.2}
      />
    </AreaChart>
  </ResponsiveContainer>
);

const DailyTrafficChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
      <XAxis dataKey="name" stroke="#64748b" />
      <YAxis stroke="#64748b" />
      <Tooltip
        contentStyle={{
          backgroundColor: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "8px",
        }}
      />
      <Bar dataKey="traffic" fill="#60a5fa" radius={4} />
      <Bar dataKey="sales" fill="#34d399" radius={4} />
    </BarChart>
  </ResponsiveContainer>
);

const OrdersReturnsChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
      <XAxis dataKey="name" stroke="#64748b" />
      <YAxis stroke="#64748b" />
      <Tooltip
        contentStyle={{
          backgroundColor: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "8px",
        }}
      />
      <Line
        type="monotone"
        dataKey="orders"
        stroke="#6366f1"
        strokeWidth={3}
        name="Orders"
      />
      <Line
        type="monotone"
        dataKey="returns"
        stroke="#f59e0b"
        strokeWidth={3}
        name="Returns"
      />
      <Legend />
    </LineChart>
  </ResponsiveContainer>
);

const NewSignUpsChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <AreaChart data={data}>
      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
      <XAxis dataKey="name" stroke="#64748b" />
      <YAxis stroke="#64748b" />
      <Tooltip
        contentStyle={{
          backgroundColor: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "8px",
        }}
      />
      <Area
        type="monotone"
        dataKey="signups"
        stroke="#8b5cf6"
        fill="#8b5cf6"
        fillOpacity={0.2}
      />
    </AreaChart>
  </ResponsiveContainer>
);

const OrderTypeChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
      <XAxis dataKey="name" stroke="#64748b" />
      <YAxis stroke="#64748b" />
      <Tooltip
        contentStyle={{
          backgroundColor: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "8px",
        }}
      />
      <Bar dataKey="cod" fill="#4f46e5" name="COD" radius={4} />
      <Bar dataKey="prepaid" fill="#22c55e" name="Prepaid" radius={4} />
      <Legend />
    </BarChart>
  </ResponsiveContainer>
);

const DeviceSourcePieChart = ({ data }) => (
  <>
    <div className="flex items-center justify-center">
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, value }) => `${name}: ${value}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
    <div className="flex justify-center space-x-6 mt-4">
      {data.map((entry, index) => (
        <div key={index} className="flex items-center space-x-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          ></div>
          <span className="text-sm text-gray-600">
            {entry.name}: {entry.value}%
          </span>
        </div>
      ))}
    </div>
  </>
);

const TopProductsList = ({ products }) => (
  <div className="space-y-4">
    {products.map((product, index) => (
      <div
        key={index}
        className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow"
      >
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-xl shadow-sm border border-gray-200">
            {product.image}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{product.name}</p>
            <p className="text-sm text-gray-500">
              {product.sales} sales this month
            </p>
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            product.rank === 1
              ? "bg-rose-100 text-rose-600"
              : product.rank === 2
              ? "bg-amber-100 text-amber-600"
              : product.rank === 3
              ? "bg-orange-100 text-orange-600"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          #{product.rank}
        </span>
      </div>
    ))}
  </div>
);

const TopCitiesList = ({ cities }) => (
  <div className="space-y-4">
    {cities.map((city, index) => (
      <div
        key={index}
        className="flex items-center justify-between p-4 border-l-4 border-blue-400 bg-gradient-to-r from-blue-50 to-white rounded-lg hover:shadow-md transition-shadow"
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <MapPin className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">{city.city}</p>
            <p className="text-sm text-gray-500">{city.orders} orders</p>
          </div>
        </div>
        <span className="font-bold text-gray-900">
          ₹{city.sales.toLocaleString()}
        </span>
      </div>
    ))}
  </div>
);

const RecentOrdersTable = ({ orders }) => (
  <>
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-gray-200">
            {["Order ID", "Customer", "Date", "Amount", "Status", "Action"].map(
              (header) => (
                <th
                  key={header}
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  {header}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr
              key={index}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">
                {order.id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {order.customer}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {order.date}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                ₹{order.amount}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    order.status === "Delivered"
                      ? "bg-green-100 text-green-800"
                      : order.status === "Processing"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {order.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                <button className="hover:text-gray-600">•••</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="mt-4 flex justify-end">
      {/* <button className="text-rose-600 hover:text-rose-800 font-medium text-sm">
        View All
      </button> */}
    </div>
  </>
);

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("This Month");
  const [remote, setRemote] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/dashboard/stats");
        setRemote(res.data);
        console.log(res.data)
      } catch (e) {
        console.error("Failed to load dashboard stats:", e);
      }
    };
    fetchStats();
  }, []);

  const statsWithUi = useMemo(() => {
    const stats = remote?.stats || dashboardData.stats.map((s) => ({
      key: s.title,
      title: s.title,
      value: s.value,
      // changePct: typeof s.change === "string" ? Number(String(s.change).replace("%", "")) : 0,
    }));

    const uiByKey = {
      totalSales: {
        icon: DollarSign,
        bgColor: "bg-blue-100",
        iconColor: "text-blue-600",
        format: (v) => `₹${Number(v || 0).toLocaleString()}`,
      },
      totalOrders: {
        icon: ShoppingCart,
        bgColor: "bg-amber-100",
        iconColor: "text-amber-600",
        format: (v) => Number(v || 0).toLocaleString(),
      },
      newCustomers: {
        icon: Users,
        bgColor: "bg-pink-100",
        iconColor: "text-pink-600",
        format: (v) => Number(v || 0).toLocaleString(),
      },
      avgOrderValue: {
        icon: TrendingUp,
        bgColor: "bg-emerald-100",
        iconColor: "text-emerald-600",
        format: (v) => `₹${Number(v || 0).toFixed(2)}`,
      },
    };

    return stats.map((s) => {
      const ui = uiByKey[s.key] || {
        icon: DollarSign,
        bgColor: "bg-gray-100",
        iconColor: "text-gray-600",
        format: (v) => String(v ?? ""),
      };
      const changePct = Number(s.changePct) || 0;
      return {
        title: s.title,
        value: ui.format(s.value),
        change: `${Math.abs(changePct).toFixed(1)}%`,
        changeType: changePct >= 0 ? "positive" : "negative",
        icon: ui.icon,
        bgColor: ui.bgColor,
        iconColor: ui.iconColor,
      };
    });
  }, [remote]);

  const recentOrders = remote?.recentOrders || dashboardData.recentOrders;
  const salesData = dashboardData.sales;

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
      <style jsx global>
        {`
          @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");
          body {
            font-family: "Inter", sans-serif;
          }
        `}
      </style>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsWithUi.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>
      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ChartCard title="Total Sales">
          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => setActiveTab("This Month")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "This Month"
                  ? "bg-red-100 text-red-600"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              This Month
            </button>
            <button
              onClick={() => setActiveTab("Last Month")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "Last Month"
                  ? "bg-red-100 text-red-600"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              Last Month
            </button>
          </div>
          <SalesOverviewChart data={salesData} />
        </ChartCard>
        <ChartCard title="Average Order Value Trend">
          <AverageOrderValueChart data={salesData} />
        </ChartCard>
        <ChartCard title="Daily Traffic & Sales">
          <DailyTrafficChart data={salesData} />
        </ChartCard>
        <ChartCard title="New Sign-Ups">
          <NewSignUpsChart data={salesData} />
        </ChartCard>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ChartCard title="Total Orders (COD vs. Prepaid)">
          <OrderTypeChart data={salesData} />
        </ChartCard>
        <ChartCard title="Order Count vs. Returns">
          <OrdersReturnsChart data={salesData} />
        </ChartCard>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard title="Top-Selling Products" className="lg:col-span-1">
          <TopProductsList products={dashboardData.topProducts} />
        </ChartCard>
        <ChartCard title="Device Source Split">
          <DeviceSourcePieChart data={dashboardData.deviceData} />
        </ChartCard>
        <ChartCard title="Top Cities by Sales">
          <TopCitiesList cities={dashboardData.cityData} />
        </ChartCard>
      </div> */}
      <ChartCard title="Recent Orders" className="mt-6">
        <RecentOrdersTable orders={recentOrders} />
      </ChartCard>
    </div>
  );
};

export default Dashboard;
