"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Define the schema for the Book model
const bookSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        minlength: [3, 'Title must be at least 3 characters long'],
    },
    authorId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Author',
        rrequired: [true, 'Author is required'],
    },
    categoryIds: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Category",
            required: [true, 'At least one category is required'],
        }],
    description: {
        type: String,
        required: [true, 'Description is required']
    },
}, { timestamps: true });
// Export the Book model
const Book = (0, mongoose_1.model)('Book', bookSchema);
exports.default = Book;
