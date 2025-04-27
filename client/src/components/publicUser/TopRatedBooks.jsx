import React, { useState, useEffect } from "react";
import { useGetPublicBooksQuery } from "../user/book/BookQuery";
import { FiBook, FiUser, FiStar, FiClock, FiSearch } from "react-icons/fi";
import { MdOutlineAutoAwesome } from "react-icons/md";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import { useSelector } from "react-redux";

const TopRatedBooks = () => {
  const { data: publicBooks, isLoading, isFetching } = useGetPublicBooksQuery();
  const { userState } = useSelector((s) => s.user);
  const [bookmarkedBooks, setBookmarkedBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [minRating, setMinRating] = useState(4); // Default minimum rating

  // Fetch user's bookmarks when component mounts or when user logs in
  useEffect(() => {
    if (userState) {
      // TODO: Replace with actual API call to fetch user's bookmarks
      // fetchUserBookmarks().then(bookmarks => setBookmarkedBooks(bookmarks));
    }
  }, [userState]);

  const handleBookmark = async (bookId) => {
    try {
      const isBookmarked = bookmarkedBooks.includes(bookId);

      if (isBookmarked) {
        // TODO: Replace with actual API call to remove bookmark
        // await removeBookmark(bookId);
        setBookmarkedBooks((prev) => prev.filter((id) => id !== bookId));
      } else {
        // TODO: Replace with actual API call to add bookmark
        // await addBookmark(bookId);
        setBookmarkedBooks((prev) => [...prev, bookId]);
      }
    } catch (error) {
      console.error("Bookmark operation failed:", error);
      // TODO: Add error toast/notification
    }
  };

  // Sort and filter books by rating and search term
  const filteredBooks = React.useMemo(() => {
    if (!publicBooks) return [];

    return publicBooks
      .filter((book) => {
        if (!book || typeof book.rating !== 'number') return false;
        
        // Filter by minimum rating
        if (book.rating < minRating) return false;
        
        // Filter by search term if present
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase();
          return (
            book.title?.toLowerCase().includes(searchLower) ||
            book.author?.toLowerCase().includes(searchLower) ||
            book.user?.name?.toLowerCase().includes(searchLower)
          );
        }
        
        return true;
      })
      .sort((a, b) => b.rating - a.rating); // Sort by rating (highest first)
  }, [publicBooks, searchTerm, minRating]);

  if (isLoading || isFetching) {
    return (
      <div className="flex justify-center items-center h-64 mt-[100px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary)]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] py-8 px-4 sm:px-6 lg:px-8 mt-[100px]">
      <div className="max-w-7xl mx-auto">
        {/* Header with Search and Filter */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start mb-2">
              <MdOutlineAutoAwesome className="text-4xl text-[var(--primary)] mr-3" />
              <h1 className="text-3xl font-extrabold text-[var(--text-primary)]">
                Top Rated Books
              </h1>
            </div>
            <p className="text-lg text-[var(--text-secondary)]">
              Discover the highest rated books from our community
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Rating Filter */}
            <div className="relative w-full sm:w-auto">
              <select
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="block w-full px-3 py-2 border border-[var(--text-secondary)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
              >
                <option value={0}>All Ratings</option>
                <option value={3}>3+ Stars</option>
                <option value={4}>4+ Stars</option>
                <option value={5}>5 Stars Only</option>
              </select>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-auto sm:min-w-[350px]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-[var(--text-secondary)]" />
              </div>
              <input
                type="text"
                placeholder="Search by title, author or owner..."
                className="block w-full pl-10 pr-3 py-2 border border-[var(--text-secondary)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Top Books Stats */}
        <div className="mb-6 bg-[var(--bg-primary)] rounded-lg p-4 shadow-md">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">
            Rating Distribution
          </h2>
          <div className="flex items-center justify-between gap-4">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = publicBooks?.filter(book => book.rating === rating).length || 0;
              const percentage = publicBooks?.length 
                ? Math.round((count / publicBooks.length) * 100) 
                : 0;
                
              return (
                <div key={rating} className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-[var(--text-primary)]">
                        {rating} {rating === 1 ? 'Star' : 'Stars'}
                      </span>
                    </div>
                    <span className="text-xs text-[var(--text-secondary)]">
                      {count} books
                    </span>
                  </div>
                  <div className="w-full bg-[var(--bg-secondary)] rounded-full h-2.5">
                    <div 
                      className="bg-[var(--primary)] h-2.5 rounded-full" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Books Grid */}
        {filteredBooks.length === 0 ? (
          <div className="text-center py-12">
            <FiBook className="mx-auto h-12 w-12 text-[var(--text-secondary)]" />
            <h3 className="mt-2 text-lg font-medium text-[var(--text-primary)]">
              {searchTerm
                ? "No matching top-rated books found"
                : `No books with ${minRating}+ star ratings available`}
            </h3>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              {searchTerm
                ? "Try a different search term or lower the rating filter"
                : "Try lowering the minimum rating to see more books"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredBooks.map((book) => (
              <div
                key={book._id}
                className="bg-[var(--bg-primary)] rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-[var(--bg-primary)] hover:border-[var(--primary)]"
              >
                {/* Book Cover */}
                <div className="h-48 bg-[var(--bg-secondary)] flex items-center justify-center relative">
                  {book.coverImage ? (
                    <img
                      src={book.coverImage}
                      alt={`${book.title} cover`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-4">
                      <FiBook className="mx-auto h-16 w-16 text-[var(--text-secondary)]" />
                      <p className="mt-2 text-sm text-[var(--text-secondary)]">
                        No cover image
                      </p>
                    </div>
                  )}

                  {/* Bookmark Button */}
                  <button
                    onClick={() => userState && handleBookmark(book._id)}
                    className={`absolute top-2 right-2 p-2 rounded-full transition-colors ${
                      userState
                        ? "hover:bg-[var(--bg-secondary)]"
                        : "cursor-default"
                    }`}
                    title={
                      userState
                        ? bookmarkedBooks.includes(book._id)
                          ? "Remove from collection"
                          : "Add to collection"
                        : "Login to bookmark"
                    }
                  >
                    {bookmarkedBooks.includes(book._id) ? (
                      <FaBookmark className="text-[var(--primary)] text-lg" />
                    ) : (
                      <FaRegBookmark
                        className={`text-lg ${
                          userState
                            ? "text-[var(--text-secondary)]"
                            : "text-[var(--text-secondary)] opacity-50"
                        }`}
                      />
                    )}
                  </button>
                  
                  {/* Rating Badge for Top Books */}
                  {book.rating >= 4.5 && (
                    <div className="absolute top-2 left-2 bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-semibold flex items-center">
                      <FiStar className="mr-1 fill-current" />
                      Top Rated
                    </div>
                  )}
                </div>

                {/* Book Details */}
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-[var(--text-primary)] line-clamp-1">
                        {book.title}
                      </h3>
                      <p className="text-sm text-[var(--text-secondary)]">
                        by {book.author}
                      </p>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="mt-3 flex items-center">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <FiStar
                          key={i}
                          className={`h-4 w-4 ${
                            i < book.rating
                              ? "text-yellow-400 fill-current"
                              : "text-[var(--text-secondary)]"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-[var(--text-secondary)]">
                      {book.rating > 0 ? `${book.rating}/5` : "Not rated"}
                    </span>
                  </div>

                  {/* Owner & Date */}
                  <div className="mt-4 flex justify-between items-center text-sm text-[var(--text-secondary)]">
                    <div className="flex items-center">
                      <FiUser className="mr-1" />
                      <span>{book.user?.name || "Unknown"}</span>
                    </div>
                    <div className="flex items-center">
                      <FiClock className="mr-1" />
                      <span>
                        {new Date(book.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopRatedBooks;