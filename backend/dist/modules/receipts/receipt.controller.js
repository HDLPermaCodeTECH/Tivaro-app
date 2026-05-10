"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReceipt = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const getReceipt = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user_id = req.user.targetUserId;
        const sale = await prisma_1.default.sale.findFirst({
            where: { id: id, user_id },
            include: {
                user: {
                    select: {
                        business_name: true,
                        business_address: true,
                        business_phone: true,
                        business_logo: true,
                        receipt_footer: true
                    }
                },
                receipt: true,
                debt: {
                    include: {
                        payments: {
                            orderBy: { date: 'desc' }
                        }
                    }
                },
                customer: {
                    select: { name: true }
                },
                cashier: {
                    select: { name: true, email: true, role: true }
                },
                items: {
                    include: {
                        product: {
                            select: { name: true }
                        }
                    }
                }
            },
        });
        if (!sale) {
            return res.status(404).json({ error: 'Receipt not found' });
        }
        res.json(sale);
    }
    catch (error) {
        next(error);
    }
};
exports.getReceipt = getReceipt;
