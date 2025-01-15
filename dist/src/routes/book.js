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
const express_validator_1 = require("express-validator");
const query_1 = __importDefault(require("../middleware/query"));
const auth_1 = __importDefault(require("../middleware/auth"));
const Book_1 = __importDefault(require("../models/Book"));
const Author_1 = __importDefault(require("../models/Author"));
const Category_1 = __importDefault(require("../models/Category"));
const router = express_1.default.Router();
// Create a new book
router.post('/', [
    (0, express_validator_1.body)('title').isString().isLength({ min: 3 }).withMessage('Title must be at least 3 characters long'),
    (0, express_validator_1.body)('description').isString().withMessage("Description is required"),
    (0, express_validator_1.body)('categoryIds').isArray().withMessage("Categories must be an array").notEmpty().withMessage("Categories array cannot be empty")
], auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { title, categoryIds, description } = req.body;
    const authorId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
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
            authorId: authorId,
            categoryIds: categoryIds,
            description,
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
// Get all books
router.get('/', query_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filters, sortOptions, pagination } = req.query;
        const parsedFilters = filters ? JSON.parse(filters) : {};
        const parsedSort = sortOptions ? JSON.parse(sortOptions) : {};
        const parsedPagination = pagination ? JSON.parse(pagination) : {};
        const books = yield Book_1.default.find(parsedFilters)
            .sort(parsedSort)
            .skip(parsedPagination.skip)
            .limit(parsedPagination.limit);
        const total = yield Book_1.default.countDocuments(parsedFilters);
        res.status(200).send({
            data: books,
            pagination: {
                total,
                page: Number(req.query.page) || 1,
                limit: parsedPagination.limit,
                totalPages: Math.ceil(total / parsedPagination.limit),
            },
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}));
// Get details of a specific book
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const book = yield Book_1.default.findById(req.params.id);
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
router.put('/:id', [
    (0, express_validator_1.body)('title').isString().isLength({ min: 3 }).withMessage('Title must be at least 3 characters long'),
    (0, express_validator_1.body)('description').isString().withMessage("Description is required"),
    (0, express_validator_1.body)('categoryIds').isArray().withMessage("Categories must be an array").notEmpty().withMessage("Categories array cannot be empty")
], auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { title, categoryIds, description } = req.body;
    const authorId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
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
        book.authorId = authorId ? authorId : book.authorId;
        book.categoryIds = categoryIds || book.categoryIds;
        book.description = description || book.description;
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
router.delete('/:id', auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Book_1.default.findByIdAndDelete(req.params.id);
        res.status(200).send('The book has been deleted');
    }
    catch (error) {
        res.status(500).send(error);
    }
}));
exports.default = router;
