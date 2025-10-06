import React from "react";
import { useParams, useNavigate } from "react-router-dom";

// mock transactions object (same keys as customer.customerId)
const transactions = {
  "CUST-001": [
    {
      id: "txn-001",
      type: "Add Points",
      points: 50,
      expiry: "2025-12-31",
      transactionFor: "Signup Bonus",
      remarks: "Welcome reward",
    },
    {
      id: "txn-002",
      type: "Add Points",
      points: 200,
      expiry: "2025-10-10",
      transactionFor: "Order #1234",
      remarks: "Cashback",
    },
    {
      id: "txn-006",
      type: "Admin Add Points",
      points: 75,
      expiry: "2026-01-01",
      transactionFor: "Admin Adjustment",
      remarks: "Manual credit by Admin",
    },
  ],
  "CUST-002": [
    {
      id: "txn-003",
      type: "Add Points",
      points: 100,
      expiry: "2025-11-20",
      transactionFor: "Order #5678",
      remarks: "Cashback",
    },
    {
      id: "txn-007",
      type: "Admin Add Points",
      points: 50,
      expiry: "2026-02-15",
      transactionFor: "Loyalty Bonus",
      remarks: "Special reward by Admin",
    },
  ],
  "CUST-003": [
    {
      id: "txn-004",
      type: "Add Points",
      points: 300,
      expiry: "2025-09-30",
      transactionFor: "Order #8888",
      remarks: "Festival Sale",
    },
    {
      id: "txn-005",
      type: "Add Points",
      points: 50,
      expiry: "2025-12-31",
      transactionFor: "Signup Bonus",
      remarks: "Welcome reward",
    },
  ],
};
const UserTransactions = () => {
  const { customerId } = useParams(); // e.g. "CUST-001"
  const navigate = useNavigate();

  const userTxns = transactions[customerId] || [];

  return (
    <div className="bg-gray-50 flex-1 overflow-y-auto p-4">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-300">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-700">
            Transactions — {customerId}
          </h2>
          <button
            onClick={() => navigate(-1)}
            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
          >
            ← Back
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-300">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Sr No.
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Transaction ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Points
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Expiry Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Transaction For
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Remarks
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-300">
              {userTxns.length > 0 ? (
                userTxns.map((txn, index) => (
                  <tr
                    key={txn.id}
                    className="hover:bg-gray-50 transition duration-150 ease-in-out"
                  >
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">
                      {txn.id}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {txn.type}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-yellow-700">
                      {txn.points}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {txn.expiry}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {txn.transactionFor}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {txn.remarks}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-4 py-3 text-center text-gray-500"
                  >
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserTransactions;
