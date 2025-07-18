import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto"; // Use 'chart.js/auto' for automatic registration of controllers, elements, etc.
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDollarSign,
  faShoppingBag,
  faUserPlus,
  faChartPie,
  faEllipsisH,
} from "@fortawesome/free-solid-svg-icons";

const Index = () => {
  const chartRef = useRef(null); // Create a ref to hold the canvas element
  const chartInstance = useRef(null); // Create a ref to hold the Chart.js instance

  useEffect(() => {
    // Ensure the canvas element exists before trying to create a chart
    if (chartRef.current) {
      // If a chart instance already exists, destroy it before creating a new one
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext("2d"); // Get the 2D rendering context

      chartInstance.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
          datasets: [
            {
              label: "Sales",
              data: [4500, 5200, 4800, 6100, 7300, 8200, 7900],
              backgroundColor: "rgba(220, 53, 69, 0.1)", // Corresponds to primary-500 red if defined
              borderColor: "rgba(220, 53, 69, 1)",
              borderWidth: 2,
              tension: 0.4,
              fill: true,
              pointBackgroundColor: "rgba(220, 53, 69, 1)",
              pointBorderColor: "#fff",
              pointBorderWidth: 2,
              pointRadius: 4,
              pointHoverRadius: 6,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              titleFont: {
                size: 14,
              },
              bodyFont: {
                size: 12,
              },
              padding: 12,
              usePointStyle: true,
              callbacks: {
                label: function (context) {
                  return "$" + context.parsed.y.toLocaleString();
                },
              },
            },
          },
          scales: {
            x: {
              grid: {
                display: false,
              },
              ticks: {
                color: "#6B7280", // Tailwind's gray-500
              },
            },
            y: {
              grid: {
                color: "rgba(229, 231, 235, 1)", // Tailwind's primary-100 or gray-200
                drawBorder: false,
              },
              ticks: {
                color: "#6B7280", // Tailwind's gray-500
                callback: function (value) {
                  return "$" + value.toLocaleString();
                },
              },
            },
          },
        },
      });
    }

    // Cleanup function: Destroy the chart instance when the component unmounts
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []); // Empty dependency array means this effect runs only once after the initial render

  return (
    <main className="flex-1 overflow-y-auto p-4 bg-primary-50">
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Light Blue Card (Darker) */}
        <div className="bg-blue-100 p-6 rounded-xl shadow-sm border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">$24,780</p>
              <p className="text-xs text-blue-600 mt-1">
                <span className="font-semibold">+12.5%</span> from last month
              </p>
            </div>
            <div className="p-3 rounded-lg bg-blue-200 text-blue-700">
              <FontAwesomeIcon icon={faDollarSign} />
            </div>
          </div>
        </div>
        {/* Yellow Card (Darker) */}
        <div className="bg-yellow-100 p-6 rounded-xl shadow-sm border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">1,245</p>
              <p className="text-xs text-yellow-700 mt-1">
                <span className="font-semibold">+8.2%</span> from last month
              </p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-200 text-yellow-700">
              <FontAwesomeIcon icon={faShoppingBag} />
            </div>
          </div>
        </div>
        {/* Red Card (Darker) */}
        <div className="bg-red-100 p-6 rounded-xl shadow-sm border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">New Customers</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">342</p>
              <p className="text-xs text-red-600 mt-1">
                <span className="font-semibold">+5.3%</span> from last month
              </p>
            </div>
            <div className="p-3 rounded-lg bg-red-200 text-red-700">
              <FontAwesomeIcon icon={faUserPlus} />
            </div>
          </div>
        </div>
        {/* Green Card (Darker) */}
        <div className="bg-green-100 p-6 rounded-xl shadow-sm border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Avg. Order Value
              </p>
              <p className="text-2xl font-bold text-gray-800 mt-1">$45.67</p>
              <p className="text-xs text-green-600 mt-1">
                <span className="font-semibold">+3.1%</span> from last month
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-200 text-green-700">
              <FontAwesomeIcon icon={faChartPie} />
            </div>
          </div>
        </div>
      </div>
      {/* Charts and tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Sales chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-primary-100 lg:col-span-2">
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
          {/* This is where your Chart.js canvas will be rendered */}
          <div className="h-64">
            <canvas ref={chartRef} id="sales-chart"></canvas>
          </div>
        </div>
        {/* Top products */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-primary-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Top Selling Toys
          </h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <img
                src="https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                alt="Teddy Bear"
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-800">
                  Cuddly Teddy Bear
                </p>
                <p className="text-xs text-gray-500">32 sales this month</p>
              </div>
              <div className="ml-auto bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs font-medium">
                #1
              </div>
            </div>
            <div className="flex items-center">
              <img
                src="https://images.unsplash.com/photo-1608315124033-0a704e5ac541?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1472&q=80"
                alt="Building Blocks"
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-800">
                  Colorful Building Blocks
                </p>
                <p className="text-xs text-gray-500">28 sales this month</p>
              </div>
              <div className="ml-auto bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs font-medium">
                #2
              </div>
            </div>
            <div className="flex items-center">
              <img
                src="https://images.unsplash.com/photo-1580480055273-228ff5388ef8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
                alt="Doll"
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-800">
                  Princess Doll Set
                </p>
                <p className="text-xs text-gray-500">25 sales this month</p>
              </div>
              <div className="ml-auto bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs font-medium">
                #3
              </div>
            </div>
            <div className="flex items-center">
              <img
                src="https://images.unsplash.com/photo-1594782910203-7b1bd16a20b9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                alt="Puzzle"
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-800">
                  Animal Puzzle
                </p>
                <p className="text-xs text-gray-500">21 sales this month</p>
              </div>
              <div className="ml-auto bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs font-medium">
                #4
              </div>
            </div>
            <div className="flex items-center">
              <img
                src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                alt="Remote Car"
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-800">
                  Remote Control Car
                </p>
                <p className="text-xs text-gray-500">18 sales this month</p>
              </div>
              <div className="ml-auto bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs font-medium">
                #5
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Recent orders */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-primary-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
          <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
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
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
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
              <tr>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800">
                  #PP-8744
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                  Emily Johnson
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                  Jun 12, 2023
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                  $89.99
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                    Delivered
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                  <button className="text-primary-600 hover:text-primary-700">
                    <FontAwesomeIcon icon={faEllipsisH} />
                  </button>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800">
                  #PP-8743
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                  Michael Brown
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                  Jun 11, 2023
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                  $124.50
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                    Processing
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                  <button className="text-primary-600 hover:text-primary-700">
                    <FontAwesomeIcon icon={faEllipsisH} />
                  </button>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800">
                  #PP-8742
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                  Sarah Wilson
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                  Jun 10, 2023
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                  $67.99
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                    Shipped
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                  <button className="text-primary-600 hover:text-primary-700">
                    <FontAwesomeIcon icon={faEllipsisH} />
                  </button>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800">
                  #PP-8741
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                  David Miller
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                  Jun 9, 2023
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                  $156.75
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                    Delivered
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                  <button className="text-primary-600 hover:text-primary-700">
                    <FontAwesomeIcon icon={faEllipsisH} />
                  </button>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800">
                  #PP-8740
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                  Jessica Davis
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                  Jun 8, 2023
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                  $45.99
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                    Cancelled
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                  <button className="text-primary-600 hover:text-primary-700">
                    <FontAwesomeIcon icon={faEllipsisH} />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default Index;
