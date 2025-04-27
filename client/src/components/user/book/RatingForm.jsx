import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { MyButton } from '../../../utils/MyButton';

export const RatingForm = ({ 
  currentRating = 0,
  onSave,
  onCancel,
  isLoading = false
}) => {
  const [rating, setRating] = useState(currentRating);
  const [hover, setHover] = useState(null);

  return (
    <div>
      <div className="flex justify-center mb-6">
        {[...Array(5)].map((_, index) => {
          const ratingValue = index + 1;
          return (
            <label key={index} className="mx-1">
              <input
                type="radio"
                name="rating"
                value={ratingValue}
                onClick={() => setRating(ratingValue)}
                className="hidden"
              />
              <FaStar
                className="cursor-pointer"
                size={32}
                color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                onMouseEnter={() => setHover(ratingValue)}
                onMouseLeave={() => setHover(null)}
              />
            </label>
          );
        })}
      </div>

      <div className="flex justify-end space-x-3">
        <MyButton
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </MyButton>
        <MyButton
          onClick={() => onSave(rating)}
          disabled={isLoading || rating === 0}
          isLoading={isLoading}
        >
          Save Rating
        </MyButton>
      </div>
    </div>
  );
};