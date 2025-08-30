import React, { useEffect, useState } from "react";

const DEFAULT = {
  seo: {
    metaTitle: "Kids Winter Jackets Online - Trendy & Affordable",
    metaDescription:
      "Shop kids winter jackets with cozy designs. Free shipping & easy returns. Best prices in India.",
  },
  schema: {
    productName: "Kids Winter Jacket",
    sku: "KJW-001",
    price: 799,
    currency: "INR",
    availability: "InStock",
    ratingValue: 4.5,
    reviewCount: 120,
  },
  integrations: {
    ga4: true,
    metaPixel: true,
    googleAds: false,
  },
  tracking: {
    heatmap: true,
    clarity: false,
  },
  brokenLinks: [
    { id: 1, url: "/old-page", status: "404 Not Found", notedAt: "2025-07-05" },
    {
      id: 2,
      url: "/product/1234",
      status: "Broken Redirect",
      notedAt: "2025-07-09",
    },
  ],
  analyticsDemo: {
    monthlyVisitors: 42132,
    bounceRate: 42.5,
    conversions: 125,
    avgSession: "02:31",
  },
};

function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text);
  } else {
    const el = document.createElement("textarea");
    el.value = text;
    el.style.position = "fixed";
    el.style.left = "-9999px";
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
  }
}

/* Small utility for localStorage persistence */
function useLocalState(key, initial) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // ignore write errors
      console.error("Failed to write to localStorage");
    }
  }, [key, state]);
  return [state, setState];
}

