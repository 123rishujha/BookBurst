const mongoose = require("mongoose");

const userBookSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    coverImage: { type: String },
    description: { type: String },
    status: {
      type: String,
      enum: ["Reading", "Finished", "Want to Read"],
      default: "Want to Read",
    },
    rating: { type: Number, min: 0, max: 5 },
    notes: { type: String },
    isPublic: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const UserBookModel = mongoose.model("userbook", userBookSchema);

module.exports = { UserBookModel };
