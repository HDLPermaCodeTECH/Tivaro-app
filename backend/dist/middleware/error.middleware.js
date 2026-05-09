"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const zod_1 = require("zod");
const errorHandler = (err, req, res, next) => {
    if (err instanceof zod_1.ZodError) {
        const messages = err.issues.map((e) => e.message).join(', ');
        return res.status(400).json({
            error: messages,
            status: 400
        });
    }
    console.error(err.stack);
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    res.status(status).json({
        error: message,
        status
    });
};
exports.errorHandler = errorHandler;
