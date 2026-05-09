"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteExpense = exports.updateExpense = exports.createExpense = exports.getExpenses = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const zod_1 = require("zod");
const expenseSchema = zod_1.z.object({
    description: zod_1.z.string(),
    amount: zod_1.z.number().positive(),
    category: zod_1.z.string().default('General'),
    date: zod_1.z.string().optional(),
});
const getExpenses = async (req, res, next) => {
    try {
        const expenses = await prisma_1.default.expense.findMany({
            where: { user_id: req.user.targetUserId },
            orderBy: { created_at: 'desc' },
        });
        res.json(expenses);
    }
    catch (error) {
        next(error);
    }
};
exports.getExpenses = getExpenses;
const createExpense = async (req, res, next) => {
    try {
        if (req.user.role === 'STAFF')
            return res.status(403).json({ error: 'Staff cannot manage expenses.' });
        const data = expenseSchema.parse(req.body);
        const expense = await prisma_1.default.expense.create({
            data: {
                ...data,
                date: data.date ? new Date(data.date) : new Date(),
                user_id: req.user.targetUserId,
            },
        });
        res.status(201).json(expense);
    }
    catch (error) {
        next(error);
    }
};
exports.createExpense = createExpense;
const updateExpense = async (req, res, next) => {
    try {
        if (req.user.role === 'STAFF')
            return res.status(403).json({ error: 'Staff cannot manage expenses.' });
        const { id } = req.params;
        const data = expenseSchema.partial().parse(req.body);
        const expense = await prisma_1.default.expense.update({
            where: { id: id, user_id: req.user.targetUserId },
            data: {
                ...data,
                date: data.date ? new Date(data.date) : undefined,
            },
        });
        res.json(expense);
    }
    catch (error) {
        next(error);
    }
};
exports.updateExpense = updateExpense;
const deleteExpense = async (req, res, next) => {
    try {
        if (req.user.role === 'STAFF')
            return res.status(403).json({ error: 'Staff cannot manage expenses.' });
        const { id } = req.params;
        await prisma_1.default.expense.delete({
            where: { id: id, user_id: req.user.targetUserId },
        });
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
};
exports.deleteExpense = deleteExpense;
