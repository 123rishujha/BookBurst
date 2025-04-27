const express = require("express");
const userBookRouter = express.Router();
const {
  addBook,
  getUserBooks,
  updateBook,
  deleteBook,
  getPublicBooks,
} = require("../controllers/userBookController");
const { authMiddleware } = require("../middlewares/authMiddleware");

// Authenticated User Routes
userBookRouter.post("/add", authMiddleware, addBook);
userBookRouter.get("/", authMiddleware, getUserBooks);
userBookRouter.put("/update/:id", authMiddleware, updateBook);
userBookRouter.delete("/delete/:id", authMiddleware, deleteBook);

// Public Route
userBookRouter.get("/public-books", getPublicBooks);

module.exports = {
  userBookRouter,
};
