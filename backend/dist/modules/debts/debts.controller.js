"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDebt = exports.addPayment = exports.createDebt = exports.getDebts = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const zod_1 = require("zod");
const createDebtSchema = zod_1.z.object({
    customer_id: zod_1.z.string().optional(),
    customer_name: zod_1.z.string().optional(),
    amount: zod_1.z.number().positive(),
    due_date: zod_1.z.string().optional(),
    notes: zod_1.z.string().optional(),
    sale_id: zod_1.z.string().optional(),
});
const paymentSchema = zod_1.z.object({
    amount: zod_1.z.number().positive(),
    payment_method: zod_1.z.string().default('CASH'),
});
const getDebts = async (req, res, next) => {
    try {
        const user_id = req.user.targetUserId;
        const debts = await prisma_1.default.debt.findMany({
            where: { user_id },
            include: {
                customer: { select: { name: true, phone: true } },
                payments: {
                    include: {
                        cashier: { select: { name: true } }
                    },
                    orderBy: { created_at: 'desc' }
                },
                sale: { include: { items: { include: { product: { select: { name: true } } } } } }
            },
            orderBy: { created_at: 'desc' },
        });
        res.json(debts);
    }
    catch (error) {
        next(error);
    }
};
exports.getDebts = getDebts;
const createDebt = async (req, res, next) => {
    try {
        const data = createDebtSchema.parse(req.body);
        const user_id = req.user.targetUserId;
        const debt = await prisma_1.default.debt.create({
            data: {
                user_id,
                customer_id: data.customer_id,
                customer_name: data.customer_name,
                amount: data.amount,
                remaining_amount: data.amount,
                due_date: data.due_date ? new Date(data.due_date) : null,
                notes: data.notes,
                sale_id: data.sale_id,
                status: 'PENDING'
            },
        });
        res.status(201).json(debt);
    }
    catch (error) {
        next(error);
    }
};
exports.createDebt = createDebt;
const addPayment = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { amount, payment_method } = paymentSchema.parse(req.body);
        const user_id = req.user.targetUserId;
        const cashier_id = req.user.userId;
        const debt = await prisma_1.default.debt.findUnique({
            where: { id, user_id },
        });
        if (!debt)
            return res.status(404).json({ error: 'Debt not found' });
        const newRemaining = debt.remaining_amount - amount;
        const status = newRemaining <= 0 ? 'PAID' : 'PARTIAL';
        const result = await prisma_1.default.$transaction(async (tx) => {
            // Create payment record with cashier_id
            await tx.debtPayment.create({
                data: {
                    debt_id: id,
                    amount,
                    payment_method,
                    cashier_id
                },
            });
            // Update debt record
            const updatedDebt = await tx.debt.update({
                where: { id },
                data: {
                    remaining_amount: Math.max(0, newRemaining),
                    status,
                },
            });
            // SYNC WITH SALE: If fully paid and has sale_id, update sale status
            if (status === 'PAID' && debt.sale_id) {
                await tx.sale.update({
                    where: { id: debt.sale_id },
                    data: { payment_status: 'PAID' }
                });
            }
            else if (status === 'PARTIAL' && debt.sale_id) {
                await tx.sale.update({
                    where: { id: debt.sale_id },
                    data: { payment_status: 'PARTIAL' }
                });
            }
            return updatedDebt;
        });
        res.json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.addPayment = addPayment;
const deleteDebt = async (req, res, next) => {
    try {
        const id = req.params.id;
        const user = req.user;
        // RESTRICTION: Only ADMIN can delete debt records
        if (user.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Only admins can delete debt records. Please contact the owner.' });
        }
        const user_id = user.targetUserId;
        await prisma_1.default.debtPayment.deleteMany({ where: { debt_id: id } });
        await prisma_1.default.debt.delete({ where: { id, user_id } });
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
};
exports.deleteDebt = deleteDebt;
