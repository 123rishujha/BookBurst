const { UserBookModel } = require("../models/userBookModel");

// Add Book
const addBook = async (req, res) => {
  try {
    const {
      title,
      author,
      coverImage,
      description,
      status,
      rating,
      notes,
      isPublic,
      googleBookId,
    } = req.body;

    const newBook = new UserBookModel({
      user: req.user?._id,
      googleBookId: googleBookId || null,
      title,
      author,
      coverImage,
      description,
      status,
      rating,
      notes,
      isPublic: isPublic || false,
    });

    await newBook.save();
    res
      .status(201)
      .json({ success: true, msg: "Book added successfully", data: newBook });
  } catch (error) {
    let err = new Error("Failed to add book");
    err.statusCode = 500;
    return next(err);
  }
};

// Get Logged-in User's Books
const getUserBooks = async (req, res) => {
  try {
    const books = await UserBookModel.find({ user: req.user?._id });
    res.status(200).json({ success: true, msg: "", data: books });
  } catch (error) {
    let err = new Error("Failed to fetch books");
    err.statusCode = 500;
    return next(err);
  }
};

// Update Book
const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const book = await UserBookModel.findOne({
      _id: id,
      user: req.user?._id,
    });
    if (!book) {
      return res.status(404).json({ success: false, msg: "Book not found" });
    }

    Object.assign(book, updateData);
    await book.save();

    res
      .status(200)
      .json({ success: true, msg: "Book updated successfully", data: book });
  } catch (error) {
    const err = new Error("Failed to update book");
    err.statusCode = 500;
    return next(err);
  }
};

// Delete Book
const deleteBook = async (req, res, next) => {
  try {
    const { id } = req.params;

    const book = await UserBookModel.findOneAndDelete({
      _id: id,
      user: req.user?._id,
    });
    if (!book) {
      const err = new Error("Book not found or unauthorized");
      err.statusCode = 404;
      return next(err);
    }

    res.status(200).json({ success: true, msg: "Book deleted successfully" });
  } catch (error) {
    err.statusCode = 500;
    return next(err);
  }
};

// Get Public Books (Explore)
const getPublicBooks = async (req, res, next) => {
  try {
    const publicBooks = await UserBookModel.find({ isPublic: true }).populate(
      "user",
      "name"
    ); // Optional: Show user name

    res
      .status(200)
      .json({ msg: "Books Fetched", success: true, data: publicBooks });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  addBook,
  getUserBooks,
  updateBook,
  deleteBook,
  getPublicBooks,
};
