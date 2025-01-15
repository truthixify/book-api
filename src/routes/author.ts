import express, { Request, Response, Router } from 'express';
import { body, validationResult } from 'express-validator';
import authMiddleware from "../middleware/auth";

import Author from '../models/Author';
import Book from '../models/Book';

const router: Router = express.Router();

// Create an Author
router.post('/',
    [
        body('name').isString().isLength({ min: 3 }).withMessage('Author name must be at least 3 characters long'),
        body('biography').isString().isLength({ max: 2000 }).withMessage('Biography must not exceed 2000 characters'),
    ],
    authMiddleware,
    async (req: Request, res: Response): Promise<any> => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name } = req.body;

        try {
            const existingAuthor = await Author.findOne({ name });
            if (existingAuthor) {
            return res.status(400).send('The author already exists');
            }

            const author = new Author({ ...req.body });
            await author.save();

            res.status(200).send(author);
        } catch (error) {
            res.status(500).send(error);
        }
});

// Update an Author
router.put('/:id',
    [
        body('name').isString().isLength({ min: 3 }).withMessage('Author name must be at least 3 characters long'),
        body('biography').isString().isLength({ max: 2000 }).withMessage('Biography must not exceed 2000 characters'),
    ],
    authMiddleware,
    async (req: Request, res: Response): Promise<any> => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const author = await Author.findById(req.params.id);
            if (!author) {
            return res.status(404).send('Author not found and cannot be updated');
            }

            const updatedAuthor = await Author.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
            res.status(200).send(updatedAuthor);
        } catch (error) {
            res.status(500).send(error);
        }
});

// Delete an Author
router.delete('/:id', 
    authMiddleware,
    async (req: Request, res: Response) => {
        try {
            await Author.findByIdAndDelete(req.params.id);
            res.status(200).send('The author has been deleted');
        } catch (error) {
            res.status(500).send(error);
        }
});

// Get an Author
router.get('/:id', async (req: Request, res: Response): Promise<any> => {
    try {
        const author = await Author.findById(req.params.id);
        if (!author) {
        return res.status(404).send("Author doesn't exist");
        }

        res.status(200).send(author);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Get all Authors
router.get('/', async (req: Request, res: Response) => {
    try {
        const authors = await Author.find().sort('-createdAt');
        res.status(200).send(authors);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Get all books by a specific author
router.get('/author/:authorId', async (req: Request, res: Response): Promise<any> => {
    const { authorId } = req.params;

    try {
        // Find all books where the author field matches the given authorId
        const books = await Book.find({ author: authorId })

        if (books.length === 0) {
            return res.status(404).send('No books found for this author');
        }

        res.status(200).send(books);
    } catch (error) {
        res.status(500).send(error);
    }
});
  

export default router;