export default function SeoAnalytics() {
  const [data, setData] = useLocalState("seo_analytics_demo_v1", DEFAULT);
  const [activeTab, setActiveTab] = useState("seo");
  const [newBrokenUrl, setNewBrokenUrl] = useState("");

  // helpers
  const updateSeo = (patch) =>
    setData((d) => ({ ...d, seo: { ...d.seo, ...patch } }));
  const updateSchema = (patch) =>
    setData((d) => ({ ...d, schema: { ...d.schema, ...patch } }));
  const toggleIntegration = (key) =>
    setData((d) => ({
      ...d,
      integrations: { ...d.integrations, [key]: !d.integrations[key] },
    }));
  const toggleTracking = (key) =>
    setData((d) => ({
      ...d,
      tracking: { ...d.tracking, [key]: !d.tracking[key] },
    }));
  const addBrokenLink = () => {
    if (!newBrokenUrl.trim()) return;
    setData((d) => ({
      ...d,
      brokenLinks: [
        ...d.brokenLinks,
        {
          id: Date.now(),
          url: newBrokenUrl.trim(),
          status: "404 Not Found",
          notedAt: new Date().toISOString().slice(0, 10),
        },
      ],
    }));
    setNewBrokenUrl("");
  };
  const removeBrokenLink = (id) =>
    setData((d) => ({
      ...d,
      brokenLinks: d.brokenLinks.filter((b) => b.id !== id),
    }));
  const markFixed = (id) =>
    setData((d) => ({
      ...d,
      brokenLinks: d.brokenLinks.map((b) =>
        b.id === id ? { ...b, status: "Fixed" } : b
      ),
    }));

  // Build JSON-LD schema
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: data.schema.productName,
    sku: data.schema.sku,
    image: "https://via.placeholder.com/300",
    offers: {
      "@type": "Offer",
      priceCurrency: data.schema.currency,
      price: data.schema.price,
      availability: `https://schema.org/${data.schema.availability}`,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: data.schema.ratingValue,
      reviewCount: data.schema.reviewCount,
    },
  };

  const productSchemaString = JSON.stringify(productSchema, null, 2);

  // Example GA4 & Pixel snippet examples (demo)
  const ga4Snippet = `<!-- GA4: demo only -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX"></script>
<script>
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-XXXXXXX');
</script>`;

  const metaPixelSnippet = `<!-- Meta Pixel: demo only -->
<script>
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', 'PIXEL-ID');
fbq('track', 'PageView');
</script>`;

  const googleAdsSnippet = `<!-- Google Ads Tag: demo only -->
<script async src="https://www.googletagmanager.com/gtag/js?id=AW-XXXXXXX"></script>
<script>window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);}
gtag('js', new Date()); gtag('config', 'AW-XXXXXXX');</script>`;

  // Basic "SEO Preview" card to mimic how Google shows title + desc
  const SeoPreview = () => (
    <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
      <p className="text-sm text-gray-500 mb-1">Search result preview</p>
      <div className="space-y-1">
        <div className="text-blue-600 text-base font-medium">
          {data.seo.metaTitle}
        </div>
        <div className="text-sm text-green-700">
          www.example.com/product/{data.schema.sku}
        </div>
        <div className="text-sm text-gray-700">{data.seo.metaDescription}</div>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-primary-50 flex-1 overflow-y-auto">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-lg sm:text-xl font-semibold">
            SEO & Analytics Tools (Demo)
          </h1>
          <div className="text-sm text-gray-500">
            Demo-only · No API required
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {[
            { id: "seo", label: "SEO Settings" },
            { id: "schema", label: "Schema Markup" },
            { id: "integrations", label: "Integrations" },
            { id: "tracking", label: "Heatmap & Scroll" },
            { id: "broken", label: "Broken Links" },
            { id: "analytics", label: "Analytics (Demo)" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                activeTab === t.id
                  ? "bg-[#00BBAE] text-white"
                  : "bg-white text-gray-700 border border-gray-300"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab panels */}
        <div className="bg-white rounded-xl shadow border border-gray-300 p-6">
          {activeTab === "seo" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <h3 className="text-lg font-semibold">Meta Tags</h3>
                <label className="block text-sm font-medium text-gray-700">
                  Meta Title
                </label>
                <input
                  value={data.seo.metaTitle}
                  onChange={(e) => updateSeo({ metaTitle: e.target.value })}
                  className="w-full border border-gray-300 rounded-md p-2 text-sm"
                />
                <label className="block text-sm font-medium text-gray-700 mt-2">
                  Meta Description
                </label>
                <textarea
                  value={data.seo.metaDescription}
                  onChange={(e) =>
                    updateSeo({ metaDescription: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md p-2 text-sm"
                  rows={4}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      copyToClipboard(
                        `<title>${data.seo.metaTitle}</title>\n<meta name="description" content="${data.seo.metaDescription}" />`
                      )
                    }
                    className="px-3 py-2 rounded-md bg-gray-100 text-sm"
                  >
                    Copy HTML tags
                  </button>
                  <button
                    onClick={() => {
                      // quick reset demo
                      setData(DEFAULT);
                    }}
                    className="px-3 py-2 rounded-md bg-red-50 text-sm text-red-600"
                  >
                    Reset to demo
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Preview</h3>
                <SeoPreview />
                <div className="mt-3 text-sm text-gray-500">
                  Length tips: Title ≤ 60 chars, Description ≤ 160 chars
                </div>
              </div>
            </div>
          )}

          {activeTab === "schema" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">
                  Product Schema (editable)
                </h3>
                <label className="block text-sm font-medium text-gray-700">
                  Product name
                </label>
                <input
                  value={data.schema.productName}
                  onChange={(e) =>
                    updateSchema({ productName: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md p-2 text-sm"
                />
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      SKU
                    </label>
                    <input
                      value={data.schema.sku}
                      onChange={(e) => updateSchema({ sku: e.target.value })}
                      className="w-full border border-gray-300 rounded-md p-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Price
                    </label>
                    <input
                      type="number"
                      value={data.schema.price}
                      onChange={(e) =>
                        updateSchema({ price: Number(e.target.value) })
                      }
                      className="w-full border border-gray-300 rounded-md p-2 text-sm"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Currency
                    </label>
                    <input
                      value={data.schema.currency}
                      onChange={(e) =>
                        updateSchema({ currency: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-md p-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Availability
                    </label>
                    <select
                      value={data.schema.availability}
                      onChange={(e) =>
                        updateSchema({ availability: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-md p-2 text-sm"
                    >
                      <option value="InStock">InStock</option>
                      <option value="OutOfStock">OutOfStock</option>
                      <option value="PreOrder">PreOrder</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Rating
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={data.schema.ratingValue}
                      onChange={(e) =>
                        updateSchema({ ratingValue: Number(e.target.value) })
                      }
                      className="w-full border border-gray-300 rounded-md p-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Reviews count
                    </label>
                    <input
                      type="number"
                      value={data.schema.reviewCount}
                      onChange={(e) =>
                        updateSchema({ reviewCount: Number(e.target.value) })
                      }
                      className="w-full border border-gray-300 rounded-md p-2 text-sm"
                    />
                  </div>
                </div>

                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => copyToClipboard(productSchemaString)}
                    className="px-3 py-2 rounded-md bg-gray-100 text-sm"
                  >
                    Copy JSON-LD
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold">JSON-LD Preview</h3>
                <pre
                  className="bg-gray-50 rounded-md p-3 text-xs overflow-auto"
                  style={{ maxHeight: 420 }}
                >
                  {productSchemaString}
                </pre>
              </div>
            </div>
          )}

          {activeTab === "integrations" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Connectivity</h3>
                <div className="flex items-center justify-between p-3 border border-gray-300 rounded-md">
                  <div>
                    <div className="font-medium">Google Analytics (GA4)</div>
                    <div className="text-sm text-gray-500">
                      Measurement ID: G-XXXXXXX (demo)
                    </div>
                  </div>
                  <button
                    onClick={() => toggleIntegration("ga4")}
                    className={`px-3 py-2 rounded-md ${
                      data.integrations.ga4
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100"
                    }`}
                  >
                    {data.integrations.ga4 ? "Connected" : "Connect"}
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 border border-gray-300 rounded-md">
                  <div>
                    <div className="font-medium">Meta Pixel</div>
                    <div className="text-sm text-gray-500">
                      Pixel ID: PIXEL-ID (demo)
                    </div>
                  </div>
                  <button
                    onClick={() => toggleIntegration("metaPixel")}
                    className={`px-3 py-2 rounded-md ${
                      data.integrations.metaPixel
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100"
                    }`}
                  >
                    {data.integrations.metaPixel ? "Active" : "Activate"}
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 border border-gray-300 rounded-md">
                  <div>
                    <div className="font-medium">Google Ads Tag</div>
                    <div className="text-sm text-gray-500">
                      AW-XXXXXXXX (demo)
                    </div>
                  </div>
                  <button
                    onClick={() => toggleIntegration("googleAds")}
                    className={`px-3 py-2 rounded-md ${
                      data.integrations.googleAds
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100"
                    }`}
                  >
                    {data.integrations.googleAds ? "Installed" : "Install"}
                  </button>
                </div>

                <div className="mt-2 text-sm text-gray-500">
                  Click "Copy snippet" to copy the example snippet to paste into
                  your site (demo values).
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => copyToClipboard(ga4Snippet)}
                    className="px-3 py-2 rounded-md bg-gray-100 text-sm"
                  >
                    Copy GA4 snippet
                  </button>
                  <button
                    onClick={() => copyToClipboard(metaPixelSnippet)}
                    className="px-3 py-2 rounded-md bg-gray-100 text-sm"
                  >
                    Copy Meta Pixel
                  </button>
                  <button
                    onClick={() => copyToClipboard(googleAdsSnippet)}
                    className="px-3 py-2 rounded-md bg-gray-100 text-sm"
                  >
                    Copy Google Ads
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold">Current Status</h3>
                <ul className="space-y-2 mt-3">
                  <li className="flex justify-between border border-gray-300 rounded-md p-3">
                    <span>GA4</span>
                    <span
                      className={`font-medium ${
                        data.integrations.ga4
                          ? "text-green-700"
                          : "text-gray-500"
                      }`}
                    >
                      {data.integrations.ga4 ? "Connected" : "Disconnected"}
                    </span>
                  </li>
                  <li className="flex justify-between border border-gray-300 rounded-md p-3">
                    <span>Meta Pixel</span>
                    <span
                      className={`font-medium ${
                        data.integrations.metaPixel
                          ? "text-green-700"
                          : "text-gray-500"
                      }`}
                    >
                      {data.integrations.metaPixel ? "Active" : "Inactive"}
                    </span>
                  </li>
                  <li className="flex justify-between border border-gray-300 rounded-md p-3">
                    <span>Google Ads</span>
                    <span
                      className={`font-medium ${
                        data.integrations.googleAds
                          ? "text-green-700"
                          : "text-gray-500"
                      }`}
                    >
                      {data.integrations.googleAds
                        ? "Installed"
                        : "Not Installed"}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === "tracking" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold">
                  Heatmap & Scroll Tracking
                </h3>
                <div className="mt-3 space-y-3">
                  <div className="flex items-center justify-between p-3 border border-gray-300 rounded-md">
                    <div>
                      <div className="font-medium">Hotjar (Heatmaps)</div>
                      <div className="text-sm text-gray-500">
                        Collects click/scroll heatmaps (demo)
                      </div>
                    </div>
                    <button
                      onClick={() => toggleTracking("heatmap")}
                      className={`px-3 py-2 rounded-md ${
                        data.tracking.heatmap
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100"
                      }`}
                    >
                      {data.tracking.heatmap ? "Enabled" : "Enable"}
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 border border-gray-300 rounded-md">
                    <div>
                      <div className="font-medium">
                        Microsoft Clarity (Scroll)
                      </div>
                      <div className="text-sm text-gray-500">
                        Session & scroll tracking (demo)
                      </div>
                    </div>
                    <button
                      onClick={() => toggleTracking("clarity")}
                      className={`px-3 py-2 rounded-md ${
                        data.tracking.clarity
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100"
                      }`}
                    >
                      {data.tracking.clarity ? "Connected" : "Connect"}
                    </button>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="font-medium">Sample Heatmap Snapshots</h4>
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div className="border border-gray-300 rounded-md p-2 text-sm text-center">
                      <img
                        src="https://via.placeholder.com/260x160?text=Heatmap+1"
                        alt="heatmap1"
                        className="mx-auto"
                      />
                      <div className="mt-2 text-xs text-gray-500">
                        Home page · July
                      </div>
                    </div>
                    <div className="border border-gray-300 rounded-md p-2 text-sm text-center">
                      <img
                        src="https://via.placeholder.com/260x160?text=Heatmap+2"
                        alt="heatmap2"
                        className="mx-auto"
                      />
                      <div className="mt-2 text-xs text-gray-500">
                        Product page · July
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold">Settings & Guidance</h3>
                <p className="text-sm text-gray-600">
                  For production, add the respective script snippets into your
                  site header. Use proper privacy notices for session recording
                  tools.
                </p>
                <div className="mt-3 text-sm">
                  <strong>Privacy note:</strong> Hotjar/Clarity collect user
                  sessions — make sure you update your privacy policy and mask
                  sensitive fields.
                </div>
              </div>
            </div>
          )}

          {activeTab === "broken" && (
            <div>
              <h3 className="text-lg font-semibold">
                Broken Links / 404 Monitor
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                Demo list. Mark fixed or remove items. Add new broken URLs
                manually for testing.
              </p>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex gap-2">
                    <input
                      value={newBrokenUrl}
                      onChange={(e) => setNewBrokenUrl(e.target.value)}
                      placeholder="/missing-page"
                      className="w-full border border-gray-300 rounded-md p-2 text-sm"
                    />
                    <button
                      onClick={addBrokenLink}
                      className="px-3 py-2 bg-[#00BBAE] text-white rounded-md text-sm"
                    >
                      Add
                    </button>
                  </div>

                  <div className="mt-3 border border-gray-300 rounded-md overflow-auto">
                    <table className="min-w-full text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-3 py-2 text-left">URL</th>
                          <th className="px-3 py-2 text-left">Status</th>
                          <th className="px-3 py-2 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.brokenLinks.map((b) => (
                          <tr key={b.id} className="border-t border-gray-300">
                            <td className="px-3 py-2">{b.url}</td>
                            <td className="px-3 py-2">
                              <span
                                className={`px-2 py-1 rounded text-xs ${
                                  b.status === "Fixed"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                {b.status}
                              </span>
                            </td>
                            <td className="px-3 py-2">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => markFixed(b.id)}
                                  className="px-2 py-1 text-sm bg-gray-100 rounded"
                                >
                                  Mark fixed
                                </button>
                                <button
                                  onClick={() => removeBrokenLink(b.id)}
                                  className="px-2 py-1 text-sm bg-red-50 text-red-600 rounded"
                                >
                                  Remove
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {data.brokenLinks.length === 0 && (
                          <tr>
                            <td
                              colSpan={3}
                              className="px-3 py-4 text-sm text-gray-500"
                            >
                              No broken links found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium">404 Monitor Tips</h4>
                  <ul className="list-disc ml-5 mt-2 text-sm text-gray-600 space-y-1">
                    <li>
                      Use server logs or crawler to detect new 404s
                      automatically (demo manual here).
                    </li>
                    <li>
                      Provide custom 404 page with search and helpful links.
                    </li>
                    <li>
                      Track frequent 404s and set redirects for high-value
                      pages.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border border-gray-300 rounded-md bg-white">
                <div className="text-sm text-gray-500">Monthly Visitors</div>
                <div className="text-2xl font-semibold">
                  {data.analyticsDemo.monthlyVisitors.toLocaleString()}
                </div>
              </div>
              <div className="p-4 border border-gray-300 rounded-md bg-white">
                <div className="text-sm text-gray-500">Bounce Rate</div>
                <div className="text-2xl font-semibold">
                  {data.analyticsDemo.bounceRate}%
                </div>
              </div>
              <div className="p-4 border border-gray-300 rounded-md bg-white">
                <div className="text-sm text-gray-500">Conversions</div>
                <div className="text-2xl font-semibold">
                  {data.analyticsDemo.conversions}
                </div>
              </div>

              <div className="md:col-span-3 mt-3 bg-white border border-gray-300 rounded-md p-4">
                <h4 className="font-semibold">Quick Analytics Notes</h4>
                <ul className="mt-2 text-sm text-gray-600 list-disc ml-5">
                  <li>These numbers are demo values to illustrate the UI.</li>
                  <li>
                    When GA4 is connected, replace the demo numbers with GA4 API
                    pulls or BigQuery exports.
                  </li>
                  <li>
                    Use event tracking for returns and defect video plays to
                    improve product/CS workflows.
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
