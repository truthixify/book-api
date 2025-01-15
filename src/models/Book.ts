import mongoose, { Schema, Document, model } from 'mongoose';

// Define an interface for the Book document
export interface BookInterface extends Document {
    title: string;
    author: mongoose.Types.ObjectId;
    categories: string[];
    description: string;
    publicationYear: number;
    isbn: string;
}

// Define the schema for the Book model
const bookSchema = new Schema<BookInterface>(
  {
    title: {
        type: String,
        required: [true, 'Title is required'],
        minlength: [3, 'Title must be at least 3 characters long'],
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'Author',
        required: [true, 'Author is required'],
    },
    categories: {
        type: [String],
        ref: "Category",
        required: [true, 'At least one category is required'],
        validate: {
            validator: (v: string[]) => v.length > 0,
            message: "Categories array cannot be empty",
        },
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    publicationYear: {
        type: Number,
        required: [true, "Publication year is required"],
        min: [1000, "Publication year must be valid"],
        max: [new Date().getFullYear(), "Publication year cannot be in the future"],
      },
      isbn: {
        type: String,
        required: [true, "ISBN is required"],
        unique: true,
        match: [/^\d{10}(\d{3})?$/, "ISBN must be a valid 10 or 13-digit number"],
      },
  },
  { timestamps: true }
);

// Export the Book model
const Book = model<BookInterface>('Book', bookSchema);
export default Book;
