import React, { useEffect, useState } from "react";
import { MyButton } from "../../../utils/MyButton";
import { MdMenuBook, MdAdd, MdSearch } from "react-icons/md";

import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { LoadingGrid } from "../../../utils/LoadingSpinner";
import { useGetUserbooksQuery } from "./BookQuery";

import SingleBookItem from "./SingleBookItem";
import { BOOK_READING_CONSTANS } from "../../../constants";
import { useCookies } from "react-cookie";

const BookList = () => {
  const { data: books, isLoading } = useGetUserbooksQuery();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState(BOOK_READING_CONSTANS.All);
  const [searchParams, setSearchParams] = useSearchParams();
  const [cookies, setCookie] = useCookies(["bookshelfTab"]);
  const location = useLocation();

  const filteredBooks = books?.filter((book) => {
    // Filter by status if not "All"
    const statusMatches =
      activeFilter === "All" || book.status === activeFilter;

    // Filter by search query
    const searchMatches =
      searchQuery === "" ||
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());

    return statusMatches && searchMatches;
  });

  const statusCounts = {
    All: books?.length,
    "Want to Read": books?.filter((b) => b.status === "Want to Read")?.length,
    Reading: books?.filter((b) => b.status === "Reading")?.length,
    Completed: books?.filter((b) => b.status === "Completed")?.length,
  };

  const handleTabChange = (status) => {
    setActiveFilter(status);
    setSearchParams({ tab: status });
    setCookie("bookshelfTab", status, {
      path: "/",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      sameSite: "strict",
    });
  };

  // Initialize active filter from URL or cookie
  useEffect(() => {
    const tabFromUrl = searchParams.get("tab");
    const tabFromCookie = cookies.bookshelfTab;
    const validTabs = [
      BOOK_READING_CONSTANS.All,
      BOOK_READING_CONSTANS.WantToRead,
      BOOK_READING_CONSTANS.Reading,
      BOOK_READING_CONSTANS.Finished,
    ];

    // Priority 1: URL parameter
    if (tabFromUrl && validTabs.includes(tabFromUrl)) {
      setActiveFilter(tabFromUrl);
    }
    // Priority 2: Cookie
    else if (tabFromCookie && validTabs.includes(tabFromCookie)) {
      setActiveFilter(tabFromCookie);
      // Update URL to match cookie
      setSearchParams({ tab: tabFromCookie });
    }
    // Default: All
    else {
      setActiveFilter(BOOK_READING_CONSTANS.All);
      setSearchParams({ tab: BOOK_READING_CONSTANS.All });
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              My Reading List
            </h1>
            <p className="text-gray-600">
              Track your reading progress and organize your books
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <MyButton
              size="medium"
              variant="secondary"
              className="rounded-full flex items-center shadow-sm"
              onClick={() => navigate("book-form")}
            >
              <MdAdd className="mr-1" /> Add New Book
            </MyButton>
          </div>
        </header>

        {/* Search and filter bar */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MdSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Search by title or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex space-x-2 overflow-x-auto pb-1 no-scrollbar">
            {[
              BOOK_READING_CONSTANS.All,
              BOOK_READING_CONSTANS.WantToRead,
              BOOK_READING_CONSTANS.Reading,
              BOOK_READING_CONSTANS.Finished,
            ].map((status) => (
              <button
                key={status}
                onClick={() => handleTabChange(status)}
                className={`px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                  activeFilter === status
                    ? "bg-blue-100 text-blue-800"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                {status}
                <span className="ml-1 text-xs">{statusCounts[status]}</span>
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <LoadingGrid count={6} />
        ) : filteredBooks?.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <MdMenuBook className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              No books found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery
                ? "Try a different search term or filter"
                : "Add your first book to get started"}
            </p>
            <div className="mt-6">
              <MyButton
                size="medium"
                variant="secondary"
                className="rounded-full flex items-center mx-auto shadow-sm"
                onClick={() => navigate("book-form")}
              >
                <MdAdd className="mr-1" /> Add New Book
              </MyButton>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks?.map((book) => (
              <SingleBookItem book={book} key={book._id} />
            ))}
          </div>
        )}

        {filteredBooks?.length > 0 && (
          <div className="mt-8 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Showing {filteredBooks?.length}{" "}
              {filteredBooks?.length === 1 ? "book" : "books"}
              {books?.length !== filteredBooks?.length &&
                ` (filtered from ${books?.length})`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookList;
