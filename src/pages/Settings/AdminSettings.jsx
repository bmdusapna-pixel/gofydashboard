import React, { useState, useEffect } from "react";
import {
  Settings,
  Globe,
  Building,
  Package,
  Truck,
  Phone,
  AtSign,
  Rss,
  Home,
  Code,
  MessageSquare,
  Share2,
  Image,
  Link,
  Clock,
} from "lucide-react";
import { settingsAPI } from "../../api/settings";
import { toast } from "react-toastify";

const AdminSettings = () => {
  // State for Site & Business Settings
  const [siteLogo, setSiteLogo] = useState("");
  const [favicon, setFavicon] = useState("");
  const [siteTitle, setSiteTitle] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [supportEmail, setSupportEmail] = useState("");
  const [shippingFlatRate, setShippingFlatRate] = useState(100);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(1000);
  const [footerContent, setFooterContent] = useState("");
  const [partnerSectionContent, setPartnerSectionContent] = useState("");
  const [contactSectionContent, setContactSectionContent] = useState("");
  const [popupShowIn, setPopupShowIn] = useState(""); // e.g., 'homepage', 'all'
  const [popupHideIn, setPopupHideIn] = useState(""); // e.g., 'checkout', 'cart'
  const [popupAutoplay, setPopupAutoplay] = useState(false);

  // State for Top Slider Dashboard
  const [sliders, setSliders] = useState([
    {
      id: 1,
      type: "web_app",
      text: "Summer Sale!",
      url: "https://example.com/sale",
      image: "https://placehold.co/300x150/00bbae/ffffff?text=Slider+1",
    },
    {
      id: 2,
      type: "web",
      text: "New Arrivals",
      url: "https://example.com/new",
      image: "https://placehold.co/300x150/f88e0f/ffffff?text=Slider+2",
    },
  ]);
  const [sliderAutoplayTime, setSliderAutoplayTime] = useState(5);

  const [popups, setPopups] = useState({
    home: { type: "web_app", expiry: "", url: "", image: "" },
    logout: { type: "web_app", expiry: "", url: "", image: "" },
  });

  const handlePopupChange = (popupId, field, value) => {
    setPopups((prev) => ({
      ...prev,
      [popupId]: { ...prev[popupId], [field]: value },
    }));
  };

  // State for Blog Section
  const [blogAutoplay, setBlogAutoplay] = useState(true);
  const [newBlogEntry, setNewBlogEntry] = useState({
    title: "",
    content: "",
    imageUrl: "",
    url: "",
  });

  // State for Home SEO
  const [homeMetaTitle, setHomeMetaTitle] = useState("");
  const [homeMetaDescription, setHomeMetaDescription] = useState("");
  const [homeMetaKeywords, setHomeMetaKeywords] = useState("");

  // State for Head Script and Body Script
  const [headScript, setHeadScript] = useState("");
  const [bodyScript, setBodyScript] = useState("");

  // State for Warehouse Details
  const [warehouseName, setWarehouseName] = useState("");
  const [warehouseAddress, setWarehouseAddress] = useState("");
  const [warehouseContact, setWarehouseContact] = useState("");

  // State for Courier Settings (2 API)
  const [courierApi1Key, setCourierApi1Key] = useState("");
  const [courierApi1Endpoint, setCourierApi1Endpoint] = useState("");
  const [courierApi2Key, setCourierApi2Key] = useState("");
  const [courierApi2Endpoint, setCourierApi2Endpoint] = useState("");

  // State for WhatsApp API Setting
  const [whatsAppApiKey, setWhatsAppApiKey] = useState("");
  const [whatsAppApiEndpoint, setWhatsAppApiEndpoint] = useState("");

  // State for Social Media Dashboard
  const [socialMediaLinks, setSocialMediaLinks] = useState([]);

  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Fetch settings on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await settingsAPI.getSettings();
        const data = response.data.settings;

        // Map all fields from API response to state
        if (data) {
          setSiteLogo(data.siteLogo || "");
          setFavicon(data.favicon || "");
          setSiteTitle(data.siteTitle || "");
          setBusinessAddress(data.businessAddress || "");
          setContactNumber(data.contactNumber || "");
          setSupportEmail(data.supportEmail || "");
          setShippingFlatRate(data.shippingFlatRate || 100);
          setFreeShippingThreshold(data.freeShippingThreshold || 0);
          setFooterContent(data.footerContent || "");
          setPartnerSectionContent(data.partnerSectionContent || "");
          setContactSectionContent(data.contactSectionContent || "");
          setPopupShowIn(data.popupShowIn || "");
          setPopupHideIn(data.popupHideIn || "");
          setPopupAutoplay(data.popupAutoplay || false);
          setSliders(data.sliders || []);
          setSliderAutoplayTime(data.sliderAutoplayTime || 5);
          setPopups(data.popups || {
            home: { type: "web_app", expiry: "", url: "", image: "" },
            logout: { type: "web_app", expiry: "", url: "", image: "" },
          });
          setBlogAutoplay(data.blogAutoplay !== undefined ? data.blogAutoplay : true);
          setHomeMetaTitle(data.homeMetaTitle || "");
          setHomeMetaDescription(data.homeMetaDescription || "");
          setHomeMetaKeywords(data.homeMetaKeywords || "");
          setHeadScript(data.headScript || "");
          setBodyScript(data.bodyScript || "");
          setWarehouseName(data.warehouseName || "");
          setWarehouseAddress(data.warehouseAddress || "");
          setWarehouseContact(data.warehouseContact || "");
          setCourierApi1Key(data.courierApi1?.key || "");
          setCourierApi1Endpoint(data.courierApi1?.endpoint || "");
          setCourierApi2Key(data.courierApi2?.key || "");
          setCourierApi2Endpoint(data.courierApi2?.endpoint || "");
          setWhatsAppApiKey(data.whatsAppApi?.key || "");
          setWhatsAppApiEndpoint(data.whatsAppApi?.endpoint || "");
          setSocialMediaLinks(data.socialMediaLinks || []);
        }
      } catch (err) {
        console.error("Error fetching settings:", err);
        setError("Failed to load settings");
        toast.error("Failed to load settings. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleAddSlider = () => {
    const maxId = sliders.length > 0 ? Math.max(...sliders.map(s => s.id || 0)) : 0;
    setSliders([
      ...sliders,
      { id: maxId + 1, type: "web_app", text: "", url: "", image: "" },
    ]);
  };

  const handleSliderChange = (id, field, value) => {
    setSliders(
      sliders.map((slider) =>
        slider.id === id ? { ...slider, [field]: value } : slider
      )
    );
  };

  const handleRemoveSlider = (id) => {
    setSliders(sliders.filter((slider) => slider.id !== id));
  };

  const handleAddSocialMediaLink = () => {
    setSocialMediaLinks([...socialMediaLinks, { platform: "", url: "" }]);
  };

  const handleSocialMediaLinkChange = (index, field, value) => {
    const newLinks = [...socialMediaLinks];
    newLinks[index][field] = value;
    setSocialMediaLinks(newLinks);
  };

  const handleRemoveSocialMediaLink = (index) => {
    setSocialMediaLinks(socialMediaLinks.filter((_, i) => i !== index));
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    setError(null);
    
    try {
      // Prepare payload with all settings
      const payload = {
        siteLogo,
        favicon,
        siteTitle,
        businessAddress,
        contactNumber,
        supportEmail,
        shippingFlatRate,
        freeShippingThreshold,
        footerContent,
        partnerSectionContent,
        contactSectionContent,
        popupShowIn,
        popupHideIn,
        popupAutoplay,
        sliders,
        sliderAutoplayTime,
        blogAutoplay,
        homeMetaTitle,
        homeMetaDescription,
        homeMetaKeywords,
        headScript,
        bodyScript,
        warehouseName,
        warehouseAddress,
        warehouseContact,
        courierApi1: {
          key: courierApi1Key,
          endpoint: courierApi1Endpoint,
        },
        courierApi2: {
          key: courierApi2Key,
          endpoint: courierApi2Endpoint,
        },
        whatsAppApi: {
          key: whatsAppApiKey,
          endpoint: whatsAppApiEndpoint,
        },
        popups,
        socialMediaLinks,
      };

      const response = await settingsAPI.updateSettings(payload);
      
      if (response.data.success) {
        toast.success("Settings saved successfully!");
      } else {
        throw new Error(response.data.message || "Failed to save settings");
      }
    } catch (err) {
      console.error("Error saving settings:", err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to save settings";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto p-4 bg-primary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-primary-50">
      <div className="bg-white rounded-lg shadow-xl p-8 space-y-8">
        <h1 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center">
          <Settings className="mr-4 text-blue-600" size={26} /> Admin Dashboard
          Settings
        </h1>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Site & Business Settings */}
        <section className="border-b-2 pb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <Globe className="mr-3 text-green-600" size={26} /> Site & Business
            Settings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Site Settings */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm space-y-4">
              <h3 className="text-xl font-semibold text-gray-700">
                Site Identity
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Site Logo URL
                </label>
                <input
                  type="text"
                  value={siteLogo}
                  onChange={(e) => setSiteLogo(e.target.value)}
                  placeholder="e.g., https://yourdomain.com/logo.png"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Favicon URL
                </label>
                <input
                  type="text"
                  value={favicon}
                  onChange={(e) => setFavicon(e.target.value)}
                  placeholder="e.g., https://yourdomain.com/favicon.ico"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Site Title
                </label>
                <input
                  type="text"
                  value={siteTitle}
                  onChange={(e) => setSiteTitle(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Business Info */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm space-y-4">
              <h3 className="text-xl font-semibold text-gray-700">
                Business Information
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <textarea
                  value={businessAddress}
                  onChange={(e) => setBusinessAddress(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Contact Number
                </label>
                <input
                  type="text"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Support Email
                </label>
                <input
                  type="email"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Shipping Rules & Pop-up Settings */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm space-y-4">
              <h3 className="text-xl font-semibold text-gray-700">
                Shipping Rules
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Flat Rate Shipping (₹)
                </label>
                <input
                  type="number"
                  value={shippingFlatRate}
                  onChange={(e) => setShippingFlatRate(Number(e.target.value))}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Free Shipping Above (₹)
                </label>
                <input
                  type="number"
                  value={freeShippingThreshold}
                  onChange={(e) =>
                    setFreeShippingThreshold(Number(e.target.value))
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mt-6">
                Pop-up Settings
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Show Pop-up In (comma-separated URLs/paths)
                </label>
                <input
                  type="text"
                  value={popupShowIn}
                  onChange={(e) => setPopupShowIn(e.target.value)}
                  placeholder="/homepage, /products/*"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Hide Pop-up In (comma-separated URLs/paths)
                </label>
                <input
                  type="text"
                  value={popupHideIn}
                  onChange={(e) => setPopupHideIn(e.target.value)}
                  placeholder="/checkout, /cart"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  checked={popupAutoplay}
                  onChange={(e) => setPopupAutoplay(e.target.checked)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Enable Pop-up Autoplay
                </label>
              </div>
            </div>
          </div>
          {/* Footer, Partner, Contact Sections */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm space-y-4">
            <h3 className="text-xl font-semibold text-gray-700">
              Content Sections
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Footer Content
              </label>
              <textarea
                value={footerContent}
                onChange={(e) => setFooterContent(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                rows="4"
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Become a Partner Section
              </label>
              <textarea
                value={partnerSectionContent}
                onChange={(e) => setPartnerSectionContent(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                rows="4"
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Contact Section Details
              </label>
              <textarea
                value={contactSectionContent}
                onChange={(e) => setContactSectionContent(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                rows="4"
              ></textarea>
            </div>
          </div>
        </section>

        {/* Top Slider Dashboard */}
        <section className="border-b-2 pb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <Image className="mr-3 text-purple-600" size={26} /> Top Slider
            Dashboard
          </h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Autoplay Time (seconds)
            </label>
            <input
              type="number"
              value={sliderAutoplayTime}
              onChange={(e) => setSliderAutoplayTime(Number(e.target.value))}
              min="1"
              className="mt-1 block w-full md:w-1/4 border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="space-y-6">
            {sliders.map((slider, index) => (
              <div
                key={slider.id}
                className="bg-gray-50 p-6 rounded-lg shadow-sm space-y-3 flex flex-col md:flex-row md:items-end md:space-x-4"
              >
                <div className="flex-grow grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Slider Type
                    </label>
                    <select
                      value={slider.type}
                      onChange={(e) =>
                        handleSliderChange(slider.id, "type", e.target.value)
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="web_app">Web & App</option>
                      <option value="web">Web Only</option>
                      <option value="app">App Only</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Text
                    </label>
                    <input
                      type="text"
                      value={slider.text}
                      onChange={(e) =>
                        handleSliderChange(slider.id, "text", e.target.value)
                      }
                      placeholder="Slider Text"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      URL
                    </label>
                    <input
                      type="url"
                      value={slider.url}
                      onChange={(e) =>
                        handleSliderChange(slider.id, "url", e.target.value)
                      }
                      placeholder="https://example.com/link"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Image URL
                    </label>
                    <input
                      type="url"
                      value={slider.image}
                      onChange={(e) =>
                        handleSliderChange(slider.id, "image", e.target.value)
                      }
                      placeholder="https://example.com/image.jpg"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveSlider(slider.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75 md:mt-0 mt-2"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={handleAddSlider}
              className="px-6 py-3 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
            >
              Add New Slider
            </button>
          </div>
        </section>
        {/* Popup Modal Dashboard */}
        <section className="border-b-2 pb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <Image className="mr-3 text-purple-600" size={26} /> Popup Modal
            Dashboard
          </h2>

          {/* Autoplay Time */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">
              Autoplay Time (seconds)
            </label>
            <input
              type="number"
              value={sliderAutoplayTime}
              onChange={(e) => setSliderAutoplayTime(Number(e.target.value))}
              min="1"
              className="mt-1 block w-full md:w-1/4 border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Two Fixed Popups */}
          <div className="space-y-8">
            {[
              { id: "home", label: "🏠 Home Page Popup (After Login)" },
              { id: "logout", label: "🚪 Logout Page Popup (Before Logout)" },
            ].map((popup) => (
              <div
                key={popup.id}
                className="bg-gray-50 p-6 rounded-lg shadow-sm space-y-4"
              >
                {/* Section Title */}
                <h3 className="text-md font-semibold text-gray-800 border-b pb-2">
                  {popup.label}
                </h3>

                {/* Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Popup Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Popup Type
                    </label>
                    <select
                      value={popups[popup.id]?.type || "web_app"}
                      onChange={(e) =>
                        handlePopupChange(popup.id, "type", e.target.value)
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="web_app">Web & App</option>
                      <option value="web">Web Only</option>
                      <option value="app">App Only</option>
                    </select>
                  </div>

                  {/* Expiry Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Expiry Date
                    </label>
                    <input
                      type="date"
                      value={popups[popup.id]?.expiry || ""}
                      onChange={(e) =>
                        handlePopupChange(popup.id, "expiry", e.target.value)
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* URL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      URL
                    </label>
                    <input
                      type="url"
                      value={popups[popup.id]?.url || ""}
                      onChange={(e) =>
                        handlePopupChange(popup.id, "url", e.target.value)
                      }
                      placeholder="https://example.com/link"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Image URL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Image URL
                    </label>
                    <input
                      type="url"
                      value={popups[popup.id]?.image || ""}
                      onChange={(e) =>
                        handlePopupChange(popup.id, "image", e.target.value)
                      }
                      placeholder="https://example.com/image.jpg"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Blog Section for User */}
        <section className="border-b-2 pb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <Rss className="mr-3 text-yellow-600" size={26} /> Blog Section
          </h2>
          <div className="flex items-center mb-6">
            <input
              type="checkbox"
              checked={blogAutoplay}
              onChange={(e) => setBlogAutoplay(e.target.checked)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label className="ml-2 block text-sm text-gray-900">
              Enable Blog Carousel Autoplay
            </label>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm space-y-4">
            <h3 className="text-xl font-semibold text-gray-700">
              Add New Blog Entry
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Blog Title
              </label>
              <input
                type="text"
                value={newBlogEntry.title}
                onChange={(e) =>
                  setNewBlogEntry({ ...newBlogEntry, title: e.target.value })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Blog Content
              </label>
              <textarea
                value={newBlogEntry.content}
                onChange={(e) =>
                  setNewBlogEntry({ ...newBlogEntry, content: e.target.value })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                rows="5"
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Image URL
              </label>
              <input
                type="url"
                value={newBlogEntry.imageUrl}
                onChange={(e) =>
                  setNewBlogEntry({ ...newBlogEntry, imageUrl: e.target.value })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Blog URL (Permalink)
              </label>
              <input
                type="url"
                value={newBlogEntry.url}
                onChange={(e) =>
                  setNewBlogEntry({ ...newBlogEntry, url: e.target.value })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              onClick={async () => {
                if (!newBlogEntry.title || !newBlogEntry.content) {
                  toast.error("Please fill in title and content");
                  return;
                }
                
                try {
                  const response = await settingsAPI.addBlog(newBlogEntry);
                  if (response.data.success) {
                    toast.success("Blog added successfully!");
                    setNewBlogEntry({
                      title: "",
                      content: "",
                      imageUrl: "",
                      url: "",
                    });
                    // Optionally refresh settings to show the new blog
                    // You could also add the blog to a local blogs list state
                  }
                } catch (err) {
                  console.error("Error adding blog:", err);
                  const errorMessage = err.response?.data?.message || "Failed to add blog";
                  toast.error(errorMessage);
                }
              }}
              className="px-6 py-3 bg-green-600 text-white rounded-md shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Publish New Blog
            </button>
          </div>
        </section>

        {/* Home SEO */}
        <section className="border-b-2 pb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <Home className="mr-3 text-indigo-600" size={26} /> Home Page SEO
          </h2>
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Meta Title
              </label>
              <input
                type="text"
                value={homeMetaTitle}
                onChange={(e) => setHomeMetaTitle(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Meta Description
              </label>
              <textarea
                value={homeMetaDescription}
                onChange={(e) => setHomeMetaDescription(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                rows="3"
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Meta Keywords (comma-separated)
              </label>
              <input
                type="text"
                value={homeMetaKeywords}
                onChange={(e) => setHomeMetaKeywords(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </section>

        {/* Head Script and Body Script */}
        <section className="border-b-2 pb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <Code className="mr-3 text-pink-600" size={26} /> Custom Code
            Injection
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            Paste custom HTML, CSS, or JavaScript code. Use with caution.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm space-y-4">
              <h3 className="text-xl font-semibold text-gray-700">
                Head Script (before &lt;/head&gt;)
              </h3>
              <textarea
                value={headScript}
                onChange={(e) => setHeadScript(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 font-mono text-sm focus:ring-blue-500 focus:border-blue-500"
                rows="10"
                placeholder="<!-- Google Analytics, Meta Tags, Custom Styles -->"
              ></textarea>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm space-y-4">
              <h3 className="text-xl font-semibold text-gray-700">
                Body Script (before &lt;/body&gt;)
              </h3>
              <textarea
                value={bodyScript}
                onChange={(e) => setBodyScript(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 font-mono text-sm focus:ring-blue-500 focus:border-blue-500"
                rows="10"
                placeholder="<!-- Custom JS for interactions, Chat Widgets -->"
              ></textarea>
            </div>
          </div>
        </section>

        {/* Warehouse Details */}
        <section className="border-b-2 pb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <Building className="mr-3 text-teal-600" size={26} /> Warehouse
            Details
          </h2>
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Warehouse Name
              </label>
              <input
                type="text"
                value={warehouseName}
                onChange={(e) => setWarehouseName(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Warehouse Address
              </label>
              <textarea
                value={warehouseAddress}
                onChange={(e) => setWarehouseAddress(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                rows="3"
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Contact Person/Number
              </label>
              <input
                type="text"
                value={warehouseContact}
                onChange={(e) => setWarehouseContact(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </section>

        {/* Courier Setting (2 API) */}
        <section className="border-b-2 pb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <Truck className="mr-3 text-orange-600" size={26} /> Courier
            Settings
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            Integrate with third-party courier APIs for shipping and tracking.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm space-y-4">
              <h3 className="text-xl font-semibold text-gray-700">
                Courier API 1
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  API Key
                </label>
                <input
                  type="text"
                  value={courierApi1Key}
                  onChange={(e) => setCourierApi1Key(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  API Endpoint
                </label>
                <input
                  type="url"
                  value={courierApi1Endpoint}
                  onChange={(e) => setCourierApi1Endpoint(e.target.value)}
                  placeholder="e.g., https://api.courier1.com/v1"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm space-y-4">
              <h3 className="text-xl font-semibold text-gray-700">
                Courier API 2
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  API Key
                </label>
                <input
                  type="text"
                  value={courierApi2Key}
                  onChange={(e) => setCourierApi2Key(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  API Endpoint
                </label>
                <input
                  type="url"
                  value={courierApi2Endpoint}
                  onChange={(e) => setCourierApi2Endpoint(e.target.value)}
                  placeholder="e.g., https://api.courier2.com/v1"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </section>

        {/* WhatsApp API Setting */}
        <section className="border-b-2 pb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <MessageSquare className="mr-3 text-green-500" size={26} /> WhatsApp
            API Settings
          </h2>
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                WhatsApp Business API Key
              </label>
              <input
                type="text"
                value={whatsAppApiKey}
                onChange={(e) => setWhatsAppApiKey(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                WhatsApp Business API Endpoint
              </label>
              <input
                type="url"
                value={whatsAppApiEndpoint}
                onChange={(e) => setWhatsAppApiEndpoint(e.target.value)}
                placeholder="e.g., https://graph.facebook.com/v16.0/"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </section>

        {/* Social Media Dashboard */}
        <section className="border-b-2 pb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <Share2 className="mr-3 text-blue-400" size={26} /> Social Media
            Dashboard
          </h2>
          <div className="space-y-6">
            {socialMediaLinks.map((link, index) => (
              <div
                key={index}
                className="bg-gray-50 p-6 rounded-lg shadow-sm space-y-3 flex flex-col md:flex-row md:items-end md:space-x-4"
              >
                <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Platform
                    </label>
                    <input
                      type="text"
                      value={link.platform}
                      onChange={(e) =>
                        handleSocialMediaLinkChange(
                          index,
                          "platform",
                          e.target.value
                        )
                      }
                      placeholder="e.g., Facebook, Instagram"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Profile URL
                    </label>
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) =>
                        handleSocialMediaLinkChange(
                          index,
                          "url",
                          e.target.value
                        )
                      }
                      placeholder="https://facebook.com/yourpage"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveSocialMediaLink(index)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75 md:mt-0 mt-2"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={handleAddSocialMediaLink}
              className="px-6 py-3 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
            >
              Add New Social Media Link
            </button>
          </div>
        </section>

        {/* Send Report to Admins - This would typically be a backend trigger, not a setting */}
        <section className="border-b-2 pb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <Clock className="mr-3 text-gray-700" size={26} /> Reporting &
            Analytics
          </h2>
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm space-y-4">
            <p className="text-gray-700">
              Sending reports to admins is usually a scheduled task configured
              on the backend. This section would typically provide options for:
            </p>
            <ul className="list-disc list-inside text-gray-600 ml-4 space-y-1">
              <li>Configuring report frequency (Daily, Weekly, Monthly)</li>
              <li>Selecting report types (Sales, Inventory, Customer data)</li>
              <li>Adding/removing admin email recipients</li>
            </ul>
            <p className="text-sm text-gray-500">
              For demo purposes, a "Send Now" button could trigger a simulated
              report.
            </p>
            <button
              onClick={() =>
                alert(
                  "Simulating sending report to admins... (Check backend logs in a real app)"
                )
              }
              className="px-6 py-3 bg-indigo-600 text-white rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75"
            >
              Send Test Report Now
            </button>
          </div>
        </section>

        <div className="flex justify-end pt-8">
          <button
            onClick={handleSaveSettings}
            disabled={saving}
            className="px-8 py-4 bg-blue-700 text-white text-xl font-bold rounded-lg shadow-lg hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-75 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Save All Settings"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
