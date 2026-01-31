import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Package, MapPin, CreditCard, FileText, Clock, Check, X } from 'lucide-react';
import api from '../../api/axios';

export default function PaymentDetail() {
  const { id: paymentId } = useParams();
  const navigate = useNavigate();

  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get(`/admin/payments/${paymentId}`);
        setPayment(res.data.payment);
      } catch (err) {
        console.error(err);
        setError('Failed to load payment details');
      } finally {
        setLoading(false);
      }
    };

    if (paymentId) {
      fetchPayment();
    }
  }, [paymentId]);

  const formatDate = (date) => {
    if (!date) return '—';
    return new Date(date).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    const statusMap = {
      SUCCESS: 'bg-green-100 text-green-800',
      FAILED: 'bg-red-100 text-red-800',
      PENDING: 'bg-yellow-100 text-yellow-800',
      REFUNDED: 'bg-blue-100 text-blue-800'
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="h-screen p-6 overflow-y-auto bg-primary-50">
      <div className="max-w-7xl mx-auto">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Payments
        </button>

        {loading ? (
          <div className="bg-white rounded-lg border border-primary-100 shadow-sm p-12">
            <div className="flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          </div>
        ) : error ? (
          <div className="bg-white rounded-lg border border-primary-100 shadow-sm p-12">
            <div className="text-center">
              <X className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        ) : !payment ? (
          <div className="bg-white rounded-lg border border-primary-100 shadow-sm p-12">
            <div className="text-center text-gray-500">No payment data found</div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header Card */}
            <div className="bg-white rounded-lg border border-primary-100 shadow-sm p-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">
                      ₹{payment.amount}
                    </h1>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(payment.status)}`}>
                      {payment.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">
                    Payment ID: <span className="text-blue-600 font-medium">{payment.paymentId}</span>
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Reference:</span>
                      <p className="font-medium text-gray-900">{payment.referenceNumber}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Gateway:</span>
                      <p className="font-medium text-gray-900">{payment.paymentGateway}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Method:</span>
                      <p className="font-medium text-gray-900 flex items-center gap-1">
                        <span className="text-lg">⚡</span>
                        {payment.paymentMethod}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Transaction ID:</span>
                      <p className="font-medium text-gray-900">{payment.gatewayTransactionId}</p>
                    </div>
                  </div>
                </div>

                <div className="lg:w-80 space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-gray-500">Initiated</p>
                      <p className="font-medium text-gray-900">{formatDate(payment.initiatedAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-600" />
                    <div>
                      <p className="text-gray-500">Processed</p>
                      <p className="font-medium text-gray-900">{formatDate(payment.processedAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer & Order Info */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Customer Details */}
              <div className="bg-white rounded-lg border border-primary-100 shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">👤</span>
                  </div>
                  Customer Details
                </h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Name</p>
                    <p className="text-sm font-medium text-gray-900">{payment.userId?.name || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Email</p>
                    <p className="text-sm font-medium text-gray-900">{payment.userId?.email || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Phone</p>
                    <p className="text-sm font-medium text-gray-900">+91 {payment.userId?.phone || '—'}</p>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-white rounded-lg border border-primary-100 shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Package className="w-4 h-4 text-purple-600" />
                  </div>
                  Order Information
                </h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Order ID</p>
                    <p className="text-sm font-medium text-gray-900">{payment.orderId?.orderId || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Order Status</p>
                    <p className="text-sm font-medium text-gray-900">{payment.orderId?.orderStatus || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Payment Status</p>
                    <p className="text-sm font-medium text-gray-900">{payment.orderId?.paymentStatus || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Delivery Type</p>
                    <p className="text-sm font-medium text-gray-900">{payment.orderId?.deliveryType || '—'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            {payment.orderId?.items && payment.orderId.items.length > 0 && (
              <div className="bg-white rounded-lg border border-primary-100 shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Package className="w-4 h-4 text-green-600" />
                  </div>
                  Order Items
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Product</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Color</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Age Group</th>
                        <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Qty</th>
                        <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Price</th>
                        <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {payment.orderId.items.map((item, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900">{item.productName}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{item.colorName}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{item.ageGroupName}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 text-right">{item.quantity}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 text-right">₹{item.pricePerUnit}</td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">₹{item.totalPrice}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pricing Summary */}
                <div className="mt-6 pt-6 border-t">
                  <div className="max-w-md ml-auto space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">₹{payment.orderId.pricing?.subtotal || 0}</span>
                    </div>
                    {payment.orderId.pricing?.totalDiscount !== 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Discount</span>
                        <span className="font-medium">₹{payment.orderId.pricing?.totalDiscount || 0}</span>
                      </div>
                    )}
                    {payment.orderId.pricing?.deliveryCharges > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Delivery Charges</span>
                        <span className="font-medium">₹{payment.orderId.pricing?.deliveryCharges || 0}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-base font-semibold pt-2 border-t">
                      <span>Total</span>
                      <span>₹{payment.orderId.pricing?.total || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Addresses */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Shipping Address */}
              {payment.orderId?.shippingAddress && (
                <div className="bg-white rounded-lg border border-primary-100 shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-orange-600" />
                    </div>
                    Shipping Address
                  </h2>
                  <div className="text-sm text-gray-700 space-y-1">
                    <p className="font-medium">{payment.orderId.shippingAddress.nickname}</p>
                    <p>{payment.orderId.shippingAddress.houseStreet}</p>
                    <p>{payment.orderId.shippingAddress.apartment}</p>
                    <p>{payment.orderId.shippingAddress.city}</p>
                    <p>{payment.orderId.shippingAddress.district}, {payment.orderId.shippingAddress.state}</p>
                    <p>{payment.orderId.shippingAddress.zipCode}</p>
                  </div>
                </div>
              )}

              {/* Billing Address */}
              {payment.orderId?.billingAddress && (
                <div className="bg-white rounded-lg border border-primary-100 shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-indigo-600" />
                    </div>
                    Billing Address
                  </h2>
                  <div className="text-sm text-gray-700 space-y-1">
                    <p className="font-medium">{payment.orderId.billingAddress.nickname}</p>
                    <p>{payment.orderId.billingAddress.houseStreet}</p>
                    <p>{payment.orderId.billingAddress.apartment}</p>
                    <p>{payment.orderId.billingAddress.city}</p>
                    <p>{payment.orderId.billingAddress.district}, {payment.orderId.billingAddress.state}</p>
                    <p>{payment.orderId.billingAddress.zipCode}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Invoice Information */}
            {payment.invoiceId && (
              <div className="bg-white rounded-lg border border-primary-100 shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-teal-600" />
                  </div>
                  Invoice Details
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Invoice Number</p>
                    <p className="text-sm font-medium text-gray-900">{payment.invoiceId.posInvoiceNumber || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Invoice Date</p>
                    <p className="text-sm font-medium text-gray-900">{formatDate(payment.invoiceId.invoiceDate)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Status</p>
                    <p className="text-sm font-medium text-gray-900">{payment.invoiceId.status || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">POS Customer ID</p>
                    <p className="text-sm font-medium text-gray-900">{payment.invoiceId.posCustomerId || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">POS Invoice ID</p>
                    <p className="text-sm font-medium text-gray-900">{payment.invoiceId.posInvoiceId || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Payment Method</p>
                    <p className="text-sm font-medium text-gray-900">{payment.invoiceId.paymentMethod || '—'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Gateway Response */}
            {payment.gatewayResponse && (
              <div className="bg-white rounded-lg border border-primary-100 shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-pink-600" />
                  </div>
                  Gateway Response
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Payment ID</p>
                    <p className="text-sm font-medium text-gray-900">{payment.gatewayResponse.payment_id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Transaction Ref</p>
                    <p className="text-sm font-medium text-gray-900">{payment.gatewayResponse.transaction_reference_number}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Status</p>
                    <p className="text-sm font-medium text-green-600">{payment.gatewayResponse.status}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Amount Captured</p>
                    <p className="text-sm font-medium text-gray-900">₹{payment.gatewayResponse.amount_captured}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Amount Refunded</p>
                    <p className="text-sm font-medium text-gray-900">₹{payment.gatewayResponse.amount_refunded}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Fee Amount</p>
                    <p className="text-sm font-medium text-gray-900">₹{payment.gatewayResponse.fee_amount}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}