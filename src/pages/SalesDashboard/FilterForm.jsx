import React from "react";

const FilterForm = () => {
  return (
    <div className="mx-auto bg-white p-6 rounded-xl shadow-md border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-800 mb-6">
        Order Filters
      </h2>
      <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Order Filters */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Order ID
          </label>
          <input
            type="text"
            className="mt-1 w-full p-2 border border-gray-200 rounded-lg"
            placeholder="Enter Order ID"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Payment ID
          </label>
          <input
            type="text"
            className="mt-1 w-full p-2 border border-gray-200 rounded-lg"
            placeholder="Enter Payment ID"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Customer (Name, Email, Phone)
          </label>
          <input
            type="text"
            className="mt-1 w-full p-2 border border-gray-200 rounded-lg"
            placeholder="Search customer"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Product Name / SKU
          </label>
          <input
            type="text"
            className="mt-1 w-full p-2 border border-gray-200 rounded-lg"
            placeholder="Enter Product or SKU"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Order Status
          </label>
          <select className="mt-1 w-full p-2 border border-gray-200 rounded-lg">
            <option value>-- Select --</option>
            <option>Pending</option>
            <option>Processing</option>
            <option>Shipped</option>
            <option>Delivered</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Payment Status
          </label>
          <select className="mt-1 w-full p-2 border border-gray-200 rounded-lg">
            <option value>-- Select --</option>
            <option>Paid</option>
            <option>COD Pending</option>
            <option>Failed</option>
            <option>Refunded</option>
            <option>Initiated</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Payment Mode
          </label>
          <select className="mt-1 w-full p-2 border border-gray-200 rounded-lg">
            <option value>-- Select --</option>
            <option>COD</option>
            <option>UPI</option>
            <option>Card</option>
            <option>Netbanking</option>
            <option>Wallet</option>
          </select>
        </div>
        {/* Date Filters */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Order Date (From)
          </label>
          <input
            type="date"
            className="mt-1 w-full p-2 border border-gray-200 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Order Date (To)
          </label>
          <input
            type="date"
            className="mt-1 w-full p-2 border border-gray-200 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Delivery Date (From)
          </label>
          <input
            type="date"
            className="mt-1 w-full p-2 border border-gray-200 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Delivery Date (To)
          </label>
          <input
            type="date"
            className="mt-1 w-full p-2 border border-gray-200 rounded-lg"
          />
        </div>
        {/* Shipping */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Courier AWB / Tracking No.
          </label>
          <input
            type="text"
            className="mt-1 w-full p-2 border border-gray-200 rounded-lg"
            placeholder="Enter Tracking No."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            City
          </label>
          <input
            type="text"
            className="mt-1 w-full p-2 border border-gray-200 rounded-lg"
            placeholder="Enter City"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            State
          </label>
          <select className="mt-1 w-full p-2 border border-gray-200 rounded-lg">
            <option>-- Select State --</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Pincode
          </label>
          <input
            type="text"
            className="mt-1 w-full p-2 border border-gray-200 rounded-lg"
            placeholder="Enter Pincode"
          />
        </div>
        {/* Product */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Product Category
          </label>
          <select
            multiple
            className="mt-1 w-full p-2 border border-gray-200 rounded-lg"
          >
            <option>Babywear</option>
            <option>Toys</option>
            <option>Accessories</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Product Type
          </label>
          <select className="mt-1 w-full p-2 border border-gray-200 rounded-lg">
            <option>Physical</option>
            <option>Digital</option>
            <option>Gift card</option>
          </select>
        </div>
        {/* Marketing */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Channel
          </label>
          <select className="mt-1 w-full p-2 border border-gray-200 rounded-lg">
            <option>Web</option>
            <option>App (iOS/Android)</option>
            <option>Offline POS</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            UTM Source
          </label>
          <select className="mt-1 w-full p-2 border border-gray-200 rounded-lg">
            <option>Facebook</option>
            <option>Instagram</option>
            <option>Email</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Promo Code Applied?
          </label>
          <select className="mt-1 w-full p-2 border border-gray-200 rounded-lg">
            <option>Yes</option>
            <option>No</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Promo Code
          </label>
          <input
            type="text"
            className="mt-1 w-full p-2 border border-gray-200 rounded-lg"
            placeholder="Enter Promo Code"
          />
        </div>
        {/* Ranges */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Cart Value Min
          </label>
          <input
            type="number"
            className="mt-1 w-full p-2 border border-gray-200 rounded-lg"
            placeholder="Min Value"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Cart Value Max
          </label>
          <input
            type="number"
            className="mt-1 w-full p-2 border border-gray-200 rounded-lg"
            placeholder="Max Value"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Coupon Discount Min
          </label>
          <input
            type="number"
            className="mt-1 w-full p-2 border border-gray-200 rounded-lg"
            placeholder="Min Discount"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Coupon Discount Max
          </label>
          <input
            type="number"
            className="mt-1 w-full p-2 border border-gray-200 rounded-lg"
            placeholder="Max Discount"
          />
        </div>
        {/* Misc */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Coins Used?
          </label>
          <select className="mt-1 w-full p-2 border border-gray-200 rounded-lg">
            <option>Yes</option>
            <option>No</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Gift Wrapping Applied?
          </label>
          <select className="mt-1 w-full p-2 border border-gray-200 rounded-lg">
            <option>Yes</option>
            <option>No</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Repeat Customer?
          </label>
          <select className="mt-1 w-full p-2 border border-gray-200 rounded-lg">
            <option>Yes</option>
            <option>No</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Delivery Partner
          </label>
          <select className="mt-1 w-full p-2 border border-gray-200 rounded-lg">
            <option>1 Hour Delivery</option>
            <option>DTDC</option>
            <option>Fast Delivery</option>
            <option>Store Pickup</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Store Pickup?
          </label>
          <select className="mt-1 w-full p-2 border border-gray-200 rounded-lg">
            <option>Yes</option>
            <option>No</option>
          </select>
        </div>
        {/* <div>
          <label className="block text-sm font-medium text-gray-700">
            Export as
          </label>
          <select className="mt-1 w-full p-2 border border-gray-200 rounded-lg">
            <option>CSV</option>
            <option>Excel</option>
          </select>
        </div> */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="cancelled"
            className="h-4 w-4 text-primary-600 border-gray-300 rounded"
          />
          <label htmlFor="cancelled" className="text-sm text-gray-700">
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
  );
};

export default FilterForm;
