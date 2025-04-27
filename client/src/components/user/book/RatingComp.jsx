import React from "react";
import { FaStar } from "react-icons/fa";

export const StarRating = ({ rating, size = 15 }) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <FaStar
            key={index}
            color={ratingValue <= rating ? "#ffc107" : "#e4e5e9"}
            size={size}
          />
        );
      })}
      <span className="text-xs text-gray-500 ml-1">
        {rating > 0 ? `${rating}/5` : "Not rated"}
      </span>
    </div>
  );
};
