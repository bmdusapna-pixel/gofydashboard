import React, { useState } from "react";
import { CheckCircle, Clock, AlertTriangle } from "lucide-react";

// Updated logs with more user, system, product and review actions
const allLogs = [
  {
    id: 1,
    user: "Admin John",
    action: "Edited Product",
    target: "Nike Shoes",
    date: "Aug 28, 2025 – 10:32 AM",
    status: "Success",
  },
  {
    id: 2,
    user: "User Priya",
    action: "Approved Review",
    target: "Bag (Review #123)",
    date: "Aug 27, 2025 – 7:15 PM",
    status: "Success",
  },
  {
    id: 3,
    user: "Admin Raj",
    action: "Updated Status",
    target: "Order #456 → Shipped",
    date: "Aug 27, 2025 – 6:50 PM",
    status: "Pending",
  },
  {
    id: 4,
    user: "Admin Meena",
    action: "Deleted Product",
    target: "Old Watch Model",
    date: "Aug 26, 2025 – 5:10 PM",
    status: "Failed",
  },
  {
    id: 5,
    user: "User Alex",
    action: "Registered New User Account",
    target: "Alex's Account",
    date: "Aug 26, 2025 – 4:30 PM",
    status: "Success",
  },
  {
    id: 6,
    user: "System",
    action: "System Backup Initiated",
    target: "Database",
    date: "Aug 26, 2025 – 2:00 AM",
    status: "Success",
  },
  {
    id: 7,
    user: "User Ben",
    action: "Submitted Review",
    target: "Jacket (Review #124)",
    date: "Aug 25, 2025 – 9:00 PM",
    status: "Pending",
  },
  {
    id: 8,
    user: "Admin Chris",
    action: "Added New Product",
    target: "Winter Coat",
    date: "Aug 25, 2025 – 11:45 AM",
    status: "Success",
  },
  {
    id: 9,
    user: "User Olivia",
    action: "User Login Attempt",
    target: "Olivia's Account",
    date: "Aug 24, 2025 – 10:00 AM",
    status: "Failed",
  },
  {
    id: 10,
    user: "System",
    action: "Server Health Check",
    target: "Web Server",
    date: "Aug 24, 2025 – 1:00 AM",
    status: "Success",
  },
  {
    id: 11,
    user: "User John",
    action: "Updated User Profile",
    target: "John's Profile",
    date: "Aug 23, 2025 – 9:00 AM",
    status: "Success",
  },
  {
    id: 12,
    user: "User Jane",
    action: "Requested User Password Reset",
    target: "Jane's Account",
    date: "Aug 22, 2025 – 3:30 PM",
    status: "Success",
  },
  {
    id: 13,
    user: "Admin",
    action: "Deactivated User Account",
    target: "Inactive User",
    date: "Aug 21, 2025 – 11:00 AM",
    status: "Success",
  },
  {
    id: 14,
    user: "User Mike",
    action: "Failed User Login Attempt",
    target: "Mike's Account",
    date: "Aug 21, 2025 – 8:00 AM",
    status: "Failed",
  },
];

// Component containing only the tabs and the table
const ActivityLogsTable = () => {
  const [activeTab, setActiveTab] = useState("all");

  const getFilteredLogs = () => {
    if (activeTab === "all") return allLogs;
    if (activeTab === "products")
      return allLogs.filter((l) => l.action.toLowerCase().includes("product"));
    if (activeTab === "reviews")
      return allLogs.filter((l) => l.action.toLowerCase().includes("review"));
    if (activeTab === "users")
      return allLogs.filter((l) => l.action.toLowerCase().includes("user"));
    if (activeTab === "system")
      return allLogs.filter((l) => l.action.toLowerCase().includes("system"));
    return allLogs;
  };

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <h1 className="sm:text-xl text-lg font-semibold mb-6 text-gray-800">
        Activity Logs
      </h1>
      {/* Tabs for filtering logs */}
      <div className="flex gap-3 mb-4">
        {["all", "products", "reviews", "users", "system"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === tab
                ? "text-white shadow"
                : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
            }`}
            style={{
              backgroundColor: activeTab === tab ? "#00BBAE" : "",
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Table to display the logs */}
      <div className="bg-white shadow rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-blue-50 text-left">
            <tr>
              <th className="p-3">User</th>
              <th className="p-3">Action</th>
              <th className="p-3">Target</th>
              <th className="p-3">Date & Time</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {getFilteredLogs().map((l) => (
              <tr
                key={l.id}
                className="border-t border-gray-300 hover:bg-gray-50"
              >
                <td className="p-3">{l.user}</td>
                <td className="p-3">{l.action}</td>
                <td className="p-3">{l.target}</td>
                <td className="p-3 text-gray-500">{l.date}</td>
                <td className="p-3">
                  {l.status === "Success" && (
                    <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                      <CheckCircle size={16} /> {l.status}
                    </span>
                  )}
                  {l.status === "Pending" && (
                    <span className="flex items-center gap-1 text-yellow-600 text-sm font-medium">
                      <Clock size={16} /> {l.status}
                    </span>
                  )}
                  {l.status === "Failed" && (
                    <span className="flex items-center gap-1 text-red-600 text-sm font-medium">
                      <AlertTriangle size={16} /> {l.status}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActivityLogsTable;
