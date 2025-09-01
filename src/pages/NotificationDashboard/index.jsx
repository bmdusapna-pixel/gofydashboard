import React, { useState } from "react";
import {
  Bell,
  Plus,
  Settings,
  Calendar,
  BarChart3,
  Send,
  Edit,
  Trash2,
  Eye,
  Smartphone,
  Globe,
} from "lucide-react";

const NotificationDashboard = () => {
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [activeTab, setActiveTab] = useState("templates");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [templates, setTemplates] = useState([
    {
      id: 1,
      title: "Order Confirmed",
      trigger: "order_confirmation",
      platform: "Both",
      status: "Active",
      created: "2025-01-15",
      imageUrl: "https://via.placeholder.com/50", // Added image URL
    },
    {
      id: 2,
      title: "Flash Sale Alert",
      trigger: "flash_sale",
      platform: "App",
      status: "Active",
      created: "2025-01-14",
      imageUrl: "https://via.placeholder.com/50/FF0000/FFFFFF?text=Sale", // Added image URL
    },
    {
      id: 3,
      title: "Abandoned Cart",
      trigger: "abandoned_cart",
      platform: "Web",
      status: "Disabled",
      created: "2025-01-13",
      // No imageUrl for this one to show it's optional
    },
  ]);
  const [triggers, setTriggers] = useState([
    {
      id: 1,
      name: "Order Confirmation",
      type: "Behavioral",
      enabled: true,
      lastUsed: "2025-01-15",
    },
    {
      id: 2,
      name: "Shipment Dispatch",
      type: "Behavioral",
      enabled: true,
      lastUsed: "2025-01-14",
    },
    {
      id: 3,
      name: "Delivery Updates",
      type: "Behavioral",
      enabled: true,
      lastUsed: "2025-01-15",
    },
    {
      id: 4,
      name: "Abandoned Cart",
      type: "Behavioral",
      enabled: false,
      lastUsed: "2025-01-10",
    },
    {
      id: 5,
      name: "Wishlist Price Drop",
      type: "Behavioral",
      enabled: true,
      lastUsed: "2025-01-12",
    },
    {
      id: 6,
      name: "Flash Sales",
      type: "Promotional",
      enabled: true,
      lastUsed: "2025-01-13",
    },
  ]);
  const [campaigns, setCampaigns] = useState([
    {
      id: 1,
      name: "Weekend Sale Campaign",
      type: "Scheduled",
      date: "2025-01-18",
      time: "10:00",
      platform: "Both",
      status: "Pending",
    },
    {
      id: 2,
      name: "New Arrivals Alert",
      type: "Recurring",
      frequency: "Weekly",
      platform: "App",
      status: "Active",
    },
  ]);
  const [analytics] = useState({
    totalSent: 15420,
    delivered: 14876,
    opened: 8924,
    clicked: 2134,
    deliveryRate: 96.5,
    openRate: 60.0,
    clickRate: 14.3,
  });

  const toggleTrigger = (id) => {
    setTriggers(
      triggers.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t))
    );
  };

  const TabNavigation = () => (
    <div className="bg-white border-b border-gray-200 px-6">
      <div className="flex space-x-8">
        {[
          { id: "templates", label: "Templates", icon: Bell },
          { id: "triggers", label: "Triggers", icon: Settings },
          { id: "scheduler", label: "Scheduler", icon: Calendar },
          { id: "analytics", label: "Analytics", icon: BarChart3 },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center py-4 px-2 border-b-2 text-sm font-medium ${
              activeTab === tab.id
                ? "border-gray-300 text-red-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <tab.icon size={16} className="mr-2" />
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );

  const TemplatesTab = () => (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Notification Templates
        </h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-red-600"
        >
          <Plus size={16} className="mr-2" />
          Create Template
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-300">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-300">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Template
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Trigger
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Platform
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Created
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {templates.map((template) => (
              <tr key={template.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  {/* Conditional Image Display */}
                  {template.imageUrl && (
                    <img
                      src={template.imageUrl}
                      alt={template.title}
                      className="h-12 w-12 object-cover rounded"
                    />
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">
                    {template.title}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {template.trigger.replace("_", " ")}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    {template.platform === "Web" && (
                      <Globe size={14} className="mr-1" />
                    )}
                    {template.platform === "App" && (
                      <Smartphone size={14} className="mr-1" />
                    )}
                    {template.platform === "Both" && (
                      <>
                        <Globe size={14} className="mr-1" />
                        <Smartphone size={14} className="mr-1" />
                      </>
                    )}
                    <span className="text-sm">{template.platform}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      template.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {template.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {template.created}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <Eye size={16} />
                    </button>
                    <button className="text-green-600 hover:text-green-800">
                      <Edit size={16} />
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const TriggersTab = () => (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Notification Triggers
        </h1>
        <div className="flex space-x-3">
          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
            <option>All Types</option>
            <option>Behavioral</option>
            <option>Promotional</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-300">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-300">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Trigger Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Last Used
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {triggers.map((trigger) => (
              <tr key={trigger.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">
                    {trigger.name}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      trigger.type === "Behavioral"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    {trigger.type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => toggleTrigger(trigger.id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      trigger.enabled ? "bg-green-600" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        trigger.enabled ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {trigger.lastUsed}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <Settings size={16} />
                    </button>
                    <button className="text-green-600 hover:text-green-800">
                      <Edit size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const SchedulerTab = () => (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Campaign Scheduler</h1>
        <button
          onClick={() => setShowScheduleModal(true)}
          className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-red-600"
        >
          <Calendar size={16} className="mr-2" />
          Schedule Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-gray-300">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-blue-600">24</div>
              <div className="text-sm text-blue-600">Active Campaigns</div>
            </div>
            <Calendar className="text-blue-400" size={24} />
          </div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-gray-300">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-yellow-600">8</div>
              <div className="text-sm text-yellow-600">Pending Campaigns</div>
            </div>
            <Bell className="text-yellow-400" size={24} />
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-gray-300">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-600">156</div>
              <div className="text-sm text-green-600">Completed This Month</div>
            </div>
            <Send className="text-green-400" size={24} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-300">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-300">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Campaign
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Schedule
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Platform
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {campaigns.map((campaign) => (
              <tr key={campaign.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">
                    {campaign.name}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      campaign.type === "Scheduled"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {campaign.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {campaign.date && campaign.time
                    ? `${campaign.date} ${campaign.time}`
                    : campaign.frequency}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    {campaign.platform === "Web" && (
                      <Globe size={14} className="mr-1" />
                    )}
                    {campaign.platform === "App" && (
                      <Smartphone size={14} className="mr-1" />
                    )}
                    {campaign.platform === "Both" && (
                      <>
                        <Globe size={14} className="mr-1" />
                        <Smartphone size={14} className="mr-1" />
                      </>
                    )}
                    <span className="text-sm">{campaign.platform}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      campaign.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : campaign.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {campaign.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <Eye size={16} />
                    </button>
                    <button className="text-green-600 hover:text-green-800">
                      <Edit size={16} />
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const AnalyticsTab = () => (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Notification Analytics
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg border border-gray-300">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-blue-600">
                {analytics.totalSent.toLocaleString()}
              </div>
              <div className="text-sm text-blue-600 mt-1">Total Sent</div>
            </div>
            <Send className="text-blue-400" size={28} />
          </div>
        </div>
        <div className="bg-green-50 p-6 rounded-lg border border-gray-300">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-green-600">
                {analytics.deliveryRate}%
              </div>
              <div className="text-sm text-green-600 mt-1">Delivery Rate</div>
            </div>
            <div className="text-green-400 text-xs">↑ 2.1%</div>
          </div>
        </div>
        <div className="bg-yellow-50 p-6 rounded-lg border border-gray-300">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-yellow-600">
                {analytics.openRate}%
              </div>
              <div className="text-sm text-yellow-600 mt-1">Open Rate</div>
            </div>
            <div className="text-yellow-400 text-xs">↑ 5.2%</div>
          </div>
        </div>
        <div className="bg-purple-50 p-6 rounded-lg border border-gray-300">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-purple-600">
                {analytics.clickRate}%
              </div>
              <div className="text-sm text-purple-600 mt-1">Click Rate</div>
            </div>
            <div className="text-purple-400 text-xs">↑ 1.8%</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-300">
        <div className="px-6 py-4 border-b border-gray-300">
          <h3 className="text-lg font-semibold text-gray-900">
            Platform Performance
          </h3>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Platform
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Total Sent
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Delivered
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Opened
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Clicked
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                CTR
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4 flex items-center">
                <Globe size={16} className="mr-2" />
                <span className="font-medium">Web Browser</span>
              </td>
              <td className="px-6 py-4">8,540</td>
              <td className="px-6 py-4 text-green-600">8,231 (96.4%)</td>
              <td className="px-6 py-4 text-blue-600">4,923 (59.8%)</td>
              <td className="px-6 py-4 text-purple-600">1,245 (25.3%)</td>
              <td className="px-6 py-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full"
                    style={{ width: "25.3%" }}
                  ></div>
                </div>
              </td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4 flex items-center">
                <Smartphone size={16} className="mr-2" />
                <span className="font-medium">Mobile App</span>
              </td>
              <td className="px-6 py-4">6,880</td>
              <td className="px-6 py-4 text-green-600">6,645 (96.6%)</td>
              <td className="px-6 py-4 text-blue-600">4,001 (60.2%)</td>
              <td className="px-6 py-4 text-purple-600">889 (22.2%)</td>
              <td className="px-6 py-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full"
                    style={{ width: "22.2%" }}
                  ></div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  const CreateTemplateModal = () => {
    const [formData, setFormData] = useState({
      title: "",
      text: "",
      webUrl: "",
      appUrl: "",
      whatsappUrl: "",
      trigger: "",
      platform: "Both",
    });

    if (!showCreateModal) return null;

    return (
      <div
        className="fixed inset-0 flex items-center justify-center z-50"
        style={{ background: "rgba(0, 0, 0, 0.5)" }}
      >
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Create Notification Template
            </h2>
            <button
              onClick={() => setShowCreateModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="Enter notification title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notification Text
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-lg px-3 py-2 h-20"
                placeholder="Enter notification message"
                value={formData.text}
                onChange={(e) =>
                  setFormData({ ...formData, text: e.target.value })
                }
              />
            </div>

            {/* New section for Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image (Optional)
              </label>
              <input
                type="file"
                accept="image/*"
                className="w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Web URL
                </label>
                <input
                  type="url"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="https://..."
                  value={formData.webUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, webUrl: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  App URL
                </label>
                <input
                  type="url"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="app://..."
                  value={formData.appUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, appUrl: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  WhatsApp URL
                </label>
                <input
                  type="url"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="https://..."
                  value={formData.whatsappUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, whatsappUrl: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trigger
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={formData.trigger}
                  onChange={(e) =>
                    setFormData({ ...formData, trigger: e.target.value })
                  }
                >
                  <option value="">Select trigger</option>
                  <option value="order_confirmation">Order Confirmation</option>
                  <option value="shipment_dispatch">Shipment Dispatch</option>
                  <option value="delivery_updates">Delivery Updates</option>
                  <option value="abandoned_cart">Abandoned Cart</option>
                  <option value="wishlist_price_drop">
                    Wishlist Price Drop
                  </option>
                  <option value="restock">Restock Alert</option>
                  <option value="new_arrivals">New Arrivals</option>
                  <option value="trending_products">Trending Products</option>
                  <option value="discount_offers">Discount Offers</option>
                  <option value="flash_sales">Flash Sales</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Platform
                </label>
                <div className="flex space-x-4 pt-2">
                  {["Web", "App", "Both", "WhatsApp"].map((platform) => (
                    <label key={platform} className="flex items-center">
                      <input
                        type="radio"
                        name="platform"
                        value={platform}
                        checked={formData.platform === platform}
                        onChange={(e) =>
                          setFormData({ ...formData, platform: e.target.value })
                        }
                        className="mr-2"
                      />
                      <span className="text-sm">{platform}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const newTemplate = {
                    id: templates.length + 1,
                    title: formData.title,
                    trigger: formData.trigger,
                    platform: formData.platform,
                    status: "Active",
                    created: new Date().toISOString().split("T")[0],
                  };
                  setTemplates([...templates, newTemplate]);
                  setShowCreateModal(false);
                  setFormData({
                    title: "",
                    text: "",
                    webUrl: "",
                    appUrl: "",
                    whatsappUrl: "",
                    trigger: "",
                    platform: "Both",
                  });
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Create Template
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  const ScheduleCampaignModal = () => {
    const [formData, setFormData] = useState({
      name: "",
      type: "Scheduled",
      date: "",
      time: "",
      frequency: "Daily",
      platform: "Both",
    });

    if (!showScheduleModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Schedule Campaign
            </h2>
            <button
              onClick={() => setShowScheduleModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Campaign Name
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="Enter campaign name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Campaign Type
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
              >
                <option value="Scheduled">Scheduled</option>
                <option value="Recurring">Recurring</option>
              </select>
            </div>

            {formData.type === "Scheduled" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    value={formData.time}
                    onChange={(e) =>
                      setFormData({ ...formData, time: e.target.value })
                    }
                  />
                </div>
              </div>
            )}

            {formData.type === "Recurring" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Frequency
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={formData.frequency}
                  onChange={(e) =>
                    setFormData({ ...formData, frequency: e.target.value })
                  }
                >
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>Monthly</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Platform
              </label>
              <div className="flex space-x-4 pt-2">
                {["Web", "App", "Both"].map((platform) => (
                  <label key={platform} className="flex items-center">
                    <input
                      type="radio"
                      name="platform"
                      value={platform}
                      checked={formData.platform === platform}
                      onChange={(e) =>
                        setFormData({ ...formData, platform: e.target.value })
                      }
                      className="mr-2"
                    />
                    <span className="text-sm">{platform}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => setShowScheduleModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const newCampaign = {
                    id: campaigns.length + 1,
                    name: formData.name,
                    type: formData.type,
                    date: formData.date,
                    time: formData.time,
                    frequency: formData.frequency,
                    platform: formData.platform,
                    status: "Pending",
                  };
                  setCampaigns([...campaigns, newCampaign]);
                  setShowScheduleModal(false);
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Schedule
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <TabNavigation />
      <div className="flex-1 overflow-y-auto">
        {activeTab === "templates" && <TemplatesTab />}
        {activeTab === "triggers" && <TriggersTab />}
        {activeTab === "scheduler" && <SchedulerTab />}
        {activeTab === "analytics" && <AnalyticsTab />}
        <CreateTemplateModal />
        <ScheduleCampaignModal />
      </div>
    </div>
  );
};

export default NotificationDashboard;
