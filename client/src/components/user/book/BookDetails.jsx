import React from "react";
import {
  MdArrowBack,
  MdInfo,
  MdOutlineRateReview,
  MdEdit,
  MdDelete,
  MdCheck,
  MdPublic,
  MdLock,
} from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { useLocation, useNavigate } from "react-router-dom";

const BookDetails = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const book = state || {};

  const onBack = () => {
    navigate(-1);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      {/* Header with back button */}
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="p-2 rounded-full hover:bg-gray-100 mr-4"
          title="Back"
        >
          <MdArrowBack className="text-gray-600 text-xl" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Book Details</h1>
      </div>

      {/* Main content */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Book cover placeholder */}
        <div
          className="w-full md:w-1/3 flex-shrink-0 bg-gray-100 rounded-lg flex items-center justify-center"
          style={{ height: "320px" }}
        >
          {book.coverImage ? (
            <img
              src={book.coverImage}
              alt={`${book.title} cover`}
              className="w-full h-full object-contain rounded-lg"
            />
          ) : (
            <div className="text-gray-400 text-center p-4">
              <p className="text-lg">No cover image</p>
            </div>
          )}
        </div>

        {/* Book details */}
        <div className="flex-1">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-1">
              {book.title}
            </h2>
            <p className="text-xl text-gray-600 mb-4">by {book.author}</p>

            {/* Status badge */}
            <div
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-4"
              style={{
                backgroundColor:
                  book.status === "Want to Read"
                    ? "#FEF3C7"
                    : book.status === "Reading"
                    ? "#DBEAFE"
                    : "#D1FAE5",
                color:
                  book.status === "Want to Read"
                    ? "#92400E"
                    : book.status === "Reading"
                    ? "#1E40AF"
                    : "#065F46",
              }}
            >
              {book.status}
            </div>
          </div>

          {/* Rating section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Rating</h3>
            {book.rating > 0 ? (
              <div className="flex items-center">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={
                        i < book.rating ? "text-yellow-400" : "text-gray-300"
                      }
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="ml-2 text-gray-600">{book.rating}/5</span>
              </div>
            ) : (
              <p className="text-gray-500">Not rated yet</p>
            )}
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Description
            </h3>
            {book.description ? (
              <p className="text-gray-700 whitespace-pre-line">
                {book.description}
              </p>
            ) : (
              <p className="text-gray-500 italic">No description provided</p>
            )}
          </div>

          {/* Notes */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Notes</h3>
            {book.notes ? (
              <p className="text-gray-700 whitespace-pre-line">{book.notes}</p>
            ) : (
              <p className="text-gray-500 italic">No notes yet</p>
            )}
          </div>

          {/* Metadata */}
          <div className="text-sm text-gray-500 border-t pt-4">
            <div className="flex items-center mb-1">
              <span className="mr-2">Visibility:</span>
              {book.isPublic ? (
                <span className="flex items-center text-green-600">
                  <MdPublic className="mr-1" /> Public
                </span>
              ) : (
                <span className="flex items-center text-gray-600">
                  <MdLock className="mr-1" /> Private
                </span>
              )}
            </div>
            <p>Created: {new Date(book.createdAt).toLocaleDateString()}</p>
            <p>Last updated: {new Date(book.updatedAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      {/* <div className="mt-8 pt-4 border-t border-gray-200 flex justify-end space-x-3">
        <button
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center text-gray-700"
          title="Edit Book"
        >
          <CiEdit className="mr-2" />
          Edit
        </button>
        <button
          className="px-4 py-2 bg-purple-100 hover:bg-purple-200 rounded-full flex items-center text-purple-700"
          title={book.rating > 0 ? "Edit Rating" : "Rate Book"}
        >
          {book.rating > 0 ? (
            <MdEdit className="mr-2" />
          ) : (
            <MdOutlineRateReview className="mr-2" />
          )}
          {book.rating > 0 ? "Edit Rating" : "Rate Book"}
        </button>
        <button
          className="px-4 py-2 bg-red-100 hover:bg-red-200 rounded-full flex items-center text-red-700"
          title="Delete Book"
        >
          <MdDelete className="mr-2" />
          Delete
        </button>
      </div> */}
    </div>
  );
};

export default BookDetails;
