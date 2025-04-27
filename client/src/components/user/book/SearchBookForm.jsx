import React, { useState, useEffect, useCallback } from "react";
import { FiBook, FiX, FiSearch } from "react-icons/fi";

const SearchBookFrom = ({ onBookSelect }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  // Function to search Google Books API
  const performSearch = useCallback(async (query) => {
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
          query
        )}&maxResults=20`
      );
      const data = await response.json();
      setSearchResults(data.items || []);
    } catch (error) {
      console.error("Error searching books:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounce search input
  const debounceSearch = useCallback(
    debounce((query) => {
      if (query.trim()) {
        performSearch(query);
      }
    }, 500),
    [performSearch]
  );

  // Handle input changes with debouncing
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (!value.trim()) {
      clearSearch();
      return;
    }

    debounceSearch(value);
  };

  // Function to handle book selection
  const handleBookSelect = (book) => {
    if (onBookSelect) {
      onBookSelect(book);
    }
  };

  // Function to clear search
  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Search Bar */}
      <div className="relative">
        <label htmlFor="book-search" className="sr-only">
          Search for books
        </label>
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <FiBook className="text-indigo-500 h-5 w-5" />
        </div>
        <input
          id="book-search"
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder="Search for books by title, author or ISBN"
          className="block w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          aria-label="Search for books"
          autoComplete="off"
        />
        {searchQuery && (
          <button
            aria-label="Clear search"
            onClick={() => clearSearch()}
            className="absolute inset-y-0 right-0 flex items-center px-3"
          >
            <FiX className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {/* Loading State */}
      {isSearching && (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600 mb-2"></div>
          <p className="text-gray-600">Searching for books...</p>
        </div>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-800">
              Found {searchResults.length} book
              {searchResults.length !== 1 ? "s" : ""}
            </h3>
            <button
              onClick={() => clearSearch()}
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              Clear results
            </button>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {searchResults.map((book) => (
              <div
                key={book.id}
                className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 cursor-pointer transition-all flex items-start"
                onClick={() => handleBookSelect(book)}
                tabIndex="0"
                role="button"
                aria-label={`Select ${book.volumeInfo.title} by ${
                  book.volumeInfo.authors?.join(", ") || "Unknown author"
                }`}
                onKeyDown={(e) => e.key === "Enter" && handleBookSelect(book)}
              >
                <div className="flex-shrink-0 w-16 h-24 bg-gray-100 flex items-center justify-center rounded overflow-hidden mr-4">
                  {book.volumeInfo.imageLinks?.thumbnail ? (
                    <img
                      src={book.volumeInfo.imageLinks.thumbnail}
                      alt={`Cover of ${book.volumeInfo.title}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <FiBook className="text-gray-400 h-8 w-8" />
                  )}
                </div>

                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">
                    {book.volumeInfo.title}
                  </h4>
                  {book.volumeInfo.authors?.length > 0 && (
                    <p className="text-sm text-gray-600 mb-2">
                      by {book.volumeInfo.authors.join(", ")}
                    </p>
                  )}
                  {book.volumeInfo.publishedDate && (
                    <p className="text-xs text-gray-500">
                      Published:{" "}
                      {new Date(book.volumeInfo.publishedDate).getFullYear()}
                    </p>
                  )}
                  {book.volumeInfo.categories?.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {book.volumeInfo.categories
                        .slice(0, 2)
                        .map((category, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs bg-indigo-100 text-indigo-800 rounded-full"
                          >
                            {category}
                          </span>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Results State */}
      {!isSearching && searchQuery && searchResults.length === 0 && (
        <div className="text-center py-6 bg-gray-50 rounded-lg border border-gray-200">
          <FiSearch className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-800 mb-1">
            No books found
          </h3>
          <p className="text-gray-600">
            Try different keywords or check the spelling
          </p>
        </div>
      )}
    </div>
  );
};

// Debounce utility function
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

export default SearchBookFrom;
