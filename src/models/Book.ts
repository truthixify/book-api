import mongoose, { Schema, Document, model } from "mongoose";

// Define an interface for the Book document
export interface BookInterface extends Document {
  title: string;
  author: mongoose.Types.ObjectId;
  categories: string[];
  description: string;
  publicationYear: number;
  isbn: string;
  image: string;
  url: string;
  cid: string;
}

// Define the schema for the Book model
const bookSchema = new Schema<BookInterface>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      minlength: [3, "Title must be at least 3 characters long"],
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "Author",
      required: [true, "Author is required"],
    },
    categories: {
      type: [String],
      ref: "Category",
      required: [true, "At least one category is required"],
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: "Categories array cannot be empty",
      },
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    publicationYear: {
      type: Number,
      required: [true, "Publication year is required"],
      min: [1000, "Publication year must be valid"],
      max: [
        new Date().getFullYear(),
        "Publication year cannot be in the future",
      ],
    },
    isbn: {
      type: String,
      required: [true, "ISBN is required"],
      unique: true,
      match: [/^\d{10}(\d{3})?$/, "ISBN must be a valid 10 or 13-digit number"],
    },
    image: {
      type: String,
      required: [true, "Image URL is required"],
      validate: {
        validator: function (value) {
          const imagePattern = /(http|https):\/\/.*\.(jpeg|jpg|png|gif)$/i;
          return imagePattern.test(value);
        },
        message:
          "Invalid image URL. Must be a valid URL ending with .jpg, .jpeg, .png, or .gif.",
      },
    },
    url: {
      type: String,
      required: [true, "Book URL is required"],
      validate: {
        validator: function (value) {
          const urlPattern = /^https?:\/\/[^\s/$.?#].[^\s]*$/;
          return urlPattern.test(value);
        },
        message: "Invalid book URL. Must be a valid HTTP/HTTPS URL.",
      },
    },
    cid: {
      type: String,
      required: [true, "CID is required"],
    },
  },
  { timestamps: true },
);

// Export the Book model
const Book = model<BookInterface>("Book", bookSchema);
export default Book;
