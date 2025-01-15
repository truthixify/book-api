import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface CustomRequest extends Request {
    user?: { 
      _id: string;
    };
}

export default function verifyToken(req: CustomRequest, res: Response, next: NextFunction): void {
    try {
        const token = req.header('x-auth-token');

        if (!token) {
            res.status(401).send('Provide a token');
            return;
        }

        // Verify the token and decode the payload
        const decoded = jwt.verify(token, process.env.JWT_SEC as string) as {_id: string };

        // Add the decoded token to the request object
        req.user = decoded;

        next();
    } catch (ex) {
        res.status(401).send('Invalid token');
    }
}
