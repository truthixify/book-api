import express, { Request, Response } from 'express';
import User from '../models/User';
import CryptoJS from 'crypto-js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// ROUTES

// CREATE A NEW USER
router.post('/register',
    [
        body('name').isString().isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
        body('email').isEmail().withMessage('Please provide a valid email address'),
        body('username').isString().isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
        body('password')
            .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
            .matches(/\d/).withMessage('Password must contain at least one number')
            .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
            .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
            .matches(/[@$!%*?&]/).withMessage('Password must contain at least one special character (@$!%*?&)'),
    ],
    async (req: Request, res: Response): Promise<any> => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const username = await User.findOne({ username: req.body.username });
        if (username) return res.status(400).send('User already exists. Please login');

        const email = await User.findOne({ email: req.body.email });
        if (email) return res.status(400).send('User already exists. Please login');

        const hashedPassword = CryptoJS.AES.encrypt(req.body.password, process.env.PASSWORD_SEC as string).toString();

        try {
            const author = new User({ ...req.body, password: hashedPassword });
            await author.save();
            const { password, ...others } = author.toObject();

            res.status(200).send(others);
        } catch (ex) {
            res.status(500).send(ex);
        }
});

// LOGIN USER
router.post('/login', async (req: Request, res: Response): Promise<any> => {
    try {
        const author = await User.findOne({ username: req.body.username });
        if (!author) return res.status(400).send('Invalid Login Credentials');

        const originalPassword = CryptoJS.AES.decrypt(author.password, process.env.PASSWORD_SEC as string).toString(CryptoJS.enc.Utf8);
        if (originalPassword !== req.body.password) return res.status(400).send('Invalid Login Credentials');

        const token = author.generateAuthToken();

        const { password, ...others } = author.toObject();

        res.header('x-auth-token', token).status(200).send({ ...others, token });
    } catch (ex) {
        res.status(500).send(ex);
    }
});

export default router;
