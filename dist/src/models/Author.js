"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const jwt = require("jsonwebtoken");
// Define the schema for the User model
const authorSchema = new mongoose_1.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      minlength: [3, "Name must be at least 3 characters long"],
    },
    username: {
      type: String,
      unique: true,
      required: [true, "Username is required"],
      minlength: [3, "Username must be at least 3 characters long"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      validate: {
        validator: (v) => {
          // Regex to validate email format
          return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email address!`,
      },
    },
    password: {
      type: String,
      unique: true,
      required: [true, "Password is required"],
    },
  },
  { timestamps: true },
);
// Add the method for generating JWT
authorSchema.methods.generateAuthToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SEC);
};
// Export the Author model
const Author = (0, mongoose_1.model)("Author", authorSchema);
exports.default = Author;
