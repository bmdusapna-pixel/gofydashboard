import { useState } from "react";

export default function ReferralDashboard() {
  // Global settings
  const [referralAmount, setReferralAmount] = useState(100); // per referral
  const [referralLimit, setReferralLimit] = useState(10); // max per user
  const [expandedUser, setExpandedUser] = useState(null);

  // Mock Data
  const users = [
    {
      id: 1,
      name: "Alice Johnson",
      phone: "+91 9876543210",
      joinDate: "2025-01-15",
      referralCode: "REF123",
      referrals: [
        {
          id: 101,
          name: "User A",
          phone: "+91 9123456780",
          joinDate: "2025-02-01",
        },
        {
          id: 102,
          name: "User B",
          phone: "+91 9345678901",
          joinDate: "2025-02-05",
        },
      ],
    },
    {
      id: 2,
      name: "Bob Smith",
      phone: "+91 9988776655",
      joinDate: "2025-02-20",
      referralCode: "REF456",
      referrals: [
        {
          id: 103,
          name: "User C",
          phone: "+91 9786543210",
          joinDate: "2025-03-01",
        },
      ],
    },
    {
      id: 3,
      name: "Charlie Brown",
      phone: "+91 9090909090",
      joinDate: "2025-03-10",
      referralCode: "REF789",
      referrals: [],
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-semibold">
        👥 Affiliate / Referral Dashboard
      </h2>

      {/* Global Settings */}
      <div className="grid grid-cols-2 gap-4 bg-white border border-gray-300 p-4 rounded-lg shadow-sm">
        <div>
          <label className="text-sm text-gray-600">
            Referral Amount (per referral)
          </label>
          <input
            type="number"
            value={referralAmount}
            onChange={(e) => setReferralAmount(Number(e.target.value))}
            className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="text-sm text-gray-600">
            Limit on Referrals Per User
          </label>
          <input
            type="number"
            value={referralLimit}
            onChange={(e) => setReferralLimit(Number(e.target.value))}
            className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto border border-gray-300 rounded-lg bg-white shadow-sm">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-gray-100 border-b border-gray-300">
            <tr>
              <th className="px-4 py-2 border-r border-gray-300">User</th>
              <th className="px-4 py-2 border-r border-gray-300">Phone</th>
              <th className="px-4 py-2 border-r border-gray-300">
                Joining Date
              </th>
              <th className="px-4 py-2 border-r border-gray-300">
                Referral Code
              </th>
              <th className="px-4 py-2 border-r border-gray-300">
                Total Referrals
              </th>
              <th className="px-4 py-2 border-r border-gray-300">Earnings</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <>
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-t border-r border-gray-300">
                    {u.name}
                  </td>
                  <td className="px-4 py-2 border-t border-r border-gray-300">
                    {u.phone}
                  </td>
                  <td className="px-4 py-2 border-t border-r border-gray-300">
                    {u.joinDate}
                  </td>
                  <td className="px-4 py-2 border-t border-r border-gray-300">
                    {u.referralCode}
                  </td>
                  <td className="px-4 py-2 border-t border-r border-gray-300">
                    {u.referrals.length} / {referralLimit}
                  </td>
                  <td className="px-4 py-2 border-t border-r border-gray-300 font-medium">
                    ₹{u.referrals.length * referralAmount}
                  </td>
                  <td className="px-4 py-2 border-t">
                    <span
                      onClick={() =>
                        setExpandedUser(expandedUser === u.id ? null : u.id)
                      }
                      className="text-blue-600 cursor-pointer hover:underline"
                    >
                      {expandedUser === u.id ? "Hide Users" : "View Users"}
                    </span>
                  </td>
                </tr>

                {/* Expanded User Details */}
                {expandedUser === u.id && (
                  <tr>
                    <td colSpan="7" className="px-4 py-3 bg-gray-50 border-t">
                      {u.referrals.length > 0 ? (
                        <div className="space-y-2">
                          <h4 className="font-medium">
                            Users Referred by {u.name}
                          </h4>
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm border border-gray-300 rounded-lg bg-white">
                              <thead className="bg-gray-100">
                                <tr>
                                  <th className="px-3 py-2 border border-gray-300">
                                    Name
                                  </th>
                                  <th className="px-3 py-2 border border-gray-300">
                                    Phone
                                  </th>
                                  <th className="px-3 py-2 border border-gray-300">
                                    Joining Date
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {u.referrals.map((ref) => (
                                  <tr key={ref.id} className="hover:bg-gray-50">
                                    <td className="px-3 py-2 border border-gray-300">
                                      {ref.name}
                                    </td>
                                    <td className="px-3 py-2 border border-gray-300">
                                      {ref.phone}
                                    </td>
                                    <td className="px-3 py-2 border border-gray-300">
                                      {ref.joinDate}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">
                          No users have used this referral code yet.
                        </p>
                      )}
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
