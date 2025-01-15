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
const Author_1 = __importDefault(require("../models/Author"));
const Book_1 = __importDefault(require("../models/Book"));
const router = express_1.default.Router();
// Create an Author
router.post('/', [
    (0, express_validator_1.body)('name').isString().isLength({ min: 3 }).withMessage('Author name must be at least 3 characters long'),
    (0, express_validator_1.body)('email').isEmail().withMessage('Please provide a valid email address'),
    (0, express_validator_1.body)('username').isString().isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { username } = req.body;
    try {
        const existingAuthor = yield Author_1.default.findOne({ username });
        if (existingAuthor) {
            return res.status(400).send('The author already exists');
        }
        const author = new Author_1.default(Object.assign({}, req.body));
        yield author.save();
        res.status(200).send(author);
    }
    catch (error) {
        res.status(500).send(error);
    }
}));
// Update an Author
router.put('/:id', [
    (0, express_validator_1.body)('name').isString().isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
    (0, express_validator_1.body)('email').isEmail().withMessage('Please provide a valid email address'),
    (0, express_validator_1.body)('username').isString().isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const author = yield Author_1.default.findById(req.params.id);
        if (!author) {
            return res.status(404).send('Author not found and cannot be updated');
        }
        const updatedAuthor = yield Author_1.default.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.status(200).send(updatedAuthor);
    }
    catch (error) {
        res.status(500).send(error);
    }
}));
// Delete an Author
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Author_1.default.findByIdAndDelete(req.params.id);
        res.status(200).send('The author has been deleted');
    }
    catch (error) {
        res.status(500).send(error);
    }
}));
// Get an Author
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const author = yield Author_1.default.findById(req.params.id);
        if (!author) {
            return res.status(404).send("Author doesn't exist");
        }
        res.status(200).send(author);
    }
    catch (error) {
        res.status(500).send(error);
    }
}));
// Get all Authors
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authors = yield Author_1.default.find().sort('-createdAt');
        res.status(200).send(authors);
    }
    catch (error) {
        res.status(500).send(error);
    }
}));
// Get all books by a specific author
router.get('/author/:authorId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { authorId } = req.params;
    try {
        // Find all books where the author field matches the given authorId
        const books = yield Book_1.default.find({ author: authorId });
        if (books.length === 0) {
            return res.status(404).send('No books found for this author');
        }
        res.status(200).send(books);
    }
    catch (error) {
        res.status(500).send(error);
    }
}));
exports.default = router;
