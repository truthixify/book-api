"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = verifyToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function verifyToken(req, res, next) {
    try {
        const token = req.header('x-auth-token');
        if (!token) {
            res.status(401).send('Provide a token');
            return;
        }
        // Verify the token and decode the payload
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SEC);
        // Add the decoded token to the request object
        req.user = decoded;
        next();
    }
    catch (ex) {
        res.status(401).send('Invalid token');
    }
}
