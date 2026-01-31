import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

const FilterForm = ({ onApplyFilters }) => {
  const [expanded, setExpanded] = useState(false);

  const [filters, setFilters] = useState({
    orderId: "",
    paymentId: "",
    customer: "",
    product: "",
    orderStatus: "",
    paymentStatus: "",
    paymentMode: "",
    orderDateFrom: "",
    orderDateTo: "",
    deliveryDateFrom: "",
    deliveryDateTo: "",
    trackingNo: "",
    city: "",
    state: "",
    pincode: "",
    productCategory: [],
    productType: "",
    channel: "",
    utmSource: "",
    promoApplied: "",
    promoCode: "",
    cartValueMin: "",
    cartValueMax: "",
    discountMin: "",
    discountMax: "",
    coinsUsed: "",
    giftWrap: "",
    repeatCustomer: "",
    deliveryPartner: "",
    storePickup: "",
    includeCancelled: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked, multiple, options } = e.target;

    if (type === "checkbox") {
      setFilters((prev) => ({ ...prev, [name]: checked }));
    } else if (multiple) {
      const selected = Array.from(options)
        .filter((o) => o.selected)
        .map((o) => o.value);
      setFilters((prev) => ({ ...prev, [name]: selected }));
    } else {
      setFilters((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onApplyFilters) onApplyFilters(filters);
    console.log("Applied Filters:", filters);
  };

  return (
    <div className="mx-auto bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center justify-between p-4 md:p-6 text-left hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset rounded-xl"
        aria-expanded={expanded}
      >
        <h2 className="text-lg font-semibold text-gray-800">Order Filters</h2>
        <span className="flex items-center gap-2 text-sm font-medium text-gray-600">
          {expanded ? "Collapse" : "Expand"}
          <FontAwesomeIcon
            icon={expanded ? faChevronUp : faChevronDown}
            className="h-4 w-4"
          />
        </span>
      </button>

      {expanded && (
        <div className="px-4 md:px-6 pb-6 pt-0 border-t border-gray-100">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6"
          >
            {/* Order Filters */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Order ID</label>
              <input
                type="text"
                name="orderId"
                value={filters.orderId}
                onChange={handleChange}
                className="mt-1 w-full p-2 border border-gray-200 rounded-lg"
                placeholder="Enter Order ID"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Payment ID</label>
              <input
                type="text"
                name="paymentId"
                value={filters.paymentId}
                onChange={handleChange}
                className="mt-1 w-full p-2 border border-gray-200 rounded-lg"
                placeholder="Enter Payment ID"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Customer (Name, Email, Phone)</label>
              <input
                type="text"
                name="customer"
                value={filters.customer}
                onChange={handleChange}
                className="mt-1 w-full p-2 border border-gray-200 rounded-lg"
                placeholder="Search customer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Product Name / SKU</label>
              <input
                type="text"
                name="product"
                value={filters.product}
                onChange={handleChange}
                className="mt-1 w-full p-2 border border-gray-200 rounded-lg"
                placeholder="Enter Product or SKU"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Order Status</label>
              <select
                name="orderStatus"
                value={filters.orderStatus}
                onChange={handleChange}
                className="mt-1 w-full p-2 border border-gray-200 rounded-lg"
              >
                <option value="">-- Select --</option>
                <option>PENDING</option>
                <option>CONFIRMED</option>
                <option>PROCESSING</option>
                <option>SHIPPED</option>
                <option>DELIVERED</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Payment Status</label>
              <select
                name="paymentStatus"
                value={filters.paymentStatus}
                onChange={handleChange}
                className="mt-1 w-full p-2 border border-gray-200 rounded-lg"
              >
                <option value="">-- Select --</option>
                <option>PAID</option>
                <option>PENDING</option>
                <option>Failed</option>
                <option>REFUNDED</option>
                <option>INITIATED</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Payment Mode</label>
              <select
                name="paymentMode"
                value={filters.paymentMode}
                onChange={handleChange}
                className="mt-1 w-full p-2 border border-gray-200 rounded-lg"
              >
                <option value="">-- Select --</option>
                <option>COD</option>
                <option>ONLINE</option>
                <option>CARD</option>
                <option>NETBANKING</option>
                <option>WALLET</option>
              </select>
            </div>

            {/* Date Filters */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Order Date (From)</label>
              <input
                type="date"
                name="orderDateFrom"
                value={filters.orderDateFrom}
                onChange={handleChange}
                className="mt-1 w-full p-2 border border-gray-200 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Order Date (To)</label>
              <input
                type="date"
                name="orderDateTo"
                value={filters.orderDateTo}
                onChange={handleChange}
                className="mt-1 w-full p-2 border border-gray-200 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Delivery Date (From)</label>
              <input
                type="date"
                name="deliveryDateFrom"
                value={filters.deliveryDateFrom}
                onChange={handleChange}
                className="mt-1 w-full p-2 border border-gray-200 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Delivery Date (To)</label>
              <input
                type="date"
                name="deliveryDateTo"
                value={filters.deliveryDateTo}
                onChange={handleChange}
                className="mt-1 w-full p-2 border border-gray-200 rounded-lg"
              />
            </div>

            {/* Shipping */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Courier AWB / Tracking No.</label>
              <input
                type="text"
                name="trackingNo"
                value={filters.trackingNo}
                onChange={handleChange}
                className="mt-1 w-full p-2 border border-gray-200 rounded-lg"
                placeholder="Enter Tracking No."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">City</label>
              <input
                type="text"
                name="city"
                value={filters.city}
                onChange={handleChange}
                className="mt-1 w-full p-2 border border-gray-200 rounded-lg"
                placeholder="Enter City"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">State</label>
              <select
                name="state"
                value={filters.state}
                onChange={handleChange}
                className="mt-1 w-full p-2 border border-gray-200 rounded-lg"
              >
                <option value="">-- Select State --</option>
                <option>State 1</option>
                <option>State 2</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Pincode</label>
              <input
                type="text"
                name="pincode"
                value={filters.pincode}
                onChange={handleChange}
                className="mt-1 w-full p-2 border border-gray-200 rounded-lg"
                placeholder="Enter Pincode"
              />
            </div>

            {/* Product */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Product Category</label>
              <select
                name="productCategory"
                multiple
                value={filters.productCategory}
                onChange={handleChange}
                className="mt-1 w-full p-2 border border-gray-200 rounded-lg"
              >
                <option>Babywear</option>
                <option>Toys</option>
                <option>Accessories</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Product Type</label>
              <select
                name="productType"
                value={filters.productType}
                onChange={handleChange}
                className="mt-1 w-full p-2 border border-gray-200 rounded-lg"
              >
                <option>Physical</option>
                <option>Digital</option>
                <option>Gift card</option>
              </select>
            </div>

            {/* Marketing */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Channel</label>
              <select
                name="channel"
                value={filters.channel}
                onChange={handleChange}
                className="mt-1 w-full p-2 border border-gray-200 rounded-lg"
              >
                <option>Web</option>
                <option>App (iOS/Android)</option>
                <option>Offline POS</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">UTM Source</label>
              <select
                name="utmSource"
                value={filters.utmSource}
                onChange={handleChange}
                className="mt-1 w-full p-2 border border-gray-200 rounded-lg"
              >
                <option>Facebook</option>
                <option>Instagram</option>
                <option>Email</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Promo Code Applied?</label>
              <select
                name="promoApplied"
                value={filters.promoApplied}
                onChange={handleChange}
                className="mt-1 w-full p-2 border border-gray-200 rounded-lg"
              >
                <option>Yes</option>
                <option>No</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Promo Code</label>
              <input
                type="text"
                name="promoCode"
                value={filters.promoCode}
                onChange={handleChange}
                className="mt-1 w-full p-2 border border-gray-200 rounded-lg"
                placeholder="Enter Promo Code"
              />
            </div>

            {/* Ranges */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Cart Value Min</label>
              <input
                type="number"
                name="cartValueMin"
                value={filters.cartValueMin}
                onChange={handleChange}
                className="mt-1 w-full p-2 border border-gray-200 rounded-lg"
                placeholder="Min Value"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Cart Value Max</label>
              <input
                type="number"
                name="cartValueMax"
                value={filters.cartValueMax}
                onChange={handleChange}
                className="mt-1 w-full p-2 border border-gray-200 rounded-lg"
                placeholder="Max Value"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Coupon Discount Min</label>
              <input
                type="number"
                name="discountMin"
                value={filters.discountMin}
                onChange={handleChange}
                className="mt-1 w-full p-2 border border-gray-200 rounded-lg"
                placeholder="Min Discount"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Coupon Discount Max</label>
              <input
                type="number"
                name="discountMax"
                value={filters.discountMax}
                onChange={handleChange}
                className="mt-1 w-full p-2 border border-gray-200 rounded-lg"
                placeholder="Max Discount"
              />
            </div>

            {/* Misc */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Coins Used?</label>
              <select
                name="coinsUsed"
                value={filters.coinsUsed}
                onChange={handleChange}
                className="mt-1 w-full p-2 border border-gray-200 rounded-lg"
              >
                <option>Yes</option>
                <option>No</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Gift Wrapping Applied?</label>
              <select
                name="giftWrap"
                value={filters.giftWrap}
                onChange={handleChange}
                className="mt-1 w-full p-2 border border-gray-200 rounded-lg"
              >
                <option>Yes</option>
                <option>No</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Repeat Customer?</label>
              <select
                name="repeatCustomer"
                value={filters.repeatCustomer}
                onChange={handleChange}
                className="mt-1 w-full p-2 border border-gray-200 rounded-lg"
              >
                <option>Yes</option>
                <option>No</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Delivery Partner</label>
              <select
                name="deliveryPartner"
                value={filters.deliveryPartner}
                onChange={handleChange}
                className="mt-1 w-full p-2 border border-gray-200 rounded-lg"
              >
                <option>1 Hour Delivery</option>
                <option>DTDC</option>
                <option>Fast Delivery</option>
                <option>Store Pickup</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Store Pickup?</label>
              <select
                name="storePickup"
                value={filters.storePickup}
                onChange={handleChange}
                className="mt-1 w-full p-2 border border-gray-200 rounded-lg"
              >
                <option>Yes</option>
                <option>No</option>
              </select>
            </div>

            {/* Include Cancelled */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="includeCancelled"
                checked={filters.includeCancelled}
                onChange={handleChange}
                className="h-4 w-4 text-primary-600 border-gray-300 rounded"
              />
              <label htmlFor="includeCancelled" className="text-sm text-gray-700">
                Include Cancelled/Returned?
              </label>
            </div>

            {/* Apply Filter Button */}
            <div className="col-span-full">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg shadow hover:bg-blue-700 transition"
              >
                Apply Filters
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default FilterForm;
