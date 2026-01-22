import React from "react";
import { Calendar, Sparkles } from "lucide-react";

const Upcoming = () => {
  return (
    <div className="flex-1 flex items-center justify-center bg-primary-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-primary-100 shadow-sm p-8 text-center">
        
        {/* Icon */}
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
          <Calendar className="h-7 w-7 text-blue-600" />
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-800">
          Upcoming Features
        </h2>

        {/* Description */}
        <p className="mt-2 text-sm text-gray-600">
          Exciting new features are on the way! Stay tuned for updates and
          enhancements to your admin dashboard.
        </p>

        {/* Status badge */}
        <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
          <Sparkles className="h-4 w-4" />
          Upcoming
        </div>

        {/* Footer note */}
        <p className="mt-6 text-xs text-gray-400">
          We're building something amazing for you ✨
        </p>
      </div>
    </div>
  );
};

export default Upcoming;
