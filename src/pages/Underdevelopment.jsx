import React from "react";
import { Construction, Clock } from "lucide-react";

const UnderDevelopment = () => {
  return (
    <div className="flex-1 flex items-center justify-center bg-primary-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-primary-100 shadow-sm p-8 text-center">
        
        {/* Icon */}
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-yellow-100">
          <Construction className="h-7 w-7 text-yellow-600" />
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-800">
          Under Development
        </h2>

        {/* Description */}
        <p className="mt-2 text-sm text-gray-600">
          This section is currently being built. It will be available soon in
          your admin dashboard.
        </p>

        {/* Status badge */}
        <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700">
          <Clock className="h-4 w-4" />
          Processing
        </div>

        {/* Footer note */}
        <p className="mt-6 text-xs text-gray-400">
          Thank you for your patience 🚀
        </p>
      </div>
    </div>
  );
};

export default UnderDevelopment;
