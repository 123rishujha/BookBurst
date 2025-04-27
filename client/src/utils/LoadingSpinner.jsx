import React from "react";

const LoadingSpinner = ({ size = "medium", className = "" }) => {
  const sizes = {
    small: "h-6 w-6",
    medium: "h-8 w-8",
    large: "h-12 w-12",
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div
        className={`${
          sizes[size] || sizes.medium
        } animate-spin rounded-full border-4 border-solid border-blue-500 border-t-transparent`}
      ></div>
    </div>
  );
};

export const LoadingGrid = ({ count = 6, className = "" }) => {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}
    >
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div className="p-6 animate-pulse">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 bg-gray-200 w-16 h-24 rounded-md"></div>
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="h-4 w-4 bg-gray-200 rounded-full"
                    ></div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            </div>
            <div className="mt-4 flex justify-between">
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              <div className="h-6 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSpinner;
