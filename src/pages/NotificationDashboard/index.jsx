import React, { useState } from "react";
import {
  Eye,
  Edit,
  Trash2,
  Pause,
  Play,
  Plus,
  Book,
  Zap,
  Copy,
} from "lucide-react";
import NotificationFormModal from "./NotificationFormModal.jsx";

const initialNotifications = [
  {
    id: 1,
    title:
      "CA Inter Costing Titan - MCQ Practice Book 🌟 Just ₹198 | Limited Offer",
    message:
      "Ace the 30 Marks Costing Section Effortlessly! 💯 1000+ Chapter-wise MCQs (Theory + Practical) + 100+ Case Study-Based MCQs ✅ Covers All Topics & ICAI MCQs ✅ Detailed Solutions for Every Question",
    icon: Book,
    sentAt: "19 Sep 2025, 6:00 PM",
    type: "Scheduled",
    platform: "Web",
    customers: 2990,
    status: "Active",
  },
  {
    id: 2,
    title:
      "CA Inter Costing Titan - MCQ Practice Book 🌟 Just ₹198 | Limited Offer",
    message:
      "Ace the 30 Marks Costing Section Effortlessly! 💯 1000+ Chapter-wise MCQs (Theory + Practical) + 100+ Case Study-Based MCQs ✅ Covers All Topics & ICAI MCQs ✅ Detailed Solutions for Every Question",
    icon: Book,
    sentAt: "19 Sep 2025, 11:00 AM",
    type: "Scheduled",
    platform: "App",
    customers: 2990,
    status: "Finished",
  },
  {
    id: 3,
    title: "⚡ Boost Your CA Journey with Our CA Inter Course",
    message:
      "🔥 95% of exam questions come directly from our ✅ Packages, 📚 Courses, 📺 OTT, 📖 Books & 📝 Test Series! 🚀",
    icon: Zap,
    sentAt: "18 Sep 2025, 2:51 PM",
    type: "Scheduled",
    platform: "Both",
    customers: 5535,
    status: "Active",
  },
  {
    id: 4,
    title: "⚡ Boost Your CA Journey with Our CA Inter Course",
    message:
      "🔥 95% of exam questions come directly from our ✅ Packages, 📚 Courses, 📺 OTT, 📖 Books & 📝 Test Series! 🚀",
    icon: Zap,
    sentAt: "18 Sep 2025, 5:05 PM",
    type: "Scheduled",
    platform: "Web",
    customers: 5535,
    status: "Active",
  },
];

const NotificationDashboard = () => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAction = (id, actionType) => {
    console.log(`Action: ${actionType} on Notification ID: ${id}`);
  };

  const handleAddCampaign = (newCampaignData) => {
    const NewIcon = newCampaignData.icon;

    const newNotification = {
      id: Date.now(),
      title: newCampaignData.title,
      message: newCampaignData.body,
      icon: NewIcon || Plus,
      sentAt: new Date()
        .toLocaleString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
        })
        .replace(",", ""),
      type: newCampaignData.scheduleType === "Send Now" ? "Sent" : "Scheduled",
      platform: newCampaignData.platform || "Web",
      customers: 0,
      status:
        newCampaignData.scheduleType === "Send Now" ? "Active" : "Scheduled",
    };
    setNotifications([newNotification, ...notifications]);
    setIsModalOpen(false);
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case "Finished":
        return "bg-gray-200 text-gray-800";
      case "Active":
        return "bg-green-100 text-green-700";
      case "Scheduled":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-gray-100 flex-1 overflow-y-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Notification Campaign History
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="cursor-pointer bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2 px-4 rounded-lg shadow-md transition-colors flex items-center"
        >
          <Plus size={18} className="mr-2" />
          Create Notification
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                S.No
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-40">
                Icon / Notification Title
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-80">
                Notification Message
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                Link
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                Platform
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                Notification Type
              </th>
              <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                Customers
              </th>
              <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                Status
              </th>
              <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {notifications.map((n, index) => {
              const IconComponent = n.icon;
              return (
                <tr key={n.id}>
                  <td className="px-3 py-3 text-sm text-gray-500 font-medium">
                    {index + 1}
                  </td>

                  <td className="px-3 py-3 text-sm font-medium text-gray-900 flex items-start space-x-2">
                    <div className="text-gray-600 mt-1">
                      {IconComponent && <IconComponent size={16} />}
                    </div>
                    <div>
                      {n.title}
                      <p className="text-xs text-gray-500 mt-1 font-normal">
                        {n.sentAt}
                      </p>
                    </div>
                  </td>

                  <td className="px-3 py-3 text-sm text-gray-700 max-w-lg">
                    {n.message}
                  </td>

                  <td className="px-3 py-3 text-center text-sm">
                    <button className="text-blue-600 hover:text-blue-900 font-medium text-xs border border-blue-200 rounded-full px-2 py-1">
                      view
                    </button>
                  </td>

                  <td className="px-3 py-3 text-sm text-gray-700">
                    {n.platform}
                  </td>

                  <td className="px-3 py-3 text-sm text-gray-500">{n.type}</td>

                  <td className="px-3 py-3 text-right text-sm font-medium text-gray-900">
                    {n.customers.toLocaleString()}
                  </td>

                  <td className="px-3 py-3 text-center">
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-semibold ${getStatusClasses(
                        n.status
                      )}`}
                    >
                      {n.status}
                    </span>
                  </td>

                  <td className="px-3 py-3 text-center text-sm font-medium">
                    <div className="flex items-center justify-center space-x-1">
                      <button
                        onClick={() =>
                          handleAction(
                            n.id,
                            n.status === "Active" ? "pause" : "play"
                          )
                        }
                        className={`p-2 rounded-full transition-colors ${
                          n.status === "Active"
                            ? "bg-orange-100 hover:bg-orange-200 text-orange-600"
                            : "bg-green-100 hover:bg-green-200 text-green-600"
                        }`}
                      >
                        {n.status === "Active" ? (
                          <Pause size={16} />
                        ) : (
                          <Play size={16} />
                        )}
                      </button>

                      <button
                        onClick={() => handleAction(n.id, "edit")}
                        className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 transition-colors"
                      >
                        <Edit size={16} />
                      </button>

                      <button
                        onClick={() => navigator.clipboard.writeText(n.title)}
                        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                        title="Copy Title"
                      >
                        <Copy size={16} />
                      </button>

                      <button
                        onClick={() => handleAction(n.id, "delete")}
                        className="p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <NotificationFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddCampaign={handleAddCampaign}
      />
    </div>
  );
};

export default NotificationDashboard;
