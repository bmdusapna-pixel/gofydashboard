import React from "react";

const ReturnListModal = ({ isOpen, onClose, reason, media }) => {
  if (!isOpen) {
    return null;
  }

  // Helper function to check if a URL is an image
  const isImage = (url) => {
    return url.match(/\.(jpeg|jpg|gif|png|webp)$/i);
  };

  // Helper function to check if a URL is a video
  const isVideo = (url) => {
    return url.match(/\.(mp4|webm|ogg)$/i);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto transition-opacity duration-300 ease-in-out"
      style={{ background: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="flex items-center justify-center min-h-screen px-4 py-8">
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-xl my-8 mx-auto p-6">
          {/* Modal Header */}
          <div className="flex justify-between items-center pb-3 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800">
              Return Details
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition duration-150 ease-in-out"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          {/* Modal Body */}
          <div className="mt-4">
            {/* Reason Field */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Reason for Return
              </label>
              <div className="mt-1 p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-800">
                {reason || "No reason provided."}
              </div>
            </div>

            {/* Media Display */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700">
                Uploaded Media
              </label>
              {media && media.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  {media.map((item, index) => (
                    <div
                      key={index}
                      className="relative w-full overflow-hidden rounded-lg shadow-md border border-gray-200"
                    >
                      {isImage(item) ? (
                        <img
                          src={item}
                          alt={`Uploaded media ${index + 1}`}
                          className="w-full h-auto object-cover"
                        />
                      ) : isVideo(item) ? (
                        <video controls className="w-full h-auto object-cover">
                          <source src={item} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <div className="flex items-center justify-center h-full p-4 text-center text-sm text-gray-500 bg-gray-100">
                          Unsupported file type.
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-2 text-sm text-gray-500">
                  No images or videos uploaded.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnListModal;
