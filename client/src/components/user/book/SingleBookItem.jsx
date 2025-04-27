import React, { useState } from "react";
import { Modal } from "../../../utils/Modal";
import { RatingForm } from "./RatingForm";
import { StarRating } from "./RatingComp";
import { BOOK_READING_CONSTANS } from "../../../constants";
import { CiEdit } from "react-icons/ci";
import {
  MdDelete,
  MdOutlineRateReview,
  MdBookmarkAdd,
  MdMenuBook,
  MdCheckCircle,
  MdAccessTime,
  MdLock,
  MdInfo,
  MdPublic,
  MdCheck,
  MdMoreVert,
} from "react-icons/md";

import { useBookUserOperationsMutation } from "./BookQuery";
import { useNavigate } from "react-router-dom";
import { MyButton } from "../../../utils/MyButton";

const SingleBookItem = ({ book }) => {
  const navigate = useNavigate();
  const [bookAPI, { isLoading: deleting }] = useBookUserOperationsMutation();
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [isRatingUpdating, setIsRatingUpdating] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await bookAPI({
          url: `/delete/${id}`,
          method: "DELETE",
          msz: true,
        });
      } catch (error) {
        console.error("Error deleting book:", error);
      }
    }
  };

  const handleSaveRating = async (newRating) => {
    try {
      setIsRatingUpdating(true);

      const response = await bookAPI({
        url: `/update/${book._id}`,
        method: "PUT",
        body: { rating: newRating },
        msz: true,
      });

      if (
        response.data?.status_code === 200 ||
        response.data?.status_code === 201
      ) {
        setIsRatingModalOpen(false);
      }
    } catch (error) {
      console.error("Error updating rating:", error);
    } finally {
      setIsRatingUpdating(false);
    }
  };

  const handleViewDetails = () => {
    navigate(`book/${book._id}`, { state: book });
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await bookAPI({
        url: `/update/${book._id}`,
        method: "PUT",
        body: { status: newStatus },
        msz: true,
      });
      setShowStatusDropdown(false);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleTogglePublic = async () => {
    try {
      await bookAPI({
        url: `/update/${book._id}`,
        method: "PUT",
        body: { isPublic: !book.isPublic },
        msz: true,
      });
    } catch (error) {
      console.error("Error updating visibility:", error);
    }
  };

  // Calculate how long ago the book was added
  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  const statusColors = {
    [BOOK_READING_CONSTANS.WantToRead]: {
      bg: "bg-blue-100",
      text: "text-blue-800",
      icon: <MdBookmarkAdd className="mr-1" />,
    },
    [BOOK_READING_CONSTANS.Reading]: {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      icon: <MdMenuBook className="mr-1" />,
    },
    [BOOK_READING_CONSTANS.Finished]: {
      bg: "bg-green-100",
      text: "text-green-800",
      icon: <MdCheckCircle className="mr-1" />,
    },
  };

  const statusColor = statusColors[book.status] || statusColors["Want to Read"];

  // Close dropdown when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (
        showStatusDropdown &&
        !event.target.closest(".status-dropdown-container")
      ) {
        setShowStatusDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showStatusDropdown]);

  return (
    <>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
        <div className="p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0 w-20 h-28 mr-4 rounded-md shadow-sm hover:shadow-md transition-shadow">
              {book.coverImage ? (
                <img
                  src={book.coverImage}
                  alt={`${book.title} cover`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex flex-col items-center justify-center">
                  <MdMenuBook className="text-gray-400 text-2xl" />
                  <span className="text-gray-500 text-xs text-center mt-1">
                    No cover
                  </span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h2
                  className="text-lg font-semibold text-gray-800 line-clamp-2 hover:text-blue-600 transition-colors cursor-pointer"
                  onClick={handleViewDetails}
                >
                  {book.title}
                </h2>
                <div className="flex items-center">
                  <span
                    className={`px-2 py-1 text-xs rounded-full flex items-center ${statusColor.bg} ${statusColor.text}`}
                  >
                    {statusColor.icon} {book.status}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-1 italic">
                by {book.author}
              </p>

              <div className="mt-3 flex items-center">
                <div className="flex items-center">
                  <StarRating rating={book.rating || 0} size={15} />
                </div>
              </div>
            </div>
          </div>

          {book.description && (
            <div className="mt-3">
              <p
                className={`text-sm text-gray-600 ${
                  showFullDescription ? "" : "line-clamp-2"
                }`}
              >
                {book.description}
              </p>
              {book.description?.length > 150 && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="text-xs text-blue-600 hover:text-blue-800 mt-1 focus:outline-none"
                >
                  {showFullDescription ? "Show less" : "Show more"}
                </button>
              )}
            </div>
          )}

          <div className="mt-4 flex justify-between items-center text-xs text-gray-500">
            <div className="flex items-center">
              <MdAccessTime className="mr-1" />
              <span title={formatDate(book.createdAt)}>
                Added: {getTimeAgo(book.createdAt)}
              </span>
            </div>
            <button
              onClick={handleTogglePublic}
              className={`px-2 py-1 rounded flex items-center transition-colors ${
                book.isPublic
                  ? "bg-green-100 text-green-800 hover:bg-green-200"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              {book.isPublic ? (
                <MdPublic className="mr-1" />
              ) : (
                <MdLock className="mr-1" />
              )}
              {book.isPublic ? "Public" : "Private"}
            </button>
          </div>
        </div>
        {/* icons  */}
        <div className="bg-gray-50 px-6 py-3 flex justify-between border-t border-gray-200">
          <div className="flex space-x-2">
            <MyButton
              size="small"
              variant="secondary"
              className="min-w-fit-content rounded-full hover:bg-gray-200"
              onClick={handleViewDetails}
              title="Details"
            >
              <MdInfo className="text-gray-600 hover:text-gray-800 text-lg" />
            </MyButton>

            {book.rating < 1 && (
              <MyButton
                size="small"
                variant="secondary"
                className="min-w-fit-content rounded-full hover:bg-purple-100"
                onClick={() => setIsRatingModalOpen(true)}
                title="Rate Now"
              >
                <MdOutlineRateReview className="text-purple-600 hover:text-purple-800 text-lg" />
              </MyButton>
            )}
            {/* <MyButton
                size="small"
                variant="secondary"
                className="min-w-fit-content rounded-full hover:bg-purple-100"
                onClick={() => setIsRatingModalOpen(true)}
                title="Edit Rating"
              >
                <MdEdit className="text-purple-600 hover:text-purple-800 text-lg" />
              </MyButton> */}

            {/* Status dropdown remains completely unchanged */}
            <div className="relative inline-block text-left status-dropdown-container">
              <MyButton
                size="small"
                variant="secondary"
                className="min-w-fit-content rounded-full hover:bg-yellow-100"
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                title="Status"
              >
                <MdMoreVert className="text-yellow-600 hover:text-yellow-800 text-lg mr-1" />
              </MyButton>

              {showStatusDropdown && (
                <div className="absolute right-0 z-10 w-40 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    {[
                      BOOK_READING_CONSTANS.WantToRead,
                      BOOK_READING_CONSTANS.Reading,
                      BOOK_READING_CONSTANS.Finished,
                    ].map((status) => (
                      <button
                        key={status}
                        className={`flex w-full items-center px-4 py-2 text-sm ${
                          book.status === status
                            ? "bg-gray-100 font-medium text-gray-900"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                        onClick={() => handleStatusChange(status)}
                        disabled={book.status === status}
                      >
                        {statusColors[status].icon}
                        {status}
                        {book.status === status && (
                          <MdCheck className="ml-auto" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <MyButton
              size="small"
              variant="secondary"
              className="min-w-fit-content rounded-full hover:bg-blue-100"
              onClick={() => navigate("book-form", { state: book })}
              title="Edit Book"
            >
              <CiEdit className="text-blue-600 hover:text-blue-800 text-lg" />
            </MyButton>

            <MyButton
              size="small"
              variant="secondary"
              className="min-w-fit-content rounded-full hover:bg-red-100"
              onClick={() => handleDelete(book._id)}
              disabled={deleting}
              isLoading={deleting}
              title="Delete Book"
            >
              {deleting ? (
                ""
              ) : (
                <MdDelete className="text-red-600 hover:text-red-800 text-lg" />
              )}
            </MyButton>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        title={`Rate "${book.title}"`}
        size="sm"
      >
        <RatingForm
          currentRating={book.rating || 0}
          onSave={handleSaveRating}
          onCancel={() => setIsRatingModalOpen(false)}
          isLoading={isRatingUpdating}
          bookTitle={book.title}
        />
      </Modal>
    </>
  );
};

export default SingleBookItem;
