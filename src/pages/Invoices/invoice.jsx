import React from "react";
import { Download } from "lucide-react";

/**
 * Simple tax-invoice style layout using invoice + order data.
 *
 * Props:
 * - invoiceData: Invoice document from /invoice/order/:id
 * - orderDetails: Optional full order (used as fallback for some fields)
 */
const Invoice = ({ invoiceData, orderDetails }) => {
  if (!invoiceData) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md max-w-3xl mx-auto">
        <h2 className="text-lg font-semibold text-gray-800">
          Invoice not available for this order.
        </h2>
      </div>
    );
  }

  const {
    posInvoiceNumber,
    invoiceId,
    referenceNumber,
    pricing = {},
    items = [],
    shippingAddress,
    billingAddress,
    paymentMethod,
    status,
    paymentStatus,
    invoiceDate,
    dueDate,
    userId,
  } = invoiceData;

  const customerName = userId?.name || orderDetails?.shippingAddress?.nickname || "Customer";
  const customerEmail = userId?.email || "";
  const customerPhone = userId?.phone || "";

  const orderId = referenceNumber || orderDetails?.orderId || "";

  const subtotal =
    typeof pricing.subtotal === "number"
      ? pricing.subtotal
      : items.reduce((sum, it) => sum + (it.totalPrice || 0), 0);

  const totalDiscount =
    (pricing.totalDiscount || 0) +
    (pricing.couponDiscount || 0) +
    (pricing.pointsDiscount || 0);

  const deliveryCharges = pricing.deliveryCharges || 0;
  const giftPackCharges = pricing.giftPackCharges || 0;
  const adjustment = pricing.adjustment || 0;

  const total =
    typeof pricing.total === "number"
      ? pricing.total
      : subtotal - totalDiscount + deliveryCharges + giftPackCharges + adjustment;

  const balance = typeof pricing.balance === "number" ? pricing.balance : 0;
  const paymentMade =
    balance > 0 ? Math.max(total - balance, 0) : paymentStatus === "PAID" ? total : 0;

  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "-";

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-lg shadow-md max-w-3xl mx-auto text-xs sm:text-sm text-gray-800">
      {/* Header */}
      <div className="flex justify-between border-b border-gray-300 p-4">
        <div>
          <h1 className="text-lg sm:text-2xl font-bold">Gofy Kids Mall</h1>
          <p className="mt-1">B-131, Derawal Nagar, Model Town</p>
          <p>Delhi 110009, India</p>
          <p>GSTIN: 07AQFST0242M1Z9</p>
          <p>Email: gofywebsite@gmail.com</p>
          <p>www.gofy.app</p>
        </div>
        <div className="text-right flex flex-col items-end gap-2">
          <span className="text-xl font-semibold tracking-wide">TAX INVOICE</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
              paymentStatus === "PAID"
                ? "bg-green-100 text-green-700"
                : paymentStatus === "PENDING"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {paymentStatus || "PENDING"}
          </span>
          <button
            type="button"
            onClick={handlePrint}
            className="mt-1 inline-flex items-center gap-1 px-2 py-1 border border-gray-300 rounded text-[11px] hover:bg-gray-50"
          >
            <Download className="w-3 h-3" />
            Print
          </button>
        </div>
      </div>

      {/* Invoice meta */}
      <div className="grid grid-cols-2 gap-4 border-b border-gray-300 p-4">
        <div className="space-y-1">
          <div className="flex gap-2">
            <span className="font-semibold w-20">Invoice #</span>
            <span>{posInvoiceNumber || invoiceId || "-"}</span>
          </div>
          <div className="flex gap-2">
            <span className="font-semibold w-20">Invoice Date</span>
            <span>{formatDate(invoiceDate)}</span>
          </div>
          <div className="flex gap-2">
            <span className="font-semibold w-20">Due Date</span>
            <span>{formatDate(dueDate)}</span>
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex gap-2">
            <span className="font-semibold w-24">Order No.</span>
            <span>{orderId}</span>
          </div>
          <div className="flex gap-2">
            <span className="font-semibold w-24">Place of Supply</span>
            <span>{shippingAddress?.state || "Delhi (07)"}</span>
          </div>
          <div className="flex gap-2">
            <span className="font-semibold w-24">Status</span>
            <span>{status || "PAID"}</span>
          </div>
        </div>
      </div>

      {/* Bill To / Ship To */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-gray-300 p-4">
        <div className="space-y-1">
          <h2 className="font-semibold mb-1">Bill To</h2>
          <p className="font-medium">{customerName}</p>
          {billingAddress && (
            <>
              <p>{billingAddress.houseStreet}</p>
              {billingAddress.apartment && <p>{billingAddress.apartment}</p>}
              <p>
                {billingAddress.city}, {billingAddress.state} -{" "}
                {billingAddress.zipCode}
              </p>
            </>
          )}
          {customerPhone && <p>Mob: {customerPhone}</p>}
          {customerEmail && <p>Email: {customerEmail}</p>}
        </div>
        <div className="space-y-1">
          <h2 className="font-semibold mb-1">Ship To</h2>
          <p className="font-medium">{customerName}</p>
          {shippingAddress && (
            <>
              <p>{shippingAddress.houseStreet}</p>
              {shippingAddress.apartment && <p>{shippingAddress.apartment}</p>}
              <p>
                {shippingAddress.city}, {shippingAddress.state} -{" "}
                {shippingAddress.zipCode}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Items table */}
      <div className="p-4 border-b border-gray-300 overflow-x-auto">
        <table className="w-full border border-gray-300 text-xs sm:text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="border border-gray-300 px-2 py-1 text-left w-8">#</th>
              <th className="border border-gray-300 px-2 py-1 text-left">
                Item &amp; Description
              </th>
              <th className="border border-gray-300 px-2 py-1 text-right w-16">
                Qty
              </th>
              <th className="border border-gray-300 px-2 py-1 text-right w-20">
                Rate
              </th>
              <th className="border border-gray-300 px-2 py-1 text-right w-24">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={idx}>
                <td className="border border-gray-300 px-2 py-1 text-center">
                  {idx + 1}
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  <div className="font-medium">{item.productName}</div>
                </td>
                <td className="border border-gray-300 px-2 py-1 text-right">
                  {item.quantity}
                </td>
                <td className="border border-gray-300 px-2 py-1 text-right">
                  ₹{(item.pricePerUnit || 0).toFixed(2)}
                </td>
                <td className="border border-gray-300 px-2 py-1 text-right">
                  ₹{(item.totalPrice || 0).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals & Terms */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
        <div className="text-[10px] sm:text-xs space-y-1">
          <h3 className="font-semibold mb-1">Terms &amp; Conditions</h3>
          <ol className="list-decimal list-inside space-y-0.5 text-gray-700">
            <li>No refund allowed.</li>
            <li>
              Exchange allowed within 3 days of purchase (original bill and
              unused product required).
            </li>
            <li>Damaged or used products will not be accepted for exchange.</li>
            <li>No exchange on discounted / sale items.</li>
            <li>All disputes subject to local jurisdiction.</li>
          </ol>
          <p className="mt-2 italic text-gray-500">
            This is a computer-generated invoice. No signature required.
          </p>
        </div>

        <div className="sm:pl-6">
          <table className="w-full text-xs sm:text-sm">
            <tbody>
              <tr>
                <td className="py-1 text-gray-700">Sub Total</td>
                <td className="py-1 text-right font-semibold">
                  ₹{subtotal.toFixed(2)}
                </td>
              </tr>
              {totalDiscount > 0 && (
                <tr>
                  <td className="py-1 text-gray-700">Total Discount</td>
                  <td className="py-1 text-right font-semibold text-green-700">
                    - ₹{totalDiscount.toFixed(2)}
                  </td>
                </tr>
              )}
              {deliveryCharges > 0 && (
                <tr>
                  <td className="py-1 text-gray-700">Delivery Charges</td>
                  <td className="py-1 text-right font-semibold">
                    + ₹{deliveryCharges.toFixed(2)}
                  </td>
                </tr>
              )}
              {giftPackCharges > 0 && (
                <tr>
                  <td className="py-1 text-gray-700">Gift Pack Charges</td>
                  <td className="py-1 text-right font-semibold">
                    + ₹{giftPackCharges.toFixed(2)}
                  </td>
                </tr>
              )}
              {adjustment !== 0 && (
                <tr>
                  <td className="py-1 text-gray-700">Adjustment</td>
                  <td className="py-1 text-right font-semibold">
                    {adjustment > 0 ? "+" : "-"}
                    ₹{Math.abs(adjustment).toFixed(2)}
                  </td>
                </tr>
              )}
              <tr className="border-t border-gray-300">
                <td className="py-2 font-bold text-gray-900">Total</td>
                <td className="py-2 text-right text-base font-bold text-gray-900">
                  ₹{total.toFixed(2)}
                </td>
              </tr>
              <tr>
                <td className="py-1 text-gray-700">Payment Made</td>
                <td className="py-1 text-right font-semibold text-green-700">
                  - ₹{paymentMade.toFixed(2)}
                </td>
              </tr>
              <tr>
                <td className="py-1 text-gray-700">Balance Due</td>
                <td className="py-1 text-right font-semibold">
                  ₹{(balance || Math.max(total - paymentMade, 0)).toFixed(2)}
                </td>
              </tr>
              <tr>
                <td className="py-1 text-gray-700">Payment Method</td>
                <td className="py-1 text-right font-semibold">
                  {paymentMethod || orderDetails?.paymentMethod || "ONLINE"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
