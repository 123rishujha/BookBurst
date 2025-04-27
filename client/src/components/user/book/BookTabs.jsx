import React from "react";
import Tabs from "../../../utils/Tabs";
import {
  HiOutlineBookOpen,
  HiOutlineBookmark,
  HiOutlineCheckCircle,
} from "react-icons/hi";
import { MyButton } from "../../../utils/MyButton";
import { IoIosAddCircle } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useGetUserbooksQuery } from "./BookQuery";
import BookList from "./BookList";
import { BOOK_READING_CONSTANS } from "../../../constants";

const BookTabs = () => {
  const { data: booksData, isLoading, isFetching } = useGetUserbooksQuery();

  console.log("akdjf booksData", booksData);

  const navigate = useNavigate();

  const tabsContent = [
    {
      label: "All Books",
      icon: <HiOutlineBookOpen />, // Reading 📖
      content: (
        <BookList books={booksData} isLoading={isLoading || isFetching} />
      ),
    },
    {
      label: "Reading",
      icon: <HiOutlineBookOpen />, // Reading 📖
      content: (
        <BookList
          books={booksData?.filter(
            (el) => el.status === BOOK_READING_CONSTANS.Reading
          )}
          isLoading={isLoading || isFetching}
        />
      ),
    },
    {
      label: "Want to Read",
      icon: <HiOutlineBookmark />, // Bookmark 🔖
      content: (
        <BookList
          books={booksData?.filter(
            (el) => el.status === BOOK_READING_CONSTANS.WantToRead
          )}
          isLoading={isLoading || isFetching}
        />
      ),
    },
    {
      label: "Finished",
      icon: <HiOutlineCheckCircle />, // Check ✅
      content: (
        <BookList
          books={booksData?.filter(
            (el) => el.status === BOOK_READING_CONSTANS.Finished
          )}
          isLoading={isLoading || isFetching}
        />
      ),
    },
  ];

  const handleTabChange = (index) => {
    console.log(`Tab changed to index ${index}`);
  };

  const handleCreateNew = () => {
    navigate("book-form");
  };

  return (
    <div className="p-4 space-y-8">
      <div className="w-[85%] m-auto">
        <div className="flex justify-end">
          <MyButton onClick={handleCreateNew}>
            <IoIosAddCircle /> New Book
          </MyButton>
        </div>
        <Tabs tabs={tabsContent} fullWidth={true} onChange={handleTabChange} />
      </div>
    </div>
  );
};

export default BookTabs;
