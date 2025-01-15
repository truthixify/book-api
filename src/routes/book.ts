import express, { Request, Response, Router } from 'express';
import { body, validationResult } from 'express-validator';
import queryMiddleware from '../middleware/query';
import authMiddleware from '../middleware/auth';

import Book from '../models/Book';
import Author from '../models/Author';
import Category from '../models/Category';

const router: Router = express.Router();

// Create a new book
router.post('/',
    [
        body('title').isString().isLength({ min: 3 }).withMessage('Title must be at least 3 characters long'),
        body('description').isString().withMessage("Description is required"),
        body('author').notEmpty().withMessage('Author ID is required.'),
        body('categories').isArray().withMessage("Categories must be an array").notEmpty().withMessage("Categories array cannot be empty"),
        body("publicationYear").notEmpty().withMessage("Publication year is required"),
        body('isbn').notEmpty().withMessage('ISBN is required.'),
    ],
    authMiddleware,
    async (req: Request, res: Response): Promise<any> => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, author, categories, description, isbn, publicationYear } = req.body;

        try {
            // Check if the author exists
            const findAuthor = await Author.findById(author);
            if (!findAuthor) {
                return res.status(400).send('Author not found');
            }

            // Check if the categories exist
            const categoriesList = await Category.find({ 'name': { $in: categories } });
            if (categoriesList.length !== categories.length) {
                return res.status(400).send('Some categories are not found');
            }

            // Create a new book
            const book = new Book({
                title,
                author,
                categories: categoriesList.map(cat => cat.name),
                description,
                isbn,
                publicationYear,
            });
            await book.save();

            // Add the book to the related categories
            await Category.updateMany(
                { 'name': { $in: categories } },
                { $push: { books: book._id } }
            );

            res.status(201).send(book);
        } catch (error) {
            res.status(500).send(error);
        }
});

// Get all books
router.get('/', 
    queryMiddleware,
    async (req: Request, res: Response) => {
        try {
            const { filters, sortOptions, pagination } = req.query;
            const parsedFilters = filters ? JSON.parse(filters as string) : {};
            const parsedSort = sortOptions ? JSON.parse(sortOptions as string) : {};
            const parsedPagination = pagination ? JSON.parse(pagination as string) : {};
            

            const books = await Book.find(parsedFilters)
                .sort(parsedSort)
                .skip(parsedPagination.skip)
                .limit(parsedPagination.limit);

            const total = await Book.countDocuments(parsedFilters);

            res.status(200).send({
                data: books,
                pagination: {
                total,
                page: Number(req.query.page) || 1,
                limit: parsedPagination.limit,
                totalPages: Math.ceil(total / parsedPagination.limit),
                },
            });
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
});

// Get details of a specific book
router.get('/:id', async (req: Request, res: Response): Promise<any> => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).send('Book not found');
        }
        res.status(200).send(book);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Update a book's details
router.put('/:id',
    [
        body('title').optional().isString().isLength({ min: 3 }).withMessage('Title must be at least 3 characters long'),
        body('description').optional().isString().withMessage("Description is required"),
        body('categories').optional().isArray().withMessage("Categories must be an array").notEmpty().withMessage("Categories array cannot be empty"),
        body("publicationYear").optional().notEmpty().withMessage("Publication year is required"),
        body('isbn').optional().notEmpty().withMessage('ISBN is required.'),
    ],
    authMiddleware,
    async (req: Request, res: Response): Promise<any> => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, author, categories, description, publicationYear, isbn } = req.body;

        try {
            const book = await Book.findById(req.params.id);
            if (!book) {
                return res.status(404).send('Book not found');
            }

            // Update the book details
            book.title = title || book.title;
            book.author = author ? author : book.author;
            book.categories = categories || book.categories;
            book.description = description || book.description;
            book.isbn = isbn || book.isbn;
            book.publicationYear = publicationYear || book.publicationYear;
            
            await book.save();

            res.status(200).send(book);
        } catch (error) {
            res.status(500).send(error);
        }
});

// Get all books in a specific category
router.get('/category/:categoryId', async (req: Request, res: Response): Promise<any> => {
    const { categoryId } = req.params;
  
    try {
      // Find all books where the categories field contains the given categoryId
      const books = await Book.find({ categories: categoryId });
  
      if (books.length === 0) {
        return res.status(404).send('No books found in this category');
      }
  
      res.status(200).send(books);
    } catch (error) {
      res.status(500).send(error);
    }
});

router.delete('/:id',
    authMiddleware,
    async (req: Request, res: Response) => {
        try {
            await Book.findByIdAndDelete(req.params.id);
            res.status(200).send('The book has been deleted');
        } catch (error) {
            res.status(500).send(error);
        }
})
  

export default router;
