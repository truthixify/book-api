import mongoose, { Schema, Document, Model } from "mongoose";

// Define an interface for the Author document
export interface AuthorInterface extends Document {
  name: string;
  biography: string;
}

// Define the Author schema
const AuthorSchema: Schema<AuthorInterface> = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    biography: {
      type: String,
      maxlength: [2000, "Biography must not exceed 2000 characters"],
      trim: true,
    },
  },
  { timestamps: true },
);

// Export the Author model
const Author: Model<AuthorInterface> = mongoose.model<AuthorInterface>(
  "Author",
  AuthorSchema,
);

export default Author;
