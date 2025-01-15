"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Book_1 = __importDefault(require("../models/Book"));
const Author_1 = __importDefault(require("../models/Author"));
const Category_1 = __importDefault(require("../models/Category"));
const router = express_1.default.Router();
// Create a new book
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, authorId, categoryIds, description, publishedDate } = req.body;
    try {
        // Check if the author exists
        const author = yield Author_1.default.findById(authorId);
        if (!author) {
            return res.status(400).send('Author not found');
        }
        // Check if the categories exist
        const categories = yield Category_1.default.find({ '_id': { $in: categoryIds } });
        if (categories.length !== categoryIds.length) {
            return res.status(400).send('Some categories are not found');
        }
        // Create a new book
        const book = new Book_1.default({
            title,
            author: authorId,
            categories: categoryIds,
            description,
            publishedDate,
        });
        yield book.save();
        // Add the book to the related categories
        yield Category_1.default.updateMany({ '_id': { $in: categoryIds } }, { $push: { books: book._id } });
        res.status(201).send(book);
    }
    catch (error) {
        res.status(500).send(error);
    }
}));
// Get all books with populated author and categories
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const books = yield Book_1.default.find();
        res.status(200).send(books);
    }
    catch (error) {
        res.status(500).send(error);
    }
}));
// Get details of a specific book
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const book = yield Book_1.default.findById(req.params.id).populate('author').populate('categories');
        if (!book) {
            return res.status(404).send('Book not found');
        }
        res.status(200).send(book);
    }
    catch (error) {
        res.status(500).send(error);
    }
}));
// Update a book's details
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, authorId, categoryIds, description, publishedDate } = req.body;
    try {
        const book = yield Book_1.default.findById(req.params.id);
        if (!book) {
            return res.status(404).send('Book not found');
        }
        // Check if the author exists
        const author = yield Author_1.default.findById(authorId);
        if (!author) {
            return res.status(400).send('Author not found');
        }
        // Check if the categories exist
        const categories = yield Category_1.default.find({ '_id': { $in: categoryIds } });
        if (categories.length !== categoryIds.length) {
            return res.status(400).send('Some categories are not found');
        }
        // Update the book details
        book.title = title || book.title;
        book.author = authorId || book.author;
        book.categories = categoryIds || book.categories;
        book.description = description || book.description;
        book.publishedDate = publishedDate || book.publishedDate;
        yield book.save();
        // Add the book to the related categories (if new categories are added)
        yield Category_1.default.updateMany({ '_id': { $in: categoryIds } }, { $addToSet: { books: book._id } });
        res.status(200).send(book);
    }
    catch (error) {
        res.status(500).send(error);
    }
}));
// Get all books in a specific category
router.get('/category/:categoryId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { categoryId } = req.params;
    try {
        // Find all books where the categories field contains the given categoryId
        const books = yield Book_1.default.find({ categories: categoryId });
        if (books.length === 0) {
            return res.status(404).send('No books found in this category');
        }
        res.status(200).send(books);
    }
    catch (error) {
        res.status(500).send(error);
    }
}));
exports.default = router;
