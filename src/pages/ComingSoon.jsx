import React from "react";
import { Construction, Clock } from "lucide-react";

const ComingSoon = () => {
  return (
    <div className="flex-1 flex items-center justify-center bg-primary-50 px-4">
      <div className="max-w-lg w-full bg-white border border-primary-100 rounded-2xl shadow-sm p-8 text-center">
        
        {/* Icon */}
        <div className="mx-auto mb-5 flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100">
          <Construction className="w-8 h-8 text-yellow-600" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-gray-800">
          Coming Soon
        </h1>

        {/* Description */}
        <p className="mt-3 text-sm text-gray-600 leading-relaxed">
          This feature is currently in progress and will be available
          soon. We’re working hard to bring you the best experience.
        </p>

        {/* Status */}
        <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-medium">
          <Clock className="w-4 h-4" />
          Coming Soon
        </div>

        {/* Footer Note */}
        <p className="mt-6 text-xs text-gray-400">
          Thank you for your patience 🚀
        </p>
      </div>
    </div>
  );
};

export default ComingSoon;
