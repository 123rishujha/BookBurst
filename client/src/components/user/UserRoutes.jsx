import React from "react";
import { Route, Routes } from "react-router-dom";
import BookForm from "./book/BookForm";
// import BookTabs from "./book/BookTabs";
import BookList from "./book/BookList";
import BookDetails from "./book/BookDetails";

const UserRoutes = () => {
  return (
    <div className="bg-gray-50 mt-[100px]">
      <div className="px-4 md:px-8 lg:px-12 pb-12 mx-auto">
        <Routes>
          <Route path="/" element={<BookList />} />
          <Route path="book-form" element={<BookForm />} />
          <Route path="book/:bookId" element={<BookDetails />} />
        </Routes>
      </div>
    </div>
  );
};

export default UserRoutes;
