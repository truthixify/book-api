"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Define the schema for the Book model
const bookSchema = new mongoose_1.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose_1.Schema.Types.ObjectId,
      ref: "Author",
      required: true,
    },
    categories: [
      {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);
// Export the Book model
const Book = (0, mongoose_1.model)("Book", bookSchema);
exports.default = Book;
