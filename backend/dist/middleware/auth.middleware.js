"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../config/prisma"));
const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'fallback-secret');
        // Check if user still exists in database
        const user = await prisma_1.default.user.findUnique({
            where: { id: decoded.userId }
        });
        if (!user) {
            return res.status(401).json({ error: 'User account has been deleted' });
        }
        // Check if user is suspended
        if (user.is_suspended) {
            return res.status(403).json({ error: 'Your account has been suspended' });
        }
        decoded.role = decoded.role || 'ADMIN';
        req.user = decoded;
        req.user.targetUserId = decoded.role === 'STAFF' ? decoded.ownerId : decoded.userId;
        next();
    }
    catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};
exports.authenticate = authenticate;
